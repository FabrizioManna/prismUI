import { LitElement } from 'lit';
export interface TableColumn {
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
}
/**
 * Advanced Data Table styled with Glassmorphism.
 * Supports row selection, sorting, and pagination footer slots.
 */
export declare class PrismTable extends LitElement {
    static styles: import('lit').CSSResult[];
    columns: TableColumn[];
    data: any[];
    /**
     * If true, enables a leading checkbox column for row selection.
     */
    selectable: boolean;
    /**
     * Identifies the unique key in `data` to track selections (default: 'id')
     */
    rowKey: string;
    private _selectedKeys;
    private _sortColumn;
    private _sortDirection;
    private _toggleSelectAll;
    private _toggleRowSelection;
    private _dispatchSelection;
    private _handleSort;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-table': PrismTable;
    }
}
//# sourceMappingURL=prism-table.d.ts.map