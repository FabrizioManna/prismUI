import{i as d,a as m,b as l}from"./lit-element-Dl74xXHy.js";import{s as f,t as u}from"./shared-styles-DIo8y3SM.js";import{n as a}from"./property-DDJpMEtn.js";import"./prism-icon-DSnERsLg.js";import{I as h,T as b,C as v,a as x}from"./triangle-alert-dj6S1Ge3.js";import{X as g}from"./x-C8XJCK3G.js";var y=Object.defineProperty,k=Object.getOwnPropertyDescriptor,o=(t,e,s,n)=>{for(var r=n>1?void 0:n?k(e,s):e,p=t.length-1,c;p>=0;p--)(c=t[p])&&(r=(n?c(e,s,r):c(r))||r);return n&&r&&y(e,s,r),r};let i=class extends m{constructor(){super(...arguments),this.variant="info",this.title="",this.description="",this.duration=5e3,this.open=!1,this._timer=null}updated(t){t.has("open")&&this.open&&this.duration>0&&(this._timer&&clearTimeout(this._timer),this._timer=setTimeout(()=>this._close(),this.duration))}disconnectedCallback(){super.disconnectedCallback(),this._timer&&clearTimeout(this._timer)}_close(){this.open=!1,this.dispatchEvent(new CustomEvent("close"))}render(){if(!this.open)return l``;let t=h,e="text-blue-500",s="border-blue-500/50";switch(this.variant){case"success":t=x,e="text-green-500",s="border-green-500/50";break;case"error":t=v,e="text-red-500",s="border-red-500/50";break;case"warning":t=b,e="text-amber-500",s="border-amber-500/50";break}return l`
      <div class="pointer-events-auto flex w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden border ${s} animate-toast-in ring-1 ring-black/5 dark:ring-white/10">
        <div class="p-4 flex items-start w-full">
          <div class="flex-shrink-0 ${e} mt-0.5">
            <prism-icon .icon="${t}" size="20"></prism-icon>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            ${this.title?l`<p class="text-sm font-semibold text-slate-800 dark:text-slate-100">${this.title}</p>`:""}
            ${this.description?l`<p class="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${this.description}</p>`:""}
            <slot></slot>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button 
              type="button" 
              @click="${this._close}"
              class="inline-flex rounded-md bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <span class="sr-only">Close</span>
              <prism-icon .icon="${g}" size="16"></prism-icon>
            </button>
          </div>
        </div>
      </div>
    `}};i.styles=[f,d`
      :host {
        display: block;
        /* Positioned via external container usually, but works inline too */
      }
      .animate-toast-in {
        animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1), fadeIn 0.3s ease-out;
      }
      @keyframes slideInUp {
        from { transform: translateY(20px); }
        to { transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `];o([a({type:String})],i.prototype,"variant",2);o([a({type:String})],i.prototype,"title",2);o([a({type:String})],i.prototype,"description",2);o([a({type:Number})],i.prototype,"duration",2);o([a({type:Boolean})],i.prototype,"open",2);i=o([u("prism-toast")],i);
