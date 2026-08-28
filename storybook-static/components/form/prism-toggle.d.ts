import { LitElement } from 'lit';
/**
 * A smooth, animated switch for boolean settings (on/off) styled with Glassmorphism.
 * Fully accessible via keyboard and screen readers.
 */
export declare class PrismToggle extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The current checked state of the toggle.
     */
    checked: boolean;
    /**
     * Disables the toggle.
     */
    disabled: boolean;
    /**
     * Accessible label for the toggle.
     */
    ariaLabel: string;
    private _toggle;
    private _handleKeyDown;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-toggle': PrismToggle;
    }
}
//# sourceMappingURL=prism-toggle.d.ts.map