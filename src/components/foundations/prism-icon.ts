import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A lightweight SVG wrapper component that inherits the current text color.
 * Accepts raw SVG string from lucide-static or utilizes the default slot.
 */
@customElement('prism-icon')
export class PrismIcon extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      /* If using raw svg strings (like from lucide-static), ensure they scale */
      svg {
        width: 100%;
        height: 100%;
      }
      /* Fallback for slotted content */
      ::slotted(svg) {
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `
  ];

  /**
   * Defines the size of the icon (width and height).
   */
  @property({ type: Number }) size = 24;

  /**
   * A string containing the raw full SVG element (e.g. from lucide-static).
   */
  @property({ type: String }) icon = '';

  render() {
    return html`
      <div style="width: ${this.size}px; height: ${this.size}px; display: inline-flex;">
        ${this.icon 
          ? unsafeSVG(this.icon) 
          : html`
            <svg 
              width="${this.size}" 
              height="${this.size}" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <slot></slot>
            </svg>
          `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-icon': PrismIcon;
  }
}
