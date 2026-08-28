import { LitElement } from 'lit';
/**
 * A glowing, animated loading spinner.
 */
export declare class PrismSpinner extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Size of the spinner in pixels.
     */
    size: number;
    /**
     * Tailwind text color class for the spinner (e.g., text-blue-500).
     */
    color: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-spinner': PrismSpinner;
    }
}
//# sourceMappingURL=prism-spinner.d.ts.map