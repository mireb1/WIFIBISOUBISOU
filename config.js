// Configuration avancée du système WiFi Bisou Bisou

class SystemConfig {
    constructor() {
        this.settings = {
            // Configuration réseau
            network: {
                name: 'WiFi-Bisou-Bisou',
                maxUsers: 1000,
                bandwidthPerUser: 5, // Mbps
                sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures en ms
                zones: [
                    {
                        id: 'centre-ville',
                        name: 'Zone Centre-Ville',
                        location: 'Avenue Kasa-Vubu',
                        maxUsers: 200,
                        isActive: true
                    },
                    {
                        id: 'universite',
                        name: 'Zone Université',
                        location: 'Campus UNIKIN',
                        maxUsers: 500,
                        isActive: true
                    },
                    {
                        id: 'marche-central',
                        name: 'Zone Marché Central',
                        location: 'Marché Central',
                        maxUsers: 150,
                        isActive: true
                    }
                ]
            },
            
            // Configuration des forfaits
            plans: {
                basic: {
                    name: 'Forfait Basique',
                    price: 500,
                    duration: 1 * 60 * 60 * 1000, // 1 heure
                    bandwidth: 3, // Mbps
                    validityPeriod: 24 * 60 * 60 * 1000, // 24h pour activer
                    description: '1 heure de connexion WiFi'
                },
                premium: {
                    name: 'Forfait Premium',
                    price: 1500,
                    duration: 6 * 60 * 60 * 1000, // 6 heures
                    bandwidth: 5, // Mbps
                    validityPeriod: 48 * 60 * 60 * 1000, // 48h pour activer
                    description: '6 heures de connexion WiFi'
                },
                daily: {
                    name: 'Forfait Journalier',
                    price: 3000,
                    duration: 24 * 60 * 60 * 1000, // 24 heures
                    bandwidth: 10, // Mbps
                    validityPeriod: 72 * 60 * 60 * 1000, // 72h pour activer
                    description: '24 heures de connexion WiFi'
                }
            },
            
            // Configuration des paiements
            payment: {
                flexpaie: {
                    url: 'https://vpos.flexpaie.com/pay/TUFSQ09fU0VSVklDRQ==',
                    merchantId: 'TUFSQ09fU0VSVklDRQ==',
                    currency: 'CDF',
                    isActive: true
                },
                methods: ['flexpaie', 'mobile_money', 'cash']
            },
            
            // Configuration du système
            system: {
                autoCleanup: true,
                cleanupInterval: 24 * 60 * 60 * 1000, // 24 heures
                maxStorageSize: 10 * 1024 * 1024, // 10 MB
                logLevel: 'info',
                backup: {
                    enabled: true,
                    interval: 7 * 24 * 60 * 60 * 1000, // 7 jours
                    maxBackups: 30
                }
            },
            
            // Configuration des notifications
            notifications: {
                enabled: true,
                types: {
                    success: { enabled: true, duration: 5000 },
                    error: { enabled: true, duration: 8000 },
                    warning: { enabled: true, duration: 6000 },
                    info: { enabled: true, duration: 4000 }
                },
                sound: false,
                desktop: false
            },
            
            // Configuration de sécurité
            security: {
                voucherCodeLength: 6,
                sessionEncryption: true,
                rateLimiting: {
                    enabled: true,
                    maxRequests: 10,
                    windowMs: 60 * 1000 // 1 minute
                },
                ipWhitelist: [],
                ipBlacklist: []
            },
            
            // Configuration des statistiques
            analytics: {
                enabled: true,
                retention: 90, // jours
                metrics: {
                    userActivity: true,
                    networkUsage: true,
                    revenue: true,
                    performance: true
                }
            }
        };
        
        // Charger les paramètres depuis le localStorage
        this.loadSettings();
    }
    
