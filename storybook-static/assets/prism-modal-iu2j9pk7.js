import{i as p,a as b,b as d}from"./lit-element-Dl74xXHy.js";import{s as f,t as u}from"./shared-styles-DtmCOQje.js";import{n as c}from"./property-DDJpMEtn.js";import"./prism-icon-CdpWaj66.js";import{X as h}from"./x-C8XJCK3G.js";var m=Object.defineProperty,v=Object.getOwnPropertyDescriptor,n=(t,o,l,s)=>{for(var e=s>1?void 0:s?v(o,l):o,a=t.length-1,i;a>=0;a--)(i=t[a])&&(e=(s?i(o,l,e):i(e))||e);return s&&e&&m(o,l,e),e};let r=class extends b{constructor(){super(...arguments),this.open=!1,this.title=""}_close(){this.open=!1,this.dispatchEvent(new CustomEvent("close"))}_handleBackdropClick(t){t.target===t.currentTarget&&this._close()}render(){return this.open?d`
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        @click="${this._handleBackdropClick}"
        aria-modal="true"
        role="dialog"
      >
        <!-- Modal Container -->
        <div class="relative w-full max-w-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
              ${this.title}
              <slot name="header"></slot>
            </h3>
            <button 
              @click="${this._close}"
              class="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <prism-icon .icon="${h}" size="20"></prism-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <slot></slot>
          </div>

          <!-- Footer -->
          ${this.querySelector('[slot="footer"]')?d`
            <div class="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-700/50 rounded-b-2xl">
              <slot name="footer"></slot>
            </div>
          `:""}

        </div>
      </div>
    `:d``}};r.styles=[f,p`
      :host {
        display: block;
      }
      /* Prevent scrolling on body when open, handled via JS usually but defined here for context */
    `];n([c({type:Boolean})],r.prototype,"open",2);n([c({type:String})],r.prototype,"title",2);r=n([u("prism-modal")],r);
