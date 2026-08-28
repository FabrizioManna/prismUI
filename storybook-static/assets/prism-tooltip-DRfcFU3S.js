import{i as h,a as d,b as m}from"./lit-element-Dl74xXHy.js";import{s as c,t as b}from"./shared-styles-DIo8y3SM.js";import{n}from"./property-DDJpMEtn.js";import{r as f}from"./state-D_z6CKVN.js";var u=Object.defineProperty,v=Object.getOwnPropertyDescriptor,r=(e,i,o,l)=>{for(var t=l>1?void 0:l?v(i,o):i,a=e.length-1,p;a>=0;a--)(p=e[a])&&(t=(l?p(i,o,t):p(t))||t);return l&&t&&u(i,o,t),t};let s=class extends d{constructor(){super(...arguments),this.text="",this.placement="top",this._visible=!1}_show(){this._visible=!0}_hide(){this._visible=!1}render(){let e="";switch(this.placement){case"top":e="bottom-full left-1/2 -translate-x-1/2 mb-2";break;case"bottom":e="top-full left-1/2 -translate-x-1/2 mt-2";break;case"left":e="right-full top-1/2 -translate-y-1/2 mr-2";break;case"right":e="left-full top-1/2 -translate-y-1/2 ml-2";break}return m`
      <div 
        class="relative inline-flex"
        @mouseenter="${this._show}"
        @mouseleave="${this._hide}"
        @focus="${this._show}"
        @blur="${this._hide}"
      >
        <slot></slot>
        
        <div 
          class="absolute z-50 whitespace-nowrap px-3 py-1.5 text-xs font-medium text-white bg-slate-800/90 dark:bg-slate-700/90 backdrop-blur-md rounded-md shadow-lg pointer-events-none transition-all duration-200 ${e} ${this._visible?"opacity-100 scale-100":"opacity-0 scale-95"}"
          role="tooltip"
          aria-hidden="${!this._visible}"
        >
          ${this.text}
          <!-- Arrow could be added here using pseudo-elements or extra div if needed -->
        </div>
      </div>
    `}};s.styles=[c,h`
      :host {
        display: inline-block;
        position: relative;
      }
    `];r([n({type:String})],s.prototype,"text",2);r([n({type:String})],s.prototype,"placement",2);r([f()],s.prototype,"_visible",2);s=r([b("prism-tooltip")],s);
