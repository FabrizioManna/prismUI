import { en, type PrismStringKey, type PrismStrings } from './en.js';
import { it } from './it.js';

/**
 * Global string dictionaries (ux-spec.md §1.8). Lookup by full locale, then language, then `en`.
 * Component-level overrides go through each component's `strings` property.
 */
const dictionaries = new Map<string, Partial<PrismStrings>>([
  ['en', en],
  ['it', it],
]);
const listeners = new Set<() => void>();

export const PrismI18n = {
  set(locale: string, dict: Partial<PrismStrings>): void {
    const key = locale.toLowerCase();
    dictionaries.set(key, { ...dictionaries.get(key), ...dict });
    listeners.forEach((l) => l());
  },
  get(locale: string): PrismStrings {
    const lc = locale.toLowerCase();
    const lang = lc.split('-')[0] ?? 'en';
    return { ...en, ...dictionaries.get(lang), ...dictionaries.get(lc) };
  },
  /** Subscribes to dictionary changes. @returns unsubscribe */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/**
 * Formats `{name}` placeholders and a minimal ICU plural (`{count, plural, one {…} other {…}}`, `#` = count).
 */
export function formatString(template: string, values: Record<string, string | number> = {}, locale = 'en'): string {
  const plural = template.replace(/\{(\w+), plural, ((?:\w+ \{[^}]*\}\s*)+)\}/g, (_m, name: string, cases: string) => {
    const n = Number(values[name] ?? 0);
    const map = Object.fromEntries([...cases.matchAll(/(\w+) \{([^}]*)\}/g)].map((c) => [c[1], c[2]]));
    const cat = new Intl.PluralRules(locale).select(n);
    return (map[cat] ?? map['other'] ?? '').replace(/#/g, String(n));
  });
  return plural.replace(/\{(\w+)\}/g, (m, name: string) => (name in values ? String(values[name]) : m));
}

export type { PrismStrings, PrismStringKey };
