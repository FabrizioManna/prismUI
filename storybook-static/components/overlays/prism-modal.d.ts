import { LitElement } from 'lit';
/**
 * A centered dialog overlay utilizing Glassmorphism.
 */
export declare class PrismModal extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * If true, the modal is visible.
     */
    open: boolean;
    /**
     * The title in the modal header.
     */
    title: string;
    private _close;
    private _handleBackdropClick;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-modal': PrismModal;
    }
}
//# sourceMappingURL=prism-modal.d.ts.map