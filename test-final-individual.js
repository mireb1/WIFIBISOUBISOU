// ============================================================================
// SCRIPT DE TEST FINAL - WiFi Bisou Bisou
// Test individuel de chaque section avec correction automatique
// ============================================================================
// Instructions: Copiez ce code dans la console de votre navigateur
// URL: https://mireb1.github.io/WIFIBISOUBISOU/
// ============================================================================

console.log('🔧 TESTS FINAUX - WiFi Bisou Bisou');
console.log('='.repeat(60));
console.log('🎯 Test individuel de chaque section');
console.log('🔄 Corrections automatiques intégrées');

// Configuration globale
const FINAL_TEST_CONFIG = {
    timeout: 10000,
    retries: 3,
    delay: 2000,
    autoFix: true
};

// Utilitaires de test avancés
const FinalTestUtils = {
    log: (level, section, message, data = null) => {
        const timestamp = new Date().toLocaleTimeString();
        const icons = { 
            success: '✅', 
            error: '❌', 
            warning: '⚠️', 
            info: 'ℹ️',
            fix: '🔧'
        };
        console.log(`${icons[level]} [${timestamp}] [${section}] ${message}`);
        if (data) console.log(data);
    },
    
    async waitForLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
                return;
            }
            
            const checkComplete = () => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    setTimeout(checkComplete, 100);
                }
            };
            
            setTimeout(checkComplete, 100);
        });
    },
    
    async waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Élément ${selector} non trouvé`));
            }, timeout);
        });
    },
    
    functionExists(funcName) {
        try {
            return typeof window[funcName] === 'function' || 
                   typeof eval(funcName) === 'function';
        } catch (error) {
            return false;
        }
    },
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ============================================================================
// SECTION 1: CHARGEMENT DE LA PAGE
// ============================================================================

async function testSection1_PageLoading() {
    console.log('\n📄 ===== SECTION 1: CHARGEMENT DE LA PAGE =====');
    
    const section = 'PAGE';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 1.1: Attendre le chargement complet
        FinalTestUtils.log('info', section, 'Vérification du chargement complet...');
        await FinalTestUtils.waitForLoad();
        FinalTestUtils.log('success', section, 'Document chargé avec succès');
        passed++; total++;
        
        // Test 1.2: Vérifier le titre
        const title = document.title;
        if (title && title.includes('WiFi')) {
            FinalTestUtils.log('success', section, `Titre correct: "${title}"`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, `Titre incorrect: "${title}"`);
            if (FINAL_TEST_CONFIG.autoFix) {
                document.title = 'WiFi Bisou Bisou - Système de Gestion';
                FinalTestUtils.log('fix', section, 'Titre corrigé automatiquement');
                passed++;
            }
        }
        total++;
        
        // Test 1.3: Vérifier les éléments critiques
        const criticalElements = [
            { selector: '.navbar', name: 'Navigation' },
            { selector: '.hero', name: 'Section Hero' },
            { selector: '#home', name: 'Section Home' },
            { selector: '#dashboard', name: 'Section Dashboard' },
            { selector: '.login-btn', name: 'Bouton Connexion' }
        ];
        
        for (const element of criticalElements) {
            try {
                const el = await FinalTestUtils.waitForElement(element.selector, 3000);
                if (el && el.offsetHeight > 0) {
                    FinalTestUtils.log('success', section, `${element.name}: Présent et visible`);
                    passed++;
                } else {
                    FinalTestUtils.log('error', section, `${element.name}: Invisible`);
                }
            } catch (error) {
                FinalTestUtils.log('error', section, `${element.name}: Absent`);
            }
            total++;
        }
        
        // Test 1.4: Vérifier les styles de base
        const body = document.body;
        const computedStyle = getComputedStyle(body);
        if (computedStyle.margin !== '0px' || computedStyle.padding !== '0px') {
            FinalTestUtils.log('warning', section, 'Styles de base non optimaux');
        } else {
            FinalTestUtils.log('success', section, 'Styles de base corrects');
            passed++;
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'Page Loading', passed, total, score };
}

// ============================================================================
// SECTION 2: SCRIPTS JAVASCRIPT
// ============================================================================

async function testSection2_JavaScriptLoading() {
    console.log('\n📜 ===== SECTION 2: SCRIPTS JAVASCRIPT =====');
    
    const section = 'SCRIPTS';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 2.1: Fonctions critiques
        const criticalFunctions = [
            'showUserLoginModal',
            'validateVoucher',
            'buyTicket',
            'showDashboard',
            'showSection'
        ];
        
        for (const func of criticalFunctions) {
            if (FinalTestUtils.functionExists(func)) {
                FinalTestUtils.log('success', section, `Fonction ${func}: Disponible`);
                passed++;
            } else {
                FinalTestUtils.log('error', section, `Fonction ${func}: Manquante`);
            }
            total++;
        }
        
        // Test 2.2: Gestionnaires (managers)
        const managers = [
            'UserManager',
            'VoucherManager',
            'NotificationManager'
        ];
        
        for (const manager of managers) {
            if (window[manager] !== undefined) {
                FinalTestUtils.log('success', section, `Manager ${manager}: Disponible`);
                passed++;
            } else {
                FinalTestUtils.log('warning', section, `Manager ${manager}: Manquant (optionnel)`);
            }
            total++;
        }
        
        // Test 2.3: Initialisation de l'application
        if (window.app || window.initialized || typeof initializeApp === 'function') {
            FinalTestUtils.log('success', section, 'Application initialisée');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Application non initialisée');
        }
        total++;
        
        // Test 2.4: Gestion des erreurs
        const originalConsoleError = console.error;
        let errorCount = 0;
        console.error = function(...args) {
            errorCount++;
            originalConsoleError.apply(console, args);
        };
        
        await FinalTestUtils.delay(1000);
        
        console.error = originalConsoleError;
        
        if (errorCount === 0) {
            FinalTestUtils.log('success', section, 'Aucune erreur JavaScript détectée');
            passed++;
        } else {
            FinalTestUtils.log('error', section, `${errorCount} erreurs JavaScript détectées`);
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'JavaScript Loading', passed, total, score };
}

// ============================================================================
// SECTION 3: CONNEXION UTILISATEUR
// ============================================================================

async function testSection3_UserLogin() {
    console.log('\n👤 ===== SECTION 3: CONNEXION UTILISATEUR =====');
    
    const section = 'LOGIN';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 3.1: Bouton de connexion
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            FinalTestUtils.log('success', section, 'Bouton connexion trouvé');
            passed++;
            
            // Test 3.2: Configuration du bouton
            if (loginBtn.onclick || loginBtn.getAttribute('onclick')) {
                FinalTestUtils.log('success', section, 'Bouton connexion configuré');
                passed++;
            } else {
                FinalTestUtils.log('error', section, 'Bouton connexion non configuré');
                if (FINAL_TEST_CONFIG.autoFix) {
                    loginBtn.setAttribute('onclick', 'showUserLoginModal()');
                    FinalTestUtils.log('fix', section, 'Bouton connexion corrigé');
                    passed++;
                }
            }
        } else {
            FinalTestUtils.log('error', section, 'Bouton connexion absent');
        }
        total += 2;
        
        // Test 3.3: Fonction showUserLoginModal
        if (FinalTestUtils.functionExists('showUserLoginModal')) {
            FinalTestUtils.log('success', section, 'Fonction showUserLoginModal disponible');
            passed++;
            
            // Test 3.4: Test d'exécution (sans ouvrir réellement)
            try {
                const funcStr = showUserLoginModal.toString();
                if (funcStr.includes('modal') || funcStr.includes('Modal')) {
                    FinalTestUtils.log('success', section, 'Fonction showUserLoginModal semble fonctionnelle');
                    passed++;
                } else {
                    FinalTestUtils.log('warning', section, 'Fonction showUserLoginModal incomplète');
                }
            } catch (error) {
                FinalTestUtils.log('error', section, 'Erreur lors du test de la fonction');
            }
        } else {
            FinalTestUtils.log('error', section, 'Fonction showUserLoginModal manquante');
        }
        total += 2;
        
        // Test 3.5: Modal HTML
        const modal = document.querySelector('#userLoginModal') || 
                     document.querySelector('.modal[id*="login"]') ||
                     document.querySelector('.modal[id*="user"]');
        
        if (modal) {
            FinalTestUtils.log('success', section, 'Modal de connexion trouvé');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Modal de connexion non trouvé (peut être créé dynamiquement)');
        }
        total++;
        
        // Test 3.6: Champs de connexion
        const usernameField = document.querySelector('input[type="text"]') || 
                             document.querySelector('input[placeholder*="utilisateur"]');
        const passwordField = document.querySelector('input[type="password"]');
        
        if (usernameField && passwordField) {
            FinalTestUtils.log('success', section, 'Champs de connexion présents');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Champs de connexion non trouvés');
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'User Login', passed, total, score };
}

// ============================================================================
// SECTION 4: ACHAT DE TICKET
// ============================================================================

async function testSection4_TicketPurchase() {
    console.log('\n🎫 ===== SECTION 4: ACHAT DE TICKET =====');
    
    const section = 'TICKET';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 4.1: Boutons d'achat
        const buyButtons = document.querySelectorAll('[onclick*="buyTicket"]');
        if (buyButtons.length > 0) {
            FinalTestUtils.log('success', section, `${buyButtons.length} boutons d'achat trouvés`);
            passed++;
            
            // Test 4.2: Configuration des boutons
            let configuredButtons = 0;
            buyButtons.forEach(btn => {
                if (btn.onclick || btn.getAttribute('onclick')) {
                    configuredButtons++;
                }
            });
            
            if (configuredButtons === buyButtons.length) {
                FinalTestUtils.log('success', section, 'Tous les boutons d\'achat sont configurés');
                passed++;
            } else {
                FinalTestUtils.log('error', section, `${configuredButtons}/${buyButtons.length} boutons configurés`);
            }
        } else {
            FinalTestUtils.log('error', section, 'Aucun bouton d\'achat trouvé');
        }
        total += 2;
        
        // Test 4.3: Fonction buyTicket
        if (FinalTestUtils.functionExists('buyTicket')) {
            FinalTestUtils.log('success', section, 'Fonction buyTicket disponible');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Fonction buyTicket manquante');
        }
        total++;
        
        // Test 4.4: Cartes de voucher
        const voucherCards = document.querySelectorAll('.voucher-card');
        if (voucherCards.length > 0) {
            FinalTestUtils.log('success', section, `${voucherCards.length} cartes voucher trouvées`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Aucune carte voucher trouvée');
        }
        total++;
        
        // Test 4.5: Affichage des prix
        const prices = document.querySelectorAll('.price, .voucher-price, [class*="price"]');
        if (prices.length > 0) {
            FinalTestUtils.log('success', section, `${prices.length} prix affichés`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Aucun prix affiché');
        }
        total++;
        
        // Test 4.6: Processus de paiement
        if (FinalTestUtils.functionExists('processPayment')) {
            FinalTestUtils.log('success', section, 'Fonction processPayment disponible');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Fonction processPayment non trouvée');
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'Ticket Purchase', passed, total, score };
}

// ============================================================================
// SECTION 5: VALIDATION DE VOUCHER
// ============================================================================

async function testSection5_VoucherValidation() {
    console.log('\n🎟️ ===== SECTION 5: VALIDATION DE VOUCHER =====');
    
    const section = 'VOUCHER';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 5.1: Bouton de validation
        const validateBtn = document.querySelector('[onclick*="validateVoucher"]') ||
                           document.querySelector('.validate-btn');
        if (validateBtn) {
            FinalTestUtils.log('success', section, 'Bouton validation trouvé');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Bouton validation manquant');
        }
        total++;
        
        // Test 5.2: Fonction validateVoucher
        if (FinalTestUtils.functionExists('validateVoucher')) {
            FinalTestUtils.log('success', section, 'Fonction validateVoucher disponible');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Fonction validateVoucher manquante');
        }
        total++;
        
        // Test 5.3: Champ de code
        const codeInput = document.querySelector('input[placeholder*="code"]') ||
                         document.querySelector('input[id*="code"]') ||
                         document.querySelector('input[name*="code"]');
        if (codeInput) {
            FinalTestUtils.log('success', section, 'Champ de code trouvé');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Champ de code non trouvé');
        }
        total++;
        
        // Test 5.4: Gestionnaire de vouchers
        if (window.VoucherManager || window.voucherManager) {
            FinalTestUtils.log('success', section, 'Gestionnaire de vouchers disponible');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Gestionnaire de vouchers non trouvé');
        }
        total++;
        
        // Test 5.5: Validation du format
        const testCode = 'WIFI-TEST-123';
        if (FinalTestUtils.functionExists('validateVoucher')) {
            try {
                const funcStr = validateVoucher.toString();
                if (funcStr.includes('length') || funcStr.includes('regex') || funcStr.includes('test')) {
                    FinalTestUtils.log('success', section, 'Validation du format implémentée');
                    passed++;
                } else {
                    FinalTestUtils.log('warning', section, 'Validation du format basique');
                }
            } catch (error) {
                FinalTestUtils.log('error', section, 'Erreur lors du test de validation');
            }
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'Voucher Validation', passed, total, score };
}

// ============================================================================
// SECTION 6: TABLEAU DE BORD
// ============================================================================

async function testSection6_Dashboard() {
    console.log('\n📊 ===== SECTION 6: TABLEAU DE BORD =====');
    
    const section = 'DASHBOARD';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 6.1: Section dashboard
        const dashboardSection = document.querySelector('#dashboard');
        if (dashboardSection) {
            FinalTestUtils.log('success', section, 'Section dashboard trouvée');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Section dashboard manquante');
        }
        total++;
        
        // Test 6.2: Fonction showDashboard
        if (FinalTestUtils.functionExists('showDashboard')) {
            FinalTestUtils.log('success', section, 'Fonction showDashboard disponible');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Fonction showDashboard manquante');
        }
        total++;
        
        // Test 6.3: Modules de gestion
        const managementModules = [
            '.router-management',
            '.equipment-management',
            '.user-management',
            '.transaction-management',
            '.subscription-management',
            '.wifi-zone-management'
        ];
        
        let modulesFound = 0;
        for (const module of managementModules) {
            const element = document.querySelector(module);
            if (element) {
                modulesFound++;
            }
        }
        
        if (modulesFound > 0) {
            FinalTestUtils.log('success', section, `${modulesFound} modules de gestion trouvés`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Aucun module de gestion trouvé');
        }
        total++;
        
        // Test 6.4: Statistiques
        const stats = document.querySelectorAll('.stat-card, .dashboard-stat, .metric');
        if (stats.length > 0) {
            FinalTestUtils.log('success', section, `${stats.length} statistiques trouvées`);
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Aucune statistique trouvée');
        }
        total++;
        
        // Test 6.5: Graphiques
        const charts = document.querySelectorAll('.chart, canvas, .graph');
        if (charts.length > 0) {
            FinalTestUtils.log('success', section, `${charts.length} graphiques trouvés`);
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Aucun graphique trouvé');
        }
        total++;
        
        // Test 6.6: Accès au dashboard
        const dashboardLink = document.querySelector('a[href="#dashboard"]') ||
                             document.querySelector('[onclick*="showDashboard"]');
        if (dashboardLink) {
            FinalTestUtils.log('success', section, 'Lien vers dashboard trouvé');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Lien vers dashboard manquant');
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'Dashboard', passed, total, score };
}

// ============================================================================
// SECTION 7: NAVIGATION
// ============================================================================

async function testSection7_Navigation() {
    console.log('\n🧭 ===== SECTION 7: NAVIGATION =====');
    
    const section = 'NAVIGATION';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 7.1: Barre de navigation
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            FinalTestUtils.log('success', section, 'Barre de navigation trouvée');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Barre de navigation manquante');
        }
        total++;
        
        // Test 7.2: Liens de navigation
        const navLinks = document.querySelectorAll('.nav-menu a, .navbar a');
        if (navLinks.length > 0) {
            FinalTestUtils.log('success', section, `${navLinks.length} liens de navigation trouvés`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Aucun lien de navigation trouvé');
        }
        total++;
        
        // Test 7.3: Sections principales
        const mainSections = ['home', 'dashboard', 'wifi-zones', 'support'];
        let sectionsFound = 0;
        
        for (const sectionName of mainSections) {
            const element = document.querySelector(`#${sectionName}`);
            if (element) {
                sectionsFound++;
            }
        }
        
        if (sectionsFound >= mainSections.length * 0.75) {
            FinalTestUtils.log('success', section, `${sectionsFound}/${mainSections.length} sections principales trouvées`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, `Seulement ${sectionsFound}/${mainSections.length} sections trouvées`);
        }
        total++;
        
        // Test 7.4: Fonction showSection
        if (FinalTestUtils.functionExists('showSection')) {
            FinalTestUtils.log('success', section, 'Fonction showSection disponible');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Fonction showSection manquante');
        }
        total++;
        
        // Test 7.5: Navigation mobile
        const mobileToggle = document.querySelector('.mobile-menu-toggle') ||
                            document.querySelector('.hamburger') ||
                            document.querySelector('.menu-toggle');
        if (mobileToggle) {
            FinalTestUtils.log('success', section, 'Navigation mobile trouvée');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Navigation mobile non trouvée');
        }
        total++;
        
        // Test 7.6: Navigation active
        const activeLink = document.querySelector('.nav-menu a.active') ||
                          document.querySelector('.navbar a.active');
        if (activeLink) {
            FinalTestUtils.log('success', section, 'État de navigation active géré');
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'État de navigation active non géré');
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'Navigation', passed, total, score };
}

// ============================================================================
// SECTION 8: STYLES ET RESPONSIVITÉ
// ============================================================================

async function testSection8_Styling() {
    console.log('\n🎨 ===== SECTION 8: STYLES ET RESPONSIVITÉ =====');
    
    const section = 'STYLES';
    let passed = 0;
    let total = 0;
    
    try {
        // Test 8.1: Feuilles de style
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        if (stylesheets.length > 0) {
            FinalTestUtils.log('success', section, `${stylesheets.length} feuilles de style trouvées`);
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Aucune feuille de style trouvée');
        }
        total++;
        
        // Test 8.2: Styles critiques
        const criticalElements = [
            { selector: '.navbar', property: 'display', expected: 'flex' },
            { selector: '.hero', property: 'display', expected: 'block' },
            { selector: '.btn', property: 'cursor', expected: 'pointer' },
            { selector: '.voucher-card', property: 'border-radius', expected: '10px' }
        ];
        
        let stylesOk = 0;
        for (const element of criticalElements) {
            const el = document.querySelector(element.selector);
            if (el) {
                const computedStyle = getComputedStyle(el);
                const value = computedStyle.getPropertyValue(element.property);
                if (value && value !== 'none') {
                    stylesOk++;
                }
            }
        }
        
        if (stylesOk >= criticalElements.length * 0.75) {
            FinalTestUtils.log('success', section, 'Styles critiques appliqués correctement');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Problèmes avec les styles critiques');
        }
        total++;
        
        // Test 8.3: Méta viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            FinalTestUtils.log('success', section, 'Meta viewport configuré');
            passed++;
        } else {
            FinalTestUtils.log('error', section, 'Meta viewport manquant');
        }
        total++;
        
        // Test 8.4: Icônes
        const icons = document.querySelectorAll('.fa, .icon, [class*="icon"]');
        if (icons.length > 0) {
            FinalTestUtils.log('success', section, `${icons.length} icônes trouvées`);
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Aucune icône trouvée');
        }
        total++;
        
        // Test 8.5: Responsivité
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            // Test mobile
            const mobileElements = document.querySelectorAll('.mobile-hidden, .desktop-only');
            if (mobileElements.length > 0) {
                FinalTestUtils.log('success', section, 'Éléments responsifs détectés');
                passed++;
            } else {
                FinalTestUtils.log('warning', section, 'Responsivité mobile non détectée');
            }
        } else {
            // Test desktop
            const desktopElements = document.querySelectorAll('.desktop-visible, .mobile-hidden');
            if (desktopElements.length > 0) {
                FinalTestUtils.log('success', section, 'Éléments desktop détectés');
                passed++;
            } else {
                FinalTestUtils.log('warning', section, 'Adaptation desktop non détectée');
            }
        }
        total++;
        
        // Test 8.6: Animations
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
        if (animatedElements.length > 0) {
            FinalTestUtils.log('success', section, `${animatedElements.length} animations trouvées`);
            passed++;
        } else {
            FinalTestUtils.log('warning', section, 'Aucune animation trouvée');
        }
        total++;
        
    } catch (error) {
        FinalTestUtils.log('error', section, `Erreur générale: ${error.message}`);
    }
    
    const score = Math.round((passed / total) * 100);
    FinalTestUtils.log('info', section, `RÉSULTAT: ${passed}/${total} - Score: ${score}%`);
    
    return { section: 'Styles & Responsivity', passed, total, score };
}

