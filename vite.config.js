import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind diletakkan sebagai plugin Vite utama
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler'] // React compiler diletakkan di dalam Babel
        ],
      },
    }),
  ],
})