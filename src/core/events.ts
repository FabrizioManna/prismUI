/**
 * Typed prism-* events. Every event is `bubbles + composed` and, per the UX spec (§1.3), NOT cancelable:
 * state events are *requests*; the consumer accepts one by updating the property, rejects it by doing nothing.
 * The only cancelable event is `prism-navigate`.
 */

export type PrismInteractionSource = 'pointer' | 'keyboard' | 'touch' | 'api';

/** Request to change a value or selection (`prism-change`). The property does not change by itself. */
export interface PrismChangeDetail<T = unknown> {
  value: T;
  previousValue: T;
  source?: PrismInteractionSource;
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
  | 'api';

/** Detail of `prism-open-request`, `prism-close-request`, `prism-open`, `prism-close`. */
export interface PrismOverlayDetail {
  reason: PrismOverlayReason;
  returnValue?: string;
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
}

export type PrismEventName = keyof PrismEventDetailMap;

export interface PrismEventInit {
  /** Only `prism-navigate` is cancelable by default; override for documented exceptions. */
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
  }
}

const CANCELABLE_BY_DEFAULT: ReadonlySet<string> = new Set(['prism-navigate']);

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
    cancelable: init.cancelable ?? CANCELABLE_BY_DEFAULT.has(name),
  });
  return target.dispatchEvent(event);
}
