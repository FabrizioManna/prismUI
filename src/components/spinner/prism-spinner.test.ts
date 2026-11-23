import { describe, expect, it } from 'vitest';
import { html } from 'lit';
import './define.js';
import type { PrismSpinner } from './prism-spinner.js';
import { fixture, settle } from '../../../test/helpers/index.js';
import { expectNoA11yViolations } from '../../../test/helpers/axe.js';

const base = (el: Element) => el.shadowRoot!.querySelector('[part=base]')!;

describe('prism-spinner', () => {
  it('AC-SPINNER-01 standalone: role status with a localized label', async () => {
    const el = await fixture<PrismSpinner>(html`<prism-spinner></prism-spinner>`);
    expect(base(el).getAttribute('role')).toBe('status');
    expect(base(el).textContent).toContain('Loading');
    const it = await fixture(html`<div lang="it"><prism-spinner></prism-spinner></div>`);
    await settle(it);
    expect(base(it.querySelector('prism-spinner')!).textContent).toContain('Caricamento');
    await expectNoA11yViolations(el.parentElement!);
  });

  it('AC-SPINNER-02 decorative: aria-hidden and no status', async () => {
    const el = await fixture<PrismSpinner>(html`<prism-spinner decorative></prism-spinner>`);
    expect(base(el).getAttribute('aria-hidden')).toBe('true');
    expect(base(el).hasAttribute('role')).toBe(false);
  });

  it('AC-SPINNER-03 delay hides the indicator until it elapses', async () => {
    const el = await fixture<PrismSpinner>(html`<prism-spinner delay="150"></prism-spinner>`);
    expect(base(el).hasAttribute('data-hidden')).toBe(true);
    await new Promise((r) => setTimeout(r, 200));
    await settle(el);
    expect(base(el).hasAttribute('data-hidden')).toBe(false);
  });
});
