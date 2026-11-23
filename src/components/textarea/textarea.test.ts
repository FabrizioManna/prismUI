import { describe, it, expect, afterEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import './define.js';
import type { PrismTextarea } from './prism-textarea.js';

const mount = async (markup: string) => {
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.append(host);
  const el = host.querySelector('prism-textarea') as PrismTextarea;
  await el.updateComplete;
  return { host, el, ta: el.shadowRoot!.querySelector('textarea')! };
};

describe('prism-textarea (dev tests)', () => {
  afterEach(() => document.body.replaceChildren());

  it('typing emits prism-input then native input; blur emits prism-change then change; value is controlled', async () => {
    const { el, ta } = await mount('<prism-textarea label="Notes"></prism-textarea>');
    const log: string[] = [];
    for (const t of ['prism-input', 'input', 'prism-change', 'change'])
      el.addEventListener(t, (e) => log.push(`${t}:${(e as CustomEvent).detail?.reason ?? ''}`));
    ta.focus();
    await userEvent.keyboard('a{Enter}b');
    expect(log.filter((l) => l.startsWith('prism-input')).length).toBe(3);
    expect(log[0]).toBe('prism-input:');
    expect(log[1]).toBe('input:');
    ta.blur();
    expect(log.slice(-2)).toEqual(['prism-change:commit', 'change:']);
    await el.updateComplete;
    expect(el.value).toBe('');
    expect(ta.value).toBe('');
  });

  it('the owner applies the value; FormData and required follow it', async () => {
    const { host, el } = await mount('<form><prism-textarea name="notes" required></prism-textarea></form>');
    const form = host.querySelector('form')!;
    expect(form.checkValidity()).toBe(false);
    el.value = 'hello\nworld';
    expect(new FormData(form).get('notes')).toBe('hello\nworld');
    await el.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });

  it('Enter inserts a new line and does not submit the form', async () => {
    const { host, el, ta } = await mount('<form><prism-textarea name="n"></prism-textarea></form>');
    let submitted = false;
    host.querySelector('form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted = true;
    });
    el.addEventListener('prism-input', (e) => (el.value = (e as CustomEvent<{ value: string }>).detail.value));
    ta.focus();
    await userEvent.keyboard('x{Enter}y');
    expect(submitted).toBe(false);
    expect(el.value).toBe('x\ny');
  });
});
