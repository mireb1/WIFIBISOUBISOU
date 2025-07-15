// Gestionnaire des Zones WiFi - WiFi Bisou Bisou
class ZoneManager {
    constructor() {
        this.zones = this.loadZones();
        this.initializeDefaultZones();
    }

    // Initialiser les zones par défaut
    initializeDefaultZones() {
        if (this.zones.length === 0) {
            this.zones = [
                {
                    id: 'ZONE001',
                    name: 'Zone Centre-Ville',
                    location: 'Avenue Kasa-Vubu, Kinshasa',
                    coordinates: { lat: -4.3317, lng: 15.3139 },
                    address: 'Avenue Kasa-Vubu, Commune de la Gombe, Kinshasa',
                    status: 'active',
                    signalStrength: 'excellent',
                    currentUsers: 45,
                    maxUsers: 100,
                    routerId: 'RTR001',
                    coverage: 500, // mètres
                    bandwidth: 85, // pourcentage utilisé
                    averageSpeed: 25, // Mbps
                    createdDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
                    lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    monthlyRevenue: 125000,
                    popularHours: ['9-12', '14-17', '19-22'],
                    amenities: ['Restaurant', 'Parking', 'Climatisation'],
                    description: 'Zone principale du centre-ville avec excellent signal et nombreux services',
                    category: 'commercial'
                },
                {
                    id: 'ZONE002',
                    name: 'Zone Université',
                    location: 'Campus UNIKIN',
                    coordinates: { lat: -4.4419, lng: 15.2816 },
                    address: 'Campus Universitaire de Kinshasa, Mont-Amba',
                    status: 'active',
                    signalStrength: 'good',
                    currentUsers: 78,
                    maxUsers: 150,
                    routerId: 'RTR002',
                    coverage: 800,
                    bandwidth: 67,
                    averageSpeed: 18,
                    createdDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
                    lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    monthlyRevenue: 95000,
                    popularHours: ['8-11', '13-16', '18-21'],
                    amenities: ['Bibliothèque', 'Cafétéria', 'Salle d\'étude'],
                    description: 'Zone universitaire avec couverture étendue pour les étudiants',
                    category: 'educational'
                },
                {
                    id: 'ZONE003',
                    name: 'Zone Marché Central',
                    location: 'Marché Central',
                    coordinates: { lat: -4.3276, lng: 15.3086 },
                    address: 'Marché Central, Commune de la Gombe, Kinshasa',
                    status: 'active',
                    signalStrength: 'fair',
                    currentUsers: 32,
                    maxUsers: 80,
                    routerId: 'RTR003',
                    coverage: 300,
                    bandwidth: 78,
                    averageSpeed: 15,
                    createdDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
                    lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    monthlyRevenue: 67000,
                    popularHours: ['6-9', '11-14', '16-19'],
                    amenities: ['Marché', 'Transport public', 'Vendeurs'],
                    description: 'Zone commerciale animée avec beaucoup de passage',
                    category: 'commercial'
                },
                {
                    id: 'ZONE004',
                    name: 'Zone Hôtel Palace',
                    location: 'Hôtel Palace Gombe',
                    coordinates: { lat: -4.3198, lng: 15.3177 },
                    address: 'Boulevard du 30 Juin, Commune de la Gombe, Kinshasa',
                    status: 'active',
                    signalStrength: 'excellent',
                    currentUsers: 23,
                    maxUsers: 80,
                    routerId: 'RTR004',
                    coverage: 400,
                    bandwidth: 45,
                    averageSpeed: 35,
                    createdDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                    lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    monthlyRevenue: 155000,
                    popularHours: ['7-10', '12-15', '18-23'],
                    amenities: ['Hôtel', 'Restaurant', 'Piscine', 'Spa'],
                    description: 'Zone premium avec services haut de gamme',
                    category: 'hospitality'
                },
                {
                    id: 'ZONE005',
                    name: 'Zone Aéroport',
                    location: 'Aéroport International de Ndjili',
                    coordinates: { lat: -4.3857, lng: 15.4446 },
                    address: 'Aéroport International de Ndjili, Kinshasa',
                    status: 'maintenance',
                    signalStrength: 'good',
                    currentUsers: 0,
                    maxUsers: 200,
                    routerId: 'RTR005',
                    coverage: 1000,
                    bandwidth: 0,
                    averageSpeed: 0,
                    createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    lastMaintenance: new Date().toISOString(),
                    monthlyRevenue: 89000,
                    popularHours: ['5-8', '10-13', '15-18', '20-23'],
                    amenities: ['Aéroport', 'Duty-free', 'Restaurants', 'Lounges'],
                    description: 'Zone aéroportuaire avec couverture étendue',
                    category: 'transport'
                },
                {
                    id: 'ZONE006',
                    name: 'Zone Stade Martyrs',
                    location: 'Stade des Martyrs',
                    coordinates: { lat: -4.3421, lng: 15.2944 },
                    address: 'Stade des Martyrs, Commune de Kalamu, Kinshasa',
                    status: 'active',
                    signalStrength: 'good',
                    currentUsers: 12,
                    maxUsers: 300,
                    routerId: 'RTR006',
                    coverage: 1200,
                    bandwidth: 25,
                    averageSpeed: 20,
                    createdDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    monthlyRevenue: 45000,
                    popularHours: ['14-17', '19-22'],
                    amenities: ['Stade', 'Parking', 'Buvette'],
                    description: 'Zone sportive avec grande capacité pour les événements',
                    category: 'sports'
                }
            ];
            this.saveZones();
        }
    }

