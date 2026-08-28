import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A custom checkbox component that supports checked, unchecked, and indeterminate states.
 * Designed with a subtle Glassmorphism aesthetic for data tables and forms.
 */
@customElement('prism-checkbox')
export class PrismCheckbox extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
      }
    `
  ];

  @query('input') private checkboxInput!: HTMLInputElement;

  /**
   * The current checked state.
   */
  @property({ type: Boolean }) checked = false;

  /**
   * The indeterminate state (useful for "select all" in tables).
   */
  @property({ type: Boolean }) indeterminate = false;

  /**
   * Disables the checkbox.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Accessible label.
   */
  @property({ type: String }) ariaLabel = 'Checkbox';

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false; // Interacting normally clears indeterminate state
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked } }));
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('indeterminate') && this.checkboxInput) {
      this.checkboxInput.indeterminate = this.indeterminate;
    }
  }

  render() {
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    // We visually style a fake checkbox div and hide the real one.
    const bgClass = (this.checked || this.indeterminate)
      ? 'bg-blue-500/80 border-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
      : 'bg-white/20 dark:bg-slate-800/40 border-slate-400/50 dark:border-slate-500/50';

    return html`
      <label class="relative flex items-center gap-2 ${disabledClass}">
        <div class="relative flex items-center justify-center w-5 h-5 rounded-md border backdrop-blur-sm transition-all duration-200 ${bgClass}">
          <!-- Hidden Native Input -->
          <input
            type="checkbox"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            aria-label="${this.ariaLabel}"
            @change="${this._handleChange}"
            class="absolute opacity-0 w-full h-full cursor-pointer m-0"
          />
          
          <!-- SVG Icon for Checked -->
          ${this.checked && !this.indeterminate ? html`
            <svg class="w-3.5 h-3.5 text-white pointer-events-none" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          ` : ''}

          <!-- SVG Icon for Indeterminate -->
          ${this.indeterminate ? html`
            <svg class="w-3.5 h-3.5 text-white pointer-events-none" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
            </svg>
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
    'prism-checkbox': PrismCheckbox;
  }
}
