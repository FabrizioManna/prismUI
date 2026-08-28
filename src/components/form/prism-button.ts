import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A highly customizable button component tailored for Glassmorphism interfaces.
 * Supports various variants, sizes, and states (including a loading spinner).
 */
@customElement('prism-button')
export class PrismButton extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }
      /* Simple CSS spinner */
      .spinner {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
  ];

  /**
   * The visual style variant of the button.
   */
  @property({ type: String }) variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';

  /**
   * The size of the button.
   */
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Disables the button.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Shows a loading spinner and disables the button.
   */
  @property({ type: Boolean }) loading = false;

  /**
   * Button type attribute (button, submit, reset).
   */
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    // Base layout and transition styles
    const baseClasses = "relative overflow-hidden rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md border flex items-center justify-center gap-2";
    
    // Size variants
    let sizeClasses = "px-4 py-2 text-sm"; // md default
    if (this.size === 'sm') sizeClasses = "px-3 py-1.5 text-xs";
    else if (this.size === 'lg') sizeClasses = "px-6 py-3 text-base";

    // Color variants (Glassmorphism styles)
    let variantClasses = "";
    switch (this.variant) {
      case 'primary':
        // High contrast rule: text-white on dark background
        variantClasses = "bg-blue-600/50 hover:bg-blue-600/60 border border-blue-500/40 text-white focus:ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]";
        break;
      case 'secondary':
        // Light bg: dark text in light mode, light text in dark mode
        variantClasses = "bg-white/30 hover:bg-white/40 dark:bg-slate-800/50 dark:hover:bg-slate-700/60 border border-slate-300/40 dark:border-slate-600/40 text-slate-900 dark:text-white focus:ring-slate-400/50 shadow-sm";
        break;
      case 'danger':
        // High contrast rule: text-white on dark red background
        variantClasses = "bg-red-600/50 hover:bg-red-600/60 border border-red-500/40 text-white focus:ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
        break;
      case 'ghost':
        variantClasses = "bg-transparent hover:bg-slate-200/30 dark:hover:bg-slate-700/30 border border-transparent text-slate-800 dark:text-white focus:ring-slate-400/50";
        break;
    }

    // States
    const isDisabled = this.disabled || this.loading;
    const disabledClasses = isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]";

    return html`
      <button
        type=${this.type}
        ?disabled=${isDisabled}
        class="${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses}"
      >
        ${this.loading ? html`
          <svg class="spinner w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ` : html`
          <slot name="leading-icon"></slot>
        `}
        <slot></slot>
        ${!this.loading ? html`<slot name="trailing-icon"></slot>` : ''}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-button': PrismButton;
  }
}
