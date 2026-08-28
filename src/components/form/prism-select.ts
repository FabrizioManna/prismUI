import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A custom select dropdown styled with Glassmorphism.
 * Replaces the native select to ensure consistent rendering across all browsers.
 */
@customElement('prism-select')
export class PrismSelect extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        position: relative;
      }
    `
  ];

  /**
   * The options available for selection.
   * Format: Array of objects with label and value.
   */
  @property({ type: Array }) options: { label: string; value: string }[] = [];

  /**
   * The currently selected value.
   */
  @property({ type: String }) value = '';

  /**
   * Placeholder text when nothing is selected.
   */
  @property({ type: String }) placeholder = 'Select an option...';

  /**
   * Disables the select dropdown.
   */
  @property({ type: Boolean }) disabled = false;

  @state() private _isOpen = false;

  private _toggleDropdown() {
    if (this.disabled) return;
    this._isOpen = !this._isOpen;
  }

  private _selectOption(val: string) {
    this.value = val;
    this._isOpen = false;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
  }

  private _handleDocumentClick = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this._isOpen = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._handleDocumentClick);
    super.disconnectedCallback();
  }

  render() {
    const selectedOption = this.options.find(opt => opt.value === this.value);
    const displayLabel = selectedOption ? selectedOption.label : this.placeholder;
    const hasValue = !!selectedOption;

    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-100/10' : 'cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/30 bg-white/10 dark:bg-slate-800/20';
    const borderClass = this._isOpen ? 'border-blue-400/60 ring-2 ring-blue-400/30' : 'border-slate-300/40 dark:border-slate-600/50';

    return html`
      <div class="relative w-full">
        <!-- Trigger Button -->
        <button
          type="button"
          @click="${this._toggleDropdown}"
          ?disabled="${this.disabled}"
          class="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg backdrop-blur-md border transition-all duration-200 outline-none ${borderClass} ${disabledClass} ${!hasValue ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}"
        >
          <span class="truncate">${displayLabel}</span>
          <svg class="w-4 h-4 ml-2 transition-transform duration-200 ${this._isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        ${this._isOpen ? html`
          <ul class="absolute z-50 w-full mt-2 py-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-60 overflow-auto">
            ${this.options.map(option => html`
              <li
                @click="${() => this._selectOption(option.value)}"
                class="px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-blue-500/10 dark:hover:bg-blue-400/10 text-slate-700 dark:text-slate-200 ${this.value === option.value ? 'bg-blue-500/10 dark:bg-blue-400/10 font-medium' : ''}"
              >
                ${option.label}
              </li>
            `)}
            ${this.options.length === 0 ? html`
              <li class="px-4 py-3 text-sm text-center text-slate-500">No options available</li>
            ` : ''}
          </ul>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-select': PrismSelect;
  }
}
