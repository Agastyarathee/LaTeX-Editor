import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // Accept connections from outside the container
    port: 5173,           // Default Vite port
    strictPort: true      // Fail if port is taken instead of auto-incrementing
  }
})

