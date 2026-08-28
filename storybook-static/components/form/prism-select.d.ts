import { LitElement } from 'lit';
/**
 * A custom select dropdown styled with Glassmorphism.
 * Replaces the native select to ensure consistent rendering across all browsers.
 */
export declare class PrismSelect extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The options available for selection.
     * Format: Array of objects with label and value.
     */
    options: {
        label: string;
        value: string;
    }[];
    /**
     * The currently selected value.
     */
    value: string;
    /**
     * Placeholder text when nothing is selected.
     */
    placeholder: string;
    /**
     * Disables the select dropdown.
     */
    disabled: boolean;
    private _isOpen;
    private _toggleDropdown;
    private _selectOption;
    private _handleDocumentClick;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-select': PrismSelect;
    }
}
//# sourceMappingURL=prism-select.d.ts.map