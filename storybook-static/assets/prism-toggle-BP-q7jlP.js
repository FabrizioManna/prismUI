import{i as d,a as h,b as u}from"./lit-element-Dl74xXHy.js";import{s as b,t as p}from"./shared-styles-DIo8y3SM.js";import{n as c}from"./property-DDJpMEtn.js";var f=Object.defineProperty,g=Object.getOwnPropertyDescriptor,o=(e,s,i,a)=>{for(var t=a>1?void 0:a?g(s,i):s,n=e.length-1,l;n>=0;n--)(l=e[n])&&(t=(a?l(s,i,t):l(t))||t);return a&&t&&f(s,i,t),t};let r=class extends h{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.ariaLabel="Toggle switch"}_toggle(e){this.disabled||(e.preventDefault(),this.checked=!this.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked}})))}_handleKeyDown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._toggle(e))}render(){const e=this.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer",s=this.checked?"bg-blue-500/60 border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]":"bg-slate-300/30 dark:bg-slate-700/50 border-slate-400/30 dark:border-slate-500/30",i=this.checked?"translate-x-5":"translate-x-1";return u`
      <button
        type="button"
        role="switch"
        aria-checked="${this.checked}"
        aria-label="${this.ariaLabel}"
        ?disabled="${this.disabled}"
        @click="${this._toggle}"
        @keydown="${this._handleKeyDown}"
        class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 backdrop-blur-sm ${e} ${s}"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${i}"
        ></span>
      </button>
    `}};r.styles=[b,d`
      :host {
        display: inline-flex;
        align-items: center;
      }
    `];o([c({type:Boolean})],r.prototype,"checked",2);o([c({type:Boolean})],r.prototype,"disabled",2);o([c({type:String})],r.prototype,"ariaLabel",2);r=o([p("prism-toggle")],r);
