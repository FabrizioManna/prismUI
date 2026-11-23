/**
 * Typed prism-* events. Every event is `bubbles + composed`.
 *
 * Classes (architecture.md P.2, Manager decision 23/11):
 * - **requests** (`prism-change`, `prism-*-change`, `prism-open-request`, `prism-close-request`, `prism-navigate`,
 *   `prism-remove`, …) are cancelable. The component never applies a request, so `preventDefault()` only blocks
 *   native behaviour and internal previews (dialog `cancel`, link navigation, native events), never rolls back state.
 *   Exception: `prism-close-request` with `detail.forced: true` is not cancelable (the browser already closed).
 * - **drafts** (`prism-input`, `prism-search`) and **notifications** (`prism-open`, `prism-close`) are not cancelable.
 */

export type PrismInteractionSource = 'pointer' | 'keyboard' | 'touch' | 'api' | 'reset' | 'restore' | 'autocomplete';

/** Why a value request was emitted. */
export type PrismChangeReason =
  'user' | 'commit' | 'enter' | 'clear' | 'reset' | 'restore' | 'autocomplete' | 'select-all';

/** Request to change a value or selection (`prism-change`). The property does not change by itself. */
export interface PrismChangeDetail<T = unknown> {
  value: T;
  previousValue: T;
  source?: PrismInteractionSource;
  reason?: PrismChangeReason;
  /** Extra state carried by some components (checkbox: `checked`, `indeterminate`; button: `pressed`). */
  [extra: string]: unknown;
}

/** Continuous value proposal while typing or dragging (`prism-input`). */
export interface PrismInputDetail<T = unknown> {
  value: T;
  source?: PrismInteractionSource;
}

export type PrismOverlayReason =
  | 'trigger'
  | 'escape'
  | 'backdrop'
  | 'outside'
  | 'close-button'
  | 'select'
  | 'tab'
  | 'navigate'
  | 'action'
  | 'timeout'
  | 'swipe'
  | 'cancel'
  | 'pointer'
  | 'focus'
  | 'blur'
  | 'find'
  | 'property'
  | 'api';

/** Detail of `prism-open-request`, `prism-close-request`, `prism-open`, `prism-close`. */
export interface PrismOverlayDetail {
  reason: PrismOverlayReason;
  returnValue?: string;
  /** The browser already closed the overlay: the request is not cancelable and the owner must set `open = false`. */
  forced?: boolean;
}

export interface PrismSearchDetail {
  query: string;
}

export interface PrismClearDetail {
  previousValue: unknown;
}

export interface PrismRemoveDetail {
  value: unknown;
}

export type PrismSortDirection = 'ascending' | 'descending' | 'none';

export interface PrismSortChangeDetail {
  sort: { key: string; direction: PrismSortDirection }[];
}

export interface PrismFilterChangeDetail {
  filters: Record<string, unknown>;
  previousFilters: Record<string, unknown>;
}

export interface PrismPageChangeDetail {
  page: number;
  pageSize: number;
  previousPage: number;
  previousPageSize: number;
}

export interface PrismSelectionChangeDetail<K = string> {
  selectedKeys: K[];
  previousSelectedKeys: K[];
}

export interface PrismViewChangeDetail {
  viewMonth: string;
  previousViewMonth: string;
}

export interface PrismActionDetail {
  action: string;
  value?: unknown;
}

export interface PrismInvalidDetail {
  validity: ValidityState;
  message: string;
}

export interface PrismNavigateDetail {
  href: string;
}

/** Map of every prism-* event name to its detail type. Components may augment it. */
export interface PrismEventDetailMap {
  'prism-change': PrismChangeDetail;
  'prism-input': PrismInputDetail;
  'prism-open-request': PrismOverlayDetail;
  'prism-close-request': PrismOverlayDetail;
  'prism-open': PrismOverlayDetail;
  'prism-close': PrismOverlayDetail;
  'prism-sort-change': PrismSortChangeDetail;
  'prism-filter-change': PrismFilterChangeDetail;
  'prism-page-change': PrismPageChangeDetail;
  'prism-selection-change': PrismSelectionChangeDetail<unknown>;
  'prism-view-change': PrismViewChangeDetail;
  'prism-action': PrismActionDetail;
  'prism-invalid': PrismInvalidDetail;
  'prism-navigate': PrismNavigateDetail;
  'prism-search': PrismSearchDetail;
  'prism-clear': PrismClearDetail;
  'prism-remove': PrismRemoveDetail;
}

export type PrismEventName = keyof PrismEventDetailMap;

export interface PrismEventInit {
  /** Requests are cancelable by default; override for documented exceptions (forced close). */
  cancelable?: boolean;
  bubbles?: boolean;
  composed?: boolean;
}

declare global {
  interface HTMLElementEventMap {
    'prism-change': CustomEvent<PrismChangeDetail>;
    'prism-input': CustomEvent<PrismInputDetail>;
    'prism-open-request': CustomEvent<PrismOverlayDetail>;
    'prism-close-request': CustomEvent<PrismOverlayDetail>;
    'prism-open': CustomEvent<PrismOverlayDetail>;
    'prism-close': CustomEvent<PrismOverlayDetail>;
    'prism-sort-change': CustomEvent<PrismSortChangeDetail>;
    'prism-filter-change': CustomEvent<PrismFilterChangeDetail>;
    'prism-page-change': CustomEvent<PrismPageChangeDetail>;
    'prism-selection-change': CustomEvent<PrismSelectionChangeDetail<unknown>>;
    'prism-view-change': CustomEvent<PrismViewChangeDetail>;
    'prism-action': CustomEvent<PrismActionDetail>;
    'prism-invalid': CustomEvent<PrismInvalidDetail>;
    'prism-navigate': CustomEvent<PrismNavigateDetail>;
    'prism-search': CustomEvent<PrismSearchDetail>;
    'prism-clear': CustomEvent<PrismClearDetail>;
    'prism-remove': CustomEvent<PrismRemoveDetail>;
  }
}

/** Request events: cancelable by default (architecture.md P.2). */
export const PRISM_REQUEST_EVENTS: ReadonlySet<string> = new Set([
  'prism-change',
  'prism-open-request',
  'prism-close-request',
  'prism-sort-change',
  'prism-filter-change',
  'prism-page-change',
  'prism-selection-change',
  'prism-view-change',
  'prism-navigate',
  'prism-remove',
  'prism-clear',
]);

/**
 * Dispatches a typed prism-* CustomEvent from `target` (bubbles + composed).
 * @returns `false` if the event was cancelable and a listener called `preventDefault()`.
 */
export function emit<K extends PrismEventName>(
  target: EventTarget,
  name: K,
  detail: PrismEventDetailMap[K],
  init: PrismEventInit = {},
): boolean {
  const event = new CustomEvent(name, {
    detail,
    bubbles: init.bubbles ?? true,
    composed: init.composed ?? true,
    cancelable: init.cancelable ?? PRISM_REQUEST_EVENTS.has(name),
  });
  return target.dispatchEvent(event);
}
