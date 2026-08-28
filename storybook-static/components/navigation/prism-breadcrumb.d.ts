import { LitElement } from 'lit';
export interface BreadcrumbItem {
    label: string;
    href?: string;
}
/**
 * Breadcrumb component showing current page location in the hierarchy.
 */
export declare class PrismBreadcrumb extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * The list of items in the breadcrumb path.
     */
    items: BreadcrumbItem[];
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-breadcrumb': PrismBreadcrumb;
    }
}
//# sourceMappingURL=prism-breadcrumb.d.ts.map