import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import '../../../test/fixtures/prism-test-field.js';
import type { PrismTestField } from '../../../test/fixtures/prism-test-field.js';

/**
 * Reference for the **controlled** pattern used by every prismUI component, shown on an internal
 * test fixture (`prism-test-field`, not a public component).
 *
 * The component never assigns `value`: it emits `prism-input`/`input` while typing and
 * `prism-change`/`change` on commit. The consumer decides by updating the property.
 */
const meta: Meta = {
  title: 'Foundations/Controlled pattern',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

/** The consumer accepts every request (like `v-model` / `ngModel`). */
export const Accepted: Story = {
  args: { onChange: fn() },
  render: (args) =>
    html`<prism-test-field
      label="Accepted"
      value="Rome"
      @prism-change=${(e: CustomEvent) => {
        (e.target as PrismTestField).value = String(e.detail.value);
        (args['onChange'] as (d: unknown) => void)(e.detail);
      }}
    ></prism-test-field>`,
  play: async ({ canvasElement, args }) => {
    const field = canvasElement.querySelector('prism-test-field')!;
    const input = field.shadowRoot!.querySelector('input')!;
    // Replace the current text (userEvent.clear() cannot see focus behind delegatesFocus).
    await userEvent.type(input, 'Milan', { initialSelectionStart: 0, initialSelectionEnd: input.value.length });
    input.dispatchEvent(new Event('change'));
    await field.updateComplete;
    await expect(args['onChange']).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Milan', previousValue: 'Rome' }),
    );
    await expect(field.value).toBe('Milan');
  },
};

/** The consumer ignores requests: the committed text reverts to `value`. */
export const Ignored: Story = {
  render: () => html`<prism-test-field label="Ignored" value="Rome"></prism-test-field>`,
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('prism-test-field')!;
    const input = field.shadowRoot!.querySelector('input')!;
    await userEvent.type(input, 'X');
    input.dispatchEvent(new Event('change'));
    await field.updateComplete;
    await expect(input.value).toBe('Rome');
  },
};
