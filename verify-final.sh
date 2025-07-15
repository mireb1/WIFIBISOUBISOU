#!/bin/bash

# ============================================================================
# SCRIPT DE VÉRIFICATION FINALE - WiFi Bisou Bisou
# Vérification complète de tous les composants et tests
# ============================================================================

echo "🔍 VÉRIFICATION FINALE - WiFi Bisou Bisou"
echo "============================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher un message coloré
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️ $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️ $message${NC}"
            ;;
    esac
}

# Vérifier la connectivité du site principal
echo -e "\n📡 VÉRIFICATION DE LA CONNECTIVITÉ"
echo "-----------------------------------"

if curl -s --head https://mireb1.github.io/WIFIBISOUBISOU/ | grep "200 OK" > /dev/null; then
    print_status "SUCCESS" "Site principal accessible"
else
    print_status "ERROR" "Site principal inaccessible"
fi

# Vérifier les fichiers de test
echo -e "\n🧪 VÉRIFICATION DES FICHIERS DE TEST"
echo "------------------------------------"

test_files=(
    "test-final-individual.js"
    "test-auto-corrected.js"
    "test-interface-advanced.html"
    "test-interactif.html"
    "test-auto.js"
)

for file in "${test_files[@]}"; do
    if curl -s --head "https://mireb1.github.io/WIFIBISOUBISOU/$file" | grep "200 OK" > /dev/null; then
        print_status "SUCCESS" "$file disponible"
    else
        print_status "ERROR" "$file non disponible"
    fi
done

# Vérifier les fichiers principaux
echo -e "\n📄 VÉRIFICATION DES FICHIERS PRINCIPAUX"
echo "---------------------------------------"

main_files=(
    "index.html"
    "script.js"
    "styles.css"
    "admin.html"
    "router-management.html"
    "support.html"
)

for file in "${main_files[@]}"; do
    if curl -s --head "https://mireb1.github.io/WIFIBISOUBISOU/$file" | grep "200 OK" > /dev/null; then
        print_status "SUCCESS" "$file disponible"
    else
        print_status "ERROR" "$file non disponible"
    fi
done

# Vérifier les fonctions critiques dans script.js
echo -e "\n⚙️ VÉRIFICATION DES FONCTIONS CRITIQUES"
echo "---------------------------------------"

critical_functions=(
    "showUserLoginModal"
    "validateVoucher"
    "buyTicket"
    "showDashboard"
    "showSection"
    "initializeApp"
)

