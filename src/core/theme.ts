/**
 * Theme helpers. The dark theme is the `.dark` class (visual-tokens.md), with `[data-theme="dark"]` as alias.
 * Themes can be applied to any subtree: tokens are redefined on the ancestor and inherited by shadow roots.
 */
export type PrismTheme = 'light' | 'dark' | 'auto';

/** Sets the theme of `root` (default `<html>`); `auto` follows `prefers-color-scheme` in CSS. */
export function setTheme(theme: PrismTheme, root: HTMLElement = document.documentElement): void {
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
}

/** Theme set on `root`: `'auto'` if it follows the system, otherwise `'dark'` or `'light'`. */
export function getTheme(root: HTMLElement = document.documentElement): PrismTheme {
  if (root.getAttribute('data-theme') === 'auto') return 'auto';
  return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Theme actually applied to `root`, resolving `auto` with `prefers-color-scheme`. */
export function getResolvedTheme(root: HTMLElement = document.documentElement): 'light' | 'dark' {
  const theme = getTheme(root);
  if (theme !== 'auto') return theme;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Manual switch for reduced transparency (same effect as `prefers-reduced-transparency: reduce`). */
export function setReducedTransparency(reduced: boolean, root: HTMLElement = document.documentElement): void {
  if (reduced) root.setAttribute('data-prism-transparency', 'reduced');
  else root.removeAttribute('data-prism-transparency');
}
