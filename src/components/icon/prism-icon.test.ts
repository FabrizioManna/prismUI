import { afterEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import './define.js';
import { PrismIcon } from './prism-icon.js';
import { fixture, settle } from '../../../test/helpers/index.js';
import { expectNoA11yViolations } from '../../../test/helpers/axe.js';

const svgOf = (el: Element) => el.shadowRoot!.querySelector('svg');

describe('prism-icon', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders a registered icon, decorative by default', async () => {
    const el = await fixture<PrismIcon>(html`<prism-icon name="prism:check"></prism-icon>`);
    const svg = svgOf(el)!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('part')).toBe('svg');
    expect(el.shadowRoot!.querySelector('.base')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('with label is meaningful: role img + aria-label', async () => {
    const el = await fixture<PrismIcon>(html`<prism-icon name="prism:alert" label="Error"></prism-icon>`);
    const base = el.shadowRoot!.querySelector('.base')!;
    expect(base.getAttribute('role')).toBe('img');
    expect(base.getAttribute('aria-label')).toBe('Error');
    await expectNoA11yViolations(el.parentElement!);
  });

  it('accepts a trusted svg string and custom registrations', async () => {
    PrismIcon.register({ dot: '<svg viewBox="0 0 2 2"><circle cx="1" cy="1" r="1"/></svg>' });
    const a = await fixture<PrismIcon>(html`<prism-icon name="dot"></prism-icon>`);
    expect(svgOf(a)!.querySelector('circle')).not.toBeNull();
    const b = await fixture<PrismIcon>(
      html`<prism-icon .svg=${'<svg viewBox="0 0 1 1"><rect width="1" height="1"/></svg>'}></prism-icon>`,
    );
    expect(svgOf(b)!.querySelector('rect')).not.toBeNull();
  });

  it('warns once for an unknown name and renders nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = await fixture<PrismIcon>(html`<prism-icon name="nope-icon"></prism-icon>`);
    expect(svgOf(el)).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('size maps to the scale; --prism-icon-size wins', async () => {
    const el = await fixture<PrismIcon>(html`<prism-icon name="prism:x" size="lg"></prism-icon>`);
    expect(el.getBoundingClientRect().width).toBe(24);
    el.style.setProperty('--prism-icon-size', '40px');
    await settle(el);
    expect(el.getBoundingClientRect().width).toBe(40);
  });
});
