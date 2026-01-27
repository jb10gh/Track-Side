import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Sideline Stats Pro',
        short_name: 'Sideline Stats',
        theme_color: '#1e40af',
        background_color: '#0f172a',
        display: 'standalone'
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          state: ['zustand'],
          gestures: ['@use-gesture/react'],
          router: ['react-router-dom'],
          'theme-core': ['src/theme/theme-config.ts'],
          'theme-hooks': ['src/theme/useTheme.ts'],
          'theme-utils': ['src/theme/theme-utils.ts']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash].css';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: ['@use-gesture/react']
  },
  define: {
    __DEV__: JSON.stringify(false),
    __PROD__: JSON.stringify(true),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  server: {
    hmr: false
  },
  preview: {
    port: 4173,
    strictPort: true
  }
});
