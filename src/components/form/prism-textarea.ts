import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A multi-line text input that automatically resizes its height based on the content.
 * Styled with Glassmorphism for admin dashboards.
 */
@customElement('prism-textarea')
export class PrismTextarea extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      textarea {
        resize: none; /* Disable native resize handle */
        overflow-y: hidden; /* Hide scrollbar while auto-resizing */
      }
    `
  ];

  @query('textarea') private textarea!: HTMLTextAreaElement;

  /**
   * The current value of the textarea.
   */
  @property({ type: String }) value = '';

  /**
   * Placeholder text for the textarea.
   */
  @property({ type: String }) placeholder = '';

  /**
   * Helper text displayed below the textarea.
   */
  @property({ type: String }) helperText = '';

  /**
   * Error state. If true, changes the border to red.
   */
  @property({ type: Boolean }) error = false;

  /**
   * Disables the textarea.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Minimum rows for the textarea.
   */
  @property({ type: Number }) minRows = 3;

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this._autoResize();
    this.dispatchEvent(new CustomEvent('input-change', { detail: { value: this.value } }));
  }

  private _autoResize() {
    if (this.textarea) {
      this.textarea.style.height = 'auto'; // Reset height
      // Set to scrollHeight, with a minimum height based on rows
      const minHeight = this.minRows * 24 + 16; // Approx line-height * rows + padding
      this.textarea.style.height = `${Math.max(this.textarea.scrollHeight, minHeight)}px`;
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value')) {
      this._autoResize();
    }
  }

  render() {
    let borderClass = 'border-slate-300/40 dark:border-slate-600/50 focus:border-blue-400/60 focus:ring-blue-400/30';
    if (this.error) {
      borderClass = 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
    }

    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-100/10' : 'bg-white/10 dark:bg-slate-800/20';

    return html`
      <div class="relative w-full">
        <textarea
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          rows="${this.minRows}"
          @input="${this._handleInput}"
          class="w-full px-4 py-2 text-sm rounded-lg backdrop-blur-md border outline-none transition-colors duration-200 focus:ring-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${borderClass} ${disabledClass}"
        ></textarea>
        
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
    'prism-textarea': PrismTextarea;
  }
}
