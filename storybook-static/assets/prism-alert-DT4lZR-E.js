import{i as m,a as c,b}from"./lit-element-Dl74xXHy.js";import{s as g,t as x}from"./shared-styles-DIo8y3SM.js";import{n}from"./property-DDJpMEtn.js";import"./prism-icon-DSnERsLg.js";import{I as p,T as v,C as k,a as u}from"./triangle-alert-dj6S1Ge3.js";var f=Object.defineProperty,h=Object.getOwnPropertyDescriptor,o=(s,r,a,t)=>{for(var e=t>1?void 0:t?h(r,a):r,d=s.length-1,l;d>=0;d--)(l=s[d])&&(e=(t?l(r,a,e):l(e))||e);return t&&e&&f(r,a,e),e};let i=class extends c{constructor(){super(...arguments),this.variant="info",this.title=""}render(){let s=p,r="bg-blue-50/50 dark:bg-blue-900/20",a="border-blue-200/50 dark:border-blue-800/50",t="text-blue-500 dark:text-blue-400",e="text-blue-800 dark:text-blue-200";switch(this.variant){case"success":s=u,r="bg-green-50/50 dark:bg-green-900/20",a="border-green-200/50 dark:border-green-800/50",t="text-green-500 dark:text-green-400",e="text-green-800 dark:text-green-200";break;case"error":s=k,r="bg-red-50/50 dark:bg-red-900/20",a="border-red-200/50 dark:border-red-800/50",t="text-red-500 dark:text-red-400",e="text-red-800 dark:text-red-200";break;case"warning":s=v,r="bg-amber-50/50 dark:bg-amber-900/20",a="border-amber-200/50 dark:border-amber-800/50",t="text-amber-500 dark:text-amber-400",e="text-amber-800 dark:text-amber-200";break}return b`
      <div class="rounded-xl border ${a} ${r} p-4 backdrop-blur-md">
        <div class="flex">
          <div class="flex-shrink-0 ${t}">
            <prism-icon .icon="${s}" size="20"></prism-icon>
          </div>
          <div class="ml-3">
            ${this.title?b`<h3 class="text-sm font-medium ${e}">${this.title}</h3>`:""}
            <div class="mt-2 text-sm text-slate-700 dark:text-slate-300">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `}};i.styles=[g,m`
      :host {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
      }
    `];o([n({type:String})],i.prototype,"variant",2);o([n({type:String})],i.prototype,"title",2);i=o([x("prism-alert")],i);
