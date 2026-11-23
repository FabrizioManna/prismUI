/**
 * Form integration helpers (ux-spec §1.4, architecture §5).
 */
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { fixture } from './fixture';

export async function formFixture<T extends Element = HTMLElement>(inner: TemplateResult) {
  const form = await fixture<HTMLFormElement>(html`<form novalidate>${inner}</form>`);
  const el = form.querySelector<T & Element>('*') as T;
  return { form, el };
}

/** Form entries as an array of [name, value] (multi-value aware). */
export function entries(form: HTMLFormElement): Array<[string, string]> {
  return Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]);
}

/** Records submit events and prevents navigation. */
export function trapSubmit(form: HTMLFormElement) {
  const submits: SubmitEvent[] = [];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submits.push(e as SubmitEvent);
  });
  return submits;
}
