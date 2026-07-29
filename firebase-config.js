/**
 * OLINS Locations Cameroun
 * Configuration Firebase
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, PhoneAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getFunctions } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

const firebaseConfig = {
  apiKey: "AIzaSyDvotre-cle-api-ici",
  authDomain: "olins-cameroun.firebaseapp.com",
  projectId: "olins-cameroun",
  storageBucket: "olins-cameroun.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const phoneProvider = new PhoneAuthProvider(auth);

export const PAYMENT_CONFIG = {
  numbers: {
    mtn: '+237',
    orange: '+237659592740',
    camtel: '+237'
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
