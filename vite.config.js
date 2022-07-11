import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
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
