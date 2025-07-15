// Test de validation des erreurs JavaScript
console.log('🧪 Démarrage des tests de validation...');

// Test 1: Vérifier la disponibilité des gestionnaires
const managers = [
    'routerManager',
    'equipmentManager', 
    'subscriptionManager',
    'userManager',
    'transactionManager',
    'zoneManager',
    'dashboardManager',
    'autoDashboardConfig'
];

console.log('📋 Test des gestionnaires:');
managers.forEach(manager => {
    if (window[manager]) {
        console.log(`✅ ${manager}: OK`);
    } else {
        console.error(`❌ ${manager}: MANQUANT`);
    }
});

// Test 2: Vérifier la configuration d'URL
console.log('\n🔗 Test de configuration URL:');
if (typeof URLConfig !== 'undefined') {
    try {
        const urlConfig = new URLConfig();
        console.log('✅ URLConfig: OK');
        console.log(`📍 Environnement détecté: ${urlConfig.getCurrentEnvironment()}`);
        console.log(`🌐 URL de base: ${urlConfig.getBaseUrl()}`);
    } catch (error) {
        console.error('❌ URLConfig: ERREUR', error);
    }
} else {
    console.error('❌ URLConfig: CLASSE NON DÉFINIE');
}

// Test 3: Vérifier la configuration d'environnement
console.log('\n⚙️ Test de configuration d\'environnement:');
if (typeof AppConfig !== 'undefined') {
    console.log('✅ AppConfig: OK');
    console.log(`🏠 Développement: ${AppConfig.isDevelopment}`);
    console.log(`🚀 Production: ${AppConfig.isProduction}`);
} else {
    console.error('❌ AppConfig: OBJET NON DÉFINI');
}

// Test 4: Vérifier le localStorage
console.log('\n💾 Test du localStorage:');
try {
    const testKey = 'test_storage';
    localStorage.setItem(testKey, 'test_value');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value === 'test_value') {
        console.log('✅ localStorage: OK');
    } else {
        console.error('❌ localStorage: VALEUR INCORRECTE');
    }
} catch (error) {
    console.error('❌ localStorage: ERREUR', error);
}

// Test 5: Vérifier la simulation des données
console.log('\n🔄 Test de simulation des données:');
if (window.routerManager) {
    try {
        const stats = window.routerManager.getRouterStats();
        console.log('✅ Simulation routeurs: OK');
        console.log(`📊 Routeurs total: ${stats.total}`);
        console.log(`🟢 En ligne: ${stats.online}`);
        console.log(`💰 Revenus: ${stats.totalRevenue} FC`);
    } catch (error) {
        console.error('❌ Simulation routeurs: ERREUR', error);
    }
} else {
    console.error('❌ RouterManager: NON DISPONIBLE');
}

// Test 6: Vérifier les événements DOM
console.log('\n📄 Test des événements DOM:');
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM chargé: OK');
    
    // Vérifier les éléments clés
    const navbar = document.querySelector('.navbar');
    const dashboard = document.querySelector('#dashboard');
    
    if (navbar) {
        console.log('✅ Navbar: OK');
    } else {
        console.error('❌ Navbar: MANQUANT');
    }
    
    if (dashboard) {
        console.log('✅ Dashboard: OK');
    } else {
        console.error('❌ Dashboard: MANQUANT');
    }
});

// Test 7: Vérifier les erreurs globales
console.log('\n🚨 Configuration de capture d\'erreurs:');
window.addEventListener('error', (event) => {
    console.error('❌ ERREUR JAVASCRIPT:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ PROMESSE REJETÉE:', event.reason);
});

console.log('✅ Tests de validation terminés');
console.log('📊 Consultez la console pour les résultats détaillés');
console.log('🔗 Pour plus d\'informations: https://mireb1.github.io/WIFIBISOUBISOU/');
