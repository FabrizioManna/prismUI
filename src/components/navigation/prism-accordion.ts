import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-accordion')
export class PrismAccordion extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      .content {
        transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
      }
      .content.open {
        max-height: 1000px; /* Arbitrary large value to allow content to expand */
        opacity: 1;
      }
    `
  ];

  @property({ type: String }) title = '';
  @property({ type: Boolean }) open = false;

  private _toggle() {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('prism-toggle', {
      detail: { open: this.open },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="rounded-xl bg-white/20 dark:bg-slate-900/30 backdrop-blur-md border border-slate-300/30 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ${this.open ? 'shadow-md bg-white/30 dark:bg-slate-900/50' : 'hover:bg-white/30 dark:hover:bg-slate-900/40'}">
        <button 
          @click=${this._toggle}
          class="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:bg-white/10 dark:focus:bg-slate-800/50"
        >
          <span class="font-medium text-slate-800 dark:text-slate-100">${this.title}</span>
          <svg 
            class="w-5 h-5 text-slate-500 transition-transform duration-300 ${this.open ? 'rotate-180' : ''}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div class="content ${this.open ? 'open' : ''}">
          <div class="px-5 pb-4 text-slate-600 dark:text-slate-300 border-t border-slate-200/20 dark:border-slate-700/30 pt-4">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-accordion': PrismAccordion;
  }
}
