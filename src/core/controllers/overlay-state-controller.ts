import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { PrismOverlayReason } from '../events.js';
import { emit } from '../events.js';

type OverlayHost = ReactiveControllerHost & HTMLElement & { open: boolean };

/**
 * Controlled open/close for overlays (modal, dropdown, menu, tooltip, pickers...), ux-spec.md §1.3.
 *
 * - `requestOpen(reason)` / `requestClose(reason)` only emit `prism-open-request` / `prism-close-request`.
 *   The overlay opens or closes when the consumer updates `open`.
 * - When `open` actually changes (from any source), emits `prism-open` / `prism-close` after the update,
 *   with the reason of the last request or `'api'`.
 */
export class OverlayStateController implements ReactiveController {
  private lastRequestReason: PrismOverlayReason | undefined;
  private previousOpen: boolean | undefined;

  constructor(private readonly host: OverlayHost) {
    host.addController(this);
  }

  requestOpen(reason: PrismOverlayReason): void {
    if (this.host.open) return;
    this.lastRequestReason = reason;
    emit(this.host, 'prism-open-request', { reason });
  }

  requestClose(reason: PrismOverlayReason, returnValue?: string): void {
    if (!this.host.open) return;
    this.lastRequestReason = reason;
    emit(this.host, 'prism-close-request', returnValue === undefined ? { reason } : { reason, returnValue });
  }

  hostConnected(): void {
    this.previousOpen = this.host.open;
  }

  hostUpdated(): void {
    const open = this.host.open;
    if (this.previousOpen === undefined) {
      this.previousOpen = open;
      return;
    }
    if (open === this.previousOpen) return;
    this.previousOpen = open;
    const reason = this.lastRequestReason ?? 'api';
    this.lastRequestReason = undefined;
    emit(this.host, open ? 'prism-open' : 'prism-close', { reason });
  }
}
