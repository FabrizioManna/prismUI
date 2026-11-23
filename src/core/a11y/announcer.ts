/**
 * Shared live regions in the document light DOM (ux-spec.md §1.9, a11y-checklist §1.2 rule 4).
 * Two regions (`polite` = role status, `assertive` = role alert) are created once, on first use or first
 * component connection, so that screen readers already track them when the first message arrives.
 */
export type PrismPoliteness = 'polite' | 'assertive';

const ATTR = 'data-prism-announcer';
let regions: Record<PrismPoliteness, HTMLElement> | undefined;
let clearTimer: ReturnType<typeof setTimeout> | undefined;

function createRegion(politeness: PrismPoliteness): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute(ATTR, politeness);
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  Object.assign(el.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    border: '0',
  });
  return el;
}

function ensureRegions(): Record<PrismPoliteness, HTMLElement> | undefined {
  if (typeof document === 'undefined' || !document.body) return undefined;
  if (regions && regions.polite.isConnected && regions.assertive.isConnected) return regions;
  const existing = (p: PrismPoliteness) => document.querySelector<HTMLElement>(`[${ATTR}="${p}"]`);
  regions = {
    polite: existing('polite') ?? document.body.appendChild(createRegion('polite')),
    assertive: existing('assertive') ?? document.body.appendChild(createRegion('assertive')),
  };
  return regions;
}

export const PrismAnnouncer = {
  /** Creates the live regions if missing (called by PrismElement on connect). */
  ensure(): void {
    ensureRegions();
  },

  /** Announces `message`. The text is cleared after a while so the same message can be repeated. */
  announce(message: string, { politeness = 'polite' as PrismPoliteness, clearAfter = 5000 } = {}): void {
    const r = ensureRegions();
    if (!r || !message) return;
    const region = r[politeness];
    region.textContent = '';
    // Next frame: changing text inside an existing live region is what screen readers announce.
    requestAnimationFrame(() => {
      region.textContent = message;
    });
    if (clearTimer) clearTimeout(clearTimer);
    clearTimer = setTimeout(() => {
      r.polite.textContent = '';
      r.assertive.textContent = '';
    }, clearAfter);
  },
};
