#!/bin/bash

# Script de déploiement pour wifibisoubisou.com
# Généré automatiquement le 15 juillet 2025

echo "🚀 Déploiement de WiFi Bisou Bisou vers wifibisoubisou.com"
echo "=================================================="

# Variables de configuration
DOMAIN="wifibisoubisou.com"
PROJECT_NAME="WiFi Bisou Bisou"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

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

# Vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier si Node.js est installé
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier si npm est installé
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Créer une sauvegarde
create_backup() {
    log_info "Création d'une sauvegarde..."
    mkdir -p "$BACKUP_DIR"
    
    # Sauvegarder les fichiers importants
    cp -r ./* "$BACKUP_DIR/" 2>/dev/null || true
    
    log_success "Sauvegarde créée dans $BACKUP_DIR"
}

# Préparer les fichiers pour la production
prepare_production_files() {
    log_info "Préparation des fichiers pour la production..."
    
    # Créer le fichier .htaccess pour Apache
    cat > .htaccess << EOF
# Configuration pour wifibisoubisou.com
RewriteEngine On

# Redirection HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Gestion des URL propres
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^?]*) index.html [NC,L,QSA]

# En-têtes de sécurité
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# Mise en cache
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType image/png "access plus 1 year"
ExpiresByType image/jpg "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 year"
ExpiresByType image/gif "access plus 1 year"
ExpiresByType image/svg+xml "access plus 1 year"
EOF

    # Créer le fichier robots.txt
    cat > robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://wifibisoubisou.com/sitemap.xml
EOF

    # Créer le fichier sitemap.xml
    cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://wifibisoubisou.com/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://wifibisoubisou.com/support.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://wifibisoubisou.com/admin.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <priority>0.6</priority>
    </url>
</urlset>
EOF

    log_success "Fichiers de production préparés"
}

# Minifier les fichiers
minify_files() {
    log_info "Minification des fichiers..."
    
    # Minifier CSS (si terser est disponible)
    if command -v terser &> /dev/null; then
        # Minifier JavaScript
        terser script.js --compress --mangle -o script.min.js
        terser demo.js --compress --mangle -o demo.min.js
        log_success "Fichiers JavaScript minifiés"
    else
        log_warning "terser non disponible, minification JavaScript ignorée"
    fi
    
    # Minifier CSS (si csso est disponible)
    if command -v csso &> /dev/null; then
        csso styles.css --output styles.min.css
        log_success "Fichiers CSS minifiés"
    else
        log_warning "csso non disponible, minification CSS ignorée"
    fi
}

# Optimiser les images
optimize_images() {
    log_info "Optimisation des images..."
    
    # Cette fonction peut être étendue avec des outils comme imagemin
    log_warning "Optimisation des images à implémenter"
}

# Mettre à jour la configuration
update_config() {
    log_info "Mise à jour de la configuration pour wifibisoubisou.com..."
    
    # Mettre à jour le manifeste PWA
    sed -i 's|"start_url": ".*"|"start_url": "https://wifibisoubisou.com/"|g' manifest.json
    sed -i 's|"scope": ".*"|"scope": "https://wifibisoubisou.com/"|g' manifest.json
    
    log_success "Configuration mise à jour"
}

# Vérifier la configuration
verify_config() {
    log_info "Vérification de la configuration..."
    
    # Vérifier que les fichiers essentiels existent
    essential_files=("index.html" "styles.css" "script.js" "manifest.json")
    
    for file in "${essential_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Fichier manquant: $file"
            exit 1
        fi
    done
    
    log_success "Configuration vérifiée"
}

# Déployer vers le serveur
deploy_to_server() {
    log_info "Déploiement vers le serveur..."
    
    # Cette section dépend de votre méthode de déploiement
    # Exemples : FTP, SFTP, rsync, Git, etc.
    
    log_warning "Déploiement serveur à configurer selon votre hébergeur"
    
    # Exemple avec rsync (à adapter)
    # rsync -avz --delete ./ user@wifibisoubisou.com:/var/www/html/
    
    # Exemple avec FTP (à adapter)
    # lftp -c "mirror -R ./ ftp://user:pass@wifibisoubisou.com/public_html/"
}

# Tester le déploiement
test_deployment() {
    log_info "Test du déploiement..."
    
    # Test de connectivité
    if curl -s -o /dev/null -w "%{http_code}" "https://wifibisoubisou.com" | grep -q "200"; then
        log_success "Site accessible sur https://wifibisoubisou.com"
    else
        log_warning "Site non accessible ou erreur HTTP"
    fi
}

# Fonction principale
main() {
    log_info "Début du déploiement de $PROJECT_NAME"
    
    check_prerequisites
    create_backup
    prepare_production_files
    minify_files
    optimize_images
    update_config
    verify_config
    deploy_to_server
    test_deployment
    
    log_success "Déploiement terminé !"
    log_info "Site disponible sur: https://wifibisoubisou.com"
    log_info "Sauvegarde disponible dans: $BACKUP_DIR"
}

# Exécuter le script
main "$@"
