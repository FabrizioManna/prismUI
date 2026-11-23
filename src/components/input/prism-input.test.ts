/**
 * QA tests — prism-input (ux-spec §2.2, architecture §6.2/§5, a11y-checklist §2.2). Events: src/core/events.ts @02a9fc6 + ux-spec v0.5.
 * Controlled: typing proposes values (prism-input / native input); `value` changes only when the consumer sets it.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { html } from 'lit';
import { userEvent } from 'vitest/browser';
import './define';
import {
  fixture,
  cleanupFixtures,
  settle,
  setProps,
  part,
  partMaybe,
  $,
  recordEvents,
  EV,
  consumer,
  axInfo,
  requireChromium,
  baselineSuite,
  formFixture,
  entries,
  trapSubmit,
  addSentinels,
  tab,
  press,
  deepActiveElement,
  hasFocusWithin,
  useDesktop,
  useMobile,
  expectTargetAtLeast,
  assertEventShape,
  expectNotCancelable,
  expectEventContract,
  nativeSequence,
} from '../../../test/qa/index';

type PrismInputEl = HTMLElement & { value: string; type: string };
const inner = (el: Element) => $<HTMLInputElement>(el, 'input');
const basic = () => html`<prism-input label="Email" name="email"></prism-input>`;

baselineSuite({
  tag: 'prism-input',
  id: 'INPUT',
  focusable: true,
  render: () => fixture(basic()),
  touchTargets: (h) => [part(h, 'input')],
});

describe('prism-input', () => {
  afterEach(async () => {
    cleanupFixtures();
    await useDesktop();
  });

  it('AC-INPUT-01 accessible name equals `label`; clicking the label focuses the input', async (ctx) => {
    const el = await fixture(basic());
    await userEvent.click(part(el, 'label'));
    expect(deepActiveElement()).toBe(inner(el));
    requireChromium(ctx);
    const ax = await axInfo(inner(el));
    expect(ax.role).toBe('textbox');
    expect(ax.name).toBe('Email');
  });

  it('AC-INPUT-02 external <label for> focuses the inner input on click', async (ctx) => {
    const wrap = await fixture(
      html`<div><label for="qa-x">Codice fiscale</label><prism-input id="qa-x"></prism-input></div>`,
    );
    const el = wrap.querySelector('prism-input')!;
    await userEvent.click(wrap.querySelector('label')!);
    expect(deepActiveElement()).toBe(inner(el));
    requireChromium(ctx);
    expect((await axInfo(inner(el))).name).toBe('Codice fiscale');
  });

  it('AC-INPUT-03 invalid + error-text: aria-invalid=true, aria-describedby includes the error id, error has an icon', async () => {
    const el = await fixture(
      html`<prism-input label="Email" invalid error-text="Inserisci un indirizzo email valido"></prism-input>`,
    );
    const input = inner(el);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const err = part(el, 'error-text');
    expect(err.textContent).toContain('Inserisci un indirizzo email valido');
    const ids = (input.getAttribute('aria-describedby') ?? '').split(/\s+/);
    const describedTexts = ids.map((id) => el.shadowRoot!.getElementById(id)?.textContent ?? '');
    expect(describedTexts.join(' ')).toContain('Inserisci un indirizzo email valido');
    expect(
      err.querySelector('svg, prism-icon') ?? el.shadowRoot!.querySelector('[part~="error-icon"]'),
      'error needs an icon besides colour (WCAG 1.4.1)',
    ).not.toBeNull();
  });

  it('AC-INPUT-04 required + empty: form.checkValidity() is false and reportValidity() focuses the inner input', async () => {
    const { form, el } = await formFixture(html`<prism-input label="Nome" name="nome" required></prism-input>`);
    expect(form.checkValidity()).toBe(false);
    form.reportValidity();
    await settle();
    expect(deepActiveElement()).toBe(inner(el));
  });

  it('AC-INPUT-05 name/value in FormData; form.reset() emits prism-change {value: default-value, reason: reset} (not cancelable) and NO native input/change; value unchanged until the consumer applies it', async () => {
    const { form, el } = await formFixture<PrismInputEl>(
      html`<prism-input label="Città" name="citta" value="Roma" default-value="Milano"></prism-input>`,
    );
    expect(entries(form)).toContainEqual(['citta', 'Roma']);
    const rec = recordEvents();
    form.reset();
    await settle();
    expect(rec.last(EV.change)?.detail).toMatchObject({ value: 'Milano', reason: 'reset' });
    expectNotCancelable(rec.last(EV.change));
    expect(nativeSequence(rec.log, el), 'reset never fires native input/change').toEqual([EV.change]);
    expect(el.value, 'without consumer the value stays').toBe('Roma');
    consumer(el, EV.change, (t, d) => {
      t.value = d.value;
    });
    rec.clear();
    form.reset();
    await settle();
    expect(el.value).toBe('Milano');
    expect(entries(form)).toContainEqual(['citta', 'Milano']);
    expect(nativeSequence(rec.log, el), 'applying the reset value via property fires no natives either').toEqual([
      EV.change,
    ]);
    expectEventContract(rec.log);
  });

  it('AC-INPUT-06 typing "ab": each prism-input {a, ab} is followed synchronously by one native input from the host; during dispatch target.value is the draft; also with a consumer that ignores drafts', async () => {
    const el = await fixture<PrismInputEl>(html`<prism-input label="Nome"></prism-input>`);
    const rec = recordEvents();
    const seenNative: string[] = [];
    let pendingPrism = 0;
    el.addEventListener(EV.input, () => {
      pendingPrism++;
    });
    el.addEventListener('input', (e) => {
      if (e.target !== el) return;
      expect(pendingPrism, 'native input must follow its prism-input synchronously').toBe(1);
      pendingPrism = 0;
      seenNative.push((e.target as PrismInputEl).value);
    });
    await userEvent.click(inner(el));
    await userEvent.keyboard('ab');
    await settle();
    expect(rec.of(EV.input).map((r) => r.detail.value)).toEqual(['a', 'ab']);
    rec.of(EV.input).forEach((r) => {
      assertEventShape(r);
      expectNotCancelable(r);
    });
    expect(nativeSequence(rec.log, el)).toEqual([EV.input, 'input', EV.input, 'input']);
    expect(
      rec.of('input').filter((r) => r.target !== el).length,
      'inner <input> events stopped at the shadow boundary',
    ).toBe(0);
    expect(seenNative, 'host value reads as the proposed draft during the native dispatch').toEqual(['a', 'ab']);
    expect(el.value, 'no consumer: the property is unchanged').toBe('');
    expect(rec.count(EV.change)).toBe(0);
    expectEventContract(rec.log);
  });

  it('AC-INPUT-07 blur after typing: prism-change {reason: commit} (not cancelable) then exactly one native change, synchronously; without consumer the field and FormData go back to the previous value', async () => {
    const { form, el } = await formFixture<PrismInputEl>(
      html`<prism-input label="Nome" name="nome" value="x"></prism-input>`,
    );
    const rec = recordEvents();
    let valueDuringChange: string | undefined;
    el.addEventListener('change', (e) => {
      if (e.target === el) valueDuringChange = el.value;
    });
    await userEvent.click(inner(el));
    await userEvent.keyboard('{End}yz');
    rec.clear();
    inner(el).blur();
    await settle();
    expect(rec.count(EV.change)).toBe(1);
    expect(rec.last(EV.change)!.detail).toMatchObject({ value: 'xyz', previousValue: 'x', reason: 'commit' });
    expectNotCancelable(rec.last(EV.change));
    expect(
      nativeSequence(rec.log, el),
      'commit of a text control: prism-change → change (input already fired per keystroke)',
    ).toEqual([EV.change, 'change']);
    expect(valueDuringChange, 'during the native dispatch the host reads the proposed value').toBe('xyz');
    expect(
      rec.of('change').filter((r) => r.target !== el && r.target !== null).length,
      'inner native change stopped at the shadow boundary',
    ).toBe(0);
    expect(el.value).toBe('x');
    expect(inner(el).value).toBe('x');
    expect(entries(form)).toContainEqual(['nome', 'x']);
    expectEventContract(rec.log);
  });

  it('AC-INPUT-08 clearable: Esc emits prism-change {value: "", reason: clear} (no prism-clear) without clearing the property; value="" from outside clears it', async () => {
    const el = await fixture<PrismInputEl>(html`<prism-input label="Cerca" clearable value="lit"></prism-input>`);
    inner(el).focus();
    const rec = recordEvents();
    await press('Escape');
    await settle();
    expect(rec.count('prism-clear'), 'prism-clear was removed (events.ts @02a9fc6)').toBe(0);
    expect(rec.count(EV.change)).toBe(1);
    expect(rec.last(EV.change)?.detail).toMatchObject({ value: '', reason: 'clear' });
    expectNotCancelable(rec.last(EV.change));
    expect(el.value).toBe('lit');
    expect(inner(el).value).toBe('lit');
    await setProps(el, { value: '' });
    expect(inner(el).value).toBe('');
    expectEventContract(rec.log);
  });

  it('AC-INPUT-09 clear + password toggle: Tab stops with names, >= 44x44 on touch; toggle switches type and aria-pressed', async (ctx) => {
    const el = await fixture(
      html`<prism-input label="Password" type="password" password-toggle clearable value="segreta"></prism-input>`,
    );
    const { before } = addSentinels(el);
    before.focus();
    await tab();
    expect(deepActiveElement()).toBe(inner(el));
    const clear = part(el, 'clear-button');
    const toggle = part(el, 'password-toggle');
    const stops: Element[] = [];
    for (let i = 0; i < 2; i++) {
      await tab();
      stops.push(deepActiveElement()!);
    }
    expect(stops).toContain(clear);
    expect(stops).toContain(toggle);
    expect(inner(el).type).toBe('password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(toggle);
    await settle();
    expect(inner(el).type).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    requireChromium(ctx);
    expect((await axInfo(clear)).name).not.toBe('');
    expect((await axInfo(toggle)).name).not.toBe('');
    await useMobile();
    await settle();
    expectTargetAtLeast(clear, 44, 'clear-button (touch)');
    expectTargetAtLeast(toggle, 44, 'password-toggle (touch)');
  });

  it('AC-INPUT-10 autocomplete, input-mode and enter-key-hint on the host reach the inner input', async () => {
    const el = await fixture(
      html`<prism-input label="Email" autocomplete="email" input-mode="email" enter-key-hint="next"></prism-input>`,
    );
    const i = inner(el);
    expect(i.getAttribute('autocomplete')).toBe('email');
    expect(i.getAttribute('inputmode')).toBe('email');
    expect(i.getAttribute('enterkeyhint')).toBe('next');
  });

  it('AC-INPUT-11 setting value via property emits no events', async () => {
    const el = await fixture<PrismInputEl>(html`<prism-input label="Nome"></prism-input>`);
    const rec = recordEvents();
    await setProps(el, { value: 'via API' });
    expect(rec.count(EV.input) + rec.count(EV.change) + rec.count('input') + rec.count('change')).toBe(0);
    expect(inner(el).value).toBe('via API');
  });

  it('AC-INPUT-CTRL a framework-style consumer (prism-input/prism-change → value) keeps the typed text', async () => {
    const el = await fixture<PrismInputEl>(html`<prism-input label="Nome"></prism-input>`);
    consumer(el, EV.input, (t, d) => {
      t.value = d.value;
    });
    consumer(el, EV.change, (t, d) => {
      t.value = d.value;
    });
    await userEvent.click(inner(el));
    await userEvent.keyboard('Ada');
    inner(el).blur();
    await settle();
    expect(el.value).toBe('Ada');
  });

  it('AC-INPUT-CTRL a v-model style consumer (native input/change → value) keeps the typed text', async () => {
    const el = await fixture<PrismInputEl>(html`<prism-input label="Nome"></prism-input>`);
    const sync = (e: Event) => {
      if (e.target === el) el.value = (e.target as PrismInputEl).value;
    };
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);
    await userEvent.click(inner(el));
    await userEvent.keyboard('Ada');
    inner(el).blur();
    await settle();
    expect(el.value).toBe('Ada');
  });

  it('KEYBOARD Enter inside a form requests implicit submit (architecture §5.4)', async () => {
    const { form, el } = await formFixture(html`<prism-input label="Cerca" name="q"></prism-input>`);
    const submits = trapSubmit(form);
    inner(el).focus();
    await press('Enter');
    expect(submits.length).toBe(1);
  });

  it('FOCUS host.focus() delegates to the inner input (a11y-checklist §1.2.1)', async () => {
    const el = await fixture<HTMLElement>(basic());
    el.focus();
    expect(deepActiveElement()).toBe(inner(el));
    expect(hasFocusWithin(el)).toBe(true);
    expect(partMaybe(el, 'input')).not.toBeNull();
  });
});
