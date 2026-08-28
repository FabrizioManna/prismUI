import{i as n,a as i,b as p}from"./lit-element-Dl74xXHy.js";import{s as x,t as g}from"./shared-styles-DtmCOQje.js";import{n as _}from"./property-DDJpMEtn.js";var m=Object.defineProperty,c=Object.getOwnPropertyDescriptor,d=(e,t,b,a)=>{for(var r=a>1?void 0:a?c(t,b):t,o=e.length-1,l;o>=0;o--)(l=e[o])&&(r=(a?l(t,b,r):l(r))||r);return a&&r&&m(t,b,r),r};let s=class extends i{constructor(){super(...arguments),this.variant="default"}render(){let e="bg-slate-500/20 text-slate-700 dark:text-slate-200 border-slate-500/20";switch(this.variant){case"success":e="bg-green-500/20 text-green-800 dark:text-green-200 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]";break;case"warning":e="bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]";break;case"error":e="bg-red-500/20 text-red-800 dark:text-red-200 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]";break;case"info":e="bg-blue-500/20 text-blue-800 dark:text-blue-200 border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.2)]";break}return p`
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border ${e}">
        <slot></slot>
      </span>
    `}};s.styles=[x,n`
      :host {
        display: inline-flex;
      }
    `];d([_({type:String})],s.prototype,"variant",2);s=d([g("prism-badge")],s);
