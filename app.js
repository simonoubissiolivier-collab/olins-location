/**
 * OLINS Locations Cameroun
 * Point d'entrée principal de l'application
 */

import { auth, db } from './firebase-config.js';
import { loadLatestListings } from './modules/listings.js';
import { setupAuth } from './modules/auth.js';
import { setupSearch } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('OLINS Locations Cameroun');
  
  // Menu mobile
  setupMobileMenu();
  
  // Recherche
  setupSearch();
  
  // Authentification
  setupAuth();
  
  // Charger les annonces
  if (document.getElementById('listingsContainer')) {
    loadLatestListings();
  }
  
  // Observer l'état d'authentification
  auth.onAuthStateChanged(user => {
    updateUI(user);
  });
});

// ✅ FONCTION MENU MOBILE CORRIGÉE
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) {
    nav.classList.toggle('active');
  }
}

function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  if (btn) {
    btn.addEventListener('click', toggleMenu);
  }
  
  // Fermer le menu quand on clique sur un lien
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('navLinks');
      if (nav) nav.classList.remove('active');
    });
  });
}

function updateUI(user) {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  
  if (user) {
    if (loginBtn) {
      loginBtn.textContent = 'Mon compte';
      loginBtn.href = '/dashboard.html';
    }
    if (registerBtn) {
      registerBtn.textContent = 'Publier';
      registerBtn.href = '/publish.html';
    }
  } else {
    if (loginBtn) {
      loginBtn.textContent = 'Connexion';
      loginBtn.href = '#';
    }
    if (registerBtn) {
      registerBtn.textContent = "S'inscrire";
      registerBtn.href = '#';
    }
  }
}

window.toggleMenu = toggleMenu;
window.OLINS = {
  appName: 'OLINS Locations Cameroun',
  version: '1.0.0',
  currency: 'FCFA'
};