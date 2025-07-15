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
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            max-width: 350px;
        `;
        document.body.appendChild(container);
        return container;
    }

    // Ajouter une notification
    addNotification(type, title, message, priority = 'normal', duration = 5000) {
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
        this.showNotification(notification, duration);
        return notification;
    }

    // Générer un ID de notification
    generateNotificationId() {
        return 'NOTIF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Afficher une notification
    showNotification(notification, duration) {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification notification-${notification.type}`;
        notificationElement.innerHTML = `
            <div class="notification-content">
                <strong>${notification.title}</strong>
                <div>${notification.message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.container.appendChild(notificationElement);
        
        // Auto-supprimer après la durée spécifiée
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.remove();
            }
        }, duration);
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
    
    // S'assurer que tous les modaux sont fermés au démarrage
    preventAutoModals();
    
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

// Fonction d'initialisation globale
function initializeApp() {
    console.log('🚀 Initialisation de l\'application WiFi Bisou Bisou...');
    
    // Initialiser les gestionnaires si ils n'existent pas
    if (!window.userManager) {
        window.userManager = new UserManager();
    }
    
    if (!window.voucherManager) {
        window.voucherManager = new VoucherManager();
    }
    
    if (!window.notificationManager) {
        window.notificationManager = new NotificationManager();
    }
    
    // Mettre à jour l'interface utilisateur
    updateUserInterface();
    
    // Configurer les gestionnaires d'événements
    setupEventHandlers();
    
    // Afficher la section d'accueil par défaut
    showSection('home');
    
    console.log('✅ Application initialisée avec succès');
}

// Configuration des gestionnaires d'événements
function setupEventHandlers() {
    // Gestionnaire pour les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            if (sectionId === 'dashboard') {
                showDashboard();
            } else {
                showSection(sectionId);
            }
        });
    });
    
    // Gestionnaire pour les modales
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.remove();
        }
    });
    
    // Gestionnaire pour les boutons de fermeture
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.remove();
            }
        }
    });
}

// Gestion des achats améliorée
function buyTicket(planType, price) {
    console.log(`🎫 Achat de ticket: ${planType} - ${price} FC`);
    
    try {
        selectedPlan = planType;
        selectedPrice = price;
        
        // Vérifier si l'utilisateur est connecté
        if (!window.userManager || !window.userManager.currentUser) {
            showAlert('Vous devez être connecté pour acheter un ticket', 'warning');
            showUserLoginModal();
            return;
        }
        
        // Mettre à jour les détails dans le modal
        const selectedPlanElement = document.getElementById('selected-plan');
        const selectedPriceElement = document.getElementById('selected-price');
        
        if (selectedPlanElement) {
            selectedPlanElement.textContent = getPlanName(planType);
        }
        if (selectedPriceElement) {
            selectedPriceElement.textContent = price;
        }
        
        // Afficher le modal de paiement
        const paymentModal = document.getElementById('payment-modal');
        if (paymentModal) {
            paymentModal.classList.remove('hidden');
        } else {
            // Créer le modal de paiement s'il n'existe pas
            createPaymentModal(planType, price);
        }
        
        showAlert('Prêt pour le paiement!', 'success');
        
    } catch (error) {
        handleError(error, 'Achat de ticket');
    }
}

// Créer le modal de paiement
function createPaymentModal(planType, price) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'payment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Paiement - ${getPlanName(planType)}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="payment-info">
                    <p><strong>Forfait:</strong> <span id="selected-plan">${getPlanName(planType)}</span></p>
                    <p><strong>Prix:</strong> <span id="selected-price">${price}</span> FC</p>
                    <p><strong>Utilisateur:</strong> ${window.userManager.currentUser.name}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="processPayment()">
                        <i class="fas fa-credit-card"></i> Payer avec Flexpaie
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Fonction pour afficher les alertes
function showAlert(message, type = 'info') {
    if (window.notificationManager) {
        window.notificationManager.addNotification(type, type.charAt(0).toUpperCase() + type.slice(1), message);
    } else {
        alert(message);
    }
}

// Fonction pour gérer les erreurs
function handleError(error, context = 'Application') {
    console.error(`❌ Erreur dans ${context}:`, error);
    showAlert(`Erreur: ${error.message || error}`, 'error');
}

// Améliorer la fonction showDashboard
function showDashboard() {
    console.log('📊 Affichage du tableau de bord...');
    
    try {
        // Vérifier si le gestionnaire de tableau de bord existe
        if (window.dashboardManager) {
            window.dashboardManager.showSection('routers');
        } else {
            // Fallback vers l'ancien système
            showSection('dashboard');
            loadDashboardData();
        }
    } catch (error) {
        handleError(error, 'Tableau de bord');
        // Fallback vers l'ancien système
        showSection('dashboard');
        loadDashboardData();
    }
}

// Fonction pour valider un voucher
function validateVoucher() {
    console.log('🎟️ Validation de voucher...');
    
    try {
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
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> Valider
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                                Annuler
                            </button>
                        </div>
                    </form>
                    <div id="validation-result"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Gérer la soumission du formulaire
        document.getElementById('voucher-validation-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const voucherCode = document.getElementById('voucher-code-input').value.trim();
            
            if (!voucherCode) {
                showAlert('Veuillez entrer un code de voucher', 'warning');
                return;
            }
            
            // Vérifier si le gestionnaire de vouchers existe
            if (!window.voucherManager) {
                window.voucherManager = new VoucherManager();
            }
            
            const result = window.voucherManager.useVoucher(voucherCode);
            
            const resultDiv = document.getElementById('validation-result');
            if (result.success) {
                resultDiv.innerHTML = `
                    <div class="success-message">
                        <h4>✅ Voucher validé avec succès!</h4>
                        <p><strong>Code:</strong> ${voucherCode}</p>
                        <p><strong>Validité:</strong> ${result.voucher.duration}</p>
                        <p><strong>Réseau:</strong> ${WIFI_NETWORK_NAME}</p>
                    </div>
                `;
                showAlert('Voucher validé avec succès!', 'success');
            } else {
                resultDiv.innerHTML = `
                    <div class="error-message">
                        <h4>❌ Échec de validation</h4>
                        <p>${result.message}</p>
                    </div>
                `;
                showAlert(result.message, 'error');
            }
        });
        
    } catch (error) {
        handleError(error, 'Validation de voucher');
    }
}

// Améliorer la fonction showUserLoginModal
function showUserLoginModal() {
    console.log('👤 Affichage du modal de connexion...');
    
    try {
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
                            <input type="email" id="user-email" placeholder="exemple@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="user-phone">Téléphone:</label>
                            <input type="tel" id="user-phone" placeholder="+243 XX XXX XXXX" required>
                        </div>
                        <div class="form-group">
                            <label for="user-name">Nom (pour nouveaux utilisateurs):</label>
                            <input type="text" id="user-name" placeholder="Votre nom complet">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Se connecter
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                                Annuler
                            </button>
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
        
    } catch (error) {
        handleError(error, 'Modal de connexion');
    }
}

// Améliorer handleUserLogin
function handleUserLogin() {
    console.log('🔐 Tentative de connexion utilisateur...');
    
    try {
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();
        const name = document.getElementById('user-name').value.trim();
        
        if (!email || !phone) {
            showAlert('Email et téléphone sont requis', 'warning');
            return;
        }
        
        // Initialiser le gestionnaire d'utilisateurs si nécessaire
        if (!window.userManager) {
            window.userManager = new UserManager();
        }
        
        // Tenter de se connecter
        let user = window.userManager.authenticateUser(email, phone);
        
        // Si l'utilisateur n'existe pas et qu'un nom est fourni, créer un nouveau compte
        if (!user && name) {
            user = window.userManager.createUser(email, phone, name);
            showAlert(`Bienvenue ${name}! Compte créé avec succès.`, 'success');
        } else if (!user) {
            showAlert('Utilisateur non trouvé. Veuillez fournir votre nom pour créer un compte.', 'error');
            return;
        } else {
            showAlert(`Bienvenue ${user.name}! Connexion réussie.`, 'success');
        }
        
        // Mettre à jour l'interface utilisateur
        updateUserInterface();
        
        // Fermer le modal
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
        
    } catch (error) {
        handleError(error, 'Connexion utilisateur');
    }
}

// Améliorer updateUserInterface
function updateUserInterface() {
    try {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            if (window.userManager && window.userManager.currentUser) {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${window.userManager.currentUser.name}`;
                loginBtn.onclick = showUserProfile;
            } else {
                loginBtn.innerHTML = '<i class="fas fa-user"></i> Connexion';
                loginBtn.onclick = showUserLoginModal;
            }
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'interface:', error);
    }
}

