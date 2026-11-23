import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';

/**
 * Design tokens (`--prism-*`) from `src/tokens/prism-tokens.css`.
 * Switch theme, backdrop and direction from the toolbar.
 */
const meta: Meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const swatch = (token: string, fg = '--prism-color-text-primary') =>
  html`<div
    style="background: var(${token}); color: var(${fg}); border: var(--prism-control-border-width) solid var(--prism-control-border); border-radius: var(--prism-radius-lg); padding: var(--prism-space-3); min-block-size: var(--prism-target-min);"
  >
    <code>${token}</code>
  </div>`;

const grid = 'display: grid; gap: var(--prism-space-3); grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));';

/** Text-bearing glass surfaces: alpha >= 0.85 in light, >= 0.90 in dark. */
export const Surfaces: Story = {
  render: () =>
    html`<section style=${grid} aria-label="Text-bearing surfaces">
      ${[0, 1, 2, 3, 4].map((i) => swatch(`--prism-glass-surface-solid-${i}`))} ${swatch('--prism-glass-slab')}
    </section>`,
  play: async ({ canvasElement }) => {
    const alpha = getComputedStyle(document.documentElement).getPropertyValue('--prism-glass-surface-solid-0-alpha');
    const dark = document.documentElement.classList.contains('dark');
    await expect(Number(alpha)).toBeGreaterThanOrEqual(dark ? 0.9 : 0.85);
    await expect(canvasElement.querySelectorAll('code').length).toBe(6);
  },
};

/** Intent colours with their on-colour text. */
export const Intents: Story = {
  render: () =>
    html`<section style=${grid} aria-label="Intents">
      ${['primary', 'success', 'warning', 'danger', 'info'].map((intent) =>
        swatch(`--prism-color-${intent}`, `--prism-color-${intent}-on`),
      )}
    </section>`,
};

/** Double focus ring: inner white ring (box-shadow) inside an outer black outline. Press Tab. */
export const FocusRing: Story = {
  render: () =>
    html`<button
        type="button"
        style="outline: var(--prism-focus-ring-width) solid var(--prism-focus-ring-outer); outline-offset: var(--prism-focus-ring-offset); box-shadow: 0 0 0 var(--prism-focus-ring-width) var(--prism-focus-ring-inner); min-block-size: var(--prism-control-height-md); padding-inline: var(--prism-control-padding-inline-md); background: var(--prism-color-primary); color: var(--prism-color-primary-on); border: 0; border-radius: var(--prism-radius-lg); font: inherit;"
      >
        Focus preview
      </button>
      ring`,
};
