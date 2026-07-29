/**
 * Module d'authentification
 * OLINS Locations Cameroun
 */

import { auth, db } from '../firebase-config.js';
import { 
  signInWithPhoneNumber, 
  signOut,
  RecaptchaVerifier
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export function setupAuth() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => startPhoneAuth('login'));
  }
  if (registerBtn) {
    registerBtn.addEventListener('click', () => startPhoneAuth('register'));
  }
}

let recaptchaVerifier = null;
let confirmationResult = null;

async function startPhoneAuth(mode) {
  const attempts = getLoginAttempts();
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    alert('⛔ Trop de tentatives. Veuillez patienter 15 minutes.');
    return;
  }
  
  const phone = prompt('📱 Entrez votre numéro (+237XXXXXXXXX):');
  if (!phone || !phone.startsWith('+237')) {
    alert('❌ Numéro invalide. Format: +237XXXXXXXXX');
    return;
  }
  
  try {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
    
    confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    
    const code = prompt('🔐 Entrez le code reçu par SMS (6 chiffres):');
    if (!code || code.length !== 6) {
      alert('❌ Code invalide (6 chiffres attendus)');
      incrementLoginAttempts();
      return;
    }
    
    const result = await confirmationResult.confirm(code);
    const user = result.user;
    resetLoginAttempts();
    await handleUserAfterLogin(user);
    
  } catch (error) {
    console.error('Erreur auth:', error);
    incrementLoginAttempts();
    
    const messages = {
      'auth/invalid-verification-code': 'Code SMS incorrect. Veuillez réessayer.',
      'auth/too-many-requests': 'Trop de tentatives. Veuillez patienter 15 minutes.',
      'auth/invalid-phone-number': 'Numéro de téléphone invalide.'
    };
    
    alert('❌ ' + (messages[error.code] || 'Erreur d\'authentification'));
  }
}

async function handleUserAfterLogin(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        phone: user.phoneNumber
      }, { merge: true });
      
      window.location.href = userData.verificationStatus === 'approved' 
        ? '/dashboard.html' 
        : '/verification.html';
    } else {
      await setDoc(userRef, {
        phone: user.phoneNumber,
        createdAt: serverTimestamp(),
        verificationStatus: 'none',
        role: 'user',
        loginCount: 1
      });
      window.location.href = '/verification.html';
    }
  } catch (error) {
    console.error('Erreur gestion utilisateur:', error);
    alert('Erreur lors de la connexion. Veuillez réessayer.');
  }
}

export async function logout() {
  try {
    await signOut(auth);
    window.location.href = '/';
  } catch (error) {
    console.error('Erreur déconnexion:', error);
  }
}

function getLoginAttempts() {
  try {
    const data = localStorage.getItem('olins_login_attempts');
    if (!data) return 0;
    const { attempts, timestamp } = JSON.parse(data);
    if (Date.now() - timestamp > LOCKOUT_DURATION) {
      localStorage.removeItem('olins_login_attempts');
      return 0;
    }
    return attempts;
  } catch (e) {
    return 0;
  }
}

function incrementLoginAttempts() {
  const attempts = getLoginAttempts();
  localStorage.setItem('olins_login_attempts', JSON.stringify({
    attempts: attempts + 1,
    timestamp: Date.now()
  }));
}

function resetLoginAttempts() {
  localStorage.removeItem('olins_login_attempts');
}