import { LitElement } from 'lit';
/**
 * Pagination component for data tables.
 */
export declare class PrismPagination extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Current active page (1-indexed).
     */
    currentPage: number;
    /**
     * Total number of pages.
     */
    totalPages: number;
    private _goToPage;
    private _prev;
    private _next;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-pagination': PrismPagination;
    }
}
//# sourceMappingURL=prism-pagination.d.ts.map