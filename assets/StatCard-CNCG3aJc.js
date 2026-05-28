import{c as f,j as e,r}from"./index-C8jAcvOp.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=f("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=f("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);function N({className:s=""}){return e.jsx("span",{className:`skeleton ${s}`.trim(),"aria-hidden":"true"})}function j(s,o=900){const[a,l]=r.useState(0),t=r.useRef(null),n=r.useRef(null),c=r.useRef(0);return r.useEffect(()=>{if(typeof s!="number"||!isFinite(s))return;const u=c.current,i=s;n.current=null,cancelAnimationFrame(t.current);function d(m){n.current||(n.current=m);const p=Math.min((m-n.current)/o,1),_=1-Math.pow(1-p,3);l(Math.round(u+(i-u)*_)),p<1?t.current=requestAnimationFrame(d):(l(i),c.current=i)}return t.current=requestAnimationFrame(d),()=>cancelAnimationFrame(t.current)},[s,o]),a}function k({icon:s,label:o,value:a,tone:l="primary",helper:t,trend:n}){const c=typeof a=="number",u=j(c?a:0),i=c?u:a;return e.jsxs("article",{className:`stat-card stat-card--${l}`,children:[e.jsx("div",{className:"stat-card__icon","aria-hidden":"true",children:r.createElement(s,{size:22})}),e.jsxs("div",{className:"stat-card__body",children:[e.jsx("p",{className:"stat-card__label",children:o}),e.jsx("strong",{className:"stat-card__value",children:i}),e.jsxs("div",{className:"stat-card__footer",children:[n!==void 0?e.jsxs("span",{className:`stat-card__trend stat-card__trend--${n>=0?"up":"down"}`,children:[n>=0?e.jsx(h,{size:12}):e.jsx(x,{size:12}),Math.abs(n),"%"]}):null,t?e.jsx("span",{className:"stat-card__helper",children:t}):null]})]})]})}export{k as S,h as T,N as a};
