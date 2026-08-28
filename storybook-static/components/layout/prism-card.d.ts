import { LitElement } from 'lit';
/**
 * A flexible, Glassmorphism container for content, stats, or forms.
 */
export declare class PrismCard extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Card title in the header.
     */
    title: string;
    /**
     * Card subtitle in the header.
     */
    subtitle: string;
    /**
     * Removes padding from the main content area (useful for edge-to-edge images or tables).
     */
    noPadding: boolean;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-card': PrismCard;
    }
}
//# sourceMappingURL=prism-card.d.ts.map