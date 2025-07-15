// Gestionnaire Principal du Tableau de Bord - WiFi Bisou Bisou
class DashboardManager {
    constructor() {
        this.refreshInterval = 30000; // 30 secondes
        this.simulationInterval = 10000; // 10 secondes
        this.activeSection = 'overview';
        this.isInitialized = false;
        
        this.init();
    }

    // Initialiser le gestionnaire
    async init() {
        if (this.isInitialized) return;
        
        // Attendre que tous les gestionnaires soient chargés
        await this.waitForManagers();
        
        // Démarrer les simulations
        this.startSimulations();
        
        // Démarrer les mises à jour automatiques
        this.startAutoRefresh();
        
        this.isInitialized = true;
        console.log('Dashboard Manager initialisé avec succès');
    }

    // Attendre que tous les gestionnaires soient disponibles
    async waitForManagers() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.routerManager && 
                window.equipmentManager && 
                window.subscriptionManager && 
                window.userManager && 
                window.transactionManager && 
                window.zoneManager) {
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        throw new Error('Impossible de charger tous les gestionnaires');
    }

    // Démarrer les simulations
    startSimulations() {
        setInterval(() => {
            try {
                window.routerManager.simulateRouterActivity();
                window.equipmentManager.simulateEquipmentActivity();
                window.subscriptionManager.simulateDataUsage();
                window.subscriptionManager.updateExpiredSubscriptions();
                window.userManager.simulateUserActivity();
                window.transactionManager.simulateTransactions();
                window.zoneManager.simulateZoneActivity();
                
                // Mettre à jour l'affichage si le tableau de bord est visible
                if (this.isDashboardVisible()) {
                    this.refreshActiveSection();
                }
            } catch (error) {
                console.error('Erreur lors de la simulation:', error);
            }
        }, this.simulationInterval);
    }

    // Démarrer les mises à jour automatiques
    startAutoRefresh() {
        setInterval(() => {
            if (this.isDashboardVisible()) {
                this.refreshActiveSection();
            }
        }, this.refreshInterval);
    }

    // Vérifier si le tableau de bord est visible
    isDashboardVisible() {
        const dashboardSection = document.getElementById('dashboard');
        return dashboardSection && !dashboardSection.classList.contains('hidden');
    }

    // Afficher une section du tableau de bord
    showDashboardSection(section) {
        this.activeSection = section;
        
        // Mettre à jour les boutons de navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[onclick="showDashboardSection('${section}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Charger le contenu de la section
        this.loadSection(section);
    }

    // Charger une section spécifique
    loadSection(section) {
        switch (section) {
            case 'overview':
                this.loadOverview();
                break;
            case 'routers':
                this.loadRouters();
                break;
            case 'equipment':
                this.loadEquipment();
                break;
            case 'subscriptions':
                this.loadSubscriptions();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'transactions':
                this.loadTransactions();
                break;
            case 'wifi-zones':
                this.loadWifiZones();
                break;
            default:
                this.loadOverview();
        }
    }

    // Rafraîchir la section active
    refreshActiveSection() {
        this.loadSection(this.activeSection);
    }

    // Charger la vue d'ensemble
    loadOverview() {
        try {
            const routerStats = window.routerManager.getRouterStats();
            const equipmentStats = window.equipmentManager.getEquipmentStats();
            const subscriptionStats = window.subscriptionManager.getSubscriptionStats();
            const userStats = window.userManager.getUserStats();
            const transactionStats = window.transactionManager.getTransactionStats();
            const zoneStats = window.zoneManager.getZoneStats();

            // Mettre à jour les cartes de statistiques
            this.updateStatsCard('connections-today', routerStats.totalUsers);
            this.updateStatsCard('total-users', userStats.total);
            this.updateStatsCard('active-subscriptions', subscriptionStats.active);
            this.updateStatsCard('today-revenue', transactionStats.todayRevenue);
            this.updateStatsCard('equipment-online', equipmentStats.online);
            this.updateStatsCard('zones-active', zoneStats.active);

            // Mettre à jour les connexions live
            this.updateLiveConnections();
            
            // Mettre à jour la surveillance
            this.updateMonitoring();

            // Mettre à jour les alertes
            this.updateAlerts();
            
        } catch (error) {
            console.error('Erreur lors du chargement de la vue d\'ensemble:', error);
        }
    }

    // Charger les routeurs
    loadRouters() {
        try {
            const routers = window.routerManager.getAllRouters();
            const stats = window.routerManager.getRouterStats();
            const overduePayments = window.routerManager.getOverduePayments();

            const content = `
                <div class="section-content">
                    <h3><i class="fas fa-router"></i> Gestion des Routeurs</h3>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Routeurs</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.online}</div>
                            <div class="stat-label">En ligne</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.maintenance}</div>
                            <div class="stat-label">Maintenance</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.totalUsers}</div>
                            <div class="stat-label">Utilisateurs Connectés</div>
                        </div>
                    </div>

                    <div class="router-grid">
                        ${routers.map(router => `
                            <div class="router-card">
                                <div class="router-header">
                                    <h4>${router.name}</h4>
                                    <span class="status-badge status-${router.status}">${router.status.toUpperCase()}</span>
                                </div>
                                <div class="router-info">
                                    <p><strong>IP:</strong> ${router.ipAddress}</p>
                                    <p><strong>Localisation:</strong> ${router.location}</p>
                                    <p><strong>Utilisateurs:</strong> ${router.connectedUsers}/${router.maxUsers}</p>
                                    <p><strong>Bande passante:</strong> ${router.bandwidth}%</p>
                                    <p><strong>Uptime:</strong> ${router.uptime}</p>
                                </div>
                                <div class="router-actions">
                                    <button class="btn btn-sm btn-primary" onclick="dashboardManager.manageRouter('${router.id}')">Gérer</button>
                                    ${router.status === 'online' ? 
                                        `<button class="btn btn-sm btn-warning" onclick="dashboardManager.suspendRouter('${router.id}')">Suspendre</button>` :
                                        `<button class="btn btn-sm btn-success" onclick="dashboardManager.reconnectRouter('${router.id}')">Reconnecter</button>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            this.updateSectionContent(content);
        } catch (error) {
            console.error('Erreur lors du chargement des routeurs:', error);
        }
    }

    // Charger les équipements
    loadEquipment() {
        try {
            const equipment = window.equipmentManager.getAllEquipment();
            const stats = window.equipmentManager.getEquipmentStats();
            const alerts = window.equipmentManager.getEquipmentAlerts();

            const content = `
                <div class="section-content">
                    <h3><i class="fas fa-server"></i> Gestion des Équipements</h3>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Équipements</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.online}</div>
                            <div class="stat-label">En ligne</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.avgCpu}%</div>
                            <div class="stat-label">CPU Moyen</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.avgTemp}°C</div>
                            <div class="stat-label">Température Moyenne</div>
                        </div>
                    </div>

                    ${alerts.length > 0 ? `
                        <div class="alerts-section">
                            <h4><i class="fas fa-exclamation-triangle"></i> Alertes Équipement</h4>
                            ${alerts.map(alert => `
                                <div class="alert alert-${alert.severity}">
                                    <strong>${alert.equipment}:</strong> ${alert.message}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="equipment-grid">
                        ${equipment.map(eq => `
                            <div class="equipment-card">
                                <div class="equipment-header">
                                    <h4>${eq.name}</h4>
                                    <span class="status-badge status-${eq.status}">${eq.status.toUpperCase()}</span>
                                </div>
                                <div class="equipment-info">
                                    <p><strong>Type:</strong> ${eq.type}</p>
                                    <p><strong>IP:</strong> ${eq.ipAddress}</p>
                                    <p><strong>Uptime:</strong> ${eq.uptime}</p>
                                    <p><strong>CPU:</strong> ${eq.cpuUsage}%</p>
                                    <p><strong>Mémoire:</strong> ${eq.memoryUsage}%</p>
                                    <p><strong>Température:</strong> ${eq.temperature}°C</p>
                                </div>
                                <div class="equipment-actions">
                                    <button class="btn btn-sm btn-primary" onclick="dashboardManager.manageEquipment('${eq.id}')">Détails</button>
                                    ${eq.status === 'online' ? 
                                        `<button class="btn btn-sm btn-warning" onclick="dashboardManager.maintenanceEquipment('${eq.id}')">Maintenance</button>` :
                                        `<button class="btn btn-sm btn-success" onclick="dashboardManager.startEquipment('${eq.id}')">Démarrer</button>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            this.updateSectionContent(content);
        } catch (error) {
            console.error('Erreur lors du chargement des équipements:', error);
        }
    }

    // Charger les abonnements
    loadSubscriptions() {
        try {
            const subscriptions = window.subscriptionManager.getAllSubscriptions();
            const stats = window.subscriptionManager.getSubscriptionStats();
            const expiring = window.subscriptionManager.getExpiringSoon();

            const content = `
                <div class="section-content">
                    <h3><i class="fas fa-calendar-check"></i> Gestion des Abonnements</h3>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Abonnements</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.active}</div>
                            <div class="stat-label">Actifs</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.expired}</div>
                            <div class="stat-label">Expirés</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.monthlyRevenue.toLocaleString()} FC</div>
                            <div class="stat-label">Revenus Mensuels</div>
                        </div>
                    </div>

                    ${expiring.length > 0 ? `
                        <div class="expiring-section">
                            <h4><i class="fas fa-clock"></i> Expirant Bientôt</h4>
                            <div class="expiring-list">
                                ${expiring.map(sub => `
                                    <div class="expiring-item">
                                        <strong>${sub.userName}</strong> - ${sub.plan} 
                                        <span class="expiry-date">Expire: ${new Date(sub.endDate).toLocaleString()}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="subscriptions-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Plan</th>
                                    <th>Statut</th>
                                    <th>Expiration</th>
                                    <th>Données</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subscriptions.slice(0, 20).map(sub => `
                                    <tr>
                                        <td>${sub.userName}</td>
                                        <td>${sub.plan}</td>
                                        <td><span class="status-badge status-${sub.status}">${sub.status}</span></td>
                                        <td>${new Date(sub.endDate).toLocaleDateString()}</td>
                                        <td>${sub.dataUsed} GB</td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="dashboardManager.manageSubscription('${sub.id}')">Gérer</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            this.updateSectionContent(content);
        } catch (error) {
            console.error('Erreur lors du chargement des abonnements:', error);
        }
    }

    // Charger les utilisateurs
    loadUsers() {
        try {
            const users = window.userManager.getAllUsers();
            const stats = window.userManager.getUserStats();
            const activeSessions = window.userManager.getActiveSessions();

            const content = `
                <div class="section-content">
                    <h3><i class="fas fa-users"></i> Gestion des Utilisateurs</h3>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Utilisateurs</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.active}</div>
                            <div class="stat-label">Actifs</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${activeSessions.length}</div>
                            <div class="stat-label">Sessions Actives</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.totalRevenue.toLocaleString()} FC</div>
                            <div class="stat-label">Revenus Total</div>
                        </div>
                    </div>

                    <div class="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Statut</th>
                                    <th>Dernière Connexion</th>
                                    <th>Total Dépensé</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.userType}</td>
                                        <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                                        <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}</td>
                                        <td>${user.totalSpent.toLocaleString()} FC</td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="dashboardManager.manageUser('${user.id}')">Gérer</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            this.updateSectionContent(content);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
        }
    }

    // Charger les transactions
    loadTransactions() {
        try {
            const transactions = window.transactionManager.getAllTransactions();
            const stats = window.transactionManager.getTransactionStats();
            const recentTransactions = window.transactionManager.getRecentTransactions(15);

            const content = `
                <div class="section-content">
                    <h3><i class="fas fa-money-bill-wave"></i> Gestion des Transactions</h3>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Transactions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.todayRevenue.toLocaleString()} FC</div>
                            <div class="stat-label">Revenus Aujourd'hui</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.monthlyRevenue.toLocaleString()} FC</div>
                            <div class="stat-label">Revenus Mensuels</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.pending}</div>
                            <div class="stat-label">En Attente</div>
                        </div>
                    </div>

                    <div class="transactions-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Référence</th>
                                    <th>Utilisateur</th>
                                    <th>Plan</th>
                                    <th>Montant</th>
                                    <th>Statut</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentTransactions.map(txn => `
                                    <tr>
                                        <td>${txn.reference}</td>
                                        <td>${txn.userName}</td>
                                        <td>${txn.plan}</td>
                                        <td>${txn.amount.toLocaleString()} FC</td>
                                        <td><span class="status-badge status-${txn.status}">${txn.status}</span></td>
                                        <td>${new Date(txn.transactionDate).toLocaleDateString()}</td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="dashboardManager.manageTransaction('${txn.id}')">Détails</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            this.updateSectionContent(content);
        } catch (error) {
            console.error('Erreur lors du chargement des transactions:', error);
        }
    }

    // Charger les zones WiFi
    loadWifiZones() {
        try {
            const zones = window.zoneManager.getAllZones();
            const stats = window.zoneManager.getZoneStats();
            const alerts = window.zoneManager.getZoneAlerts();

            const content = `
                <div class="section-content">
                    <h3><i class="fas fa-map-marker-alt"></i> Gestion des Zones WiFi</h3>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Zones</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.active}</div>
                            <div class="stat-label">Actives</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.totalUsers}</div>
                            <div class="stat-label">Utilisateurs Connectés</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.occupancyRate}%</div>
                            <div class="stat-label">Taux Occupation</div>
                        </div>
                    </div>

                    ${alerts.length > 0 ? `
                        <div class="alerts-section">
                            <h4><i class="fas fa-exclamation-triangle"></i> Alertes Zones</h4>
                            ${alerts.map(alert => `
                                <div class="alert alert-${alert.severity}">
                                    <strong>${alert.zone}:</strong> ${alert.message}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="zones-grid">
                        ${zones.map(zone => `
                            <div class="zone-card">
                                <div class="zone-header">
                                    <h4>${zone.name}</h4>
                                    <span class="status-badge status-${zone.status}">${zone.status.toUpperCase()}</span>
                                </div>
                                <div class="zone-info">
                                    <p><strong>Localisation:</strong> ${zone.location}</p>
                                    <p><strong>Signal:</strong> ${zone.signalStrength}</p>
                                    <p><strong>Utilisateurs:</strong> ${zone.currentUsers}/${zone.maxUsers}</p>
                                    <p><strong>Vitesse:</strong> ${zone.averageSpeed} Mbps</p>
                                    <p><strong>Revenus:</strong> ${zone.monthlyRevenue.toLocaleString()} FC</p>
                                </div>
                                <div class="zone-actions">
                                    <button class="btn btn-sm btn-primary" onclick="dashboardManager.manageZone('${zone.id}')">Gérer</button>
                                    <button class="btn btn-sm btn-secondary" onclick="dashboardManager.viewZoneMap('${zone.id}')">Carte</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            this.updateSectionContent(content);
        } catch (error) {
            console.error('Erreur lors du chargement des zones WiFi:', error);
        }
    }

    // Mettre à jour une carte de statistiques
    updateStatsCard(cardId, value) {
        const element = document.getElementById(cardId);
        if (element) {
            element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
    }

    // Mettre à jour les connexions live
    updateLiveConnections() {
        const activeSessions = window.userManager.getActiveSessions();
        const container = document.querySelector('.live-connections');
        
        if (container) {
            container.innerHTML = activeSessions.slice(0, 5).map(session => `
                <div class="connection-item">
                    <div class="user-info">
                        <strong>User ${session.userId.slice(-3)}</strong>
                        <small>${session.location}</small>
                    </div>
                    <div class="connection-status">
                        <span class="status-indicator online"></span>
                        <span>Actif</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Mettre à jour la surveillance
    updateMonitoring() {
        const equipmentStats = window.equipmentManager.getEquipmentStats();
        const zoneStats = window.zoneManager.getZoneStats();
        
        const monitoring = document.querySelector('.monitoring');
        if (monitoring) {
            monitoring.innerHTML = `
                <div class="metric">
                    <span>Bande passante:</span>
                    <span class="value">${zoneStats.avgBandwidth}%</span>
                </div>
                <div class="metric">
                    <span>Température moy:</span>
                    <span class="value">${equipmentStats.avgTemp}°C</span>
                </div>
                <div class="metric">
                    <span>CPU moyen:</span>
                    <span class="value">${equipmentStats.avgCpu}%</span>
                </div>
            `;
        }
    }

    // Mettre à jour les alertes
    updateAlerts() {
        const equipmentAlerts = window.equipmentManager.getEquipmentAlerts();
        const zoneAlerts = window.zoneManager.getZoneAlerts();
        const allAlerts = [...equipmentAlerts, ...zoneAlerts];
        
        // Afficher les alertes dans une section dédiée si elle existe
        const alertsContainer = document.querySelector('.alerts-container');
        if (alertsContainer && allAlerts.length > 0) {
            alertsContainer.innerHTML = `
                <h4><i class="fas fa-exclamation-triangle"></i> Alertes Système</h4>
                ${allAlerts.slice(0, 5).map(alert => `
                    <div class="alert alert-${alert.severity}">
                        <strong>${alert.equipment || alert.zone}:</strong> ${alert.message}
                    </div>
                `).join('')}
            `;
        }
    }

    // Mettre à jour le contenu d'une section
    updateSectionContent(content) {
        const dashboardContainer = document.querySelector('#dashboard .container');
        if (dashboardContainer) {
            // Garder le titre et la navigation
            const title = dashboardContainer.querySelector('h2');
            const nav = dashboardContainer.querySelector('.dashboard-nav');
            
            dashboardContainer.innerHTML = content;
            
            // Remettre le titre et la navigation
            if (title) {
                dashboardContainer.insertBefore(title, dashboardContainer.firstChild);
            }
            if (nav) {
                dashboardContainer.appendChild(nav);
            }
        }
    }

    // Méthodes d'actions pour les boutons
    manageRouter(routerId) {
        const router = window.routerManager.getRouterById(routerId);
        if (router) {
            alert(`Gestion du routeur: ${router.name}\nStatut: ${router.status}\nUtilisateurs: ${router.connectedUsers}/${router.maxUsers}`);
        }
    }

    suspendRouter(routerId) {
        if (confirm('Êtes-vous sûr de vouloir suspendre ce routeur?')) {
            window.routerManager.suspendRouter(routerId);
            this.refreshActiveSection();
        }
    }

    reconnectRouter(routerId) {
        window.routerManager.reconnectRouter(routerId);
        this.refreshActiveSection();
    }

    manageEquipment(equipmentId) {
        const equipment = window.equipmentManager.getEquipmentById(equipmentId);
        if (equipment) {
            alert(`Équipement: ${equipment.name}\nType: ${equipment.type}\nStatut: ${equipment.status}\nCPU: ${equipment.cpuUsage}%`);
        }
    }

    maintenanceEquipment(equipmentId) {
        if (confirm('Mettre cet équipement en maintenance?')) {
            window.equipmentManager.updateEquipmentStatus(equipmentId, 'maintenance');
            this.refreshActiveSection();
        }
    }

    startEquipment(equipmentId) {
        window.equipmentManager.updateEquipmentStatus(equipmentId, 'online');
        this.refreshActiveSection();
    }

    manageSubscription(subscriptionId) {
        const subscription = window.subscriptionManager.getSubscriptionById(subscriptionId);
        if (subscription) {
            alert(`Abonnement: ${subscription.userName}\nPlan: ${subscription.plan}\nStatut: ${subscription.status}\nExpiration: ${new Date(subscription.endDate).toLocaleDateString()}`);
        }
    }

    manageUser(userId) {
        const user = window.userManager.getUserById(userId);
        if (user) {
            alert(`Utilisateur: ${user.name}\nEmail: ${user.email}\nType: ${user.userType}\nStatut: ${user.status}\nTotal dépensé: ${user.totalSpent} FC`);
        }
    }

    manageTransaction(transactionId) {
        const transaction = window.transactionManager.getTransactionById(transactionId);
        if (transaction) {
            alert(`Transaction: ${transaction.reference}\nUtilisateur: ${transaction.userName}\nMontant: ${transaction.amount} FC\nStatut: ${transaction.status}`);
        }
    }

    manageZone(zoneId) {
        const zone = window.zoneManager.getZoneById(zoneId);
        if (zone) {
            alert(`Zone: ${zone.name}\nLocalisation: ${zone.location}\nUtilisateurs: ${zone.currentUsers}/${zone.maxUsers}\nSignal: ${zone.signalStrength}`);
        }
    }

    viewZoneMap(zoneId) {
        const zone = window.zoneManager.getZoneById(zoneId);
        if (zone) {
            alert(`Carte de la zone: ${zone.name}\nCoordonnées: ${zone.coordinates.lat}, ${zone.coordinates.lng}\nCouverture: ${zone.coverage}m`);
        }
    }
}

// Initialiser le gestionnaire du tableau de bord
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Fonction globale pour l'affichage des sections (appelée depuis les boutons)
window.showDashboardSection = function(section) {
    if (window.dashboardManager) {
        window.dashboardManager.showDashboardSection(section);
    }
};
