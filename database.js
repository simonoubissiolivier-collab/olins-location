const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Base de données connectée avec succès');
  } catch (err) {
    console.error('❌ Erreur connexion DB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
