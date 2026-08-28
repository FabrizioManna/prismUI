import{i as c,a as h,b as n}from"./lit-element-Dl74xXHy.js";import{s as u,t as b}from"./shared-styles-DIo8y3SM.js";import{n as d}from"./property-DDJpMEtn.js";import{r as v}from"./state-D_z6CKVN.js";var m=Object.defineProperty,g=Object.getOwnPropertyDescriptor,i=(e,o,a,r)=>{for(var t=r>1?void 0:r?g(o,a):o,s=e.length-1,p;s>=0;s--)(p=e[s])&&(t=(r?p(o,a,t):p(t))||t);return r&&t&&m(o,a,t),t};let l=class extends h{constructor(){super(...arguments),this.options=[],this.value="",this.placeholder="Select an option...",this.disabled=!1,this._isOpen=!1,this._handleDocumentClick=e=>{e.composedPath().includes(this)||(this._isOpen=!1)}}_toggleDropdown(){this.disabled||(this._isOpen=!this._isOpen)}_selectOption(e){this.value=e,this._isOpen=!1,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value}}))}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._handleDocumentClick)}disconnectedCallback(){document.removeEventListener("click",this._handleDocumentClick),super.disconnectedCallback()}render(){const e=this.options.find(s=>s.value===this.value),o=e?e.label:this.placeholder,a=!!e,r=this.disabled?"opacity-50 cursor-not-allowed bg-slate-100/10":"cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/30 bg-white/10 dark:bg-slate-800/20",t=this._isOpen?"border-blue-400/60 ring-2 ring-blue-400/30":"border-slate-300/40 dark:border-slate-600/50";return n`
      <div class="relative w-full">
        <!-- Trigger Button -->
        <button
          type="button"
          @click="${this._toggleDropdown}"
          ?disabled="${this.disabled}"
          class="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg backdrop-blur-md border transition-all duration-200 outline-none ${t} ${r} ${a?"text-slate-800 dark:text-slate-100":"text-slate-400 dark:text-slate-500"}"
        >
          <span class="truncate">${o}</span>
          <svg class="w-4 h-4 ml-2 transition-transform duration-200 ${this._isOpen?"rotate-180":""}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        ${this._isOpen?n`
          <ul class="absolute z-50 w-full mt-2 py-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-60 overflow-auto">
            ${this.options.map(s=>n`
              <li
                @click="${()=>this._selectOption(s.value)}"
                class="px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-blue-500/10 dark:hover:bg-blue-400/10 text-slate-700 dark:text-slate-200 ${this.value===s.value?"bg-blue-500/10 dark:bg-blue-400/10 font-medium":""}"
              >
                ${s.label}
              </li>
            `)}
            ${this.options.length===0?n`
              <li class="px-4 py-3 text-sm text-center text-slate-500">No options available</li>
            `:""}
          </ul>
        `:""}
      </div>
    `}};l.styles=[u,c`
      :host {
        display: block;
        width: 100%;
        position: relative;
      }
    `];i([d({type:Array})],l.prototype,"options",2);i([d({type:String})],l.prototype,"value",2);i([d({type:String})],l.prototype,"placeholder",2);i([d({type:Boolean})],l.prototype,"disabled",2);i([v()],l.prototype,"_isOpen",2);l=i([b("prism-select")],l);
