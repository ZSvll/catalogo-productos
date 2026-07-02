// Servicio centralizado de autenticación.
// Todos los módulos que necesiten saber si hay sesión importan desde aquí.

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from './firebaseConfig.js';

/**
 * Inicia sesión con email y contraseña.
 * Usa persistencia LOCAL: la sesión sobrevive al cerrar el navegador.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export async function login(email, password) {
  await setPersistence(auth, browserLocalPersistence);
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Cierra la sesión actual.
 */
export async function logout() {
  return signOut(auth);
}

/**
 * Devuelve una promesa que resuelve con el usuario actual
 * una vez que Firebase termina de restaurar la sesión.
 * Más confiable que auth.currentUser directamente.
 * @returns {Promise<User|null>}
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Deja de escuchar después del primer valor
      resolve(user);
    });
  });
}

/**
 * Observer continuo de sesión.
 * Útil para el panel admin: reacciona si la sesión expira mientras estás trabajando.
 * @param {Function} callback - recibe (user) donde user es null si no hay sesión
 * @returns {Function} unsubscribe — llámalo para dejar de escuchar
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}