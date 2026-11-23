import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest', '@storybook/addon-themes'],
  async viteFinal(config, { configType }) {
    // GitHub Pages serves Storybook under /prismUI/.
    if (configType === 'PRODUCTION') config.base = '/prismUI/';
    return config;
  },
};

export default config;
