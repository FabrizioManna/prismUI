import type { BrowserCommand } from 'vitest/node';

export interface EmulateMediaOptions {
  colorScheme?: 'light' | 'dark' | 'no-preference' | null;
  forcedColors?: 'active' | 'none' | null;
  contrast?: 'more' | 'no-preference' | null;
  reducedMotion?: 'reduce' | 'no-preference' | null;
}

/**
 * Cross-browser media emulation for browser tests (Playwright `page.emulateMedia`), used instead of the
 * Chromium-only CDP session. Pass `null` for a feature to reset it.
 */
export const emulateMedia: BrowserCommand<[EmulateMediaOptions]> = async (ctx, options) => {
  if (ctx.provider.name !== 'playwright') throw new Error('emulateMedia needs the Playwright provider');
  await (ctx as unknown as { page: { emulateMedia(o: EmulateMediaOptions): Promise<void> } }).page.emulateMedia(
    options,
  );
};

declare module 'vitest/browser' {
  interface BrowserCommands {
    emulateMedia: (options: EmulateMediaOptions) => Promise<void>;
  }
}
