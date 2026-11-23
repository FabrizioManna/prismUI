/**
 * QA test helpers (owner: QA, kept apart from test/helpers which belongs to the Frontend Developer).
 * Fixture rendering and settling for prismUI components.
 */
import { render, nothing, type TemplateResult } from 'lit';

const containers = new Set<HTMLElement>();

export interface FixtureOptions {
  dir?: 'ltr' | 'rtl';
  lang?: string;
  /** CSS width of the wrapping container (e.g. '320px') */
  width?: string;
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Collects every `prism-*` element under `root`, piercing open shadow roots. */
export function collectPrismElements(root: ParentNode): Element[] {
  const out: Element[] = [];
  const walk = (node: ParentNode) => {
    for (const el of Array.from(node.querySelectorAll('*'))) {
      if (el.localName.startsWith('prism-')) out.push(el);
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk(root);
  return out;
}

/**
 * Waits until every prism-* element under root is defined and updated (nested shadow roots included),
 * then two animation frames. Throws a readable error if a tag is never registered (missing define.ts).
 */
export async function settle(root: ParentNode = document.body, rounds = 3): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    const els = collectPrismElements(root);
    const tags = [...new Set(els.map((e) => e.localName))];
    await Promise.all(
      tags.map((tag) =>
        Promise.race([
          customElements.whenDefined(tag),
          wait(3000).then(() => {
            throw new Error(`[QA] <${tag}> is not registered: is its define.ts imported/implemented?`);
          }),
        ]),
      ),
    );
    await Promise.all(
      els.map((e) => (e as unknown as { updateComplete?: Promise<unknown> }).updateComplete).filter(Boolean),
    );
  }
  await nextFrame();
  await nextFrame();
}

export async function fixture<T extends Element = HTMLElement>(
  template: TemplateResult,
  options: FixtureOptions = {},
): Promise<T> {
  const container = document.createElement('div');
  container.setAttribute('data-qa-fixture', '');
  if (options.dir) container.dir = options.dir;
  if (options.lang) container.lang = options.lang;
  if (options.width) container.style.width = options.width;
  document.body.append(container);
  containers.add(container);
  render(template, container);
  await settle(container);
  const el = container.firstElementChild as T | null;
  if (!el) throw new Error('[QA] fixture rendered nothing');
  return el;
}

/** Sets properties (simulates the controlled consumer) and waits for the update. */
export async function setProps<T extends Element>(el: T, props: Record<string, unknown>): Promise<T> {
  Object.assign(el, props);
  await settle();
  return el;
}

export function cleanupFixtures(): void {
  for (const c of containers) {
    render(nothing, c);
    c.remove();
  }
  containers.clear();
  document.querySelectorAll('[data-qa-sentinel]').forEach((s) => s.remove());
}

export function shadow(el: Element): ShadowRoot {
  if (!el.shadowRoot) throw new Error(`[QA] <${el.localName}> has no open shadow root (UX §1.5 requires mode: 'open')`);
  return el.shadowRoot;
}
export function $<E extends Element = HTMLElement>(el: Element, selector: string): E {
  const found = shadow(el).querySelector<E>(selector);
  if (!found) throw new Error(`[QA] <${el.localName}>: "${selector}" not found in shadow root`);
  return found;
}
export function $maybe<E extends Element = HTMLElement>(el: Element, selector: string): E | null {
  return el.shadowRoot?.querySelector<E>(selector) ?? null;
}
export function $$<E extends Element = HTMLElement>(el: Element, selector: string): E[] {
  return Array.from(shadow(el).querySelectorAll<E>(selector));
}
export function part<E extends Element = HTMLElement>(el: Element, name: string): E {
  return $<E>(el, `[part~="${name}"]`);
}
export function partMaybe<E extends Element = HTMLElement>(el: Element, name: string): E | null {
  return $maybe<E>(el, `[part~="${name}"]`);
}
export function parts<E extends Element = HTMLElement>(el: Element, name: string): E[] {
  return $$<E>(el, `[part~="${name}"]`);
}
export function isRendered(el: Element | null): boolean {
  if (!el) return false;
  if ((el as HTMLElement).hidden || el.closest('[hidden]')) return false;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
}
export function flatText(el: Element): string {
  return ((el as HTMLElement).innerText ?? el.textContent ?? '').replace(/\s+/g, ' ').trim();
}
