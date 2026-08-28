import { LitElement } from 'lit';
/**
 * A hover tooltip component for extra contextual information.
 */
export declare class PrismTooltip extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The text to display inside the tooltip.
     */
    text: string;
    /**
     * The placement of the tooltip relative to the element.
     */
    placement: 'top' | 'bottom' | 'left' | 'right';
    private _visible;
    private _show;
    private _hide;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-tooltip': PrismTooltip;
    }
}
//# sourceMappingURL=prism-tooltip.d.ts.map