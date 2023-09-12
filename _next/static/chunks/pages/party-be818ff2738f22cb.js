(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[141],{6698:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/party",function(){return t(7635)}])},7635:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return M}});var r=t(5893),a=t(7294),s=t(9332),i=t(7747),c=t(4e3),o=t(4533);let l="party",h=e=>async n=>e.save(l,n.name,(0,o.KD)(n)),m=e=>async n=>{let t=await e.get(l,n);return t?(0,o.r7)(t):null},u=e=>async n=>e.remove(l,n),p=e=>async()=>e.list(l),x=e=>async(n,t)=>e.exportJson(l,n,t),d=async e=>(await e.checkNamespace(l),{save:h(e),list:p(e),get:m(e),remove:u(e),exportJson:x(e)});var f=t(8429),g=t(1163),y=t(1664),j=t.n(y),w=t(1077),b=t(5332),v=t(7536),_=t(1001),C=t(2757),X=t(8020),L=t(6529),k=t(3090),E=t(5541),N=t(2916),S=t(1039),J=t(1581),$=t.n(J),q=t(8227),z=t(4969),I=t(7442),H=t(524);let P={type:"object",properties:{name:{type:"string",minLength:1},race:{type:"string",minLength:1},blessing:{type:"string",minLength:1},clothing:{type:"string",minLength:1},weapon:{type:"string",minLength:1}},required:["name","race","blessing","clothing","weapon"],additionalProperties:!1},F=e=>({name:e.name,race:e.race.name,blessing:e.blessing.name,clothing:e.clothing.name,weapon:e.weapon.name}),T=e=>{let n=new($()),t=n.compile(P);if(!t(e)){let{errors:e}=t;return console.debug(e),new q.$b(e,"charactorのデータではありません")}let{name:r}=e,a=(0,H.tI)(e.race);if(!a)return new q.Xs(e.race,"race","".concat(e.race,"という種族は存在しません"));let s=(0,H.ez)(e.blessing);if(!s)return new q.Xs(e.blessing,"blessing","".concat(e.blessing,"という祝福は存在しません"));let i=(0,H.FL)(e.clothing);if(!i)return new q.Xs(e.clothing,"clothing","".concat(e.clothing,"という装備は存在しません"));let c=(0,H.i7)(e.weapon);if(!c)return new q.Xs(e.weapon,"weapon","".concat(e.weapon,"という武器は存在しません"));let o=(0,I.Gu)(r,a,s,i,c);if(o instanceof z.m)return o;let l={name:r,race:a,blessing:s,clothing:i,weapon:c,statuses:[],hp:0,mp:0,restWt:0},h=(0,I.SR)(l);return l.hp=h.MaxHP,l.restWt=h.WT,l};var V=t(5618);let D={type:"object",properties:{name:{type:"string",minLength:1},charactors:{type:"array",items:P}},required:["name","charactors"]},G=e=>({name:e.name,charactors:e.charactors.map(F)}),K=e=>{let n=new($())({allErrors:!0}),t=n.compile(D);if(!t(e)){let{errors:e}=t;return console.debug(e),new q.$b(e,"partyのformデータではありません")}let{name:r}=e,a=[];for(let n of e.charactors){let e=T(n);if(e instanceof q.Xs||e instanceof z.m||e instanceof q.$b)return e;a.push(e)}let s=(0,V.Gu)(r,a);return s instanceof V.hi?s:{name:r,charactors:a}},W=(e,n)=>async t=>{let r=K(t);if(r instanceof q.Xs||r instanceof z.m||r instanceof q.$b||r instanceof V.hi)return r;if(n){let n=await e.list();if(n.includes(r.name))return new q.KC(r.name,"party","".concat(r.name,"というpartyは既に存在します"))}return await e.save(r),null},B=e=>{let{exist:n,partyForm:t,inoutButton:s,store:o}=e,l=(0,g.useRouter)(),{handleSubmit:h,register:m,getValues:u,formState:{errors:p,isSubmitting:x},control:d}=(0,v.cI)({resolver:(0,b.G)(D),defaultValues:t}),{fields:f,append:y,remove:S}=(0,v.Dq)({control:d,name:"charactors"}),[J,$]=(0,a.useState)({error:!1,message:""}),I=async e=>{let t=await W(o,!n)(e);t instanceof q.Xs||t instanceof z.m||t instanceof q.$b||t instanceof V.hi||t instanceof q.KC?$({error:!0,message:t.message}):n?$({error:!1,message:"保存しました"}):await l.push({pathname:"party",query:{name:e.name}})},H=async e=>{window.confirm("削除してもよいですか？")&&(await o.remove(e),await l.push({pathname:"party"}))};return(0,r.jsxs)(i.xu,{p:4,children:[(0,r.jsx)(j(),{href:{pathname:"party"},children:(0,r.jsx)("a",{children:"戻る"})}),(0,r.jsx)(c.x,{children:"This is the party page"}),s,(0,r.jsxs)("form",{onSubmit:h(I),children:[J.message&&(J.error?(0,r.jsx)(_.J1,{children:J.message}):(0,r.jsx)(c.x,{children:J.message})),n?(0,r.jsxs)(i.xu,{as:"dl",children:[(0,r.jsx)(C.X,{as:"dt",children:"party name"}),(0,r.jsx)(c.x,{as:"dd",children:t.name})]}):(0,r.jsxs)(X.NI,{isInvalid:!!p.name,children:[(0,r.jsx)(L.l,{htmlFor:"name",children:"name"}),(0,r.jsx)(k.I,{id:"name",placeholder:"name",...m("name")}),(0,r.jsx)(_.J1,{children:p.name&&p.name.message})]}),(0,r.jsx)(E.aV,{children:f.map((e,n)=>(0,r.jsx)(E.HC,{children:(0,r.jsx)(w.g,{register:m,getValues:u,remove:S,errors:p,index:n})},"charactor-".concat(n)))}),(0,r.jsx)(N.z,{type:"button",onClick:()=>y({name:"",race:"",blessing:"",clothing:"",weapon:""}),children:"Hire"}),(0,r.jsx)(N.z,{colorScheme:"teal",isLoading:x,type:"submit",children:n?"Change":"Create"}),n&&(0,r.jsx)(N.z,{type:"button",onClick:()=>H(t.name),children:"Dismiss"})]})]})},O=e=>{let{store:n,partyName:t}=e,a=(0,S.useLiveQuery)(()=>n.get(t),[t]);if(!n.exportJson)throw Error("invalid store");return a instanceof z.m||a instanceof q.Xs||a instanceof V.hi||a instanceof q.$b?(0,r.jsxs)(i.xu,{children:[(0,r.jsx)(c.x,{children:a.message}),(0,r.jsx)(j(),{href:{pathname:"party"},children:(0,r.jsx)("a",{children:"戻る"})})]}):a?(0,r.jsx)(B,{exist:!0,partyForm:G(a),store:n,inoutButton:(0,r.jsx)(N.z,{type:"button",onClick:()=>n.exportJson&&n.exportJson(a.name,""),children:"Export"})}):(0,r.jsxs)(i.xu,{children:[(0,r.jsx)(c.x,{children:"".concat(t,"というpartyは見つかりません")}),(0,r.jsx)(j(),{href:{pathname:"party"},children:(0,r.jsx)("a",{children:"戻る"})})]})},Q=e=>{let{store:n}=e,[t,s]=(0,a.useState)({name:"",charactors:[]}),i=async()=>{if(!window.confirm("取り込むと入力したデータが削除されますがよいですか？"))return;let e=await (0,f.x)();if(!e)return;let n=(0,o.r7)(e);if(n instanceof z.m||n instanceof q.Xs||n instanceof V.hi||n instanceof q.$b){window.alert(n.message);return}s(G(n))};return(0,r.jsx)(B,{exist:!1,partyForm:t,store:n,inoutButton:(0,r.jsx)(N.z,{type:"button",onClick:i,children:"Import"})})},R=e=>{let{store:n}=e,t=(0,S.useLiveQuery)(()=>n.list(),[]);return(0,r.jsxs)(i.xu,{children:[(0,r.jsx)(j(),{href:{pathname:"/"},children:(0,r.jsx)("a",{children:"戻る"})}),(0,r.jsx)(i.xu,{children:(0,r.jsxs)(E.aV,{children:[(0,r.jsx)(E.HC,{children:(0,r.jsx)(j(),{href:{pathname:"party",query:{name:"__new"}},children:(0,r.jsx)("a",{children:"新しく作る"})})},"party-new"),t&&t.map((e,n)=>(0,r.jsx)(E.HC,{children:(0,r.jsx)(j(),{href:{pathname:"party",query:{name:e}},children:(0,r.jsx)("a",{children:e})})},"party-".concat(n)))]})})]})};var M=()=>{let e=(0,s.useSearchParams)(),n=e.get("name"),[t,o]=(0,a.useState)(null);return((0,a.useEffect)(()=>{(async()=>{let e=await (0,f.h)(),n=await d(e);o(n)})()},[]),t)?n?"__new"===n?(0,r.jsx)(Q,{store:t}):(0,r.jsx)(O,{partyName:n,store:t}):(0,r.jsx)(R,{store:t}):(0,r.jsx)(i.xu,{children:(0,r.jsx)(c.x,{children:"loading..."})})}}},function(e){e.O(0,[905,550,971,774,888,179],function(){return e(e.s=6698)}),_N_E=e.O()}]);