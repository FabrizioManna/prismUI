import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

/**
 * Horizontal navigation tabs for switching views within a page.
 * Features a smooth animated indicator line.
 */
@customElement('prism-tabs')
export class PrismTabs extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      /* Hide scrollbar for overflow */
      .tabs-scroll::-webkit-scrollbar {
        display: none;
      }
      .tabs-scroll {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `
  ];

  /**
   * Array of tab objects.
   */
  @property({ type: Array }) tabs: TabItem[] = [];

  /**
   * The ID of the currently active tab.
   */
  @property({ type: String }) activeTab = '';

  private _selectTab(id: string) {
    this.activeTab = id;
    this.dispatchEvent(new CustomEvent('tab-change', { detail: { activeTab: id } }));
  }

  render() {
    return html`
      <div class="w-full border-b border-slate-200/50 dark:border-slate-700/50">
        <nav class="flex overflow-x-auto tabs-scroll space-x-8" aria-label="Tabs">
          ${this.tabs.map(tab => {
            const isActive = tab.id === this.activeTab;
            
            // Text color based on state
            const textClass = isActive 
              ? 'text-blue-600 dark:text-blue-400 font-medium' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium';
              
            // Animated bottom border
            const borderClass = isActive
              ? 'border-blue-500 shadow-[0_2px_10px_rgba(59,130,246,0.5)]'
              : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600';

            return html`
              <button
                @click="${() => this._selectTab(tab.id)}"
                class="whitespace-nowrap py-4 px-1 border-b-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${textClass} ${borderClass}"
                aria-current="${isActive ? 'page' : 'false'}"
              >
                <div class="flex items-center gap-2">
                  ${tab.icon ? html`<slot name="icon-${tab.id}"></slot>` : ''}
                  ${tab.label}
                </div>
              </button>
            `;
          })}
        </nav>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-tabs': PrismTabs;
  }
}
