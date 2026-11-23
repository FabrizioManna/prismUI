import { describe, expect, it } from 'vitest';

const read = (name: string, el: Element = document.documentElement) =>
  getComputedStyle(el).getPropertyValue(name).trim();

describe('prism-tokens.css', () => {
  it('text-bearing glass surfaces are opaque >= 85% in light', () => {
    for (let i = 0; i <= 4; i++)
      expect(Number(read(`--prism-glass-surface-solid-${i}-alpha`))).toBeGreaterThanOrEqual(0.85);
  });

  it('text-bearing glass surfaces are opaque >= 90% in dark, via .dark and the [data-theme="dark"] alias', () => {
    for (const apply of [
      () => document.documentElement.classList.add('dark'),
      () => document.documentElement.setAttribute('data-theme', 'dark'),
    ]) {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
      apply();
      for (let i = 0; i <= 4; i++)
        expect(Number(read(`--prism-glass-surface-solid-${i}-alpha`))).toBeGreaterThanOrEqual(0.9);
      expect(read('color-scheme')).toBe('dark');
    }
  });

  it('focus ring: inner white, outer black, 2px', () => {
    expect(read('--prism-focus-ring-inner').toLowerCase()).toBe('#ffffff');
    expect(read('--prism-focus-ring-outer').toLowerCase()).toBe('#000000');
    expect(read('--prism-focus-ring-width')).toBe('2px');
  });

  it('declares dedicated control borders and breakpoints', () => {
    expect(read('--prism-control-border')).not.toBe('');
    expect(['640px', '768px', '1024px', '1280px', '1536px']).toEqual(
      ['sm', 'md', 'lg', 'xl', '2xl'].map((bp) => read(`--prism-bp-${bp}`)),
    );
  });

  it('control height is 44px on touch and 32/40/48px with a fine pointer (mobile first)', () => {
    const fine = matchMedia('(pointer: fine)').matches;
    expect(read('--prism-control-height-md')).toBe(fine ? '40px' : '44px');
    expect(read('--prism-control-height-sm')).toBe(fine ? '32px' : '44px');
    expect(read('--prism-control-height-lg')).toBe('48px');
  });

  it('data-prism-transparency="reduced" switches text surfaces to opaque fallbacks', () => {
    document.documentElement.setAttribute('data-prism-transparency', 'reduced');
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--prism-glass-surface-solid-1)';
    document.body.append(probe);
    const opaque = document.createElement('div');
    opaque.style.backgroundColor = 'var(--prism-surface-opaque-1)';
    document.body.append(opaque);
    expect(getComputedStyle(probe).backgroundColor).toBe(getComputedStyle(opaque).backgroundColor);
    probe.remove();
    opaque.remove();
  });
});
