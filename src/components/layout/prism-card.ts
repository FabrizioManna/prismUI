import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-card')
export class PrismCard extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  @property({ type: String }) title = '';
  @property({ type: String }) subtitle = '';

  render() {
    return html`
      <div class="bg-white/30 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
        ${this.title || this.subtitle || this.querySelector('[slot="header"]') ? html`
          <div class="px-6 py-5 border-b border-white/20 dark:border-slate-700/30">
            <div class="flex justify-between items-center">
              <div>
                ${this.title ? html`<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">${this.title}</h3>` : ''}
                ${this.subtitle ? html`<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${this.subtitle}</p>` : ''}
              </div>
              <slot name="header"></slot>
            </div>
          </div>
        ` : ''}
        
        <div class="p-6 flex-1 flex flex-col">
          <slot></slot>
        </div>

        ${this.querySelector('[slot="footer"]') ? html`
          <div class="px-6 py-4 bg-white/10 dark:bg-slate-800/30 border-t border-white/20 dark:border-slate-700/30">
            <slot name="footer"></slot>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-card': PrismCard;
  }
}
