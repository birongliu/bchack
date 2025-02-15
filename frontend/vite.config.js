import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    https: { cert: "./ssl-certificates/localhost+2.pem", key: "./ssl-certificates/localhost+2-key.pem" },
  },
  plugins: [react(), tailwindcss()],
});
