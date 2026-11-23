import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { BREAKPOINTS } from './breakpoints.js';

/** The three copies of the breakpoint scale must match --prism-bp-* (architecture.md P.1). */
describe('breakpoints', () => {
  const tokens = readFileSync('src/tokens/prism-tokens.css', 'utf8');
  const theme = readFileSync('src/styles/theme.css', 'utf8');
  for (const [name, px] of Object.entries(BREAKPOINTS)) {
    it(`${name} = ${px}px in tokens, theme.css and breakpoints.ts`, () => {
      expect(tokens).toContain(`--prism-bp-${name}: ${px}px;`);
      expect(theme).toContain(`--breakpoint-${name}: ${px}px;`);
    });
  }
});
