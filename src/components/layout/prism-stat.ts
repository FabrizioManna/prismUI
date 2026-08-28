import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A metric card for dashboards, supporting a trend indicator (arrow up/down).
 */
@customElement('prism-stat')
export class PrismStat extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  /**
   * The title or label of the metric.
   */
  @property({ type: String }) title = '';

  /**
   * The main value to display.
   */
  @property({ type: String }) value = '';

  /**
   * Optional trend string (e.g. "+5.4%" or "-2.1%").
   */
  @property({ type: String }) trend = '';

  render() {
    let trendIcon = '';
    let trendColorClass = 'text-slate-500 dark:text-slate-400';

    if (this.trend) {
      const isPositive = this.trend.startsWith('+');
      const isNegative = this.trend.startsWith('-');
      
      if (isPositive) {
        trendColorClass = 'text-green-600 dark:text-green-400';
        trendIcon = `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`;
      } else if (isNegative) {
        trendColorClass = 'text-red-600 dark:text-red-400';
        trendIcon = `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>`;
      }
    }

    return html`
      <div class="prism-glass p-6 flex items-start justify-between group transition-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        
        <div>
          <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">${this.title}</p>
          <h3 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">${this.value}</h3>
          
          ${this.trend ? html`
            <div class="flex items-center mt-2 text-sm font-medium ${trendColorClass}">
              <div .innerHTML="${trendIcon}"></div>
              <span>${this.trend}</span>
            </div>
          ` : ''}
        </div>

        <div class="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl text-blue-500 dark:text-blue-400 shadow-sm border border-slate-200/30 dark:border-slate-700/30">
          <slot name="icon"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-stat': PrismStat;
  }
}
