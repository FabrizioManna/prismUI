import{d as E}from"./index-Bhqu_tAV.js";var u="backgrounds";const{global:M}=__STORYBOOK_MODULE_GLOBAL__,{logger:k}=__STORYBOOK_MODULE_CLIENT_LOGGER__;var{document:s,window:O}=M,h=()=>O.matchMedia("(prefers-reduced-motion: reduce)").matches,B=(r,e=[],n)=>{if(r==="transparent")return"transparent";if(e.find(a=>a.value===r))return r;let t=e.find(a=>a.name===n);if(t)return t.value;if(n){let a=e.map(i=>i.name).join(", ");k.warn(E`
        Backgrounds Addon: could not find the default color "${n}".
        These are the available colors for your story based on your configuration:
        ${a}.
      `)}return"transparent"},_=r=>{(Array.isArray(r)?r:[r]).forEach(S)},S=r=>{let e=s.getElementById(r);e&&e.parentElement.removeChild(e)},x=(r,e)=>{let n=s.getElementById(r);if(n)n.innerHTML!==e&&(n.innerHTML=e);else{let t=s.createElement("style");t.setAttribute("id",r),t.innerHTML=e,s.head.appendChild(t)}},A=(r,e,n)=>{let t=s.getElementById(r);if(t)t.innerHTML!==e&&(t.innerHTML=e);else{let a=s.createElement("style");a.setAttribute("id",r),a.innerHTML=e;let i=`addon-backgrounds-grid${n?`-docs-${n}`:""}`,d=s.getElementById(i);d?d.parentElement.insertBefore(a,d):s.head.appendChild(a)}};const{useMemo:b,useEffect:L}=__STORYBOOK_MODULE_PREVIEW_API__;var w=(r,e)=>{var c;let{globals:n,parameters:t}=e,a=(c=n[u])==null?void 0:c.value,i=t[u],d=b(()=>i.disable?"transparent":B(a,i.values,i.default),[i,a]),o=b(()=>d&&d!=="transparent",[d]),g=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",p=b(()=>`
      ${g} {
        background: ${d} !important;
        ${h()?"":"transition: background-color 0.3s;"}
      }
    `,[d,g]);return L(()=>{let l=e.viewMode==="docs"?`addon-backgrounds-docs-${e.id}`:"addon-backgrounds-color";if(!o){_(l);return}A(l,p,e.viewMode==="docs"?e.id:null)},[o,p,e]),r()};const{useMemo:T,useEffect:I}=__STORYBOOK_MODULE_PREVIEW_API__;var C=(r,e)=>{var y;let{globals:n,parameters:t}=e,a=t[u].grid,i=((y=n[u])==null?void 0:y.grid)===!0&&a.disable!==!0,{cellAmount:d,cellSize:o,opacity:g}=a,p=e.viewMode==="docs",c=t.layout===void 0||t.layout==="padded"?16:0,l=a.offsetX??(p?20:c),m=a.offsetY??(p?20:c),$=T(()=>{let f=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",v=[`${o*d}px ${o*d}px`,`${o*d}px ${o*d}px`,`${o}px ${o}px`,`${o}px ${o}px`].join(", ");return`
      ${f} {
        background-size: ${v} !important;
        background-position: ${l}px ${m}px, ${l}px ${m}px, ${l}px ${m}px, ${l}px ${m}px !important;
        background-blend-mode: difference !important;
        background-image: linear-gradient(rgba(130, 130, 130, ${g}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${g}) 1px, transparent 1px),
         linear-gradient(rgba(130, 130, 130, ${g/2}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${g/2}) 1px, transparent 1px) !important;
      }
    `},[o]);return I(()=>{let f=e.viewMode==="docs"?`addon-backgrounds-grid-docs-${e.id}`:"addon-backgrounds-grid";if(!i){_(f);return}x(f,$)},[i,$,e]),r()},Y=[C,w],G={[u]:{grid:{cellSize:20,opacity:.5,cellAmount:5},values:[{name:"light",value:"#F8F8F8"},{name:"dark",value:"#333333"}]}},H={[u]:null};export{Y as decorators,H as globals,G as parameters};
