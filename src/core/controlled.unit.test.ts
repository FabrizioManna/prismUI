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
  it('prism-change is bubbles + composed and NOT cancelable (architecture.md §2.3)', () => {
    const target = new EventTarget();
    let received: CustomEvent | undefined;
    target.addEventListener('prism-change', (e) => (received = e as CustomEvent));
    emit(target, 'prism-change', { value: 2, previousValue: 1, reason: 'commit' });
    expect(received?.detail).toEqual({ value: 2, previousValue: 1, reason: 'commit' });
    expect(received?.bubbles).toBe(true);
    expect(received?.composed).toBe(true);
    expect(received?.cancelable).toBe(false);
  });

  it('only open/close requests and prism-navigate are cancelable; forced close is not', () => {
    const target = new EventTarget();
    const seen: Record<string, boolean> = {};
    const record = (key: string) => (e: Event) => (seen[key] = e.cancelable);
    target.addEventListener('prism-open-request', record('open-request'));
    target.addEventListener('prism-navigate', record('navigate'));
    target.addEventListener('prism-input', record('input'));
    target.addEventListener('prism-page-change', record('page-change'));
    target.addEventListener('prism-open', record('open'));
    target.addEventListener(
      'prism-close-request',
      (e) => (seen[(e as CustomEvent).detail.forced ? 'forced' : 'close-request'] = e.cancelable),
    );
    emit(target, 'prism-open-request', { reason: 'trigger' });
    emit(target, 'prism-close-request', { reason: 'escape' });
    emit(target, 'prism-close-request', { reason: 'cancel', forced: true });
    emit(target, 'prism-navigate', { href: '/x' });
    emit(target, 'prism-input', { value: 'a' });
    emit(target, 'prism-page-change', { page: 2, previousPage: 1 });
    emit(target, 'prism-open', { reason: 'trigger' });
    expect(seen).toEqual({
      'open-request': true,
      'close-request': true,
      forced: false,
      navigate: true,
      input: false,
      'page-change': false,
      open: false,
    });
  });

  it('returns false when a cancelable request is canceled', () => {
    const target = new EventTarget();
    target.addEventListener('prism-navigate', (e) => e.preventDefault());
    expect(emit(target, 'prism-navigate', { href: '/x' })).toBe(false);
  });
});
