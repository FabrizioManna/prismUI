import { LitElement } from 'lit';
/**
 * A highly customizable button component tailored for Glassmorphism interfaces.
 * Supports various variants, sizes, and states (including a loading spinner).
 */
export declare class PrismButton extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The visual style variant of the button.
     */
    variant: 'primary' | 'secondary' | 'danger' | 'ghost';
    /**
     * The size of the button.
     */
    size: 'sm' | 'md' | 'lg';
    /**
     * Disables the button.
     */
    disabled: boolean;
    /**
     * Shows a loading spinner and disables the button.
     */
    loading: boolean;
    /**
     * Button type attribute (button, submit, reset).
     */
    type: 'button' | 'submit' | 'reset';
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-button': PrismButton;
    }
}
//# sourceMappingURL=prism-button.d.ts.map