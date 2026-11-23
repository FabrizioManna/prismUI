import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import viteConfig from './vite.config';

/**
 * Browsers for the component project. Locally only Chromium is required; CI sets
 * PRISM_TEST_BROWSERS=chromium,firefox,webkit (architecture.md §9.3).
 */
const browsers = (process.env.PRISM_TEST_BROWSERS ?? 'chromium')
  .split(',')
  .map((b) => b.trim())
  .filter(Boolean) as ('chromium' | 'firefox' | 'webkit')[];

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.unit.test.ts', 'test/**/*.unit.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'browser',
            include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
            exclude: ['**/*.unit.test.ts', '**/node_modules/**'],
            setupFiles: ['./test/setup.ts'],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: browsers.map((browser) => ({ browser })),
            },
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: '.storybook' })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
      coverage: {
        provider: 'v8',
        include: ['src/**'],
        exclude: ['**/*.stories.ts', 'src/stories/**', 'src/docs/**'],
      },
    },
  }),
);
