#!/usr/bin/env node
/**
 * Style guard for component CSS (architecture.md §4.3, visual-tokens.md §0):
 * - no Tailwind `dark:` variants or `@custom-variant dark` inside shadow-DOM styles;
 * - no `.dark` / `[data-theme]` selectors in component CSS (theme lives in src/tokens only);
 * - no Tailwind arbitrary values (`-[...]`) in @apply;
 * - deprecated token `--prism-focus-ring-color` must not be used.
 */
import { globSync, readFileSync } from 'node:fs';

const files = globSync('src/**/*.css').filter((f) => !f.startsWith('src/tokens/'));
const rules = [
  { re: /(^|[\s"'`])dark:/m, msg: 'Tailwind `dark:` variant' },
  { re: /@custom-variant\s+dark\b/, msg: '`@custom-variant dark`' },
  { re: /(^|[\s,(])\.dark\b|\[data-theme/m, msg: 'theme selector in component CSS (use tokens)' },
  { re: /@apply[^;]*-\[[^\]]+\]/, msg: 'Tailwind arbitrary value in @apply' },
  { re: /--prism-focus-ring-color\b/, msg: 'removed token --prism-focus-ring-color' },
];

let errors = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const { re, msg } of rules) {
    if (re.test(text)) {
      console.error(`${file}: ${msg}`);
      errors++;
    }
  }
}
if (errors) {
  console.error(`lint-styles: ${errors} problem(s)`);
  process.exit(1);
}
console.log(`lint-styles: ${files.length} file(s) OK`);
