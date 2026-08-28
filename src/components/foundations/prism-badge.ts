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
  @property({ type: String }) variant: 'success' | 'warning' | 'danger' | 'info' | 'default' = 'default';

  render() {
    let variantClasses = '';
    switch (this.variant) {
      case 'default':
        variantClasses = 'bg-slate-100/50 text-slate-800 dark:bg-slate-800/50 dark:text-slate-100 border-slate-200/50 dark:border-slate-700/50';
        break;
      case 'success':
        variantClasses = 'bg-green-600/50 text-white border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
        break;
      case 'warning':
        variantClasses = 'bg-yellow-500/50 text-white border-yellow-400/40 shadow-[0_0_8px_rgba(234,179,8,0.3)]';
        break;
      case 'danger':
        variantClasses = 'bg-red-600/50 text-white border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
        break;
      case 'info':
        variantClasses = 'bg-blue-600/50 text-white border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]';
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
