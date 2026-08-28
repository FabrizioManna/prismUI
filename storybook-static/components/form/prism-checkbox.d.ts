import { LitElement } from 'lit';
/**
 * A custom checkbox component that supports checked, unchecked, and indeterminate states.
 * Designed with a subtle Glassmorphism aesthetic for data tables and forms.
 */
export declare class PrismCheckbox extends LitElement {
    static styles: import('lit').CSSResult[];
    private checkboxInput;
    /**
     * The current checked state.
     */
    checked: boolean;
    /**
     * The indeterminate state (useful for "select all" in tables).
     */
    indeterminate: boolean;
    /**
     * Disables the checkbox.
     */
    disabled: boolean;
    /**
     * Accessible label.
     */
    ariaLabel: string;
    private _handleChange;
    updated(changedProperties: Map<string, any>): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-checkbox': PrismCheckbox;
    }
}
//# sourceMappingURL=prism-checkbox.d.ts.map