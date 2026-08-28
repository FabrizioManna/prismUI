import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A custom radio button component styled with Glassmorphism.
 * Designed to be used within a prism-radio-group.
 */
@customElement('prism-radio')
export class PrismRadio extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
      }
    `
  ];

  /**
   * The checked state.
   */
  @property({ type: Boolean }) checked = false;

  /**
   * The value of the radio button.
   */
  @property({ type: String }) value = '';

  /**
   * Disables the radio button.
   */
  @property({ type: Boolean }) disabled = false;

  private _handleChange() {
    if (this.disabled) return;
    this.checked = true;
    this.dispatchEvent(new CustomEvent('radio-select', { 
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    const bgClass = this.checked
      ? 'bg-blue-500/80 border-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
      : 'bg-white/20 dark:bg-slate-800/40 border-slate-400/50 dark:border-slate-500/50';

    return html`
      <label class="relative flex items-center gap-2 ${disabledClass}">
        <div class="relative flex items-center justify-center w-5 h-5 rounded-full border backdrop-blur-sm transition-all duration-200 ${bgClass}">
          <!-- Hidden Native Input -->
          <input
            type="radio"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            .value="${this.value}"
            @change="${this._handleChange}"
            class="absolute opacity-0 w-full h-full cursor-pointer m-0"
          />
          
          <!-- Inner Dot for Checked State -->
          ${this.checked ? html`
            <div class="w-2 h-2 rounded-full bg-white pointer-events-none"></div>
          ` : ''}
        </div>
        
        <span class="text-sm font-medium text-slate-700 dark:text-slate-200 select-none">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-radio': PrismRadio;
  }
}
