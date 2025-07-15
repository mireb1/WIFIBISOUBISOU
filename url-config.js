// Configuration d'URL pour WiFi Bisou Bisou

class URLConfig {
    constructor() {
        this.environments = {
            // Environnement de développement local
            development: {
                baseUrl: 'http://localhost:8000',
                apiUrl: 'http://localhost:3000/api',
                paymentUrl: 'https://sandbox.flexpaie.com',
                websocketUrl: 'ws://localhost:8001',
                assetsUrl: 'http://localhost:8000/assets'
            },
            
            // Environnement de test/staging
            staging: {
                baseUrl: 'https://test.wifibisoubisou.com',
                apiUrl: 'https://api-test.wifibisoubisou.com',
                paymentUrl: 'https://sandbox.flexpaie.com',
                websocketUrl: 'wss://test.wifibisoubisou.com/ws',
                assetsUrl: 'https://cdn.wifibisoubisou.com/assets'
            },
            
            // Environnement de production
            production: {
                baseUrl: 'https://wifibisoubisou.com',
                apiUrl: 'https://api.wifibisoubisou.com',
                paymentUrl: 'https://payment.flexpaie.com',
                websocketUrl: 'wss://wifibisoubisou.com/ws',
                assetsUrl: 'https://cdn.wifibisoubisou.com/assets',
                // Configuration activée
                active: true,
                configured: true,
                configuredAt: new Date().toISOString()
            },
            
            // Configuration personnalisée (à modifier selon vos besoins)
            custom: {
                baseUrl: 'https://votre-domaine.com',
                apiUrl: 'https://api.votre-domaine.com',
                paymentUrl: 'https://payment.flexpaie.com',
                websocketUrl: 'wss://votre-domaine.com/ws',
                assetsUrl: 'https://cdn.votre-domaine.com/assets'
            }
        };
        
        // Détection automatique de l'environnement
        this.currentEnvironment = this.detectEnvironment();
    }
    
    // Détecter l'environnement actuel
    detectEnvironment() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        // Développement local
        if (hostname === 'localhost' || hostname === '127.0.0.1' || port === '8000') {
            return 'development';
        }
        
        // Test/Staging
        if (hostname.includes('test.') || hostname.includes('staging.')) {
            return 'staging';
        }
        
        // Production (par défaut)
        return 'production';
    }
    
    // Obtenir la configuration actuelle
    get current() {
        return this.environments[this.currentEnvironment];
    }
    
    // Obtenir une URL complète
    getUrl(path = '') {
        const baseUrl = this.current.baseUrl;
        return path ? `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}` : baseUrl;
    }
    
    // Obtenir l'URL de l'API
    getApiUrl(endpoint = '') {
        const apiUrl = this.current.apiUrl;
        return endpoint ? `${apiUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}` : apiUrl;
    }
    
    // Obtenir l'URL de paiement
    getPaymentUrl(params = '') {
        const paymentUrl = this.current.paymentUrl;
        return params ? `${paymentUrl}${params.startsWith('/') ? '' : '/'}${params}` : paymentUrl;
    }
    
    // Générer l'URL complète pour partager un voucher
    generateVoucherUrl(voucherCode) {
        return `${this.getUrl()}/voucher/${voucherCode}`;
    }
    
    // Générer l'URL de validation de voucher
    generateValidationUrl(voucherCode) {
        return `${this.getUrl()}/validate?code=${voucherCode}`;
    }
    
    // Obtenir les métadonnées pour les réseaux sociaux
    getMetaData() {
        return {
            title: 'WiFi Bisou Bisou - Accès WiFi Instantané RDC',
            description: 'Achetez vos tickets WiFi et obtenez vos vouchers immédiatement au Congo RDC',
            image: `${this.current.assetsUrl}/og-image.jpg`,
            url: this.current.baseUrl,
            siteName: 'WiFi Bisou Bisou',
            locale: 'fr_CD',
            type: 'website'
        };
    }
    
    // Mettre à jour la configuration pour un environnement personnalisé
    updateCustomConfig(config) {
        this.environments.custom = { ...this.environments.custom, ...config };
    }
    
    // Forcer l'utilisation d'un environnement spécifique
    setEnvironment(env) {
        if (this.environments[env]) {
            this.currentEnvironment = env;
        }
    }
}

// Initialiser la configuration d'URL
const urlConfig = new URLConfig();

// Exporter globalement
window.URLConfig = urlConfig;

// Fonctions d'aide globales
window.getUrl = (path) => urlConfig.getUrl(path);
window.getApiUrl = (endpoint) => urlConfig.getApiUrl(endpoint);
window.getPaymentUrl = (params) => urlConfig.getPaymentUrl(params);

// Afficher la configuration actuelle
console.log('🌐 Configuration URL initialisée');
console.log(`📍 Environnement: ${urlConfig.currentEnvironment}`);
console.log(`🔗 URL de base: ${urlConfig.current.baseUrl}`);
console.log(`🔌 API URL: ${urlConfig.current.apiUrl}`);

// Mise à jour des métadonnées de la page
document.addEventListener('DOMContentLoaded', function() {
    const metaData = urlConfig.getMetaData();
    
    // Mettre à jour le titre
    document.title = metaData.title;
    
    // Mettre à jour les métadonnées Open Graph
    const updateOrCreateMeta = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };
    
    updateOrCreateMeta('og:title', metaData.title);
    updateOrCreateMeta('og:description', metaData.description);
    updateOrCreateMeta('og:image', metaData.image);
    updateOrCreateMeta('og:url', metaData.url);
    updateOrCreateMeta('og:site_name', metaData.siteName);
    updateOrCreateMeta('og:locale', metaData.locale);
    updateOrCreateMeta('og:type', metaData.type);
});

export default urlConfig;
