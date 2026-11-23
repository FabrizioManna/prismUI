/**
 * Theme helpers. The dark theme is the `.dark` class (visual-tokens.md), with `[data-theme="dark"]` as alias.
 * Themes can be applied to any subtree: tokens are redefined on the ancestor and inherited by shadow roots.
 */
export type PrismTheme = 'light' | 'dark';

export function setTheme(theme: PrismTheme, root: HTMLElement = document.documentElement): void {
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
}

export function getTheme(root: HTMLElement = document.documentElement): PrismTheme {
  return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Manual switch for reduced transparency (same effect as `prefers-reduced-transparency: reduce`). */
export function setReducedTransparency(reduced: boolean, root: HTMLElement = document.documentElement): void {
  if (reduced) root.setAttribute('data-prism-transparency', 'reduced');
  else root.removeAttribute('data-prism-transparency');
}
