import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// IMPORTANT: base must match your GitHub repo name for GitHub Pages to work.
// e.g. if your repo is github.com/yourname/inventory-sync-dashboard
// then base should be '/inventory-sync-dashboard/'
export default defineConfig({
  base: '/inventory-sync-dashboard/',
  plugins: [react(), tailwindcss()],
})
