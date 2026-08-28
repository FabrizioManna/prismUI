import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A sticky top header component for Admin Dashboards.
 * Features a Glassmorphism background and layout slots for brand, search, and user actions.
 */
@customElement('prism-navbar')
export class PrismNavbar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 40; /* High enough to stay above content, below modals/dropdowns (50+) */
      }
    `
  ];

  render() {
    return html`
      <header class="prism-glass w-full h-16 !rounded-none flex items-center justify-between px-4 sm:px-6">
        
        <!-- Left: Brand / Mobile Toggle -->
        <div class="flex items-center gap-4">
          <slot name="left"></slot>
          <!-- Mobile Menu Trigger slot (optional) -->
          <slot name="mobile-trigger" class="md:hidden"></slot>
        </div>

        <!-- Center: Search (optional) -->
        <div class="flex-1 max-w-2xl px-4 hidden md:flex items-center justify-center">
          <slot name="center"></slot>
        </div>

        <!-- Right: Actions, Notifications, User Menu -->
        <div class="flex items-center gap-3">
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
