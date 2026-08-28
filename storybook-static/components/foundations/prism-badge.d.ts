import { LitElement } from 'lit';
/**
 * A small status indicator component, styled with glassmorphism.
 * Used to display states like success, warning, error, or info within tables or cards.
 */
export declare class PrismBadge extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The status variant of the badge which determines its color scheme.
     */
    variant: 'success' | 'warning' | 'error' | 'info' | 'default';
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-badge': PrismBadge;
    }
}
//# sourceMappingURL=prism-badge.d.ts.map