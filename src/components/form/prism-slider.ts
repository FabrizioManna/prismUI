import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A range slider component tailored for the Glassmorphism UI Kit.
 */
@customElement('prism-slider')
export class PrismSlider extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      
      /* Cross-browser styling for range input */
      input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
      }
      
      input[type=range]:focus {
        outline: none;
      }

      /* WebKit */
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        margin-top: -8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.8);
      }
      
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 6px;
        cursor: pointer;
        border-radius: 9999px;
      }

      /* Firefox */
      input[type=range]::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.8);
      }
      
      input[type=range]::-moz-range-track {
        width: 100%;
        height: 6px;
        cursor: pointer;
        border-radius: 9999px;
      }
    `
  ];



  /**
   * Current value.
   */
  @property({ type: Number }) value = 50;

  /**
   * Minimum value.
   */
  @property({ type: Number }) min = 0;

  /**
   * Maximum value.
   */
  @property({ type: Number }) max = 100;

  /**
   * Step increment.
   */
  @property({ type: Number }) step = 1;

  /**
   * Disables the slider.
   */
  @property({ type: Boolean }) disabled = false;

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
  }

  render() {
    // Calculate percentage for background gradient
    const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
    
    // We apply the gradient dynamically via inline styles for the track
    const trackStyle = `
      background: linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%);
    `;

    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return html`
      <div class="relative w-full py-2 ${disabledClass}">
        <input
          type="range"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          .value="${this.value.toString()}"
          ?disabled="${this.disabled}"
          @input="${this._handleInput}"
          class="w-full h-1.5 rounded-full outline-none backdrop-blur-sm"
          style="${trackStyle}"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-slider': PrismSlider;
  }
}
