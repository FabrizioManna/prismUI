import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PrismUI',
      fileName: (format) => `prismui.${format}.js`
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'lit'
        }
      }
    }
  },
  plugins: [dts()]
});
