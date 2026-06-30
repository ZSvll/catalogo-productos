import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catalogo: resolve(__dirname, 'catalogo.html'),
        producto: resolve(__dirname, 'producto.html'),
        faq: resolve(__dirname, 'faq.html'),
        acerca: resolve(__dirname, 'acerca.html'),
        privacidad: resolve(__dirname, 'privacidad.html'),
        terminos: resolve(__dirname, 'terminos.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});