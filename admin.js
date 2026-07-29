/**
 * Module d'administration
 * OLINS Locations Cameroun
 */

import { db } from '../firebase-config.js';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function isAdmin(userId) {
  try {
    if (!userId) return false;
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Erreur vérification admin:', error);
    return false;
  }
}

export async function loadPendingVerifications() {
  try {
    const q = query(
      collection(db, 'verifications'),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    const verifications = [];
    snapshot.forEach(doc => {
      verifications.push({ id: doc.id, ...doc.data() });
    });
    return verifications;
  } catch (error) {
    console.error('Erreur chargement vérifications:', error);
    return [];
  }
}

export async function approveVerification(userId, adminId) {
  try {
    await updateDoc(doc(db, 'verifications', userId), {
      status: 'approved',
      reviewedBy: adminId,
      reviewedAt: serverTimestamp()
    });
    
    await updateDoc(doc(db, 'users', userId), {
      verificationStatus: 'approved',
      verifiedAt: serverTimestamp()
    });
    
    const listingsQuery = query(
      collection(db, 'listings'),
      where('userId', '==', userId)
    );
    const listingsSnapshot = await getDocs(listingsQuery);
    
    const updatePromises = [];
    listingsSnapshot.forEach(listingDoc => {
      updatePromises.push(
        updateDoc(doc(db, 'listings', listingDoc.id), {
          ownerVerified: true
        })
      );
    });
    await Promise.all(updatePromises);
    
    return { success: true, message: '✅ Identité approuvée et annonces mises à jour' };
  } catch (error) {
    console.error('Erreur approbation:', error);
    return { success: false, message: error.message };
  }
}

export async function rejectVerification(userId, adminId, reason) {
  try {
    await updateDoc(doc(db, 'verifications', userId), {
      status: 'rejected',
      rejectionReason: reason || 'Non spécifié',
      reviewedBy: adminId,
      reviewedAt: serverTimestamp()
    });
    
    await updateDoc(doc(db, 'users', userId), {
      verificationStatus: 'rejected',
      rejectionReason: reason || 'Non spécifié'
    });
    
    return { success: true, message: '❌ Vérification rejetée' };
  } catch (error) {
    console.error('Erreur rejet:', error);
    return { success: false, message: error.message };
  }
}

export async function loadPendingPayments() {
  try {
    const q = query(
      collection(db, 'payments'),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    const payments = [];
    snapshot.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return payments;
  } catch (error) {
    console.error('Erreur chargement paiements:', error);
    return [];
  }
}

export async function confirmPayment(paymentId, adminId, transactionRef) {
  try {
    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    if (!paymentDoc.exists()) {
      throw new Error('Paiement introuvable');
    }
    
    const paymentData = paymentDoc.data();
    
    await updateDoc(doc(db, 'payments', paymentId), {
      status: 'confirmed',
      transactionRef,
      confirmedBy: adminId,
      confirmedAt: serverTimestamp()
    });
    
    await activateService(paymentData.userId, paymentData.serviceType, paymentData.listingId);
    
    return { success: true, message: '✅ Paiement confirmé et service activé' };
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    return { success: false, message: error.message };
  }
}

async function activateService(userId, serviceType, listingId) {
  try {
    switch (serviceType) {
      case 'featured_week':
        if (listingId) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);
          await updateDoc(doc(db, 'listings', listingId), {
            featured: true,
            featuredUntil: expiryDate.toISOString()
          });
        }
        break;
        
      case 'property_verification':
        if (listingId) {
          await updateDoc(doc(db, 'listings', listingId), {
            propertyVerified: true
          });
        }
        break;
        
      case 'agent_monthly':
        const agentExpiry = new Date();
        agentExpiry.setMonth(agentExpiry.getMonth() + 1);
        await updateDoc(doc(db, 'users', userId), {
          role: 'agent',
          agentSubscriptionExpiry: agentExpiry.toISOString()
        });
        break;
        
      case 'regional_boost':
        if (listingId) {
          const boostExpiry = new Date();
          boostExpiry.setDate(boostExpiry.getDate() + 7);
          await updateDoc(doc(db, 'listings', listingId), {
            regionalBoost: true,
            regionalBoostUntil: boostExpiry.toISOString()
          });
        }
        break;
        
      default:
        console.warn('Service inconnu:', serviceType);
    }
  } catch (error) {
    console.error('Erreur activation service:', error);
    throw error;
  }
}