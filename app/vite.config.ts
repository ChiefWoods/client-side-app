import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      plugins: [inject({
        Buffer: ['buffer', 'Buffer']
      })],
    },
  }
})
