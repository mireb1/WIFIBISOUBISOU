// Configuration de production pour wifibisoubisou.com
// Fichier généré automatiquement le 15 juillet 2025

const ProductionConfig = {
    // URL principale de production
    baseUrl: 'https://wifibisoubisou.com',
    
    // URLs des services
    services: {
        api: 'https://api.wifibisoubisou.com',
        admin: 'https://admin.wifibisoubisou.com',
        support: 'https://support.wifibisoubisou.com',
        cdn: 'https://cdn.wifibisoubisou.com',
        websocket: 'wss://wifibisoubisou.com/ws'
    },
    
    // Configuration du paiement
    payment: {
        flexpaie: {
            production: 'https://payment.flexpaie.com',
            merchantId: 'WIFI_BISOU_BISOU_RDC',
            currency: 'CDF', // Franc Congolais
            callbackUrl: 'https://wifibisoubisou.com/payment/callback',
            successUrl: 'https://wifibisoubisou.com/payment/success',
            cancelUrl: 'https://wifibisoubisou.com/payment/cancel'
        }
    },
    
    // Configuration des zones WiFi
    wifiZones: {
        'zone-centre-ville': {
            name: 'Zone Centre-Ville',
            location: 'Avenue Kasa-Vubu, Kinshasa',
            ssid: 'WiFi-Bisou-Bisou-Centre',
            maxUsers: 100
        },
        'zone-universite': {
            name: 'Zone Université',
            location: 'Campus UNIKIN',
            ssid: 'WiFi-Bisou-Bisou-Uni',
            maxUsers: 150
        },
        'zone-marche': {
            name: 'Zone Marché Central',
            location: 'Marché Central, Kinshasa',
            ssid: 'WiFi-Bisou-Bisou-Marche',
            maxUsers: 80
        }
    },
    
    // Configuration des forfaits
    plans: {
        basic: {
            name: 'Forfait Basique',
            price: 500, // FC
            duration: 3600, // 1 heure en secondes
            speed: '1 Mbps',
            description: '1 heure de connexion, vitesse standard'
        },
        premium: {
            name: 'Forfait Premium',
            price: 1500, // FC
            duration: 21600, // 6 heures en secondes
            speed: '5 Mbps',
            description: '6 heures de connexion, vitesse élevée'
        },
        daily: {
            name: 'Forfait Journalier',
            price: 3000, // FC
            duration: 86400, // 24 heures en secondes
            speed: '10 Mbps',
            description: '24 heures de connexion, vitesse maximale'
        }
    },
    
    // Configuration de sécurité
    security: {
        enableHttps: true,
        enableHSTS: true,
        enableCSP: true,
        sessionTimeout: 1800, // 30 minutes
        maxLoginAttempts: 3,
        passwordMinLength: 8
    },
    
    // Configuration des notifications
    notifications: {
        email: {
            enabled: true,
            smtp: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                from: 'noreply@wifibisoubisou.com'
            }
        },
        sms: {
            enabled: true,
            provider: 'twilio',
            from: '+243XXXXXXXXX'
        }
    },
    
    // Configuration des logs
    logging: {
        level: 'info',
        enableConsole: false,
        enableFile: true,
        enableRemote: true,
        remoteUrl: 'https://logs.wifibisoubisou.com'
    },
    
    // Informations sur la configuration
    meta: {
        version: '1.0.0',
        configuredAt: new Date().toISOString(),
        environment: 'production',
        domain: 'wifibisoubisou.com',
        country: 'CD', // République Démocratique du Congo
        timezone: 'Africa/Kinshasa',
        language: 'fr'
    }
};

// Exporter la configuration
window.ProductionConfig = ProductionConfig;

// Appliquer la configuration en production
if (window.location.hostname === 'wifibisoubisou.com' || 
    window.location.hostname.includes('wifibisoubisou.com')) {
    
    // Mettre à jour la configuration globale
    if (window.AppConfig) {
        window.AppConfig.production = ProductionConfig;
    }
    
    console.log('✅ Configuration de production activée pour wifibisoubisou.com');
}

console.log('🌐 Configuration de production chargée pour wifibisoubisou.com');
