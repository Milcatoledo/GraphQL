import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
    server: {
      host: true,
      port: parseInt(
        (globalThis && globalThis.process && globalThis.process.env && globalThis.process.env.VITE_DEV_PORT)
          ? globalThis.process.env.VITE_DEV_PORT
          : (import.meta.env && import.meta.env.VITE_DEV_PORT) || '3000',
        10
      ),
      strictPort: true,
      watch: {
        usePolling: true
      }
  }
})