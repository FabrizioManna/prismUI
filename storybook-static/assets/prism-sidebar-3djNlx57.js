import{i as b,a as c,b as n}from"./lit-element-Dl74xXHy.js";import{s as p,t as f}from"./shared-styles-DtmCOQje.js";import{n as h}from"./property-DDJpMEtn.js";var u=Object.defineProperty,v=Object.getOwnPropertyDescriptor,d=(e,s,l,a)=>{for(var r=a>1?void 0:a?v(s,l):s,t=e.length-1,i;t>=0;t--)(i=e[t])&&(r=(a?i(s,l,r):i(r))||r);return a&&r&&u(s,l,r),r};let o=class extends c{constructor(){super(...arguments),this.collapsed=!1}render(){const e=this.collapsed?"w-20":"w-64";return n`
      <aside class="h-full ${e} transition-all duration-300 ease-in-out bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        
        <!-- Brand / Logo Area -->
        <div class="h-16 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50 shrink-0">
          <slot name="header"></slot>
        </div>

        <!-- Main Navigation Links -->
        <nav class="flex-1 overflow-y-auto sidebar-scroll py-4 flex flex-col gap-1 px-3">
          <slot></slot>
        </nav>

        <!-- Footer / Settings Area -->
        <div class="p-4 border-t border-slate-200/50 dark:border-slate-700/50 shrink-0">
          <slot name="footer"></slot>
        </div>
      </aside>
    `}};o.styles=[p,b`
      :host {
        display: block;
        height: 100vh;
        position: sticky;
        top: 0;
      }
      
      /* Hide scrollbar for cleaner look */
      .sidebar-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .sidebar-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.3);
        border-radius: 20px;
      }
    `];d([h({type:Boolean})],o.prototype,"collapsed",2);o=d([f("prism-sidebar")],o);
