<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Résultats de recherche - OLINS Locations Cameroun</title>
  <meta name="description" content="Résultats de recherche de logements sur OLINS Locations Cameroun.">
  <link rel="stylesheet" href="style.css">
  <link rel="manifest" href="manifest.json">
  <style>
    .results-page {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1.25rem;
    }
    .results-page h1 {
      color: #0A4D3C;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .results-page .filters-summary {
      color: #636E72;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #F5F7FA;
      border-radius: 8px;
    }
    .results-page .filters-summary strong {
      color: #0A4D3C;
    }
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #636E72;
    }
    .no-results .btn-back {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.6rem 1.5rem;
      background: #0A4D3C;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
    .no-results .btn-back:hover {
      background: #063A2C;
    }
    .loading-results {
      text-align: center;
      padding: 3rem;
      color: #636E72;
      grid-column: 1 / -1;
    }
    .back-link {
      display: inline-block;
      margin-top: 2rem;
      color: #0A4D3C;
      font-weight: 600;
      text-decoration: none;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .results-page h1 {
        font-size: 1.4rem;
      }
      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <nav class="nav">
      <a href="index.html" class="logo">
        <span class="logo-main">OLINS</span>
        <span class="logo-sub">Locations Cameroun</span>
      </a>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links" id="navLinks">
        <a href="index.html">Accueil</a>
        <a href="comment-ca-marche.html">Comment ça marche</a>
        <a href="aide-contact.html">Aide & Contact</a>
        <a href="#" id="loginBtn" class="btn-outline">Connexion</a>
        <a href="#" id="registerBtn" class="btn-primary">S'inscrire</a>
      </div>
    </nav>
  </header>

  <main class="results-page">
    <h1>Résultats de recherche</h1>
    <div class="filters-summary" id="filtersSummary">
      <span>Filtres appliqués : </span>
      <span id="filterTags">Aucun filtre</span>
    </div>

    <div class="results-grid" id="resultsContainer">
      <div class="loading-results">Chargement des annonces...</div>
    </div>

    <p style="text-align: center; margin-top: 2.5rem;">
      <a href="index.html" class="back-link">← Retour à l'accueil</a>
    </p>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo-footer">OLINS <span>Locations Cameroun</span></div>
          <p>La confiance avant tout.</p>
          <p class="footer-warning"> Ne partagez jamais votre code secret Mobile Money</p>
        </div>
        <div class="footer-links">
          <h4>Navigation</h4>
          <a href="index.html">Accueil</a>
          <a href="comment-ca-marche.html">Comment ça marche</a>
          <a href="aide-contact.html">Aide & Contact</a>
        </div>
        <div class="footer-links">
          <h4>Légal</h4>
          <a href="mentions-legales.html">Mentions légales</a>
          <a href="confidentialite.html">Confidentialité</a>
        </div>
        <div class="footer-contact">
          <h4>Contact</h4>
          <p>+237 699 215 639</p>
          <p>contact@olins.cm</p>
          <p>Douala / Yaoundé, Cameroun</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 OLINS Locations Cameroun - Tous droits réservés.</p>
      </div>
    </div>
  </footer>

  <script type="module">
    import { searchListings } from './listings.js';
    import { formatPrice, truncateText } from './utils.js';

    // Récupérer les paramètres de l'URL
    const params = new URLSearchParams(window.location.search);
    const region = params.get('region') || '';
    const city = params.get('city') || '';
    const type = params.get('type') || '';
    const maxPrice = params.get('maxPrice') || '';

    // Afficher les filtres
    const filters = {};
    if (region) filters.region = region;
    if (city) filters.city = city;
    if (type) filters.type = type;
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);

    const filterTags = document.getElementById('filterTags');
    const tags = [];
    if (region) tags.push('Région : ' + region);
    if (city) tags.push('Ville : ' + city);
    if (type) tags.push('Type : ' + type);
    if (maxPrice) tags.push('Budget : ' + parseInt(maxPrice).toLocaleString() + ' FCFA');
    filterTags.textContent = tags.length > 0 ? tags.join(' | ') : 'Aucun filtre';

    // Charger les résultats
    const container = document.getElementById('resultsContainer');

    async function loadResults() {
      try {
        const results = await searchListings(filters);

        if (results.length === 0) {
          container.innerHTML = `
            <div class="no-results">
              <p>Aucun logement ne correspond à vos critères.</p>
              <p style="font-size: 0.9rem; color: #636E72;">Essayez d'autres filtres ou retirez certains critères.</p>
              <a href="index.html" class="btn-back">Modifier la recherche</a>
            </div>
          `;
          return;
        }

        container.innerHTML = results.map(listing => createCard(listing)).join('');

      } catch (error) {
        console.error('Erreur chargement résultats:', error);
        container.innerHTML = `
          <div class="no-results">
            <p>Une erreur est survenue lors du chargement des résultats.</p>
            <p style="font-size: 0.9rem; color: #636E72;">Veuillez réessayer plus tard.</p>
            <a href="index.html" class="btn-back">Retour à l'accueil</a>
          </div>
        `;
      }
    }

    function createCard(listing) {
      const imageUrl = listing.images?.[0] || 'images/placeholder-house.jpg';

      let badgesHtml = '';
      if (listing.ownerVerified) {
        badgesHtml += '<span class="badge badge-verified">Propriétaire vérifié</span>';
      }
      if (listing.featured) {
        badgesHtml += '<span class="badge badge-featured">En valeur</span>';
      }

      return `
        <article class="listing-card" onclick="window.location.href='listing.html?id=${listing.id}'">
          <img src="${imageUrl}" alt="${listing.title || 'Logement'}" loading="lazy" onerror="this.src='images/placeholder-house.jpg'">
          <div class="listing-info">
            <h3>${truncateText(listing.title || 'Logement', 60)}</h3>
            <div class="listing-meta">
              <span>${listing.city || ''}, ${listing.region || ''}</span>
              <span>${listing.type || ''}</span>
            </div>
            <div class="listing-price">
              ${formatPrice(listing.price)}
              <span>/mois</span>
            </div>
            ${badgesHtml ? '<div class="badges">' + badgesHtml + '</div>' : ''}
          </div>
        </article>
      `;
    }

    loadResults();
  </script>

  <script>
    // Menu mobile
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('navLinks');
    if (btn && nav) {
      btn.addEventListener('click', function() {
        nav.classList.toggle('active');
      });
    }

    // Correction des liens "Accueil"
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('a[href="/"]').forEach(function(link) {
        link.setAttribute('href', 'index.html');
      });
      document.querySelectorAll('a[href="/index.html"]').forEach(function(link) {
        link.setAttribute('href', 'index.html');
      });
    });
  </script>
</body>
</html>
