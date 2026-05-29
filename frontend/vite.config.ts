import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    cors: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "*.ngrok-free.dev",
      "*.ngrok.dev",
      "*.railway.app",
      "duplicity-pyramid-resident.ngrok-free.dev"
    ],
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "*.ngrok-free.dev",
      "*.ngrok.dev",
      "*.railway.app",
      "duplicity-pyramid-resident.ngrok-free.dev"
    ]
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser"
  }
});
