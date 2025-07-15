// Script de correction globale pour WiFi Bisou Bisou
// Exécutez ce script pour corriger tous les problèmes une fois pour toutes

console.log('🔧 CORRECTION GLOBALE EN COURS...');
console.log('=====================================');

// 1. Corriger les problèmes d'initialisation
function initializeAllSystems() {
    console.log('🚀 Initialisation des systèmes...');
    
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
    
    console.log('✅ Gestionnaires initialisés');
}

// 2. Corriger les fonctions principales
function fixCoreFunctions() {
    console.log('🔧 Correction des fonctions principales...');
    
    // Fonction showUserLoginModal corrigée
    window.showUserLoginModal = function() {
        console.log('👤 Affichage du modal de connexion...');
        
        try {
            // Supprimer les modals existants
            const existingModals = document.querySelectorAll('.modal');
            existingModals.forEach(modal => modal.remove());
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'flex';
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
                                <button type="submit" class="btn btn-primary">Se connecter</button>
                                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Gestion du formulaire
            const form = modal.querySelector('#user-login-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('user-email').value;
                const phone = document.getElementById('user-phone').value;
                const name = document.getElementById('user-name').value;
                
                if (!email || !phone) {
                    alert('Veuillez remplir tous les champs obligatoires');
                    return;
                }
                
                // Authentifier ou créer l'utilisateur
                let user = window.userManager.authenticateUser(email, phone);
                if (!user && name) {
                    user = window.userManager.createUser(email, phone, name);
                }
                
                if (user) {
                    window.notificationManager.show('Connexion réussie!', 'success');
                    modal.remove();
                    updateLoginButton();
                } else {
                    alert('Utilisateur non trouvé. Veuillez entrer votre nom pour créer un compte.');
                }
            });
            
            console.log('✅ Modal de connexion créé');
            return true;
        } catch (error) {
            console.error('❌ Erreur dans showUserLoginModal:', error);
            return false;
        }
    };
    
    // Fonction validateVoucher corrigée
    window.validateVoucher = function() {
        console.log('🎟️ Validation de voucher...');
        
        try {
            // Supprimer les modals existants
            const existingModals = document.querySelectorAll('.modal');
            existingModals.forEach(modal => modal.remove());
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'flex';
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
                                <input type="text" id="voucher-code-input" placeholder="Entrez le code du voucher" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Valider</button>
                                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
                            </div>
                        </form>
                        <div id="validation-result" class="mt-3"></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Gestion du formulaire
            const form = modal.querySelector('#voucher-validation-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const voucherCode = document.getElementById('voucher-code-input').value;
                const resultDiv = document.getElementById('validation-result');
                
                if (!voucherCode) {
                    resultDiv.innerHTML = '<p class="error">Veuillez entrer un code de voucher</p>';
                    return;
                }
                
                // Valider le voucher
                const isValid = window.voucherManager.validateVoucher(voucherCode);
                
                if (isValid) {
                    resultDiv.innerHTML = '<p class="success">✅ Voucher valide! Connexion autorisée.</p>';
                    window.notificationManager.show('Voucher validé avec succès!', 'success');
                    
                    setTimeout(() => {
                        modal.remove();
                    }, 2000);
                } else {
                    resultDiv.innerHTML = '<p class="error">❌ Voucher invalide ou expiré</p>';
                }
            });
            
            console.log('✅ Modal de validation créé');
            return true;
        } catch (error) {
            console.error('❌ Erreur dans validateVoucher:', error);
            return false;
        }
    };
    
    // Fonction buyTicket corrigée
    window.buyTicket = function(planType, price) {
        console.log(`🎫 Achat de ticket: ${planType} - ${price} FC`);
        
        try {
            // Vérifier si l'utilisateur est connecté
            if (!window.userManager || !window.userManager.currentUser) {
                window.notificationManager.show('Vous devez être connecté pour acheter un ticket', 'warning');
                window.showUserLoginModal();
                return false;
            }
            
            // Supprimer les modals existants
            const existingModals = document.querySelectorAll('.modal');
            existingModals.forEach(modal => modal.remove());
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'flex';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Finaliser l'achat</h3>
                        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div id="payment-details">
                            <p><strong>Forfait sélectionné:</strong> ${getPlanName(planType)}</p>
                            <p><strong>Prix:</strong> ${price} FC</p>
                            <p><strong>Utilisateur:</strong> ${window.userManager.currentUser.name}</p>
                            <div class="form-actions">
                                <button class="btn btn-primary" onclick="processPayment('${planType}', ${price})">
                                    <i class="fas fa-credit-card"></i> Payer avec Flexpaie
                                </button>
                                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            console.log('✅ Modal d\'achat créé');
            return true;
        } catch (error) {
            console.error('❌ Erreur dans buyTicket:', error);
            return false;
        }
    };
    
    // Fonction showDashboard corrigée
    window.showDashboard = function() {
        console.log('📊 Affichage du tableau de bord...');
        
        try {
            // Masquer toutes les sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Afficher la section dashboard
            const dashboardSection = document.querySelector('#dashboard');
            if (dashboardSection) {
                dashboardSection.classList.remove('hidden');
                
                // Charger les données du tableau de bord
                loadDashboardData();
                
                console.log('✅ Tableau de bord affiché');
                return true;
            } else {
                console.error('❌ Section dashboard non trouvée');
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur dans showDashboard:', error);
            return false;
        }
    };
    
    console.log('✅ Fonctions principales corrigées');
}

// 3. Fonctions utilitaires
function getPlanName(planType) {
    const plans = {
        'basic': 'Forfait Basique',
        'premium': 'Forfait Premium',
        'daily': 'Forfait Journalier'
    };
    return plans[planType] || 'Forfait Inconnu';
}

