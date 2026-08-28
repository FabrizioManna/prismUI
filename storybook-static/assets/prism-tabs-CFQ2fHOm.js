import{i as d,a as p,b as n}from"./lit-element-Dl74xXHy.js";import{s as v,t as u}from"./shared-styles-DIo8y3SM.js";import{n as c}from"./property-DDJpMEtn.js";var f=Object.defineProperty,h=Object.getOwnPropertyDescriptor,b=(e,t,o,r)=>{for(var s=r>1?void 0:r?h(t,o):t,l=e.length-1,i;l>=0;l--)(i=e[l])&&(s=(r?i(t,o,s):i(s))||s);return r&&s&&f(t,o,s),s};let a=class extends p{constructor(){super(...arguments),this.tabs=[],this.activeTab=""}_selectTab(e){this.activeTab=e,this.dispatchEvent(new CustomEvent("tab-change",{detail:{activeTab:e}}))}render(){return n`
      <div class="w-full border-b border-slate-200/50 dark:border-slate-700/50">
        <nav class="flex overflow-x-auto tabs-scroll space-x-8" aria-label="Tabs">
          ${this.tabs.map(e=>{const t=e.id===this.activeTab;return n`
              <button
                @click="${()=>this._selectTab(e.id)}"
                class="whitespace-nowrap py-4 px-1 border-b-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${t?"text-blue-600 dark:text-blue-400 font-medium":"text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"} ${t?"border-blue-500 shadow-[0_2px_10px_rgba(59,130,246,0.5)]":"border-transparent hover:border-slate-300 dark:hover:border-slate-600"}"
                aria-current="${t?"page":"false"}"
              >
                <div class="flex items-center gap-2">
                  ${e.icon?n`<slot name="icon-${e.id}"></slot>`:""}
                  ${e.label}
                </div>
              </button>
            `})}
        </nav>
      </div>
    `}};a.styles=[v,d`
      :host {
        display: block;
        width: 100%;
      }
      /* Hide scrollbar for overflow */
      .tabs-scroll::-webkit-scrollbar {
        display: none;
      }
      .tabs-scroll {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `];b([c({type:Array})],a.prototype,"tabs",2);b([c({type:String})],a.prototype,"activeTab",2);a=b([u("prism-tabs")],a);
