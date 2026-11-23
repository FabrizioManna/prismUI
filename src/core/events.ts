/**
 * Typed prism-* events: the registry of architecture.md §2.3 (the only source for event names).
 * An event that is not here does not exist. Every CustomEvent is `bubbles + composed`.
 *
 * Cancelable (architecture.md §2.3, §5.8): ONLY `prism-open-request`, `prism-close-request` (except
 * `detail.forced: true`, the browser already closed the overlay) and `prism-navigate`. For requests,
 * `preventDefault()` blocks native behaviour (navigation, dialog `cancel`) and never rolls state back.
 * `prism-change` and every `prism-*-change` are NOT cancelable: a value is refused by not updating the property.
 */

/** Why a value was proposed (`prism-change`); each component documents its subset. */
export type PrismChangeReason =
  | 'commit'
  | 'enter'
  | 'clear'
  | 'reset'
  | 'restore'
  | 'autocomplete'
  | 'select'
  | 'select-all'
  | 'remove'
  | 'click'
  | 'keyboard'
  | 'drag'
  | 'track'
  | 'typed'
  | 'step'
  | 'pick'
  | 'drop'
  | 'paste';

/**
 * Proposed value or selection (`prism-change`). The property does not change by itself.
 * Boolean controls also carry `checked` / `pressed` / `selected` (and `indeterminate` for checkbox).
 */
export interface PrismChangeDetail<T = unknown> {
  value: T;
  previousValue: T;
  reason: PrismChangeReason;
  checked?: boolean;
  indeterminate?: boolean;
  pressed?: boolean;
  selected?: boolean;
  /** Component-specific extras (e.g. file-upload `files`, `added`, `removed`, `rejected`). */
  [extra: string]: unknown;
}

/** Draft value while typing or dragging (`prism-input`). */
export interface PrismInputDetail<T = unknown> {
  value: T;
}

export type PrismOverlayReason =
  | 'trigger'
  | 'keyboard'
  | 'typing'
  | 'context-menu'
  | 'hover'
  | 'focus'
  | 'long-press'
  | 'tap'
  | 'escape'
  | 'backdrop'
  | 'outside'
  | 'tap-outside'
  | 'close-button'
  | 'select'
  | 'tab'
  | 'swipe'
  | 'cancel'
  | 'form'
  | 'navigate'
  | 'pointer'
  | 'blur'
  | 'api'
  | 'property';

/** Detail of `prism-open-request` and `prism-close-request`. */
export interface PrismOverlayRequestDetail {
  reason: PrismOverlayReason;
  /** Close only: the browser already closed the overlay; not cancelable, the owner must set `open = false`. */
  forced?: boolean;
  returnValue?: string;
  target?: Element;
}

/** Detail of `prism-open` / `prism-close` (overlays); toasts send `{ id }`. */
export interface PrismOverlayDetail {
  reason?: PrismOverlayReason;
  id?: string;
}

export interface PrismSearchDetail {
  query: string;
}

export type PrismSortDirection = 'ascending' | 'descending' | 'none';
export interface PrismSort {
  column: string;
  direction: PrismSortDirection;
}

/** Datatable query snapshot carried by sort/filter/page events. */
export type PrismQuery = Record<string, unknown>;

export interface PrismSortChangeDetail {
  sort: PrismSort[];
  previousSort: PrismSort[];
  column: string;
  query: PrismQuery;
}

export interface PrismFilterChangeDetail {
  filters: Record<string, unknown>;
  search: string;
  previousFilters: Record<string, unknown>;
  previousSearch: string;
  column?: string;
  query: PrismQuery;
}

export interface PrismPageChangeDetail {
  page: number;
  previousPage: number;
  query?: PrismQuery;
}

export interface PrismPageSizeChangeDetail {
  pageSize: number;
  previousPageSize: number;
  /** Suggested page for the owner after a page-size change (always 1). */
  page: 1;
  query?: PrismQuery;
}

export interface PrismSelectionChangeDetail {
  selected: string[];
  previousSelected: string[];
  allPagesSelected: boolean;
  reason: 'row' | 'range' | 'all' | 'clear';
}

export interface PrismViewChangeDetail {
  viewMonth: string;
  previousViewMonth: string;
  reason: 'prev' | 'next' | 'keyboard' | 'swipe';
}

