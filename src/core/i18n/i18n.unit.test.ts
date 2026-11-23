import { describe, expect, it } from 'vitest';
import { PrismI18n, formatString } from './i18n.js';

describe('PrismI18n', () => {
  it('falls back from locale to language to en', () => {
    expect(PrismI18n.get('it-IT').close).toBe('Chiudi');
    expect(PrismI18n.get('fr').close).toBe('Close');
  });

  it('accepts custom dictionaries', () => {
    PrismI18n.set('fr', { close: 'Fermer' });
    expect(PrismI18n.get('fr-CA').close).toBe('Fermer');
  });

  it('formats placeholders and plurals', () => {
    expect(formatString('Remove {label}', { label: 'Italy' })).toBe('Remove Italy');
    const t = '{count, plural, one {# option} other {# options}}';
    expect(formatString(t, { count: 1 })).toBe('1 option');
    expect(formatString(t, { count: 3 })).toBe('3 options');
  });
});
