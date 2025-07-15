// Gestionnaire de vouchers pour WiFi Bisou Bisou
class VoucherManager {
    constructor() {
        this.vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
        this.usedVouchers = JSON.parse(localStorage.getItem('usedVouchers')) || [];
        this.init();
    }

    init() {
        console.log('🎟️ Gestionnaire de vouchers initialisé');
        this.cleanExpiredVouchers();
    }

    // Générer un nouveau voucher
    generateVoucher(planType, price) {
        const voucher = {
            code: this.generateVoucherCode(),
            planType: planType,
            price: price,
            createdAt: new Date().toISOString(),
            expiresAt: this.calculateExpirationDate(planType),
            isUsed: false,
            userId: window.userManager?.currentUser?.id || 'anonymous',
            duration: this.getPlanDuration(planType)
        };

        this.vouchers.push(voucher);
        this.saveVouchers();
        
        console.log(`✅ Voucher généré: ${voucher.code}`);
        return voucher;
    }

    // Générer un code de voucher unique
    generateVoucherCode() {
        const prefix = 'WBB';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    // Calculer la date d'expiration
    calculateExpirationDate(planType) {
        const now = new Date();
        const expiration = new Date(now);
        
        switch (planType) {
            case 'basic':
                expiration.setHours(now.getHours() + 1);
                break;
            case 'premium':
                expiration.setHours(now.getHours() + 6);
                break;
            case 'daily':
                expiration.setHours(now.getHours() + 24);
                break;
            default:
                expiration.setHours(now.getHours() + 1);
        }
        
        return expiration.toISOString();
    }

    // Obtenir la durée du plan
    getPlanDuration(planType) {
        const durations = {
            'basic': 1,
            'premium': 6,
            'daily': 24
        };
        return durations[planType] || 1;
    }

    // Valider un voucher
    validateVoucher(code) {
        console.log(`🔍 Validation du voucher: ${code}`);
        
        if (!code || typeof code !== 'string') {
            console.log('❌ Code invalide');
            return false;
        }

        const voucher = this.vouchers.find(v => v.code === code.toUpperCase());
        
        if (!voucher) {
            console.log('❌ Voucher non trouvé');
            return false;
        }

        if (voucher.isUsed) {
            console.log('❌ Voucher déjà utilisé');
            return false;
        }

        if (new Date() > new Date(voucher.expiresAt)) {
            console.log('❌ Voucher expiré');
            return false;
        }

        console.log('✅ Voucher valide');
        return true;
    }

    // Utiliser un voucher
    useVoucher(code) {
        const voucher = this.vouchers.find(v => v.code === code.toUpperCase());
        
        if (!voucher) {
            return false;
        }

        if (this.validateVoucher(code)) {
            voucher.isUsed = true;
            voucher.usedAt = new Date().toISOString();
            
            // Ajouter aux vouchers utilisés
            this.usedVouchers.push({
                ...voucher,
                connectionStarted: new Date().toISOString()
            });
            
            this.saveVouchers();
            this.saveUsedVouchers();
            
            console.log(`✅ Voucher utilisé: ${code}`);
            return true;
        }
        
        return false;
    }

    // Obtenir tous les vouchers valides
    getValidVouchers() {
        return this.vouchers.filter(v => !v.isUsed && new Date() < new Date(v.expiresAt));
    }

    // Obtenir les vouchers expirés
    getExpiredVouchers() {
        return this.vouchers.filter(v => new Date() > new Date(v.expiresAt));
    }

    // Obtenir les vouchers utilisés
    getUsedVouchers() {
        return this.usedVouchers;
    }

    // Nettoyer les vouchers expirés
    cleanExpiredVouchers() {
        const now = new Date();
        const originalCount = this.vouchers.length;
        
        this.vouchers = this.vouchers.filter(v => {
            const isExpired = new Date(v.expiresAt) < now;
            if (isExpired && !v.isUsed) {
                // Déplacer vers les expirés pour les statistiques
                return false;
            }
            return true;
        });
        
        const cleanedCount = originalCount - this.vouchers.length;
        if (cleanedCount > 0) {
            console.log(`🧹 ${cleanedCount} vouchers expirés supprimés`);
            this.saveVouchers();
        }
    }

    // Obtenir les statistiques
    getStatistics() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return {
            total: this.vouchers.length,
            valid: this.getValidVouchers().length,
            used: this.usedVouchers.length,
            expired: this.getExpiredVouchers().length,
            todayGenerated: this.vouchers.filter(v => 
                new Date(v.createdAt) >= today
            ).length,
            todayUsed: this.usedVouchers.filter(v => 
                new Date(v.usedAt) >= today
            ).length,
            revenue: this.usedVouchers.reduce((total, v) => total + v.price, 0)
        };
    }

    // Sauvegarder les vouchers
    saveVouchers() {
        localStorage.setItem('vouchers', JSON.stringify(this.vouchers));
    }

    // Sauvegarder les vouchers utilisés
    saveUsedVouchers() {
        localStorage.setItem('usedVouchers', JSON.stringify(this.usedVouchers));
    }

    // Réinitialiser tous les vouchers (admin)
    resetAllVouchers() {
        this.vouchers = [];
        this.usedVouchers = [];
        this.saveVouchers();
        this.saveUsedVouchers();
        console.log('🔄 Tous les vouchers ont été réinitialisés');
    }

    // Générer des vouchers de test
    generateTestVouchers() {
        const testVouchers = [
            { planType: 'basic', price: 500 },
            { planType: 'premium', price: 1500 },
            { planType: 'daily', price: 3000 }
        ];

        const generated = [];
        testVouchers.forEach(test => {
            const voucher = this.generateVoucher(test.planType, test.price);
            generated.push(voucher);
        });

        console.log(`🧪 ${generated.length} vouchers de test générés`);
        return generated;
    }

    // Rechercher des vouchers
    searchVouchers(query) {
        const searchTerm = query.toLowerCase();
        return this.vouchers.filter(v => 
            v.code.toLowerCase().includes(searchTerm) ||
            v.planType.toLowerCase().includes(searchTerm) ||
            v.userId.toLowerCase().includes(searchTerm)
        );
    }
}

// Initialisation globale
if (typeof window !== 'undefined') {
    window.VoucherManager = VoucherManager;
    
    // Créer une instance globale
    if (!window.voucherManager) {
        window.voucherManager = new VoucherManager();
    }
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoucherManager;
}
