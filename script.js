// Configuration
const FLEXPAIE_PAYMENT_URL = 'https://vpos.flexpaie.com/pay/TUFSQ09fU0VSVklDRQ==';
const WIFI_NETWORK_NAME = 'WiFi-Bisou-Bisou';

// Nouvel objet de gestion des utilisateurs
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.sessions = JSON.parse(localStorage.getItem('sessions')) || [];
    }

    // Créer un nouvel utilisateur
    createUser(email, phone, name) {
        const user = {
            id: this.generateUserId(),
            email: email,
            phone: phone,
            name: name,
            createdAt: new Date().toISOString(),
            totalSpent: 0,
            totalVouchers: 0,
            isActive: true
        };
        this.users.push(user);
        this.saveUsers();
        return user;
    }

    // Générer un ID utilisateur unique
    generateUserId() {
        return 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Authentifier un utilisateur
    authenticateUser(email, phone) {
        const user = this.users.find(u => u.email === email && u.phone === phone);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    }

    // Mettre à jour les statistiques utilisateur
    updateUserStats(userId, voucherPrice) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.totalSpent += voucherPrice;
            user.totalVouchers += 1;
            this.saveUsers();
        }
    }

    // Sauvegarder les utilisateurs
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Créer une session
    createSession(userId, voucherCode) {
        const session = {
            id: this.generateSessionId(),
            userId: userId,
            voucherCode: voucherCode,
            startTime: new Date().toISOString(),
            endTime: null,
            isActive: true,
            dataUsed: 0,
            location: this.getCurrentLocation()
        };
        this.sessions.push(session);
        this.saveSessions();
        return session;
    }

    // Générer un ID de session
    generateSessionId() {
        return 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtenir la localisation actuelle (simulée)
    getCurrentLocation() {
        const locations = [
            'Zone Centre-Ville (Avenue Kasa-Vubu)',
            'Zone Université (Campus UNIKIN)',
            'Zone Marché Central'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    // Sauvegarder les sessions
    saveSessions() {
        localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }

    // Obtenir les sessions actives
    getActiveSessions() {
        return this.sessions.filter(s => s.isActive);
    }

    // Terminer une session
    endSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.endTime = new Date().toISOString();
            session.isActive = false;
            this.saveSessions();
        }
    }
}

// Gestionnaire de vouchers amélioré
class VoucherManager {
    constructor() {
        this.vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
        this.usedVouchers = JSON.parse(localStorage.getItem('usedVouchers')) || [];
    }

    // Générer un nouveau voucher
    generateVoucher(plan, price, userId = null) {
        const voucher = {
            id: this.generateVoucherId(),
            code: this.generateVoucherCode(),
            plan: plan,
            price: price,
            userId: userId,
            createdAt: new Date().toISOString(),
            expiresAt: this.calculateExpiryDate(plan),
            status: 'active',
            usedAt: null,
            location: null
        };
        this.vouchers.push(voucher);
        this.saveVouchers();
        return voucher;
    }

