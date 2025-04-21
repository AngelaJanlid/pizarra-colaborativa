import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api' : {       // Prefijo que usarás en las peticiones
        target: 'http://localhost:3000',  // URL de tu backend (NestJS)
        changeOrigin: true,     // Necesario para CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina /api al enviar al backend
        secure: false,  // Opcional: para desarrollo con HTTPS autofirmado
      }
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "../assets/scss/_variables.scss";` // Carga global
      }
    }
  },

});
