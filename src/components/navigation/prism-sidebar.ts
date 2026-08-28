import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * Main left navigation sidebar styled with Glassmorphism.
 * Supports a collapsible (icon-only) mode to save screen real estate.
 */
@customElement('prism-sidebar')
export class PrismSidebar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100vh;
        position: sticky;
        top: 0;
      }
      
      /* Hide scrollbar for cleaner look */
      .sidebar-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .sidebar-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.3);
        border-radius: 20px;
      }
    `
  ];

  /**
   * If true, the sidebar collapses into an icon-only mode.
   */
  @property({ type: Boolean }) collapsed = false;

  render() {
    const widthClass = this.collapsed ? 'w-20' : 'w-64';

    return html`
      <aside class="prism-glass h-full ${widthClass} !rounded-none transition-all duration-300 ease-in-out flex flex-col">
        
        <!-- Brand / Logo Area -->
        <div class="h-16 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50 shrink-0">
          <slot name="header"></slot>
        </div>

        <!-- Main Navigation Links -->
        <nav class="flex-1 overflow-y-auto sidebar-scroll py-4 flex flex-col gap-1 px-3">
          <slot></slot>
        </nav>

        <!-- Footer / Settings Area -->
        <div class="p-4 border-t border-slate-200/50 dark:border-slate-700/50 shrink-0">
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