    // Sauvegarder les zones
    saveZones() {
        localStorage.setItem('zones', JSON.stringify(this.zones));
    }

    // Charger les zones
    loadZones() {
        const stored = localStorage.getItem('zones');
        return stored ? JSON.parse(stored) : [];
    }

    // Obtenir toutes les zones
    getAllZones() {
        return this.zones;
    }

    // Obtenir une zone par ID
    getZoneById(id) {
        return this.zones.find(zone => zone.id === id);
    }

    // Obtenir les statistiques des zones
    getZoneStats() {
        const active = this.zones.filter(zone => zone.status === 'active').length;
        const maintenance = this.zones.filter(zone => zone.status === 'maintenance').length;
        const offline = this.zones.filter(zone => zone.status === 'offline').length;
        
        const totalUsers = this.zones.reduce((sum, zone) => sum + zone.currentUsers, 0);
        const totalCapacity = this.zones.reduce((sum, zone) => sum + zone.maxUsers, 0);
        const totalRevenue = this.zones.reduce((sum, zone) => sum + zone.monthlyRevenue, 0);
        const avgBandwidth = this.zones.reduce((sum, zone) => sum + zone.bandwidth, 0) / this.zones.length;
        const avgSpeed = this.zones.reduce((sum, zone) => sum + zone.averageSpeed, 0) / this.zones.length;

        return {
            total: this.zones.length,
            active,
            maintenance,
            offline,
            totalUsers,
            totalCapacity,
            occupancyRate: Math.round((totalUsers / totalCapacity) * 100),
            totalRevenue,
            avgBandwidth: Math.round(avgBandwidth),
            avgSpeed: Math.round(avgSpeed)
        };
    }

    // Obtenir les zones par catégorie
    getZonesByCategory() {
        const categories = {};
        this.zones.forEach(zone => {
            if (!categories[zone.category]) {
                categories[zone.category] = [];
            }
            categories[zone.category].push(zone);
        });
        return categories;
    }

    // Obtenir les zones les plus populaires
    getPopularZones(limit = 5) {
        return this.zones
            .sort((a, b) => b.currentUsers - a.currentUsers)
            .slice(0, limit);
    }

    // Obtenir les zones les plus rentables
    getTopRevenueZones(limit = 5) {
        return this.zones
            .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
            .slice(0, limit);
    }

    // Mettre à jour le statut d'une zone
    updateZoneStatus(zoneId, status) {
        const zone = this.getZoneById(zoneId);
        if (zone) {
            zone.status = status;
            if (status === 'maintenance' || status === 'offline') {
                zone.currentUsers = 0;
                zone.bandwidth = 0;
                zone.averageSpeed = 0;
            }
            this.saveZones();
        }
    }

    // Simuler l'activité des zones
    simulateZoneActivity() {
        this.zones.forEach(zone => {
            if (zone.status === 'active') {
                // Simuler le nombre d'utilisateurs
                const variation = Math.floor(Math.random() * 10) - 5;
                zone.currentUsers = Math.max(0, Math.min(zone.maxUsers, zone.currentUsers + variation));
                
                // Simuler la bande passante
                const bandwidthBase = Math.min(90, (zone.currentUsers / zone.maxUsers) * 100);
                zone.bandwidth = Math.max(10, bandwidthBase + Math.floor(Math.random() * 20) - 10);
                
                // Simuler la vitesse
                const speedBase = Math.max(5, 40 - (zone.bandwidth / 100) * 20);
                zone.averageSpeed = Math.max(5, Math.min(40, speedBase + Math.floor(Math.random() * 10) - 5));
            }
        });
        this.saveZones();
    }

