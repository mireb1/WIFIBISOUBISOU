// Configuration automatique du tableau de bord - WiFi Bisou Bisou
class AutoDashboardConfig {
    constructor() {
        this.autoRefreshEnabled = true;
        this.notificationsEnabled = true;
        this.refreshInterval = 30000; // 30 secondes
        this.simulationInterval = 10000; // 10 secondes
        this.init();
    }

    init() {
        // Démarrer la surveillance automatique
        this.startAutoMonitoring();
        
        // Configurer les notifications
        this.setupNotifications();
        
        // Démarrer les mises à jour automatiques
        this.startAutoUpdates();
    }

    // Démarrer la surveillance automatique
    startAutoMonitoring() {
        setInterval(() => {
            this.checkSystemHealth();
            this.checkAlerts();
            this.updateRealTimeData();
        }, 5000); // Toutes les 5 secondes
    }

    // Vérifier la santé du système
    checkSystemHealth() {
        try {
            // Vérifier les équipements
            const equipmentAlerts = window.equipmentManager?.getEquipmentAlerts() || [];
            if (equipmentAlerts.length > 0) {
                this.sendNotification('Alerte Équipement', `${equipmentAlerts.length} équipement(s) nécessitent attention`);
            }

            // Vérifier les zones
            const zoneAlerts = window.zoneManager?.getZoneAlerts() || [];
            if (zoneAlerts.length > 0) {
                this.sendNotification('Alerte Zone', `${zoneAlerts.length} zone(s) ont des problèmes`);
            }

            // Vérifier les paiements en retard
            const overduePayments = window.routerManager?.getOverduePayments() || [];
            if (overduePayments.length > 0) {
                this.sendNotification('Paiements en Retard', `${overduePayments.length} routeur(s) avec paiements en retard`);
            }

            // Vérifier les abonnements expirant
            const expiring = window.subscriptionManager?.getExpiringSoon() || [];
            if (expiring.length > 0) {
                this.sendNotification('Abonnements Expirant', `${expiring.length} abonnement(s) expirent bientôt`);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de la santé du système:', error);
        }
    }

    // Vérifier les alertes
    checkAlerts() {
        try {
            const now = new Date();
            const lastAlertCheck = localStorage.getItem('lastAlertCheck');
            
            if (!lastAlertCheck || (now - new Date(lastAlertCheck)) > 60000) { // 1 minute
                // Vérifier les transactions échouées récentes
                const failedTransactions = window.transactionManager?.getAllTransactions()
                    .filter(txn => txn.status === 'failed' && 
                           (now - new Date(txn.transactionDate)) < 300000) || []; // 5 minutes
                
                if (failedTransactions.length > 0) {
                    this.sendNotification('Transactions Échouées', `${failedTransactions.length} transaction(s) ont échoué récemment`);
                }

                localStorage.setItem('lastAlertCheck', now.toISOString());
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des alertes:', error);
        }
    }

    // Mettre à jour les données en temps réel
    updateRealTimeData() {
        if (window.dashboardManager && window.dashboardManager.isDashboardVisible()) {
            try {
                window.dashboardManager.updateLiveConnections();
                window.dashboardManager.updateMonitoring();
                window.dashboardManager.updateAlerts();
            } catch (error) {
                console.error('Erreur lors de la mise à jour des données temps réel:', error);
            }
        }
    }

    // Configurer les notifications
    setupNotifications() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }

    // Envoyer une notification
    sendNotification(title, message) {
        if (!this.notificationsEnabled) return;

        // Notification dans l'interface
        if (window.showAlert) {
            window.showAlert(message, 'warning');
        }

        // Notification du navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                tag: 'wifi-bisou-bisou'
            });
        }
    }

    // Démarrer les mises à jour automatiques
    startAutoUpdates() {
        setInterval(() => {
            if (this.autoRefreshEnabled && window.dashboardManager) {
                try {
                    window.dashboardManager.refreshActiveSection();
                } catch (error) {
                    console.error('Erreur lors de la mise à jour automatique:', error);
                }
            }
        }, this.refreshInterval);
    }

    // Activer/désactiver l'auto-refresh
    toggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        localStorage.setItem('autoRefreshEnabled', this.autoRefreshEnabled.toString());
        
        if (window.showAlert) {
            window.showAlert(`Auto-refresh ${this.autoRefreshEnabled ? 'activé' : 'désactivé'}`, 'info');
        }
    }

    // Activer/désactiver les notifications
    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
        localStorage.setItem('notificationsEnabled', this.notificationsEnabled.toString());
        
        if (window.showAlert) {
            window.showAlert(`Notifications ${this.notificationsEnabled ? 'activées' : 'désactivées'}`, 'info');
        }
    }

    // Obtenir les statistiques système
    getSystemStats() {
        try {
            const stats = {
                timestamp: new Date().toISOString(),
                routers: window.routerManager?.getRouterStats() || {},
                equipment: window.equipmentManager?.getEquipmentStats() || {},
                subscriptions: window.subscriptionManager?.getSubscriptionStats() || {},
                users: window.userManager?.getUserStats() || {},
                transactions: window.transactionManager?.getTransactionStats() || {},
                zones: window.zoneManager?.getZoneStats() || {}
            };
            
            return stats;
        } catch (error) {
            console.error('Erreur lors de l\'obtention des statistiques:', error);
            return {};
        }
    }

    // Exporter les données
    exportData() {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                routers: window.routerManager?.getAllRouters() || [],
                equipment: window.equipmentManager?.getAllEquipment() || [],
                subscriptions: window.subscriptionManager?.getAllSubscriptions() || [],
                users: window.userManager?.getAllUsers() || [],
                transactions: window.transactionManager?.getAllTransactions() || [],
                zones: window.zoneManager?.getAllZones() || []
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wifi-bisou-bisou-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            if (window.showAlert) {
                window.showAlert('Données exportées avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            if (window.showAlert) {
                window.showAlert('Erreur lors de l\'export des données', 'error');
            }
        }
    }

    // Importer des données
    importData(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Importer les données
                    if (data.routers) localStorage.setItem('routers', JSON.stringify(data.routers));
                    if (data.equipment) localStorage.setItem('equipment', JSON.stringify(data.equipment));
                    if (data.subscriptions) localStorage.setItem('subscriptions', JSON.stringify(data.subscriptions));
                    if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
                    if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions));
                    if (data.zones) localStorage.setItem('zones', JSON.stringify(data.zones));
                    
                    // Recharger les gestionnaires
                    window.location.reload();
                    
                } catch (error) {
                    console.error('Erreur lors de l\'import:', error);
                    if (window.showAlert) {
                        window.showAlert('Erreur lors de l\'import des données', 'error');
                    }
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
        }
    }

    // Réinitialiser les données
    resetData() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
            localStorage.removeItem('routers');
            localStorage.removeItem('equipment');
            localStorage.removeItem('subscriptions');
            localStorage.removeItem('users');
            localStorage.removeItem('transactions');
            localStorage.removeItem('zones');
            
            window.location.reload();
        }
    }
}

