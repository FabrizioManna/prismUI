import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import '../../components/icon/define.js';

/**
 * SVG icons from `lucide-static`, imported by name so only used icons are bundled.
 * Register them once with `PrismIcon.register({ 'chevron-down': ChevronDown })`.
 * Decorative by default; set `label` when the icon is the only meaningful content.
 */
const meta: Meta = {
  title: 'Components/Icon',
  component: 'prism-icon',
  tags: ['autodocs'],
  args: { name: 'prism:check', size: 'lg', label: '' },
  argTypes: { size: { control: 'select', options: ['inherit', 'xs', 'sm', 'md', 'lg', 'xl'] } },
  render: (a) => html`<prism-icon name=${a['name']} size=${a['size']} label=${a['label']}></prism-icon>`,
};
export default meta;
type Story = StoryObj;

export const Decorative: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('prism-icon')!.shadowRoot!.querySelector('svg')!;
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};

/** With `label`, the icon has `role="img"` and an accessible name. */
export const Meaningful: Story = {
  args: { name: 'prism:alert', label: 'Error' },
  play: async ({ canvasElement }) => {
    const base = canvasElement.querySelector('prism-icon')!.shadowRoot!.querySelector('[role=img]');
    await expect(base).toHaveAttribute('aria-label', 'Error');
  },
};

export const Sizes: Story = {
  render: () =>
    html`<div style="display:flex;gap:12px;align-items:center;color:var(--prism-color-text-primary)">
      ${['xs', 'sm', 'md', 'lg', 'xl'].map((s) => html`<prism-icon name="prism:info" size=${s}></prism-icon>`)}
    </div>`,
};
