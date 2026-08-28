import{i as p,a as c,b as h}from"./lit-element-Dl74xXHy.js";import{s as u,t as v}from"./shared-styles-DtmCOQje.js";import{n as d}from"./property-DDJpMEtn.js";var f=Object.defineProperty,b=Object.getOwnPropertyDescriptor,l=(a,s,r,o)=>{for(var t=o>1?void 0:o?b(s,r):s,i=a.length-1,n;i>=0;i--)(n=a[i])&&(t=(o?n(s,r,t):n(t))||t);return o&&t&&f(s,r,t),t};let e=class extends c{constructor(){super(...arguments),this.title="",this.open=!1}_toggle(){this.open=!this.open,this.dispatchEvent(new CustomEvent("toggle",{detail:{open:this.open}}))}render(){return h`
      <div class="border border-slate-200/50 dark:border-slate-700/50 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md mb-3 transition-colors duration-200 hover:bg-white/60 dark:hover:bg-slate-900/60">
        <button
          @click="${this._toggle}"
          class="w-full flex items-center justify-between px-6 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
          aria-expanded="${this.open}"
        >
          <span class="font-medium text-slate-800 dark:text-slate-200">${this.title}</span>
          <svg 
            class="w-5 h-5 text-slate-400 transition-transform duration-300 ${this.open?"rotate-180":""}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- Smooth grid expansion technique -->
        <div 
          class="grid transition-all duration-300 ease-in-out ${this.open?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"}"
        >
          <div class="overflow-hidden">
            <div class="px-6 pb-5 pt-1 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `}};e.styles=[u,p`
      :host {
        display: block;
      }
    `];l([d({type:String})],e.prototype,"title",2);l([d({type:Boolean})],e.prototype,"open",2);e=l([v("prism-accordion")],e);
