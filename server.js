require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Initialisation
const app = express();
const PORT = process.env.PORT || 5000;

// SÉCURITÉ DE BASE
app.use(helmet()); // Protège contre attaques courantes
app.use(cors({ origin: '*' })); // Autorise ton site frontend
app.use(express.json({ limit: '10mb' })); // Accepte photos & données

// Limite les requêtes pour éviter piratage
const limite = rateLimit({
  windowMs: 15 * 60 * 1000, // 15min
  max: 100 // max 100 requêtes par IP
});
app.use(limite);

// Connexion Base de Données
connectDB();

// ROUTES
app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/annonces', require('./routes/annonces'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/paiements', require('./routes/paiements'));

// Page de test
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend OLINS fonctionne parfaitement ✅' });
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`Serveur OLINS démarré sur le port ${PORT}`);
});
