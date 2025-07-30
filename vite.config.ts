import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.svg'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks próprios
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'calendar-vendor': ['@fullcalendar/react', '@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/interaction'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          'charts-vendor': ['recharts'],
          'utils-vendor': ['date-fns', 'dexie', 'tippy.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Desabilitar sourcemaps em produção para melhor performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log em produção
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@fullcalendar/react',
      '@fullcalendar/core',
      'date-fns',
      'dexie'
    ]
  }
})
