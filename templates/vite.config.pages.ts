import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pages project repositories use /<repository>/; local development uses /.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: { port: 5187 },
});
