import { LitElement } from 'lit';
/**
 * A custom radio button component styled with Glassmorphism.
 * Designed to be used within a prism-radio-group.
 */
export declare class PrismRadio extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The checked state.
     */
    checked: boolean;
    /**
     * The value of the radio button.
     */
    value: string;
    /**
     * Disables the radio button.
     */
    disabled: boolean;
    private _handleChange;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-radio': PrismRadio;
    }
}
//# sourceMappingURL=prism-radio.d.ts.map