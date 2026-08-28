import{i as h,a as p,b as c}from"./lit-element-Dl74xXHy.js";import{s as b,t as m}from"./shared-styles-DIo8y3SM.js";import{n as a}from"./property-DDJpMEtn.js";import{e as u}from"./query-BApjzB0v.js";var f=Object.defineProperty,k=Object.getOwnPropertyDescriptor,i=(e,t,o,n)=>{for(var r=n>1?void 0:n?k(t,o):t,l=e.length-1,d;l>=0;l--)(d=e[l])&&(r=(n?d(t,o,r):d(r))||r);return n&&r&&f(t,o,r),r};let s=class extends p{constructor(){super(...arguments),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.ariaLabel="Checkbox"}_handleChange(e){const t=e.target;this.checked=t.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked}}))}updated(e){e.has("indeterminate")&&this.checkboxInput&&(this.checkboxInput.indeterminate=this.indeterminate)}render(){const e=this.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer",t=this.checked||this.indeterminate?"bg-blue-500/80 border-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]":"bg-white/20 dark:bg-slate-800/40 border-slate-400/50 dark:border-slate-500/50";return c`
      <label class="relative flex items-center gap-2 ${e}">
        <div class="relative flex items-center justify-center w-5 h-5 rounded-md border backdrop-blur-sm transition-all duration-200 ${t}">
          <!-- Hidden Native Input -->
          <input
            type="checkbox"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            aria-label="${this.ariaLabel}"
            @change="${this._handleChange}"
            class="absolute opacity-0 w-full h-full cursor-pointer m-0"
          />
          
          <!-- SVG Icon for Checked -->
          ${this.checked&&!this.indeterminate?c`
            <svg class="w-3.5 h-3.5 text-white pointer-events-none" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          `:""}

          <!-- SVG Icon for Indeterminate -->
          ${this.indeterminate?c`
            <svg class="w-3.5 h-3.5 text-white pointer-events-none" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
            </svg>
          `:""}
        </div>
        
        <span class="text-sm font-medium text-slate-700 dark:text-slate-200 select-none">
          <slot></slot>
        </span>
      </label>
    `}};s.styles=[b,h`
      :host {
        display: inline-flex;
        align-items: center;
      }
    `];i([u("input")],s.prototype,"checkboxInput",2);i([a({type:Boolean})],s.prototype,"checked",2);i([a({type:Boolean})],s.prototype,"indeterminate",2);i([a({type:Boolean})],s.prototype,"disabled",2);i([a({type:String})],s.prototype,"ariaLabel",2);s=i([m("prism-checkbox")],s);
