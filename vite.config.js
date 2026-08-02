import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 静态站点：构建产物在 dist/，可直接部署到 Vercel / Netlify / GitHub Pages。
export default defineConfig({
  plugins: [react()],
  base: './', // 相对路径 —— 方便部署到任意子路径
});
