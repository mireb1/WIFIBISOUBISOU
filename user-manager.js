// Gestionnaire des Utilisateurs - WiFi Bisou Bisou
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.sessions = this.loadSessions();
        this.initializeDefaultUsers();
    }

    // Initialiser les utilisateurs par défaut
    initializeDefaultUsers() {
        if (this.users.length === 0) {
            this.users = [
                {
                    id: 'USER_001',
                    name: 'Jean Mukendi',
                    email: 'jean.mukendi@gmail.com',
                    phone: '+243 81 234 5678',
                    registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    totalSpent: 4500,
                    totalSessions: 15,
                    averageSessionDuration: 145, // minutes
                    favoriteLocation: 'Centre-Ville',
                    userType: 'regular',
                    devices: ['iPhone 12', 'MacBook Pro'],
                    dataUsage: 12.5, // GB
                    violations: 0
                },
                {
                    id: 'USER_002',
                    name: 'Marie Kabila',
                    email: 'marie.kabila@yahoo.fr',
                    phone: '+243 89 876 5432',
                    registrationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    status: 'active',
                    totalSpent: 12000,
                    totalSessions: 34,
                    averageSessionDuration: 89,
                    favoriteLocation: 'Université',
                    userType: 'premium',
                    devices: ['Samsung S21', 'Dell Laptop', 'iPad'],
                    dataUsage: 28.3,
                    violations: 1
                },
                {
                    id: 'USER_003',
                    name: 'Paul Tshisekedi',
                    email: 'paul.tshisekedi@outlook.com',
                    phone: '+243 99 123 4567',
                    registrationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'inactive',
                    totalSpent: 1500,
                    totalSessions: 3,
                    averageSessionDuration: 67,
                    favoriteLocation: 'Marché',
                    userType: 'regular',
                    devices: ['Nokia 8'],
                    dataUsage: 2.1,
                    violations: 0
                },
                {
                    id: 'USER_004',
                    name: 'Grace Mbuyi',
                    email: 'grace.mbuyi@gmail.com',
                    phone: '+243 82 345 6789',
                    registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    lastLogin: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                    status: 'active',
                    totalSpent: 25000,
                    totalSessions: 67,
                    averageSessionDuration: 234,
                    favoriteLocation: 'Hôtel Palace',
                    userType: 'vip',
                    devices: ['iPhone 13 Pro', 'MacBook Air', 'iPad Pro', 'Apple Watch'],
                    dataUsage: 67.8,
                    violations: 0
                },
                {
                    id: 'USER_005',
                    name: 'Antoine Mulamba',
                    email: 'antoine.mulamba@company.cd',
                    phone: '+243 81 987 6543',
                    registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                    lastLogin: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    status: 'active',
                    totalSpent: 87000,
                    totalSessions: 145,
                    averageSessionDuration: 312,
                    favoriteLocation: 'Entreprise Gombe',
                    userType: 'corporate',
                    devices: ['Multiple devices'],
                    dataUsage: 234.5,
                    violations: 0
                },
                {
                    id: 'USER_006',
                    name: 'Claudine Ndaya',
                    email: 'claudine.ndaya@hotmail.com',
                    phone: '+243 84 567 8901',
                    registrationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    status: 'suspended',
                    totalSpent: 2000,
                    totalSessions: 8,
                    averageSessionDuration: 45,
                    favoriteLocation: 'Centre-Ville',
                    userType: 'regular',
                    devices: ['Huawei P30'],
                    dataUsage: 5.2,
                    violations: 3
                }
            ];
            this.saveUsers();
        }
    }

    // Sauvegarder les utilisateurs
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Charger les utilisateurs
    loadUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : [];
    }

    // Sauvegarder les sessions
    saveSessions() {
        localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }

    // Charger les sessions
    loadSessions() {
        const stored = localStorage.getItem('sessions');
        return stored ? JSON.parse(stored) : [];
    }

    // Obtenir tous les utilisateurs
    getAllUsers() {
        return this.users;
    }

    // Obtenir un utilisateur par ID
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    // Obtenir les statistiques des utilisateurs
    getUserStats() {
        const active = this.users.filter(user => user.status === 'active').length;
        const inactive = this.users.filter(user => user.status === 'inactive').length;
        const suspended = this.users.filter(user => user.status === 'suspended').length;
        const vip = this.users.filter(user => user.userType === 'vip').length;
        const premium = this.users.filter(user => user.userType === 'premium').length;
        const corporate = this.users.filter(user => user.userType === 'corporate').length;

        const totalRevenue = this.users.reduce((sum, user) => sum + user.totalSpent, 0);
        const totalSessions = this.users.reduce((sum, user) => sum + user.totalSessions, 0);
        const avgSessionDuration = this.users.reduce((sum, user) => sum + user.averageSessionDuration, 0) / this.users.length;

        return {
            total: this.users.length,
            active,
            inactive,
            suspended,
            vip,
            premium,
            corporate,
            totalRevenue,
            totalSessions,
            avgSessionDuration: Math.round(avgSessionDuration)
        };
    }

    // Créer un nouvel utilisateur
    createUser(userData) {
        const user = {
            id: `USER_${Date.now()}`,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            registrationDate: new Date().toISOString(),
            lastLogin: null,
            status: 'active',
            totalSpent: 0,
            totalSessions: 0,
            averageSessionDuration: 0,
            favoriteLocation: 'Non défini',
            userType: 'regular',
            devices: [],
            dataUsage: 0,
            violations: 0
        };

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    // Créer une session utilisateur
    createSession(userId, location, routerId) {
        const session = {
            id: `SESSION_${Date.now()}`,
            userId,
            location,
            routerId,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            dataUsed: 0,
            status: 'active',
            deviceInfo: `Device_${Math.floor(Math.random() * 1000)}`
        };

        this.sessions.push(session);
        this.saveSessions();
        return session;
    }

    // Terminer une session
    endSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session && session.status === 'active') {
            session.endTime = new Date().toISOString();
            session.status = 'completed';
            session.duration = Math.floor((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60)); // en minutes
            
            // Mettre à jour les statistiques de l'utilisateur
            const user = this.getUserById(session.userId);
            if (user) {
                user.totalSessions++;
                user.lastLogin = session.endTime;
                user.averageSessionDuration = Math.round(
                    (user.averageSessionDuration * (user.totalSessions - 1) + session.duration) / user.totalSessions
                );
                this.saveUsers();
            }
            
            this.saveSessions();
        }
    }

    // Obtenir les sessions actives
    getActiveSessions() {
        return this.sessions.filter(session => session.status === 'active');
    }

    // Obtenir les sessions par utilisateur
    getUserSessions(userId) {
        return this.sessions.filter(session => session.userId === userId);
    }

    // Suspendre un utilisateur
    suspendUser(userId, reason) {
        const user = this.getUserById(userId);
        if (user) {
            user.status = 'suspended';
            user.suspensionReason = reason;
            user.suspensionDate = new Date().toISOString();
            
            // Terminer toutes les sessions actives
            this.sessions.filter(s => s.userId === userId && s.status === 'active')
                .forEach(s => this.endSession(s.id));
            
            this.saveUsers();
        }
    }

    // Réactiver un utilisateur
    reactivateUser(userId) {
        const user = this.getUserById(userId);
        if (user) {
            user.status = 'active';
            delete user.suspensionReason;
            delete user.suspensionDate;
            this.saveUsers();
        }
    }

    // Obtenir les utilisateurs par localisation
    getUsersByLocation() {
        const locations = {};
        this.users.forEach(user => {
            const location = user.favoriteLocation;
            if (!locations[location]) {
                locations[location] = [];
            }
            locations[location].push(user);
        });
        return locations;
    }

    // Obtenir les utilisateurs avec violations
    getUsersWithViolations() {
        return this.users.filter(user => user.violations > 0);
    }

    // Ajouter une violation à un utilisateur
    addViolation(userId, violationType) {
        const user = this.getUserById(userId);
        if (user) {
            user.violations++;
            if (user.violations >= 3) {
                this.suspendUser(userId, 'Trop de violations');
            }
            this.saveUsers();
        }
    }

    // Simuler l'activité des utilisateurs
    simulateUserActivity() {
        // Simuler de nouvelles sessions
        if (Math.random() < 0.3) {
            const activeUsers = this.users.filter(u => u.status === 'active');
            if (activeUsers.length > 0) {
                const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
                const locations = ['Centre-Ville', 'Université', 'Marché', 'Hôtel Palace'];
                const location = locations[Math.floor(Math.random() * locations.length)];
                this.createSession(user.id, location, `RTR00${Math.floor(Math.random() * 4) + 1}`);
            }
        }

        // Simuler la fin de sessions
        const activeSessions = this.getActiveSessions();
        activeSessions.forEach(session => {
            if (Math.random() < 0.1) {
                this.endSession(session.id);
            } else {
                // Simuler l'utilisation de données
                session.dataUsed += Math.random() * 0.1;
            }
        });
    }

    // Obtenir les top utilisateurs
    getTopUsers(limit = 10) {
        return this.users
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, limit);
    }
}

// Instance globale
window.userManager = new UserManager();
