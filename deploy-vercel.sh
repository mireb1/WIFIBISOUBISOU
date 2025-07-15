#!/bin/bash

# Déploiement Vercel pour WiFi Bisou Bisou
echo "🚀 Déploiement vers Vercel..."

# Vérifier si vercel-cli est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Créer vercel.json
cat > vercel.json << EOF
{
  "version": 2,
  "name": "wifi-bisou-bisou",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF

# Déployer
echo "🚀 Déploiement en cours..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌐 Votre site est maintenant en ligne !"
echo "💡 Vous pouvez configurer un domaine personnalisé avec: vercel domains"
