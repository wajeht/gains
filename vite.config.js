import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import purgecss from '@fullhuman/postcss-purgecss';

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
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src/vue'),
      '@utils': path.resolve(process.cwd(), 'src/utils'),
    },
  },
  root: './src/vue',
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
          content: [`./public/**/*.html`, `./src/vue/**/*.vue`],
          safelist: [/tooltip/, /placeholder-/, /tooltip-inner/, /modal/, /alert/, /alert-(\w+)/],
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
