import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A smooth, animated switch for boolean settings (on/off) styled with Glassmorphism.
 * Fully accessible via keyboard and screen readers.
 */
@customElement('prism-toggle')
export class PrismToggle extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
      }
    `
  ];

  /**
   * The current checked state of the toggle.
   */
  @property({ type: Boolean }) checked = false;

  /**
   * Disables the toggle.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Accessible label for the toggle.
   */
  @property({ type: String }) ariaLabel = 'Toggle switch';

  private _toggle(e: Event) {
    if (this.disabled) return;
    e.preventDefault();
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked } }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggle(e);
    }
  }

  render() {
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const trackClass = this.checked
      ? 'bg-blue-500/60 border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
      : 'bg-slate-300/30 dark:bg-slate-700/50 border-slate-400/30 dark:border-slate-500/30';
    
    const thumbPositionClass = this.checked ? 'translate-x-5' : 'translate-x-1';

    return html`
      <button
        type="button"
        role="switch"
        aria-checked="${this.checked}"
        aria-label="${this.ariaLabel}"
        ?disabled="${this.disabled}"
        @click="${this._toggle}"
        @keydown="${this._handleKeyDown}"
        class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 backdrop-blur-sm ${disabledClass} ${trackClass}"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${thumbPositionClass}"
        ></span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-toggle': PrismToggle;
  }
}
