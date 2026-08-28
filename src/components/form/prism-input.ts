import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-input')
export class PrismInput extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  @property({ type: String }) label = '';
  @property({ type: String }) type = 'text';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) value = '';
  @property({ type: Boolean }) disabled = false;

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('prism-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="flex flex-col gap-1.5">
        ${this.label ? html`<label class="text-sm font-medium text-slate-700 dark:text-slate-300">${this.label}</label>` : ''}
        <input
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this._handleInput}
          class="w-full px-3 py-2 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md border border-slate-300/30 dark:border-slate-700/50 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''}"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-input': PrismInput;
  }
}
