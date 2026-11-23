import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import '../../components/button/define.js';
import '../../components/icon/define.js';
import type { PrismButton } from '../../components/button/prism-button.js';

/**
 * Accessible glass button. `primary` is the default: declare `secondary` / `ghost` for the other actions.
 * Toggle buttons are controlled: they emit `prism-change` and the owner sets `pressed`.
 */
const meta: Meta = {
  title: 'Components/Button',
  component: 'prism-button',
  tags: ['autodocs'],
  args: { variant: 'primary', size: 'md', disabled: false, loading: false, label: 'Save' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'link'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (a) =>
    html`<prism-button variant=${a['variant']} size=${a['size']} ?disabled=${a['disabled']} ?loading=${a['loading']}
      >${a['label']}</prism-button
    >`,
};
export default meta;
type Story = StoryObj;

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<PrismButton>('prism-button')!;
    await expect(el.getAttribute('variant')).toBe('primary');
  },
};

/** Several actions: one primary, the others secondary or ghost. */
export const Variants: Story = {
  render: () =>
    html`<div style="display:flex;gap:8px;flex-wrap:wrap">
      <prism-button>Save</prism-button> <prism-button variant="secondary">Cancel</prism-button>
      <prism-button variant="ghost">Preview</prism-button> <prism-button variant="danger">Delete</prism-button>
      <prism-button variant="link" href="#docs">Docs</prism-button>
    </div>`,
};

export const Loading: Story = {
  args: { loading: true, label: 'Saving' },
  play: async ({ canvasElement }) => {
    const base = canvasElement.querySelector('prism-button')!.shadowRoot!.querySelector('[part=base]')!;
    await expect(base).toHaveAttribute('aria-busy', 'true');
    await expect(base).toHaveAttribute('aria-disabled', 'true');
  },
};

export const IconOnly: Story = {
  render: () =>
    html`<prism-button icon-only label="Close" variant="secondary"
      ><prism-icon slot="prefix" name="prism:x"></prism-icon
    ></prism-button>`,
};

/** The owner applies `prism-change` to `pressed`. */
export const Toggle: Story = {
  args: { onChange: fn() },
  render: (a) =>
    html`<prism-button
      toggle
      variant="secondary"
      @prism-change=${(e: CustomEvent) => {
        (e.target as PrismButton).pressed = e.detail.pressed;
        (a['onChange'] as (d: unknown) => void)(e.detail);
      }}
      >Bold</prism-button
    >`,
  play: async ({ canvasElement, args }) => {
    const el = canvasElement.querySelector<PrismButton>('prism-button')!;
    await userEvent.click(el.shadowRoot!.querySelector('button')!);
    await el.updateComplete;
    await expect(args['onChange']).toHaveBeenCalledWith(expect.objectContaining({ pressed: true }));
    await expect(el.shadowRoot!.querySelector('button')).toHaveAttribute('aria-pressed', 'true');
  },
};
