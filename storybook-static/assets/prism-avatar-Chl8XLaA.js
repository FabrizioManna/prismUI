import{i as c,a as d,b as h}from"./lit-element-Dl74xXHy.js";import{s as m,t as f}from"./shared-styles-DtmCOQje.js";import{n as o}from"./property-DDJpMEtn.js";import{r as u}from"./state-D_z6CKVN.js";var y=Object.defineProperty,v=Object.getOwnPropertyDescriptor,e=(i,s,l,a)=>{for(var t=a>1?void 0:a?v(s,l):s,p=i.length-1,n;p>=0;p--)(n=i[p])&&(t=(a?n(s,l,t):n(t))||t);return a&&t&&y(s,l,t),t};let r=class extends d{constructor(){super(...arguments),this.src="",this.alt="User avatar",this.initials="",this.size=40,this._hasError=!1}_handleError(){this._hasError=!0}render(){const i=this.src&&!this._hasError,s=`width: ${this.size}px; height: ${this.size}px; font-size: ${Math.max(10,this.size*.4)}px;`;return h`
      <div 
        class="relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-300/30 dark:border-slate-600/30 shadow-sm"
        style="${s}"
      >
        ${i?h`<img src="${this.src}" alt="${this.alt}" @error="${this._handleError}" class="w-full h-full object-cover" />`:h`<span class="font-medium text-slate-700 dark:text-slate-200 uppercase tracking-wider">${this.initials.slice(0,2)}</span>`}
      </div>
    `}};r.styles=[m,c`
      :host {
        display: inline-flex;
      }
    `];e([o({type:String})],r.prototype,"src",2);e([o({type:String})],r.prototype,"alt",2);e([o({type:String})],r.prototype,"initials",2);e([o({type:Number})],r.prototype,"size",2);e([u()],r.prototype,"_hasError",2);r=e([f("prism-avatar")],r);
