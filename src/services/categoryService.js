import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig.js';

const CATEGORIES_COLLECTION = 'categories';

/**
 * Obtiene todas las categorías ordenadas por nombre.
 * @returns {Promise<Array<{id: string, name: string, slug: string}>>}
 */
export async function getCategories() {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const q = query(categoriesRef, orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}