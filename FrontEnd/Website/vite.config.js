import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: false, // Allow fallback to other ports if 5173 is busy
    proxy: {
      '/api': {
        target: 'https://pcbuilder.runasp.net',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
