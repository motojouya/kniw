import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/pages',
  plugins: [react(), tsconfigPaths()],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist_react'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        '': resolve(__dirname, 'src/pages/index.html'),
        'party': resolve(__dirname, 'src/pages/party/index.html'),
        'battle': resolve(__dirname, 'src/pages/battle/index.html')
      },
      output: {
        entryFileNames: `assets/[name]/bundle.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === '.css') {
            return 'assets/index.css'
          }
          return `assets/[name].[ext]`
        },
        chunkFileNames: `assets/[name].js`,
      }
    }
  },
  server: {
    port: 3000,
  },
})
