import { LitElement } from 'lit';
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
/**
 * A floating notification (snackbar) component utilizing Glassmorphism.
 */
export declare class PrismToast extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The variant determining the icon and color scheme.
     */
    variant: ToastVariant;
    /**
     * The main message title.
     */
    title: string;
    /**
     * A more detailed description.
     */
    description: string;
    /**
     * Automatically close after X milliseconds. 0 disables auto-close.
     */
    duration: number;
    /**
     * If true, the toast is visible.
     */
    open: boolean;
    private _timer;
    updated(changedProperties: Map<string, any>): void;
    disconnectedCallback(): void;
    private _close;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-toast': PrismToast;
    }
}
//# sourceMappingURL=prism-toast.d.ts.map