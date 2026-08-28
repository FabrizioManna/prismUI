import{i as u,a as c,b as m}from"./lit-element-Dl74xXHy.js";import{s as d,t as h}from"./shared-styles-DIo8y3SM.js";import{n as p}from"./property-DDJpMEtn.js";var v=Object.defineProperty,b=Object.getOwnPropertyDescriptor,i=(r,s,o,l)=>{for(var e=l>1?void 0:l?b(s,o):s,a=r.length-1,n;a>=0;a--)(n=r[a])&&(e=(l?n(s,o,e):n(e))||e);return l&&e&&v(s,o,e),e};let t=class extends c{constructor(){super(...arguments),this.value="",this.danger=!1}_handleClick(){this.dispatchEvent(new CustomEvent("menu-select",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){const r=this.danger?"text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10":"text-slate-700 dark:text-slate-200 hover:bg-blue-500/10 dark:hover:bg-blue-400/10";return m`
      <li 
        @click="${this._handleClick}"
        class="flex items-center w-full px-4 py-2 text-sm cursor-pointer transition-colors ${r}"
        role="menuitem"
        tabindex="0"
      >
        <slot name="icon"></slot>
        <span class="flex-grow text-left"><slot></slot></span>
      </li>
    `}};t.styles=[d,u`
      :host {
        display: block;
      }
    `];i([p({type:String})],t.prototype,"value",2);i([p({type:Boolean})],t.prototype,"danger",2);t=i([h("prism-menu-item")],t);
