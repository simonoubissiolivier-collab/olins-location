/**
 * ============================================================
 * 🛠️ CONFIGURATION FIREBASE OFFICIELLE - OLINS Locations Cameroun
 * ============================================================
 */

// Import des modules avec la même version (10.7.1) pour éviter les erreurs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, PhoneAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";

// 🔑 Tes clés de configuration (déjà pré-remplies)
const firebaseConfig = {
  apiKey: "AIzaSyD-qNMlNQ-vnbGxq-Gwnk73kNzmPiYxBFA",
  authDomain: "olins-locations-cameroun.firebaseapp.com",
  projectId: "olins-locations-cameroun",
  storageBucket: "olins-locations-cameroun.firebasestorage.app",
  messagingSenderId: "488709011710",
  appId: "1:488709011710:web:1c8795760584d88b6d8daf",
  measurementId: "G-NJMNFPGFVJ"
};

// 🚀 Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// 📦 Export des services pour les utiliser dans tout ton site
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const phoneProvider = new PhoneAuthProvider(auth);

// 💳 Configuration paiements & tarifs
export const PAYMENT_CONFIG = {
  numbers: {
    mtn: 'En attente',
    orange: '+237659592740',
    camtel: 'Pas encore disponible'
  },
  adminWhatsApp: '+237659592740',
  adminEmail: 'admin@olins.cm'
};

export const PRICING = {
  featuredWeek: 3000,
  propertyVerification: 5000,
  agentMonthly: 25000,
  regionalBoost: 1500
};

export default app;
