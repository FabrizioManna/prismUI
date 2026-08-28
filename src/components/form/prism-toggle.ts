import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

@customElement('prism-toggle')
export class PrismToggle extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }
    `
  ];

  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = '';

  private _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('prism-toggle', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <label class="flex items-center gap-3 ${this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
        <div class="relative">
          <input 
            type="checkbox" 
            class="sr-only" 
            .checked=${this.checked} 
            ?disabled=${this.disabled}
            @change=${this._toggle}
          >
          <div class="block w-10 h-6 rounded-full transition-colors duration-300 ${this.checked ? 'bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-300/40 dark:bg-slate-700/50'} backdrop-blur-sm border border-white/20"></div>
          <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${this.checked ? 'transform translate-x-4' : ''}"></div>
        </div>
        ${this.label ? html`<span class="text-sm font-medium text-slate-700 dark:text-slate-300">${this.label}</span>` : ''}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-toggle': PrismToggle;
  }
}
