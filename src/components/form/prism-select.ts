import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-select')
export class PrismSelect extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: Array }) options: { label: string, value: string }[] = [];
  @property({ type: Boolean }) disabled = false;

  private _handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('prism-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="flex flex-col gap-1.5">
        ${this.label ? html`<label class="text-sm font-medium text-slate-700 dark:text-slate-300">${this.label}</label>` : ''}
        <div class="relative">
          <select
            .value=${this.value}
            ?disabled=${this.disabled}
            @change=${this._handleChange}
            class="w-full appearance-none px-3 py-2 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md border border-slate-300/30 dark:border-slate-700/50 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''}"
          >
            ${this.options.map(opt => html`<option value=${opt.value} class="text-slate-800 dark:text-slate-800">${opt.label}</option>`)}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
            <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-select': PrismSelect;
  }
}
