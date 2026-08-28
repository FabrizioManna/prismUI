import{i as l,a as d,b}from"./lit-element-Dl74xXHy.js";import{s as h,t as g}from"./shared-styles-DIo8y3SM.js";import{n}from"./property-DDJpMEtn.js";var c=Object.defineProperty,m=Object.getOwnPropertyDescriptor,a=(r,e,s,p)=>{for(var i=p>1?void 0:p?m(e,s):e,o=r.length-1,u;o>=0;o--)(u=r[o])&&(i=(p?u(e,s,i):u(i))||i);return p&&i&&c(e,s,i),i};let t=class extends d{constructor(){super(...arguments),this.value=50,this.min=0,this.max=100,this.step=1,this.disabled=!1}_handleInput(r){const e=r.target;this.value=Number(e.value),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value}}))}render(){const r=(this.value-this.min)/(this.max-this.min)*100,e=`
      background: linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${r}%, rgba(255, 255, 255, 0.2) ${r}%, rgba(255, 255, 255, 0.2) 100%);
    `,s=this.disabled?"opacity-50 cursor-not-allowed":"";return b`
      <div class="relative w-full py-2 ${s}">
        <input
          type="range"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          .value="${this.value.toString()}"
          ?disabled="${this.disabled}"
          @input="${this._handleInput}"
          class="w-full h-1.5 rounded-full outline-none backdrop-blur-sm"
          style="${e}"
        />
      </div>
    `}};t.styles=[h,l`
      :host {
        display: block;
        width: 100%;
      }
      
      /* Cross-browser styling for range input */
      input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
      }
      
      input[type=range]:focus {
        outline: none;
      }

      /* WebKit */
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        margin-top: -8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.8);
      }
      
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 6px;
        cursor: pointer;
        border-radius: 9999px;
      }

      /* Firefox */
      input[type=range]::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.8);
      }
      
      input[type=range]::-moz-range-track {
        width: 100%;
        height: 6px;
        cursor: pointer;
        border-radius: 9999px;
      }
    `];a([n({type:Number})],t.prototype,"value",2);a([n({type:Number})],t.prototype,"min",2);a([n({type:Number})],t.prototype,"max",2);a([n({type:Number})],t.prototype,"step",2);a([n({type:Boolean})],t.prototype,"disabled",2);t=a([g("prism-slider")],t);
