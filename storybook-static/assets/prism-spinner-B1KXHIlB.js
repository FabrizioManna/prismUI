import{i as c,a as m,b as f}from"./lit-element-Dl74xXHy.js";import{s as d,t as u}from"./shared-styles-DtmCOQje.js";import{n as p}from"./property-DDJpMEtn.js";import"./prism-icon-CdpWaj66.js";/**
 * @license lucide-static v1.35.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=`
<svg
  class="lucide lucide-loader-circle"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
</svg>
`;var v=Object.defineProperty,w=Object.getOwnPropertyDescriptor,l=(a,i,t,s)=>{for(var e=s>1?void 0:s?w(i,t):i,o=a.length-1,n;o>=0;o--)(n=a[o])&&(e=(s?n(i,t,e):n(e))||e);return s&&e&&v(i,t,e),e};let r=class extends m{constructor(){super(...arguments),this.size=24,this.color="text-blue-500"}render(){return f`
      <div class="inline-flex items-center justify-center ${this.color} animate-spin-slow" role="status" aria-label="Loading">
        <prism-icon .icon="${h}" size="${this.size}"></prism-icon>
      </div>
    `}};r.styles=[d,c`
      :host {
        display: inline-flex;
      }
      .animate-spin-slow {
        animation: spin 1.5s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `];l([p({type:Number})],r.prototype,"size",2);l([p({type:String})],r.prototype,"color",2);r=l([u("prism-spinner")],r);
