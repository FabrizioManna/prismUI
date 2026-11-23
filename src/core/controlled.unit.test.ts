import { describe, expect, it } from 'vitest';
import { isSameValue } from './controlled.js';
import { emit } from './events.js';

describe('isSameValue', () => {
  it('compares primitives with Object.is and arrays shallowly', () => {
    expect(isSameValue('a', 'a')).toBe(true);
    expect(isSameValue(NaN, NaN)).toBe(true);
    expect(isSameValue('a', 'b')).toBe(false);
    expect(isSameValue(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(isSameValue(['a'], ['a', 'b'])).toBe(false);
  });
});

describe('emit()', () => {
  it('dispatches requests as bubbles + composed + cancelable (architecture.md P.2)', () => {
    const target = new EventTarget();
    let received: CustomEvent | undefined;
    target.addEventListener('prism-change', (e) => (received = e as CustomEvent));
    emit(target, 'prism-change', { value: 2, previousValue: 1 });
    expect(received?.detail).toEqual({ value: 2, previousValue: 1 });
    expect(received?.bubbles).toBe(true);
    expect(received?.composed).toBe(true);
    expect(received?.cancelable).toBe(true);
  });

  it('drafts and notifications are not cancelable; a forced close request can opt out', () => {
    const target = new EventTarget();
    const seen: Record<string, boolean> = {};
    for (const n of ['prism-input', 'prism-open', 'prism-close-request'] as const)
      target.addEventListener(n, (e) => (seen[n] = e.cancelable));
    emit(target, 'prism-input', { value: 'a' });
    emit(target, 'prism-open', { reason: 'trigger' });
    emit(target, 'prism-close-request', { reason: 'escape', forced: true }, { cancelable: false });
    expect(seen).toEqual({ 'prism-input': false, 'prism-open': false, 'prism-close-request': false });
  });

  it('returns false when a request is canceled', () => {
    const target = new EventTarget();
    target.addEventListener('prism-navigate', (e) => e.preventDefault());
    expect(emit(target, 'prism-navigate', { href: '/x' })).toBe(false);
  });
});
