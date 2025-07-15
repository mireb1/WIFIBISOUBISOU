// Script d'initialisation pour empêcher l'ouverture automatique de modaux
// Ce script s'exécute immédiatement pour fermer tout modal qui pourrait être ouvert

(function() {
    'use strict';
    
    // Fonction pour fermer tous les modaux immédiatement
    function forceCloseAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        });
    }
    
    // Exécuter immédiatement
    forceCloseAllModals();
    
    // Exécuter aussi quand le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceCloseAllModals);
    } else {
        forceCloseAllModals();
    }
    
    // Nettoyer le localStorage des éventuels flags de modal
    localStorage.removeItem('autoOpenModal');
    localStorage.removeItem('showVoucherModal');
    localStorage.removeItem('modalToOpen');
    
    console.log('🚫 Modaux fermés automatiquement - Accès à l\'application libéré');
})();
