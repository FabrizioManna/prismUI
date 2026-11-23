/**
 * Baseline suite shared by every component (ux-spec §0 implicit criteria AC-<X>-00, §1.5, §1.6, §1.6.1).
 * Each component test file calls `baselineSuite()` once, then adds its own AC-specific tests.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { cleanupFixtures, settle } from './fixture';
import { expectNoAxeViolations, requireChromium } from './a11y';
import { addSentinels, hasFocusWithin, tab, expectVisibleFocusRing } from './focus';
import { useMobile, useDesktop, expectNoPageHorizontalScroll, expectTargetAtLeast, isCoarse } from './viewport';
import { page } from 'vitest/browser';

export interface BaselineOptions {
  /** Tag name, e.g. 'prism-button' */
  tag: string;
  /** AC prefix, e.g. 'BUTTON' */
  id: string;
  /** Renders a representative, fully labelled instance and returns the host. */
  render: () => Promise<Element>;
  /** Whether the component has a keyboard focus stop (false for badge, spinner, progress…). */
  focusable: boolean;
  /** Interactive targets to measure on touch (>= 44x44, UX §1.6). */
  touchTargets?: (host: Element) => Element[];
  /** axe rules disabled for a documented reason. */
  disableRules?: string[];
}

export function baselineSuite(o: BaselineOptions) {
  describe(`${o.tag} · baseline (AC-${o.id}-00, mobile first, focus)`, () => {
    afterEach(async () => {
      cleanupFixtures();
      await useDesktop();
    });

    it(`AC-${o.id}-00 axe wcag22aa: no serious/critical violations (desktop 1280x800)`, async () => {
      await useDesktop();
      const host = await o.render();
      await expectNoAxeViolations(host.parentElement ?? document, { disableRules: o.disableRules });
    });

    it(`AC-${o.id}-00 axe wcag22aa: no serious/critical violations (mobile 390x844, pointer: coarse)`, async () => {
      await useMobile();
      const host = await o.render();
      await settle();
      await expectNoAxeViolations(host.parentElement ?? document, { disableRules: o.disableRules });
    });

    it(`MOBILE ${o.tag}: no horizontal page scroll at 390x844 and at 320px (WCAG 1.4.10 reflow)`, async () => {
      await useMobile();
      await o.render();
      await settle();
      expectNoPageHorizontalScroll();
      await page.viewport(320, 844);
      await settle();
      expectNoPageHorizontalScroll();
    });

    if (o.touchTargets) {
      it(`MOBILE ${o.tag}: every touch target is >= 44x44 CSS px with pointer: coarse (UX §1.6)`, async (ctx) => {
        requireChromium(ctx);
        await useMobile();
        expect(isCoarse(), 'pointer: coarse emulation not active').toBe(true);
        const host = await o.render();
        await settle();
        const targets = o.touchTargets!(host);
        expect(targets.length, 'no touch targets found').toBeGreaterThan(0);
        for (const t of targets) expectTargetAtLeast(t, 44);
      });
    }

    it(`${o.tag}: registered, open shadow root, idempotent define()`, async () => {
      const host = await o.render();
      const ctor = customElements.get(o.tag) as unknown as { define?: () => void } | undefined;
      expect(ctor, `${o.tag} not registered`).toBeTruthy();
      expect(host.shadowRoot?.mode).toBe('open');
      expect(() => ctor!.define?.()).not.toThrow();
    });

    if (o.focusable) {
      it(`FOCUS ${o.tag}: Tab reaches the component and shows a visible >= 2px outline (F-1…F-3)`, async () => {
        const host = await o.render();
        const { before } = addSentinels(host);
        before.focus();
        await tab();
        expect(hasFocusWithin(host), 'Tab did not reach the component').toBe(true);
        expectVisibleFocusRing(host);
      });
    }
  });
}
