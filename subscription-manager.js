// Gestionnaire des Abonnements - WiFi Bisou Bisou
class SubscriptionManager {
    constructor() {
        this.subscriptions = this.loadSubscriptions();
        this.plans = this.initializePlans();
        this.initializeDefaultSubscriptions();
    }

    // Plans disponibles
    initializePlans() {
        return {
            basic: {
                name: 'Forfait Basique',
                price: 500,
                duration: 2, // heures
                features: ['2 heures de connexion', 'Vitesse standard', 'Support de base'],
                maxDevices: 1
            },
            premium: {
                name: 'Forfait Premium',
                price: 1500,
                duration: 12, // heures
                features: ['12 heures de connexion', 'Vitesse élevée', 'Support prioritaire'],
                maxDevices: 3
            },
            daily: {
                name: 'Forfait Journalier',
                price: 3000,
                duration: 24, // heures
                features: ['24 heures de connexion', 'Vitesse maximale', 'Support 24/7'],
                maxDevices: 5
            },
            weekly: {
                name: 'Forfait Hebdomadaire',
                price: 15000,
                duration: 168, // heures (7 jours)
                features: ['7 jours de connexion', 'Vitesse maximale', 'Support 24/7', 'Accès prioritaire'],
                maxDevices: 10
            },
            monthly: {
                name: 'Forfait Mensuel',
                price: 45000,
                duration: 720, // heures (30 jours)
                features: ['30 jours de connexion', 'Vitesse maximale', 'Support 24/7', 'Accès prioritaire', 'Hotspot illimité'],
                maxDevices: 15
            }
        };
    }

    // Initialiser les abonnements par défaut
    initializeDefaultSubscriptions() {
        if (this.subscriptions.length === 0) {
            this.subscriptions = [
                {
                    id: 'SUB001',
                    userId: 'USER_DEMO_001',
                    userName: 'Jean Mukendi',
                    plan: 'premium',
                    startDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    deviceCount: 2,
                    dataUsed: 1.2, // GB
                    totalPaid: 1500,
                    location: 'Centre-Ville',
                    renewalCount: 3
                },
                {
                    id: 'SUB002',
                    userId: 'USER_DEMO_002',
                    userName: 'Marie Kabila',
                    plan: 'daily',
                    startDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    deviceCount: 4,
                    dataUsed: 3.7, // GB
                    totalPaid: 3000,
                    location: 'Université',
                    renewalCount: 1
                },
                {
                    id: 'SUB003',
                    userId: 'USER_DEMO_003',
                    userName: 'Paul Tshisekedi',
                    plan: 'basic',
                    startDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    status: 'expired',
                    deviceCount: 1,
                    dataUsed: 0.5, // GB
                    totalPaid: 500,
                    location: 'Marché',
                    renewalCount: 0
                },
                {
                    id: 'SUB004',
                    userId: 'USER_004',
                    userName: 'Grace Mbuyi',
                    plan: 'weekly',
                    startDate: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    deviceCount: 7,
                    dataUsed: 12.4, // GB
                    totalPaid: 15000,
                    location: 'Hôtel Palace',
                    renewalCount: 2
                },
                {
                    id: 'SUB005',
                    userId: 'USER_005',
                    userName: 'Antoine Mulamba',
                    plan: 'monthly',
                    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    deviceCount: 12,
                    dataUsed: 45.8, // GB
                    totalPaid: 45000,
                    location: 'Entreprise Gombe',
                    renewalCount: 5
                }
            ];
            this.saveSubscriptions();
        }
    }

    // Sauvegarder les abonnements
    saveSubscriptions() {
        localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    }

    // Charger les abonnements
    loadSubscriptions() {
        const stored = localStorage.getItem('subscriptions');
        return stored ? JSON.parse(stored) : [];
    }

    // Obtenir tous les abonnements
    getAllSubscriptions() {
        return this.subscriptions;
    }

