require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://toledo:123@mongo:27017/TallerMilca?authSource=admin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
})
.then(() => console.log('Conectado a MongoDB - Base de datos'))
.catch(e => console.error('Error conexión MongoDB:', e));

module.exports = mongoose;
