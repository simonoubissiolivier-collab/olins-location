/**
 * OLINS Locations Cameroun
 * Configuration : Horodatage & Géolocalisation
 */

// 📅 HORODATAGE AUTOMATIQUE
export const horodatage = {
  actif: true,
  format: 'le DD/MM/YYYY à HH:mm',
  getMaintenant: () => {
    const now = new Date();
    return now.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
};

// 📍 GÉOLOCALISATION & QUARTIERS
export const localisation = {
  actif: true,
  precision: 'elevee',
  quartierParVille: {
    "Yaoundé": [
      "Mvan", "Nkol-Eton", "Ekounou", "Biyem-Assi", "Messa", "Ngousso",
      "Nkolbisson", "Odza", "Elig-Essono", "Awae", "Mimboman", "Nkolafamba",
      "Bastos", "Hyppodrome", "Nlongkak", "Nkoul", "Etoa-Meki", "Nkong-Zem",
      "Olembe", "Briqueterie", "Mfandena", "Nkondengui", "Nkol-Mintom", "Mvog-Ada"
      // + ajouter tous les quartiers jusqu'à plus de 200
    ],
    "Douala": [
      "Akwa", "Bonanjo", "Bali", "Deido", "New Bell", "Kotto", "Bonaberi",
      "Douala-Centre", "Makepe", "Nkomba", "Bepanda", "Mbanga", "Tiko",
      "Bonamoussadi", "Logbaba", "Ndogpassi", "Yassa", "Bonapriso", "Rue des Princes"
      // + ajouter tous les quartiers jusqu'à plus de 200
    ]
    // Ajouter les autres villes
  },

  // Suggestion de quartiers selon la ville sélectionnée
  suggérerQuartiers: (ville) => {
    return localisation.quartierParVille[ville] || [];
  },

  // Récupérer la position GPS
  getPosition: () => {
    return new Promise((res, rej) => {
      if (!navigator.geolocation) rej("Géolocalisation non supportée");
      else navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true });
    });
  }
};

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  const villeSelect = document.getElementById('searchCity');
  const quartierList = document.getElementById('quartiersList');
  
  villeSelect.addEventListener('change', (e) => {
    quartierList.innerHTML = '';
    const quartiers = localisation.suggérerQuartiers(e.target.value);
    quartiers.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q;
      quartierList.appendChild(opt);
    });
  });
});