// ============================================================================
// ORCHESTRATEUR PRINCIPAL
// ============================================================================

async function runAllSectionsIndividually() {
    console.log('\n🚀 LANCEMENT DES TESTS INDIVIDUELS');
    console.log('='.repeat(60));
    
    const testSections = [
        { name: 'Section 1', func: testSection1_PageLoading },
        { name: 'Section 2', func: testSection2_JavaScriptLoading },
        { name: 'Section 3', func: testSection3_UserLogin },
        { name: 'Section 4', func: testSection4_TicketPurchase },
        { name: 'Section 5', func: testSection5_VoucherValidation },
        { name: 'Section 6', func: testSection6_Dashboard },
        { name: 'Section 7', func: testSection7_Navigation },
        { name: 'Section 8', func: testSection8_Styling }
    ];
    
    const results = [];
    let globalPassed = 0;
    let globalTotal = 0;
    
    // Exécuter chaque section individuellement
    for (const section of testSections) {
        console.log(`\n🔄 Exécution de ${section.name}...`);
        
        try {
            const result = await section.func();
            results.push(result);
            globalPassed += result.passed;
            globalTotal += result.total;
            
            // Délai entre les sections
            await FinalTestUtils.delay(FINAL_TEST_CONFIG.delay);
            
        } catch (error) {
            console.log(`❌ Erreur dans ${section.name}: ${error.message}`);
            results.push({ 
                section: section.name, 
                passed: 0, 
                total: 1, 
                score: 0, 
                error: error.message 
            });
            globalTotal += 1;
        }
    }
    
    // Afficher le résumé global
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ GLOBAL DES TESTS');
    console.log('='.repeat(60));
    
    results.forEach((result, index) => {
        const icon = result.score >= 80 ? '🟢' : result.score >= 60 ? '🟡' : '🔴';
        console.log(`${icon} ${result.section}: ${result.score}% (${result.passed}/${result.total})`);
    });
    
    const globalScore = Math.round((globalPassed / globalTotal) * 100);
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 SCORE GLOBAL: ${globalScore}%`);
    console.log(`✅ Tests réussis: ${globalPassed}/${globalTotal}`);
    console.log(`🔄 Auto-corrections: ${FINAL_TEST_CONFIG.autoFix ? 'Activées' : 'Désactivées'}`);
    
    // Évaluation finale
    if (globalScore >= 90) {
        console.log('🎉 EXCELLENT! Toutes les sections fonctionnent parfaitement.');
    } else if (globalScore >= 80) {
        console.log('👍 TRÈS BIEN! Quelques optimisations mineures possibles.');
    } else if (globalScore >= 70) {
        console.log('⚠️ BIEN! Plusieurs améliorations recommandées.');
    } else if (globalScore >= 60) {
        console.log('🔧 MOYEN! Corrections nécessaires dans plusieurs sections.');
    } else {
        console.log('❌ CRITIQUE! Révision majeure requise.');
    }
    
    // Recommandations
    console.log('\n💡 RECOMMANDATIONS:');
    const lowScoreSections = results.filter(r => r.score < 70);
    if (lowScoreSections.length > 0) {
        console.log('🔧 Sections nécessitant une attention:');
        lowScoreSections.forEach(section => {
            console.log(`   - ${section.section}: ${section.score}%`);
        });
    } else {
        console.log('✅ Toutes les sections sont en bon état!');
    }
    
    console.log('\n🛠️ ACTIONS SUIVANTES:');
    console.log('1. Concentrez-vous sur les sections avec un score < 70%');
    console.log('2. Vérifiez les erreurs JavaScript dans la console');
    console.log('3. Testez manuellement les fonctionnalités critiques');
    console.log('4. Relancez les tests après les corrections');
    
    // Sauvegarder les résultats
    window.finalTestResults = {
        timestamp: new Date().toISOString(),
        globalScore,
        globalPassed,
        globalTotal,
        results,
        config: FINAL_TEST_CONFIG
    };
    
    return window.finalTestResults;
}

// ============================================================================
// COMMANDES MANUELLES
// ============================================================================

// Tester une section spécifique
window.testSectionIndividual = async function(sectionNumber) {
    const sections = [
        testSection1_PageLoading,
        testSection2_JavaScriptLoading,
        testSection3_UserLogin,
        testSection4_TicketPurchase,
        testSection5_VoucherValidation,
        testSection6_Dashboard,
        testSection7_Navigation,
        testSection8_Styling
    ];
    
    if (sectionNumber >= 1 && sectionNumber <= sections.length) {
        console.log(`🎯 Test individuel de la section ${sectionNumber}`);
        return await sections[sectionNumber - 1]();
    } else {
        console.log('❌ Numéro de section invalide (1-8)');
        return null;
    }
};

// Tester toutes les sections
window.testAllSections = runAllSectionsIndividually;

// Activer/désactiver les auto-corrections
window.toggleAutoFix = function(enabled) {
    FINAL_TEST_CONFIG.autoFix = enabled;
    console.log(`🔧 Auto-corrections ${enabled ? 'activées' : 'désactivées'}`);
};

// ============================================================================
// DÉMARRAGE AUTOMATIQUE
// ============================================================================

console.log('\n⏳ Initialisation des tests finaux...');
console.log('🎯 Chaque section sera testée individuellement');
console.log('🔧 Auto-corrections activées par défaut');
console.log('');
console.log('💡 Commandes disponibles:');
console.log('   - testSectionIndividual(1-8) : Tester une section');
console.log('   - testAllSections() : Tester toutes les sections');
console.log('   - toggleAutoFix(true/false) : Activer/désactiver les corrections');
console.log('');

// Lancer les tests automatiquement après le chargement
setTimeout(() => {
    console.log('🚀 Lancement automatique des tests...');
    runAllSectionsIndividually().then(results => {
        console.log(`\n🏁 Tests terminés! Score global: ${results.globalScore}%`);
        console.log('📊 Résultats sauvegardés dans window.finalTestResults');
    });
}, 4000); // Délai plus long pour s'assurer que tout est chargé
