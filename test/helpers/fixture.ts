import { render, type TemplateResult } from 'lit';
import type { ReactiveElement } from 'lit';

const containers = new Set<HTMLElement>();

/** Renders a Lit template into a fresh container and waits for the first element to update. */
export async function fixture<T extends Element = HTMLElement>(template: TemplateResult): Promise<T> {
  const container = document.createElement('div');
  container.setAttribute('data-fixture', '');
  document.body.append(container);
  containers.add(container);
  render(template, container);
  const el = container.firstElementChild as T | null;
  if (!el) throw new Error('fixture(): template rendered no element');
  await settle(el);
  return el;
}

/**
 * Waits for a Lit element and its nested Lit elements to finish updating.
 * Without an argument, waits for every element rendered by `fixture()`, plus one animation frame.
 */
export async function settle(el?: Element): Promise<void> {
  const roots: Element[] = el ? [el] : [...containers];
  const candidates = roots.flatMap((r) => [r, ...r.querySelectorAll('*')]);
  for (const c of candidates) {
    const update = (c as Partial<ReactiveElement>).updateComplete;
    if (update) await update;
  }
  if (!el) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export function cleanupFixtures(): void {
  for (const c of containers) c.remove();
  containers.clear();
}
