#!/bin/bash

# Script de déploiement rapide - WiFi Bisou Bisou
# Mise à jour instantanée vers l'URL GitHub Pages

echo "⚡ Déploiement rapide WiFi Bisou Bisou"
echo "====================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[INFO]${NC} Préparation du déploiement..."

# Vérifier si on est dans le bon répertoire
if [ ! -f "index.html" ]; then
    echo "❌ Fichier index.html non trouvé"
    exit 1
fi

# Passer à la branche gh-pages ou la créer
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# Ajouter tous les fichiers
git add .

# Commiter avec un message automatique
git commit -m "🚀 Déploiement automatique $(date '+%Y-%m-%d %H:%M:%S')"

# Pousser vers GitHub
git push origin gh-pages

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo "🌐 Votre site est maintenant disponible sur :"
echo "   https://mireb1.github.io/WIFIBISOUBISOU/"
echo ""
echo "⏱️  Le déploiement peut prendre quelques minutes pour être visible"
echo "🔄 Rafraîchissez la page si nécessaire"
