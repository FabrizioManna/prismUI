import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * An accordion component for collapsible content sections.
 * Features a smooth grid-based expansion animation.
 */
@customElement('prism-accordion')
export class PrismAccordion extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  /**
   * The title of the accordion section.
   */
  @property({ type: String }) title = '';

  /**
   * If true, the accordion is open.
   */
  @property({ type: Boolean }) open = false;

  private _toggle() {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open } }));
  }

  render() {
    return html`
      <div class="border border-slate-200/50 dark:border-slate-700/50 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md mb-3 transition-colors duration-200 hover:bg-white/60 dark:hover:bg-slate-900/60">
        <button
          @click="${this._toggle}"
          class="w-full flex items-center justify-between px-6 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
          aria-expanded="${this.open}"
        >
          <span class="font-medium text-slate-800 dark:text-slate-200">${this.title}</span>
          <svg 
            class="w-5 h-5 text-slate-400 transition-transform duration-300 ${this.open ? 'rotate-180' : ''}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- Smooth grid expansion technique -->
        <div 
          class="grid transition-all duration-300 ease-in-out ${this.open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}"
        >
          <div class="overflow-hidden">
            <div class="px-6 pb-5 pt-1 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
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
    'prism-accordion': PrismAccordion;
  }
}
