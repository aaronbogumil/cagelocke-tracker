import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },
  preview: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
  },
})