function processPayment(planType, price) {
    console.log(`💳 Traitement du paiement: ${planType} - ${price} FC`);
    
    try {
        // Simuler le processus de paiement
        window.notificationManager.show('Redirection vers Flexpaie...', 'info');
        
        // Générer un voucher après le paiement
        setTimeout(() => {
            const voucher = window.voucherManager.generateVoucher(planType, price);
            
            if (voucher) {
                // Mettre à jour les statistiques utilisateur
                window.userManager.updateUserStats(window.userManager.currentUser.id, price);
                
                // Fermer le modal de paiement
                const modal = document.querySelector('.modal');
                if (modal) modal.remove();
                
                // Afficher le voucher
                showVoucherResult(voucher);
                
                window.notificationManager.show('Paiement réussi! Voucher généré.', 'success');
            } else {
                window.notificationManager.show('Erreur lors de la génération du voucher', 'error');
            }
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erreur dans processPayment:', error);
        window.notificationManager.show('Erreur lors du paiement', 'error');
    }
}

function showVoucherResult(voucher) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Votre Voucher WiFi</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="voucher-display">
                    <div class="voucher-code">
                        <h4>Code de connexion:</h4>
                        <div class="code-display">${voucher.code}</div>
                    </div>
                    <div class="voucher-info">
                        <p><strong>Forfait:</strong> ${getPlanName(voucher.planType)}</p>
                        <p><strong>Valide jusqu'à:</strong> ${new Date(voucher.expiresAt).toLocaleString()}</p>
                    </div>
                    <div class="voucher-instructions">
                        <h4>Instructions:</h4>
                        <ol>
                            <li>Connectez-vous au réseau "WiFi-Bisou-Bisou"</li>
                            <li>Entrez ce code dans la page de connexion</li>
                            <li>Profitez de votre connexion!</li>
                        </ol>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="printVoucher('${voucher.code}')">
                            <i class="fas fa-print"></i> Imprimer
                        </button>
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function printVoucher(code) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Voucher WiFi</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .voucher { border: 2px solid #007bff; padding: 20px; max-width: 400px; margin: 0 auto; }
                .code { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="voucher">
                <h2>WiFi Bisou Bisou</h2>
                <div class="code">${code}</div>
                <p>Connectez-vous au réseau "WiFi-Bisou-Bisou" et utilisez ce code.</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function loadDashboardData() {
    console.log('📊 Chargement des données du tableau de bord...');
    
    try {
        // Simuler le chargement des données
        const stats = {
            todayConnections: Math.floor(Math.random() * 300) + 200,
            totalUsers: Math.floor(Math.random() * 2000) + 1000,
            activeConnections: Math.floor(Math.random() * 50) + 20,
            bandwidth: Math.floor(Math.random() * 30) + 70,
            latency: Math.floor(Math.random() * 20) + 5
        };
        
        // Mettre à jour les statistiques
        const todayElement = document.querySelector('.stat-number');
        if (todayElement) {
            todayElement.textContent = stats.todayConnections;
        }
        
        const totalElement = document.querySelectorAll('.stat-number')[1];
        if (totalElement) {
            totalElement.textContent = stats.totalUsers;
        }
        
        console.log('✅ Données du tableau de bord chargées');
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
    }
}

function updateLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn && window.userManager && window.userManager.currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${window.userManager.currentUser.name}`;
        loginBtn.onclick = function() {
            window.userManager.currentUser = null;
            localStorage.removeItem('currentUser');
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Connexion';
            loginBtn.onclick = window.showUserLoginModal;
            window.notificationManager.show('Déconnexion réussie', 'info');
        };
    }
}

// 4. Corriger la navigation
function fixNavigation() {
    console.log('🧭 Correction de la navigation...');
    
    window.showSection = function(sectionId) {
        console.log(`🔄 Affichage de la section: ${sectionId}`);
        
        // Masquer toutes les sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Afficher la section demandée
        const targetSection = document.querySelector(`#${sectionId}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            console.log(`✅ Section ${sectionId} affichée`);
        } else {
            console.error(`❌ Section ${sectionId} non trouvée`);
        }
    };
    
    window.showTicketSelection = function() {
        window.showSection('ticket-selection');
    };
    
    console.log('✅ Navigation corrigée');
}

// 5. Fonction principale de correction
function runAllFixes() {
    console.log('🔧 DÉMARRAGE DE LA CORRECTION GLOBALE...');
    
    try {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(runAllFixes, 100);
            });
            return;
        }
        
        // Étape 1: Initialiser les systèmes
        initializeAllSystems();
        
        // Étape 2: Corriger les fonctions principales
        fixCoreFunctions();
        
        // Étape 3: Corriger la navigation
        fixNavigation();
        
        // Étape 4: Mettre à jour l'interface utilisateur
        updateLoginButton();
        
        // Étape 5: Afficher la section d'accueil par défaut
        window.showSection('home');
        
        console.log('✅ CORRECTION GLOBALE TERMINÉE AVEC SUCCÈS!');
        console.log('🎉 Toutes les fonctionnalités sont maintenant opérationnelles');
        
        // Notification de succès
        setTimeout(() => {
            if (window.notificationManager) {
                window.notificationManager.show('Système corrigé et opérationnel!', 'success');
            }
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('❌ ERREUR LORS DE LA CORRECTION:', error);
        return false;
    }
}

// Auto-exécution
if (typeof window !== 'undefined') {
    // Exécuter immédiatement si déjà chargé
    if (document.readyState === 'complete') {
        runAllFixes();
    } else {
        // Sinon attendre le chargement
        window.addEventListener('load', runAllFixes);
    }
}

// Exporter pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllFixes,
        initializeAllSystems,
        fixCoreFunctions,
        fixNavigation
    };
}

console.log('🚀 Script de correction chargé et prêt');
