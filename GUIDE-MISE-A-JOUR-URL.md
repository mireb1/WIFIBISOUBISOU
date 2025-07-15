# 🌐 Guide de Mise à Jour de l'URL - WiFi Bisou Bisou

## 🎯 Objectif
Configurer et mettre à jour l'URL de votre application WiFi Bisou Bisou pour la production.

## 📋 URL Actuelle
- **Développement** : `http://localhost:8000`
- **Production** : À configurer selon vos besoins

## 🛠️ Méthodes de Mise à Jour

### **Méthode 1 : Script Automatique (Recommandée)**
```bash
# Exécuter le script de mise à jour
./update-url.sh
```

Le script vous proposera :
1. `wifibisoubisou.com`
2. `wifi-bisou-bisou.cd`
3. `monwifi.cd`
4. URL personnalisée
5. Garder localhost

### **Méthode 2 : Modification Manuelle**

#### 1. **Modifier `url-config.js`**
```javascript
production: {
    baseUrl: 'https://votre-domaine.com',
    apiUrl: 'https://api.votre-domaine.com',
    paymentUrl: 'https://payment.flexpaie.com',
    websocketUrl: 'wss://votre-domaine.com/ws',
    assetsUrl: 'https://cdn.votre-domaine.com/assets'
}
```

#### 2. **Modifier `manifest.json`**
```json
{
    "start_url": "https://votre-domaine.com",
    "scope": "https://votre-domaine.com"
}
```

#### 3. **Modifier `environment-config.js`**
```javascript
production: {
    showDemoPanel: false,
    enableDebugLogs: false,
    apiUrl: 'https://api.votre-domaine.com',
    allowTestPayments: false,
    autoLoadDemoData: false
}
```

## 🚀 Déploiement

### **Option 1 : Hébergement Web Classique**
1. Uploadez tous les fichiers sur votre serveur web
2. Configurez votre nom de domaine
3. Installez un certificat SSL
4. Testez l'application

### **Option 2 : Services Cloud**
- **GitHub Pages** : Gratuit pour les projets publics
- **Netlify** : Déploiement automatique depuis GitHub
- **Vercel** : Optimisé pour les applications web
- **Firebase Hosting** : Hébergement par Google

### **Option 3 : Serveur VPS (Congo/RDC)**
- **SCPT** : Société Congolaise des Postes et Télécommunications
- **Airtel Congo** : Services d'hébergement
- **Vodacom Congo** : Solutions d'hébergement

## 🔧 Configuration DNS

### **Enregistrements DNS Requis**
```
A       votre-domaine.com       → IP_DE_VOTRE_SERVEUR
CNAME   www                     → votre-domaine.com
CNAME   api                     → votre-domaine.com
CNAME   cdn                     → votre-domaine.com
```

## 📱 Test de l'Application

### **Vérifications Post-Déploiement**
1. **Accessibilité** : L'URL fonctionne-t-elle ?
2. **HTTPS** : Le certificat SSL est-il actif ?
3. **Responsive** : Fonctionne sur mobile ?
4. **Vouchers** : La génération fonctionne-t-elle ?
5. **Paiement** : L'intégration Flexpaie est-elle opérationnelle ?

### **Commandes de Test**
```bash
# Test de connectivité
curl -I https://votre-domaine.com

# Test de l'API
curl https://api.votre-domaine.com/health

# Test SSL
openssl s_client -connect votre-domaine.com:443
```

## 🔐 Sécurité

### **Recommandations**
1. **HTTPS obligatoire** pour toutes les transactions
2. **Certificat SSL** valide et à jour
3. **Firewall** configuré correctement
4. **Sauvegardes** régulières des données
5. **Monitoring** des performances

## 🌍 Exemples d'URLs Congolaises

### **Noms de Domaine .CD**
- `wifibisoubisou.cd`
- `wifi-rdc.cd`
- `monwifi.cd`
- `wifikinshasa.cd`

### **Noms de Domaine Internationaux**
- `wifibisoubisou.com`
- `wifi-bisou-bisou.net`
- `bisouwifi.org`

## 🆘 Dépannage

### **Problèmes Courants**
1. **404 Not Found** : Vérifiez la configuration du serveur
2. **SSL Error** : Installez/renouvelez le certificat
3. **API Non Accessible** : Vérifiez la configuration CORS
4. **Paiement Échoué** : Vérifiez les clés Flexpaie

### **Logs à Vérifier**
- Logs du serveur web
- Logs de l'application
- Console du navigateur
- Logs de paiement

## 📞 Support

Pour toute assistance :
- **Développeur** : Configuration technique
- **Flexpaie** : Intégration des paiements
- **Hébergeur** : Configuration serveur/DNS

---

**✅ Votre application WiFi Bisou Bisou est prête pour la production !**
