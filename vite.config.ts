import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/MEGAFinance/', // اسم المستودع كما يظهر على GitHub
});
