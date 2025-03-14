import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: {
      overlay: true,
      protocol: 'ws',
      timeout: 30000,
      maxRetries: 3
    },
    host: 'localhost',
    watch: {
      usePolling: false,
      interval: 1000,
      binaryInterval: 3000
    }
  },
  preview: {
    port: 4173,
    host: 'localhost',
    strictPort: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'govuk-frontend': path.resolve(__dirname, './node_modules/govuk-frontend')
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules']
      }
    }
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      maxParallelFileOps: 3,
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff|woff2/.test(extType)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          'chart-vendor': ['recharts'],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'core-utils': ['lodash', 'decimal.js', 'date-fns'],
          'data-utils': ['@supabase/supabase-js', 'zod'],
          'ui-utils': ['clsx', 'tailwind-merge'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production'
      },
    },
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'i18next', 'lodash'],
    exclude: [],
  }
});