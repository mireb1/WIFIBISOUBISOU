// Script de gestion des vouchers de production - WiFi Bisou Bisou

class ProductionVoucherManager {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        // Éviter les conflits avec le mode démo
        if (localStorage.getItem('isDemoMode') === 'true') {
            console.log('Mode démo détecté, gestionnaire de production désactivé');
            return;
        }

        this.initialized = true;
        this.ensureProductionData();
    }

    // S'assurer que les données de production sont séparées des données de démo
    ensureProductionData() {
        const prodVouchers = localStorage.getItem('production_vouchers');
        const prodUsers = localStorage.getItem('production_users');
        
        if (!prodVouchers) {
            localStorage.setItem('production_vouchers', JSON.stringify([]));
        }
        
        if (!prodUsers) {
            localStorage.setItem('production_users', JSON.stringify([]));
        }
    }

    // Créer un voucher de production
    createVoucher(planType, price, userInfo) {
        if (!this.initialized) return null;

        const voucher = {
            id: 'PROD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            code: this.generateVoucherCode(),
            plan: planType,
            price: price,
            userId: userInfo.id,
            userPhone: userInfo.phone,
            userName: userInfo.name,
            createdAt: new Date().toISOString(),
            expiresAt: this.calculateExpirationTime(planType),
            status: 'active',
            usedAt: null,
            location: null,
            isProduction: true
        };

        // Sauvegarder dans les données de production
        const vouchers = JSON.parse(localStorage.getItem('production_vouchers') || '[]');
        vouchers.push(voucher);
        localStorage.setItem('production_vouchers', JSON.stringify(vouchers));

        return voucher;
    }

    // Générer un code de voucher unique
    generateVoucherCode() {
        const year = new Date().getFullYear();
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `WIFI-${year}-${code}`;
    }

    // Calculer l'heure d'expiration
    calculateExpirationTime(planType) {
        const now = new Date();
        let expirationTime;

        switch(planType) {
            case 'basic':
                expirationTime = new Date(now.getTime() + (1 * 60 * 60 * 1000)); // 1 heure
                break;
            case 'premium':
                expirationTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // 6 heures
                break;
            case 'daily':
                expirationTime = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 heures
                break;
            default:
                expirationTime = new Date(now.getTime() + (1 * 60 * 60 * 1000)); // 1 heure par défaut
        }

        return expirationTime.toISOString();
    }

    // Valider un voucher
    validateVoucher(voucherCode) {
        if (!this.initialized) return null;

        const vouchers = JSON.parse(localStorage.getItem('production_vouchers') || '[]');
        const voucher = vouchers.find(v => v.code === voucherCode);

        if (!voucher) {
            return { valid: false, message: 'Code de voucher invalide' };
        }

        if (voucher.status !== 'active') {
            return { valid: false, message: 'Ce voucher a déjà été utilisé' };
        }

        if (new Date() > new Date(voucher.expiresAt)) {
            return { valid: false, message: 'Ce voucher a expiré' };
        }

        return { valid: true, voucher: voucher };
    }

    // Utiliser un voucher
    useVoucher(voucherCode, location = null) {
        if (!this.initialized) return false;

        const vouchers = JSON.parse(localStorage.getItem('production_vouchers') || '[]');
        const voucherIndex = vouchers.findIndex(v => v.code === voucherCode);

        if (voucherIndex === -1) return false;

        const voucher = vouchers[voucherIndex];
        if (voucher.status !== 'active') return false;

        // Marquer comme utilisé
        voucher.status = 'used';
        voucher.usedAt = new Date().toISOString();
        voucher.location = location;

        // Sauvegarder
        vouchers[voucherIndex] = voucher;
        localStorage.setItem('production_vouchers', JSON.stringify(vouchers));

        return true;
    }

    // Obtenir les statistiques de production
    getProductionStats() {
        if (!this.initialized) return null;

        const vouchers = JSON.parse(localStorage.getItem('production_vouchers') || '[]');
        const users = JSON.parse(localStorage.getItem('production_users') || '[]');

        return {
            totalVouchers: vouchers.length,
            activeVouchers: vouchers.filter(v => v.status === 'active').length,
            usedVouchers: vouchers.filter(v => v.status === 'used').length,
            expiredVouchers: vouchers.filter(v => new Date() > new Date(v.expiresAt) && v.status === 'active').length,
            totalRevenue: vouchers.reduce((sum, v) => sum + v.price, 0),
            totalUsers: users.length,
            todayVouchers: vouchers.filter(v => {
                const today = new Date().toDateString();
                return new Date(v.createdAt).toDateString() === today;
            }).length
        };
    }

    // Nettoyer les vouchers expirés
    cleanupExpiredVouchers() {
        if (!this.initialized) return;

        const vouchers = JSON.parse(localStorage.getItem('production_vouchers') || '[]');
        const now = new Date();
        
        vouchers.forEach(voucher => {
            if (voucher.status === 'active' && new Date(voucher.expiresAt) < now) {
                voucher.status = 'expired';
            }
        });

        localStorage.setItem('production_vouchers', JSON.stringify(vouchers));
    }
}

// Initialiser le gestionnaire de production
const productionVoucherManager = new ProductionVoucherManager();

// Nettoyer les vouchers expirés toutes les 5 minutes
setInterval(() => {
    productionVoucherManager.cleanupExpiredVouchers();
}, 5 * 60 * 1000);

// Exporter globalement
window.productionVoucherManager = productionVoucherManager;

console.log('📊 Gestionnaire de vouchers de production initialisé');