// Fonction pour afficher le profil utilisateur
function showUserProfile() {
    if (!window.userManager || !window.userManager.currentUser) {
        showUserLoginModal();
        return;
    }
    
    const user = window.userManager.currentUser;
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
                    <p><strong>Nom:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Téléphone:</strong> ${user.phone}</p>
                    <p><strong>Total dépensé:</strong> ${user.totalSpent} FC</p>
                    <p><strong>Vouchers achetés:</strong> ${user.totalVouchers}</p>
                    <p><strong>Membre depuis:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-danger" onclick="logoutUser()">
                        <i class="fas fa-sign-out-alt"></i> Déconnexion
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Fonction de déconnexion
function logoutUser() {
    if (window.userManager) {
        window.userManager.currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserInterface();
        showAlert('Déconnexion réussie', 'success');
    }
    
    // Fermer le modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM chargé, initialisation de l\'application...');
    
    // Attendre que tous les scripts soient chargés
    setTimeout(() => {
        initializeApp();
    }, 100);
});

// Fonction globale pour debug
window.debugApp = function() {
    console.log('🔍 État de l\'application:', {
        userManager: window.userManager,
        voucherManager: window.voucherManager,
        dashboardManager: window.dashboardManager,
        notificationManager: window.notificationManager,
        currentUser: window.userManager ? window.userManager.currentUser : null
    });
};

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

