#!/bin/bash

# Script de mise à jour URL pour WiFi Bisou Bisou

echo "🌐 Mise à jour de l'URL pour WiFi Bisou Bisou"
echo "============================================="

# Fonction pour mettre à jour l'URL dans les fichiers
update_url() {
    local old_url="$1"
    local new_url="$2"
    
    echo "📝 Remplacement de $old_url par $new_url"
    
    # Fichiers à mettre à jour
    files=(
        "url-config.js"
        "environment-config.js"
        "config.js"
        "README.md"
        "manifest.json"
        "DEPLOYMENT.md"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            sed -i "s|$old_url|$new_url|g" "$file"
            echo "✅ $file mis à jour"
        fi
    done
}

# Options prédéfinies
echo "Choisissez votre configuration d'URL :"
echo "1. wifibisoubisou.com"
echo "2. wifi-bisou-bisou.cd"
echo "3. monwifi.cd"
echo "4. URL personnalisée"
echo "5. Garder localhost (développement)"

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        NEW_URL="wifibisoubisou.com"
        API_URL="api.wifibisoubisou.com"
        ;;
    2)
        NEW_URL="wifi-bisou-bisou.cd"
        API_URL="api.wifi-bisou-bisou.cd"
        ;;
    3)
        NEW_URL="monwifi.cd"
        API_URL="api.monwifi.cd"
        ;;
    4)
        read -p "Entrez votre URL personnalisée (sans https://): " NEW_URL
        API_URL="api.$NEW_URL"
        ;;
    5)
        NEW_URL="localhost:8000"
        API_URL="localhost:3000/api"
        echo "🏠 Configuration de développement conservée"
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

if [ "$choice" != "5" ]; then
    # Mettre à jour la configuration
    echo "🔄 Mise à jour de la configuration..."
    
    # Mettre à jour url-config.js
    if [ -f "url-config.js" ]; then
        cat > url-config.js << EOF
// Configuration d'URL pour WiFi Bisou Bisou - Mise à jour automatique

class URLConfig {
    constructor() {
        this.environments = {
            development: {
                baseUrl: 'http://localhost:8000',
                apiUrl: 'http://localhost:3000/api',
                paymentUrl: 'https://sandbox.flexpaie.com',
                websocketUrl: 'ws://localhost:8001',
                assetsUrl: 'http://localhost:8000/assets'
            },
            
            production: {
                baseUrl: 'https://$NEW_URL',
                apiUrl: 'https://$API_URL',
                paymentUrl: 'https://payment.flexpaie.com',
                websocketUrl: 'wss://$NEW_URL/ws',
                assetsUrl: 'https://cdn.$NEW_URL/assets'
            }
        };
        
        this.currentEnvironment = this.detectEnvironment();
    }
    
    detectEnvironment() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1' || port === '8000') {
            return 'development';
        }
        return 'production';
    }
    
    get current() {
        return this.environments[this.currentEnvironment];
    }
    
    getUrl(path = '') {
        const baseUrl = this.current.baseUrl;
        return path ? \`\${baseUrl}\${path.startsWith('/') ? '' : '/'}\${path}\` : baseUrl;
    }
    
    getApiUrl(endpoint = '') {
        const apiUrl = this.current.apiUrl;
        return endpoint ? \`\${apiUrl}\${endpoint.startsWith('/') ? '' : '/'}\${endpoint}\` : apiUrl;
    }
    
    getPaymentUrl(params = '') {
        const paymentUrl = this.current.paymentUrl;
        return params ? \`\${paymentUrl}\${params.startsWith('/') ? '' : '/'}\${params}\` : paymentUrl;
    }
    
    generateVoucherUrl(voucherCode) {
        return \`\${this.getUrl()}/voucher/\${voucherCode}\`;
    }
    
    generateValidationUrl(voucherCode) {
        return \`\${this.getUrl()}/validate?code=\${voucherCode}\`;
    }
    
    getMetaData() {
        return {
            title: 'WiFi Bisou Bisou - Accès WiFi Instantané RDC',
            description: 'Achetez vos tickets WiFi et obtenez vos vouchers immédiatement au Congo RDC',
            image: \`\${this.current.assetsUrl}/og-image.jpg\`,
            url: this.current.baseUrl,
            siteName: 'WiFi Bisou Bisou',
            locale: 'fr_CD',
            type: 'website'
        };
    }
}

const urlConfig = new URLConfig();
window.URLConfig = urlConfig;
window.getUrl = (path) => urlConfig.getUrl(path);
window.getApiUrl = (endpoint) => urlConfig.getApiUrl(endpoint);
window.getPaymentUrl = (params) => urlConfig.getPaymentUrl(params);

console.log('🌐 Configuration URL mise à jour');
console.log(\`📍 Environnement: \${urlConfig.currentEnvironment}\`);
console.log(\`🔗 URL de base: \${urlConfig.current.baseUrl}\`);
console.log(\`🔌 API URL: \${urlConfig.current.apiUrl}\`);

document.addEventListener('DOMContentLoaded', function() {
    const metaData = urlConfig.getMetaData();
    document.title = metaData.title;
    
    const updateOrCreateMeta = (property, content) => {
        let meta = document.querySelector(\`meta[property="\${property}"]\`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };
    
    updateOrCreateMeta('og:title', metaData.title);
    updateOrCreateMeta('og:description', metaData.description);
    updateOrCreateMeta('og:image', metaData.image);
    updateOrCreateMeta('og:url', metaData.url);
    updateOrCreateMeta('og:site_name', metaData.siteName);
    updateOrCreateMeta('og:locale', metaData.locale);
    updateOrCreateMeta('og:type', metaData.type);
});

export default urlConfig;
EOF
        echo "✅ url-config.js mis à jour"
    fi
    
    # Mettre à jour le manifest.json
    if [ -f "manifest.json" ]; then
        jq --arg url "https://$NEW_URL" '.start_url = $url | .scope = $url' manifest.json > manifest.json.tmp && mv manifest.json.tmp manifest.json
        echo "✅ manifest.json mis à jour"
    fi
fi

echo ""
echo "🎉 Configuration terminée !"
echo "📍 Votre nouvelle URL : https://$NEW_URL"
echo "🔌 API URL : https://$API_URL"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Déployez votre application sur un serveur web"
echo "2. Configurez votre nom de domaine"
echo "3. Installez un certificat SSL"
echo "4. Configurez votre API backend"
echo ""
echo "💡 Pour tester en local, utilisez : python3 -m http.server 8000"
