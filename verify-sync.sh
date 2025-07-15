#!/bin/bash
# Script de vérification du déploiement - WiFi Bisou Bisou

echo "🔍 VÉRIFICATION DU DÉPLOIEMENT..."
echo "=================================="

# Vérifier la branche actuelle
current_branch=$(git branch --show-current)
echo "📍 Branche actuelle: $current_branch"

# Vérifier le statut Git
git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    echo "✅ Repository propre - tous les fichiers sont synchronisés"
else
    echo "⚠️  Fichiers non synchronisés détectés:"
    echo "$git_status"
fi

# Vérifier les fichiers essentiels
echo ""
echo "📁 VÉRIFICATION DES FICHIERS ESSENTIELS:"
files=(
    "index.html"
    "router-manager.js"
    "equipment-manager.js"
    "subscription-manager.js"
    "user-manager.js"
    "transaction-manager.js"
    "zone-manager.js"
    "dashboard-manager.js"
    "auto-dashboard-config.js"
    "styles.css"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MANQUANT"
    fi
done

# Vérifier l'URL de déploiement
echo ""
echo "🌐 URL DE DÉPLOIEMENT:"
echo "https://mireb1.github.io/WIFIBISOUBISOU/"

# Vérifier la configuration des branches
echo ""
echo "🔄 CONFIGURATION DES BRANCHES:"
echo "Branche principale: $(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')"
echo "Branches disponibles:"
git branch -a

# Test de connectivité
echo ""
echo "🔗 TEST DE CONNECTIVITÉ:"
if curl -s -o /dev/null -w "%{http_code}" "https://mireb1.github.io/WIFIBISOUBISOU/" | grep -q "200"; then
    echo "✅ Site accessible - Code 200 OK"
else
    echo "⚠️  Site non accessible ou en cours de déploiement"
fi

echo ""
echo "🚀 STATUT FINAL:"
if [ -z "$git_status" ] && [ "$current_branch" = "main" ]; then
    echo "✅ DÉPLOIEMENT SYNCHRONISÉ - Système opérationnel"
else
    echo "⚠️  SYNCHRONISATION NÉCESSAIRE"
fi

echo ""
echo "📊 ACCÈS AU TABLEAU DE BORD:"
echo "1. Ouvrir: https://mireb1.github.io/WIFIBISOUBISOU/"
echo "2. Cliquer sur 'Tableau de bord' dans le menu"
echo "3. Explorer les 6 sections automatisées"
echo "4. Utiliser 'Contrôles' pour les options admin"
