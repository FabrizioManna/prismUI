import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';
import { Loader2 } from 'lucide-static';
import '../foundations/prism-icon';

/**
 * A glowing, animated loading spinner.
 */
@customElement('prism-spinner')
export class PrismSpinner extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }
      .animate-spin-slow {
        animation: spin 1.5s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
  ];

  /**
   * Size of the spinner in pixels.
   */
  @property({ type: Number }) size = 24;

  /**
   * Tailwind text color class for the spinner (e.g., text-blue-500).
   */
  @property({ type: String }) color = 'text-blue-500';

  render() {
    return html`
      <div class="inline-flex items-center justify-center ${this.color} animate-spin-slow" role="status" aria-label="Loading">
        <prism-icon .icon="${Loader2}" size="${this.size}"></prism-icon>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-spinner': PrismSpinner;
  }
}
