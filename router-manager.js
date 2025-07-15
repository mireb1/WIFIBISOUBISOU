// Gestionnaire des Routeurs - WiFi Bisou Bisou
class RouterManager {
    constructor() {
        this.routers = this.loadRouters();
        this.initializeDefaultRouters();
    }

    // Initialiser les routeurs par défaut
    initializeDefaultRouters() {
        if (this.routers.length === 0) {
            this.routers = [
                {
                    id: 'RTR001',
                    name: 'Routeur Principal Centre-Ville',
                    ipAddress: '192.168.1.1',
                    macAddress: '00:11:22:33:44:55',
                    location: 'Centre-Ville Kinshasa',
                    status: 'online',
                    connectedUsers: 45,
                    maxUsers: 100,
                    bandwidth: 85,
                    uptime: '99.8%',
                    lastUpdate: new Date().toISOString(),
                    monthlyRevenue: 125000,
                    clientInfo: {
                        name: 'Restaurant Chez Mama',
                        contact: '+243 81 234 5678',
                        plan: 'Premium',
                        nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    id: 'RTR002',
                    name: 'Routeur Université',
                    ipAddress: '192.168.1.2',
                    macAddress: '00:11:22:33:44:66',
                    location: 'Campus UNIKIN',
                    status: 'maintenance',
                    connectedUsers: 0,
                    maxUsers: 150,
                    bandwidth: 0,
                    uptime: '95.2%',
                    lastUpdate: new Date().toISOString(),
                    monthlyRevenue: 95000,
                    clientInfo: {
                        name: 'Université de Kinshasa',
                        contact: '+243 89 876 5432',
                        plan: 'Entreprise',
                        nextPayment: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    id: 'RTR003',
                    name: 'Routeur Marché Central',
                    ipAddress: '192.168.1.3',
                    macAddress: '00:11:22:33:44:77',
                    location: 'Marché Central',
                    status: 'online',
                    connectedUsers: 78,
                    maxUsers: 120,
                    bandwidth: 92,
                    uptime: '98.5%',
                    lastUpdate: new Date().toISOString(),
                    monthlyRevenue: 87000,
                    clientInfo: {
                        name: 'Coopérative des Commerçants',
                        contact: '+243 99 123 4567',
                        plan: 'Standard',
                        nextPayment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    id: 'RTR004',
                    name: 'Routeur Hôtel Palace',
                    ipAddress: '192.168.1.4',
                    macAddress: '00:11:22:33:44:88',
                    location: 'Hôtel Palace Gombe',
                    status: 'online',
                    connectedUsers: 23,
                    maxUsers: 80,
                    bandwidth: 45,
                    uptime: '99.9%',
                    lastUpdate: new Date().toISOString(),
                    monthlyRevenue: 155000,
                    clientInfo: {
                        name: 'Hôtel Palace International',
                        contact: '+243 81 987 6543',
                        plan: 'Premium Plus',
                        nextPayment: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
                    }
                }
            ];
            this.saveRouters();
        }
    }

    // Sauvegarder les routeurs
    saveRouters() {
        localStorage.setItem('routers', JSON.stringify(this.routers));
    }

    // Charger les routeurs
    loadRouters() {
        const stored = localStorage.getItem('routers');
        return stored ? JSON.parse(stored) : [];
    }

    // Obtenir tous les routeurs
    getAllRouters() {
        return this.routers;
    }

    // Obtenir un routeur par ID
    getRouterById(id) {
        return this.routers.find(router => router.id === id);
    }

    // Obtenir les statistiques des routeurs
    getRouterStats() {
        const online = this.routers.filter(r => r.status === 'online').length;
        const offline = this.routers.filter(r => r.status === 'offline').length;
        const maintenance = this.routers.filter(r => r.status === 'maintenance').length;
        const totalUsers = this.routers.reduce((sum, r) => sum + r.connectedUsers, 0);
        const totalRevenue = this.routers.reduce((sum, r) => sum + r.monthlyRevenue, 0);
        const avgBandwidth = this.routers.reduce((sum, r) => sum + r.bandwidth, 0) / this.routers.length;

        return {
            total: this.routers.length,
            online,
            offline,
            maintenance,
            totalUsers,
            totalRevenue,
            avgBandwidth: Math.round(avgBandwidth)
        };
    }

    // Mettre à jour le statut d'un routeur
    updateRouterStatus(id, status) {
        const router = this.getRouterById(id);
        if (router) {
            router.status = status;
            router.lastUpdate = new Date().toISOString();
            if (status === 'offline' || status === 'maintenance') {
                router.connectedUsers = 0;
                router.bandwidth = 0;
            }
            this.saveRouters();
        }
    }

    // Simuler l'activité des routeurs
    simulateRouterActivity() {
        this.routers.forEach(router => {
            if (router.status === 'online') {
                // Simuler les utilisateurs connectés
                const variation = Math.floor(Math.random() * 10) - 5;
                router.connectedUsers = Math.max(0, Math.min(router.maxUsers, router.connectedUsers + variation));
                
                // Simuler la bande passante
                router.bandwidth = Math.max(30, Math.min(95, router.bandwidth + Math.floor(Math.random() * 20) - 10));
            }
        });
        this.saveRouters();
    }

    // Obtenir les routeurs avec paiements en retard
    getOverduePayments() {
        return this.routers.filter(router => {
            const nextPayment = new Date(router.clientInfo.nextPayment);
            return nextPayment < new Date();
        });
    }

    // Suspendre un routeur
    suspendRouter(id) {
        const router = this.getRouterById(id);
        if (router) {
            router.status = 'suspended';
            router.connectedUsers = 0;
            router.bandwidth = 0;
            this.saveRouters();
        }
    }

    // Reconnecter un routeur
    reconnectRouter(id) {
        const router = this.getRouterById(id);
        if (router) {
            router.status = 'online';
            this.saveRouters();
        }
    }
}

// Instance globale
window.routerManager = new RouterManager();
