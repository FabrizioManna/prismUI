/**
 * Canonical event names: src/core/events.ts at commit 02a9fc6 + ux-spec v0.5 (Manager decision 23/11, 16:02).
 * architecture.md is NOT the source for events while it is being realigned. Rename HERE only.
 */
export const EV = {
  change: 'prism-change',
  input: 'prism-input',
  search: 'prism-search',
  openRequest: 'prism-open-request',
  closeRequest: 'prism-close-request',
  navigate: 'prism-navigate',
  open: 'prism-open',
  close: 'prism-close',
  sortChange: 'prism-sort-change',
  filterChange: 'prism-filter-change',
  pageChange: 'prism-page-change',
  pageSizeChange: 'prism-page-size-change',
  selectionChange: 'prism-selection-change',
  viewChange: 'prism-view-change',
  expandedChange: 'prism-expanded-change',
  collapsedChange: 'prism-collapsed-change',
  cellChange: 'prism-cell-change',
  toastDismiss: 'prism-toast-dismiss',
  remove: 'prism-remove',
  action: 'prism-action',
  retry: 'prism-retry',
  invalid: 'prism-invalid',
  load: 'prism-load',
  error: 'prism-error',
  complete: 'prism-complete',
} as const;

/** Names not admitted (removed from src/core/events.ts / ux-spec v0.5 §1.3): must never be dispatched. */
export const FORBIDDEN_EVENTS = [
  'prism-show',
  'prism-hide',
  'prism-toggle',
  'prism-toggle-request',
  'prism-before-open',
  'prism-tab-change',
  'prism-tab-close',
  'prism-sort',
  'prism-filter',
  'prism-select',
  'prism-query-change',
  'prism-month-change',
  'prism-collapse-change',
  'prism-group-toggle',
  'prism-menu-toggle',
  'prism-row-activate',
  'prism-toast-action',
  'prism-cell-edit',
  'prism-clear',
  'files-selected',
  'input-change',
] as const;

/**
 * The ONLY cancelable events (PRISM_CANCELABLE_EVENTS in src/core/events.ts @02a9fc6): prism-open-request,
 * prism-close-request (except detail.forced === true) and prism-navigate. prism-change and every
 * prism-*-change (and all other events) are NOT cancelable: the parent refuses a value by not updating the property.
 */
export const CANCELABLE_EVENTS: readonly string[] = ['prism-open-request', 'prism-close-request', 'prism-navigate'];

export function shouldBeCancelable(type: string, detail?: any): boolean {
  if (!CANCELABLE_EVENTS.includes(type)) return false;
  return !(type === 'prism-close-request' && detail?.forced === true);
}

export interface RecordedEvent {
  type: string;
  detail: any;
  event: Event;
  target: EventTarget | null;
}

const DEFAULT_TYPES = [...Object.values(EV), ...FORBIDDEN_EVENTS, 'input', 'change', 'click', 'submit', 'reset'];

/** Records events (capture phase) on `target` (default: document). */
export function recordEvents(target: EventTarget = document, types: readonly string[] = DEFAULT_TYPES) {
  const log: RecordedEvent[] = [];
  const handler = (e: Event) =>
    log.push({ type: e.type, detail: (e as CustomEvent).detail, event: e, target: e.target });
  for (const t of types) target.addEventListener(t, handler, { capture: true });
  return {
    log,
    of: (type: string) => log.filter((r) => r.type === type),
    count: (type: string) => log.filter((r) => r.type === type).length,
    last: (type: string) => [...log].reverse().find((r) => r.type === type),
    types: () => log.map((r) => r.type),
    clear: () => void (log.length = 0),
    stop: () => types.forEach((t) => target.removeEventListener(t, handler, { capture: true })),
  };
}

export function consumer<T extends Element>(
  el: T,
  type: string,
  apply: (el: T, detail: any, event: Event) => void,
): () => void {
  const h = (e: Event) => apply(el, (e as CustomEvent).detail, e);
  el.addEventListener(type, h);
  return () => el.removeEventListener(type, h);
}

export function nextEvent(target: EventTarget, type: string, timeout = 2000): Promise<Event> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`[QA] event "${type}" not received within ${timeout} ms`)), timeout);
    target.addEventListener(
      type,
      (e) => {
        clearTimeout(t);
        resolve(e);
      },
      { once: true },
    );
  });
}

/** Every prism-* event must bubble and be composed (src/core/events.ts @02a9fc6). */
export function assertEventShape(r: RecordedEvent): void {
  if (!r.type.startsWith('prism-')) return;
  if (!r.event.bubbles || !r.event.composed) {
    throw new Error(
      `[QA] ${r.type} must be bubbles+composed (bubbles=${r.event.bubbles}, composed=${r.event.composed})`,
    );
  }
}

