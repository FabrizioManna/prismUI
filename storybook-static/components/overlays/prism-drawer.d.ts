import { LitElement } from 'lit';
/**
 * A slide-out off-canvas drawer panel utilizing Glassmorphism.
 */
export declare class PrismDrawer extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * If true, the drawer is visible.
     */
    open: boolean;
    /**
     * The title in the drawer header.
     */
    title: string;
    /**
     * Position of the drawer: 'left' or 'right' (default 'right').
     */
    position: 'left' | 'right';
    private _close;
    private _handleBackdropClick;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-drawer': PrismDrawer;
    }
}
//# sourceMappingURL=prism-drawer.d.ts.map