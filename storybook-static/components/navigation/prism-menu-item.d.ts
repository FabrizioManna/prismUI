import { LitElement } from 'lit';
/**
 * An item within a prism-menu dropdown.
 */
export declare class PrismMenuItem extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The value emitted when the item is selected.
     */
    value: string;
    /**
     * Visually styles the item as destructive/danger.
     */
    danger: boolean;
    private _handleClick;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-menu-item': PrismMenuItem;
    }
}
//# sourceMappingURL=prism-menu-item.d.ts.map