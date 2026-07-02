// Servicio de acceso a la colección "products" en Firestore.
// Se irá ampliando en los módulos 5 y 13 (catálogo y CRUD admin).
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig.js';
import { getCached } from '../utils/cache.js';
import { invalidateCache } from '../utils/cache.js';

const PRODUCTS_COLLECTION = 'products';

/**
 * Obtiene productos marcados como destacados y activos.
 * @param {number} maxResults
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts(maxResults = 8) {
  return getCached(`featured-products-${maxResults}`, async () => {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('featured', '==', true),
      where('active', '==', true),
      limit(maxResults)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  });
}


/**
 * Obtiene un único producto por su ID de documento.
 * @param {string} id
 */
export async function getProductById(id) {
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    throw new Error('Producto no encontrado');
  }

  return { id: snapshot.id, ...snapshot.data() };
}

// Agregar estos imports a los que ya existen en productService.js
import { orderBy, startAfter } from 'firebase/firestore';

const PAGE_SIZE = 12;

/**
 * Obtiene una página de productos activos, ordenados por fecha de creación descendente.
 * @param {object|null} lastDoc - el último documento de la página anterior (para paginación), o null para la primera página
 * @returns {Promise<{products: Array, lastVisible: object|null, hasMore: boolean}>}
 */
export async function getProductsPaginated(lastDoc = null) {
  const productsRef = collection(db, PRODUCTS_COLLECTION);

  const constraints = [
    where('active', '==', true),
    orderBy('createdAt', 'desc'),
    limit(PAGE_SIZE),
  ];

  if (lastDoc) {
    constraints.splice(2, 0, startAfter(lastDoc));
  }

  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);

  const products = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  return {
    products,
    lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === PAGE_SIZE,
  };
}

/**
 * Obtiene TODOS los productos activos para filtrado client-side.
 * Usar solo cuando el catálogo es de tamaño manejable (<= ~500 productos).
 * @returns {Promise<Array>}
 */
export async function getAllActiveProducts() {
  return getCached('all-active-products', async () => {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  });
}
// Crea un nuevo producto en Firestore.
export async function createProduct(data) {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const docRef = await addDoc(productsRef, {
    ...data,
    active: true,
    featured: false,
    createdAt: serverTimestamp(),
  });
  invalidateCache('all-active-products');
  invalidateCache('featured-products-8');
  return docRef.id;
}

// Actualiza un producto existente.
export async function updateProduct(id, data) {
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(productRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  invalidateCache('all-active-products');
  invalidateCache('featured-products-8');
}

// Elimina un producto permanentemente.
export async function deleteProduct(id) {
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(productRef);
  invalidateCache('all-active-products');
  invalidateCache('featured-products-8');
}

// Obtiene TODOS los productos (activos e inactivos) para el panel admin.

export async function getAllProductsAdmin() {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}