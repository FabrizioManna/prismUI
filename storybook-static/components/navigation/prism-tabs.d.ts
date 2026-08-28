import { LitElement } from 'lit';
export interface TabItem {
    id: string;
    label: string;
    icon?: string;
}
/**
 * Horizontal navigation tabs for switching views within a page.
 * Features a smooth animated indicator line.
 */
export declare class PrismTabs extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * Array of tab objects.
     */
    tabs: TabItem[];
    /**
     * The ID of the currently active tab.
     */
    activeTab: string;
    private _selectTab;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-tabs': PrismTabs;
    }
}
//# sourceMappingURL=prism-tabs.d.ts.map