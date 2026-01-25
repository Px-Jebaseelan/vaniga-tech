import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core libraries
          if (id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // Animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          // Charts and visualization
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // i18n
          if (id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
        },
      },
    },
  },
})
