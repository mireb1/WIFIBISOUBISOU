// Gestionnaire des Équipements - WiFi Bisou Bisou
class EquipmentManager {
    constructor() {
        this.equipment = this.loadEquipment();
        this.initializeDefaultEquipment();
    }

    // Initialiser les équipements par défaut
    initializeDefaultEquipment() {
        if (this.equipment.length === 0) {
            this.equipment = [
                {
                    id: 'EQP001',
                    name: 'Serveur d\'Authentification Principal',
                    type: 'server',
                    ipAddress: '192.168.0.10',
                    status: 'online',
                    location: 'Data Center Kinshasa',
                    uptime: '99.9%',
                    cpuUsage: 45,
                    memoryUsage: 67,
                    diskUsage: 34,
                    lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    nextMaintenance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                    connectedRouters: 15,
                    temperature: 42
                },
                {
                    id: 'EQP002',
                    name: 'Serveur de Base de Données',
                    type: 'database',
                    ipAddress: '192.168.0.11',
                    status: 'online',
                    location: 'Data Center Kinshasa',
                    uptime: '99.5%',
                    cpuUsage: 23,
                    memoryUsage: 78,
                    diskUsage: 56,
                    lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    nextMaintenance: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
                    connectedRouters: 15,
                    temperature: 38
                },
                {
                    id: 'EQP003',
                    name: 'Switch Principal',
                    type: 'switch',
                    ipAddress: '192.168.0.20',
                    status: 'online',
                    location: 'Salle Réseau Principal',
                    uptime: '99.8%',
                    cpuUsage: 12,
                    memoryUsage: 34,
                    diskUsage: 15,
                    lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                    nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    connectedRouters: 25,
                    temperature: 35
                },
                {
                    id: 'EQP004',
                    name: 'Serveur de Monitoring',
                    type: 'monitoring',
                    ipAddress: '192.168.0.12',
                    status: 'maintenance',
                    location: 'Data Center Kinshasa',
                    uptime: '95.2%',
                    cpuUsage: 0,
                    memoryUsage: 0,
                    diskUsage: 67,
                    lastMaintenance: new Date().toISOString(),
                    nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    connectedRouters: 0,
                    temperature: 25
                },
                {
                    id: 'EQP005',
                    name: 'Firewall Principal',
                    type: 'firewall',
                    ipAddress: '192.168.0.1',
                    status: 'online',
                    location: 'Salle Sécurité',
                    uptime: '99.9%',
                    cpuUsage: 67,
                    memoryUsage: 45,
                    diskUsage: 23,
                    lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    connectedRouters: 15,
                    temperature: 41
                },
                {
                    id: 'EQP006',
                    name: 'Serveur de Sauvegarde',
                    type: 'backup',
                    ipAddress: '192.168.0.13',
                    status: 'online',
                    location: 'Data Center Secondaire',
                    uptime: '98.7%',
                    cpuUsage: 89,
                    memoryUsage: 92,
                    diskUsage: 87,
                    lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    nextMaintenance: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
                    connectedRouters: 15,
                    temperature: 48
                }
            ];
            this.saveEquipment();
        }
    }

    // Sauvegarder les équipements
    saveEquipment() {
        localStorage.setItem('equipment', JSON.stringify(this.equipment));
    }

    // Charger les équipements
    loadEquipment() {
        const stored = localStorage.getItem('equipment');
        return stored ? JSON.parse(stored) : [];
    }

    // Obtenir tous les équipements
    getAllEquipment() {
        return this.equipment;
    }

    // Obtenir un équipement par ID
    getEquipmentById(id) {
        return this.equipment.find(eq => eq.id === id);
    }

    // Obtenir les statistiques des équipements
    getEquipmentStats() {
        const online = this.equipment.filter(eq => eq.status === 'online').length;
        const offline = this.equipment.filter(eq => eq.status === 'offline').length;
        const maintenance = this.equipment.filter(eq => eq.status === 'maintenance').length;
        const avgCpu = this.equipment.reduce((sum, eq) => sum + eq.cpuUsage, 0) / this.equipment.length;
        const avgMemory = this.equipment.reduce((sum, eq) => sum + eq.memoryUsage, 0) / this.equipment.length;
        const avgTemp = this.equipment.reduce((sum, eq) => sum + eq.temperature, 0) / this.equipment.length;

        return {
            total: this.equipment.length,
            online,
            offline,
            maintenance,
            avgCpu: Math.round(avgCpu),
            avgMemory: Math.round(avgMemory),
            avgTemp: Math.round(avgTemp)
        };
    }

    // Simuler l'activité des équipements
    simulateEquipmentActivity() {
        this.equipment.forEach(eq => {
            if (eq.status === 'online') {
                // Simuler l'utilisation CPU
                eq.cpuUsage = Math.max(5, Math.min(95, eq.cpuUsage + Math.floor(Math.random() * 20) - 10));
                
                // Simuler l'utilisation mémoire
                eq.memoryUsage = Math.max(10, Math.min(95, eq.memoryUsage + Math.floor(Math.random() * 10) - 5));
                
                // Simuler la température
                eq.temperature = Math.max(25, Math.min(60, eq.temperature + Math.floor(Math.random() * 6) - 3));
            } else if (eq.status === 'maintenance') {
                eq.cpuUsage = 0;
                eq.memoryUsage = 0;
                eq.temperature = 25;
            }
        });
        this.saveEquipment();
    }

    // Obtenir les équipements nécessitant une maintenance
    getMaintenanceRequired() {
        const now = new Date();
        return this.equipment.filter(eq => {
            const nextMaintenance = new Date(eq.nextMaintenance);
            return nextMaintenance <= now || eq.temperature > 55 || eq.cpuUsage > 90;
        });
    }

    // Mettre à jour le statut d'un équipement
    updateEquipmentStatus(id, status) {
        const equipment = this.getEquipmentById(id);
        if (equipment) {
            equipment.status = status;
            if (status === 'maintenance') {
                equipment.lastMaintenance = new Date().toISOString();
                equipment.nextMaintenance = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
            }
            this.saveEquipment();
        }
    }

    // Obtenir les alertes d'équipement
    getEquipmentAlerts() {
        const alerts = [];
        this.equipment.forEach(eq => {
            if (eq.temperature > 50) {
                alerts.push({
                    type: 'temperature',
                    equipment: eq.name,
                    message: `Température élevée: ${eq.temperature}°C`,
                    severity: eq.temperature > 55 ? 'critical' : 'warning'
                });
            }
            if (eq.cpuUsage > 85) {
                alerts.push({
                    type: 'cpu',
                    equipment: eq.name,
                    message: `Utilisation CPU élevée: ${eq.cpuUsage}%`,
                    severity: eq.cpuUsage > 90 ? 'critical' : 'warning'
                });
            }
            if (eq.memoryUsage > 90) {
                alerts.push({
                    type: 'memory',
                    equipment: eq.name,
                    message: `Utilisation mémoire élevée: ${eq.memoryUsage}%`,
                    severity: 'warning'
                });
            }
        });
        return alerts;
    }
}

// Instance globale
window.equipmentManager = new EquipmentManager();