    // Générer un ID de voucher unique
    generateVoucherId() {
        return 'VOUCHER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Générer un code de voucher
    generateVoucherCode() {
        const prefix = 'WIFI';
        const year = new Date().getFullYear();
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${year}-${randomPart}`;
    }

    // Calculer la date d'expiration
    calculateExpiryDate(plan) {
        const now = new Date();
        const expiryHours = {
            'basic': 24,    // 24h pour utiliser le voucher
            'premium': 48,  // 48h pour utiliser le voucher
            'daily': 72     // 72h pour utiliser le voucher
        };
        now.setHours(now.getHours() + (expiryHours[plan] || 24));
        return now.toISOString();
    }

    // Utiliser un voucher
    useVoucher(voucherCode) {
        const voucher = this.vouchers.find(v => v.code === voucherCode && v.status === 'active');
        if (voucher) {
            const now = new Date();
            const expiryDate = new Date(voucher.expiresAt);
            
            if (now > expiryDate) {
                voucher.status = 'expired';
                this.saveVouchers();
                return { success: false, message: 'Voucher expiré' };
            }

            voucher.status = 'used';
            voucher.usedAt = now.toISOString();
            this.usedVouchers.push(voucher);
            this.saveVouchers();
            this.saveUsedVouchers();
            
            return { success: true, voucher: voucher };
        }
        return { success: false, message: 'Voucher invalide' };
    }

    // Sauvegarder les vouchers
    saveVouchers() {
        localStorage.setItem('vouchers', JSON.stringify(this.vouchers));
    }

    // Sauvegarder les vouchers utilisés
    saveUsedVouchers() {
        localStorage.setItem('usedVouchers', JSON.stringify(this.usedVouchers));
    }

    // Obtenir les statistiques des vouchers
    getVoucherStats() {
        const total = this.vouchers.length;
        const active = this.vouchers.filter(v => v.status === 'active').length;
        const used = this.vouchers.filter(v => v.status === 'used').length;
        const expired = this.vouchers.filter(v => v.status === 'expired').length;
        const totalRevenue = this.vouchers.reduce((sum, v) => sum + v.price, 0);

        return { total, active, used, expired, totalRevenue };
    }
}

// Gestionnaire de notifications
class NotificationManager {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    }

    // Ajouter une notification
    addNotification(type, title, message, priority = 'normal') {
        const notification = {
            id: this.generateNotificationId(),
            type: type, // 'success', 'warning', 'error', 'info'
            title: title,
            message: message,
            priority: priority,
            createdAt: new Date().toISOString(),
            isRead: false
        };
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.showNotification(notification);
        return notification;
    }

    // Générer un ID de notification
    generateNotificationId() {
        return 'NOTIF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Afficher une notification
    showNotification(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification notification-${notification.type}`;
        notificationElement.innerHTML = `
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        // Utiliser le conteneur dédié plutôt que document.body
        const container = document.getElementById('notifications-container') || document.body;
        container.appendChild(notificationElement);
        
        // Auto-supprimer après 5 secondes
        setTimeout(() => {
            if (notificationElement.parentElement) {
                notificationElement.remove();
            }
        }, 5000);
    }

    // Sauvegarder les notifications
    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    // Marquer comme lu
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.saveNotifications();
        }
    }

    // Obtenir les notifications non lues
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.isRead);
    }
}

// Initialisation des gestionnaires
const userManager = new UserManager();
const voucherManager = new VoucherManager();
const notificationManager = new NotificationManager();

// État de l'application
let currentSection = 'home';
let selectedPlan = null;
let selectedPrice = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    loadDashboardData();
    updateUserInterface();
    
    // Vérifier les vouchers expirés
    checkExpiredVouchers();
    
    // Notification de bienvenue
    if (userManager.currentUser) {
        notificationManager.addNotification('info', 'Bienvenue!', 
            `Bon retour ${userManager.currentUser.name}!`);
    }
});

// Fonction pour vérifier les vouchers expirés
function checkExpiredVouchers() {
    const now = new Date();
    let expiredCount = 0;
    
    voucherManager.vouchers.forEach(voucher => {
        if (voucher.status === 'active' && new Date(voucher.expiresAt) < now) {
            voucher.status = 'expired';
            expiredCount++;
        }
    });
    
    if (expiredCount > 0) {
        voucherManager.saveVouchers();
        notificationManager.addNotification('warning', 'Vouchers expirés', 
            `${expiredCount} voucher(s) ont expiré.`);
    }
}

// Navigation
function showSection(sectionId) {
    // Cacher toutes les sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Cacher la section hero si ce n'est pas home
    const hero = document.querySelector('.hero');
    if (sectionId !== 'home') {
        hero.classList.add('hidden');
    } else {
        hero.classList.remove('hidden');
    }
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    currentSection = sectionId;
}

function showTicketSelection() {
    showSection('ticket-selection');
}

function showDashboard() {
    showSection('dashboard');
    loadDashboardData();
}

function showDashboardSection(section) {
    // Mise à jour des boutons de navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[onclick="showDashboardSection('${section}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Ici vous pouvez ajouter la logique pour afficher différentes sections du tableau de bord
    loadDashboardSection(section);
}

// Gestion des achats améliorée
function buyTicket(planType, price) {
    selectedPlan = planType;
    selectedPrice = price;
    
    // Vérifier si l'utilisateur est connecté
    if (!userManager.currentUser) {
        showUserLoginModal();
        return;
    }
    
    // Mettre à jour les détails dans le modal
    document.getElementById('selected-plan').textContent = getPlanName(planType);
    document.getElementById('selected-price').textContent = price;
    
    // Afficher le modal de paiement
    document.getElementById('payment-modal').classList.remove('hidden');
}

function getPlanName(planType) {
    const plans = {
        'basic': 'Forfait Basique',
        'premium': 'Forfait Premium',
        'daily': 'Forfait Journalier'
    };
    return plans[planType] || 'Forfait Inconnu';
}

function redirectToPayment() {
    // Simulation d'un paiement réussi après redirection
    closeModal();
    
    // En production, vous redirigeriez vers Flexpaie
    // window.location.href = FLEXPAIE_PAYMENT_URL + '?amount=' + selectedPrice;
    
    // Simulation du retour de paiement
    setTimeout(() => {
        generateVoucher();
    }, 2000);
}

// Génération de vouchers améliorée
function generateVoucher() {
    const userId = userManager.currentUser ? userManager.currentUser.id : null;
    const voucher = voucherManager.generateVoucher(selectedPlan, selectedPrice, userId);
    
    // Mettre à jour l'interface
    document.getElementById('voucher-code').textContent = voucher.code;
    document.getElementById('voucher-modal').classList.remove('hidden');
    
    // Mettre à jour les statistiques utilisateur
    if (userId) {
        userManager.updateUserStats(userId, selectedPrice);
    }
    
    // Notification de succès
    notificationManager.addNotification('success', 'Voucher généré!', 
        `Votre voucher ${voucher.code} a été généré avec succès.`);
    
    // Créer une session
    if (userId) {
        userManager.createSession(userId, voucher.code);
    }
}

// Fonction améliorée pour sauvegarder les vouchers (conservée pour compatibilité)
function saveVoucher(code, plan, price) {
    // Cette fonction est maintenant gérée par VoucherManager
    // Gardée pour compatibilité avec le code existant
}

function printVoucher() {
    const voucherCode = document.getElementById('voucher-code').textContent;
    const printWindow = window.open('', '_blank');
    
    // Créer le contenu HTML pour l'impression
    const htmlContent = `
        <html>
            <head>
                <title>Voucher WiFi - ${voucherCode}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                    .voucher { border: 2px dashed #007bff; padding: 20px; margin: 20px; }
                    .code { font-size: 24px; font-weight: bold; color: #007bff; }
                    .network { font-size: 18px; margin: 10px 0; }
                    .instructions { text-align: left; margin-top: 20px; }
                    .logo { font-size: 28px; color: #007bff; }
                </style>
            </head>
            <body>
                <div class="voucher">
                    <div class="logo">📶 WiFi Bisou Bisou</div>
                    <h2>Voucher de Connexion WiFi</h2>
                    <div class="code">${voucherCode}</div>
                    <div class="network">Réseau: ${WIFI_NETWORK_NAME}</div>
                    <div class="instructions">
                        <h3>Instructions:</h3>
                        <ol>
                            <li>Connectez-vous au réseau "${WIFI_NETWORK_NAME}"</li>
                            <li>Entrez ce code dans la page de connexion</li>
                            <li>Profitez de votre connexion!</li>
                        </ol>
                    </div>
                    <p><small>🇨🇩 Adaptation RDC - Support: assistance@wifibisoubisou.cd</small></p>
                </div>
            </body>
        </html>
    `;
    
    // Utiliser une méthode plus sûre que document.write
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}

// Gestion des modales
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Fermer les modales en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
});

// Données du tableau de bord
function loadDashboardData() {
    // Simulation de données en temps réel
    updateLiveConnections();
    updateSystemStats();
    updateMonitoring();
}

function updateLiveConnections() {
    const connections = [
        { user: 'User_001', status: 'active', duration: '2h 15min' },
        { user: 'User_002', status: 'active', duration: '45min' },
        { user: 'User_003', status: 'active', duration: '1h 30min' },
        { user: 'User_004', status: 'active', duration: '3h 22min' }
    ];
    
    // Mettre à jour l'affichage des connexions
    // Cette fonction peut être étendue pour afficher plus de détails
}

function updateSystemStats() {
    // Simulation de statistiques système
    const stats = {
        connectionsToday: Math.floor(Math.random() * 100) + 200,
        totalUsers: Math.floor(Math.random() * 500) + 1000,
        revenue: Math.floor(Math.random() * 10000) + 50000,
        activeZones: Math.floor(Math.random() * 10) + 15
    };
    
    // Mettre à jour les statistiques affichées
    document.querySelectorAll('.stat-number').forEach((element, index) => {
        const values = Object.values(stats);
        if (values[index]) {
            element.textContent = values[index].toLocaleString();
        }
    });
}

function updateMonitoring() {
    // Simulation de données de surveillance
    const monitoring = {
        bandwidth: Math.floor(Math.random() * 20) + 70,
        latency: Math.floor(Math.random() * 20) + 5,
        uptime: '99.8%',
        errors: Math.floor(Math.random() * 5)
    };
    
    // Mettre à jour les métriques de surveillance
    const metricsElements = document.querySelectorAll('.monitoring .value');
    metricsElements[0].textContent = monitoring.bandwidth + '%';
    metricsElements[1].textContent = monitoring.latency + 'ms';
}

function loadDashboardSection(section) {
    switch(section) {
        case 'overview':
            loadOverview();
            break;
        case 'routers':
            loadRouters();
            break;
        case 'equipment':
            loadEquipment();
            break;
        case 'subscriptions':
            loadSubscriptions();
            break;
        case 'users':
            loadUsers();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'wifi-zones':
            loadWifiZones();
            break;
        default:
            loadOverview();
    }
}

function loadOverview() {
    // Charger les données de vue d'ensemble
    updateSystemStats();
    updateLiveConnections();
    updateMonitoring();
}

function loadRouters() {
    // Charger les données des routeurs d'authentification
    console.log('Chargement des routeurs...');
}

function loadEquipment() {
    // Charger les données des équipements
    console.log('Chargement des équipements...');
}

function loadSubscriptions() {
    // Charger les données des abonnements
    console.log('Chargement des abonnements...');
}

function loadUsers() {
    // Charger les données des utilisateurs
    console.log('Chargement des utilisateurs...');
}

function loadTransactions() {
    // Charger les transactions Flexpaie
    console.log('Chargement des transactions Flexpaie...');
}

function loadWifiZones() {
    // Charger les zones WiFi
    console.log('Chargement des zones WiFi...');
}

// Gestion des alertes
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Styles pour l'alerte
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(alertDiv);
    
    // Supprimer l'alerte après 5 secondes
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Animation pour les alertes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Gestion des liens de navigation
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

// Mise à jour automatique des données
setInterval(() => {
    if (currentSection === 'dashboard') {
        loadDashboardData();
    }
}, 30000); // Mise à jour toutes les 30 secondes

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    showAlert('Une erreur est survenue. Veuillez rafraîchir la page.', 'error');
});

// Fonctions utilitaires
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-CD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Gestion de la persistence des données
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        return null;
    }
}

// Fonctions de gestion des utilisateurs
function showUserLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Connexion Utilisateur</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="user-login-form">
                    <div class="form-group">
                        <label for="user-email">Email:</label>
                        <input type="email" id="user-email" required>
                    </div>
                    <div class="form-group">
                        <label for="user-phone">Téléphone:</label>
                        <input type="tel" id="user-phone" required>
                    </div>
                    <div class="form-group">
                        <label for="user-name">Nom (nouveau utilisateur):</label>
                        <input type="text" id="user-name" placeholder="Optionnel pour nouveaux utilisateurs">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Se connecter</button>
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Gérer la soumission du formulaire
    document.getElementById('user-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleUserLogin();
    });
}

function handleUserLogin() {
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value;
    const name = document.getElementById('user-name').value;
    
    // Tenter de se connecter
    let user = userManager.authenticateUser(email, phone);
    
    // Si l'utilisateur n'existe pas et qu'un nom est fourni, créer un nouveau compte
    if (!user && name) {
        user = userManager.createUser(email, phone, name);
        notificationManager.addNotification('success', 'Compte créé!', 
            `Bienvenue ${name}! Votre compte a été créé avec succès.`);
    } else if (!user) {
        notificationManager.addNotification('error', 'Connexion échouée', 
            'Utilisateur non trouvé. Veuillez fournir votre nom pour créer un compte.');
        return;
    }
    
    // Fermer le modal
    document.querySelector('.modal').remove();
    
    // Continuer avec l'achat
    notificationManager.addNotification('success', 'Connexion réussie!', 
        `Bienvenue ${user.name}!`);
    
    // Procéder à l'achat
    buyTicket(selectedPlan, selectedPrice);
}

function showUserProfile() {
    if (!userManager.currentUser) {
        showUserLoginModal();
        return;
    }
    
    const user = userManager.currentUser;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Profil Utilisateur</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Téléphone:</strong> ${user.phone}</p>
                    <p><strong>Membre depuis:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total dépensé:</strong> ${user.totalSpent} FC</p>
                    <p><strong>Vouchers achetés:</strong> ${user.totalVouchers}</p>
                </div>
                <div class="user-sessions">
                    <h4>Sessions actives</h4>
                    <div id="user-sessions-list"></div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-danger" onclick="logoutUser()">Déconnexion</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Charger les sessions de l'utilisateur
    loadUserSessions(user.id);
}

function loadUserSessions(userId) {
    const sessions = userManager.sessions.filter(s => s.userId === userId);
    const sessionsList = document.getElementById('user-sessions-list');
    
    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p>Aucune session active</p>';
        return;
    }
    
    sessionsList.innerHTML = sessions.map(session => `
        <div class="session-item">
            <p><strong>Voucher:</strong> ${session.voucherCode}</p>
            <p><strong>Localisation:</strong> ${session.location}</p>
            <p><strong>Démarré:</strong> ${new Date(session.startTime).toLocaleString()}</p>
            <p><strong>Statut:</strong> ${session.isActive ? 'Actif' : 'Terminé'}</p>
        </div>
    `).join('');
}

function logoutUser() {
    userManager.currentUser = null;
    localStorage.removeItem('currentUser');
    document.querySelector('.modal').remove();
    notificationManager.addNotification('info', 'Déconnexion', 'Vous avez été déconnecté avec succès.');
    updateUserInterface();
}

function updateUserInterface() {
    const loginBtn = document.querySelector('.login-btn');
    if (userManager.currentUser) {
        loginBtn.textContent = userManager.currentUser.name;
        loginBtn.onclick = showUserProfile;
    } else {
        loginBtn.textContent = 'Connexion';
        loginBtn.onclick = showUserLoginModal;
    }
}

// Fonction pour valider un voucher
function validateVoucher() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Valider un Voucher</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="voucher-validation-form">
                    <div class="form-group">
                        <label for="voucher-code-input">Code du Voucher:</label>
                        <input type="text" id="voucher-code-input" placeholder="WIFI-2025-XXXXXX" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Valider</button>
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
                    </div>
                </form>
                <div id="validation-result"></div>
            </div>
        </div>
    `;
    
    // Utiliser le conteneur dédié plutôt que document.body
    const container = document.getElementById('dynamic-modals-container') || document.body;
    container.appendChild(modal);
    
    document.getElementById('voucher-validation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const voucherCode = document.getElementById('voucher-code-input').value;
        const result = voucherManager.useVoucher(voucherCode);
        
        const resultDiv = document.getElementById('validation-result');
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="success-message">
                    <h4>Voucher validé avec succès!</h4>
                    <p><strong>Code:</strong> ${result.voucher.code}</p>
                    <p><strong>Forfait:</strong> ${getPlanName(result.voucher.plan)}</p>
                    <p><strong>Prix:</strong> ${result.voucher.price} FC</p>
                </div>
            `;
            notificationManager.addNotification('success', 'Voucher validé!', 
                `Le voucher ${voucherCode} a été validé avec succès.`);
        } else {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <h4>Erreur de validation</h4>
                    <p>${result.message}</p>
                </div>
            `;
            notificationManager.addNotification('error', 'Validation échouée', result.message);
        }
    });
}

// Fonction pour afficher les statistiques détaillées
function showDetailedStats() {
    const voucherStats = voucherManager.getVoucherStats();
    const activeSessions = userManager.getActiveSessions();
    
    const modal = document.createElement('div');
    modal.className = 'modal modal-large';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Statistiques Détaillées</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Vouchers</h4>
                        <p>Total: ${voucherStats.total}</p>
                        <p>Actifs: ${voucherStats.active}</p>
                        <p>Utilisés: ${voucherStats.used}</p>
                        <p>Expirés: ${voucherStats.expired}</p>
                    </div>
                    <div class="stat-card">
                        <h4>Revenus</h4>
                        <p>Total: ${voucherStats.totalRevenue} FC</p>
                        <p>Aujourd'hui: ${getTodayRevenue()} FC</p>
                    </div>
                    <div class="stat-card">
                        <h4>Utilisateurs</h4>
                        <p>Total: ${userManager.users.length}</p>
                        <p>Sessions actives: ${activeSessions.length}</p>
                    </div>
                </div>
                <div class="chart-container">
                    <h4>Activité par heure</h4>
                    <div id="activity-chart"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Générer un graphique simple
    generateActivityChart();
}

function getTodayRevenue() {
    const today = new Date().toDateString();
    return voucherManager.vouchers
        .filter(v => new Date(v.createdAt).toDateString() === today)
        .reduce((sum, v) => sum + v.price, 0);
}

function generateActivityChart() {
    const chartContainer = document.getElementById('activity-chart');
    const hours = Array.from({length: 24}, (_, i) => i);
    
    const chartData = hours.map(hour => {
        const count = voucherManager.vouchers.filter(v => {
            const voucherHour = new Date(v.createdAt).getHours();
            return voucherHour === hour;
        }).length;
        return { hour, count };
    });
    
    const maxCount = Math.max(...chartData.map(d => d.count));
    
    chartContainer.innerHTML = `
        <div class="chart-bars">
            ${chartData.map(d => `
                <div class="chart-bar" style="height: ${maxCount > 0 ? (d.count / maxCount) * 100 : 0}%;" 
                     title="${d.hour}h: ${d.count} vouchers">
                    <span class="bar-label">${d.hour}h</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker enregistré avec succès:', registration.scope);
                
                // Écouter les mises à jour
                registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nouvelle version disponible
                            if (window.notificationManager) {
                                window.notificationManager.addNotification('info', 'Mise à jour disponible', 
                                    'Une nouvelle version est disponible. Rechargez la page pour l\'activer.');
                            }
                        }
                    });
                });
            })
            .catch(function(error) {
                console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
            });
    });
}

// Gestion de l'installation PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher un bouton d'installation personnalisé
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Installer l\'application';
    installBtn.className = 'btn btn-primary install-btn';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        display: none;
    `;
    
    installBtn.addEventListener('click', function() {
        installBtn.style.display = 'none';
        
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then(function(choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA installée');
                if (window.notificationManager) {
                    window.notificationManager.addNotification('success', 'Installation réussie!', 
                        'WiFi Bisou Bisou a été installé sur votre appareil.');
                }
            }
            deferredPrompt = null;
        });
    });
    
    document.body.appendChild(installBtn);
    
    // Afficher le bouton après un délai
    setTimeout(() => {
        installBtn.style.display = 'block';
    }, 5000);
});

// Détecter si l'app est lancée depuis l'écran d'accueil
window.addEventListener('appinstalled', function(evt) {
    console.log('PWA installée depuis l\'écran d\'accueil');
    if (window.notificationManager) {
        window.notificationManager.addNotification('success', 'Application installée!', 
            'WiFi Bisou Bisou est maintenant disponible sur votre écran d\'accueil.');
    }
});
