import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A hover tooltip component for extra contextual information.
 */
@customElement('prism-tooltip')
export class PrismTooltip extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }
    `
  ];

  /**
   * The text to display inside the tooltip.
   */
  @property({ type: String }) text = '';

  /**
   * The placement of the tooltip relative to the element.
   */
  @property({ type: String }) placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @state() private _visible = false;

  private _show() {
    this._visible = true;
  }

  private _hide() {
    this._visible = false;
  }

  render() {
    let placementClass = '';
    
    switch (this.placement) {
      case 'top':
        placementClass = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
        break;
      case 'bottom':
        placementClass = 'top-full left-1/2 -translate-x-1/2 mt-2';
        break;
      case 'left':
        placementClass = 'right-full top-1/2 -translate-y-1/2 mr-2';
        break;
      case 'right':
        placementClass = 'left-full top-1/2 -translate-y-1/2 ml-2';
        break;
    }

    return html`
      <div 
        class="relative inline-flex"
        @mouseenter="${this._show}"
        @mouseleave="${this._hide}"
        @focus="${this._show}"
        @blur="${this._hide}"
      >
        <slot></slot>
        
        <div 
          class="absolute z-50 whitespace-nowrap px-3 py-1.5 text-xs font-medium text-white bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md rounded-md shadow-lg pointer-events-none transition-all duration-200 ${placementClass} ${this._visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}"
          role="tooltip"
          aria-hidden="${!this._visible}"
        >
          ${this.text}
          <!-- Arrow could be added here using pseudo-elements or extra div if needed -->
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-tooltip': PrismTooltip;
  }
}
