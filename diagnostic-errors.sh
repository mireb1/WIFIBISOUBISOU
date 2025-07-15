#!/bin/bash
# Script de diagnostic des erreurs - WiFi Bisou Bisou

echo "🔍 DIAGNOSTIC DES ERREURS - WiFi Bisou Bisou"
echo "============================================="

# Vérifier la syntaxe JavaScript
echo "📝 VÉRIFICATION DE LA SYNTAXE JAVASCRIPT:"
js_files=(
    "url-config.js"
    "environment-config.js"
    "router-manager.js"
    "equipment-manager.js"
    "subscription-manager.js"
    "user-manager.js"
    "transaction-manager.js"
    "zone-manager.js"
    "dashboard-manager.js"
    "auto-dashboard-config.js"
    "script.js"
    "demo.js"
)

for file in "${js_files[@]}"; do
    if [ -f "$file" ]; then
        if node -c "$file" 2>/dev/null; then
            echo "✅ $file - Syntaxe OK"
        else
            echo "❌ $file - ERREUR DE SYNTAXE"
            node -c "$file" 2>&1 | head -3
        fi
    else
        echo "⚠️  $file - FICHIER MANQUANT"
    fi
done

# Vérifier la syntaxe JSON
echo ""
echo "📋 VÉRIFICATION DE LA SYNTAXE JSON:"
json_files=(
    "manifest.json"
    "package.json"
)

for file in "${json_files[@]}"; do
    if [ -f "$file" ]; then
        if python3 -m json.tool "$file" > /dev/null 2>&1; then
            echo "✅ $file - JSON valide"
        else
            echo "❌ $file - JSON INVALIDE"
            python3 -m json.tool "$file" 2>&1 | head -3
        fi
    else
        echo "⚠️  $file - FICHIER MANQUANT"
    fi
done

# Vérifier la syntaxe HTML
echo ""
echo "🌐 VÉRIFICATION DE LA SYNTAXE HTML:"
if [ -f "index.html" ]; then
    # Vérifier les balises de base
    if grep -q "<!DOCTYPE html>" index.html; then
        echo "✅ DOCTYPE déclaré"
    else
        echo "❌ DOCTYPE manquant"
    fi
    
    if grep -q "<html" index.html && grep -q "</html>" index.html; then
        echo "✅ Balises HTML présentes"
    else
        echo "❌ Balises HTML manquantes"
    fi
    
    if grep -q "<head>" index.html && grep -q "</head>" index.html; then
        echo "✅ Balises HEAD présentes"
    else
        echo "❌ Balises HEAD manquantes"
    fi
    
    if grep -q "<body>" index.html && grep -q "</body>" index.html; then
        echo "✅ Balises BODY présentes"
    else
        echo "❌ Balises BODY manquantes"
    fi
else
    echo "❌ index.html - FICHIER MANQUANT"
fi

# Vérifier les liens et références
echo ""
echo "🔗 VÉRIFICATION DES LIENS ET RÉFÉRENCES:"
if [ -f "index.html" ]; then
    # Vérifier les scripts
    echo "Scripts référencés:"
    grep -o 'src="[^"]*\.js"' index.html | sed 's/src="//g' | sed 's/"//g' | while read script; do
        if [ -f "$script" ]; then
            echo "✅ $script"
        else
            echo "❌ $script - MANQUANT"
        fi
    done
    
    # Vérifier les CSS
    echo "Fichiers CSS référencés:"
    grep -o 'href="[^"]*\.css"' index.html | sed 's/href="//g' | sed 's/"//g' | while read css; do
        if [ -f "$css" ]; then
            echo "✅ $css"
        else
            echo "❌ $css - MANQUANT"
        fi
    done
fi

# Vérifier les permissions
echo ""
echo "🔒 VÉRIFICATION DES PERMISSIONS:"
important_files=(
    "index.html"
    "styles.css"
    "script.js"
    "manifest.json"
)

for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
        permissions=$(ls -l "$file" | cut -d' ' -f1)
        echo "📄 $file: $permissions"
    fi
done

# Vérifier la configuration Git
echo ""
echo "📦 VÉRIFICATION DE LA CONFIGURATION GIT:"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Repository Git initialisé"
    echo "🌿 Branche actuelle: $(git branch --show-current)"
    echo "📍 Dernier commit: $(git log -1 --pretty=format:'%h - %s')"
    
    # Vérifier les fichiers non suivis
    untracked=$(git ls-files --others --exclude-standard)
    if [ -n "$untracked" ]; then
        echo "⚠️  Fichiers non suivis:"
        echo "$untracked"
    else
        echo "✅ Tous les fichiers sont suivis"
    fi
else
    echo "❌ Repository Git non initialisé"
fi

# Test de connectivité
echo ""
echo "🌐 TEST DE CONNECTIVITÉ:"
if curl -s --head "https://mireb1.github.io/WIFIBISOUBISOU/" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Site accessible en production"
else
    echo "⚠️  Site non accessible ou en cours de déploiement"
fi

# Résumé des erreurs
echo ""
echo "📊 RÉSUMÉ DU DIAGNOSTIC:"
echo "========================"
echo "🔍 Vérifiez les erreurs marquées avec ❌"
echo "⚠️  Les avertissements peuvent nécessiter attention"
echo "✅ Les éléments OK sont fonctionnels"
echo ""
echo "🔗 URL de test: https://mireb1.github.io/WIFIBISOUBISOU/"
echo "📱 Pour tester localement: python3 -m http.server 8000"
