import { LitElement } from 'lit';
/**
 * A generic dropdown menu for user profiles or actions.
 */
export declare class PrismMenu extends LitElement {
    static styles: import('lit').CSSResult[];
    private _isOpen;
    /**
     * The placement of the dropdown menu.
     */
    placement: 'bottom-start' | 'bottom-end';
    private _toggleMenu;
    private _closeMenu;
    private _handleDocumentClick;
    private _handleMenuSelect;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-menu': PrismMenu;
    }
}
//# sourceMappingURL=prism-menu.d.ts.map