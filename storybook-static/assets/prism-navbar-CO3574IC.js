import{i as n,a as d,b as c}from"./lit-element-Dl74xXHy.js";import{s as m,t as b}from"./shared-styles-DIo8y3SM.js";var p=Object.getOwnPropertyDescriptor,f=(r,a,i,l)=>{for(var e=l>1?void 0:l?p(a,i):a,t=r.length-1,o;t>=0;t--)(o=r[t])&&(e=o(e)||e);return e};let s=class extends d{render(){return c`
      <header class="w-full h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        
        <!-- Left: Brand / Mobile Toggle -->
        <div class="flex items-center gap-4">
          <slot name="left"></slot>
        </div>

        <!-- Center: Search (optional) -->
        <div class="flex-1 max-w-2xl px-4 hidden md:flex items-center justify-center">
          <slot name="center"></slot>
        </div>

        <!-- Right: Actions, Notifications, User Menu -->
        <div class="flex items-center gap-3">
          <slot name="right"></slot>
        </div>

      </header>
    `}};s.styles=[m,n`
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 40; /* High enough to stay above content, below modals/dropdowns (50+) */
      }
    `];s=f([b("prism-navbar")],s);
