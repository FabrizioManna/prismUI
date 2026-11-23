import { afterEach, describe, expect, it } from 'vitest';
import { commands } from 'vitest/browser';
import '../../test/commands/emulate-media.js';
import { getResolvedTheme, getTheme, setTheme } from './theme.js';

describe('theme helpers', () => {
  afterEach(async () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    await commands.emulateMedia({ colorScheme: null });
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
    await commands.emulateMedia({ colorScheme: 'dark' });
    // Media emulation reaches the page asynchronously in Firefox/WebKit.
    await expect.poll(() => getResolvedTheme()).toBe('dark');
    await expect.poll(() => getComputedStyle(document.documentElement).colorScheme).toBe('dark');
  });
});
