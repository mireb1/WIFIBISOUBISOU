// Script de vérification pour wifibisoubisou.com

class ConfigurationValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            tests: []
        };
    }

    // Fonction utilitaire pour les tests
    test(name, condition, severity = 'error') {
        const result = {
            name: name,
            passed: Boolean(condition),
            severity: severity,
            timestamp: new Date().toISOString()
        };

        this.results.tests.push(result);

        if (result.passed) {
            this.results.passed++;
            console.log(`✅ ${name}`);
        } else {
            if (severity === 'error') {
                this.results.failed++;
                console.log(`❌ ${name}`);
            } else {
                this.results.warnings++;
                console.log(`⚠️  ${name}`);
            }
        }

        return result.passed;
    }

    // Vérifier la configuration de base
    validateBasicConfig() {
        console.log('🔍 Vérification de la configuration de base...');

        this.test('URL Config chargée', typeof window.URLConfig !== 'undefined');
        this.test('Production Config chargée', typeof window.ProductionConfig !== 'undefined');
        this.test('App Config chargée', typeof window.AppConfig !== 'undefined');
        
        if (window.ProductionConfig) {
            this.test('URL de base configurée', window.ProductionConfig.baseUrl === 'https://wifibisoubisou.com');
            this.test('URL API configurée', window.ProductionConfig.services.api === 'https://api.wifibisoubisou.com');
            this.test('Configuration des zones WiFi', Object.keys(window.ProductionConfig.wifiZones).length === 3);
            this.test('Configuration des forfaits', Object.keys(window.ProductionConfig.plans).length === 3);
        }
    }

    // Vérifier les URLs
    validateUrls() {
        console.log('🌐 Vérification des URLs...');

        const expectedUrls = {
            'URL principale': 'https://wifibisoubisou.com',
            'URL API': 'https://api.wifibisoubisou.com',
            'URL Admin': 'https://admin.wifibisoubisou.com',
            'URL Support': 'https://support.wifibisoubisou.com'
        };

        if (window.ProductionConfig) {
            Object.entries(expectedUrls).forEach(([name, expectedUrl]) => {
                const key = name.toLowerCase().replace('url ', '').replace('url', '');
                let actualUrl;

                if (key === 'principale') {
                    actualUrl = window.ProductionConfig.baseUrl;
                } else if (key === 'api') {
                    actualUrl = window.ProductionConfig.services.api;
                } else if (key === 'admin') {
                    actualUrl = window.ProductionConfig.services.admin;
                } else if (key === 'support') {
                    actualUrl = window.ProductionConfig.services.support;
                }

                this.test(`${name} correcte`, actualUrl === expectedUrl);
            });
        }
    }

    // Vérifier la configuration PWA
    validatePWA() {
        console.log('📱 Vérification de la configuration PWA...');

        // Vérifier le manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        this.test('Manifest lié', manifestLink !== null);

        // Vérifier le service worker
        this.test('Service Worker disponible', 'serviceWorker' in navigator);

        // Vérifier la configuration PWA
        fetch('/manifest.json')
            .then(response => response.json())
            .then(manifest => {
                this.test('Manifest start_url configurée', manifest.start_url === 'https://wifibisoubisou.com/');
                this.test('Manifest scope configurée', manifest.scope === 'https://wifibisoubisou.com/');
                this.test('Manifest nom configuré', manifest.name.includes('WiFi Bisou Bisou'));
            })
            .catch(error => {
                this.test('Manifest accessible', false);
            });
    }

    // Vérifier la configuration de sécurité
    validateSecurity() {
        console.log('🔒 Vérification de la sécurité...');

        // Vérifier HTTPS
        this.test('HTTPS activé', window.location.protocol === 'https:' || window.location.hostname === 'localhost');

        // Vérifier la configuration de sécurité
        if (window.ProductionConfig && window.ProductionConfig.security) {
            const security = window.ProductionConfig.security;
            this.test('HTTPS obligatoire configuré', security.enableHttps === true);
            this.test('HSTS configuré', security.enableHSTS === true);
            this.test('CSP configuré', security.enableCSP === true);
            this.test('Longueur mot de passe configurée', security.passwordMinLength >= 8);
        }
    }

    // Vérifier la configuration de paiement
    validatePayment() {
        console.log('💳 Vérification de la configuration de paiement...');

        if (window.ProductionConfig && window.ProductionConfig.payment) {
            const payment = window.ProductionConfig.payment.flexpaie;
            this.test('URL de paiement configurée', payment.production === 'https://payment.flexpaie.com');
            this.test('Merchant ID configuré', payment.merchantId === 'WIFI_BISOU_BISOU_RDC');
            this.test('Devise configurée', payment.currency === 'CDF');
            this.test('URL de callback configurée', payment.callbackUrl.includes('wifibisoubisou.com'));
        }
    }

    // Vérifier les zones WiFi
    validateWifiZones() {
        console.log('📶 Vérification des zones WiFi...');

        if (window.ProductionConfig && window.ProductionConfig.wifiZones) {
            const zones = window.ProductionConfig.wifiZones;
            
            this.test('Zone Centre-Ville configurée', 'zone-centre-ville' in zones);
            this.test('Zone Université configurée', 'zone-universite' in zones);
            this.test('Zone Marché configurée', 'zone-marche' in zones);

            Object.entries(zones).forEach(([zoneId, zone]) => {
                this.test(`Zone ${zoneId} - Nom défini`, zone.name && zone.name.length > 0);
                this.test(`Zone ${zoneId} - SSID défini`, zone.ssid && zone.ssid.includes('WiFi-Bisou-Bisou'));
                this.test(`Zone ${zoneId} - Capacité définie`, zone.maxUsers && zone.maxUsers > 0);
            });
        }
    }

    // Vérifier les forfaits
    validatePlans() {
        console.log('🎫 Vérification des forfaits...');

        if (window.ProductionConfig && window.ProductionConfig.plans) {
            const plans = window.ProductionConfig.plans;
            
            this.test('Forfait basique configuré', 'basic' in plans);
            this.test('Forfait premium configuré', 'premium' in plans);
            this.test('Forfait journalier configuré', 'daily' in plans);

            Object.entries(plans).forEach(([planId, plan]) => {
                this.test(`Forfait ${planId} - Prix défini`, plan.price && plan.price > 0);
                this.test(`Forfait ${planId} - Durée définie`, plan.duration && plan.duration > 0);
                this.test(`Forfait ${planId} - Nom défini`, plan.name && plan.name.length > 0);
            });
        }
    }

    // Vérifier l'environnement
    validateEnvironment() {
        console.log('🌍 Vérification de l\'environnement...');

        if (window.ProductionConfig && window.ProductionConfig.meta) {
            const meta = window.ProductionConfig.meta;
            this.test('Pays configuré', meta.country === 'CD');
            this.test('Fuseau horaire configuré', meta.timezone === 'Africa/Kinshasa');
            this.test('Langue configurée', meta.language === 'fr');
            this.test('Domaine configuré', meta.domain === 'wifibisoubisou.com');
        }
    }

    // Exécuter tous les tests
    runAllTests() {
        console.log('🚀 Début de la validation de la configuration pour wifibisoubisou.com');
        console.log('==================================================================');

        this.validateBasicConfig();
        this.validateUrls();
        this.validatePWA();
        this.validateSecurity();
        this.validatePayment();
        this.validateWifiZones();
        this.validatePlans();
        this.validateEnvironment();

        this.showResults();
    }

    // Afficher les résultats
    showResults() {
        console.log('\n📊 Résultats de la validation :');
        console.log('===============================');
        console.log(`✅ Tests réussis : ${this.results.passed}`);
        console.log(`❌ Tests échoués : ${this.results.failed}`);
        console.log(`⚠️  Avertissements : ${this.results.warnings}`);
        console.log(`📋 Total des tests : ${this.results.tests.length}`);

        const successRate = ((this.results.passed / this.results.tests.length) * 100).toFixed(1);
        console.log(`📈 Taux de réussite : ${successRate}%`);

        if (this.results.failed === 0) {
            console.log('\n🎉 Félicitations ! Votre configuration est prête pour wifibisoubisou.com !');
        } else {
            console.log('\n⚠️  Veuillez corriger les erreurs avant le déploiement en production.');
        }

        return this.results;
    }

    // Exporter les résultats
    exportResults() {
        const timestamp = new Date().toISOString();
        const report = {
            timestamp: timestamp,
            domain: 'wifibisoubisou.com',
            summary: {
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings,
                total: this.results.tests.length,
                successRate: ((this.results.passed / this.results.tests.length) * 100).toFixed(1)
            },
            tests: this.results.tests
        };

        return JSON.stringify(report, null, 2);
    }
}

// Fonction pour exécuter la validation
function validateConfiguration() {
    const validator = new ConfigurationValidator();
    return validator.runAllTests();
}

// Fonction pour exporter le rapport
function exportValidationReport() {
    const validator = new ConfigurationValidator();
    validator.runAllTests();
    
    const report = validator.exportResults();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Exporter les fonctions
window.validateConfiguration = validateConfiguration;
window.exportValidationReport = exportValidationReport;

// Validation automatique au chargement (seulement en développement)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
        console.log('🔧 Validation automatique en mode développement...');
        validateConfiguration();
    }, 3000);
}

console.log('✅ Validateur de configuration chargé pour wifibisoubisou.com');
console.log('💡 Utilisez validateConfiguration() pour valider la configuration');
console.log('📄 Utilisez exportValidationReport() pour exporter un rapport');
