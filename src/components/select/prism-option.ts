import { css } from 'lit';
import { property } from 'lit/decorators.js';
import { PrismElement } from '../../core/prism-element.js';

/**
 * Option of `prism-select` (data only: the select renders it in its listbox).
 *
 * @summary Select option.
 * @slot - Label text.
 */
export class PrismOption extends PrismElement {
  static override tagName = 'prism-option';
  static override styles = css`
    :host {
      display: none;
    }
  `;

  @property({ reflect: true }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Visible label (text content). */
  get label(): string {
    return (this.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  override render() {
    return null;
  }
}

/**
 * Group of `prism-option` with a visible label.
 *
 * @summary Option group.
 * @slot - `prism-option` elements.
 */
export class PrismOptionGroup extends PrismElement {
  static override tagName = 'prism-option-group';
  static override styles = css`
    :host {
      display: none;
    }
  `;

  @property() label = '';

  override render() {
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-option': PrismOption;
    'prism-option-group': PrismOptionGroup;
  }
}
