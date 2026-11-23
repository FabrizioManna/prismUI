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
  it('dispatches bubbles + composed, not cancelable by default', () => {
    const target = new EventTarget();
    let received: CustomEvent | undefined;
    target.addEventListener('prism-change', (e) => (received = e as CustomEvent));
    emit(target, 'prism-change', { value: 2, previousValue: 1 });
    expect(received?.detail).toEqual({ value: 2, previousValue: 1 });
    expect(received?.bubbles).toBe(true);
    expect(received?.composed).toBe(true);
    expect(received?.cancelable).toBe(false);
  });

  it('makes prism-navigate cancelable (the only exception, ux-spec §1.3)', () => {
    const target = new EventTarget();
    target.addEventListener('prism-navigate', (e) => e.preventDefault());
    expect(emit(target, 'prism-navigate', { href: '/x' })).toBe(false);
  });
});
