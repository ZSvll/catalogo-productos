// src/services/uploadService.js
// Servicio para subir imágenes a Cloudinary usando un "unsigned upload preset".
// No requiere SDK adicional: usamos la API REST de Cloudinary con fetch().

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Sube un archivo de imagen a Cloudinary.
 * @param {File} file - El archivo de imagen seleccionado por el usuario (input type="file")
 * @returns {Promise<string>} - La URL pública de la imagen subida
 */
export async function uploadImage(file) {
  // FormData es el formato requerido por la API de Cloudinary para subir archivos
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al subir imagen: ${response.status}`);
    }

    const data = await response.json();
    // secure_url es la URL https de la imagen ya optimizada por Cloudinary
    return data.secure_url;
  } catch (error) {
    console.error('Error en uploadImage:', error);
    throw error; // Re-lanzamos para que quien llame decida cómo manejarlo (ej. mostrar mensaje en UI)
  }
}

/**
 * Sube múltiples imágenes en paralelo.
 * @param {File[]} files - Array de archivos
 * @returns {Promise<string[]>} - Array de URLs públicas
 */
export async function uploadMultipleImages(files) {
  const uploadPromises = Array.from(files).map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
}