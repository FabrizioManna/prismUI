import type { ReactiveElement } from 'lit';

/**
 * Helpers for the controlled (stateless, presentational) component pattern (ux-spec.md §1.2).
 *
 * A component never assigns its own state properties (value, checked, open, page, sort...). On user
 * interaction it emits a request with the proposed value; the consumer decides and updates the property.
 * Only ephemeral state (focus, hover, active index, uncommitted text) lives inside the component.
 */

function findAccessor(obj: object, key: PropertyKey): PropertyDescriptor | undefined {
  let proto: object | null = Object.getPrototypeOf(obj);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, key);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
  return undefined;
}

/**
 * Runs `dispatch` while `host[key]` temporarily reads as `proposed` (ux-spec.md §1.3: during the native
 * `input`/`change` dispatch, `event.target.value` returns the proposed value so `v-model` / `ngModel`
 * can write it back). Writes made by listeners go to the real property. Afterwards the override is removed
 * and the host re-renders, so if nobody accepted the proposal the previous value is shown again.
 *
 * @returns whatever `dispatch` returns.
 */
export function withProposedValue<H extends ReactiveElement, K extends keyof H & string, R>(
  host: H,
  key: K,
  proposed: H[K],
  dispatch: () => R,
): R {
  const accessor = findAccessor(host, key);
  Object.defineProperty(host, key, {
    configurable: true,
    enumerable: true,
    get: () => proposed,
    set: (v: H[K]) => {
      if (accessor?.set) accessor.set.call(host, v);
      proposed = v;
    },
  });
  try {
    return dispatch();
  } finally {
    delete (host as Record<string, unknown>)[key];
    host.requestUpdate();
  }
}

/** Shallow equality used to skip no-op requests (e.g. clicking the already selected option). */
export function isSameValue(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  }
  return false;
}
