import path from 'path';
import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import eslintPlugin from 'vite-plugin-eslint2';

export default defineConfig({
  root: './test',
  plugins: [
    eslintPlugin({
      include: ['src/**/*.{js,jsx,ts,tsx}', 'test/**/*.{js,jsx,ts,tsx}'],
    }),
    reactPlugin(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
  hmr: {
    overlay: {
      warnings: false, // 关闭警告覆盖
      errors: true, // 保留错误覆盖
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
