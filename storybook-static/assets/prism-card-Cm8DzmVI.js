import{i as h,a as n,b as s}from"./lit-element-Dl74xXHy.js";import{s as x,t as c}from"./shared-styles-DIo8y3SM.js";import{n as b}from"./property-DDJpMEtn.js";var f=Object.defineProperty,v=Object.getOwnPropertyDescriptor,o=(r,l,i,a)=>{for(var t=a>1?void 0:a?v(l,i):l,d=r.length-1,p;d>=0;d--)(p=r[d])&&(t=(a?p(l,i,t):p(t))||t);return a&&t&&f(l,i,t),t};let e=class extends n{constructor(){super(...arguments),this.title="",this.subtitle="",this.noPadding=!1}render(){const r=this.noPadding?"p-0":"p-6";return s`
      <div class="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.16)] overflow-hidden flex flex-col h-full transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
        
        ${this.title||this.subtitle||this.querySelector('[slot="header"]')?s`
          <div class="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/20 dark:bg-slate-800/20">
            <div class="flex justify-between items-center gap-4">
              <div class="flex-1">
                ${this.title?s`<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">${this.title}</h3>`:""}
                ${this.subtitle?s`<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${this.subtitle}</p>`:""}
              </div>
              <slot name="header"></slot>
            </div>
          </div>
        `:""}
        
        <div class="${r} flex-1 flex flex-col relative z-10">
          <slot></slot>
        </div>

        ${this.querySelector('[slot="footer"]')?s`
          <div class="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
            <slot name="footer"></slot>
          </div>
        `:""}
      </div>
    `}};e.styles=[x,h`
      :host {
        display: block;
        height: 100%;
      }
    `];o([b({type:String})],e.prototype,"title",2);o([b({type:String})],e.prototype,"subtitle",2);o([b({type:Boolean,attribute:"no-padding"})],e.prototype,"noPadding",2);e=o([c("prism-card")],e);
