import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-navbar')
export class PrismNavbar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `
  ];

  @property({ type: String }) title = 'Dashboard';

  render() {
    return html`
      <header class="w-full h-16 bg-white/30 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/30 dark:border-slate-700/50 px-6 flex items-center justify-between shadow-sm z-10 relative">
        <div class="flex items-center gap-4">
          <slot name="left"></slot>
          <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">${this.title}</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <slot name="center"></slot>
        </div>

        <div class="flex items-center gap-4">
          <slot name="right"></slot>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-navbar': PrismNavbar;
  }
}