// Fonction pour ouvrir un modal spécifique
function openModal(modalId) {
    // Fermer tous les modaux d'abord
    closeModal();
    
    // Ouvrir le modal spécifique
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Fonction pour empêcher l'ouverture automatique de modaux
function preventAutoModals() {
    // S'assurer que tous les modaux sont fermés
    closeModal();
    
    // Nettoyer le localStorage des éventuels flags de modal
    localStorage.removeItem('autoOpenModal');
    localStorage.removeItem('showVoucherModal');
}

// Fermer les modales en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
});

// Fermer les modales avec la touche Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
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
    console.log('👤 Affichage du modal de connexion...');
    
    try {
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
                            <input type="email" id="user-email" placeholder="exemple@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="user-phone">Téléphone:</label>
                            <input type="tel" id="user-phone" placeholder="+243 XX XXX XXXX" required>
                        </div>
                        <div class="form-group">
                            <label for="user-name">Nom (pour nouveaux utilisateurs):</label>
                            <input type="text" id="user-name" placeholder="Votre nom complet">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Se connecter
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                                Annuler
                            </button>
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
        
    } catch (error) {
        handleError(error, 'Modal de connexion');
    }
}

// Améliorer handleUserLogin
function handleUserLogin() {
    console.log('🔐 Tentative de connexion utilisateur...');
    
    try {
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();
        const name = document.getElementById('user-name').value.trim();
        
        if (!email || !phone) {
            showAlert('Email et téléphone sont requis', 'warning');
            return;
        }
        
        // Initialiser le gestionnaire d'utilisateurs si nécessaire
        if (!window.userManager) {
            window.userManager = new UserManager();
        }
        
        // Tenter de se connecter
        let user = window.userManager.authenticateUser(email, phone);
        
        // Si l'utilisateur n'existe pas et qu'un nom est fourni, créer un nouveau compte
        if (!user && name) {
            user = window.userManager.createUser(email, phone, name);
            showAlert(`Bienvenue ${name}! Compte créé avec succès.`, 'success');
        } else if (!user) {
            showAlert('Utilisateur non trouvé. Veuillez fournir votre nom pour créer un compte.', 'error');
            return;
        } else {
            showAlert(`Bienvenue ${user.name}! Connexion réussie.`, 'success');
        }
        
        // Mettre à jour l'interface utilisateur
        updateUserInterface();
        
        // Fermer le modal
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
        
    } catch (error) {
        handleError(error, 'Connexion utilisateur');
    }
}

// Fonction pour traiter le paiement
function processPayment() {
    console.log('💳 Traitement du paiement...');
    
    try {
        if (!window.userManager || !window.userManager.currentUser) {
            showAlert('Vous devez être connecté pour effectuer un paiement', 'error');
            return;
        }
        
        if (!selectedPlan || !selectedPrice) {
            showAlert('Erreur: Plan ou prix non sélectionné', 'error');
            return;
        }
        
        const user = window.userManager.currentUser;
        
        // Simuler le paiement Flexpaie
        showAlert('Redirection vers Flexpaie...', 'info');
        
        // Créer un faux processus de paiement
        setTimeout(() => {
            const isPaymentSuccess = Math.random() > 0.2; // 80% de réussite
            
            if (isPaymentSuccess) {
                // Générer le voucher
                if (!window.voucherManager) {
                    window.voucherManager = new VoucherManager();
                }
                
                const voucher = window.voucherManager.generateVoucher(selectedPlan, selectedPrice, user.id);
                
                // Mettre à jour les statistiques utilisateur
                window.userManager.updateUserStats(user.id, selectedPrice);
                
                // Afficher le voucher
                showVoucherResult(voucher);
                
                // Fermer le modal de paiement
                const paymentModal = document.querySelector('#payment-modal');
                if (paymentModal) {
                    paymentModal.remove();
                }
                
                showAlert('Paiement réussi! Voucher généré.', 'success');
                
            } else {
                showAlert('Échec du paiement. Veuillez réessayer.', 'error');
            }
        }, 2000);
        
    } catch (error) {
        handleError(error, 'Traitement du paiement');
    }
}

