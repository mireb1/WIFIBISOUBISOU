// Configuration d'environnement - WiFi Bisou Bisou

const AppConfig = {
    // Détection automatique de l'environnement
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('localhost') ||
                   window.location.port === '8000' ||
                   window.location.search.includes('dev=true'),
    
    isProduction: !((window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.includes('localhost') ||
                    window.location.port === '8000' ||
                    window.location.search.includes('dev=true'))),
    
    // Configuration spécifique à chaque environnement
    development: {
        showDemoPanel: true,
        enableDebugLogs: true,
        apiUrl: 'http://localhost:3000/api',
        allowTestPayments: true,
        autoLoadDemoData: false
    },
    
    production: {
        showDemoPanel: false,
        enableDebugLogs: false,
        apiUrl: 'https://mireb1.github.io/WIFIBISOUBISOU/api',
        allowTestPayments: false,
        autoLoadDemoData: false
    },
    
    // Obtenir la configuration actuelle
    get current() {
        return this.isDevelopment ? this.development : this.production;
    },
    
    // Vérifier si une fonctionnalité est activée
    isFeatureEnabled(feature) {
        return this.current[feature] || false;
    },
    
    // Logger conditionnel
    log(message, ...args) {
        if (this.current.enableDebugLogs) {
            console.log(`[WiFi Bisou Bisou] ${message}`, ...args);
        }
    },
    
    // Afficher les informations d'environnement
    showEnvironmentInfo() {
        const env = this.isDevelopment ? 'DÉVELOPPEMENT' : 'PRODUCTION';
        console.log(`🌐 Environnement: ${env}`);
        console.log(`🔧 Configuration:`, this.current);
    }
};

// Initialiser la configuration
window.AppConfig = AppConfig;
AppConfig.showEnvironmentInfo();

// Désactiver le panneau de démonstration en production
if (AppConfig.isProduction) {
    localStorage.setItem('showDemoPanel', 'false');
    AppConfig.log('Panneau de démonstration désactivé en production');
}

console.log('⚙️ Configuration d\'environnement chargée');
