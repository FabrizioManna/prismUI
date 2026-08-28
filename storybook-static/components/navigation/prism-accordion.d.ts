import { LitElement } from 'lit';
/**
 * An accordion component for collapsible content sections.
 * Features a smooth grid-based expansion animation.
 */
export declare class PrismAccordion extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The title of the accordion section.
     */
    title: string;
    /**
     * If true, the accordion is open.
     */
    open: boolean;
    private _toggle;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-accordion': PrismAccordion;
    }
}
//# sourceMappingURL=prism-accordion.d.ts.map