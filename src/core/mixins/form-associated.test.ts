import { describe, expect, it } from 'vitest';
import { html } from 'lit';
import { userEvent } from 'vitest/browser';
import { fixture, recordEvents, settle } from '../../../test/helpers/index.js';
import '../../../test/fixtures/prism-test-field.js';
import type { PrismTestField } from '../../../test/fixtures/prism-test-field.js';

const innerInput = (el: PrismTestField) => el.shadowRoot!.querySelector('input')!;

describe('FormAssociatedMixin: controlled value pattern', () => {
  it('emits one prism-input and one native input per keystroke, without changing `value`', async () => {
    const el = await fixture<PrismTestField>(html`<prism-test-field label="Name"></prism-test-field>`);
    const events = recordEvents(el, ['prism-input', 'input']);
    await userEvent.type(innerInput(el), 'a');
    expect(events.types()).toEqual(['prism-input', 'input']);
    expect(events.log[1]!.targetValue).toBe('a'); // proposed value visible during the native dispatch
    expect(el.value).toBe('');
    expect(innerInput(el).value).toBe('a'); // uncommitted text is ephemeral state
  });

  it('on commit emits prism-change then change; the value reverts if the consumer ignores it', async () => {
    const el = await fixture<PrismTestField>(html`<prism-test-field label="Name" value="old"></prism-test-field>`);
    const events = recordEvents(el, ['prism-change', 'change']);
    await userEvent.fill(innerInput(el), 'new');
    innerInput(el).dispatchEvent(new Event('change'));
    await settle(el);
    expect(events.types()).toEqual(['prism-change', 'change']);
    const detail = (events.log[0]!.event as CustomEvent).detail;
    expect(detail).toMatchObject({ value: 'new', previousValue: 'old' });
    expect(events.log[1]!.targetValue).toBe('new');
    expect(el.value).toBe('old');
    expect(innerInput(el).value).toBe('old');
  });

  it('shows the new value when the consumer accepts the request (v-model style)', async () => {
    const el = await fixture<PrismTestField>(html`<prism-test-field label="Name" value="old"></prism-test-field>`);
    el.addEventListener('change', (e) => {
      const target = e.target as PrismTestField;
      target.value = String(target.value); // reads proposed value, writes it back
    });
    await userEvent.fill(innerInput(el), 'new');
    innerInput(el).dispatchEvent(new Event('change'));
    await settle(el);
    expect(el.value).toBe('new');
    expect(innerInput(el).value).toBe('new');
  });

  it('a canceled prism-change suppresses the native change (no state rollback needed)', async () => {
    const el = await fixture<PrismTestField>(html`<prism-test-field label="Name" value="old"></prism-test-field>`);
    el.addEventListener('prism-change', (e) => e.preventDefault());
    const events = recordEvents(el, ['prism-change', 'change']);
    await userEvent.fill(innerInput(el), 'new');
    innerInput(el).dispatchEvent(new Event('change'));
    await settle(el);
    expect(events.types()).toEqual(['prism-change']);
    expect(innerInput(el).value).toBe('old');
  });

  it('does not emit events for changes made through the API', async () => {
    const el = await fixture<PrismTestField>(html`<prism-test-field label="Name"></prism-test-field>`);
    const events = recordEvents(el, ['prism-change', 'prism-input', 'change', 'input']);
    el.value = 'api';
    await settle(el);
    expect(events.types()).toEqual([]);
    expect(innerInput(el).value).toBe('api');
  });

  it('participates in forms: FormData, required validity, fieldset disabled', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <fieldset><prism-test-field name="city" label="City" value="Rome" required></prism-test-field></fieldset>
      </form>`,
    );
    const el = form.querySelector('prism-test-field')!;
    await settle(el);
    expect(new FormData(form).get('city')).toBe('Rome');
    expect(el.checkValidity()).toBe(true);

    el.value = '';
    await settle(el);
    expect(el.validity?.valueMissing).toBe(true);

    form.querySelector('fieldset')!.disabled = true;
    await settle(el);
    expect(el.isDisabled).toBe(true);
    expect(innerInput(el).disabled).toBe(true);
    expect(new FormData(form).has('city')).toBe(false);
  });

  it('form.reset() emits a change request towards default-value instead of assigning it', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <prism-test-field name="q" label="Query" value="typed" default-value="init"></prism-test-field>
      </form>`,
    );
    const el = form.querySelector('prism-test-field')!;
    await settle(el);
    const events = recordEvents(el, ['prism-change']);
    form.reset();
    expect((events.log[0]!.event as CustomEvent).detail).toMatchObject({
      value: 'init',
      previousValue: 'typed',
      reason: 'reset',
    });
    expect(el.value).toBe('typed');
  });
});

describe('FocusableMixin', () => {
  it('delegates focus to [data-focus-target]', async () => {
    const el = await fixture<PrismTestField>(html`<prism-test-field label="Name"></prism-test-field>`);
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(innerInput(el));
    expect(document.activeElement).toBe(el);
  });

  it('draws the double focus ring: outer outline #000, inner white box-shadow', async () => {
    await fixture(html`<prism-test-field label="Name"></prism-test-field>`);
    await userEvent.tab();
    const el = document.querySelector('prism-test-field')!;
    const style = getComputedStyle(innerInput(el));
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineColor).toBe('rgb(0, 0, 0)');
    expect(style.outlineWidth).toBe('2px');
    expect(style.boxShadow).toContain('rgb(255, 255, 255)');
  });
});

describe('ValidationController (via test field)', () => {
  it('marks the field touched on form submit (invalid event)', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><prism-test-field name="n" label="N" required></prism-test-field></form>`,
    );
    const el = form.querySelector('prism-test-field')!;
    await settle(el);
    expect(el.validation.showError).toBe(false);
    form.checkValidity();
    await settle(el);
    expect(el.validation.showError).toBe(true);
  });
});
