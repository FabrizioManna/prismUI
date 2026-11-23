import { afterEach, describe, expect, it } from 'vitest';
import { commands } from 'vitest/browser';
import '../../test/commands/emulate-media.js';
import { PrismElement } from '../core/prism-element.js';

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

  describe('themes', () => {
    afterEach(async () => {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
      document.body.replaceChildren();
      await commands.emulateMedia({ colorScheme: null });
    });

    const probe = (attrs: Record<string, string>, parent: Element = document.body) => {
      const el = document.createElement('div');
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      parent.append(el);
      return el;
    };

    it('[data-theme="light"] restores light values inside a dark page', () => {
      const lightText = read('--prism-color-text-primary');
      document.documentElement.classList.add('dark');
      const darkText = read('--prism-color-text-primary');
      const light = probe({ 'data-theme': 'light' });
      expect(darkText).not.toBe(lightText);
      expect(read('--prism-color-text-primary', light)).toBe(lightText);
      expect(read('color-scheme', light)).toBe('light');
    });

    it('[data-theme="auto"] follows prefers-color-scheme', async () => {
      const auto = probe({ 'data-theme': 'auto' });
      await commands.emulateMedia({ colorScheme: 'light' });
      await expect.poll(() => read('color-scheme', auto)).toBe('light');
      await commands.emulateMedia({ colorScheme: 'dark' });
      await expect.poll(() => read('color-scheme', auto)).toBe('dark');
      const dark = probe({ 'data-theme': 'dark' });
      expect(read('--prism-color-text-primary', auto)).toBe(read('--prism-color-text-primary', dark));
    });

    it('shadow roots adopt the forced-colors / contrast surface classes', () => {
      const css = (PrismElement.styles as unknown as { cssText?: string }[]).map((s) => s.cssText ?? '').join('');
      expect(css).toContain('.prism-glass');
      expect(css).toContain('forced-colors: active');
      expect(css).toContain('::selection');
    });
  });
});
