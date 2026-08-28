import{i as m,a as p,b as u}from"./lit-element-Dl74xXHy.js";import{s as b,t as v}from"./shared-styles-DIo8y3SM.js";import{n}from"./property-DDJpMEtn.js";var h=Object.defineProperty,f=Object.getOwnPropertyDescriptor,l=(s,r,i,a)=>{for(var e=a>1?void 0:a?f(r,i):r,o=s.length-1,d;o>=0;o--)(d=s[o])&&(e=(a?d(r,i,e):d(e))||e);return a&&e&&h(r,i,e),e};let t=class extends p{constructor(){super(...arguments),this.value=0,this.max=100,this.label=""}render(){const s=Math.min(100,Math.max(0,this.value/this.max*100));return u`
      <div class="w-full">
        ${this.label?u`
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${this.label}</span>
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">${Math.round(s)}%</span>
          </div>
        `:""}
        
        <div class="w-full h-2.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-300/30 dark:border-slate-600/30">
          <div 
            class="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style="width: ${s}%"
            role="progressbar"
            aria-valuenow="${this.value}"
            aria-valuemin="0"
            aria-valuemax="${this.max}"
          ></div>
        </div>
      </div>
    `}};t.styles=[b,m`
      :host {
        display: block;
        width: 100%;
      }
    `];l([n({type:Number})],t.prototype,"value",2);l([n({type:Number})],t.prototype,"max",2);l([n({type:String})],t.prototype,"label",2);t=l([v("prism-progress")],t);
