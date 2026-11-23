/**
 * Viewport, media emulation and geometry helpers (mobile first: ux-spec §1.6, §1.6.1; WCAG 2.5.8, 1.4.10).
 */
import { expect } from 'vitest';
import { page, cdp } from 'vitest/browser';
import { isChromium } from './a11y';
import { containsDeep } from './focus';

export const MOBILE = { width: 390, height: 844 } as const;
export const DESKTOP = { width: 1280, height: 800 } as const;

type MediaFeature = { name: string; value: string };

/** Emulates media features (Chromium CDP). No-op elsewhere; callers that depend on it must skip. */
export async function emulateMedia(features: MediaFeature[]) {
  if (!isChromium()) return false;
  await cdp().send('Emulation.setEmulatedMedia', { features });
  return true;
}

/** Mobile profile required by Fabrizio: 390x844 viewport, touch, pointer: coarse, hover: none. */
export async function useMobile() {
  await page.viewport(MOBILE.width, MOBILE.height);
  if (isChromium()) {
    await cdp().send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await emulateMedia([
      { name: 'pointer', value: 'coarse' },
      { name: 'any-pointer', value: 'coarse' },
      { name: 'hover', value: 'none' },
      { name: 'any-hover', value: 'none' },
    ]);
  }
}

export async function useDesktop() {
  await page.viewport(DESKTOP.width, DESKTOP.height);
  if (isChromium()) {
    await cdp().send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await emulateMedia([]);
  }
}

/** True when the browser really matches pointer: coarse (emulation worked). */
export const isCoarse = () => matchMedia('(pointer: coarse)').matches;

function deepElementFromPoint(x: number, y: number): Element | null {
  let el = document.elementFromPoint(x, y);
  while (el?.shadowRoot) {
    const inner = el.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === el) break;
    el = inner;
  }
  return el;
}

function hits(target: Element, x: number, y: number) {
  const e = deepElementFromPoint(x, y);
  return !!e && containsDeep(target, e);
}

/**
 * Effective hit area of a target, measured by hit-testing from its center
 * (includes pseudo-element / padding extensions, excludes box-shadow, as a11y-checklist §3.3 requires).
 */
export function targetSize(target: Element): { width: number; height: number } {
  (target as HTMLElement).scrollIntoView?.({ block: 'center', inline: 'center' });
  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  if (!hits(target, cx, cy)) return { width: 0, height: 0 };
  const extent = (dx: number, dy: number) => {
    let d = 0;
    while (d < 120 && hits(target, cx + dx * (d + 1), cy + dy * (d + 1))) d++;
    return d;
  };
  return { width: extent(-1, 0) + extent(1, 0) + 1, height: extent(0, -1) + extent(0, 1) + 1 };
}

export function expectTargetAtLeast(target: Element, min: number, label = target.localName) {
  const s = targetSize(target);
  expect(s.width, `${label}: hit width ${s.width} < ${min}`).toBeGreaterThanOrEqual(min - 0.5);
  expect(s.height, `${label}: hit height ${s.height} < ${min}`).toBeGreaterThanOrEqual(min - 0.5);
}

/** WCAG 1.4.10: no horizontal scroll of the page. */
export function expectNoPageHorizontalScroll() {
  const de = document.documentElement;
  expect(de.scrollWidth, `page scrollWidth ${de.scrollWidth} > clientWidth ${de.clientWidth}`).toBeLessThanOrEqual(
    de.clientWidth + 1,
  );
}

/** The element fits within the viewport width. */
export function expectFitsViewport(el: Element) {
  const r = el.getBoundingClientRect();
  expect(r.left).toBeGreaterThanOrEqual(-1);
  expect(r.right).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
}
