import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A wrapper group for prism-radio components to manage mutual exclusivity and layout.
 */
@customElement('prism-radio-group')
export class PrismRadioGroup extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
    `
  ];

  /**
   * Layout direction of the radio buttons.
   */
  @property({ type: String }) layout: 'vertical' | 'horizontal' = 'vertical';

  /**
   * The currently selected value within the group.
   */
  @property({ type: String }) value = '';

  private _handleRadioChange = (e: CustomEvent) => {
    this.value = e.detail.value;
    // Update all child radios
    const radios = this.querySelectorAll('prism-radio') as NodeListOf<any>;
    radios.forEach(radio => {
      radio.checked = radio.value === this.value;
    });
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
  };

  private _handleSlotChange() {
    // Initial sync
    const radios = this.querySelectorAll('prism-radio') as NodeListOf<any>;
    radios.forEach(radio => {
      if (radio.checked && !this.value) {
        this.value = radio.value;
      }
      radio.checked = radio.value === this.value;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('radio-select', this._handleRadioChange as EventListener);
  }

  disconnectedCallback() {
    this.removeEventListener('radio-select', this._handleRadioChange as EventListener);
    super.disconnectedCallback();
  }

  render() {
    const layoutClass = this.layout === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2';
    return html`
      <div class="${layoutClass}" role="radiogroup">
        <slot @slotchange="${this._handleSlotChange}"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-radio-group': PrismRadioGroup;
  }
}
