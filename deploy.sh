#!/bin/bash

# Script de déploiement automatique pour WiFi Bisou Bisou
# Auteur: WiFi Bisou Bisou Team
# Date: 2025-07-15

echo "🚀 Démarrage du déploiement WiFi Bisou Bisou..."

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

# Étape 1: Vérifier l'état du repository
log_info "Vérification de l'état du repository..."
git status

# Étape 2: Ajouter tous les fichiers
log_info "Ajout des fichiers..."
git add .

# Étape 3: Créer un commit avec message automatique
COMMIT_MESSAGE="🚀 Déploiement WiFi Bisou Bisou - $(date '+%Y-%m-%d %H:%M:%S')"
log_info "Création du commit: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Étape 4: Pousser vers GitHub
log_info "Poussée vers GitHub..."
if git push origin main; then
    log_success "Code poussé avec succès vers GitHub!"
else
    log_error "Erreur lors de la poussée vers GitHub."
    exit 1
fi

# Étape 5: Informations de déploiement
log_info "Création du fichier d'informations de déploiement..."
cat > deployment-info.json << EOF
{
    "deploymentDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "version": "1.0.0",
    "platform": "GitHub Pages",
    "status": "deployed",
    "commit": "$(git rev-parse HEAD)",
    "branch": "$(git rev-parse --abbrev-ref HEAD)",
    "files": [
        "index.html",
        "admin.html",
        "router-management.html",
        "support.html",
        "script.js",
        "styles.css",
        "config.js",
        "demo.js"
    ]
}
EOF

# Étape 6: Instructions pour GitHub Pages
log_info "Instructions pour activer GitHub Pages:"
echo "1. Allez sur https://github.com/mireb1/WIFIBISOUBISOU"
echo "2. Cliquez sur Settings"
echo "3. Scrollez jusqu'à la section 'Pages'"
echo "4. Sélectionnez 'Deploy from a branch'"
echo "5. Choisissez 'main' comme branche"
echo "6. Cliquez sur 'Save'"

# Étape 7: URLs utiles
log_success "Déploiement terminé!"
echo ""
echo "📍 URLs importantes:"
echo "• Repository: https://github.com/mireb1/WIFIBISOUBISOU"
echo "• GitHub Pages: https://mireb1.github.io/WIFIBISOUBISOU/"
echo "• Issues: https://github.com/mireb1/WIFIBISOUBISOU/issues"
echo ""

log_info "Le site sera disponible sous peu à l'adresse:"
echo "🌐 https://mireb1.github.io/WIFIBISOUBISOU/"

# Étape 8: Test automatique (optionnel)
if command -v curl &> /dev/null; then
    log_info "Test de connectivité GitHub..."
    if curl -s https://api.github.com/repos/mireb1/WIFIBISOUBISOU > /dev/null; then
        log_success "Repository accessible sur GitHub!"
    else
        log_warning "Impossible de tester la connectivité GitHub."
    fi
fi

log_success "🎉 Déploiement terminé avec succès!"
echo "🇨🇩 Merci d'utiliser WiFi Bisou Bisou - Adaptation RDC"
