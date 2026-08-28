import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A generic dropdown menu for user profiles or actions.
 */
@customElement('prism-menu')
export class PrismMenu extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }
    `
  ];

  @state() private _isOpen = false;

  /**
   * The placement of the dropdown menu.
   */
  @property({ type: String }) placement: 'bottom-start' | 'bottom-end' = 'bottom-start';

  private _toggleMenu() {
    this._isOpen = !this._isOpen;
  }

  private _closeMenu() {
    this._isOpen = false;
  }

  private _handleDocumentClick = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this._closeMenu();
    }
  };

  private _handleMenuSelect = () => {
    // Close the menu when an item is selected
    this._closeMenu();
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
    this.addEventListener('menu-select', this._handleMenuSelect);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._handleDocumentClick);
    this.removeEventListener('menu-select', this._handleMenuSelect);
    super.disconnectedCallback();
  }

  render() {
    const placementClass = this.placement === 'bottom-end' ? 'right-0' : 'left-0';

    return html`
      <div class="relative inline-block">
        <!-- Trigger Slot -->
        <div @click="${this._toggleMenu}" class="cursor-pointer">
          <slot name="trigger"></slot>
        </div>

        <!-- Dropdown Menu -->
        ${this._isOpen ? html`
          <ul 
            class="prism-glass absolute z-50 mt-2 min-w-[200px] py-1 ${placementClass}"
            role="menu"
          >
            <slot></slot>
          </ul>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-menu': PrismMenu;
  }
}
