/**
 * Focus helpers (ux-spec §1.5, a11y-checklist §3.4 rules F-1…F-5).
 */
import { expect } from 'vitest';
import { userEvent } from 'vitest/browser';

/** Active element resolved through nested open shadow roots. */
export function deepActiveElement(): Element | null {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a;
}

/** True if `el` contains `node`, crossing shadow boundaries (composed tree). */
export function containsDeep(el: Element, node: Node | null): boolean {
  let n: Node | null = node;
  while (n) {
    if (n === el) return true;
    n = (n as Element).assignedSlot ?? n.parentNode ?? null;
    if (n instanceof ShadowRoot) n = n.host;
  }
  return false;
}

/** Focus is on `host` or inside it (light or shadow DOM). */
export function hasFocusWithin(host: Element): boolean {
  return containsDeep(host, deepActiveElement());
}

export async function tab(times = 1, shift = false) {
  for (let i = 0; i < times; i++) await userEvent.tab({ shift });
}
export async function press(key: string, times = 1) {
  for (let i = 0; i < times; i++) await userEvent.keyboard(`{${key}}`);
}

/** Places a focusable "before" sentinel and tabs into the component from it. */
export async function tabInto(): Promise<void> {
  await tab();
}

/** Creates focusable sentinels around a container to test Tab order and traps. */
export function addSentinels(container: Element): { before: HTMLButtonElement; after: HTMLButtonElement } {
  const before = document.createElement('button');
  before.textContent = 'before';
  before.setAttribute('data-qa-sentinel', 'before');
  const after = document.createElement('button');
  after.textContent = 'after';
  after.setAttribute('data-qa-sentinel', 'after');
  container.before(before);
  container.after(after);
  return { before, after };
}

/**
 * F-1/F-2/F-3: the keyboard-focused element (or one of its ancestors inside the same component)
 * shows an outline of at least 2px (3px with prefers-contrast: more), not only a box-shadow.
 */
export function expectVisibleFocusRing(host: Element, minWidth = 2) {
  const active = deepActiveElement();
  expect(active, 'nothing focused').not.toBeNull();
  let n: Element | null = active;
  const checked: string[] = [];
  while (n) {
    const cs = getComputedStyle(n);
    const w = parseFloat(cs.outlineWidth || '0');
    checked.push(`${n.localName}: outline ${cs.outlineStyle} ${cs.outlineWidth}`);
    if (cs.outlineStyle !== 'none' && w >= minWidth) return;
    if (n === host) break;
    const parent: Node | null = n.parentNode;
    n = parent instanceof ShadowRoot ? parent.host : (parent as Element | null);
  }
  expect.fail(`no visible focus outline >= ${minWidth}px (F-1/F-2). Checked: ${checked.join(' | ')}`);
}

/** Key with modifier, e.g. chord('Shift', 'Tab'), chord('Control', 'Home'). */
export async function chord(modifier: 'Shift' | 'Control' | 'Alt' | 'Meta', key: string) {
  await userEvent.keyboard(`{${modifier}>}{${key}}{/${modifier}}`);
}
