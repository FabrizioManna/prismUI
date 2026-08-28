import{i as h,a as u,b as c}from"./lit-element-Dl74xXHy.js";import{s as p,t as b}from"./shared-styles-DtmCOQje.js";import{n}from"./property-DDJpMEtn.js";var v=Object.defineProperty,f=Object.getOwnPropertyDescriptor,a=(r,t,i,l)=>{for(var e=l>1?void 0:l?f(t,i):t,o=r.length-1,d;o>=0;o--)(d=r[o])&&(e=(l?d(t,i,e):d(e))||e);return l&&e&&v(t,i,e),e};let s=class extends u{constructor(){super(...arguments),this.checked=!1,this.value="",this.disabled=!1}_handleChange(){this.disabled||(this.checked=!0,this.dispatchEvent(new CustomEvent("radio-select",{detail:{value:this.value},bubbles:!0,composed:!0})))}render(){const r=this.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer",t=this.checked?"bg-blue-500/80 border-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]":"bg-white/20 dark:bg-slate-800/40 border-slate-400/50 dark:border-slate-500/50";return c`
      <label class="relative flex items-center gap-2 ${r}">
        <div class="relative flex items-center justify-center w-5 h-5 rounded-full border backdrop-blur-sm transition-all duration-200 ${t}">
          <!-- Hidden Native Input -->
          <input
            type="radio"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            .value="${this.value}"
            @change="${this._handleChange}"
            class="absolute opacity-0 w-full h-full cursor-pointer m-0"
          />
          
          <!-- Inner Dot for Checked State -->
          ${this.checked?c`
            <div class="w-2 h-2 rounded-full bg-white pointer-events-none"></div>
          `:""}
        </div>
        
        <span class="text-sm font-medium text-slate-700 dark:text-slate-200 select-none">
          <slot></slot>
        </span>
      </label>
    `}};s.styles=[p,h`
      :host {
        display: inline-flex;
        align-items: center;
      }
    `];a([n({type:Boolean})],s.prototype,"checked",2);a([n({type:String})],s.prototype,"value",2);a([n({type:Boolean})],s.prototype,"disabled",2);s=a([b("prism-radio")],s);
