/**
 * Document-level styles that cannot live inside a shadow root.
 *
 * Tailwind v4 registers internal variables with `@property`, and `@property` has no effect inside shadow
 * roots (tailwindcss#15005). Component stylesheets are scanned once per class and their `@property` rules
 * are hoisted into a single sheet adopted by the document (architecture.md §4.4).
 *
 * Note: architecture.md proposes a build-time Vite plugin; this runtime hoisting is the F0 implementation
 * (deterministic, no build coupling). Revisit if bundle size or CSP requires the build-time variant.
 */
const PROPERTY_RULE = /@property\s+--[\w-]+\s*\{[^}]*\}/g;

const hoisted = new Set<string>();
let sheet: CSSStyleSheet | undefined;

function documentSheet(): CSSStyleSheet | undefined {
  if (typeof document === 'undefined' || typeof CSSStyleSheet === 'undefined') return undefined;
  if (!sheet) {
    sheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
  return sheet;
}

/** Extracts `@property` rules from CSS text and registers them once on the document. */
export function hoistPropertyRules(cssText: string): number {
  const rules = cssText.match(PROPERTY_RULE) ?? [];
  const fresh = rules.filter((rule) => !hoisted.has(rule));
  if (fresh.length === 0) return 0;
  const target = documentSheet();
  if (!target) return 0;
  for (const rule of fresh) {
    hoisted.add(rule);
    target.insertRule(rule, target.cssRules.length);
  }
  return fresh.length;
}

/** Number of `@property` rules hoisted so far (diagnostics and tests). */
export function hoistedPropertyCount(): number {
  return hoisted.size;
}
