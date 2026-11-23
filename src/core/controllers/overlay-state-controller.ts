import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { PrismOverlayReason } from '../events.js';
import { emit } from '../events.js';

type OverlayHost = ReactiveControllerHost & HTMLElement & { open: boolean };

/**
 * Controlled open/close for overlays (modal, dropdown, menu, tooltip, pickers...), ux-spec.md §1.3.
 *
 * - `requestOpen(reason)` / `requestClose(reason)` only emit (cancelable) `prism-open-request` / `prism-close-request`.
 *   The overlay opens or closes when the consumer updates `open`.
 * - When `open` actually changes (from any source), emits `prism-open` / `prism-close` after the update,
 *   with the reason of the last request or `'property'`.
 */
export class OverlayStateController implements ReactiveController {
  private lastRequestReason: PrismOverlayReason | undefined;
  private previousOpen: boolean | undefined;

  constructor(private readonly host: OverlayHost) {
    host.addController(this);
  }

  /** Emits `prism-open-request` (cancelable). @returns false if already open or canceled. */
  requestOpen(reason: PrismOverlayReason): boolean {
    if (this.host.open) return false;
    this.lastRequestReason = reason;
    return emit(this.host, 'prism-open-request', { reason });
  }

  /**
   * Emits `prism-close-request`. With `forced` (the browser already closed a dialog) the request is not
   * cancelable: the owner must set `open = false`; the component re-syncs with the property meanwhile.
   * @returns false if already closed or canceled.
   */
  requestClose(reason: PrismOverlayReason, options: { returnValue?: string; forced?: boolean } = {}): boolean {
    if (!this.host.open) return false;
    this.lastRequestReason = reason;
    const detail = {
      reason,
      ...(options.returnValue !== undefined ? { returnValue: options.returnValue } : {}),
      ...(options.forced ? { forced: true } : {}),
    };
    return emit(this.host, 'prism-close-request', detail); // forced => not cancelable (events.ts)
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
    const reason = this.lastRequestReason ?? 'property';
    this.lastRequestReason = undefined;
    emit(this.host, open ? 'prism-open' : 'prism-close', { reason });
  }
}
