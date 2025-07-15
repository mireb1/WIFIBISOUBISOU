#!/bin/bash

# Déploiement GitHub Pages pour WiFi Bisou Bisou
echo "🚀 Déploiement vers GitHub Pages..."

# Vérifier si on est dans un repo git
if [ ! -d ".git" ]; then
    echo "❌ Pas de repository Git détecté"
    echo "💡 Initialisez d'abord un repo avec: git init"
    exit 1
fi

# Créer une branche gh-pages
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Copier les fichiers nécessaires
echo "📁 Préparation des fichiers..."
cp index.html index.html.bak
cp *.js . 2>/dev/null || true
cp *.css . 2>/dev/null || true
cp *.json . 2>/dev/null || true
cp *.html . 2>/dev/null || true

# Créer un fichier spécial pour GitHub Pages
cat > .nojekyll << EOF
# Désactiver Jekyll pour GitHub Pages
EOF

# Ajouter et commiter
git add .
git commit -m "Deploy to GitHub Pages - $(date)"

# Pousser vers GitHub
echo "🚀 Déploiement vers GitHub Pages..."
git push origin gh-pages

echo "✅ Déploiement terminé !"
echo "🌐 Votre site sera bientôt disponible sur :"
echo "   https://mireb1.github.io/WIFIBISOUBISOU/"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Aller sur GitHub > Settings > Pages"
echo "2. Sélectionner 'Deploy from a branch'"
echo "3. Choisir 'gh-pages'"
echo "4. Configurer un domaine personnalisé (optionnel)"
