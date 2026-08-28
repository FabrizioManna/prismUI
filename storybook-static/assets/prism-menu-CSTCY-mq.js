import{i as p,a as d,b as a}from"./lit-element-Dl74xXHy.js";import{s as h,t as u}from"./shared-styles-DIo8y3SM.js";import{n as m}from"./property-DDJpMEtn.js";import{r as _}from"./state-D_z6CKVN.js";var b=Object.defineProperty,v=Object.getOwnPropertyDescriptor,c=(t,s,i,l)=>{for(var e=l>1?void 0:l?v(s,i):s,r=t.length-1,o;r>=0;r--)(o=t[r])&&(e=(l?o(s,i,e):o(e))||e);return l&&e&&b(s,i,e),e};let n=class extends d{constructor(){super(...arguments),this._isOpen=!1,this.placement="bottom-start",this._handleDocumentClick=t=>{t.composedPath().includes(this)||this._closeMenu()},this._handleMenuSelect=()=>{this._closeMenu()}}_toggleMenu(){this._isOpen=!this._isOpen}_closeMenu(){this._isOpen=!1}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._handleDocumentClick),this.addEventListener("menu-select",this._handleMenuSelect)}disconnectedCallback(){document.removeEventListener("click",this._handleDocumentClick),this.removeEventListener("menu-select",this._handleMenuSelect),super.disconnectedCallback()}render(){const t=this.placement==="bottom-end"?"right-0":"left-0";return a`
      <div class="relative inline-block">
        <!-- Trigger Slot -->
        <div @click="${this._toggleMenu}" class="cursor-pointer">
          <slot name="trigger"></slot>
        </div>

        <!-- Dropdown Menu -->
        ${this._isOpen?a`
          <ul 
            class="absolute z-50 mt-2 min-w-[200px] py-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${t}"
            role="menu"
          >
            <slot></slot>
          </ul>
        `:""}
      </div>
    `}};n.styles=[h,p`
      :host {
        display: inline-block;
        position: relative;
      }
    `];c([_()],n.prototype,"_isOpen",2);c([m({type:String})],n.prototype,"placement",2);n=c([u("prism-menu")],n);
