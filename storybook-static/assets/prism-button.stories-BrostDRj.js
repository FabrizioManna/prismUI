import{b as l}from"./lit-element-Dl74xXHy.js";import"./prism-button-mJyPmQT-.js";import"./shared-styles-DtmCOQje.js";import"./property-DDJpMEtn.js";const $={title:"Foundations & Actions/Button",component:"prism-button",argTypes:{variant:{control:"select",options:["primary","secondary","danger","ghost"]},size:{control:"select",options:["sm","md","lg"]}}},r={args:{variant:"primary",size:"md",disabled:!1,loading:!1},render:a=>l`
    <prism-button 
      variant="${a.variant}" 
      size="${a.size}" 
      ?disabled="${a.disabled}" 
      ?loading="${a.loading}">
      Click Me
    </prism-button>
  `},e={args:{...r.args,variant:"secondary"},render:r.render},n={args:{...r.args,variant:"danger"},render:r.render};var s,o,i;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false
  },
  render: args => html\`
    <prism-button 
      variant="\${args.variant}" 
      size="\${args.size}" 
      ?disabled="\${args.disabled}" 
      ?loading="\${args.loading}">
      Click Me
    </prism-button>
  \`
}`,...(i=(o=r.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var t,d,m;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    ...Primary.args,
    variant: 'secondary'
  },
  render: Primary.render
}`,...(m=(d=e.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var c,p,g;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    ...Primary.args,
    variant: 'danger'
  },
  render: Primary.render
}`,...(g=(p=n.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const z=["Primary","Secondary","Danger"];export{n as Danger,r as Primary,e as Secondary,z as __namedExportsOrder,$ as default};
