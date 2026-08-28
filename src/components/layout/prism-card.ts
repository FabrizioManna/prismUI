import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A flexible, Glassmorphism container for content, stats, or forms.
 */
@customElement('prism-card')
export class PrismCard extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
    `
  ];

  /**
   * Card title in the header.
   */
  @property({ type: String }) title = '';

  /**
   * Card subtitle in the header.
   */
  @property({ type: String }) subtitle = '';

  /**
   * Removes padding from the main content area (useful for edge-to-edge images or tables).
   */
  @property({ type: Boolean, attribute: 'no-padding' }) noPadding = false;

  render() {
    const paddingClass = this.noPadding ? 'p-0' : 'p-6';

    return html`
      <div class="prism-glass flex flex-col h-full transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
        
        ${this.title || this.subtitle || this.querySelector('[slot="header"]') ? html`
          <div class="px-6 py-5 border-b border-slate-300/40 dark:border-slate-600/50 bg-white/30 dark:bg-slate-800/40">
            <div class="flex justify-between items-center gap-4">
              <div class="flex-1">
                ${this.title ? html`<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">${this.title}</h3>` : ''}
                ${this.subtitle ? html`<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${this.subtitle}</p>` : ''}
              </div>
              <slot name="header"></slot>
            </div>
          </div>
        ` : ''}
        
        <div class="${paddingClass} flex-1 flex flex-col relative z-10">
          <slot></slot>
        </div>

        ${this.querySelector('[slot="footer"]') ? html`
          <div class="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
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
