import{i as p,a as f,b as d}from"./lit-element-Dl74xXHy.js";import{s as b,t as m}from"./shared-styles-DIo8y3SM.js";import{n as c}from"./property-DDJpMEtn.js";import"./prism-icon-DSnERsLg.js";import{X as h}from"./x-C8XJCK3G.js";var u=Object.defineProperty,g=Object.getOwnPropertyDescriptor,i=(t,r,l,o)=>{for(var e=o>1?void 0:o?g(r,l):r,a=t.length-1,n;a>=0;a--)(n=t[a])&&(e=(o?n(r,l,e):n(e))||e);return o&&e&&u(r,l,e),e};let s=class extends f{constructor(){super(...arguments),this.open=!1,this.title="",this.position="right"}_close(){this.open=!1,this.dispatchEvent(new CustomEvent("close"))}_handleBackdropClick(t){t.target===t.currentTarget&&this._close()}render(){if(!this.open)return d``;const t=this.position==="left"?"left-0 rounded-r-2xl border-r":"right-0 rounded-l-2xl border-l",r=this.position==="left"?"animate-slide-in-left":"animate-slide-in-right";return d`
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        @click="${this._handleBackdropClick}"
        aria-modal="true"
        role="dialog"
      >
        <!-- Drawer Container -->
        <div class="fixed top-0 bottom-0 w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-white/40 dark:border-slate-700/50 shadow-2xl flex flex-col ${t} ${r}">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
              ${this.title}
              <slot name="header"></slot>
            </h3>
            <button 
              @click="${this._close}"
              class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close drawer"
            >
              <prism-icon .icon="${h}" size="20"></prism-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto flex-1">
            <slot></slot>
          </div>

          <!-- Footer -->
          ${this.querySelector('[slot="footer"]')?d`
            <div class="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
              <slot name="footer"></slot>
            </div>
          `:""}

        </div>
      </div>
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      </style>
    `}};s.styles=[b,p`
      :host {
        display: block;
      }
    `];i([c({type:Boolean})],s.prototype,"open",2);i([c({type:String})],s.prototype,"title",2);i([c({type:String})],s.prototype,"position",2);s=i([m("prism-drawer")],s);
