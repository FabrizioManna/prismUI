import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A lightweight SVG wrapper component that inherits the current text color.
 * Designed to be framework-agnostic by accepting raw SVG path strings or utilizing the default slot.
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
      svg {
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
   * A string containing the raw SVG inner content (e.g., `<path d="..." />`).
   * If provided, this will be rendered inside the SVG. Otherwise, the default `<slot>` is used.
   */
  @property({ type: String }) content = '';

  render() {
    return html`
      <svg 
        width="${this.size}" 
        height="${this.size}" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        ${this.content ? html([this.content] as any) : html`<slot></slot>`}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-icon': PrismIcon;
  }
}
