import { LitElement } from 'lit';
/**
 * A lightweight SVG wrapper component that inherits the current text color.
 * Accepts raw SVG string from lucide-static or utilizes the default slot.
 */
export declare class PrismIcon extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Defines the size of the icon (width and height).
     */
    size: number;
    /**
     * A string containing the raw full SVG element (e.g. from lucide-static).
     */
    icon: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-icon': PrismIcon;
    }
}
//# sourceMappingURL=prism-icon.d.ts.map