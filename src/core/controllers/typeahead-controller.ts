/** Case- and accent-insensitive text key for typeahead matching. */
export function typeaheadKey(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}

/**
 * Typeahead for listboxes and menus (APG): printable keys accumulate in a buffer that resets after `delay` ms.
 * `match()` returns the index of the first enabled item whose label starts with the buffer, searching from the
 * active item (the next one for a single character, so repeated letters cycle).
 */
export class TypeaheadController {
  private buffer = '';
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly delay = 500) {}

  /** True for keys that feed the typeahead (single printable character, no modifier). */
  static accepts(event: KeyboardEvent): boolean {
    return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ';
  }

  match(key: string, labels: readonly string[], disabled: readonly boolean[], active: number): number {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.buffer = ''), this.delay);
    this.buffer += typeaheadKey(key);
    const n = labels.length;
    const start = this.buffer.length === 1 ? active + 1 : Math.max(active, 0);
    for (let i = 0; i < n; i++) {
      const idx = (((start + i) % n) + n) % n;
      if (!disabled[idx] && typeaheadKey(labels[idx] ?? '').startsWith(this.buffer)) return idx;
    }
    return -1;
  }

  reset(): void {
    clearTimeout(this.timer);
    this.buffer = '';
  }
}
