import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-button')
export class PrismButton extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }
    `
  ];

  @property({ type: String }) variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md border shadow-sm flex items-center justify-center gap-2";
    
    let variantClasses = "";
    if (this.variant === 'primary') {
      variantClasses = "bg-blue-500/30 hover:bg-blue-600/40 border-blue-400/30 text-blue-900 dark:text-blue-100 focus:ring-blue-500/50";
    } else if (this.variant === 'secondary') {
      variantClasses = "bg-white/30 hover:bg-white/40 dark:bg-slate-800/40 dark:hover:bg-slate-700/50 border-slate-300/30 dark:border-slate-600/30 text-slate-800 dark:text-slate-200 focus:ring-slate-400/50";
    } else if (this.variant === 'danger') {
      variantClasses = "bg-red-500/30 hover:bg-red-600/40 border-red-400/30 text-red-900 dark:text-red-100 focus:ring-red-500/50";
    }

    const disabledClasses = this.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        class="${baseClasses} ${variantClasses} ${disabledClasses}"
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-button': PrismButton;
  }
}
