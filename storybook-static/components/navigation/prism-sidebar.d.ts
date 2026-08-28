import { LitElement } from 'lit';
/**
 * Main left navigation sidebar styled with Glassmorphism.
 * Supports a collapsible (icon-only) mode to save screen real estate.
 */
export declare class PrismSidebar extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * If true, the sidebar collapses into an icon-only mode.
     */
    collapsed: boolean;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-sidebar': PrismSidebar;
    }
}
//# sourceMappingURL=prism-sidebar.d.ts.map