import{i as h,a as c,b as n}from"./lit-element-Dl74xXHy.js";import{s as u,t as w}from"./shared-styles-DtmCOQje.js";import{n as a}from"./property-DDJpMEtn.js";import{r as y}from"./state-D_z6CKVN.js";import"./prism-icon-CdpWaj66.js";/**
 * @license lucide-static v1.35.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=`
<svg
  class="lucide lucide-eye-off"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
  <path d="m2 2 20 20" />
</svg>
`;/**
 * @license lucide-static v1.35.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=`
<svg
  class="lucide lucide-eye"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
  <circle cx="12" cy="12" r="3" />
</svg>
`;var g=Object.defineProperty,f=Object.getOwnPropertyDescriptor,r=(t,s,i,l)=>{for(var o=l>1?void 0:l?f(s,i):s,d=t.length-1,p;d>=0;d--)(p=t[d])&&(o=(l?p(s,i,o):p(o))||o);return l&&o&&g(s,i,o),o};let e=class extends c{constructor(){super(...arguments),this.type="text",this.placeholder="",this.value="",this.helperText="",this.error=!1,this.disabled=!1,this._showPassword=!1}_handleInput(t){const s=t.target;this.value=s.value,this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value}}))}_togglePasswordVisibility(){this._showPassword=!this._showPassword}render(){const t=this.type==="password",s=t&&this._showPassword?"text":this.type;let i="border-slate-300/40 dark:border-slate-600/50 focus:border-blue-400/60 focus:ring-blue-400/30";this.error&&(i="border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]");const l=this.disabled?"opacity-50 cursor-not-allowed bg-slate-100/10":"bg-white/10 dark:bg-slate-800/20";return n`
      <div class="relative w-full">
        <div class="relative flex items-center">
          <input
            type="${s}"
            .value="${this.value}"
            placeholder="${this.placeholder}"
            ?disabled="${this.disabled}"
            @input="${this._handleInput}"
            class="w-full px-4 py-2 text-sm rounded-lg backdrop-blur-md border outline-none transition-all duration-200 focus:ring-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${i} ${l} ${t?"pr-10":""}"
          />
          
          ${t?n`
            <button 
              type="button"
              @click="${this._togglePasswordVisibility}"
              tabindex="-1"
              class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
            >
              <prism-icon 
                .icon="${this._showPassword?v:b}" 
                size="20" 
                class="w-5 h-5 flex items-center justify-center">
              </prism-icon>
            </button>
          `:""}
        </div>
        
        ${this.helperText?n`
          <p class="mt-1 text-xs ${this.error?"text-red-500":"text-slate-500 dark:text-slate-400"}">
            ${this.helperText}
          </p>
        `:""}
      </div>
    `}};e.styles=[u,h`
      :host {
        display: block;
        width: 100%;
      }
    `];r([a({type:String})],e.prototype,"type",2);r([a({type:String})],e.prototype,"placeholder",2);r([a({type:String})],e.prototype,"value",2);r([a({type:String})],e.prototype,"helperText",2);r([a({type:Boolean})],e.prototype,"error",2);r([a({type:Boolean})],e.prototype,"disabled",2);r([y()],e.prototype,"_showPassword",2);e=r([w("prism-input")],e);
