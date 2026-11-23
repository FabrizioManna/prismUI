import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { PrismElement } from '../../src/core/prism-element.js';
import { OverlayStateController } from '../../src/core/controllers/overlay-state-controller.js';

/** Test-only controlled overlay: exercises OverlayStateController (NOT a public component). */
export class PrismTestOverlay extends PrismElement {
  static override tagName = 'prism-test-overlay';

  @property({ type: Boolean, reflect: true }) open = false;

  readonly overlay = new OverlayStateController(this);

  override render() {
    return html`<button part="trigger" @click=${() => this.overlay.requestOpen('trigger')}>Open</button>
      <div part="panel" ?hidden=${!this.open}>
        <button part="close" @click=${() => this.overlay.requestClose('close-button')}>Close</button>
      </div>`;
  }
}

PrismTestOverlay.define();

declare global {
  interface HTMLElementTagNameMap {
    'prism-test-overlay': PrismTestOverlay;
  }
}
