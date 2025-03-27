import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access via local IP
    port: 5173, // You can change this port if needed
  },
  build: {
    chunkSizeWarningLimit: 50000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern", // Explicitly use the modern API
      },
    },
  },
});
