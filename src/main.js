// src/main.js
import { db, auth } from './services/firebaseConfig.js';

console.log('Proyecto iniciado');
console.log('Firestore conectado:', db);
console.log('Auth conectado:', auth);
console.log('Cloud Name de Cloudinary:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);