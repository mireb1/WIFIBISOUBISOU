#!/bin/bash

# Déploiement Netlify pour WiFi Bisou Bisou
echo "🚀 Déploiement vers Netlify..."

# Vérifier si netlify-cli est installé
if ! command -v netlify &> /dev/null; then
    echo "📦 Installation de Netlify CLI..."
    npm install -g netlify-cli
fi

# Créer le dossier de build
mkdir -p dist
echo "📁 Préparation des fichiers pour Netlify..."

# Copier les fichiers essentiels
cp index.html dist/
cp *.js dist/ 2>/dev/null || true
cp *.css dist/ 2>/dev/null || true  
cp *.json dist/ 2>/dev/null || true
cp *.html dist/ 2>/dev/null || true

# Créer _redirects pour Netlify
cat > dist/_redirects << EOF
# Redirections pour l'application WiFi Bisou Bisou
/*    /index.html   200
EOF

# Créer netlify.toml
cat > netlify.toml << EOF
[build]
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  NODE_ENV = "production"
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    
[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
EOF

# Déployer
echo "🚀 Déploiement en cours..."
netlify deploy --prod --dir=dist

echo "✅ Déploiement terminé !"
echo "🌐 Votre site est maintenant en ligne !"
echo "💡 Vous pouvez configurer un domaine personnalisé dans les paramètres Netlify"
