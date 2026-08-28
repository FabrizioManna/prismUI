import{i as c,a as p,b as l}from"./lit-element-Dl74xXHy.js";import{s as f,t as u}from"./shared-styles-DIo8y3SM.js";import{n as x}from"./property-DDJpMEtn.js";var h=Object.defineProperty,d=Object.getOwnPropertyDescriptor,m=(e,t,r,a)=>{for(var s=a>1?void 0:a?d(t,r):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(s=(a?o(t,r,s):o(s))||s);return a&&s&&h(t,r,s),s};let n=class extends p{constructor(){super(...arguments),this.items=[]}render(){return l`
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          ${this.items.map((e,t)=>{const r=t===this.items.length-1;return l`
              <li class="inline-flex items-center">
                ${t>0?l`
                  <svg class="w-4 h-4 text-slate-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                `:""}
                
                ${!r&&e.href?l`
                  <a href="${e.href}" class="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                    ${e.label}
                  </a>
                `:l`
                  <span class="inline-flex items-center text-sm font-medium text-slate-400 dark:text-slate-500 cursor-default">
                    ${e.label}
                  </span>
                `}
              </li>
            `})}
        </ol>
      </nav>
    `}};n.styles=[f,c`
      :host {
        display: block;
      }
    `];m([x({type:Array})],n.prototype,"items",2);n=m([u("prism-breadcrumb")],n);
