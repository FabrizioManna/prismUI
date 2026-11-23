import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import '../../components/input/define.js';
import type { PrismInput } from '../../components/input/prism-input.js';

/**
 * Accessible glass text field. Controlled: typing emits `prism-input` / `prism-change`
 * with the proposed value, and the owner sets `value`.
 */
const meta: Meta = {
  title: 'Components/Input',
  component: 'prism-input',
  tags: ['autodocs'],
  args: { label: 'Email', type: 'email', size: 'md', required: false, disabled: false, helpText: '' },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (a) =>
    html`<prism-input
      label=${a['label']}
      type=${a['type']}
      size=${a['size']}
      help-text=${a['helpText']}
      ?required=${a['required']}
      ?disabled=${a['disabled']}
      @prism-input=${(e: CustomEvent<{ value: string }>) => ((e.target as PrismInput).value = e.detail.value)}
    ></prism-input>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<PrismInput>('prism-input')!;
    await expect(el.label).toBe('Email');
  },
};

/** Error state: `error-text` is announced and linked through aria-describedby. */
export const WithError: Story = {
  render: () => html`<prism-input label="Email" error-text="Enter a valid email address"></prism-input>`,
};
