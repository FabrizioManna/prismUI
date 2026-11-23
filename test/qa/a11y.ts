/**
 * Accessibility helpers: axe-core (a11y-checklist §5.1) and Chromium's real accessibility tree via CDP.
 */
import axe from 'axe-core';
import { cdp, server } from 'vitest/browser';
import { expect } from 'vitest';

/** Tags required by a11y-checklist §5.1 (wcag22aa enables target-size). */
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export interface AxeOptions {
  /** Impacts that fail the test. Default: serious + critical (criterion AC-<X>-00). */
  impacts?: Array<'minor' | 'moderate' | 'serious' | 'critical'>;
  /** Rules to disable, each with a written reason in the calling test. */
  disableRules?: string[];
}

export async function runAxe(context: Element | Document = document, options: AxeOptions = {}) {
  const rules: Record<string, { enabled: boolean }> = { 'target-size': { enabled: true } };
  for (const r of options.disableRules ?? []) rules[r] = { enabled: false };
  return axe.run(context as Element, {
    runOnly: { type: 'tag', values: AXE_TAGS },
    rules,
    resultTypes: ['violations', 'incomplete'],
  });
}

/** AC-<X>-00: zero serious/critical axe violations. "needs review" results are logged for manual follow-up. */
export async function expectNoAxeViolations(context: Element | Document = document, options: AxeOptions = {}) {
  const impacts = options.impacts ?? ['serious', 'critical'];
  const res = await runAxe(context, options);
  const bad = res.violations.filter((v) => impacts.includes(v.impact as never));
  if (res.incomplete.length) {
    // a11y-checklist §0: incomplete = to be verified manually, never a pass.
    console.info('[axe needs-review]', res.incomplete.map((i) => `${i.id} (${i.nodes.length})`).join(', '));
  }
  const report = bad
    .map((v) => `${v.impact} ${v.id}: ${v.help}\n  ${v.nodes.map((n) => JSON.stringify(n.target)).join('\n  ')}`)
    .join('\n');
  expect(bad.length, `axe violations:\n${report}`).toBe(0);
  return res;
}

export const isChromium = () => server.browser === 'chromium';

export interface AXInfo {
  role: string;
  name: string;
  description: string;
  ignored: boolean;
  props: Record<string, unknown>;
}

let axCounter = 0;
let axEnabled = false;

interface CdpNode {
  nodeId: number;
  backendNodeId: number;
  attributes?: string[];
  children?: CdpNode[];
  shadowRoots?: CdpNode[];
  contentDocument?: CdpNode;
}

function findCdpNode(node: CdpNode, token: string): CdpNode | null {
  const attrs = node.attributes ?? [];
  for (let i = 0; i < attrs.length; i += 2) if (attrs[i] === 'data-qa-ax' && attrs[i + 1] === token) return node;
  for (const c of [
    ...(node.shadowRoots ?? []),
    ...(node.children ?? []),
    ...(node.contentDocument ? [node.contentDocument] : []),
  ]) {
    const f = findCdpNode(c, token);
    if (f) return f;
  }
  return null;
}

async function backendIdOf(el: Element): Promise<number> {
  const token = `qa-${++axCounter}`;
  el.setAttribute('data-qa-ax', token);
  try {
    const { root } = await cdp().send('DOM.getDocument', { depth: -1, pierce: true });
    const node = findCdpNode(root as CdpNode, token);
    if (!node) throw new Error('[QA] element not found through CDP');
    return node.backendNodeId;
  } finally {
    el.removeAttribute('data-qa-ax');
  }
}

function toInfo(ax: any): AXInfo {
  return {
    role: ax?.role?.value ?? '',
    name: ax?.name?.value ?? '',
    description: ax?.description?.value ?? '',
    ignored: !!ax?.ignored,
    props: Object.fromEntries((ax?.properties ?? []).map((p: any) => [p.name, p.value?.value])),
  };
}

/**
 * Computed role/name/states of an element as Chromium exposes them to assistive technologies.
 * Works with ElementInternals roles (internals.role), which DOM attribute checks cannot see.
 * Chromium only: callers must skip on other engines (see `requireChromium`).
 */
export async function axInfo(el: Element): Promise<AXInfo> {
  const session = cdp();
  if (!axEnabled) {
    await session.send('Accessibility.enable');
    axEnabled = true;
  }
  const backendNodeId = await backendIdOf(el);
  const { nodes } = await session.send('Accessibility.getPartialAXTree', { backendNodeId, fetchRelatives: false });
  const own = (nodes as any[]).find((n) => n.backendDOMNodeId === backendNodeId) ?? (nodes as any[])[0];
  return toInfo(own);
}

/**
 * Accessible descendants of `el` (composed tree) with the given role and/or name (Chromium accessibility tree).
 * Generic hosts are often "ignored" nodes, so the query also starts from their light and shadow children.
 */
export async function axQuery(el: Element, query: { role?: string; accessibleName?: string }): Promise<AXInfo[]> {
  const session = cdp();
  if (!axEnabled) {
    await session.send('Accessibility.enable');
    axEnabled = true;
  }
  const starts: Element[] = [el, ...Array.from(el.children), ...Array.from(el.shadowRoot?.children ?? [])].filter(
    (e) => !['style', 'script', 'template'].includes(e.localName),
  );
  const seen = new Map<number, AXInfo>();
  for (const s of starts) {
    const backendNodeId = await backendIdOf(s);
    const { nodes } = await session.send('Accessibility.queryAXTree', { backendNodeId, ...query });
    for (const n of nodes as any[])
      if (!n.ignored && !seen.has(n.backendDOMNodeId)) seen.set(n.backendDOMNodeId, toInfo(n));
  }
  return [...seen.values()];
}

/** Skips the current test outside Chromium (CDP accessibility tree / media emulation). */
export function requireChromium(ctx: { skip: (note?: string) => void }) {
  if (!isChromium()) ctx.skip('requires Chromium CDP (accessibility tree / media emulation)');
}

/** True if the element (or an ancestor across shadow boundaries) is hidden from the accessibility tree. */
export function isAriaHiddenDeep(el: Element): boolean {
  let n: Node | null = el;
  while (n) {
    if (n instanceof Element) {
      if (n.getAttribute('aria-hidden') === 'true' || (n as HTMLElement).hidden || n.hasAttribute('inert')) return true;
      if (getComputedStyle(n).display === 'none') return true;
    }
    n = (n as Element).assignedSlot ?? n.parentNode ?? (n instanceof ShadowRoot ? n.host : null);
    if (n instanceof ShadowRoot) n = n.host;
  }
  return false;
}
