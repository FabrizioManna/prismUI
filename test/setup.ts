// Global setup for the browser test project: load the light-DOM tokens like a consumer would.
import '../src/tokens/prism-tokens.css';
import { afterEach } from 'vitest';
import { cleanupFixtures } from './helpers/fixture.js';

// Themed page backdrop (solid, so axe can compute contrast), like a consumer page would set.
const page = document.createElement('style');
page.textContent = `html { background: var(--prism-color-bg-start); color: var(--prism-color-text-primary); }`;
document.head.append(page);

afterEach(() => {
  cleanupFixtures();
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-prism-transparency');
});
