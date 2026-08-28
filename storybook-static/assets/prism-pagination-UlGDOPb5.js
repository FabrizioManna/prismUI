import{i as u,a as g,b as d}from"./lit-element-Dl74xXHy.js";import{s as p,t as b}from"./shared-styles-DtmCOQje.js";import{n as c}from"./property-DDJpMEtn.js";var f=Object.defineProperty,h=Object.getOwnPropertyDescriptor,n=(t,i,s,a)=>{for(var e=a>1?void 0:a?h(i,s):i,o=t.length-1,r;o>=0;o--)(r=t[o])&&(e=(a?r(i,s,e):r(e))||e);return a&&e&&f(i,s,e),e};let l=class extends g{constructor(){super(...arguments),this.currentPage=1,this.totalPages=1}_goToPage(t){t<1||t>this.totalPages||t===this.currentPage||(this.currentPage=t,this.dispatchEvent(new CustomEvent("page-change",{detail:{page:this.currentPage}})))}_prev(){this._goToPage(this.currentPage-1)}_next(){this._goToPage(this.currentPage+1)}render(){const t=[];let s=Math.max(1,this.currentPage-Math.floor(2.5)),a=Math.min(this.totalPages,s+5-1);a-s+1<5&&(s=Math.max(1,a-5+1));for(let e=s;e<=a;e++)t.push(e);return d`
      <div class="flex items-center justify-between px-4 py-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 sm:px-6 rounded-lg">
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-slate-700 dark:text-slate-300">
              Showing page <span class="font-medium">${this.currentPage}</span> of <span class="font-medium">${this.totalPages}</span>
            </p>
          </div>
          
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <!-- Previous Button -->
              <button
                @click="${this._prev}"
                ?disabled="${this.currentPage===1}"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 dark:text-slate-500 ring-1 ring-inset ring-slate-300/50 dark:ring-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Page Numbers -->
              ${t.map(e=>{const r=e===this.currentPage?"relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]":"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 ring-1 ring-inset ring-slate-300/50 dark:ring-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0 transition-colors";return d`
                  <button
                    @click="${()=>this._goToPage(e)}"
                    class="${r}"
                  >
                    ${e}
                  </button>
                `})}
              
              <!-- Next Button -->
              <button
                @click="${this._next}"
                ?disabled="${this.currentPage===this.totalPages}"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 dark:text-slate-500 ring-1 ring-inset ring-slate-300/50 dark:ring-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    `}};l.styles=[p,u`
      :host {
        display: block;
      }
    `];n([c({type:Number})],l.prototype,"currentPage",2);n([c({type:Number})],l.prototype,"totalPages",2);l=n([b("prism-pagination")],l);
