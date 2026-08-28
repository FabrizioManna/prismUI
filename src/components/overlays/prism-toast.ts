import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-static';
import '../foundations/prism-icon';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * A floating notification (snackbar) component utilizing Glassmorphism.
 */
@customElement('prism-toast')
export class PrismToast extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        /* Positioned via external container usually, but works inline too */
      }
      .animate-toast-in {
        animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1), fadeIn 0.3s ease-out;
      }
      @keyframes slideInUp {
        from { transform: translateY(20px); }
        to { transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `
  ];

  /**
   * The variant determining the icon and color scheme.
   */
  @property({ type: String }) variant: ToastVariant = 'info';

  /**
   * The main message title.
   */
  @property({ type: String }) title = '';

  /**
   * A more detailed description.
   */
  @property({ type: String }) description = '';

  /**
   * Automatically close after X milliseconds. 0 disables auto-close.
   */
  @property({ type: Number }) duration = 5000;

  /**
   * If true, the toast is visible.
   */
  @property({ type: Boolean }) open = false;

  private _timer: ReturnType<typeof setTimeout> | null = null;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('open') && this.open) {
      if (this.duration > 0) {
        if (this._timer) clearTimeout(this._timer);
        this._timer = setTimeout(() => this._close(), this.duration);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer) clearTimeout(this._timer);
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  render() {
    if (!this.open) return html``;

    let iconSvg = Info;
    let iconColor = 'text-blue-500';
    let borderColor = 'border-blue-500/50';

    switch (this.variant) {
      case 'success':
        iconSvg = CheckCircle;
        iconColor = 'text-green-500';
        borderColor = 'border-green-500/50';
        break;
      case 'error':
        iconSvg = AlertCircle;
        iconColor = 'text-red-500';
        borderColor = 'border-red-500/50';
        break;
      case 'warning':
        iconSvg = AlertTriangle;
        iconColor = 'text-amber-500';
        borderColor = 'border-amber-500/50';
        break;
    }

    return html`
      <div class="pointer-events-auto flex w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden border ${borderColor} animate-toast-in ring-1 ring-black/5 dark:ring-white/10">
        <div class="p-4 flex items-start w-full">
          <div class="flex-shrink-0 ${iconColor} mt-0.5">
            <prism-icon .icon="${iconSvg}" size="20"></prism-icon>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            ${this.title ? html`<p class="text-sm font-semibold text-slate-800 dark:text-slate-100">${this.title}</p>` : ''}
            ${this.description ? html`<p class="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${this.description}</p>` : ''}
            <slot></slot>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button 
              type="button" 
              @click="${this._close}"
              class="inline-flex rounded-md bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <span class="sr-only">Close</span>
              <prism-icon .icon="${X}" size="16"></prism-icon>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-toast': PrismToast;
  }
}
