import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __APP_NAME__: JSON.stringify('Routini'),
        __APP_REPOSITORY__: JSON.stringify('https://github.com/elissoncardoso1/routini')
    },
    assetsInclude: ['**/*.svg'],
    base: './', // Importante para Electron - usar caminhos relativos
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
        sourcemap: true, // Habilitar sourcemaps para debug no Windows
        minify: 'esbuild', // Usar esbuild para melhor compatibilidade com desktop
        target: 'esnext', // Usar target moderno para melhor performance
        // Configurações específicas para Windows
        cssCodeSplit: true,
        reportCompressedSize: false, // Desabilitar para melhor performance
        emptyOutDir: true
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
        ],
        // Configurações específicas para Windows
        force: false,
        esbuildOptions: {
            target: 'esnext'
        }
    },
    // Configurações específicas para desenvolvimento
    server: {
        port: 5173,
        strictPort: true,
        host: true
    }
});