    // Obtenir les zones nécessitant une maintenance
    getMaintenanceRequired() {
        const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        return this.zones.filter(zone => {
            const lastMaintenance = new Date(zone.lastMaintenance);
            return lastMaintenance < threeMonthsAgo || zone.bandwidth > 90;
        });
    }

    // Créer une nouvelle zone
    createZone(zoneData) {
        const zone = {
            id: `ZONE${String(this.zones.length + 1).padStart(3, '0')}`,
            name: zoneData.name,
            location: zoneData.location,
            coordinates: zoneData.coordinates,
            address: zoneData.address,
            status: 'active',
            signalStrength: 'good',
            currentUsers: 0,
            maxUsers: zoneData.maxUsers || 100,
            routerId: zoneData.routerId,
            coverage: zoneData.coverage || 500,
            bandwidth: 0,
            averageSpeed: 0,
            createdDate: new Date().toISOString(),
            lastMaintenance: new Date().toISOString(),
            monthlyRevenue: 0,
            popularHours: [],
            amenities: zoneData.amenities || [],
            description: zoneData.description || '',
            category: zoneData.category || 'general'
        };

        this.zones.push(zone);
        this.saveZones();
        return zone;
    }

    // Obtenir les zones avec faible signal
    getLowSignalZones() {
        return this.zones.filter(zone => zone.signalStrength === 'poor' || zone.signalStrength === 'fair');
    }

    // Obtenir les zones surpeuplées
    getOvercrowdedZones() {
        return this.zones.filter(zone => {
            const occupancy = (zone.currentUsers / zone.maxUsers) * 100;
            return occupancy > 85;
        });
    }

    // Obtenir les heures de pointe par zone
    getPeakHours() {
        const peakHours = {};
        this.zones.forEach(zone => {
            peakHours[zone.id] = {
                name: zone.name,
                popularHours: zone.popularHours,
                currentUsers: zone.currentUsers,
                maxUsers: zone.maxUsers
            };
        });
        return peakHours;
    }

    // Calculer la distance entre deux zones
    calculateDistance(zone1Id, zone2Id) {
        const zone1 = this.getZoneById(zone1Id);
        const zone2 = this.getZoneById(zone2Id);
        
        if (!zone1 || !zone2) return null;

        const R = 6371; // Rayon de la Terre en km
        const dLat = (zone2.coordinates.lat - zone1.coordinates.lat) * Math.PI / 180;
        const dLng = (zone2.coordinates.lng - zone1.coordinates.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(zone1.coordinates.lat * Math.PI / 180) * Math.cos(zone2.coordinates.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Obtenir les zones proches
    getNearbyZones(zoneId, radius = 5) {
        const targetZone = this.getZoneById(zoneId);
        if (!targetZone) return [];

        return this.zones.filter(zone => {
            if (zone.id === zoneId) return false;
            const distance = this.calculateDistance(zoneId, zone.id);
            return distance !== null && distance <= radius;
        });
    }

    // Obtenir les alertes de zone
    getZoneAlerts() {
        const alerts = [];
        this.zones.forEach(zone => {
            const occupancy = (zone.currentUsers / zone.maxUsers) * 100;
            
            if (occupancy > 95) {
                alerts.push({
                    type: 'overcrowded',
                    zone: zone.name,
                    message: `Zone saturée: ${zone.currentUsers}/${zone.maxUsers} utilisateurs`,
                    severity: 'critical'
                });
            } else if (occupancy > 85) {
                alerts.push({
                    type: 'high_usage',
                    zone: zone.name,
                    message: `Usage élevé: ${zone.currentUsers}/${zone.maxUsers} utilisateurs`,
                    severity: 'warning'
                });
            }
            
            if (zone.bandwidth > 90) {
                alerts.push({
                    type: 'bandwidth',
                    zone: zone.name,
                    message: `Bande passante saturée: ${zone.bandwidth}%`,
                    severity: 'critical'
                });
            }
            
            if (zone.averageSpeed < 10) {
                alerts.push({
                    type: 'slow_speed',
                    zone: zone.name,
                    message: `Vitesse faible: ${zone.averageSpeed} Mbps`,
                    severity: 'warning'
                });
            }
        });
        return alerts;
    }
}

// Instance globale
window.zoneManager = new ZoneManager();
