import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A basic PrismUI component template.
 */
@customElement('prism-component')
export class PrismComponent extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  @property({ type: String }) title = 'Hello PrismUI';

  render() {
    return html`
      <div class="p-6 bg-white/30 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-xl">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">${this.title}</h2>
        <div class="mt-4 text-slate-600 dark:text-slate-300">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-component': PrismComponent;
  }
}