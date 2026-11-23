import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import { getResolvedTheme, getTheme, setTheme } from './theme.js';

describe('theme helpers', () => {
  afterEach(async () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    await cdp().send('Emulation.setEmulatedMedia', { features: [] });
  });

  it('setTheme sets the class and the data-theme alias', () => {
    setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(getTheme()).toBe('dark');
    setTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(getTheme()).toBe('light');
  });

  it("'auto' follows prefers-color-scheme", async () => {
    setTheme('auto');
    expect(getTheme()).toBe('auto');
    await cdp().send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
    expect(getResolvedTheme()).toBe('dark');
    expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');
  });
});
