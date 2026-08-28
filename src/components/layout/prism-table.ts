import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

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
@customElement('prism-table')
export class PrismTable extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        overflow-x: auto;
      }
      /* Custom scrollbar for webkit */
      ::-webkit-scrollbar {
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.3);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.5);
      }
    `
  ];

  @property({ type: Array }) columns: TableColumn[] = [];
  @property({ type: Array }) data: any[] = [];
  
  /**
   * If true, enables a leading checkbox column for row selection.
   */
  @property({ type: Boolean }) selectable = false;
  
  /**
   * Identifies the unique key in `data` to track selections (default: 'id')
   */
  @property({ type: String }) rowKey = 'id';

  @state() private _selectedKeys = new Set<string>();
  @state() private _sortColumn = '';
  @state() private _sortDirection: 'asc' | 'desc' | null = null;

  private _toggleSelectAll(e: CustomEvent) {
    const checked = e.detail.checked;
    if (checked) {
      this._selectedKeys = new Set(this.data.map(row => String(row[this.rowKey])));
    } else {
      this._selectedKeys.clear();
    }
    this._dispatchSelection();
  }

  private _toggleRowSelection(key: string, e: CustomEvent) {
    const checked = e.detail.checked;
    const newKeys = new Set(this._selectedKeys);
    if (checked) {
      newKeys.add(key);
    } else {
      newKeys.delete(key);
    }
    this._selectedKeys = newKeys;
    this._dispatchSelection();
  }

  private _dispatchSelection() {
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedKeys: Array.from(this._selectedKeys) }
    }));
  }

  private _handleSort(colKey: string) {
    const col = this.columns.find(c => c.key === colKey);
    if (!col || !col.sortable) return;

    if (this._sortColumn === colKey) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = colKey;
      this._sortDirection = 'asc';
    }

    this.dispatchEvent(new CustomEvent('sort', {
      detail: { column: this._sortColumn, direction: this._sortDirection }
    }));
  }

  render() {
    const allSelected = this.data.length > 0 && this._selectedKeys.size === this.data.length;
    const someSelected = this._selectedKeys.size > 0 && this._selectedKeys.size < this.data.length;

    return html`
      <div class="prism-glass w-full flex flex-col overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100/40 dark:bg-slate-800/50 border-b border-slate-300/40 dark:border-slate-600/50 text-slate-800 dark:text-white text-xs uppercase tracking-wider font-semibold">
                
                ${this.selectable ? html`
                  <th class="px-6 py-4 w-12 text-center">
                    <prism-checkbox 
                      .checked="${allSelected}" 
                      .indeterminate="${someSelected}"
                      @change="${this._toggleSelectAll}"
                    ></prism-checkbox>
                  </th>
                ` : ''}

                ${this.columns.map(col => html`
                  <th 
                    class="px-6 py-4 text-${col.align || 'left'} ${col.sortable ? 'cursor-pointer select-none hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors' : ''}"
                    @click="${() => this._handleSort(col.key)}"
                  >
                    <div class="flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}">
                      ${col.label}
                      ${col.sortable ? html`
                        <span class="inline-flex flex-col w-3">
                          <!-- Up arrow -->
                          <svg class="w-3 h-3 -mb-1.5 ${this._sortColumn === col.key && this._sortDirection === 'asc' ? 'text-blue-500' : 'text-slate-400 opacity-50'}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
                          <!-- Down arrow -->
                          <svg class="w-3 h-3 ${this._sortColumn === col.key && this._sortDirection === 'desc' ? 'text-blue-500' : 'text-slate-400 opacity-50'}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </span>
                      ` : ''}
                    </div>
                  </th>
                `)}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/30 dark:divide-slate-700/40">
              ${this.data.map((row) => {
                const rowKeyStr = String(row[this.rowKey]);
                const isSelected = this._selectedKeys.has(rowKeyStr);
                
                return html`
                  <tr class="hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group ${isSelected ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}">
                    
                    ${this.selectable ? html`
                      <td class="px-6 py-4 whitespace-nowrap w-12 text-center">
                        <prism-checkbox 
                          .checked="${isSelected}"
                          @change="${(e: CustomEvent) => this._toggleRowSelection(rowKeyStr, e)}"
                        ></prism-checkbox>
                      </td>
                    ` : ''}

                    ${this.columns.map(col => html`
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200 text-${col.align || 'left'}">
                        ${row[col.key]}
                      </td>
                    `)}
                  </tr>
                `;
              })}
            </tbody>
          </table>
          
          ${this.data.length === 0 ? html`
            <div class="px-6 py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <p class="text-sm font-medium">No data available</p>
            </div>
          ` : ''}
        </div>
        
        <!-- Pagination Footer Slot -->
        <div class="border-t border-slate-200/40 dark:border-slate-700/50">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-table': PrismTable;
  }
}
