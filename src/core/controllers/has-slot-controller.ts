import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Knows whether slots have content (to show/hide label, help-text, prefix…), without layout shift.
 * Use `'[default]'` for the default slot.
 */
export class HasSlotController implements ReactiveController {
  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly slotNames: string[],
  ) {
    host.addController(this);
  }

  private readonly onSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const name = slot.name || '[default]';
    if (this.slotNames.includes(name)) this.host.requestUpdate();
  };

  /** True if the named slot (or `'[default]'`) has assigned elements or non-blank text. */
  test(name: string): boolean {
    if (name === '[default]') {
      return [...this.host.childNodes].some(
        (n) =>
          (n.nodeType === Node.TEXT_NODE && n.textContent!.trim() !== '') ||
          (n.nodeType === Node.ELEMENT_NODE && !(n as Element).hasAttribute('slot')),
      );
    }
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }

  hostConnected(): void {
    this.host.shadowRoot?.addEventListener('slotchange', this.onSlotChange);
  }

  hostUpdated(): void {
    // The shadow root exists after the first render.
    this.host.shadowRoot?.addEventListener('slotchange', this.onSlotChange);
  }

  hostDisconnected(): void {
    this.host.shadowRoot?.removeEventListener('slotchange', this.onSlotChange);
  }
}
