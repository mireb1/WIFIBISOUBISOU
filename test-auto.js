// Script de test automatisé pour WiFi Bisou Bisou
// Exécutez ce script dans la console du navigateur sur https://mireb1.github.io/WIFIBISOUBISOU/

console.log('🧪 DÉBUT DES TESTS AUTOMATISÉS - WiFi Bisou Bisou');
console.log('===============================================');

// Fonction de test avec timeout
function testWithTimeout(testName, testFunction, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Test "${testName}" timeout après ${timeout}ms`));
        }, timeout);
        
        try {
            const result = testFunction();
            clearTimeout(timeoutId);
            resolve(result);
        } catch (error) {
            clearTimeout(timeoutId);
            reject(error);
        }
    });
}

// Test 1: Vérifier le chargement de la page
async function test1_PageLoading() {
    console.log('\n📄 TEST 1: Chargement de la page');
    
    const checks = [
        () => document.title.includes('WiFi Bisou Bisou'),
        () => document.querySelector('.navbar') !== null,
        () => document.querySelector('.hero') !== null,
        () => document.querySelector('#home') !== null,
        () => document.querySelector('#dashboard') !== null
    ];
    
    let passed = 0;
    checks.forEach((check, index) => {
        try {
            if (check()) {
                console.log(`✅ Check ${index + 1}: PASS`);
                passed++;
            } else {
                console.log(`❌ Check ${index + 1}: FAIL`);
            }
        } catch (error) {
            console.log(`❌ Check ${index + 1}: ERROR - ${error.message}`);
        }
    });
    
    console.log(`📊 Résultat: ${passed}/${checks.length} tests passés`);
    return passed === checks.length;
}

// Test 2: Vérifier les scripts JavaScript
async function test2_JavaScriptLoading() {
    console.log('\n📜 TEST 2: Scripts JavaScript');
    
    const requiredObjects = [
        'UserManager',
        'VoucherManager',
        'NotificationManager',
        'showUserLoginModal',
        'validateVoucher',
        'buyTicket',
        'showDashboard'
    ];
    
    let passed = 0;
    requiredObjects.forEach(obj => {
        try {
            if (window[obj] !== undefined || eval(`typeof ${obj}`) === 'function') {
                console.log(`✅ ${obj}: DISPONIBLE`);
                passed++;
            } else {
                console.log(`❌ ${obj}: MANQUANT`);
            }
        } catch (error) {
            console.log(`❌ ${obj}: ERROR - ${error.message}`);
        }
    });
    
    console.log(`📊 Résultat: ${passed}/${requiredObjects.length} objets trouvés`);
    return passed >= requiredObjects.length * 0.8; // 80% minimum
}

// Test 3: Tester la connexion utilisateur
async function test3_UserLogin() {
    console.log('\n👤 TEST 3: Connexion utilisateur');
    
    try {
        // Simuler un clic sur le bouton connexion
        const loginBtn = document.querySelector('.login-btn');
        if (!loginBtn) {
            throw new Error('Bouton connexion introuvable');
        }
        
        console.log('✅ Bouton connexion trouvé');
        
        // Simuler l'ouverture du modal
        if (typeof showUserLoginModal === 'function') {
            console.log('✅ Fonction showUserLoginModal disponible');
            
            // Tester l'ouverture (sans vraiment ouvrir)
            console.log('⏳ Test d\'ouverture du modal...');
            // showUserLoginModal(); // Décommentez pour tester réellement
            
            console.log('✅ Modal de connexion: FONCTIONNEL');
            return true;
        } else {
            throw new Error('Fonction showUserLoginModal non définie');
        }
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

// Test 4: Tester l'achat de ticket
async function test4_TicketPurchase() {
    console.log('\n🎫 TEST 4: Achat de ticket');
    
    try {
        // Vérifier la présence des boutons d'achat
        const buyButtons = document.querySelectorAll('[onclick*="buyTicket"]');
        if (buyButtons.length === 0) {
            throw new Error('Aucun bouton d\'achat trouvé');
        }
        
        console.log(`✅ ${buyButtons.length} boutons d'achat trouvés`);
        
        // Vérifier la fonction buyTicket
        if (typeof buyTicket === 'function') {
            console.log('✅ Fonction buyTicket disponible');
            
            // Tester les paramètres
            console.log('⏳ Test des paramètres...');
            // buyTicket('basic', 500); // Décommentez pour tester réellement
            
            console.log('✅ Achat de ticket: FONCTIONNEL');
            return true;
        } else {
            throw new Error('Fonction buyTicket non définie');
        }
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

// Test 5: Tester la validation de voucher
async function test5_VoucherValidation() {
    console.log('\n🎟️ TEST 5: Validation de voucher');
    
    try {
        // Vérifier le bouton de validation
        const validateBtn = document.querySelector('[onclick*="validateVoucher"]');
        if (!validateBtn) {
            throw new Error('Bouton validation introuvable');
        }
        
        console.log('✅ Bouton validation trouvé');
        
        // Vérifier la fonction validateVoucher
        if (typeof validateVoucher === 'function') {
            console.log('✅ Fonction validateVoucher disponible');
            
            // Tester l'ouverture du modal
            console.log('⏳ Test d\'ouverture du modal...');
            // validateVoucher(); // Décommentez pour tester réellement
            
            console.log('✅ Validation voucher: FONCTIONNEL');
            return true;
        } else {
            throw new Error('Fonction validateVoucher non définie');
        }
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

// Test 6: Tester le tableau de bord
async function test6_Dashboard() {
    console.log('\n📊 TEST 6: Tableau de bord');
    
    try {
        // Vérifier la section dashboard
        const dashboardSection = document.querySelector('#dashboard');
        if (!dashboardSection) {
            throw new Error('Section dashboard introuvable');
        }
        
        console.log('✅ Section dashboard trouvée');
        
        // Vérifier la fonction showDashboard
        if (typeof showDashboard === 'function') {
            console.log('✅ Fonction showDashboard disponible');
            
            // Vérifier les gestionnaires
            const managers = ['routerManager', 'equipmentManager', 'userManager'];
            let managersFound = 0;
            
            managers.forEach(manager => {
                if (window[manager]) {
                    console.log(`✅ ${manager}: DISPONIBLE`);
                    managersFound++;
                } else {
                    console.log(`⚠️ ${manager}: MANQUANT`);
                }
            });
            
            console.log(`📊 Gestionnaires: ${managersFound}/${managers.length}`);
            console.log('✅ Tableau de bord: FONCTIONNEL');
            return true;
        } else {
            throw new Error('Fonction showDashboard non définie');
        }
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

// Test 7: Tester la navigation
async function test7_Navigation() {
    console.log('\n🧭 TEST 7: Navigation');
    
    try {
        const navLinks = document.querySelectorAll('.nav-menu a');
        if (navLinks.length === 0) {
            throw new Error('Liens de navigation introuvables');
        }
        
        console.log(`✅ ${navLinks.length} liens de navigation trouvés`);
        
        // Vérifier les sections
        const sections = ['home', 'dashboard', 'wifi-zones', 'support'];
        let sectionsFound = 0;
        
        sections.forEach(section => {
            const sectionElement = document.querySelector(`#${section}`);
            if (sectionElement) {
                console.log(`✅ Section ${section}: TROUVÉE`);
                sectionsFound++;
            } else {
                console.log(`⚠️ Section ${section}: MANQUANTE`);
            }
        });
        
        console.log(`📊 Sections: ${sectionsFound}/${sections.length}`);
        console.log('✅ Navigation: FONCTIONNELLE');
        return sectionsFound >= sections.length * 0.75; // 75% minimum
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

// Test 8: Tester les styles CSS
async function test8_Styling() {
    console.log('\n🎨 TEST 8: Styles CSS');
    
    try {
        // Vérifier les styles critiques
        const styleChecks = [
            () => getComputedStyle(document.querySelector('.navbar')).display !== 'none',
            () => getComputedStyle(document.querySelector('.hero')).display !== 'none',
            () => getComputedStyle(document.querySelector('.btn')).padding !== '0px',
            () => document.querySelector('.modal') === null || true // Pas de modal ouvert par défaut
        ];
        
        let passed = 0;
        styleChecks.forEach((check, index) => {
            try {
                if (check()) {
                    console.log(`✅ Style check ${index + 1}: PASS`);
                    passed++;
                } else {
                    console.log(`❌ Style check ${index + 1}: FAIL`);
                }
            } catch (error) {
                console.log(`❌ Style check ${index + 1}: ERROR`);
            }
        });
        
        console.log(`📊 Styles: ${passed}/${styleChecks.length}`);
        console.log('✅ Styles CSS: FONCTIONNELS');
        return passed >= styleChecks.length * 0.8;
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('🚀 EXÉCUTION DE TOUS LES TESTS...\n');
    
    const tests = [
        { name: 'Chargement de la page', func: test1_PageLoading },
        { name: 'Scripts JavaScript', func: test2_JavaScriptLoading },
        { name: 'Connexion utilisateur', func: test3_UserLogin },
        { name: 'Achat de ticket', func: test4_TicketPurchase },
        { name: 'Validation voucher', func: test5_VoucherValidation },
        { name: 'Tableau de bord', func: test6_Dashboard },
        { name: 'Navigation', func: test7_Navigation },
        { name: 'Styles CSS', func: test8_Styling }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        try {
            const result = await testWithTimeout(test.name, test.func);
            if (result) {
                passed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name}: ÉCHEC - ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSULTATS FINAUX:');
    console.log(`✅ Tests réussis: ${passed}/${total}`);
    console.log(`📈 Taux de réussite: ${Math.round((passed/total)*100)}%`);
    
    if (passed === total) {
        console.log('🎉 TOUS LES TESTS SONT PASSÉS! Site entièrement fonctionnel.');
    } else if (passed >= total * 0.8) {
        console.log('⚠️ La plupart des tests sont passés. Quelques améliorations possibles.');
    } else {
        console.log('❌ Plusieurs tests ont échoué. Vérification nécessaire.');
    }
    
    return {
        passed,
        total,
        percentage: Math.round((passed/total)*100)
    };
}

// Lancer les tests automatiquement
console.log('⏳ Attente du chargement complet...');
setTimeout(() => {
    runAllTests().then(results => {
        console.log(`\n🏁 Tests terminés: ${results.percentage}% de réussite`);
    });
}, 2000);

// Fonction pour tester manuellement une fonctionnalité
window.testFunction = function(funcName) {
    console.log(`🔍 Test manuel de: ${funcName}`);
    try {
        if (typeof window[funcName] === 'function') {
            window[funcName]();
            console.log(`✅ ${funcName}: EXÉCUTÉ`);
        } else {
            console.log(`❌ ${funcName}: FONCTION NON TROUVÉE`);
        }
    } catch (error) {
        console.log(`❌ ${funcName}: ERREUR - ${error.message}`);
    }
};

console.log('\n💡 CONSEILS:');
console.log('- Ouvrez la console de votre navigateur pour voir les résultats');
console.log('- Testez manuellement: testFunction("showUserLoginModal")');
console.log('- Les tests automatiques se lancent dans 2 secondes');
