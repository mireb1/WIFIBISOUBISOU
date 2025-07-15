# 🌐 Configuration URL : wifibisoubisou.com

## ✅ URL de Production Configurée

Votre application **WiFi Bisou Bisou** est maintenant configurée pour l'URL de production :

**🎯 URL Principale : https://wifibisoubisou.com**

## 📋 URLs Configurées

### URLs Principales
- **Site Web** : https://wifibisoubisou.com
- **API** : https://api.wifibisoubisou.com
- **Administration** : https://admin.wifibisoubisou.com
- **Support** : https://support.wifibisoubisou.com
- **CDN** : https://cdn.wifibisoubisou.com

### URLs de Service
- **WebSocket** : wss://wifibisoubisou.com/ws
- **Paiement** : https://payment.flexpaie.com
- **Callbacks** : https://wifibisoubisou.com/payment/callback

## 🛠️ Fichiers Configurés

### 1. **Configuration Principale**
- `production-config.js` : Configuration complète pour la production
- `url-config.js` : Gestion des URLs par environnement
- `manifest.json` : Manifeste PWA mis à jour

### 2. **Configuration des Zones WiFi**
- **Zone Centre-Ville** : WiFi-Bisou-Bisou-Centre
- **Zone Université** : WiFi-Bisou-Bisou-Uni
- **Zone Marché** : WiFi-Bisou-Bisou-Marche

### 3. **Configuration des Forfaits**
- **Basique** : 500 FC - 1 heure
- **Premium** : 1500 FC - 6 heures
- **Journalier** : 3000 FC - 24 heures

## 🚀 Déploiement

### Script de Déploiement Automatique
```bash
./deploy-wifibisoubisou.sh
```

Ce script :
- ✅ Vérifie les prérequis
- ✅ Crée une sauvegarde
- ✅ Prépare les fichiers de production
- ✅ Minifie les ressources
- ✅ Configure les URLs
- ✅ Déploie vers le serveur

### Déploiement Manuel
1. **Télécharger tous les fichiers** vers votre serveur web
2. **Pointer le domaine** wifibisoubisou.com vers votre serveur
3. **Configurer HTTPS** (certificat SSL)
4. **Tester l'application**

## 🔧 Configuration Serveur

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx
```nginx
server {
    listen 80;
    server_name wifibisoubisou.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name wifibisoubisou.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Sécurité

### Fonctionnalités Activées
- ✅ **HTTPS obligatoire**
- ✅ **HSTS (HTTP Strict Transport Security)**
- ✅ **CSP (Content Security Policy)**
- ✅ **Protection XSS**
- ✅ **Protection CSRF**

### Timeouts
- **Session** : 30 minutes
- **Voucher** : Selon le forfait
- **Tentatives de connexion** : 3 maximum

## 📱 Application PWA

### Fonctionnalités
- ✅ **Installation sur mobile**
- ✅ **Mode hors ligne**
- ✅ **Notifications push**
- ✅ **Icônes optimisées**

### URLs PWA
- **Start URL** : https://wifibisoubisou.com/
- **Scope** : https://wifibisoubisou.com/

## 💳 Paiement Flexpaie

### Configuration
- **Merchant ID** : WIFI_BISOU_BISOU_RDC
- **Devise** : CDF (Franc Congolais)
- **URL de succès** : https://wifibisoubisou.com/payment/success
- **URL d'annulation** : https://wifibisoubisou.com/payment/cancel

## 📊 Monitoring

### URLs de Monitoring
- **Logs** : https://logs.wifibisoubisou.com
- **Métriques** : https://metrics.wifibisoubisou.com
- **Status** : https://status.wifibisoubisou.com

## 🌍 Informations Régionales

### Localisation
- **Pays** : République Démocratique du Congo (CD)
- **Fuseau horaire** : Africa/Kinshasa
- **Langue** : Français (fr)
- **Devise** : Franc Congolais (CDF)

## 📞 Support

### Contacts
- **Email** : support@wifibisoubisou.com
- **Téléphone** : +243 XXX XXX XXX
- **Chat** : https://wifibisoubisou.com/support

## 🔄 Mise à Jour

Pour mettre à jour la configuration :
1. Modifier les fichiers de configuration
2. Exécuter le script de déploiement
3. Tester les modifications
4. Valider en production

---

**✅ Configuration terminée ! Votre application est prête pour wifibisoubisou.com**
