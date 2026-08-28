import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';
import { X } from 'lucide-static';
import '../foundations/prism-icon';

/**
 * A slide-out off-canvas drawer panel utilizing Glassmorphism.
 */
@customElement('prism-drawer')
export class PrismDrawer extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  /**
   * If true, the drawer is visible.
   */
  @property({ type: Boolean }) open = false;

  /**
   * The title in the drawer header.
   */
  @property({ type: String }) title = '';

  /**
   * Position of the drawer: 'left' or 'right' (default 'right').
   */
  @property({ type: String }) position: 'left' | 'right' = 'right';

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

    const positionClasses = this.position === 'left' 
      ? 'left-0 rounded-r-2xl border-r' 
      : 'right-0 rounded-l-2xl border-l';

    // Tailwind animate-in works best with classes, but for Lit conditional rendering,
    // we use absolute positioning and a slide-in animation.
    const slideInClass = this.position === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right';

    return html`
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        @click="${this._handleBackdropClick}"
        aria-modal="true"
        role="dialog"
      >
        <!-- Drawer Container -->
        <div class="fixed top-0 bottom-0 w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-white/40 dark:border-slate-700/50 shadow-2xl flex flex-col ${positionClasses} ${slideInClass}">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
              ${this.title}
              <slot name="header"></slot>
            </h3>
            <button 
              @click="${this._close}"
              class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close drawer"
            >
              <prism-icon .icon="${X}" size="20"></prism-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto flex-1">
            <slot></slot>
          </div>

          <!-- Footer -->
          ${this.querySelector('[slot="footer"]') ? html`
            <div class="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
              <slot name="footer"></slot>
            </div>
          ` : ''}

        </div>
      </div>
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-drawer': PrismDrawer;
  }
}