// Fonction pour afficher le résultat du voucher
function showVoucherResult(voucher) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎉 Voucher Généré avec Succès!</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="voucher-result">
                    <div class="voucher-card">
                        <h4>Votre Code WiFi</h4>
                        <div class="voucher-code">${voucher.code}</div>
                        <div class="voucher-details">
                            <p><strong>Forfait:</strong> ${getPlanName(voucher.plan)}</p>
                            <p><strong>Prix:</strong> ${voucher.price} FC</p>
                            <p><strong>Valide jusqu'au:</strong> ${new Date(voucher.expiresAt).toLocaleDateString()}</p>
                            <p><strong>Réseau:</strong> ${WIFI_NETWORK_NAME}</p>
                        </div>
                    </div>
                    <div class="instructions">
                        <h5>Instructions d'utilisation:</h5>
                        <ol>
                            <li>Connectez-vous au réseau <strong>${WIFI_NETWORK_NAME}</strong></li>
                            <li>Ouvrez votre navigateur</li>
                            <li>Entrez le code: <strong>${voucher.code}</strong></li>
                            <li>Cliquez sur "Se connecter"</li>
                        </ol>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="copyVoucherCode('${voucher.code}')">
                        <i class="fas fa-copy"></i> Copier le Code
                    </button>
                    <button class="btn btn-secondary" onclick="printVoucher('${voucher.code}')">
                        <i class="fas fa-print"></i> Imprimer
                    </button>
                    <button class="btn btn-success" onclick="sendVoucherSMS('${voucher.code}')">
                        <i class="fas fa-sms"></i> Envoyer par SMS
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Fonction pour copier le code voucher
function copyVoucherCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showAlert('Code copié dans le presse-papiers!', 'success');
    }).catch(() => {
        // Fallback pour les navigateurs qui ne supportent pas clipboard
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showAlert('Code copié!', 'success');
    });
}

// Fonction pour imprimer le voucher
function printVoucher(code) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Voucher WiFi - ${code}</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .voucher { border: 2px solid #007bff; padding: 20px; margin: 20px auto; max-width: 400px; }
                .code { font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0; }
                .network { font-size: 18px; color: #333; }
            </style>
        </head>
        <body>
            <div class="voucher">
                <h2>WiFi Bisou Bisou</h2>
                <div class="code">${code}</div>
                <div class="network">Réseau: ${WIFI_NETWORK_NAME}</div>
                <p>Valide jusqu'au: ${new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Fonction pour envoyer par SMS (simulation)
function sendVoucherSMS(code) {
    if (!window.userManager || !window.userManager.currentUser) {
        showAlert('Erreur: Utilisateur non connecté', 'error');
        return;
    }
    
    const user = window.userManager.currentUser;
    
    // Simuler l'envoi SMS
    showAlert('Envoi du SMS...', 'info');
    
    setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% de réussite
        
        if (isSuccess) {
            showAlert(`SMS envoyé à ${user.phone} avec le code ${code}`, 'success');
        } else {
            showAlert('Échec de l\'envoi SMS. Veuillez réessayer.', 'error');
        }
    }, 2000);
}

// Fonction pour charger les données du tableau de bord
function loadDashboardData() {
    console.log('📊 Chargement des données du tableau de bord...');
    
    try {
        // Vérifier si les gestionnaires existent
        if (!window.voucherManager) {
            window.voucherManager = new VoucherManager();
        }
        
        if (!window.userManager) {
            window.userManager = new UserManager();
        }
        
        // Calculer les statistiques
        const stats = {
            totalVouchers: window.voucherManager.vouchers.length,
            activeVouchers: window.voucherManager.vouchers.filter(v => v.status === 'active').length,
            usedVouchers: window.voucherManager.usedVouchers.length,
            totalUsers: window.userManager.users.length,
            totalRevenue: window.userManager.users.reduce((sum, user) => sum + user.totalSpent, 0)
        };
        
        // Mettre à jour l'interface
        updateDashboardStats(stats);
        
        console.log('✅ Données du tableau de bord chargées');
        
    } catch (error) {
        handleError(error, 'Chargement du tableau de bord');
    }
}

