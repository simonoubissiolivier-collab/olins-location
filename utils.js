/**
 * Utilitaires pour OLINS Locations Cameroun
 */

// ============================================
// FORMATAGE
// ============================================

/**
 * Formater un prix en FCFA
 */
export function formatPrice(price) {
  if (!price && price !== 0) return 'Prix non défini';
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

/**
 * Formater une date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Tronquer un texte
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
}

// ============================================
// VALIDATION
// ============================================

/**
 * Valider un numéro de téléphone camerounais
 */
export function validatePhone(phone) {
  const cleaned = phone.replace(/\s+/g, '');
  const regex = /^(\+237|237)?[6-9][0-9]{8}$/;
  return regex.test(cleaned);
}

/**
 * Valider un email
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ============================================
// RECHERCHE
// ============================================

export function setupSearch() {
  const form = document.getElementById('searchForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const region = document.getElementById('searchRegion')?.value || '';
    const city = document.getElementById('searchCity')?.value || '';
    const type = document.getElementById('searchType')?.value || '';
    const maxPrice = document.getElementById('searchMaxPrice')?.value || '';
    
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (city) params.append('city', city);
    if (type) params.append('type', type);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    window.location.href = `/listings.html?${params.toString()}`;
  });
}

// ============================================
// SÉCURITÉ
// ============================================

/**
 * Assainir une entrée utilisateur
 */
export function sanitizeInput(input) {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Vérifier la taille d'un fichier image
 */
export function validateImageFile(file, maxSizeMB = 5) {
  if (!file) return { valid: false, error: 'Aucun fichier' };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Format accepté : JPG, PNG, WebP' };
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Fichier trop volumineux (max ${maxSizeMB} Mo)` };
  }
  
  return { valid: true };
}

// ============================================
// STORAGE LOCAL
// ============================================

export function saveToLocal(key, data) {
  try {
    localStorage.setItem(`olins_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage non disponible');
  }
}

export function getFromLocal(key) {
  try {
    const data = localStorage.getItem(`olins_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}