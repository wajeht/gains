import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default defineConfig({
  server: {
    port: process.env.VUE_PORT,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  plugins: [
    vue({
      // reactivityTransform: true, // to use .value on reactive values
    }),
  ],
  resolve: {
    alias: {
      '@': './src/apps/ui',
    },
  },
  root: './src/apps/ui',
  build: {
    outDir: '../../public',
    chunkSizeWarningLimit: 1600,
    emptyOutDir: false,
  },
  define: {
    'process.env': process.env,
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  },
});
