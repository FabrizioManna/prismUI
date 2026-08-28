import { LitElement } from 'lit';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
/**
 * An in-page static banner for conveying important information.
 */
export declare class PrismAlert extends LitElement {
    static styles: import('lit').CSSResult[];
    variant: AlertVariant;
    title: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-alert': PrismAlert;
    }
}
//# sourceMappingURL=prism-alert.d.ts.map