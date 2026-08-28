import { LitElement } from 'lit';
/**
 * A linear progress bar featuring a glowing gradient fill.
 */
export declare class PrismProgress extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The current value of the progress bar.
     */
    value: number;
    /**
     * The maximum value of the progress bar.
     */
    max: number;
    /**
     * Optional label to display above the progress bar.
     */
    label: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-progress': PrismProgress;
    }
}
//# sourceMappingURL=prism-progress.d.ts.map