import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import dotenv from 'dotenv';
import eslint from 'vite-plugin-eslint';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import purgecss from '@fullhuman/postcss-purgecss';

// assets will generate styles.XXXXX.css for production
// and style.css for dev. we have to do this because of cloud flare cache
// typically we do this via /styles.css?ver=1.2, and incrementing version every time
const rollupOptions = {};
if (process.env.ENV === 'dev' || process.env.ENV === 'development') {
  rollupOptions.output = {
    entryFileNames: 'assets/[name].js',
    chunkFileNames: 'assets/[name].js',
    assetFileNames: 'assets/[name][extname]',
  };
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.VUE_PORT,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  plugins: [eslint(), vue()],
  resolve: {
    alias: {
      '@': './src/app/ui',
    },
  },
  root: './src/app/ui',
  build: {
    outDir: '../../public',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1600,
    emptyOutDir: false,
    rollupOptions,
  },
  define: {
    'process.env': process.env,
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `
          @import "@/assets/sass/main.scss";
        `,
      },
    },
    postcss: {
      plugins: [
        purgecss({
          content: [`./src/public/**/*.html`, `./src/app/ui/**/*.vue`],
          safelist: [/tooltip/, /placeholder-/, /tooltip-inner/, /modal/, /alert/, /alert-(\w+)/], // purgecss remove modal backdrop, this fixed it
        }),
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