/** Generic controlled consumer for the host: open/close requests → `open`, prism-change → value/checked/pressed/selected. */
export function controlledHost<T extends Element>(
  el: T,
  opts: { open?: boolean; change?: ((el: T, detail: any) => void) | false } = {},
) {
  const own = (fn: (t: T, d: any) => void) => (t: T, d: any, e: Event) => {
    if (e.target === el) fn(t, d);
  };
  const offs: Array<() => void> = [];
  if (opts.open !== false) {
    offs.push(
      consumer(
        el,
        EV.openRequest,
        own((t) => {
          (t as any).open = true;
        }),
      ),
    );
    offs.push(
      consumer(
        el,
        EV.closeRequest,
        own((t) => {
          (t as any).open = false;
        }),
      ),
    );
  }
  if (opts.change !== false) {
    const apply =
      opts.change ??
      ((t: T, d: any) => {
        for (const k of ['value', 'checked', 'pressed', 'selected']) if (d && k in d) (t as any)[k] = d[k];
      });
    offs.push(consumer(el, EV.change, own(apply)));
  }
  return () => offs.forEach((f) => f());
}

export function liveRegionText(): string {
  return Array.from(document.querySelectorAll('[role="status"], [role="alert"], [aria-live]'))
    .map((r) => r.textContent ?? '')
    .join(' | ')
    .replace(/\s+/g, ' ');
}

export async function waitForAnnouncement(matcher: RegExp, timeout = 1500): Promise<string> {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    const t = liveRegionText();
    if (matcher.test(t)) return t;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(
    `[QA] no live-region announcement matching ${matcher} within ${timeout} ms. Current: "${liveRegionText()}"`,
  );
}

/** Asserts `cancelable` matches PRISM_CANCELABLE_EVENTS for any prism-* event. */
export function expectCancelability(r: RecordedEvent | undefined): void {
  if (!r) throw new Error('[QA] event not emitted');
  if (!r.type.startsWith('prism-')) return;
  const want = shouldBeCancelable(r.type, r.detail);
  if (r.event.cancelable !== want) {
    throw new Error(
      `[QA] ${r.type}${r.detail?.forced ? ' (forced)' : ''} must ${want ? '' : 'NOT '}be cancelable (src/core/events.ts @02a9fc6)`,
    );
  }
}

/** prism-open-request / prism-close-request / prism-navigate: cancelable (close with detail.forced=true: not). */
export function expectCancelableRequest(r: RecordedEvent | undefined): void {
  if (!r) throw new Error('[QA] request event not emitted');
  if (!CANCELABLE_EVENTS.includes(r.type))
    throw new Error(`[QA] ${r.type} is not one of ${CANCELABLE_EVENTS.join(', ')}`);
  expectCancelability(r);
}

/** prism-change, prism-*-change and every other event: NOT cancelable. */
export function expectNotCancelable(r: RecordedEvent | undefined): void {
  if (!r) throw new Error('[QA] event not emitted');
  if (r.event.cancelable) throw new Error(`[QA] ${r.type} must NOT be cancelable (src/core/events.ts @02a9fc6)`);
}

/** Full contract for every recorded prism-* event: bubbles+composed, correct cancelability, no forbidden names. */
export function expectEventContract(log: readonly RecordedEvent[]): void {
  for (const r of log) {
    if ((FORBIDDEN_EVENTS as readonly string[]).includes(r.type))
      throw new Error(`[QA] forbidden event ${r.type} dispatched`);
    assertEventShape(r);
    expectCancelability(r);
  }
}

/** Calls preventDefault() on every event of `type` dispatched on `el` (to prove it never changes state). */
export function preventAll(el: EventTarget, type: string): () => void {
  const h = (e: Event) => e.preventDefault();
  el.addEventListener(type, h);
  return () => el.removeEventListener(type, h);
}

/**
 * Native-event contract (src/core/mixins/form-associated.ts @02a9fc6, ux-spec v0.5 §1.3): native `input`/`change`
 * are dispatched by the HOST synchronously right after the matching prism-* event, whether or not the owner applies
 * the value, and never for property changes, form reset or restore. Returns the ordered sub-sequence of
 * prism-input / prism-change / input / change dispatched on `host`.
 */
export function nativeSequence(log: readonly RecordedEvent[], host: EventTarget): string[] {
  return log
    .filter((r) => r.target === host && ['prism-input', 'prism-change', 'input', 'change'].includes(r.type))
    .map((r) => r.type);
}
