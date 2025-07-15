#!/bin/bash

# Script de mise à jour URL et déploiement direct - WiFi Bisou Bisou
# Auteur: WiFi Bisou Bisou Team
# Date: 2025-07-15

echo "🌐 Mise à jour URL et déploiement direct - WiFi Bisou Bisou"
echo "========================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages colorés
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    log_error "Git n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si nous sommes dans un repository Git
if [ ! -d ".git" ]; then
    log_error "Ce dossier n'est pas un repository Git."
    exit 1
fi

# Fonction pour mettre à jour l'URL de base
update_base_url() {
    local new_url="$1"
    
    log_info "Mise à jour de l'URL de base vers: $new_url"
    
    # Mise à jour de url-config.js
    if [ -f "url-config.js" ]; then
        # Mise à jour de l'URL de production
        sed -i "s|baseUrl: 'https://[^']*'|baseUrl: 'https://$new_url'|g" url-config.js
        sed -i "s|apiUrl: 'https://api.[^']*'|apiUrl: 'https://api.$new_url'|g" url-config.js
        sed -i "s|websocketUrl: 'wss://[^']*'|websocketUrl: 'wss://$new_url/ws'|g" url-config.js
        sed -i "s|assetsUrl: 'https://cdn.[^']*'|assetsUrl: 'https://cdn.$new_url/assets'|g" url-config.js
        log_success "url-config.js mis à jour"
    fi
    
    # Mise à jour de environment-config.js
    if [ -f "environment-config.js" ]; then
        sed -i "s|apiUrl: 'https://api.[^']*'|apiUrl: 'https://api.$new_url'|g" environment-config.js
        log_success "environment-config.js mis à jour"
    fi
    
    # Mise à jour de config.js
    if [ -f "config.js" ]; then
        sed -i "s|baseUrl: 'https://[^']*'|baseUrl: 'https://$new_url'|g" config.js
        log_success "config.js mis à jour"
    fi
    
    # Mise à jour de manifest.json
    if [ -f "manifest.json" ]; then
        sed -i "s|\"start_url\": \"https://[^\"]*\"|\"start_url\": \"https://$new_url\"|g" manifest.json
        log_success "manifest.json mis à jour"
    fi
    
    # Mise à jour du README.md
    if [ -f "README.md" ]; then
        sed -i "s|https://[a-zA-Z0-9.-]*\.github\.io/[^)]*|https://$new_url|g" README.md
        log_success "README.md mis à jour"
    fi
}

# Fonction pour déployer automatiquement
deploy_to_github() {
    log_info "Déploiement vers GitHub Pages..."
    
    # Sauvegarder la branche actuelle
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Vérifier si on est sur gh-pages
    if [ "$CURRENT_BRANCH" != "gh-pages" ]; then
        log_info "Passage à la branche gh-pages..."
        git checkout gh-pages 2>/dev/null || git checkout -b gh-pages
    fi
    
    # Ajouter tous les fichiers
    git add .
    
    # Commiter les changements
    COMMIT_MESSAGE="🚀 Mise à jour automatique URL - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MESSAGE"
    
    # Pousser vers GitHub
    git push origin gh-pages
    
    log_success "Déploiement terminé avec succès !"
}

# Menu principal
echo "Choisissez votre option de mise à jour :"
echo "1. 🌐 Utiliser l'URL GitHub Pages (mireb1.github.io/WIFIBISOUBISOU)"
echo "2. 🔗 Configurer une URL personnalisée"
echo "3. 🚀 Déployer sans changer l'URL"
echo "4. 📋 Voir l'URL actuelle"
echo "5. 🔄 Mise à jour complète (URL + déploiement)"

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        log_info "Configuration pour GitHub Pages..."
        update_base_url "mireb1.github.io/WIFIBISOUBISOU"
        deploy_to_github
        echo ""
        log_success "🎉 Site déployé avec succès !"
        echo "🌐 URL d'accès: https://mireb1.github.io/WIFIBISOUBISOU/"
        ;;
    2)
        read -p "Entrez votre URL personnalisée (sans https://): " custom_url
        if [ -z "$custom_url" ]; then
            log_error "URL non fournie"
            exit 1
        fi
        update_base_url "$custom_url"
        deploy_to_github
        echo ""
        log_success "🎉 Site déployé avec URL personnalisée !"
        echo "🌐 URL d'accès: https://$custom_url/"
        ;;
    3)
        log_info "Déploiement sans modification d'URL..."
        deploy_to_github
        echo ""
        log_success "🎉 Site déployé avec succès !"
        ;;
    4)
        log_info "URL actuelle configurée :"
        if [ -f "url-config.js" ]; then
            grep -o "baseUrl: '[^']*'" url-config.js | head -1
        fi
        echo ""
        log_info "URL GitHub Pages disponible :"
        echo "https://mireb1.github.io/WIFIBISOUBISOU/"
        ;;
    5)
        log_info "Mise à jour complète..."
        read -p "Voulez-vous utiliser l'URL GitHub Pages ? (y/n): " use_github
        if [ "$use_github" = "y" ] || [ "$use_github" = "Y" ]; then
            update_base_url "mireb1.github.io/WIFIBISOUBISOU"
        else
            read -p "Entrez votre URL personnalisée (sans https://): " custom_url
            update_base_url "$custom_url"
        fi
        deploy_to_github
        echo ""
        log_success "🎉 Mise à jour complète terminée !"
        ;;
    *)
        log_error "Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "📋 Informations utiles :"
echo "• Repository: https://github.com/mireb1/WIFIBISOUBISOU"
echo "• Branche de déploiement: gh-pages"
echo "• Configuration GitHub Pages: Settings > Pages"
echo ""
echo "🔧 Prochaines étapes recommandées :"
echo "1. Vérifier que GitHub Pages est activé dans les paramètres"
echo "2. Configurer un domaine personnalisé si nécessaire"
echo "3. Tester l'application sur l'URL configurée"
echo ""
log_success "Script terminé avec succès ! 🎉"