// Fonction pour mettre à jour les statistiques du tableau de bord
function updateDashboardStats(stats) {
    const elements = {
        'total-vouchers': stats.totalVouchers,
        'active-vouchers': stats.activeVouchers,
        'used-vouchers': stats.usedVouchers,
        'total-users': stats.totalUsers,
        'total-revenue': stats.totalRevenue + ' FC'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Fonction pour afficher les statistiques détaillées
function showDetailedStats() {
    console.log('📈 Affichage des statistiques détaillées...');
    
    try {
        if (!window.voucherManager) {
            window.voucherManager = new VoucherManager();
        }
        
        if (!window.userManager) {
            window.userManager = new UserManager();
        }
        
        const stats = {
            vouchers: {
                total: window.voucherManager.vouchers.length,
                active: window.voucherManager.vouchers.filter(v => v.status === 'active').length,
                used: window.voucherManager.usedVouchers.length,
                expired: window.voucherManager.vouchers.filter(v => v.status === 'expired').length
            },
            users: {
                total: window.userManager.users.length,
                active: window.userManager.users.filter(u => u.isActive).length
            },
            revenue: {
                total: window.userManager.users.reduce((sum, user) => sum + user.totalSpent, 0),
                today: calculateTodayRevenue(),
                thisMonth: calculateMonthRevenue()
            }
        };
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📊 Statistiques Détaillées</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h4>Vouchers</h4>
                            <p>Total: ${stats.vouchers.total}</p>
                            <p>Actifs: ${stats.vouchers.active}</p>
                            <p>Utilisés: ${stats.vouchers.used}</p>
                            <p>Expirés: ${stats.vouchers.expired}</p>
                        </div>
                        <div class="stat-card">
                            <h4>Utilisateurs</h4>
                            <p>Total: ${stats.users.total}</p>
                            <p>Actifs: ${stats.users.active}</p>
                        </div>
                        <div class="stat-card">
                            <h4>Revenus</h4>
                            <p>Total: ${stats.revenue.total} FC</p>
                            <p>Aujourd'hui: ${stats.revenue.today} FC</p>
                            <p>Ce mois: ${stats.revenue.thisMonth} FC</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
    } catch (error) {
        handleError(error, 'Statistiques détaillées');
    }
}

// Fonction pour calculer les revenus du jour
function calculateTodayRevenue() {
    const today = new Date().toDateString();
    return window.voucherManager.vouchers
        .filter(v => new Date(v.createdAt).toDateString() === today)
        .reduce((sum, v) => sum + v.price, 0);
}

// Fonction pour calculer les revenus du mois
function calculateMonthRevenue() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return window.voucherManager.vouchers
        .filter(v => {
            const voucherDate = new Date(v.createdAt);
            return voucherDate.getMonth() === thisMonth && voucherDate.getFullYear() === thisYear;
        })
        .reduce((sum, v) => sum + v.price, 0);
}

// Fonction pour charger une section spécifique du tableau de bord
function loadDashboardSection(section) {
    console.log(`📋 Chargement de la section: ${section}`);
    
    try {
        // Vérifier si le gestionnaire de tableau de bord existe
        if (window.dashboardManager && typeof window.dashboardManager.showSection === 'function') {
            window.dashboardManager.showSection(section);
        } else {
            // Fallback pour les sections de base
            switch (section) {
                case 'overview':
                    loadDashboardData();
                    break;
                case 'vouchers':
                    showVoucherList();
                    break;
                case 'users':
                    showUserList();
                    break;
                case 'stats':
                    showDetailedStats();
                    break;
                default:
                    console.warn(`Section inconnue: ${section}`);
            }
        }
        
    } catch (error) {
        handleError(error, `Section ${section}`);
    }
}

// Fonction pour afficher la liste des vouchers
function showVoucherList() {
    if (!window.voucherManager) {
        window.voucherManager = new VoucherManager();
    }
    
    const vouchers = window.voucherManager.vouchers;
    console.log('🎟️ Affichage de la liste des vouchers:', vouchers.length);
    
    // Cette fonction pourrait être étendue pour afficher une liste complète
    showAlert(`${vouchers.length} vouchers trouvés`, 'info');
}

// Fonction pour afficher la liste des utilisateurs
function showUserList() {
    if (!window.userManager) {
        window.userManager = new UserManager();
    }
    
    const users = window.userManager.users;
    console.log('👥 Affichage de la liste des utilisateurs:', users.length);
    
    // Cette fonction pourrait être étendue pour afficher une liste complète
    showAlert(`${users.length} utilisateurs trouvés`, 'info');
}
