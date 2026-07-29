/**
 * Module de paiement Mobile Money
 * OLINS Locations Cameroun
 * 
 * RÈGLE ABSOLUE : JAMAIS de solde virtuel, JAMAIS de jetons
 * Paiement → Confirmation manuelle → Activation immédiate
 */

import { db, PAYMENT_CONFIG, PRICING } from '../firebase-config.js';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function initiatePayment(userId, serviceType, listingId = null) {
  try {
    let amount = 0;
    let serviceName = '';
    
    switch (serviceType) {
      case 'featured_week':
        amount = PRICING.featuredWeek;
        serviceName = 'Annonce en tête de liste (1 semaine)';
        break;
      case 'property_verification':
        amount = PRICING.propertyVerification;
        serviceName = 'Badge Bien Vérifié';
        break;
      case 'agent_monthly':
        amount = PRICING.agentMonthly;
        serviceName = 'Abonnement Agent (1 mois)';
        break;
      case 'regional_boost':
        amount = PRICING.regionalBoost;
        serviceName = 'Visibilité régionale';
        break;
      default:
        throw new Error('Service inconnu');
    }
    
    const paymentData = {
      userId,
      listingId: listingId || null,
      serviceType,
      serviceName,
      amount,
      currency: 'FCFA',
      status: 'pending',
      paymentMethod: null,
      transactionRef: null,
      createdAt: serverTimestamp(),
      confirmedAt: null,
      confirmedBy: null
    };
    
    const paymentRef = await addDoc(collection(db, 'payments'), paymentData);
    const instructions = generatePaymentInstructions(amount, serviceName);
    
    return {
      success: true,
      paymentId: paymentRef.id,
      amount,
      instructions
    };
  } catch (error) {
    console.error('Erreur initiation paiement:', error);
    return { success: false, message: error.message };
  }
}

function generatePaymentInstructions(amount, serviceName) {
  return {
    title: `Paiement de ${amount.toLocaleString()} FCFA`,
    service: serviceName,
    methods: [
      {
        name: 'MTN Mobile Money',
        number: PAYMENT_CONFIG.numbers.mtn,
        steps: [
          'Composez le *126#',
          'Sélectionnez "Paiement marchand"',
          `Entrez le numéro: ${PAYMENT_CONFIG.numbers.mtn}`,
          `Montant: ${amount} FCFA`,
          'Validez avec votre code secret'
        ]
      },
      {
        name: 'Orange Money',
        number: PAYMENT_CONFIG.numbers.orange,
        steps: [
          'Composez le *150#',
          'Sélectionnez "Paiement"',
          `Entrez le numéro: ${PAYMENT_CONFIG.numbers.orange}`,
          `Montant: ${amount} FCFA`,
          'Validez avec votre code secret'
        ]
      }
    ],
    warning: '⚠️ ATTENTION : On ne vous demandera JAMAIS votre code secret !',
    afterPayment: `Après le paiement, envoyez le message de confirmation par WhatsApp au ${PAYMENT_CONFIG.adminWhatsApp}`,
    processingTime: 'Votre service sera activé dans un délai de 15-30 minutes après confirmation.'
  };
}

export async function checkPaymentStatus(paymentId) {
  try {
    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    if (!paymentDoc.exists()) {
      return { status: 'not_found', message: 'Paiement introuvable' };
    }
    
    const paymentData = paymentDoc.data();
    return {
      status: paymentData.status,
      serviceType: paymentData.serviceType,
      amount: paymentData.amount,
      confirmedAt: paymentData.confirmedAt
    };
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return { status: 'error', message: 'Erreur de vérification' };
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
    console.error('Erreur confirmation:', error);
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