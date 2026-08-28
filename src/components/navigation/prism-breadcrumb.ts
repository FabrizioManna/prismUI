import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Breadcrumb component showing current page location in the hierarchy.
 */
@customElement('prism-breadcrumb')
export class PrismBreadcrumb extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  /**
   * The list of items in the breadcrumb path.
   */
  @property({ type: Array }) items: BreadcrumbItem[] = [];

  render() {
    return html`
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          ${this.items.map((item, index) => {
            const isLast = index === this.items.length - 1;
            return html`
              <li class="inline-flex items-center">
                ${index > 0 ? html`
                  <svg class="w-4 h-4 text-slate-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                ` : ''}
                
                ${!isLast && item.href ? html`
                  <a href="${item.href}" class="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                    ${item.label}
                  </a>
                ` : html`
                  <span class="inline-flex items-center text-sm font-medium text-slate-400 dark:text-slate-500 cursor-default">
                    ${item.label}
                  </span>
                `}
              </li>
            `;
          })}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-breadcrumb': PrismBreadcrumb;
  }
}
