import{i as b,a as c,b as n}from"./lit-element-Dl74xXHy.js";import{s as g,t as h}from"./shared-styles-DIo8y3SM.js";import{n as i}from"./property-DDJpMEtn.js";var u=Object.defineProperty,f=Object.getOwnPropertyDescriptor,o=(l,s,e,a)=>{for(var t=a>1?void 0:a?f(s,e):s,d=l.length-1,p;d>=0;d--)(p=l[d])&&(t=(a?p(s,e,t):p(t))||t);return a&&t&&u(s,e,t),t};let r=class extends c{constructor(){super(...arguments),this.variant="primary",this.size="md",this.disabled=!1,this.loading=!1,this.type="button"}render(){const l="relative overflow-hidden rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md border flex items-center justify-center gap-2";let s="px-4 py-2 text-sm";this.size==="sm"?s="px-3 py-1.5 text-xs":this.size==="lg"&&(s="px-6 py-3 text-base");let e="";switch(this.variant){case"primary":e="bg-blue-500/40 hover:bg-blue-600/50 border-blue-400/40 text-blue-900 dark:text-blue-50 focus:ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]";break;case"secondary":e="bg-white/30 hover:bg-white/40 dark:bg-slate-800/40 dark:hover:bg-slate-700/50 border-slate-300/40 dark:border-slate-600/40 text-slate-800 dark:text-slate-200 focus:ring-slate-400/50 shadow-sm";break;case"danger":e="bg-red-500/40 hover:bg-red-600/50 border-red-400/40 text-red-900 dark:text-red-50 focus:ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]";break;case"ghost":e="bg-transparent hover:bg-slate-200/30 dark:hover:bg-slate-700/30 border-transparent text-slate-700 dark:text-slate-300 focus:ring-slate-400/50";break}const a=this.disabled||this.loading,t=a?"opacity-60 cursor-not-allowed":"cursor-pointer active:scale-[0.98]";return n`
      <button
        type=${this.type}
        ?disabled=${a}
        class="${l} ${s} ${e} ${t}"
      >
        ${this.loading?n`
          <svg class="spinner w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `:n`
          <slot name="leading-icon"></slot>
        `}
        <slot></slot>
        ${this.loading?"":n`<slot name="trailing-icon"></slot>`}
      </button>
    `}};r.styles=[g,b`
      :host {
        display: inline-block;
      }
      /* Simple CSS spinner */
      .spinner {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `];o([i({type:String})],r.prototype,"variant",2);o([i({type:String})],r.prototype,"size",2);o([i({type:Boolean})],r.prototype,"disabled",2);o([i({type:Boolean})],r.prototype,"loading",2);o([i({type:String})],r.prototype,"type",2);r=o([h("prism-button")],r);
