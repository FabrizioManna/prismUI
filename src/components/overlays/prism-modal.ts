import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';
import { X } from 'lucide-static';
import '../foundations/prism-icon';

/**
 * A centered dialog overlay utilizing Glassmorphism.
 */
@customElement('prism-modal')
export class PrismModal extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      /* Prevent scrolling on body when open, handled via JS usually but defined here for context */
    `
  ];

  /**
   * If true, the modal is visible.
   */
  @property({ type: Boolean }) open = false;

  /**
   * The title in the modal header.
   */
  @property({ type: String }) title = '';

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this._close();
    }
  }

  render() {
    if (!this.open) return html``;

    return html`
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        @click="${this._handleBackdropClick}"
        aria-modal="true"
        role="dialog"
      >
        <!-- Modal Container -->
        <div class="prism-glass relative w-[95%] sm:w-full sm:max-w-lg flex flex-col transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-300/40 dark:border-slate-600/50">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
              ${this.title}
              <slot name="header"></slot>
            </h3>
            <button 
              @click="${this._close}"
              class="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <prism-icon .icon="${X}" size="20"></prism-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <slot></slot>
          </div>

          <!-- Footer -->
          ${this.querySelector('[slot="footer"]') ? html`
            <div class="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-700/50 rounded-b-2xl">
              <slot name="footer"></slot>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-modal': PrismModal;
  }
}
