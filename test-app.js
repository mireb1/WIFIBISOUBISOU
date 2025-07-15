// Script de test pour l'application WiFi Bisou Bisou
console.log('🧪 Début des tests de l\'application...');

// Test 1: Vérifier que les conteneurs existent
function testContainersExist() {
    const modalContainer = document.getElementById('dynamic-modals-container');
    const notificationContainer = document.getElementById('notifications-container');
    
    console.log('✅ Test 1: Conteneurs DOM');
    console.log('- Modal container:', modalContainer ? '✅ Présent' : '❌ Manquant');
    console.log('- Notification container:', notificationContainer ? '✅ Présent' : '❌ Manquant');
    
    return modalContainer && notificationContainer;
}

// Test 2: Vérifier les fonctions principales
function testMainFunctions() {
    console.log('✅ Test 2: Fonctions principales');
    
    const functions = [
        'showTicketSelection',
        'validateVoucher',
        'showUserLoginModal',
        'showDashboard'
    ];
    
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`- ${funcName}: ✅ Disponible`);
        } else {
            console.log(`- ${funcName}: ❌ Manquante`);
        }
    });
}

// Test 3: Vérifier les managers
function testManagers() {
    console.log('✅ Test 3: Managers');
    
    const managers = [
        'userManager',
        'voucherManager',
        'notificationManager'
    ];
    
    managers.forEach(managerName => {
        if (typeof window[managerName] === 'object') {
            console.log(`- ${managerName}: ✅ Initialisé`);
        } else {
            console.log(`- ${managerName}: ❌ Non initialisé`);
        }
    });
}

// Test 4: Tester la création d'une notification
function testNotificationCreation() {
    console.log('✅ Test 4: Création de notification');
    
    try {
        if (window.notificationManager) {
            window.notificationManager.addNotification(
                'Test de notification',
                'Ceci est un test de notification système',
                'info'
            );
            console.log('- Notification créée: ✅ Succès');
        } else {
            console.log('- Notification: ❌ Manager non disponible');
        }
    } catch (error) {
        console.log('- Notification: ❌ Erreur -', error.message);
    }
}

// Exécuter tous les tests
function runAllTests() {
    console.log('🚀 Exécution de tous les tests...\n');
    
    testContainersExist();
    console.log('');
    testMainFunctions();
    console.log('');
    testManagers();
    console.log('');
    testNotificationCreation();
    
    console.log('\n🎉 Tests terminés !');
}

// Exécuter automatiquement quand le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}