    // Charger les paramètres
    loadSettings() {
        const saved = localStorage.getItem('systemConfig');
        if (saved) {
            try {
                const parsedSettings = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsedSettings };
            } catch (e) {
                console.error('Erreur lors du chargement des paramètres:', e);
            }
        }
    }
    
    // Sauvegarder les paramètres
    saveSettings() {
        localStorage.setItem('systemConfig', JSON.stringify(this.settings));
    }
    
    // Obtenir un paramètre
    get(path) {
        return this.getNestedValue(this.settings, path);
    }
    
    // Définir un paramètre
    set(path, value) {
        this.setNestedValue(this.settings, path, value);
        this.saveSettings();
    }
    
    // Fonction utilitaire pour obtenir une valeur imbriquée
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    // Fonction utilitaire pour définir une valeur imbriquée
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!(key in current)) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }
    
    // Réinitialiser aux paramètres par défaut
    reset() {
        localStorage.removeItem('systemConfig');
        this.loadSettings();
    }
    
    // Exporter la configuration
    export() {
        return JSON.stringify(this.settings, null, 2);
    }
    
    // Importer la configuration
    import(configString) {
        try {
            const config = JSON.parse(configString);
            this.settings = { ...this.settings, ...config };
            this.saveSettings();
            return true;
        } catch (e) {
            console.error('Erreur lors de l\'importation:', e);
            return false;
        }
    }
    
    // Valider la configuration
    validate() {
        const errors = [];
        
        // Valider les forfaits
        Object.keys(this.settings.plans).forEach(planKey => {
            const plan = this.settings.plans[planKey];
            if (!plan.name || !plan.price || !plan.duration) {
                errors.push(`Forfait ${planKey} incomplet`);
            }
        });
        
        // Valider les zones
        if (!this.settings.network.zones || this.settings.network.zones.length === 0) {
            errors.push('Aucune zone WiFi configurée');
        }
        
        return errors;
    }
    
    // Obtenir les statistiques de configuration
    getStats() {
        return {
            totalPlans: Object.keys(this.settings.plans).length,
            totalZones: this.settings.network.zones.length,
            activeZones: this.settings.network.zones.filter(z => z.isActive).length,
            paymentMethods: this.settings.payment.methods.length,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Gestionnaire de maintenance système
class SystemMaintenance {
    constructor(config) {
        this.config = config;
        this.maintenanceLog = JSON.parse(localStorage.getItem('maintenanceLog')) || [];
    }
    
    // Nettoyage automatique des données
    cleanupData() {
        const now = new Date();
        const cleanupDate = new Date(now.getTime() - this.config.get('system.cleanupInterval'));
        
        let cleaned = 0;
        
        // Nettoyer les anciennes sessions
        const sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        const activeSessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate > cleanupDate || session.isActive;
        });
        cleaned += sessions.length - activeSessions.length;
        localStorage.setItem('sessions', JSON.stringify(activeSessions));
        
        // Nettoyer les anciennes notifications
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const activeNotifications = notifications.filter(notification => {
            const notificationDate = new Date(notification.createdAt);
            return notificationDate > cleanupDate;
        });
        cleaned += notifications.length - activeNotifications.length;
        localStorage.setItem('notifications', JSON.stringify(activeNotifications));
        
        // Log de maintenance
        this.logMaintenance('cleanup', `${cleaned} éléments nettoyés`);
        
        return cleaned;
    }
    
    // Optimiser le stockage
    optimizeStorage() {
        const beforeSize = this.getStorageSize();
        
        // Nettoyer les doublons
        this.removeDuplicates();
        
        // Compresser les données
        this.compressData();
        
        const afterSize = this.getStorageSize();
        const saved = beforeSize - afterSize;
        
        this.logMaintenance('optimization', `${saved} octets économisés`);
        
        return saved;
    }
    
    // Obtenir la taille du stockage
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
    
    // Supprimer les doublons
    removeDuplicates() {
        // Nettoyer les doublons de vouchers
        const vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
        const uniqueVouchers = vouchers.filter((voucher, index, self) => 
            index === self.findIndex(v => v.code === voucher.code)
        );
        if (uniqueVouchers.length < vouchers.length) {
            localStorage.setItem('vouchers', JSON.stringify(uniqueVouchers));
        }
        
        // Nettoyer les doublons d'utilisateurs
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const uniqueUsers = users.filter((user, index, self) => 
            index === self.findIndex(u => u.email === user.email)
        );
        if (uniqueUsers.length < users.length) {
            localStorage.setItem('users', JSON.stringify(uniqueUsers));
        }
    }
    
    // Compresser les données
    compressData() {
        // Simplifier les anciennes sessions
        const sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        const compressedSessions = sessions.map(session => {
            if (!session.isActive) {
                return {
                    id: session.id,
                    userId: session.userId,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    isActive: false
                };
            }
            return session;
        });
        localStorage.setItem('sessions', JSON.stringify(compressedSessions));
    }
    
    // Créer une sauvegarde
    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                users: localStorage.getItem('users'),
                vouchers: localStorage.getItem('vouchers'),
                sessions: localStorage.getItem('sessions'),
                notifications: localStorage.getItem('notifications'),
                systemConfig: localStorage.getItem('systemConfig')
            }
        };
        
        const backups = JSON.parse(localStorage.getItem('backups')) || [];
        backups.push(backup);
        
        // Limiter le nombre de sauvegardes
        const maxBackups = this.config.get('system.backup.maxBackups');
        if (backups.length > maxBackups) {
            backups.splice(0, backups.length - maxBackups);
        }
        
        localStorage.setItem('backups', JSON.stringify(backups));
        this.logMaintenance('backup', 'Sauvegarde créée');
        
        return backup;
    }
    
    // Restaurer une sauvegarde
    restoreBackup(timestamp) {
        const backups = JSON.parse(localStorage.getItem('backups')) || [];
        const backup = backups.find(b => b.timestamp === timestamp);
        
        if (backup) {
            Object.keys(backup.data).forEach(key => {
                if (backup.data[key]) {
                    localStorage.setItem(key, backup.data[key]);
                }
            });
            
            this.logMaintenance('restore', `Restauration de ${timestamp}`);
            return true;
        }
        
        return false;
    }
    
    // Log de maintenance
    logMaintenance(type, message) {
        const entry = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message
        };
        
        this.maintenanceLog.push(entry);
        
        // Limiter le log
        if (this.maintenanceLog.length > 100) {
            this.maintenanceLog.splice(0, this.maintenanceLog.length - 100);
        }
        
        localStorage.setItem('maintenanceLog', JSON.stringify(this.maintenanceLog));
    }
    
    // Obtenir le log de maintenance
    getMaintenanceLog() {
        return this.maintenanceLog;
    }
    
    // Diagnostic du système
    runDiagnostics() {
        const diagnostics = {
            timestamp: new Date().toISOString(),
            storage: {
                used: this.getStorageSize(),
                limit: this.config.get('system.maxStorageSize'),
                percentage: (this.getStorageSize() / this.config.get('system.maxStorageSize')) * 100
            },
            data: {
                users: JSON.parse(localStorage.getItem('users') || '[]').length,
                vouchers: JSON.parse(localStorage.getItem('vouchers') || '[]').length,
                sessions: JSON.parse(localStorage.getItem('sessions') || '[]').length,
                notifications: JSON.parse(localStorage.getItem('notifications') || '[]').length
            },
            performance: {
                loadTime: performance.now(),
                memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0
            }
        };
        
        this.logMaintenance('diagnostics', 'Diagnostic système exécuté');
        
        return diagnostics;
    }
}

// Initialisation des systèmes
const systemConfig = new SystemConfig();
const systemMaintenance = new SystemMaintenance(systemConfig);

// Planifier les tâches de maintenance
if (systemConfig.get('system.autoCleanup')) {
    setInterval(() => {
        systemMaintenance.cleanupData();
        systemMaintenance.optimizeStorage();
    }, systemConfig.get('system.cleanupInterval'));
}

// Planifier les sauvegardes
if (systemConfig.get('system.backup.enabled')) {
    setInterval(() => {
        systemMaintenance.createBackup();
    }, systemConfig.get('system.backup.interval'));
}

// Exporter les objets pour utilisation dans d'autres scripts
window.systemConfig = systemConfig;
window.systemMaintenance = systemMaintenance;
