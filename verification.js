/**
 * Module de vérification d'identité
 * OLINS Locations Cameroun
 */

import { db, storage, PAYMENT_CONFIG } from '../firebase-config.js';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { validateImageFile } from './utils.js';

// ============================================
// SOUMETTRE UNE VÉRIFICATION D'IDENTITÉ
// ============================================

export async function submitIdentityVerification(userId, formData) {
  try {
    // Validation des fichiers
    const cniFrontValidation = validateImageFile(formData.cniFront, 5);
    if (!cniFrontValidation.valid) {
      throw new Error(`CNI Recto: ${cniFrontValidation.error}`);
    }
    
    const cniBackValidation = validateImageFile(formData.cniBack, 5);
    if (!cniBackValidation.valid) {
      throw new Error(`CNI Verso: ${cniBackValidation.error}`);
    }
    
    const selfieValidation = validateImageFile(formData.selfie, 5);
    if (!selfieValidation.valid) {
      throw new Error(`Selfie: ${selfieValidation.error}`);
    }
    
    // Upload CNI Recto
    const cniFrontRef = ref(storage, `verifications/${userId}/cni_front_${Date.now()}.jpg`);
    await uploadBytes(cniFrontRef, formData.cniFront);
    const cniFrontUrl = await getDownloadURL(cniFrontRef);
    
    // Upload CNI Verso
    const cniBackRef = ref(storage, `verifications/${userId}/cni_back_${Date.now()}.jpg`);
    await uploadBytes(cniBackRef, formData.cniBack);
    const cniBackUrl = await getDownloadURL(cniBackRef);
    
    // Upload Selfie avec CNI
    const selfieRef = ref(storage, `verifications/${userId}/selfie_${Date.now()}.jpg`);
    await uploadBytes(selfieRef, formData.selfie);
    const selfieUrl = await getDownloadURL(selfieRef);
    
    // Sauvegarder dans Firestore
    const verificationData = {
      fullName: formData.fullName,
      phone: formData.phone,
      cniFrontUrl,
      cniBackUrl,
      selfieUrl,
      submittedAt: serverTimestamp(),
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null
    };
    
    await setDoc(doc(db, 'verifications', userId), verificationData);
    
    // Mettre à jour le statut utilisateur
    await setDoc(doc(db, 'users', userId), {
      verificationStatus: 'pending',
      verificationSubmittedAt: serverTimestamp()
    }, { merge: true });
    
    // Notifier l'admin (sera traité par une Cloud Function)
    await notifyAdminNewVerification(userId, formData.fullName, formData.phone);
    
    return { 
      success: true, 
      message: '✅ Pièces soumises avec succès ! Vérification en cours (24-48h).' 
    };
    
  } catch (error) {
    console.error('Erreur vérification:', error);
    return { success: false, message: error.message };
  }
}

// ============================================
// NOTIFICATION ADMIN
// ============================================

async function notifyAdminNewVerification(userId, fullName, phone) {
  // Dans un environnement de production, ceci serait une Cloud Function
  // qui envoie un email ET un message WhatsApp
  
  console.log('📧 Notification admin pour vérification:', { userId, fullName, phone });
  
  // Stockage local de la notification
  try {
    const { addDoc, collection } = await import(
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
    );
    
    await addDoc(collection(db, 'adminNotifications'), {
      type: 'new_verification',
      userId,
      fullName,
      phone,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Notification admin non envoyée:', error);
  }
}

// ============================================
// VÉRIFIER LE STATUT
// ============================================

export async function checkVerificationStatus(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { status: 'none', message: 'Utilisateur non trouvé' };
    }
    
    const userData = userDoc.data();
    
    switch (userData.verificationStatus) {
      case 'approved':
        return { status: 'approved', message: '✅ Identité vérifiée' };
      case 'pending':
        return { status: 'pending', message: '⏳ Vérification en cours...' };
      case 'rejected':
        return { status: 'rejected', message: '❌ Vérification refusée. Contactez le support.' };
      default:
        return { status: 'none', message: '⚠️ Vérification requise' };
    }
    
  } catch (error) {
    console.error('Erreur vérification statut:', error);
    return { status: 'error', message: 'Erreur de vérification' };
  }
}