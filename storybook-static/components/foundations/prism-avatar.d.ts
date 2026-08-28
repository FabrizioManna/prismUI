import { LitElement } from 'lit';
/**
 * User profile picture component.
 * Displays an image if `src` is provided, otherwise falls back to `initials`.
 * Handles image loading errors by gracefully falling back to initials.
 */
export declare class PrismAvatar extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The URL of the avatar image.
     */
    src: string;
    /**
     * Alt text for the avatar image (important for accessibility).
     */
    alt: string;
    /**
     * The initials to display if the image is missing or fails to load.
     */
    initials: string;
    /**
     * The size of the avatar in pixels.
     */
    size: number;
    private _hasError;
    private _handleError;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-avatar': PrismAvatar;
    }
}
//# sourceMappingURL=prism-avatar.d.ts.map