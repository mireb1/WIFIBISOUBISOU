// ============================================================================
// SCRIPT DE TEST AUTOMATISÉ CORRIGÉ - WiFi Bisou Bisou
// ============================================================================
// Instructions: Copiez ce code dans la console de votre navigateur
// URL: https://mireb1.github.io/WIFIBISOUBISOU/
// ============================================================================

console.log('🔧 TESTS AUTOMATISÉS CORRIGÉS - WiFi Bisou Bisou');
console.log('='.repeat(60));

// Configuration des tests
const TEST_CONFIG = {
    timeout: 8000,
    retries: 3,
    delay: 1000
};

// Utilitaires de test
const TestUtils = {
    // Attendre qu'un élément soit disponible
    waitForElement: (selector, timeout = 5000) => {
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
                reject(new Error(`Élément ${selector} non trouvé après ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Attendre le chargement complet
    waitForLoad: (timeout = 10000) => {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
                return;
            }
            
            const checkLoad = () => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    setTimeout(checkLoad, 100);
                }
            };
            
            setTimeout(checkLoad, 100);
            setTimeout(resolve, timeout); // Fallback
        });
    },
    
    // Vérifier si une fonction existe
    functionExists: (funcName) => {
        try {
            return typeof window[funcName] === 'function' || 
                   typeof eval(funcName) === 'function';
        } catch (error) {
            return false;
        }
    },
    
    // Logger amélioré
    log: (level, message, data = null) => {
        const timestamp = new Date().toLocaleTimeString();
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        console.log(`${icons[level]} [${timestamp}] ${message}`);
        if (data) console.log(data);
    }
};

// ============================================================================
// SECTION 1: TEST DE CHARGEMENT DE LA PAGE
// ============================================================================

async function section1_PageLoading() {
    console.log('\n📄 SECTION 1: Chargement de la page');
    console.log('-'.repeat(40));
    
    try {
        // Attendre le chargement complet
        await TestUtils.waitForLoad();
        TestUtils.log('success', 'Document chargé');
        
        // Tests de présence des éléments
        const elements = [
            { selector: '.navbar', name: 'Navigation' },
            { selector: '.hero', name: 'Section Hero' },
            { selector: '#home', name: 'Section Home' },
            { selector: '#dashboard', name: 'Section Dashboard' },
            { selector: '.login-btn', name: 'Bouton Connexion' },
            { selector: '.voucher-card', name: 'Cartes Voucher' }
        ];
        
        let passed = 0;
        for (const element of elements) {
            try {
                const el = document.querySelector(element.selector);
                if (el && el.offsetHeight > 0) {
                    TestUtils.log('success', `${element.name}: Présent et visible`);
                    passed++;
                } else {
                    TestUtils.log('error', `${element.name}: Absent ou invisible`);
                }
            } catch (error) {
                TestUtils.log('error', `${element.name}: Erreur - ${error.message}`);
            }
        }
        
        // Vérifier le titre
        if (document.title && document.title.includes('WiFi')) {
            TestUtils.log('success', `Titre: "${document.title}"`);
            passed++;
        } else {
            TestUtils.log('error', 'Titre de page manquant ou incorrect');
        }
        
        const score = Math.round((passed / (elements.length + 1)) * 100);
        TestUtils.log('info', `Score Section 1: ${score}% (${passed}/${elements.length + 1})`);
        
        return { passed, total: elements.length + 1, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 1: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 2: TEST DES SCRIPTS JAVASCRIPT
// ============================================================================

async function section2_JavaScriptLoading() {
    console.log('\n📜 SECTION 2: Scripts JavaScript');
    console.log('-'.repeat(40));
    
    try {
        // Fonctions critiques à vérifier
        const criticalFunctions = [
            'showUserLoginModal',
            'validateVoucher',
            'buyTicket',
            'showDashboard',
            'initializeApp',
            'showSection'
        ];
        
        // Classes/Managers à vérifier
        const managers = [
            'UserManager',
            'VoucherManager',
            'NotificationManager',
            'RouterManager',
            'EquipmentManager'
        ];
        
        let passed = 0;
        const total = criticalFunctions.length + managers.length;
        
        // Test des fonctions
        for (const func of criticalFunctions) {
            if (TestUtils.functionExists(func)) {
                TestUtils.log('success', `Fonction ${func}: Disponible`);
                passed++;
            } else {
                TestUtils.log('error', `Fonction ${func}: Manquante`);
            }
        }
        
        // Test des managers
        for (const manager of managers) {
            if (window[manager] !== undefined) {
                TestUtils.log('success', `Manager ${manager}: Disponible`);
                passed++;
            } else {
                TestUtils.log('warning', `Manager ${manager}: Manquant (optionnel)`);
            }
        }
        
        // Test de l'initialisation
        if (window.app || window.initialized) {
            TestUtils.log('success', 'Application initialisée');
            passed++;
        } else {
            TestUtils.log('warning', 'État d\'initialisation incertain');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 2: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 2: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 3: TEST DE LA CONNEXION UTILISATEUR
// ============================================================================

async function section3_UserLogin() {
    console.log('\n👤 SECTION 3: Connexion utilisateur');
    console.log('-'.repeat(40));
    
    try {
        let passed = 0;
        let total = 4;
        
        // 1. Vérifier le bouton de connexion
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            TestUtils.log('success', 'Bouton connexion trouvé');
            passed++;
            
            // Vérifier si le bouton est cliquable
            if (loginBtn.onclick || loginBtn.getAttribute('onclick')) {
                TestUtils.log('success', 'Bouton connexion configuré');
                passed++;
            } else {
                TestUtils.log('error', 'Bouton connexion non configuré');
            }
        } else {
            TestUtils.log('error', 'Bouton connexion manquant');
        }
        
        // 2. Vérifier la fonction showUserLoginModal
        if (TestUtils.functionExists('showUserLoginModal')) {
            TestUtils.log('success', 'Fonction showUserLoginModal disponible');
            passed++;
        } else {
            TestUtils.log('error', 'Fonction showUserLoginModal manquante');
        }
        
        // 3. Vérifier le modal HTML
        const modal = document.querySelector('#userLoginModal') || 
                     document.querySelector('.modal[id*="login"]') ||
                     document.querySelector('.modal[id*="user"]');
        
        if (modal) {
            TestUtils.log('success', 'Modal de connexion trouvé');
            passed++;
        } else {
            TestUtils.log('error', 'Modal de connexion manquant');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 3: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 3: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 4: TEST DE L'ACHAT DE TICKET
// ============================================================================

async function section4_TicketPurchase() {
    console.log('\n🎫 SECTION 4: Achat de ticket');
    console.log('-'.repeat(40));
    
    try {
        let passed = 0;
        let total = 5;
        
        // 1. Vérifier les boutons d'achat
        const buyButtons = document.querySelectorAll('[onclick*="buyTicket"]');
        if (buyButtons.length > 0) {
            TestUtils.log('success', `${buyButtons.length} boutons d'achat trouvés`);
            passed++;
        } else {
            TestUtils.log('error', 'Aucun bouton d\'achat trouvé');
        }
        
        // 2. Vérifier la fonction buyTicket
        if (TestUtils.functionExists('buyTicket')) {
            TestUtils.log('success', 'Fonction buyTicket disponible');
            passed++;
        } else {
            TestUtils.log('error', 'Fonction buyTicket manquante');
        }
        
        // 3. Vérifier les cartes de voucher
        const voucherCards = document.querySelectorAll('.voucher-card');
        if (voucherCards.length > 0) {
            TestUtils.log('success', `${voucherCards.length} cartes voucher trouvées`);
            passed++;
        } else {
            TestUtils.log('error', 'Aucune carte voucher trouvée');
        }
        
        // 4. Vérifier les prix
        const prices = document.querySelectorAll('.price, .voucher-price');
        if (prices.length > 0) {
            TestUtils.log('success', `${prices.length} prix affichés`);
            passed++;
        } else {
            TestUtils.log('error', 'Aucun prix affiché');
        }
        
        // 5. Vérifier le modal de paiement
        const paymentModal = document.querySelector('#paymentModal') || 
                           document.querySelector('.modal[id*="payment"]');
        if (paymentModal) {
            TestUtils.log('success', 'Modal de paiement trouvé');
            passed++;
        } else {
            TestUtils.log('warning', 'Modal de paiement non trouvé (peut être créé dynamiquement)');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 4: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 4: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 5: TEST DE LA VALIDATION DE VOUCHER
// ============================================================================

async function section5_VoucherValidation() {
    console.log('\n🎟️ SECTION 5: Validation de voucher');
    console.log('-'.repeat(40));
    
    try {
        let passed = 0;
        let total = 4;
        
        // 1. Vérifier le bouton de validation
        const validateBtn = document.querySelector('[onclick*="validateVoucher"]') ||
                           document.querySelector('.validate-btn');
        if (validateBtn) {
            TestUtils.log('success', 'Bouton validation trouvé');
            passed++;
        } else {
            TestUtils.log('error', 'Bouton validation manquant');
        }
        
        // 2. Vérifier la fonction validateVoucher
        if (TestUtils.functionExists('validateVoucher')) {
            TestUtils.log('success', 'Fonction validateVoucher disponible');
            passed++;
        } else {
            TestUtils.log('error', 'Fonction validateVoucher manquante');
        }
        
        // 3. Vérifier le modal de validation
        const validationModal = document.querySelector('#validationModal') || 
                              document.querySelector('.modal[id*="validation"]');
        if (validationModal) {
            TestUtils.log('success', 'Modal de validation trouvé');
            passed++;
        } else {
            TestUtils.log('warning', 'Modal de validation non trouvé (peut être créé dynamiquement)');
        }
        
        // 4. Vérifier le champ de code
        const codeInput = document.querySelector('input[placeholder*="code"]') ||
                         document.querySelector('input[id*="code"]');
        if (codeInput) {
            TestUtils.log('success', 'Champ de code trouvé');
            passed++;
        } else {
            TestUtils.log('warning', 'Champ de code non trouvé');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 5: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 5: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 6: TEST DU TABLEAU DE BORD
// ============================================================================

async function section6_Dashboard() {
    console.log('\n📊 SECTION 6: Tableau de bord');
    console.log('-'.repeat(40));
    
    try {
        let passed = 0;
        let total = 6;
        
        // 1. Vérifier la section dashboard
        const dashboardSection = document.querySelector('#dashboard');
        if (dashboardSection) {
            TestUtils.log('success', 'Section dashboard trouvée');
            passed++;
        } else {
            TestUtils.log('error', 'Section dashboard manquante');
        }
        
        // 2. Vérifier la fonction showDashboard
        if (TestUtils.functionExists('showDashboard')) {
            TestUtils.log('success', 'Fonction showDashboard disponible');
            passed++;
        } else {
            TestUtils.log('error', 'Fonction showDashboard manquante');
        }
        
        // 3. Vérifier les modules du dashboard
        const modules = [
            { selector: '.router-management', name: 'Gestion routeurs' },
            { selector: '.equipment-management', name: 'Gestion équipements' },
            { selector: '.user-management', name: 'Gestion utilisateurs' },
            { selector: '.transaction-management', name: 'Gestion transactions' }
        ];
        
        let modulesFound = 0;
        modules.forEach(module => {
            const element = document.querySelector(module.selector);
            if (element) {
                TestUtils.log('success', `${module.name}: Trouvé`);
                modulesFound++;
            } else {
                TestUtils.log('warning', `${module.name}: Non trouvé`);
            }
        });
        
        if (modulesFound >= modules.length * 0.5) {
            passed++;
        }
        
        // 4. Vérifier les statistiques
        const stats = document.querySelectorAll('.stat-card, .dashboard-stat');
        if (stats.length > 0) {
            TestUtils.log('success', `${stats.length} statistiques trouvées`);
            passed++;
        } else {
            TestUtils.log('warning', 'Aucune statistique trouvée');
        }
        
        // 5. Vérifier les graphiques
        const charts = document.querySelectorAll('.chart, canvas');
        if (charts.length > 0) {
            TestUtils.log('success', `${charts.length} graphiques trouvés`);
            passed++;
        } else {
            TestUtils.log('warning', 'Aucun graphique trouvé');
        }
        
        // 6. Vérifier l'accès au dashboard
        const dashboardLink = document.querySelector('a[href="#dashboard"]');
        if (dashboardLink) {
            TestUtils.log('success', 'Lien vers dashboard trouvé');
            passed++;
        } else {
            TestUtils.log('warning', 'Lien vers dashboard non trouvé');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 6: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 6: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 7: TEST DE LA NAVIGATION
// ============================================================================

async function section7_Navigation() {
    console.log('\n🧭 SECTION 7: Navigation');
    console.log('-'.repeat(40));
    
    try {
        let passed = 0;
        let total = 5;
        
        // 1. Vérifier la navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            TestUtils.log('success', 'Navbar trouvée');
            passed++;
        } else {
            TestUtils.log('error', 'Navbar manquante');
        }
        
        // 2. Vérifier les liens de navigation
        const navLinks = document.querySelectorAll('.nav-menu a, .navbar a');
        if (navLinks.length > 0) {
            TestUtils.log('success', `${navLinks.length} liens de navigation trouvés`);
            passed++;
        } else {
            TestUtils.log('error', 'Aucun lien de navigation trouvé');
        }
        
        // 3. Vérifier les sections principales
        const sections = ['home', 'dashboard', 'wifi-zones', 'support'];
        let sectionsFound = 0;
        
        sections.forEach(section => {
            const element = document.querySelector(`#${section}`);
            if (element) {
                TestUtils.log('success', `Section ${section}: Trouvée`);
                sectionsFound++;
            } else {
                TestUtils.log('warning', `Section ${section}: Manquante`);
            }
        });
        
        if (sectionsFound >= sections.length * 0.75) {
            passed++;
        }
        
        // 4. Vérifier la fonction showSection
        if (TestUtils.functionExists('showSection')) {
            TestUtils.log('success', 'Fonction showSection disponible');
            passed++;
        } else {
            TestUtils.log('error', 'Fonction showSection manquante');
        }
        
        // 5. Vérifier le menu mobile
        const mobileMenu = document.querySelector('.mobile-menu-toggle') ||
                          document.querySelector('.hamburger');
        if (mobileMenu) {
            TestUtils.log('success', 'Menu mobile trouvé');
            passed++;
        } else {
            TestUtils.log('warning', 'Menu mobile non trouvé');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 7: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 7: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// SECTION 8: TEST DES STYLES ET RESPONSIVITÉ
// ============================================================================

async function section8_Styling() {
    console.log('\n🎨 SECTION 8: Styles et responsivité');
    console.log('-'.repeat(40));
    
    try {
        let passed = 0;
        let total = 6;
        
        // 1. Vérifier le chargement du CSS
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        if (stylesheets.length > 0) {
            TestUtils.log('success', `${stylesheets.length} feuilles de style trouvées`);
            passed++;
        } else {
            TestUtils.log('error', 'Aucune feuille de style trouvée');
        }
        
        // 2. Vérifier les styles critiques
        const criticalElements = [
            { selector: '.navbar', property: 'display' },
            { selector: '.hero', property: 'display' },
            { selector: '.btn', property: 'padding' },
            { selector: '.voucher-card', property: 'display' }
        ];
        
        let stylesOk = 0;
        criticalElements.forEach(element => {
            const el = document.querySelector(element.selector);
            if (el) {
                const computedStyle = getComputedStyle(el);
                const value = computedStyle.getPropertyValue(element.property);
                if (value && value !== 'none' && value !== '0px') {
                    stylesOk++;
                }
            }
        });
        
        if (stylesOk >= criticalElements.length * 0.75) {
            TestUtils.log('success', 'Styles critiques appliqués');
            passed++;
        } else {
            TestUtils.log('error', 'Problème avec les styles critiques');
        }
        
        // 3. Vérifier la responsivité
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            TestUtils.log('success', 'Meta viewport configuré');
            passed++;
        } else {
            TestUtils.log('warning', 'Meta viewport manquant');
        }
        
        // 4. Vérifier les media queries
        const mediaQueries = Array.from(document.styleSheets)
            .flatMap(sheet => {
                try {
                    return Array.from(sheet.cssRules || []);
                } catch (e) {
                    return [];
                }
            })
            .filter(rule => rule.type === CSSRule.MEDIA_RULE);
        
        if (mediaQueries.length > 0) {
            TestUtils.log('success', `${mediaQueries.length} media queries trouvées`);
            passed++;
        } else {
            TestUtils.log('warning', 'Aucune media query trouvée');
        }
        
        // 5. Vérifier les icônes
        const icons = document.querySelectorAll('.fa, .icon, [class*="icon"]');
        if (icons.length > 0) {
            TestUtils.log('success', `${icons.length} icônes trouvées`);
            passed++;
        } else {
            TestUtils.log('warning', 'Aucune icône trouvée');
        }
        
        // 6. Vérifier les animations
        const animations = document.querySelectorAll('[class*="animate"], [class*="transition"]');
        if (animations.length > 0) {
            TestUtils.log('success', `${animations.length} animations trouvées`);
            passed++;
        } else {
            TestUtils.log('warning', 'Aucune animation trouvée');
        }
        
        const score = Math.round((passed / total) * 100);
        TestUtils.log('info', `Score Section 8: ${score}% (${passed}/${total})`);
        
        return { passed, total, score };
        
    } catch (error) {
        TestUtils.log('error', `Erreur Section 8: ${error.message}`);
        return { passed: 0, total: 1, score: 0 };
    }
}

// ============================================================================
// ORCHESTRATEUR DE TESTS
// ============================================================================

async function runAllSections() {
    console.log('\n🚀 LANCEMENT DE TOUS LES TESTS');
    console.log('='.repeat(60));
    
    const sections = [
        { name: 'Chargement de la page', func: section1_PageLoading },
        { name: 'Scripts JavaScript', func: section2_JavaScriptLoading },
        { name: 'Connexion utilisateur', func: section3_UserLogin },
        { name: 'Achat de ticket', func: section4_TicketPurchase },
        { name: 'Validation voucher', func: section5_VoucherValidation },
        { name: 'Tableau de bord', func: section6_Dashboard },
        { name: 'Navigation', func: section7_Navigation },
        { name: 'Styles et responsivité', func: section8_Styling }
    ];
    
    const results = [];
    let totalPassed = 0;
    let totalTests = 0;
    
    // Exécuter chaque section
    for (const section of sections) {
        try {
            const result = await section.func();
            results.push({ name: section.name, ...result });
            totalPassed += result.passed;
            totalTests += result.total;
        } catch (error) {
            TestUtils.log('error', `Erreur dans ${section.name}: ${error.message}`);
            results.push({ name: section.name, passed: 0, total: 1, score: 0 });
            totalTests += 1;
        }
    }
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DES RÉSULTATS');
    console.log('='.repeat(60));
    
    results.forEach((result, index) => {
        const icon = result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌';
        console.log(`${icon} Section ${index + 1}: ${result.name} - ${result.score}%`);
    });
    
    const globalScore = Math.round((totalPassed / totalTests) * 100);
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 SCORE GLOBAL: ${globalScore}%`);
    console.log(`✅ Tests réussis: ${totalPassed}/${totalTests}`);
    
    if (globalScore >= 90) {
        console.log('🎉 EXCELLENT! Le site fonctionne parfaitement.');
    } else if (globalScore >= 75) {
        console.log('👍 BIEN! Quelques améliorations mineures possibles.');
    } else if (globalScore >= 60) {
        console.log('⚠️ MOYEN! Plusieurs points à améliorer.');
    } else {
        console.log('❌ CRITIQUE! Révision majeure nécessaire.');
    }
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('1. Identifiez les sections avec un score faible');
    console.log('2. Vérifiez les erreurs dans la console');
    console.log('3. Testez manuellement les fonctionnalités');
    console.log('4. Corrigez les problèmes détectés');
    
    return { results, globalScore, totalPassed, totalTests };
}

// ============================================================================
// TESTS MANUELS
// ============================================================================

// Fonction pour tester une section spécifique
window.testSection = function(sectionNumber) {
    const sections = [
        section1_PageLoading,
        section2_JavaScriptLoading,
        section3_UserLogin,
        section4_TicketPurchase,
        section5_VoucherValidation,
        section6_Dashboard,
        section7_Navigation,
        section8_Styling
    ];
    
    if (sectionNumber >= 1 && sectionNumber <= sections.length) {
        sections[sectionNumber - 1]();
    } else {
        console.log('❌ Numéro de section invalide (1-8)');
    }
};

// Fonction pour tester une fonction spécifique
window.testFunction = function(funcName) {
    console.log(`🔍 Test manuel de: ${funcName}`);
    try {
        if (TestUtils.functionExists(funcName)) {
            console.log(`✅ ${funcName}: Fonction trouvée`);
            // Optionnel: exécuter la fonction
            // window[funcName]();
        } else {
            console.log(`❌ ${funcName}: Fonction non trouvée`);
        }
    } catch (error) {
        console.log(`❌ ${funcName}: Erreur - ${error.message}`);
    }
};

// ============================================================================
// DÉMARRAGE AUTOMATIQUE
// ============================================================================

console.log('\n⏳ Attente du chargement complet...');
console.log('💡 Commandes disponibles:');
console.log('   - testSection(1-8) : Tester une section spécifique');
console.log('   - testFunction("nom") : Tester une fonction');
console.log('   - runAllSections() : Relancer tous les tests');

// Lancer les tests après le chargement
setTimeout(() => {
    runAllSections().then(results => {
        console.log(`\n🏁 Tests terminés! Score global: ${results.globalScore}%`);
        
        // Sauvegarder les résultats
        window.lastTestResults = results;
    });
}, 3000);