export interface PrismExpandedChangeDetail {
  expanded: boolean | string[];
  previousExpanded?: boolean | string[];
  name?: string;
  reason: string;
}

export interface PrismCollapsedChangeDetail {
  collapsed: boolean;
}

export interface PrismCellChangeDetail {
  rowKey: string;
  columnKey: string;
  value: unknown;
  previousValue: unknown;
}

export interface PrismToastDismissDetail {
  id: string;
  reason: 'timeout' | 'close-button' | 'escape' | 'swipe';
}

/** Commands: menu `{ value, item }`, toast `{ id }`, datatable `{ action, rowKey?, rowKeys? }`. */
export interface PrismActionDetail {
  value?: string;
  item?: Element;
  id?: string;
  action?: string;
  rowKey?: string;
  rowKeys?: string[];
}

export interface PrismNavigateDetail {
  href: string;
  originalEvent?: Event;
  index?: number;
}

/** tab `{ name }`, badge/select tag `{ value }`, file-upload `{ file }`. */
export interface PrismRemoveDetail {
  name?: string;
  value?: string;
  file?: File;
}

export interface PrismInvalidDetail {
  validity?: ValidityState;
  message?: string;
  /** Pickers: rejected typed text and why. */
  input?: string;
  reason?: string;
}

export type PrismEmptyDetail = Record<string, never>;

export interface PrismImageDetail {
  src: string;
}

/** Map of every prism-* event name (architecture.md §2.3) to its detail type. */
export interface PrismEventDetailMap {
  'prism-change': PrismChangeDetail;
  'prism-input': PrismInputDetail;
  'prism-search': PrismSearchDetail;
  'prism-sort-change': PrismSortChangeDetail;
  'prism-filter-change': PrismFilterChangeDetail;
  'prism-page-change': PrismPageChangeDetail;
  'prism-page-size-change': PrismPageSizeChangeDetail;
  'prism-selection-change': PrismSelectionChangeDetail;
  'prism-view-change': PrismViewChangeDetail;
  'prism-expanded-change': PrismExpandedChangeDetail;
  'prism-collapsed-change': PrismCollapsedChangeDetail;
  'prism-cell-change': PrismCellChangeDetail;
  'prism-open-request': PrismOverlayRequestDetail;
  'prism-close-request': PrismOverlayRequestDetail;
  'prism-open': PrismOverlayDetail;
  'prism-close': PrismOverlayDetail;
  'prism-toast-dismiss': PrismToastDismissDetail;
  'prism-action': PrismActionDetail;
  'prism-navigate': PrismNavigateDetail;
  'prism-remove': PrismRemoveDetail;
  'prism-invalid': PrismInvalidDetail;
  'prism-retry': PrismEmptyDetail;
  'prism-load': PrismImageDetail;
  'prism-error': PrismImageDetail;
  'prism-complete': PrismEmptyDetail;
}

export type PrismEventName = keyof PrismEventDetailMap;

export interface PrismEventInit {
  /** Overrides the registry default (only for `prism-close-request` with `forced`). */
  cancelable?: boolean;
}

type PrismEventMap = { [K in PrismEventName]: CustomEvent<PrismEventDetailMap[K]> };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface HTMLElementEventMap extends PrismEventMap {}
}

/** Cancelable events (architecture.md §2.3). Everything else is not cancelable. */
export const PRISM_CANCELABLE_EVENTS: ReadonlySet<PrismEventName> = new Set<PrismEventName>([
  'prism-open-request',
  'prism-close-request',
  'prism-navigate',
]);

/**
 * Dispatches a typed prism-* CustomEvent from `target` (bubbles + composed).
 * `prism-close-request` with `detail.forced` is never cancelable.
 * @returns `false` if the event was cancelable and a listener called `preventDefault()`.
 */
export function emit<K extends PrismEventName>(
  target: EventTarget,
  name: K,
  detail: PrismEventDetailMap[K],
  init: PrismEventInit = {},
): boolean {
  const forced = (detail as { forced?: boolean }).forced === true;
  const event = new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: !forced && (init.cancelable ?? PRISM_CANCELABLE_EVENTS.has(name)),
  });
  return target.dispatchEvent(event);
}
