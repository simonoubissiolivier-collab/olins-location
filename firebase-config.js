/**
 * OLINS Locations Cameroun
 * Configuration Firebase
 * 
 * MIGRATION: Phase 2 - Remplacer par votre propre API
 * Ce fichier sera le seul à modifier lors de la migration
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, PhoneAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getFunctions } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

// Configuration Firebase - Remplacez avec vos propres clés
const firebaseConfig = {
  apiKey: "AIzaSyDvotre-cle-api-ici",
  authDomain: "olins-cameroun.firebaseapp.com",
  projectId: "olins-cameroun",
  storageBucket: "olins-cameroun.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdef123456"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const phoneProvider = new PhoneAuthProvider(auth);

// Configuration Mobile Money
export const PAYMENT_CONFIG = {
  numbers: {
    mtn: '+237',    // À remplacer
    orange: '+237659592740', // À remplacer
    camtel: '+237'  // À remplacer
  },
  adminWhatsApp: '+237659592740', // WhatsApp admin pour notifications
  adminEmail: 'admin@olins.cm'
};

// Configuration des prix (en FCFA)
export const PRICING = {
  featuredWeek: 3000,
  propertyVerification: 5000,
  agentMonthly: 25000,
  regionalBoost: 1500
};

export default app;