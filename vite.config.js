import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

const isDev = process.env.APP_ENV === 'dev' || process.env.APP_ENV === 'development';

const rollupOptions = {};
if (isDev) {
  rollupOptions.output = {
    entryFileNames: 'assets/[name].js',
    chunkFileNames: 'assets/[name].js',
    assetFileNames: 'assets/[name][extname]',
  };
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.APP_VUE_PORT,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.APP_PORT}`,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/uploads': {
        target: `http://localhost:${process.env.APP_PORT}`,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    !isDev && {
      name: 'umami-analytics',
      apply: 'build',
      transformIndexHtml: () => [
        {
          tag: 'script',
          injectTo: 'head',
          attrs: {
            defer: true,
            src: 'https://umami.jaw.dev/script.js',
            'data-website-id': '1cf21b1d-8b59-4fc0-b8fe-c0dab47e7e1e',
          },
        },
      ],
    },
  ],
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
    'process.env.BASE_URL': JSON.stringify('/'),
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `
          @import "@/assets/sass/main.scss";
        `,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
    postcss: {
      plugins: [
        purgeCSSPlugin({
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