    // Obtenir un abonnement par ID
    getSubscriptionById(id) {
        return this.subscriptions.find(sub => sub.id === id);
    }

    // Obtenir les statistiques des abonnements
    getSubscriptionStats() {
        const active = this.subscriptions.filter(sub => sub.status === 'active').length;
        const expired = this.subscriptions.filter(sub => sub.status === 'expired').length;
        const suspended = this.subscriptions.filter(sub => sub.status === 'suspended').length;
        
        const totalRevenue = this.subscriptions.reduce((sum, sub) => sum + sub.totalPaid, 0);
        const monthlyRevenue = this.subscriptions
            .filter(sub => {
                const startDate = new Date(sub.startDate);
                const now = new Date();
                return startDate.getMonth() === now.getMonth() && startDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, sub) => sum + sub.totalPaid, 0);

        const planStats = {};
        Object.keys(this.plans).forEach(planType => {
            planStats[planType] = this.subscriptions.filter(sub => sub.plan === planType && sub.status === 'active').length;
        });

        return {
            total: this.subscriptions.length,
            active,
            expired,
            suspended,
            totalRevenue,
            monthlyRevenue,
            planStats
        };
    }

    // Créer un nouvel abonnement
    createSubscription(userId, userName, plan, location = 'Non spécifié') {
        const planInfo = this.plans[plan];
        if (!planInfo) return null;

        const subscription = {
            id: `SUB${Date.now()}`,
            userId,
            userName,
            plan,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + planInfo.duration * 60 * 60 * 1000).toISOString(),
            status: 'active',
            deviceCount: 0,
            dataUsed: 0,
            totalPaid: planInfo.price,
            location,
            renewalCount: 0
        };

        this.subscriptions.push(subscription);
        this.saveSubscriptions();
        return subscription;
    }

    // Renouveler un abonnement
    renewSubscription(subscriptionId) {
        const subscription = this.getSubscriptionById(subscriptionId);
        if (!subscription) return false;

        const planInfo = this.plans[subscription.plan];
        subscription.endDate = new Date(Date.now() + planInfo.duration * 60 * 60 * 1000).toISOString();
        subscription.status = 'active';
        subscription.renewalCount++;
        subscription.totalPaid += planInfo.price;

        this.saveSubscriptions();
        return true;
    }

    // Suspendre un abonnement
    suspendSubscription(subscriptionId) {
        const subscription = this.getSubscriptionById(subscriptionId);
        if (subscription) {
            subscription.status = 'suspended';
            this.saveSubscriptions();
        }
    }

    // Obtenir les abonnements expirant bientôt
    getExpiringSoon() {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return this.subscriptions.filter(sub => {
            const endDate = new Date(sub.endDate);
            return sub.status === 'active' && endDate <= tomorrow;
        });
    }

    // Mettre à jour le statut des abonnements expirés
    updateExpiredSubscriptions() {
        const now = new Date();
        let updated = false;

        this.subscriptions.forEach(sub => {
            if (sub.status === 'active' && new Date(sub.endDate) < now) {
                sub.status = 'expired';
                updated = true;
            }
        });

        if (updated) {
            this.saveSubscriptions();
        }
    }

    // Simuler l'utilisation des données
    simulateDataUsage() {
        this.subscriptions.forEach(sub => {
            if (sub.status === 'active') {
                const increment = Math.random() * 0.1; // 0-100MB
                sub.dataUsed = Math.round((sub.dataUsed + increment) * 10) / 10;
            }
        });
        this.saveSubscriptions();
    }

    // Obtenir les revenus par plan
    getRevenueByPlan() {
        const revenue = {};
        Object.keys(this.plans).forEach(planType => {
            revenue[planType] = this.subscriptions
                .filter(sub => sub.plan === planType)
                .reduce((sum, sub) => sum + sub.totalPaid, 0);
        });
        return revenue;
    }
}

// Instance globale
window.subscriptionManager = new SubscriptionManager();
