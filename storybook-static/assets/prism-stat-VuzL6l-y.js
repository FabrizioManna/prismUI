import{i as h,a as v,b as p}from"./lit-element-Dl74xXHy.js";import{s as x,t as m}from"./shared-styles-DIo8y3SM.js";import{n}from"./property-DDJpMEtn.js";var b=Object.defineProperty,c=Object.getOwnPropertyDescriptor,i=(r,t,a,s)=>{for(var e=s>1?void 0:s?c(t,a):t,l=r.length-1,d;l>=0;l--)(d=r[l])&&(e=(s?d(t,a,e):d(e))||e);return s&&e&&b(t,a,e),e};let o=class extends v{constructor(){super(...arguments),this.title="",this.value="",this.trend=""}render(){let r="",t="text-slate-500 dark:text-slate-400";if(this.trend){const a=this.trend.startsWith("+"),s=this.trend.startsWith("-");a?(t="text-green-600 dark:text-green-400",r='<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>'):s&&(t="text-red-600 dark:text-red-400",r='<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>')}return p`
      <div class="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] flex items-start justify-between group transition-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">${this.title}</p>
          <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">${this.value}</h3>
          
          ${this.trend?p`
            <div class="flex items-center mt-2 text-sm font-medium ${t}">
              <div .innerHTML="${r}"></div>
              <span>${this.trend}</span>
            </div>
          `:""}
        </div>

        <div class="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl text-blue-500 dark:text-blue-400 shadow-sm border border-slate-200/30 dark:border-slate-700/30">
          <slot name="icon"></slot>
        </div>
      </div>
    `}};o.styles=[x,h`
      :host {
        display: block;
      }
    `];i([n({type:String})],o.prototype,"title",2);i([n({type:String})],o.prototype,"value",2);i([n({type:String})],o.prototype,"trend",2);o=i([m("prism-stat")],o);
