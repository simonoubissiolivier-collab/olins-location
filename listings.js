/**
 * Module de gestion des annonces
 * OLINS Locations Cameroun
 */

import { db, storage } from '../firebase-config.js';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  where,
  addDoc,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { formatPrice, truncateText, formatDate } from './utils.js';

// ============================================
// CHARGER LES DERNIÈRES ANNONCES
// ============================================

export async function loadLatestListings() {
  const container = document.getElementById('listingsContainer');
  if (!container) return;
  
  try {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(12)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      container.innerHTML = `
        <div class="loading-spinner">
          <p>📭 Aucune annonce pour le moment.</p>
          <p>Soyez le premier à publier !</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = '';
    
    snapshot.forEach(doc => {
      const listing = { id: doc.id, ...doc.data() };
      container.innerHTML += createListingCard(listing);
    });
    
  } catch (error) {
    console.error('Erreur chargement annonces:', error);
    container.innerHTML = `
      <div class="loading-spinner">
        <p>⚠️ Impossible de charger les annonces.</p>
        <p>Vérifiez votre connexion internet.</p>
      </div>
    `;
  }
}

// ============================================
// CRÉER UNE CARTE D'ANNONCE
// ============================================

function createListingCard(listing) {
  const badges = [];
  
  if (listing.ownerVerified) {
    badges.push('<span class="badge badge-verified">🟢 Propriétaire vérifié</span>');
  }
  
  if (listing.featured) {
    badges.push('<span class="badge badge-featured">⭐ En valeur</span>');
  }
  
  if (listing.propertyVerified) {
    badges.push('<span class="badge badge-property">✅ Bien vérifié</span>');
  }
  
  if (!listing.ownerVerified && !listing.propertyVerified) {
    badges.push('<span class="badge badge-warning">⚠️ Non certifié</span>');
  }
  
  const imageUrl = listing.images?.[0] || '/images/placeholder-house.jpg';
  
  return `
    <article class="listing-card" onclick="window.location.href='/listing.html?id=${listing.id}'">
      <img src="${imageUrl}" alt="${listing.title}" loading="lazy" onerror="this.src='/images/placeholder-house.jpg'">
      <div class="listing-info">
        <h3>${truncateText(listing.title, 60)}</h3>
        <div class="listing-meta">
          <span>📍 ${listing.city}, ${listing.region}</span>
          <span>🏠 ${listing.type || 'Non spécifié'}</span>
        </div>
        <div class="listing-price">
          ${formatPrice(listing.price)}
          <span>/mois</span>
        </div>
        <div class="badges">${badges.join('')}</div>
      </div>
    </article>
  `;
}

// ============================================
// PUBLIER UNE ANNONCE
// ============================================

export async function publishListing(userId, listingData, images) {
  try {
    // Upload des images
    const imageUrls = [];
    
    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(storage, `listings/${userId}/${Date.now()}_${i}.jpg`);
      await uploadBytes(imageRef, images[i]);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }
    
    // Créer l'annonce
    const listingData2 = {
      ...listingData,
      userId,
      images: imageUrls,
      status: 'active',
      ownerVerified: false, // Sera mis à jour après vérification
      featured: false,
      propertyVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      reports: 0
    };
    
    const docRef = await addDoc(collection(db, 'listings'), listingData2);
    
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('Erreur publication:', error);
    throw new Error('Impossible de publier l\'annonce: ' + error.message);
  }
}

// ============================================
// RECHERCHER DES ANNONCES
// ============================================

export async function searchListings(filters) {
  try {
    let q = collection(db, 'listings');
    const constraints = [where('status', '==', 'active')];
    
    if (filters.region) {
      constraints.push(where('region', '==', filters.region));
    }
    
    if (filters.maxPrice) {
      constraints.push(where('price', '<=', parseInt(filters.maxPrice)));
    }
    
    constraints.push(orderBy('price'));
    constraints.push(limit(50));
    
    const finalQuery = query(q, ...constraints);
    const snapshot = await getDocs(finalQuery);
    
    let listings = [];
    snapshot.forEach(doc => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    
    // Filtres côté client (car Firestore limites)
    if (filters.city) {
      listings = listings.filter(l => 
        l.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.type) {
      listings = listings.filter(l => l.type === filters.type);
    }
    
    return listings;
    
  } catch (error) {
    console.error('Erreur recherche:', error);
    return [];
  }
}