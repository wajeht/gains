import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  root: "./src/apps/ui",
  resolve: {
    alias: {
      "@": "./src/apps/ui",
    },
  },
  build: {
    outDir: "../../public",
    emptyOutDir: false,
  },
});
