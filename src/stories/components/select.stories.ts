import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import '../../components/select/define.js';
import type { PrismSelect } from '../../components/select/prism-select.js';

/**
 * Select-only combobox. Controlled: the owner applies `prism-open-request` / `prism-close-request`
 * to `open` and `prism-change` to `value`.
 */
const meta: Meta = {
  title: 'Components/Select',
  component: 'prism-select',
  tags: ['autodocs'],
  args: { label: 'Country', multiple: false, searchable: false, disabled: false },
  render: (a) =>
    html`<prism-select
      label=${a['label']}
      ?multiple=${a['multiple']}
      ?searchable=${a['searchable']}
      ?disabled=${a['disabled']}
      @prism-open-request=${(e: Event) => ((e.currentTarget as PrismSelect).open = true)}
      @prism-close-request=${(e: Event) => ((e.currentTarget as PrismSelect).open = false)}
      @prism-change=${(e: CustomEvent<{ value: string | string[] }>) =>
        ((e.currentTarget as PrismSelect).value = e.detail.value)}
    >
      <prism-option value="fr">France</prism-option> <prism-option value="de" disabled>Germany</prism-option>
      <prism-option value="is">Iceland</prism-option> <prism-option value="it">Italy</prism-option>
    </prism-select>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<PrismSelect>('prism-select')!;
    await expect(el.shadowRoot!.querySelector('[role="combobox"]')).not.toBeNull();
  },
};

/** Multiple values are shown as removable chips. */
export const Multiple: Story = { args: { multiple: true } };
