// Script de démonstration pour WiFi Bisou Bisou

class DemoManager {
    constructor() {
        this.demoData = {
            users: [
                {
                    id: 'USER_DEMO_001',
                    name: 'Jean Mukendi',
                    email: 'jean.mukendi@gmail.com',
                    phone: '+243 81 234 5678',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    totalSpent: 2000,
                    totalVouchers: 3,
                    isActive: true
                },
                {
                    id: 'USER_DEMO_002',
                    name: 'Marie Kabila',
                    email: 'marie.kabila@yahoo.fr',
                    phone: '+243 89 876 5432',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    totalSpent: 5500,
                    totalVouchers: 7,
                    isActive: true
                },
                {
                    id: 'USER_DEMO_003',
                    name: 'Paul Tshisekedi',
                    email: 'paul.tshisekedi@outlook.com',
                    phone: '+243 99 123 4567',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    totalSpent: 1500,
                    totalVouchers: 1,
                    isActive: true
                }
            ],
            vouchers: [
                {
                    id: 'VOUCHER_DEMO_001',
                    code: 'WIFI-2025-ABC123',
                    plan: 'premium',
                    price: 1500,
                    userId: 'USER_DEMO_001',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    expiresAt: new Date(Date.now() + 46 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    usedAt: null,
                    location: null
                },
                {
                    id: 'VOUCHER_DEMO_002',
                    code: 'WIFI-2025-XYZ789',
                    plan: 'basic',
                    price: 500,
                    userId: 'USER_DEMO_002',
                    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
                    status: 'used',
                    usedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    location: 'Zone Centre-Ville'
                },
                {
                    id: 'VOUCHER_DEMO_003',
                    code: 'WIFI-2025-DEF456',
                    plan: 'daily',
                    price: 3000,
                    userId: 'USER_DEMO_003',
                    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    expiresAt: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    usedAt: null,
                    location: null
                }
            ],
            sessions: [
                {
                    id: 'SESSION_DEMO_001',
                    userId: 'USER_DEMO_002',
                    voucherCode: 'WIFI-2025-XYZ789',
                    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    isActive: false,
                    dataUsed: 250, // MB
                    location: 'Zone Centre-Ville'
                },
                {
                    id: 'SESSION_DEMO_002',
                    userId: 'USER_DEMO_001',
                    voucherCode: 'WIFI-2025-GHI012',
                    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    endTime: null,
                    isActive: true,
                    dataUsed: 125, // MB
                    location: 'Zone Université'
                }
            ],
            notifications: [
                {
                    id: 'NOTIF_DEMO_001',
                    type: 'success',
                    title: 'Nouveau client!',
                    message: 'Paul Tshisekedi a créé un compte',
                    priority: 'normal',
                    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    isRead: false
                },
                {
                    id: 'NOTIF_DEMO_002',
                    type: 'warning',
                    title: 'Voucher bientôt expiré',
                    message: 'Le voucher WIFI-2025-ABC123 expire dans 2 heures',
                    priority: 'high',
                    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    isRead: false
                },
                {
                    id: 'NOTIF_DEMO_003',
                    type: 'info',
                    title: 'Session terminée',
                    message: 'Marie Kabila a terminé sa session WiFi',
                    priority: 'normal',
                    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                    isRead: true
                }
            ]
        };
    }

    // Initialiser les données de démonstration
    initializeDemo() {
        // Sauvegarder les données actuelles si elles existent
        this.backupCurrentData();
        
        // Charger les données de démonstration
        localStorage.setItem('users', JSON.stringify(this.demoData.users));
        localStorage.setItem('vouchers', JSON.stringify(this.demoData.vouchers));
        localStorage.setItem('sessions', JSON.stringify(this.demoData.sessions));
        localStorage.setItem('notifications', JSON.stringify(this.demoData.notifications));
        
        // Définir un utilisateur courant pour la démo
        localStorage.setItem('currentUser', JSON.stringify(this.demoData.users[0]));
        
        console.log('Données de démonstration chargées avec succès!');
        
        // Afficher une notification de démonstration
        if (window.notificationManager) {
            window.notificationManager.addNotification('success', 'Mode Démo Activé!', 
                'Les données de démonstration ont été chargées.');
        }
        
        // Recharger l'interface utilisateur
        if (window.updateUserInterface) {
            window.updateUserInterface();
        }
        
        return true;
    }

    // Sauvegarder les données actuelles
    backupCurrentData() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                users: localStorage.getItem('users'),
                vouchers: localStorage.getItem('vouchers'),
                sessions: localStorage.getItem('sessions'),
                notifications: localStorage.getItem('notifications'),
                currentUser: localStorage.getItem('currentUser')
            }
        };
        
        localStorage.setItem('demoBackup', JSON.stringify(backup));
    }

    // Restaurer les données précédentes
    restoreData() {
        const backup = localStorage.getItem('demoBackup');
        if (backup) {
            const backupData = JSON.parse(backup);
            
            Object.keys(backupData.data).forEach(key => {
                if (backupData.data[key]) {
                    localStorage.setItem(key, backupData.data[key]);
                } else {
                    localStorage.removeItem(key);
                }
            });
            
            console.log('Données restaurées avec succès!');
            
            if (window.notificationManager) {
                window.notificationManager.addNotification('info', 'Données Restaurées', 
                    'Les données précédentes ont été restaurées.');
            }
            
            if (window.updateUserInterface) {
                window.updateUserInterface();
            }
            
            return true;
        }
        
        return false;
    }

    // Réinitialiser toutes les données
    resetAllData() {
        const keys = ['users', 'vouchers', 'sessions', 'notifications', 'currentUser', 'systemConfig'];
        keys.forEach(key => localStorage.removeItem(key));
        
        console.log('Toutes les données ont été réinitialisées!');
        
        if (window.notificationManager) {
            window.notificationManager.addNotification('warning', 'Données Réinitialisées', 
                'Toutes les données ont été supprimées.');
        }
        
        // Recharger la page
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    // Générer des données aléatoires
    generateRandomData() {
        const randomUsers = this.generateRandomUsers(10);
        const randomVouchers = this.generateRandomVouchers(25);
        const randomSessions = this.generateRandomSessions(15);
        
        // Combiner avec les données existantes
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const existingVouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
        const existingSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        
        localStorage.setItem('users', JSON.stringify([...existingUsers, ...randomUsers]));
        localStorage.setItem('vouchers', JSON.stringify([...existingVouchers, ...randomVouchers]));
        localStorage.setItem('sessions', JSON.stringify([...existingSessions, ...randomSessions]));
        
        console.log('Données aléatoires générées avec succès!');
        
        if (window.notificationManager) {
            window.notificationManager.addNotification('success', 'Données Générées', 
                `${randomUsers.length} utilisateurs, ${randomVouchers.length} vouchers générés.`);
        }
        
        return {
            users: randomUsers.length,
            vouchers: randomVouchers.length,
            sessions: randomSessions.length
        };
    }

    // Générer des utilisateurs aléatoires
    generateRandomUsers(count) {
        const names = ['Jean', 'Marie', 'Paul', 'Sophie', 'André', 'Lucie', 'Pierre', 'Fatima', 'Joseph', 'Grace'];
        const surnames = ['Mukendi', 'Kabila', 'Tshisekedi', 'Lumumba', 'Mobutu', 'Kasongo', 'Mbuyi', 'Ngoy', 'Kalonji', 'Ilunga'];
        const domains = ['gmail.com', 'yahoo.fr', 'outlook.com', 'hotmail.com'];
        
        const users = [];
        for (let i = 0; i < count; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const surname = surnames[Math.floor(Math.random() * surnames.length)];
            const domain = domains[Math.floor(Math.random() * domains.length)];
            
            users.push({
                id: `USER_${Date.now()}_${i}`,
                name: `${name} ${surname}`,
                email: `${name.toLowerCase()}.${surname.toLowerCase()}@${domain}`,
                phone: `+243 8${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                totalSpent: Math.floor(Math.random() * 10000),
                totalVouchers: Math.floor(Math.random() * 20),
                isActive: Math.random() > 0.1
            });
        }
        
        return users;
    }

    // Générer des vouchers aléatoires
    generateRandomVouchers(count) {
        const plans = ['basic', 'premium', 'daily'];
        const prices = { basic: 500, premium: 1500, daily: 3000 };
        const statuses = ['active', 'used', 'expired'];
        
        const vouchers = [];
        for (let i = 0; i < count; i++) {
            const plan = plans[Math.floor(Math.random() * plans.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
            
            vouchers.push({
                id: `VOUCHER_${Date.now()}_${i}`,
                code: `WIFI-2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                plan: plan,
                price: prices[plan],
                userId: Math.random() > 0.3 ? `USER_${Date.now()}_${Math.floor(Math.random() * 10)}` : null,
                createdAt: createdAt.toISOString(),
                expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                status: status,
                usedAt: status === 'used' ? new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : null,
                location: status === 'used' ? ['Zone Centre-Ville', 'Zone Université', 'Zone Marché Central'][Math.floor(Math.random() * 3)] : null
            });
        }
        
        return vouchers;
    }

    // Générer des sessions aléatoires
    generateRandomSessions(count) {
        const locations = ['Zone Centre-Ville', 'Zone Université', 'Zone Marché Central'];
        
        const sessions = [];
        for (let i = 0; i < count; i++) {
            const startTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
            const isActive = Math.random() > 0.7;
            const endTime = isActive ? null : new Date(startTime.getTime() + Math.random() * 6 * 60 * 60 * 1000);
            
            sessions.push({
                id: `SESSION_${Date.now()}_${i}`,
                userId: `USER_${Date.now()}_${Math.floor(Math.random() * 10)}`,
                voucherCode: `WIFI-2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                startTime: startTime.toISOString(),
                endTime: endTime ? endTime.toISOString() : null,
                isActive: isActive,
                dataUsed: Math.floor(Math.random() * 1000),
                location: locations[Math.floor(Math.random() * locations.length)]
            });
        }
        
        return sessions;
    }

    // Simuler l'activité en temps réel
    simulateRealTimeActivity() {
        setInterval(() => {
            // Simuler une nouvelle session
            if (Math.random() > 0.7) {
                const session = this.generateRandomSessions(1)[0];
                const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
                sessions.push(session);
                localStorage.setItem('sessions', JSON.stringify(sessions));
                
                if (window.notificationManager) {
                    window.notificationManager.addNotification('info', 'Nouvelle Session', 
                        `Session démarrée en ${session.location}`);
                }
            }
            
            // Simuler un nouveau voucher
            if (Math.random() > 0.8) {
                const voucher = this.generateRandomVouchers(1)[0];
                const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
                vouchers.push(voucher);
                localStorage.setItem('vouchers', JSON.stringify(vouchers));
                
                if (window.notificationManager) {
                    window.notificationManager.addNotification('success', 'Nouveau Voucher', 
                        `Voucher ${voucher.code} créé`);
                }
            }
            
            // Actualiser le dashboard s'il est visible
            if (window.loadDashboardData && document.getElementById('dashboard') && !document.getElementById('dashboard').classList.contains('hidden')) {
                window.loadDashboardData();
            }
        }, 10000); // Toutes les 10 secondes
    }

    // Obtenir les statistiques de la démonstration
    getDemoStats() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        
        return {
            users: users.length,
            vouchers: vouchers.length,
            sessions: sessions.length,
            activeUsers: users.filter(u => u.isActive).length,
            activeVouchers: vouchers.filter(v => v.status === 'active').length,
            activeSessions: sessions.filter(s => s.isActive).length,
            totalRevenue: vouchers.reduce((sum, v) => sum + v.price, 0),
            lastActivity: new Date().toISOString()
        };
    }
}

// Initialiser le gestionnaire de démonstration
const demoManager = new DemoManager();

// Ajouter des fonctions globales pour faciliter l'utilisation
window.demoManager = demoManager;
window.initDemo = () => demoManager.initializeDemo();
window.restoreData = () => demoManager.restoreData();
window.resetAllData = () => demoManager.resetAllData();
window.generateRandomData = () => demoManager.generateRandomData();
window.simulateActivity = () => demoManager.simulateRealTimeActivity();
window.getDemoStats = () => demoManager.getDemoStats();

// Ajouter un panneau de contrôle de démonstration
function createDemoPanel() {
    const panel = document.createElement('div');
    panel.id = 'demo-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 2px solid #007bff;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        min-width: 250px;
    `;
    
    panel.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: #007bff;">🎭 Panneau de Démonstration</h4>
        <button onclick="initDemo()" class="btn btn-primary btn-sm" style="margin: 2px;">Charger Démo</button>
        <button onclick="generateRandomData()" class="btn btn-success btn-sm" style="margin: 2px;">Données Aléatoires</button>
        <button onclick="restoreData()" class="btn btn-warning btn-sm" style="margin: 2px;">Restaurer</button>
        <button onclick="resetAllData()" class="btn btn-danger btn-sm" style="margin: 2px;">Réinitialiser</button>
        <button onclick="simulateActivity()" class="btn btn-info btn-sm" style="margin: 2px;">Simuler Activité</button>
        <button onclick="document.getElementById('demo-panel').remove()" class="btn btn-secondary btn-sm" style="margin: 2px;">Fermer</button>
    `;
    
    document.body.appendChild(panel);
}

// Créer le panneau de démonstration automatiquement
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createDemoPanel, 2000);
});

console.log('🎭 Demo Manager chargé! Utilisez le panneau de démonstration pour tester les fonctionnalités.');
