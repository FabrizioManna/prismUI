import { LitElement } from 'lit';
/**
 * A metric card for dashboards, supporting a trend indicator (arrow up/down).
 */
export declare class PrismStat extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The title or label of the metric.
     */
    title: string;
    /**
     * The main value to display.
     */
    value: string;
    /**
     * Optional trend string (e.g. "+5.4%" or "-2.1%").
     */
    trend: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-stat': PrismStat;
    }
}
//# sourceMappingURL=prism-stat.d.ts.map