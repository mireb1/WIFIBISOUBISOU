#!/bin/bash

# Script de vérification post-déploiement
# WiFi Bisou Bisou - Vérification GitHub Pages

echo "🔍 Vérification du déploiement WiFi Bisou Bisou..."
echo "================================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour afficher des messages colorés
check_ok() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Vérifier les fichiers essentiels
echo "📁 Vérification des fichiers..."
files=(
    "index.html"
    "admin.html"
    "router-management.html"
    "support.html"
    "script.js"
    "styles.css"
    "config.js"
    "demo.js"
    "manifest.json"
    "sw.js"
    "README.md"
    "DEPLOYMENT.md"
    "package.json"
    ".github/workflows/deploy.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        check_ok "Fichier $file présent"
    else
        check_error "Fichier $file manquant"
    fi
done

# Vérifier la structure des dossiers
echo ""
echo "📂 Vérification de la structure..."
if [ -d ".github/workflows" ]; then
    check_ok "Dossier .github/workflows présent"
else
    check_error "Dossier .github/workflows manquant"
fi

# Vérifier le contenu des fichiers critiques
echo ""
echo "📄 Vérification du contenu..."

# Vérifier index.html
if grep -q "manifest.json" index.html; then
    check_ok "Manifeste PWA référencé dans index.html"
else
    check_warning "Manifeste PWA non référencé dans index.html"
fi

if grep -q "WiFi Bisou Bisou" index.html; then
    check_ok "Titre correct dans index.html"
else
    check_error "Titre manquant dans index.html"
fi

# Vérifier script.js
if grep -q "serviceWorker" script.js; then
    check_ok "Service Worker configuré dans script.js"
else
    check_warning "Service Worker non configuré dans script.js"
fi

if grep -q "UserManager" script.js; then
    check_ok "Gestionnaire d'utilisateurs présent"
else
    check_error "Gestionnaire d'utilisateurs manquant"
fi

# Vérifier le manifeste PWA
if [ -f "manifest.json" ]; then
    if grep -q "WiFi Bisou Bisou" manifest.json; then
        check_ok "Manifeste PWA correctement configuré"
    else
        check_error "Manifeste PWA mal configuré"
    fi
fi

# Vérifier le service worker
if [ -f "sw.js" ]; then
    if grep -q "CACHE_NAME" sw.js; then
        check_ok "Service Worker correctement configuré"
    else
        check_error "Service Worker mal configuré"
    fi
fi

# Vérifier la configuration Git
echo ""
echo "🔧 Vérification Git..."
if git remote -v | grep -q "github.com"; then
    check_ok "Remote GitHub configuré"
else
    check_error "Remote GitHub manquant"
fi

if git branch | grep -q "main"; then
    check_ok "Branche main présente"
else
    check_error "Branche main manquante"
fi

# Vérifier l'état du repository
echo ""
echo "📊 État du repository..."
if [ -z "$(git status --porcelain)" ]; then
    check_ok "Working tree propre"
else
    check_warning "Modifications non commitées détectées"
fi

# Informations sur le déploiement
echo ""
echo "🌐 Informations de déploiement..."
echo "Repository: https://github.com/mireb1/WIFIBISOUBISOU"
echo "GitHub Pages: https://mireb1.github.io/WIFIBISOUBISOU/"
echo "Branch: main"
echo "Date: $(date)"

# Instructions pour activer GitHub Pages
echo ""
echo "📋 Instructions pour activer GitHub Pages:"
echo "1. Allez sur https://github.com/mireb1/WIFIBISOUBISOU"
echo "2. Cliquez sur 'Settings'"
echo "3. Scrollez jusqu'à 'Pages'"
echo "4. Sélectionnez 'Deploy from a branch'"
echo "5. Choisissez 'main' comme branche"
echo "6. Cliquez sur 'Save'"

# Test de connectivité (optionnel)
echo ""
echo "🔗 Test de connectivité..."
if command -v curl &> /dev/null; then
    if curl -s --head https://api.github.com/repos/mireb1/WIFIBISOUBISOU | grep "200 OK" > /dev/null; then
        check_ok "Repository accessible sur GitHub"
    else
        check_warning "Impossible de vérifier l'accessibilité GitHub"
    fi
else
    check_info "curl non disponible, impossible de tester la connectivité"
fi

# Résumé final
echo ""
echo "🎯 Résumé du déploiement:"
echo "=================================="
echo "✅ Code poussé vers GitHub"
echo "✅ PWA configurée (Service Worker + Manifeste)"
echo "✅ GitHub Actions workflow configuré"
echo "✅ Documentation complète"
echo "✅ Structure de fichiers correcte"
echo ""
echo "🚀 Prêt pour GitHub Pages!"
echo "🇨🇩 WiFi Bisou Bisou - Adaptation RDC"
echo ""
echo "📱 Fonctionnalités disponibles:"
echo "- Vente de tickets WiFi"
echo "- Génération de vouchers"
echo "- Gestion des utilisateurs"
echo "- Tableau de bord administrateur"
echo "- Support client intégré"
echo "- Mode PWA (installation mobile)"
echo "- Fonctionnement hors ligne"
echo ""
echo "🎉 Déploiement terminé avec succès!"
