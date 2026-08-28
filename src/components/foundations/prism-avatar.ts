import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * User profile picture component.
 * Displays an image if `src` is provided, otherwise falls back to `initials`.
 * Handles image loading errors by gracefully falling back to initials.
 */
@customElement('prism-avatar')
export class PrismAvatar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }
    `
  ];

  /**
   * The URL of the avatar image.
   */
  @property({ type: String }) src = '';

  /**
   * Alt text for the avatar image (important for accessibility).
   */
  @property({ type: String }) alt = 'User avatar';

  /**
   * The initials to display if the image is missing or fails to load.
   */
  @property({ type: String }) initials = '';

  /**
   * The size of the avatar in pixels.
   */
  @property({ type: Number }) size = 40;

  @state() private _hasError = false;

  private _handleError() {
    this._hasError = true;
  }

  render() {
    const showImage = this.src && !this._hasError;
    const dimensionStyle = `width: ${this.size}px; height: ${this.size}px; font-size: ${Math.max(10, this.size * 0.4)}px;`;

    return html`
      <div 
        class="relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-300/30 dark:border-slate-600/30 shadow-sm"
        style="${dimensionStyle}"
      >
        ${showImage 
          ? html`<img src="${this.src}" alt="${this.alt}" @error="${this._handleError}" class="w-full h-full object-cover" />`
          : html`<span class="font-medium text-slate-700 dark:text-slate-200 uppercase tracking-wider">${this.initials.slice(0, 2)}</span>`
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-avatar': PrismAvatar;
  }
}
