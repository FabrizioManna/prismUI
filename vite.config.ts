import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { globSync, readFileSync } from 'node:fs';

/** One entry per component (`src/components/<name>/define.ts`), plus the all-in and core entries. */
const componentEntries = Object.fromEntries(
  globSync('src/components/*/define.ts').map((file) => [file.slice('src/'.length, -'.ts'.length), file]),
);

/** Publishes the light-DOM token stylesheet as `dist/tokens/prism-tokens.css` (the only public CSS). */
function prismTokens(): Plugin {
  return {
    name: 'prism-tokens',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'tokens/prism-tokens.css',
        source: readFileSync('src/tokens/prism-tokens.css', 'utf8'),
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), prismTokens()],
  build: {
    target: 'es2022',
    lib: {
      entry: { index: 'src/index.ts', 'core/index': 'src/core/index.ts', ...componentEntries },
      formats: ['es'],
    },
    rolldownOptions: {
      external: [/^lit($|\/)/, /^@lit\//, /^@lit-labs\//, /^@floating-ui\//, /^lucide-static/],
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
    minify: false,
    sourcemap: true,
  },
});
