import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A linear progress bar featuring a glowing gradient fill.
 */
@customElement('prism-progress')
export class PrismProgress extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `
  ];

  /**
   * The current value of the progress bar.
   */
  @property({ type: Number }) value = 0;

  /**
   * The maximum value of the progress bar.
   */
  @property({ type: Number }) max = 100;

  /**
   * Optional label to display above the progress bar.
   */
  @property({ type: String }) label = '';

  render() {
    const percentage = Math.min(100, Math.max(0, (this.value / this.max) * 100));

    return html`
      <div class="w-full">
        ${this.label ? html`
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${this.label}</span>
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">${Math.round(percentage)}%</span>
          </div>
        ` : ''}
        
        <div class="w-full h-2.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-300/30 dark:border-slate-600/30">
          <div 
            class="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style="width: ${percentage}%"
            role="progressbar"
            aria-valuenow="${this.value}"
            aria-valuemin="0"
            aria-valuemax="${this.max}"
          ></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-progress': PrismProgress;
  }
}
