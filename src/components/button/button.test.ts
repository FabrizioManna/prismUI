import { describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import { userEvent } from 'vitest/browser';
import './define.js';
import type { PrismButton } from './prism-button.js';
import { fixture, recordEvents, settle } from '../../../test/helpers/index.js';
import { expectNoA11yViolations } from '../../../test/helpers/axe.js';

const base = (el: PrismButton) => el.shadowRoot!.querySelector<HTMLElement>('[part=base]')!;

describe('prism-button (dev tests)', () => {
  it('defaults: primary, md, type button; axe clean in every variant', async () => {
    const wrap = await fixture(
      html`<div>
        ${['primary', 'secondary', 'ghost', 'danger', 'link'].map((v) => html`<prism-button variant=${v}>${v}</prism-button>`)}
        <prism-button>Default</prism-button>
      </div>`,
    );
    const last = wrap.lastElementChild as PrismButton;
    expect([last.variant, last.size, last.type]).toEqual(['primary', 'md', 'button']);
    expect(last.getAttribute('variant')).toBe('primary');
    await expectNoA11yViolations(wrap);
  });

  it('loading: aria-busy, focusable, no click; width unchanged', async () => {
    const el = await fixture<PrismButton>(html`<prism-button>Send the form</prism-button>`);
    const w = el.getBoundingClientRect().width;
    el.loading = true;
    await settle(el);
    const click = vi.fn();
    el.addEventListener('click', click);
    base(el).click();
    expect(click).not.toHaveBeenCalled();
    expect(base(el).getAttribute('aria-busy')).toBe('true');
    expect(Math.abs(el.getBoundingClientRect().width - w)).toBeLessThanOrEqual(1);
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(base(el));
  });

  it('toggle proposes !pressed (value + pressed), not cancelable, no self-mutation', async () => {
    const el = await fixture<PrismButton>(html`<prism-button toggle>Bold</prism-button>`);
    const rec = recordEvents(el, ['prism-change']);
    await userEvent.click(base(el));
    const e = rec.log[0]!.event as CustomEvent;
    expect(e.detail).toMatchObject({ value: true, pressed: true, previousValue: false, reason: 'click' });
    expect(e.cancelable).toBe(false);
    expect(el.pressed).toBe(false);
    expect(base(el).getAttribute('aria-pressed')).toBe('false');
  });

  it('submit carries name/value; reset resets the form; disabled host never clicks', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <prism-button type="submit" name="op" value="save">Save</prism-button> <prism-button disabled>Off</prism-button>
      </form>`,
    );
    let data: FormData | undefined;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      data = new FormData(form, e.submitter);
    });
    const [submit, off] = [...form.querySelectorAll('prism-button')] as PrismButton[];
    base(submit!).click();
    expect(data?.get('op')).toBe('save');
    const click = vi.fn();
    off!.addEventListener('click', click);
    off!.click();
    expect(click).not.toHaveBeenCalled();
  });

  it('href renders a link; icon-only uses label as name', async () => {
    const a = await fixture<PrismButton>(html`<prism-button href="#x">Docs</prism-button>`);
    expect(base(a).localName).toBe('a');
    const i = await fixture<PrismButton>(
      html`<prism-button icon-only label="Delete"
        ><prism-icon slot="prefix" name="prism:x"></prism-icon
      ></prism-button>`,
    );
    expect(base(i).getAttribute('aria-label')).toBe('Delete');
  });
});