script_content=$(curl -s https://mireb1.github.io/WIFIBISOUBISOU/script.js)

for func in "${critical_functions[@]}"; do
    if echo "$script_content" | grep -q "function $func\|$func.*function\|$func.*="; then
        print_status "SUCCESS" "Fonction $func présente"
    else
        print_status "WARNING" "Fonction $func non trouvée"
    fi
done

# Vérifier la structure HTML
echo -e "\n🏗️ VÉRIFICATION DE LA STRUCTURE HTML"
echo "------------------------------------"

html_content=$(curl -s https://mireb1.github.io/WIFIBISOUBISOU/index.html)

html_elements=(
    "navbar"
    "hero"
    "dashboard"
    "login-btn"
    "voucher-card"
)

for element in "${html_elements[@]}"; do
    if echo "$html_content" | grep -q "class=\".*$element\|id=\".*$element"; then
        print_status "SUCCESS" "Élément $element présent"
    else
        print_status "WARNING" "Élément $element non trouvé"
    fi
done

# Vérifier les ressources CSS
echo -e "\n🎨 VÉRIFICATION DES RESSOURCES CSS"
echo "----------------------------------"

css_content=$(curl -s https://mireb1.github.io/WIFIBISOUBISOU/styles.css)

css_selectors=(
    ".navbar"
    ".hero"
    ".btn"
    ".modal"
    ".voucher-card"
)

for selector in "${css_selectors[@]}"; do
    if echo "$css_content" | grep -q "$selector"; then
        print_status "SUCCESS" "Style $selector présent"
    else
        print_status "WARNING" "Style $selector non trouvé"
    fi
done

# Test de performance
echo -e "\n⚡ TEST DE PERFORMANCE"
echo "----------------------"

start_time=$(date +%s%N)
response=$(curl -s -w "%{time_total}" https://mireb1.github.io/WIFIBISOUBISOU/index.html)
end_time=$(date +%s%N)

# Extraire le temps de réponse
time_total=$(echo "$response" | tail -1)
time_ms=$(echo "$time_total * 1000" | bc)

if (( $(echo "$time_total < 2.0" | bc -l) )); then
    print_status "SUCCESS" "Temps de réponse: ${time_ms}ms (Excellent)"
elif (( $(echo "$time_total < 5.0" | bc -l) )); then
    print_status "WARNING" "Temps de réponse: ${time_ms}ms (Acceptable)"
else
    print_status "ERROR" "Temps de réponse: ${time_ms}ms (Trop lent)"
fi

# Vérifier la documentation
echo -e "\n📚 VÉRIFICATION DE LA DOCUMENTATION"
echo "-----------------------------------"

doc_files=(
    "README.md"
    "DOCUMENTATION-TESTS.md"
    "GUIDE-UTILISATION.md"
    "DEPLOYMENT.md"
)

for file in "${doc_files[@]}"; do
    if curl -s --head "https://mireb1.github.io/WIFIBISOUBISOU/$file" | grep "200 OK" > /dev/null; then
        print_status "SUCCESS" "$file disponible"
    else
        print_status "WARNING" "$file non disponible"
    fi
done

# Générer un rapport final
echo -e "\n📊 RAPPORT FINAL"
echo "=================="

total_checks=0
passed_checks=0

# Compter les vérifications
for file in "${test_files[@]}"; do
    total_checks=$((total_checks + 1))
    if curl -s --head "https://mireb1.github.io/WIFIBISOUBISOU/$file" | grep "200 OK" > /dev/null; then
        passed_checks=$((passed_checks + 1))
    fi
done

for file in "${main_files[@]}"; do
    total_checks=$((total_checks + 1))
    if curl -s --head "https://mireb1.github.io/WIFIBISOUBISOU/$file" | grep "200 OK" > /dev/null; then
        passed_checks=$((passed_checks + 1))
    fi
done

success_rate=$(echo "scale=2; $passed_checks * 100 / $total_checks" | bc)

echo "📈 Taux de réussite: $success_rate%"
echo "✅ Vérifications passées: $passed_checks/$total_checks"

if (( $(echo "$success_rate >= 90" | bc -l) )); then
    print_status "SUCCESS" "SYSTÈME ENTIÈREMENT OPÉRATIONNEL"
elif (( $(echo "$success_rate >= 80" | bc -l) )); then
    print_status "WARNING" "SYSTÈME PRINCIPALEMENT OPÉRATIONNEL"
else
    print_status "ERROR" "SYSTÈME NÉCESSITE DES CORRECTIONS"
fi

echo -e "\n🎯 PROCHAINES ÉTAPES:"
echo "1. Utiliser test-final-individual.js pour les tests détaillés"
echo "2. Ouvrir test-interface-advanced.html pour l'interface graphique"
echo "3. Consulter DOCUMENTATION-TESTS.md pour le guide complet"
echo "4. Tester manuellement toutes les fonctionnalités"

echo -e "\n🔗 LIENS UTILES:"
echo "• Site principal: https://mireb1.github.io/WIFIBISOUBISOU/"
echo "• Interface de test: https://mireb1.github.io/WIFIBISOUBISOU/test-interface-advanced.html"
echo "• Script de test: https://mireb1.github.io/WIFIBISOUBISOU/test-final-individual.js"
echo "• Documentation: https://mireb1.github.io/WIFIBISOUBISOU/DOCUMENTATION-TESTS.md"

echo -e "\n🎉 Vérification terminée!"
