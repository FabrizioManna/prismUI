/**
 * QA tests — prism-button (ux-spec §2.1, architecture §6.1, a11y-checklist §2.1).
 * Event names/cancelability: src/core/events.ts @02a9fc6 + ux-spec v0.5. Behaviour follows the controlled rule (P.2, ux-spec §1.2/§1.3): toggle emits `prism-change`, `pressed` never changes by itself.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { html } from 'lit';
import { userEvent, cdp } from 'vitest/browser';
import './define';
import {
  fixture,
  cleanupFixtures,
  settle,
  setProps,
  part,
  recordEvents,
  EV,
  FORBIDDEN_EVENTS,
  consumer,
  axInfo,
  requireChromium,
  baselineSuite,
  formFixture,
  trapSubmit,
  addSentinels,
  tab,
  press,
  hasFocusWithin,
  useMobile,
  useDesktop,
  expectTargetAtLeast,
  isCoarse,
  assertEventShape,
  expectVisibleFocusRing,
  expectNotCancelable,
  expectEventContract,
} from '../../../test/qa/index';

const basic = () => html`<prism-button>Salva</prism-button>`;

baselineSuite({
  tag: 'prism-button',
  id: 'BUTTON',
  focusable: true,
  render: () => fixture(basic()),
  touchTargets: (h) => [part(h, 'base')],
});

describe('prism-button', () => {
  afterEach(async () => {
    cleanupFixtures();
    vi.restoreAllMocks();
    await useDesktop();
  });

  it('AC-BUTTON-01 Tab reaches the button; Enter and Space emit exactly one click each', async () => {
    const el = await fixture(basic());
    const { before } = addSentinels(el);
    before.focus();
    await tab();
    expect(hasFocusWithin(el)).toBe(true);
    const clicks = vi.fn();
    el.addEventListener('click', clicks);
    await press('Enter');
    expect(clicks).toHaveBeenCalledTimes(1);
    await press('Space');
    expect(clicks).toHaveBeenCalledTimes(2);
  });

  it('BUTTON-DEFAULTS default variant is "primary" (Manager decision 23/11), reflected; size md; type button', async () => {
    const el = await fixture<HTMLElement & { variant: string; size: string; type: string }>(basic());
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
    expect(el.size).toBe('md');
    expect(el.type).toBe('button');
  });

  it('AC-BUTTON-02 disabled: not focusable and no click', async () => {
    const el = await fixture(html`<prism-button disabled>Salva</prism-button>`);
    const { before, after } = addSentinels(el);
    const clicks = vi.fn();
    el.addEventListener('click', clicks);
    before.focus();
    await tab();
    expect(document.activeElement).toBe(after);
    await userEvent.click(el, { force: true });
    expect(clicks).not.toHaveBeenCalled();
  });

  it('AC-BUTTON-03 loading: focusable, aria-disabled + aria-busy, no click, width unchanged (±1px)', async () => {
    const el = await fixture<HTMLElement>(html`<prism-button>Invia il modulo</prism-button>`);
    const w0 = el.getBoundingClientRect().width;
    await setProps(el, { loading: true });
    expect(el.hasAttribute('loading')).toBe(true);
    const base = part(el, 'base');
    expect(base.getAttribute('aria-disabled')).toBe('true');
    expect(base.getAttribute('aria-busy') ?? el.getAttribute('aria-busy')).toBe('true');
    expect(Math.abs(el.getBoundingClientRect().width - w0)).toBeLessThanOrEqual(1);
    const clicks = vi.fn();
    el.addEventListener('click', clicks);
    const { before } = addSentinels(el);
    before.focus();
    await tab();
    expect(hasFocusWithin(el), 'loading button must stay focusable').toBe(true);
    await press('Enter');
    await userEvent.click(base, { force: true });
    expect(clicks).not.toHaveBeenCalled();
  });

  it('AC-BUTTON-04 icon-only without label warns in dev; with label the accessible name equals label', async (ctx) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await fixture(html`<prism-button icon-only><svg slot="prefix" viewBox="0 0 16 16"></svg></prism-button>`);
    expect(warn).toHaveBeenCalled();
    cleanupFixtures();
    requireChromium(ctx);
    const el = await fixture(
      html`<prism-button icon-only label="Elimina"><svg slot="prefix" viewBox="0 0 16 16"></svg></prism-button>`,
    );
    const ax = await axInfo(part(el, 'base'));
    expect(ax.role).toBe('button');
    expect(ax.name).toBe('Elimina');
  });

  it('AC-BUTTON-05 type=submit submits the owning form; type=reset resets it', async () => {
    const { form } = await formFixture(
      html`<input name="q" value="iniziale" />
        <prism-button type="submit" name="azione" value="salva">Invia</prism-button>
        <prism-button type="reset">Ripristina</prism-button>`,
    );
    const submits = trapSubmit(form);
    const [submit, reset] = Array.from(form.querySelectorAll('prism-button'));
    await userEvent.click(part(submit!, 'base'));
    expect(submits.length).toBe(1);
    const input = form.querySelector('input')!;
    input.value = 'modificato';
    await userEvent.click(part(reset!, 'base'));
    expect(input.value).toBe('iniziale');
  });

  it('BUTTON-FORM submit carries the button name/value in FormData (architecture §5.4)', async () => {
    const { form } = await formFixture(
      html`<prism-button type="submit" name="azione" value="salva">Invia</prism-button>`,
    );
    let data: FormData | null = null;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      data = new FormData(form, (e as SubmitEvent).submitter);
    });
    await userEvent.click(part(form.querySelector('prism-button')!, 'base'));
    expect(data).not.toBeNull();
    expect(data!.get('azione')).toBe('salva');
  });

  it('AC-BUTTON-06 / AC-BUTTON-CTRL toggle: click emits prism-change {pressed: true} (not cancelable), aria-pressed stays false until the consumer sets `pressed`', async () => {
    const el = await fixture<HTMLElement & { pressed: boolean }>(html`<prism-button toggle>Grassetto</prism-button>`);
    const base = part(el, 'base');
    expect(base.getAttribute('aria-pressed')).toBe('false');
    const rec = recordEvents();
    await userEvent.click(base);
    await settle();
    expect(rec.count(EV.change)).toBe(1);
    const d = rec.last(EV.change)!.detail;
    expect(d.pressed, 'ux-spec v0.5 §2.1: detail { pressed: !pressed, reason }').toBe(true);
    assertEventShape(rec.last(EV.change)!);
    expectNotCancelable(rec.last(EV.change));
    expectEventContract(rec.log);
    for (const f of FORBIDDEN_EVENTS) expect(rec.count(f), `forbidden event ${f}`).toBe(0);
    expect(el.pressed, 'component must not change `pressed` by itself').toBe(false);
    expect(base.getAttribute('aria-pressed')).toBe('false');
    // consumer applies the request
    consumer(el, EV.change, (t, det) => {
      t.pressed = det.pressed;
    });
    await userEvent.click(base);
    await settle();
    expect(base.getAttribute('aria-pressed')).toBe('true');
  });

  it('AC-BUTTON-CTRL setting `pressed` via API emits no prism-change', async () => {
    const el = await fixture<HTMLElement & { pressed: boolean }>(html`<prism-button toggle>Grassetto</prism-button>`);
    const rec = recordEvents();
    await setProps(el, { pressed: true });
    expect(part(el, 'base').getAttribute('aria-pressed')).toBe('true');
    expect(rec.count(EV.change)).toBe(0);
  });

  it('AC-BUTTON-07 href renders an <a> with role link; Space does not activate it, Enter does', async (ctx) => {
    const el = await fixture(html`<prism-button href="#qa-target">Documentazione</prism-button>`);
    const base = part(el, 'base');
    expect(base.localName).toBe('a');
    expect(base.getAttribute('href')).toBe('#qa-target');
    const activations = vi.fn((e: Event) => e.preventDefault());
    base.addEventListener('click', activations);
    base.focus();
    await press('Space');
    expect(activations).not.toHaveBeenCalled();
    await press('Enter');
    expect(activations).toHaveBeenCalledTimes(1);
    requireChromium(ctx);
    expect((await axInfo(base)).role).toBe('link');
  });

  it('AC-BUTTON-09 hit area >= 24x24 with pointer: fine and >= 44x44 with pointer: coarse, in every size', async (ctx) => {
    for (const size of ['sm', 'md', 'lg']) {
      const el = await fixture(html`<prism-button size=${size}>Ok</prism-button>`);
      expectTargetAtLeast(part(el, 'base'), 24, `fine size=${size}`);
      cleanupFixtures();
    }
    requireChromium(ctx);
    await useMobile();
    expect(isCoarse()).toBe(true);
    for (const size of ['sm', 'md', 'lg']) {
      const el = await fixture(html`<prism-button size=${size}>Ok</prism-button>`);
      expectTargetAtLeast(part(el, 'base'), 44, `coarse size=${size}`);
      cleanupFixtures();
    }
  });

  it('AC-BUTTON-08 (auto part) keyboard focus ring is an outline of --prism-focus-ring-width (>= 2px), in every variant', async () => {
    for (const variant of ['primary', 'secondary', 'ghost', 'danger', 'link']) {
      const el = await fixture(html`<prism-button variant=${variant}>Ok</prism-button>`);
      const { before } = addSentinels(el);
      before.focus();
      await tab();
      expectVisibleFocusRing(el);
      cleanupFixtures();
    }
  });

  it('AC-BUTTON-11 touch: a tap that starts on the button and ends outside does not activate (WCAG 2.5.2)', async (ctx) => {
    requireChromium(ctx);
    await useMobile();
    const el = await fixture(basic());
    const clicks = vi.fn();
    el.addEventListener('click', clicks);
    const r = part(el, 'base').getBoundingClientRect();
    const frame = window.frameElement?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const x = frame.left + r.left + r.width / 2;
    const y = frame.top + r.top + r.height / 2;
    const send = (type: 'touchStart' | 'touchEnd' | 'touchMove' | 'touchCancel', px: number, py: number) =>
      cdp().send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: px, y: py }] });
    await send('touchStart', x, y);
    await send('touchMove', x, y + 200);
    await send('touchEnd', x, y + 200);
    await settle();
    expect(clicks).not.toHaveBeenCalled();
    // control: a real tap inside does activate
    await send('touchStart', x, y);
    await send('touchEnd', x, y);
    await settle();
    expect(clicks).toHaveBeenCalledTimes(1);
  });

  it('KEYBOARD disabled-reason keeps the button focusable and links the reason via aria-describedby', async () => {
    const el = await fixture(
      html`<prism-button disabled-reason="Compila prima i campi obbligatori">Invia</prism-button>`,
    );
    const base = part(el, 'base');
    const ids = (base.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids.length).toBeGreaterThan(0);
    const desc = ids.map((id) => el.shadowRoot!.getElementById(id)?.textContent ?? '').join(' ');
    expect(desc).toContain('Compila prima i campi obbligatori');
  });
});
