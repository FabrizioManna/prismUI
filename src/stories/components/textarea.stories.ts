import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import '../../components/textarea/define.js';
import type { PrismTextarea } from '../../components/textarea/prism-textarea.js';

/**
 * Multi-line glass text field. Controlled: typing emits `prism-input`, blur emits `prism-change`,
 * and the owner sets `value`.
 */
const meta: Meta = {
  title: 'Components/Textarea',
  component: 'prism-textarea',
  tags: ['autodocs'],
  args: { label: 'Message', rows: 3, resize: 'vertical', maxlength: 200, showCounter: true, disabled: false },
  argTypes: { resize: { control: 'select', options: ['vertical', 'none', 'auto'] } },
  render: (a) =>
    html`<prism-textarea
      label=${a['label']}
      rows=${a['rows']}
      resize=${a['resize']}
      maxlength=${a['maxlength']}
      ?show-counter=${a['showCounter']}
      ?disabled=${a['disabled']}
      @prism-input=${(e: CustomEvent<{ value: string }>) => ((e.currentTarget as PrismTextarea).value = e.detail.value)}
    ></prism-textarea>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<PrismTextarea>('prism-textarea')!;
    await expect(el.shadowRoot!.querySelector('textarea')).not.toBeNull();
  },
};

/** Grows with the content up to `max-rows`. */
export const AutoResize: Story = {
  args: { resize: 'auto' },
  render: () => html`<prism-textarea label="Bio" resize="auto" max-rows="6"></prism-textarea>`,
};
