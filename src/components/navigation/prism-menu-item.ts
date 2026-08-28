import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * An item within a prism-menu dropdown.
 */
@customElement('prism-menu-item')
export class PrismMenuItem extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  /**
   * The value emitted when the item is selected.
   */
  @property({ type: String }) value = '';

  /**
   * Visually styles the item as destructive/danger.
   */
  @property({ type: Boolean }) danger = false;

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('menu-select', { 
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const colorClass = this.danger 
      ? 'text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10' 
      : 'text-slate-700 dark:text-slate-200 hover:bg-blue-500/10 dark:hover:bg-blue-400/10';

    return html`
      <li 
        @click="${this._handleClick}"
        class="flex items-center w-full px-4 py-2 text-sm cursor-pointer transition-colors ${colorClass}"
        role="menuitem"
        tabindex="0"
      >
        <slot name="icon"></slot>
        <span class="flex-grow text-left"><slot></slot></span>
      </li>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-menu-item': PrismMenuItem;
  }
}
