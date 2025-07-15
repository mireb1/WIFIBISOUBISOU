// Gestionnaire des Transactions - WiFi Bisou Bisou
class TransactionManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.initializeDefaultTransactions();
    }

    // Initialiser les transactions par défaut
    initializeDefaultTransactions() {
        if (this.transactions.length === 0) {
            this.transactions = [
                {
                    id: 'TXN001',
                    userId: 'USER_001',
                    userName: 'Jean Mukendi',
                    type: 'purchase',
                    plan: 'premium',
                    amount: 1500,
                    currency: 'FC',
                    status: 'completed',
                    paymentMethod: 'flexpaie',
                    transactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    location: 'Centre-Ville',
                    routerId: 'RTR001',
                    voucherCode: 'WIFI-2025-ABC123',
                    fee: 75, // 5% de frais
                    netAmount: 1425,
                    reference: 'FP' + Date.now().toString().slice(-8)
                },
                {
                    id: 'TXN002',
                    userId: 'USER_002',
                    userName: 'Marie Kabila',
                    type: 'purchase',
                    plan: 'daily',
                    amount: 3000,
                    currency: 'FC',
                    status: 'completed',
                    paymentMethod: 'flexpaie',
                    transactionDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    location: 'Université',
                    routerId: 'RTR002',
                    voucherCode: 'WIFI-2025-XYZ456',
                    fee: 150,
                    netAmount: 2850,
                    reference: 'FP' + (Date.now() - 5000).toString().slice(-8)
                },
                {
                    id: 'TXN003',
                    userId: 'USER_003',
                    userName: 'Paul Tshisekedi',
                    type: 'refund',
                    plan: 'basic',
                    amount: 500,
                    currency: 'FC',
                    status: 'completed',
                    paymentMethod: 'flexpaie',
                    transactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    location: 'Marché',
                    routerId: 'RTR003',
                    voucherCode: 'WIFI-2025-DEF789',
                    fee: 0,
                    netAmount: 500,
                    reference: 'RF' + (Date.now() - 24000).toString().slice(-8),
                    refundReason: 'Problème technique'
                },
                {
                    id: 'TXN004',
                    userId: 'USER_004',
                    userName: 'Grace Mbuyi',
                    type: 'purchase',
                    plan: 'weekly',
                    amount: 15000,
                    currency: 'FC',
                    status: 'pending',
                    paymentMethod: 'flexpaie',
                    transactionDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    location: 'Hôtel Palace',
                    routerId: 'RTR004',
                    voucherCode: 'WIFI-2025-GHI012',
                    fee: 750,
                    netAmount: 14250,
                    reference: 'FP' + (Date.now() - 30000).toString().slice(-8)
                },
                {
                    id: 'TXN005',
                    userId: 'USER_005',
                    userName: 'Antoine Mulamba',
                    type: 'purchase',
                    plan: 'monthly',
                    amount: 45000,
                    currency: 'FC',
                    status: 'completed',
                    paymentMethod: 'flexpaie',
                    transactionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    location: 'Entreprise Gombe',
                    routerId: 'RTR001',
                    voucherCode: 'WIFI-2025-JKL345',
                    fee: 2250,
                    netAmount: 42750,
                    reference: 'FP' + (Date.now() - 15000).toString().slice(-8)
                },
                {
                    id: 'TXN006',
                    userId: 'USER_002',
                    userName: 'Marie Kabila',
                    type: 'purchase',
                    plan: 'premium',
                    amount: 1500,
                    currency: 'FC',
                    status: 'failed',
                    paymentMethod: 'flexpaie',
                    transactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    location: 'Université',
                    routerId: 'RTR002',
                    voucherCode: null,
                    fee: 0,
                    netAmount: 0,
                    reference: 'FP' + (Date.now() - 3000).toString().slice(-8),
                    failureReason: 'Solde insuffisant'
                }
            ];
            this.saveTransactions();
        }
    }

    // Sauvegarder les transactions
    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    // Charger les transactions
    loadTransactions() {
        const stored = localStorage.getItem('transactions');
        return stored ? JSON.parse(stored) : [];
    }

    // Obtenir toutes les transactions
    getAllTransactions() {
        return this.transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
    }

    // Obtenir une transaction par ID
    getTransactionById(id) {
        return this.transactions.find(txn => txn.id === id);
    }

    // Obtenir les statistiques des transactions
    getTransactionStats() {
        const completed = this.transactions.filter(txn => txn.status === 'completed').length;
        const pending = this.transactions.filter(txn => txn.status === 'pending').length;
        const failed = this.transactions.filter(txn => txn.status === 'failed').length;
        const refunds = this.transactions.filter(txn => txn.type === 'refund').length;

        const totalRevenue = this.transactions
            .filter(txn => txn.status === 'completed' && txn.type === 'purchase')
            .reduce((sum, txn) => sum + txn.amount, 0);

        const totalFees = this.transactions
            .filter(txn => txn.status === 'completed')
            .reduce((sum, txn) => sum + txn.fee, 0);

        const todayRevenue = this.transactions
            .filter(txn => {
                const txnDate = new Date(txn.transactionDate);
                const today = new Date();
                return txnDate.toDateString() === today.toDateString() && 
                       txn.status === 'completed' && txn.type === 'purchase';
            })
            .reduce((sum, txn) => sum + txn.amount, 0);

        const monthlyRevenue = this.transactions
            .filter(txn => {
                const txnDate = new Date(txn.transactionDate);
                const now = new Date();
                return txnDate.getMonth() === now.getMonth() && 
                       txnDate.getFullYear() === now.getFullYear() &&
                       txn.status === 'completed' && txn.type === 'purchase';
            })
            .reduce((sum, txn) => sum + txn.amount, 0);

        return {
            total: this.transactions.length,
            completed,
            pending,
            failed,
            refunds,
            totalRevenue,
            totalFees,
            todayRevenue,
            monthlyRevenue
        };
    }

    // Créer une nouvelle transaction
    createTransaction(transactionData) {
        const transaction = {
            id: `TXN${Date.now()}`,
            userId: transactionData.userId,
            userName: transactionData.userName,
            type: transactionData.type || 'purchase',
            plan: transactionData.plan,
            amount: transactionData.amount,
            currency: 'FC',
            status: 'pending',
            paymentMethod: transactionData.paymentMethod || 'flexpaie',
            transactionDate: new Date().toISOString(),
            location: transactionData.location || 'Non spécifié',
            routerId: transactionData.routerId,
            voucherCode: transactionData.voucherCode,
            fee: Math.round(transactionData.amount * 0.05), // 5% de frais
            netAmount: Math.round(transactionData.amount * 0.95),
            reference: 'FP' + Date.now().toString().slice(-8)
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        return transaction;
    }

    // Mettre à jour le statut d'une transaction
    updateTransactionStatus(transactionId, status, additionalData = {}) {
        const transaction = this.getTransactionById(transactionId);
        if (transaction) {
            transaction.status = status;
            
            if (status === 'failed' && additionalData.failureReason) {
                transaction.failureReason = additionalData.failureReason;
                transaction.fee = 0;
                transaction.netAmount = 0;
            }
            
            if (status === 'completed' && transaction.type === 'purchase') {
                // Mettre à jour les statistiques utilisateur
                const user = window.userManager?.getUserById(transaction.userId);
                if (user) {
                    user.totalSpent += transaction.amount;
                    window.userManager.saveUsers();
                }
            }
            
            this.saveTransactions();
        }
    }

    // Créer un remboursement
    createRefund(originalTransactionId, refundReason) {
        const originalTransaction = this.getTransactionById(originalTransactionId);
        if (!originalTransaction || originalTransaction.status !== 'completed') {
            return null;
        }

        const refund = {
            id: `TXN${Date.now()}`,
            userId: originalTransaction.userId,
            userName: originalTransaction.userName,
            type: 'refund',
            plan: originalTransaction.plan,
            amount: originalTransaction.amount,
            currency: 'FC',
            status: 'completed',
            paymentMethod: originalTransaction.paymentMethod,
            transactionDate: new Date().toISOString(),
            location: originalTransaction.location,
            routerId: originalTransaction.routerId,
            voucherCode: originalTransaction.voucherCode,
            fee: 0,
            netAmount: originalTransaction.amount,
            reference: 'RF' + Date.now().toString().slice(-8),
            refundReason,
            originalTransactionId
        };

        this.transactions.push(refund);
        this.saveTransactions();
        return refund;
    }

    // Obtenir les transactions par utilisateur
    getTransactionsByUser(userId) {
        return this.transactions.filter(txn => txn.userId === userId)
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
    }

    // Obtenir les transactions par plan
    getTransactionsByPlan() {
        const plans = {};
        this.transactions.forEach(txn => {
            if (txn.status === 'completed' && txn.type === 'purchase') {
                if (!plans[txn.plan]) {
                    plans[txn.plan] = { count: 0, revenue: 0 };
                }
                plans[txn.plan].count++;
                plans[txn.plan].revenue += txn.amount;
            }
        });
        return plans;
    }

    // Obtenir les transactions récentes
    getRecentTransactions(limit = 10) {
        return this.transactions
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
            .slice(0, limit);
    }

    // Obtenir les transactions par période
    getTransactionsByPeriod(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.transactions.filter(txn => {
            const txnDate = new Date(txn.transactionDate);
            return txnDate >= start && txnDate <= end;
        });
    }

    // Simuler de nouvelles transactions
    simulateTransactions() {
        if (Math.random() < 0.2) { // 20% de chance
            const users = window.userManager?.getAllUsers() || [];
            const activeUsers = users.filter(u => u.status === 'active');
            
            if (activeUsers.length > 0) {
                const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
                const plans = ['basic', 'premium', 'daily'];
                const plan = plans[Math.floor(Math.random() * plans.length)];
                const amounts = { basic: 500, premium: 1500, daily: 3000 };
                const locations = ['Centre-Ville', 'Université', 'Marché', 'Hôtel Palace'];
                
                const transaction = this.createTransaction({
                    userId: user.id,
                    userName: user.name,
                    plan: plan,
                    amount: amounts[plan],
                    location: locations[Math.floor(Math.random() * locations.length)],
                    routerId: `RTR00${Math.floor(Math.random() * 4) + 1}`,
                    voucherCode: `WIFI-2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
                });

                // Simuler le succès ou l'échec
                setTimeout(() => {
                    const success = Math.random() > 0.1; // 90% de succès
                    if (success) {
                        this.updateTransactionStatus(transaction.id, 'completed');
                    } else {
                        this.updateTransactionStatus(transaction.id, 'failed', {
                            failureReason: 'Problème de connexion'
                        });
                    }
                }, 2000);
            }
        }
    }

    // Obtenir les revenus par jour
    getDailyRevenue(days = 7) {
        const revenue = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dayRevenue = this.transactions
                .filter(txn => {
                    const txnDate = new Date(txn.transactionDate);
                    return txnDate.toDateString() === date.toDateString() && 
                           txn.status === 'completed' && txn.type === 'purchase';
                })
                .reduce((sum, txn) => sum + txn.amount, 0);
            
            revenue.push({
                date: date.toISOString().split('T')[0],
                revenue: dayRevenue
            });
        }
        return revenue;
    }
}

// Instance globale
window.transactionManager = new TransactionManager();
