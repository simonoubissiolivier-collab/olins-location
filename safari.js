/**
 * Fix pour Safari sur iOS
 */

document.addEventListener('DOMContentLoaded', function() {
  // Détecter Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    console.log('🍎 Safari détecté - Application des fixes');
    
    // Fix: Forcer la mise à jour des selects
    document.querySelectorAll('select.search-input').forEach(select => {
      // Forcer le re-rendu
      select.style.display = 'none';
      setTimeout(() => {
        select.style.display = '';
      }, 10);
      
      // Ajouter un événement pour forcer l'affichage
      select.addEventListener('touchstart', function() {
        this.style.opacity = '0.99';
        setTimeout(() => {
          this.style.opacity = '1';
        }, 10);
      });
    });
    
    // Fix: Empêcher le zoom automatique
    document.querySelectorAll('input.search-input, select.search-input').forEach(el => {
      el.style.fontSize = '16px';
    });
  }
});
