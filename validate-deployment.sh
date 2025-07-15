#!/bin/bash

# Script de validation post-déploiement - WiFi Bisou Bisou

echo "🔍 Validation du déploiement WiFi Bisou Bisou"
echo "============================================"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

URL_BASE="https://mireb1.github.io/WIFIBISOUBISOU"

echo -e "${BLUE}[INFO]${NC} Vérification de l'URL de base..."

# Fonction pour vérifier une URL
check_url() {
    local url="$1"
    local description="$2"
    
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        echo -e "${GREEN}✅ $description${NC} - $url"
        return 0
    else
        echo -e "${RED}❌ $description${NC} - $url"
        return 1
    fi
}

# Vérifications principales
echo ""
echo "🌐 Vérification des URLs principales :"
check_url "$URL_BASE/" "Page d'accueil"
check_url "$URL_BASE/admin.html" "Tableau de bord admin"
check_url "$URL_BASE/router-management.html" "Gestion des routeurs"
check_url "$URL_BASE/support.html" "Page de support"

echo ""
echo "📋 Vérification des ressources :"
check_url "$URL_BASE/styles.css" "Feuille de style"
check_url "$URL_BASE/script.js" "Script principal"
check_url "$URL_BASE/config.js" "Configuration"
check_url "$URL_BASE/manifest.json" "Manifeste PWA"

echo ""
echo "🔧 Informations de déploiement :"
echo "• URL de base : $URL_BASE"
echo "• Branche : gh-pages"
echo "• Repository : https://github.com/mireb1/WIFIBISOUBISOU"
echo "• Statut GitHub Pages : https://github.com/mireb1/WIFIBISOUBISOU/settings/pages"

echo ""
echo "📱 Tests recommandés :"
echo "1. Ouvrir $URL_BASE dans votre navigateur"
echo "2. Tester l'achat d'un ticket WiFi"
echo "3. Vérifier le tableau de bord admin"
echo "4. Tester sur mobile (PWA)"

echo ""
echo -e "${GREEN}🎉 Validation terminée !${NC}"
echo "Si toutes les vérifications sont vertes, votre déploiement est réussi."
