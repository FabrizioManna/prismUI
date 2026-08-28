import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';
import '../src/index'; // Load all components and styles

setCustomElementsManifest(customElements);

/** @type { import('@storybook/web-components').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'Dark Space',
      values: [
        {
          name: 'Dark Space',
          value: '#0f172a',
        },
        {
          name: 'Deep Purple',
          value: '#1e1b4b',
        },
        {
          name: 'Light',
          value: '#f8fafc',
        },
      ],
    },
  },
};

export default preview;
