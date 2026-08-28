import { LitElement } from 'lit';
/**
 * A range slider component tailored for the Glassmorphism UI Kit.
 */
export declare class PrismSlider extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Current value.
     */
    value: number;
    /**
     * Minimum value.
     */
    min: number;
    /**
     * Maximum value.
     */
    max: number;
    /**
     * Step increment.
     */
    step: number;
    /**
     * Disables the slider.
     */
    disabled: boolean;
    private _handleInput;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-slider': PrismSlider;
    }
}
//# sourceMappingURL=prism-slider.d.ts.map