import { LitElement } from 'lit';
/**
 * Standard text input designed for high-density forms.
 * Supports various types, error states, helper text, and an internal password visibility toggle.
 */
export declare class PrismInput extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The input type (text, email, password, etc.)
     */
    type: string;
    /**
     * Placeholder text for the input.
     */
    placeholder: string;
    /**
     * The current value of the input.
     */
    value: string;
    /**
     * Helper text displayed below the input.
     */
    helperText: string;
    /**
     * Error state. If true, changes the border to red.
     */
    error: boolean;
    /**
     * Disables the input.
     */
    disabled: boolean;
    private _showPassword;
    private _handleInput;
    private _togglePasswordVisibility;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-input': PrismInput;
    }
}
//# sourceMappingURL=prism-input.d.ts.map