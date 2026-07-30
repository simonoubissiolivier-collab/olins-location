/**
 * OLINS Locations Cameroun
 * Configuration Firebase
 */
<script type="module">
import { getAuth, PhoneAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getFunctions } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD-qNMlNQ-vnbGxq-Gwnk73kNzmPiYxBFA",
    authDomain: "olins-locations-cameroun.firebaseapp.com",
    projectId: "olins-locations-cameroun",
    storageBucket: "olins-locations-cameroun.firebasestorage.app",
    messagingSenderId: "488709011710",
    appId: "1:488709011710:web:1c8795760584d88b6d8daf",
    measurementId: "G-NJMNFPGFVJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script
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
