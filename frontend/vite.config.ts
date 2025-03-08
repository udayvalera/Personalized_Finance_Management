import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import MillionLint from "@million/lint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    MillionLint.vite()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
