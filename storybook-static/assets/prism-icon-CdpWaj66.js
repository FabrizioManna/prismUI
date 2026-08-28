import{A as a,E as v,i as f,a as $,b as d}from"./lit-element-Dl74xXHy.js";import{s as g,t as _}from"./shared-styles-DtmCOQje.js";import{n as p}from"./property-DDJpMEtn.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y={CHILD:2},m=s=>(...t)=>({_$litDirective$:s,values:t});class w{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class c extends w{constructor(t){if(super(t),this.it=a,t.type!==y.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===a||t==null)return this._t=void 0,this.it=t;if(t===v)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}c.directiveName="unsafeHTML",c.resultType=1;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class h extends c{}h.directiveName="unsafeSVG",h.resultType=2;const x=m(h);var b=Object.defineProperty,A=Object.getOwnPropertyDescriptor,u=(s,t,e,r)=>{for(var i=r>1?void 0:r?A(t,e):t,o=s.length-1,l;o>=0;o--)(l=s[o])&&(i=(r?l(t,e,i):l(i))||i);return r&&i&&b(t,e,i),i};let n=class extends ${constructor(){super(...arguments),this.size=24,this.icon=""}render(){return d`
      <div style="width: ${this.size}px; height: ${this.size}px; display: inline-flex;">
        ${this.icon?x(this.icon):d`
            <svg 
              width="${this.size}" 
              height="${this.size}" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <slot></slot>
            </svg>
          `}
      </div>
    `}};n.styles=[g,f`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      /* If using raw svg strings (like from lucide-static), ensure they scale */
      svg {
        width: 100%;
        height: 100%;
      }
      /* Fallback for slotted content */
      ::slotted(svg) {
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `];u([p({type:Number})],n.prototype,"size",2);u([p({type:String})],n.prototype,"icon",2);n=u([_("prism-icon")],n);
