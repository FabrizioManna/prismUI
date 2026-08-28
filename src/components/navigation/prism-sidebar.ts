import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-sidebar')
export class PrismSidebar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
    `
  ];

  @property({ type: Boolean }) collapsed = false;
  @property({ type: String }) title = 'PrismUI';

  render() {
    return html`
      <aside class="h-full bg-white/20 dark:bg-slate-900/40 backdrop-blur-lg border-r border-slate-200/30 dark:border-slate-700/50 flex flex-col transition-all duration-300 ${this.collapsed ? 'w-20' : 'w-64'}">
        <!-- Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-slate-200/30 dark:border-slate-700/50">
          ${!this.collapsed ? html`<span class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">${this.title}</span>` : html`<div></div>`}
          <button @click=${() => this.collapsed = !this.collapsed} class="p-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${this.collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'}"></path>
            </svg>
          </button>
        </div>
        
        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
          <slot></slot>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200/30 dark:border-slate-700/50">
          <slot name="footer"></slot>
        </div>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-sidebar': PrismSidebar;
  }
}
