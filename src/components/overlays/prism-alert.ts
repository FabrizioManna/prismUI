import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-static';
import '../foundations/prism-icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * An in-page static banner for conveying important information.
 */
@customElement('prism-alert')
export class PrismAlert extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
      }
    `
  ];

  @property({ type: String }) variant: AlertVariant = 'info';
  @property({ type: String }) title = '';

  render() {
    let iconSvg = Info;
    let bgClass = 'bg-blue-50/50 dark:bg-blue-900/20';
    let borderClass = 'border-blue-200/50 dark:border-blue-800/50';
    let iconColor = 'text-blue-500 dark:text-blue-400';
    let titleColor = 'text-blue-800 dark:text-blue-200';

    switch (this.variant) {
      case 'success':
        iconSvg = CheckCircle;
        bgClass = 'bg-green-50/50 dark:bg-green-900/20';
        borderClass = 'border-green-200/50 dark:border-green-800/50';
        iconColor = 'text-green-500 dark:text-green-400';
        titleColor = 'text-green-800 dark:text-green-200';
        break;
      case 'error':
        iconSvg = AlertCircle;
        bgClass = 'bg-red-50/50 dark:bg-red-900/20';
        borderClass = 'border-red-200/50 dark:border-red-800/50';
        iconColor = 'text-red-500 dark:text-red-400';
        titleColor = 'text-red-800 dark:text-red-200';
        break;
      case 'warning':
        iconSvg = AlertTriangle;
        bgClass = 'bg-amber-50/50 dark:bg-amber-900/20';
        borderClass = 'border-amber-200/50 dark:border-amber-800/50';
        iconColor = 'text-amber-500 dark:text-amber-400';
        titleColor = 'text-amber-800 dark:text-amber-200';
        break;
    }

    return html`
      <div class="prism-glass p-4 ${bgClass} ${borderClass}">
        <div class="flex">
          <div class="flex-shrink-0 ${iconColor}">
            <prism-icon .icon="${iconSvg}" size="20"></prism-icon>
          </div>
          <div class="ml-3">
            ${this.title ? html`<h3 class="text-sm font-medium ${titleColor}">${this.title}</h3>` : ''}
            <div class="mt-2 text-sm text-slate-700 dark:text-slate-300">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-alert': PrismAlert;
  }
}
