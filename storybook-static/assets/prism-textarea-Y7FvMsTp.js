import{i as n,a as u,b as p}from"./lit-element-Dl74xXHy.js";import{s as c,t as b}from"./shared-styles-DtmCOQje.js";import{n as l}from"./property-DDJpMEtn.js";import{e as x}from"./query-BApjzB0v.js";var f=Object.defineProperty,m=Object.getOwnPropertyDescriptor,s=(e,r,i,o)=>{for(var a=o>1?void 0:o?m(r,i):r,h=e.length-1,d;h>=0;h--)(d=e[h])&&(a=(o?d(r,i,a):d(a))||a);return o&&a&&f(r,i,a),a};let t=class extends u{constructor(){super(...arguments),this.value="",this.placeholder="",this.helperText="",this.error=!1,this.disabled=!1,this.minRows=3}_handleInput(e){const r=e.target;this.value=r.value,this._autoResize(),this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value}}))}_autoResize(){if(this.textarea){this.textarea.style.height="auto";const e=this.minRows*24+16;this.textarea.style.height=`${Math.max(this.textarea.scrollHeight,e)}px`}}updated(e){e.has("value")&&this._autoResize()}render(){let e="border-slate-300/40 dark:border-slate-600/50 focus:border-blue-400/60 focus:ring-blue-400/30";this.error&&(e="border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]");const r=this.disabled?"opacity-50 cursor-not-allowed bg-slate-100/10":"bg-white/10 dark:bg-slate-800/20";return p`
      <div class="relative w-full">
        <textarea
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          rows="${this.minRows}"
          @input="${this._handleInput}"
          class="w-full px-4 py-2 text-sm rounded-lg backdrop-blur-md border outline-none transition-colors duration-200 focus:ring-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${e} ${r}"
        ></textarea>
        
        ${this.helperText?p`
          <p class="mt-1 text-xs ${this.error?"text-red-500":"text-slate-500 dark:text-slate-400"}">
            ${this.helperText}
          </p>
        `:""}
      </div>
    `}};t.styles=[c,n`
      :host {
        display: block;
        width: 100%;
      }
      textarea {
        resize: none; /* Disable native resize handle */
        overflow-y: hidden; /* Hide scrollbar while auto-resizing */
      }
    `];s([x("textarea")],t.prototype,"textarea",2);s([l({type:String})],t.prototype,"value",2);s([l({type:String})],t.prototype,"placeholder",2);s([l({type:String})],t.prototype,"helperText",2);s([l({type:Boolean})],t.prototype,"error",2);s([l({type:Boolean})],t.prototype,"disabled",2);s([l({type:Number})],t.prototype,"minRows",2);t=s([b("prism-textarea")],t);
