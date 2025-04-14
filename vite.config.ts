import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/', // Default base path for development
  }

  if (command === 'build') {
    // Apply base path only for build (production/gh-pages)
    config.base = '/mattias-music/' 
  }

  return config
})
