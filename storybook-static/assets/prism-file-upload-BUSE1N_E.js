import{i as c,a as f,b as p}from"./lit-element-Dl74xXHy.js";import{s as g,t as u}from"./shared-styles-DtmCOQje.js";import{n as o}from"./property-DDJpMEtn.js";import{r as h}from"./state-D_z6CKVN.js";import{e as m}from"./query-BApjzB0v.js";var b=Object.defineProperty,v=Object.getOwnPropertyDescriptor,l=(e,t,r,a)=>{for(var i=a>1?void 0:a?v(t,r):t,n=e.length-1,d;n>=0;n--)(d=e[n])&&(i=(a?d(t,r,i):d(i))||i);return a&&i&&b(t,r,i),i};let s=class extends f{constructor(){super(...arguments),this.label="Drag and drop files here or click to browse",this.accept="",this.multiple=!1,this.disabled=!1,this._isDragging=!1,this._selectedFiles=[]}_handleDragOver(e){this.disabled||(e.preventDefault(),this._isDragging=!0)}_handleDragLeave(e){this.disabled||(e.preventDefault(),this._isDragging=!1)}_handleDrop(e){this.disabled||(e.preventDefault(),this._isDragging=!1,e.dataTransfer&&e.dataTransfer.files&&this._processFiles(Array.from(e.dataTransfer.files)))}_handleInputChange(e){const t=e.target;t.files&&this._processFiles(Array.from(t.files))}_processFiles(e){const t=this.multiple?e:[e[0]];this._selectedFiles=t,this.dispatchEvent(new CustomEvent("files-selected",{detail:{files:this._selectedFiles}}))}_openFileDialog(){this.disabled||this.fileInput.click()}_formatSize(e){if(e===0)return"0 Bytes";const t=1024,r=["Bytes","KB","MB","GB"],a=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,a)).toFixed(2))+" "+r[a]}render(){const e=this.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer",t=this._isDragging?"border-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]":"border-slate-300/40 dark:border-slate-600/50 bg-white/10 dark:bg-slate-800/20 hover:bg-white/20 dark:hover:bg-slate-800/30";return p`
      <div class="w-full">
        <div
          @dragover="${this._handleDragOver}"
          @dragleave="${this._handleDragLeave}"
          @drop="${this._handleDrop}"
          @click="${this._openFileDialog}"
          class="relative w-full p-8 flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed backdrop-blur-md transition-all duration-200 ${t} ${e}"
        >
          <input
            type="file"
            class="hidden"
            ?multiple="${this.multiple}"
            accept="${this.accept}"
            @change="${this._handleInputChange}"
          />
          
          <svg class="w-10 h-10 mb-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
            ${this.label}
          </p>
        </div>

        <!-- File List -->
        ${this._selectedFiles.length>0?p`
          <div class="mt-4 flex flex-col gap-2">
            ${this._selectedFiles.map(r=>p`
              <div class="flex items-center justify-between px-4 py-2 rounded-lg bg-white/20 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div class="flex items-center truncate">
                  <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-sm text-slate-700 dark:text-slate-200 truncate">${r.name}</span>
                </div>
                <span class="text-xs text-slate-500 ml-4 shrink-0">${this._formatSize(r.size)}</span>
              </div>
            `)}
          </div>
        `:""}
      </div>
    `}};s.styles=[g,c`
      :host {
        display: block;
        width: 100%;
      }
    `];l([m('input[type="file"]')],s.prototype,"fileInput",2);l([o({type:String})],s.prototype,"label",2);l([o({type:String})],s.prototype,"accept",2);l([o({type:Boolean})],s.prototype,"multiple",2);l([o({type:Boolean})],s.prototype,"disabled",2);l([h()],s.prototype,"_isDragging",2);l([h()],s.prototype,"_selectedFiles",2);s=l([u("prism-file-upload")],s);
