import type { ReactiveController, ReactiveControllerHost } from 'lit';

type DismissHost = ReactiveControllerHost & HTMLElement & { open: boolean };

/**
 * Light dismiss for controlled overlays: while `open`, a pointerdown outside the host calls `onOutside()`.
 * It never closes anything itself; the callback emits the close request.
 */
export class DismissController implements ReactiveController {
  private listening = false;
  private readonly onPointerDown = (event: PointerEvent) => {
    if (!this.host.open) return;
    if (!event.composedPath().includes(this.host)) this.onOutside(event);
  };

  constructor(
    private readonly host: DismissHost,
    private readonly onOutside: (event: PointerEvent) => void,
  ) {
    host.addController(this);
  }

  hostUpdated(): void {
    if (this.host.open && !this.listening) {
      document.addEventListener('pointerdown', this.onPointerDown, true);
      this.listening = true;
    } else if (!this.host.open && this.listening) this.hostDisconnected();
  }

  hostDisconnected(): void {
    document.removeEventListener('pointerdown', this.onPointerDown, true);
    this.listening = false;
  }
}
