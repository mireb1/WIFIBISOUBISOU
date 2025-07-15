// Gestionnaire de notifications pour WiFi Bisou Bisou
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // Créer le conteneur de notifications s'il n'existe pas
        this.container = document.getElementById('notifications-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notifications-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 350px;
            `;
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        // Suppression automatique
        setTimeout(() => {
            this.remove(notification);
        }, duration);

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            position: relative;
            max-width: 100%;
            word-wrap: break-word;
        `;

        // Couleurs selon le type
        const colors = {
            success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
            error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
            warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
            info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
        };

        const color = colors[type] || colors.info;
        notification.style.backgroundColor = color.bg;
        notification.style.borderLeft = `4px solid ${color.border}`;
        notification.style.color = color.text;

        // Icône selon le type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">${icons[type] || icons.info}</span>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.closest('.notification').remove()" style="
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: ${color.text};
                    opacity: 0.7;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
        `;

        // Fermeture au clic
        notification.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                this.remove(notification);
            }
        });

        return notification;
    }

    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                
                // Supprimer de la liste
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}

// Initialisation globale
if (typeof window !== 'undefined') {
    window.NotificationManager = NotificationManager;
    
    // Créer une instance globale
    window.notificationManager = new NotificationManager();
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