// Initialiser la configuration automatique
document.addEventListener('DOMContentLoaded', () => {
    window.autoDashboardConfig = new AutoDashboardConfig();
    
    // Ajouter les contrôles au tableau de bord
    const dashboardNav = document.querySelector('.dashboard-nav');
    if (dashboardNav) {
        const controlsButton = document.createElement('button');
        controlsButton.className = 'nav-btn';
        controlsButton.innerHTML = '<i class="fas fa-cog"></i> Contrôles';
        controlsButton.onclick = () => window.autoDashboardConfig.showControls();
        dashboardNav.appendChild(controlsButton);
    }
});

// Ajouter méthode pour afficher les contrôles
AutoDashboardConfig.prototype.showControls = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Contrôles du Tableau de Bord</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="controls-grid">
                    <button class="btn btn-primary" onclick="window.autoDashboardConfig.toggleAutoRefresh()">
                        <i class="fas fa-sync"></i> Toggle Auto-Refresh
                    </button>
                    <button class="btn btn-secondary" onclick="window.autoDashboardConfig.toggleNotifications()">
                        <i class="fas fa-bell"></i> Toggle Notifications
                    </button>
                    <button class="btn btn-success" onclick="window.autoDashboardConfig.exportData()">
                        <i class="fas fa-download"></i> Exporter Données
                    </button>
                    <button class="btn btn-warning" onclick="document.getElementById('import-file').click()">
                        <i class="fas fa-upload"></i> Importer Données
                    </button>
                    <button class="btn btn-danger" onclick="window.autoDashboardConfig.resetData()">
                        <i class="fas fa-trash"></i> Réinitialiser
                    </button>
                </div>
                <input type="file" id="import-file" accept=".json" style="display: none;" 
                       onchange="window.autoDashboardConfig.importData(this.files[0])">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};
