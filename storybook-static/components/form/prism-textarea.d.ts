import { LitElement } from 'lit';
/**
 * A multi-line text input that automatically resizes its height based on the content.
 * Styled with Glassmorphism for admin dashboards.
 */
export declare class PrismTextarea extends LitElement {
    static styles: import('lit').CSSResult[];
    private textarea;
    /**
     * The current value of the textarea.
     */
    value: string;
    /**
     * Placeholder text for the textarea.
     */
    placeholder: string;
    /**
     * Helper text displayed below the textarea.
     */
    helperText: string;
    /**
     * Error state. If true, changes the border to red.
     */
    error: boolean;
    /**
     * Disables the textarea.
     */
    disabled: boolean;
    /**
     * Minimum rows for the textarea.
     */
    minRows: number;
    private _handleInput;
    private _autoResize;
    updated(changedProperties: Map<string, any>): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-textarea': PrismTextarea;
    }
}
//# sourceMappingURL=prism-textarea.d.ts.map