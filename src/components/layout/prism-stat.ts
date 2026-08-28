import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

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

  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: Number }) trend = 0; // Positive for up, negative for down
  @property({ type: String }) icon = ''; // SVG path data or something similar can be passed, or use slots

  render() {
    const isPositive = this.trend > 0;
    const isNegative = this.trend < 0;
    const trendClass = isPositive ? 'text-green-500' : (isNegative ? 'text-red-500' : 'text-slate-500');
    
    return html`
      <div class="bg-white/40 dark:bg-slate-800/50 backdrop-blur-lg border border-white/30 dark:border-slate-600/30 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
        <!-- Optional ambient glow -->
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all"></div>
        
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">${this.label}</p>
            <h4 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2 tracking-tight">${this.value}</h4>
          </div>
          <div class="p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm border border-white/40 dark:border-slate-600/50 text-blue-500 dark:text-blue-400">
            <slot name="icon">
              <!-- Default Icon if none provided -->
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </slot>
          </div>
        </div>

        ${this.trend !== 0 ? html`
          <div class="mt-4 flex items-center text-sm">
            <span class="flex items-center font-semibold ${trendClass}">
              ${isPositive ? html`
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              ` : html`
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
              `}
              ${Math.abs(this.trend)}%
            </span>
            <span class="ml-2 text-slate-500 dark:text-slate-400">vs last month</span>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-stat': PrismStat;
  }
}
