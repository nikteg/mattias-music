import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/', // Default base path for development
    define: {
      // Default value for development
      __BUILD_DATE__: JSON.stringify('dev') 
    }
  }

  if (command === 'build') {
    // Apply base path only for build (production/gh-pages)
    config.base = '/mattias-music/' 
    // Set build-specific date
    config.define = {
      ...config.define,
      __BUILD_DATE__: JSON.stringify(new Date().toISOString())
    };
  }

  return config
})
