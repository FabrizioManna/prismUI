import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Accessible name bridge for controls rendered inside the shadow root (architecture.md §5.6):
 * - `aria-label` / `aria-description` set by the consumer on the host are moved to the inner control
 *   (and removed from the host, to avoid a duplicated name);
 * - text of external `<label for="host-id">` (via `internals.labels`) is copied to the inner control's
 *   `aria-label` when the component has no own label.
 * `referenceTarget` would make this unnecessary where supported (Chrome 152+).
 */
export class AriaMirror implements ReactiveController {
  /** Name taken from the host or from external labels (read it in render). */
  hostLabel = '';
  private observer?: MutationObserver;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly internals: () => ElementInternals | undefined,
  ) {
    host.addController(this);
  }

  private sync = () => {
    const own = this.host.getAttribute('aria-label');
    if (own !== null) {
      this.hostLabel = own;
      this.host.removeAttribute('aria-label');
      this.host.requestUpdate();
      return;
    }
    const labels = this.internals()?.labels;
    const text = labels
      ? [...labels]
          .map((l) => (l.textContent ?? '').trim())
          .filter(Boolean)
          .join(' ')
      : '';
    if (text && text !== this.hostLabel) {
      this.hostLabel = text;
      this.host.requestUpdate();
    }
  };

  hostConnected(): void {
    this.sync();
    this.observer = new MutationObserver(this.sync);
    this.observer.observe(this.host, { attributes: true, attributeFilter: ['aria-label', 'id'] });
    // Labels may be connected after the host.
    queueMicrotask(this.sync);
  }

  hostDisconnected(): void {
    this.observer?.disconnect();
  }
}
