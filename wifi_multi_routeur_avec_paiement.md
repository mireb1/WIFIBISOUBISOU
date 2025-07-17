
# Configuration d’un réseau WiFi multi-routeurs avec paiement

## 1. Topologie Réseau

```
INTERNET
   │
[Routeur Principal]
   ├── NAT + DHCP (192.168.1.1)
   ├── VLAN 10 (Accès client)
   └── VLAN 20 (Admin / Réseau privé)
         │
     ┌──┴──┐
     │     │
[Routeur A] [Routeur B]
 (Bridge/AP Mode - Pas de NAT)
```

## 2. Paramétrage IP et DHCP

| Appareil         | IP fixe             | Rôle                            |
|------------------|---------------------|----------------------------------|
| Routeur principal| 192.168.1.1         | NAT, DHCP, VLAN, Portail Captif |
| Routeur A        | 192.168.1.2         | AP client VLAN 10               |
| Routeur B        | 192.168.1.3         | AP client VLAN 10               |

- Routeur principal : DHCP activé (plage 192.168.1.100–192.168.1.200)
- Routeurs secondaires : DHCP désactivé
- Mode Bridge / Access Point pour éviter conflit d’IP ou double NAT

## 3. Sécurité WiFi (WPA2/WPA3 + Filtrage MAC)

- WPA3-PSK si disponible, sinon WPA2-AES
- Activer le filtrage MAC sur les AP secondaires (Routeur A/B)
- SSID masqué pour VLAN admin
- Isoler clients (client isolation ON sur AP)

## 4. Segmentation VLAN / Sous-réseaux

- VLAN 10 : Accès public client (WiFi) → 192.168.10.0/24
- VLAN 20 : Admin → 192.168.20.0/24
- Règles de pare-feu : VLAN 10 n’accède pas à VLAN 20

## 5. QoS / WMM (priorité)

- Activer WMM sur tous les AP
- Paramétrer QoS sur le routeur principal :
  - Haute priorité : ports 443 (HTTPS), 80 (paiement)
  - Moyenne priorité : streaming (ports 554, 1935)
  - Faible priorité : téléchargements, jeux, torrents

## 6. Transfert de ports

Exemple :
- Port externe : 443 → IP locale : 192.168.20.50 → Port interne : 443 (TCP)

## 7. NAT et double NAT

- NAT activé uniquement sur routeur principal
- Routeurs intermédiaires en mode Bridge/AP

## 8. Système de paiement avec portail captif

1. Portail captif : CoovaChilli, pfSense, OpenWRT + Nodogsplash
2. Fonction :
   - Redirection vers page de paiement
   - Paiement via Orange Money, M-Pesa, PayPal
   - Autorisation MAC/IP après paiement

3. Besoin :
   - Serveur local (192.168.1.X)
   - Liste blanche vers services de paiement

## 9. Contrôle d’accès

- Pare-feu : bloquer ports inutiles (21, 23, 445)
- VLAN public interdit d’atteindre VLAN privé
- Déconnexion après inactivité

## 10. Exemple iptables

```bash
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to 192.168.1.50:80
iptables -A FORWARD -m mac --mac-source <MAC_ADDRESS_PAYÉ> -j ACCEPT
```
