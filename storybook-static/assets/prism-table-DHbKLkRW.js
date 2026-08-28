import{i as p,a as b,b as i}from"./lit-element-Dl74xXHy.js";import{s as u,t as m}from"./shared-styles-DIo8y3SM.js";import{n as d}from"./property-DDJpMEtn.js";import{r as h}from"./state-D_z6CKVN.js";var g=Object.defineProperty,y=Object.getOwnPropertyDescriptor,c=(t,s,e,r)=>{for(var l=r>1?void 0:r?y(s,e):s,o=t.length-1,n;o>=0;o--)(n=t[o])&&(l=(r?n(s,e,l):n(l))||l);return r&&l&&g(s,e,l),l};let a=class extends b{constructor(){super(...arguments),this.columns=[],this.data=[],this.selectable=!1,this.rowKey="id",this._selectedKeys=new Set,this._sortColumn="",this._sortDirection=null}_toggleSelectAll(t){t.detail.checked?this._selectedKeys=new Set(this.data.map(e=>String(e[this.rowKey]))):this._selectedKeys.clear(),this._dispatchSelection()}_toggleRowSelection(t,s){const e=s.detail.checked,r=new Set(this._selectedKeys);e?r.add(t):r.delete(t),this._selectedKeys=r,this._dispatchSelection()}_dispatchSelection(){this.dispatchEvent(new CustomEvent("selection-change",{detail:{selectedKeys:Array.from(this._selectedKeys)}}))}_handleSort(t){const s=this.columns.find(e=>e.key===t);!s||!s.sortable||(this._sortColumn===t?this._sortDirection=this._sortDirection==="asc"?"desc":"asc":(this._sortColumn=t,this._sortDirection="asc"),this.dispatchEvent(new CustomEvent("sort",{detail:{column:this._sortColumn,direction:this._sortDirection}})))}render(){const t=this.data.length>0&&this._selectedKeys.size===this.data.length,s=this._selectedKeys.size>0&&this._selectedKeys.size<this.data.length;return i`
      <div class="w-full flex flex-col rounded-xl border border-slate-200/40 dark:border-slate-700/50 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/60 dark:bg-slate-800/60 border-b border-slate-200/40 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider font-semibold">
                
                ${this.selectable?i`
                  <th class="px-6 py-4 w-12 text-center">
                    <prism-checkbox 
                      .checked="${t}" 
                      .indeterminate="${s}"
                      @change="${this._toggleSelectAll}"
                    ></prism-checkbox>
                  </th>
                `:""}

                ${this.columns.map(e=>i`
                  <th 
                    class="px-6 py-4 text-${e.align||"left"} ${e.sortable?"cursor-pointer select-none hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors":""}"
                    @click="${()=>this._handleSort(e.key)}"
                  >
                    <div class="flex items-center gap-2 ${e.align==="right"?"justify-end":e.align==="center"?"justify-center":""}">
                      ${e.label}
                      ${e.sortable?i`
                        <span class="inline-flex flex-col w-3">
                          <!-- Up arrow -->
                          <svg class="w-3 h-3 -mb-1.5 ${this._sortColumn===e.key&&this._sortDirection==="asc"?"text-blue-500":"text-slate-400 opacity-50"}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
                          <!-- Down arrow -->
                          <svg class="w-3 h-3 ${this._sortColumn===e.key&&this._sortDirection==="desc"?"text-blue-500":"text-slate-400 opacity-50"}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </span>
                      `:""}
                    </div>
                  </th>
                `)}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/30 dark:divide-slate-700/40">
              ${this.data.map(e=>{const r=String(e[this.rowKey]),l=this._selectedKeys.has(r);return i`
                  <tr class="hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group ${l?"bg-blue-50/40 dark:bg-blue-900/10":""}">
                    
                    ${this.selectable?i`
                      <td class="px-6 py-4 whitespace-nowrap w-12 text-center">
                        <prism-checkbox 
                          .checked="${l}"
                          @change="${o=>this._toggleRowSelection(r,o)}"
                        ></prism-checkbox>
                      </td>
                    `:""}

                    ${this.columns.map(o=>i`
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200 text-${o.align||"left"}">
                        ${e[o.key]}
                      </td>
                    `)}
                  </tr>
                `})}
            </tbody>
          </table>
          
          ${this.data.length===0?i`
            <div class="px-6 py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <p class="text-sm font-medium">No data available</p>
            </div>
          `:""}
        </div>
        
        <!-- Pagination Footer Slot -->
        <div class="border-t border-slate-200/40 dark:border-slate-700/50">
          <slot name="footer"></slot>
        </div>
      </div>
    `}};a.styles=[u,p`
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
    `];c([d({type:Array})],a.prototype,"columns",2);c([d({type:Array})],a.prototype,"data",2);c([d({type:Boolean})],a.prototype,"selectable",2);c([d({type:String})],a.prototype,"rowKey",2);c([h()],a.prototype,"_selectedKeys",2);c([h()],a.prototype,"_sortColumn",2);c([h()],a.prototype,"_sortDirection",2);a=c([m("prism-table")],a);
