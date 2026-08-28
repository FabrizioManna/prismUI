import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';
import { Eye, EyeOff } from 'lucide-static';
import '../foundations/prism-icon';

/**
 * Standard text input designed for high-density forms.
 * Supports various types, error states, helper text, and an internal password visibility toggle.
 */
@customElement('prism-input')
export class PrismInput extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `
  ];

  /**
   * The input type (text, email, password, etc.)
   */
  @property({ type: String }) type = 'text';

  /**
   * Placeholder text for the input.
   */
  @property({ type: String }) placeholder = '';

  /**
   * The current value of the input.
   */
  @property({ type: String }) value = '';

  /**
   * Helper text displayed below the input.
   */
  @property({ type: String }) helperText = '';

  /**
   * Error state. If true, changes the border to red.
   */
  @property({ type: Boolean }) error = false;

  /**
   * Disables the input.
   */
  @property({ type: Boolean }) disabled = false;

  @state() private _showPassword = false;

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('input-change', { detail: { value: this.value } }));
  }

  private _togglePasswordVisibility() {
    this._showPassword = !this._showPassword;
  }

  render() {
    const isPassword = this.type === 'password';
    const computedType = isPassword && this._showPassword ? 'text' : this.type;
    
    // Glassmorphism classes
    let borderClass = 'border-slate-300/40 dark:border-slate-600/50 focus:border-blue-400/60 focus:ring-blue-400/30';
    if (this.error) {
      borderClass = 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
    }

    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-200/20' : 'bg-white/30 dark:bg-slate-800/40';

    return html`
      <div class="relative w-full">
        <div class="relative flex items-center">
          <input
            type="${computedType}"
            .value="${this.value}"
            placeholder="${this.placeholder}"
            ?disabled="${this.disabled}"
            @input="${this._handleInput}"
            class="w-full px-4 py-2 text-sm rounded-lg backdrop-blur-md border outline-none transition-all duration-200 focus:ring-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${borderClass} ${disabledClass} ${isPassword ? 'pr-10' : ''}"
          />
          
          ${isPassword ? html`
            <button 
              type="button"
              @click="${this._togglePasswordVisibility}"
              tabindex="-1"
              class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
            >
              <prism-icon 
                .icon="${this._showPassword ? Eye : EyeOff}" 
                size="20" 
                class="w-5 h-5 flex items-center justify-center">
              </prism-icon>
            </button>
          ` : ''}
        </div>
        
        ${this.helperText ? html`
          <p class="mt-1 text-xs ${this.error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}">
            ${this.helperText}
          </p>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-input': PrismInput;
  }
}
