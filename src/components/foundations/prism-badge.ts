import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A small status indicator component, styled with glassmorphism.
 * Used to display states like success, warning, error, or info within tables or cards.
 */
@customElement('prism-badge')
export class PrismBadge extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }
    `
  ];

  /**
   * The status variant of the badge which determines its color scheme.
   */
  @property({ type: String }) variant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';

  render() {
    let variantClasses = 'bg-slate-500/20 text-slate-700 dark:text-slate-200 border-slate-500/20'; // default

    switch (this.variant) {
      case 'success':
        variantClasses = 'bg-green-500/20 text-green-800 dark:text-green-200 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]';
        break;
      case 'warning':
        variantClasses = 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
        break;
      case 'error':
        variantClasses = 'bg-red-500/20 text-red-800 dark:text-red-200 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
        break;
      case 'info':
        variantClasses = 'bg-blue-500/20 text-blue-800 dark:text-blue-200 border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.2)]';
        break;
    }

    return html`
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border ${variantClasses}">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-badge': PrismBadge;
  }
}
