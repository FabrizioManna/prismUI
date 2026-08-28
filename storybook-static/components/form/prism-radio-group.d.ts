import { LitElement } from 'lit';
/**
 * A wrapper group for prism-radio components to manage mutual exclusivity and layout.
 */
export declare class PrismRadioGroup extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Layout direction of the radio buttons.
     */
    layout: 'vertical' | 'horizontal';
    /**
     * The currently selected value within the group.
     */
    value: string;
    private _handleRadioChange;
    private _handleSlotChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-radio-group': PrismRadioGroup;
    }
}
//# sourceMappingURL=prism-radio-group.d.ts.map