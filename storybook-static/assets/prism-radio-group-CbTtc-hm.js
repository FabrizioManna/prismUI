import{i as c,a as d,b as u}from"./lit-element-Dl74xXHy.js";import{s as p,t as v}from"./shared-styles-DIo8y3SM.js";import{n as h}from"./property-DDJpMEtn.js";var f=Object.defineProperty,g=Object.getOwnPropertyDescriptor,n=(t,e,s,o)=>{for(var a=o>1?void 0:o?g(e,s):e,r=t.length-1,i;r>=0;r--)(i=t[r])&&(a=(o?i(e,s,a):i(a))||a);return o&&a&&f(e,s,a),a};let l=class extends d{constructor(){super(...arguments),this.layout="vertical",this.value="",this._handleRadioChange=t=>{this.value=t.detail.value,this.querySelectorAll("prism-radio").forEach(s=>{s.checked=s.value===this.value}),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value}}))}}_handleSlotChange(){this.querySelectorAll("prism-radio").forEach(e=>{e.checked&&!this.value&&(this.value=e.value),e.checked=e.value===this.value})}connectedCallback(){super.connectedCallback(),this.addEventListener("radio-select",this._handleRadioChange)}disconnectedCallback(){this.removeEventListener("radio-select",this._handleRadioChange),super.disconnectedCallback()}render(){const t=this.layout==="horizontal"?"flex flex-row gap-4":"flex flex-col gap-2";return u`
      <div class="${t}" role="radiogroup">
        <slot @slotchange="${this._handleSlotChange}"></slot>
      </div>
    `}};l.styles=[p,c`
      :host {
        display: block;
      }
    `];n([h({type:String})],l.prototype,"layout",2);n([h({type:String})],l.prototype,"value",2);l=n([v("prism-radio-group")],l);
