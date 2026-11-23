import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import '../../components/spinner/define.js';

/**
 * Indeterminate loading indicator. Standalone it is a `status` with a localized label;
 * inside a busy component use `decorative`. Reduced motion turns rotation into a slow pulse.
 */
const meta: Meta = {
  title: 'Components/Spinner',
  component: 'prism-spinner',
  tags: ['autodocs'],
  args: { size: 'md', label: '', labelVisible: false, decorative: false },
  argTypes: { size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] } },
  render: (a) =>
    html`<div style="color:var(--prism-color-primary)">
      <prism-spinner
        size=${a['size']}
        label=${a['label']}
        ?label-visible=${a['labelVisible']}
        ?decorative=${a['decorative']}
      ></prism-spinner>
    </div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const base = canvasElement.querySelector('prism-spinner')!.shadowRoot!.querySelector('[part=base]');
    await expect(base).toHaveAttribute('role', 'status');
  },
};

export const VisibleLabel: Story = { args: { label: 'Loading orders…', labelVisible: true } };

export const Decorative: Story = {
  args: { decorative: true },
  play: async ({ canvasElement }) => {
    const base = canvasElement.querySelector('prism-spinner')!.shadowRoot!.querySelector('[part=base]');
    await expect(base).toHaveAttribute('aria-hidden', 'true');
  },
};
