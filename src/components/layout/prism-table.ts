import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

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

  render() {
    return html`
      <div class="w-full rounded-xl border border-slate-200/40 dark:border-slate-700/50 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/40 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider font-semibold">
              ${this.columns.map(col => html`
                <th class="px-6 py-4 text-${col.align || 'left'}">${col.label}</th>
              `)}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/30 dark:divide-slate-700/40">
            ${this.data.map((row) => html`
              <tr class="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors duration-150 group">
                ${this.columns.map(col => html`
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200 text-${col.align || 'left'}">
                    ${row[col.key]}
                  </td>
                `)}
              </tr>
            `)}
          </tbody>
        </table>
        
        ${this.data.length === 0 ? html`
          <div class="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No data available
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-table': PrismTable;
  }
}
