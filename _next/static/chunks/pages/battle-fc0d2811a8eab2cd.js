(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[973],{7156:function(t,e,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/battle",function(){return r(3989)}])},3989:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return eP}});var n={};r.r(n),r.d(n,{blindBull:function(){return p.q},blow:function(){return m.D},chop:function(){return d.p},clearCloud:function(){return y.D},coldFeet:function(){return x.v},concentration:function(){return j.c},copperBlue:function(){return w.x},crossFire:function(){return v.T},cumulonimbus:function(){return b.s},danceLeaves:function(){return S.n},dazzle:function(){return g.y},downRushing:function(){return I.e},eleciWave:function(){return C.Q},electoricBrain:function(){return V.n},electricShock:function(){return O.Z},fireWall:function(){return N.B},flameDigger:function(){return R._},flameFall:function(){return D.N},flashFlood:function(){return T.l},frostbite:function(){return E.f},ghostFire:function(){return _.d},gravelWall:function(){return k.c},guillotineOfGiant:function(){return L.H},gunStone:function(){return W.G},gunWater:function(){return M.v},hailstone:function(){return H.p},hardRain:function(){return $.u},heavyWind:function(){return A.m},higherBolt:function(){return G.W},iceSandwich:function(){return X.C},jammer:function(){return q.q},lightMeteor:function(){return P.P},mountFall:function(){return B.t},multiShot:function(){return K.j},overbear:function(){return F.m},paralysisScratch:function(){return J.r},paralysisShot:function(){return U.$},pitch:function(){return Z},push:function(){return Y.V},quench:function(){return Q.n},quick:function(){return tt.P},rockWave:function(){return te.j},saturnRing:function(){return tr.C},shot:function(){return tn.o},silent:function(){return ts.C},silentScratch:function(){return ti.d},silentShot:function(){return ta.T},slow:function(){return to.Y},smallHeat:function(){return tc.b},stab:function(){return tl.R},stickyRain:function(){return tu.f},stoneShell:function(){return th.v},stoneWeather:function(){return tf.c},swordDance:function(){return tp.f},thunder:function(){return tm.o},tornade:function(){return td.V},toxicScratch:function(){return ty.x},toxicShot:function(){return tx.c},waterCutter:function(){return tj.f},windEdge:function(){return tw.D}});var s=r(5893),i=r(7294),a=r(9332),o=r(7747),c=r(4e3),l=r(562),u=r(4037),h=r(4201),f=r(4969),p=r(7510),m=r(2332),d=r(176),y=r(3185),x=r(6805),j=r(7113),w=r(667),v=r(340),b=r(6140),S=r(7453),g=r(3331),I=r(9170),C=r(3733),V=r(1538),O=r(1202),N=r(3181),R=r(6066),D=r(2274),T=r(4012),E=r(9969),_=r(113),k=r(1944),L=r(2131),W=r(9319),M=r(652),H=r(1132),$=r(6516),A=r(5537),G=r(1137),X=r(6796),q=r(9246),P=r(9520),B=r(5311),K=r(2516),F=r(2144),J=r(1177),U=r(9053),z=r(9199);let Z={name:"pitch",label:"投げる",type:"SKILL_TO_CHARACTOR",action:z.Vo,directType:z.Vq,magicType:z.LB,baseDamage:60,mpConsumption:10,receiverCount:1,additionalWt:100,effectLength:5,getAccuracy:z.Tj,description:"投げる"};var Y=r(515),Q=r(4729),tt=r(8997),te=r(9918),tr=r(1089),tn=r(8036),ts=r(1293),ti=r(2252),ta=r(2211),to=r(7882),tc=r(4116),tl=r(5822),tu=r(7171),th=r(8323),tf=r(5319),tp=r(9205),tm=r(6815),td=r(9083),ty=r(2057),tx=r(4103),tj=r(2421),tw=r(5454);let tv=t=>n[t];Object.keys(n),Object.values(n);var tb=r(8227),tS=r(3429),tg=r(7442);class tI{constructor(t,e,r){this.prop=t,this.value=e,this.message=r}}let tC=t=>{let{times:e,damage:r,accuracy:n}=t;return e>1||e<0?new tI("times",e,"timesの値は0から1です"):r>1||r<0?new tI("damage",r,"damageの値は0から1です"):n>1||n<0?new tI("accuracy",n,"accuracyの値は0から1です"):null},tV=()=>({times:Math.random(),damage:Math.random(),accuracy:Math.random()}),tO=()=>({times:1,damage:1,accuracy:1}),tN=[{name:"SUNNY",parcent:40},{name:"RAIN",parcent:30},{name:"FOGGY",parcent:10},{name:"STORM",parcent:10},{name:"SNOW",parcent:10}],tR=t=>{let e=tC(t);if(e instanceof tI)throw console.debug(e),Error(e.message);let r=100*t.accuracy,n=tN.reduce((t,e)=>{let r={...e};if(0===t.length)return[r];let n=t.slice(-1)[0];return r.parcent+=n.parcent,t.push(r),t},[]),s=n.find(t=>t.parcent>=r);return s?s.name:"SUNNY"};var tD=r(2457),tT=r(4168);let tE=t=>t.slice(-1)[0];class t_{constructor(t,e){this.charactor=t,this.message=e}}let tk="ONGOING",tL="HOME",tW="VISITOR",tM="DRAW",tH=t=>tE(t.turns),t$=t=>tE(t.turns).sortedCharactors[0],tA=t=>t.filter(t=>t.hp>0).sort((t,e)=>{let r=(0,tg.SR)(t),n=(0,tg.SR)(e),s=t.restWt-e.restWt;if(0!==s)return s;let i=r.AGI-n.AGI;if(0!==i)return i;let a=r.AVD-n.AVD;if(0!==a)return a;let o=t.hp-e.hp;if(0!==o)return o;let c=t.mp-e.mp;if(0!==c)return c;let l=t.statuses.length-e.statuses.length;return 0!==l?l:0}),tG=(t,e,r)=>{let n={name:e.name,charactors:e.charactors.map(t=>({...t,isVisitor:!1}))},s={name:r.name,charactors:r.charactors.map(t=>({...t,isVisitor:!0}))};return{title:t,home:n,visitor:s,turns:[],result:tk}},tX=(t,e,r)=>({datetime:e,action:{type:"TIME_PASSING",wt:0},sortedCharactors:tA([...t.home.charactors,...t.visitor.charactors]),field:{climate:tR(r)}}),tq=(t,e,r)=>{let n=tE(t.turns),s={datetime:r,action:{type:"DO_NOTHING",actor:e},sortedCharactors:n.sortedCharactors,field:n.field};return s.sortedCharactors=s.sortedCharactors.map(t=>{let r={...t,statuses:[...t.statuses.map(t=>({...t}))]};return e.isVisitor===t.isVisitor&&e.name===t.name&&(r.restWt=(0,tg.SR)(t).WT),r}),s.sortedCharactors=tA(s.sortedCharactors),s},tP=t=>e=>{let r=t.find(t=>e.name===t.name);return r||e},tB=(t,e,r,n,s,i)=>{if("SKILL_TO_FIELD"===r.type)throw Error("invalid skill type");if(r.mpConsumption>e.mp)throw Error("mp shortage");if((0,tT.V)(tD.silent,e)&&r.magicType!==z.LB)throw Error("silent cannot do magic");if((0,tT.V)(tD.sleep,e)||(0,tT.V)(tD.paralysis,e)&&i.accuracy>.5)return tq(t,e,s);let a=tE(t.turns),o={datetime:s,action:{type:"DO_SKILL",actor:e,skill:r,receivers:n},sortedCharactors:a.sortedCharactors,field:a.field},c=n.map(t=>r.action(r,e,i,a.field,t));return o.sortedCharactors=o.sortedCharactors.map(tP(c)),o.sortedCharactors=o.sortedCharactors.map(t=>{let n={...t,statuses:[...t.statuses.map(t=>({...t}))]};return e.isVisitor===t.isVisitor&&e.name===t.name&&(n.restWt=(0,tg.SR)(t).WT+r.additionalWt,n.mp-=r.mpConsumption),n}),o.sortedCharactors=tA(o.sortedCharactors),o},tK=(t,e,r,n,s)=>{if("SKILL_TO_CHARACTOR"===r.type)throw Error("invalid skill type");if(r.mpConsumption>e.mp)throw Error("mp shortage");if((0,tT.V)(tD.silent,e)&&r.magicType!==z.LB)throw Error("silent cannot do magic");if((0,tT.V)(tD.sleep,e)||(0,tT.V)(tD.paralysis,e)&&s.accuracy>.5)return tq(t,e,n);let i=tE(t.turns),a={datetime:n,action:{type:"DO_SKILL",actor:e,skill:r,receivers:[]},sortedCharactors:i.sortedCharactors,field:i.field};return a.field=r.action(r,e,s,i.field),a.sortedCharactors=a.sortedCharactors.map(t=>{let n={...t,statuses:[...t.statuses.map(t=>({...t}))]};return e.isVisitor===t.isVisitor&&e.name===t.name&&(n.restWt=(0,tg.SR)(t).WT+r.additionalWt,n.mp-=r.mpConsumption),n}),a.sortedCharactors=tA(a.sortedCharactors),a},tF=(t,e,r)=>{let n=tE(t.turns);return{datetime:r,action:{type:"SURRENDER",actor:e},sortedCharactors:n.sortedCharactors,field:n.field}},tJ=(t,e,r)=>{let n=(0,tg.BA)(t),s=n.reduce((t,n)=>n.wait(e,t,r),{...t,statuses:[...t.statuses.map(t=>({...t}))]}),i=(0,tT.V)(tD.quick,s)?1.5:(0,tT.V)(tD.slow,s)?.75:1;s.restWt=Math.max(s.restWt-e*i,0),(0,tT.V)(tD.acid,s)&&(s.hp=Math.max(s.hp-e/10,0)),s.statuses=s.statuses.map(t=>{let r=t.restWt-e;return{...t,restWt:r}}).filter(t=>t.restWt>0);let a=(0,tg.SR)(s);return s.mp=Math.min(s.mp+Math.floor(e/10),a.MaxMP),s},tU=(t,e,r,n)=>{let s=tE(t.turns),i={datetime:r,action:{type:"TIME_PASSING",wt:e},sortedCharactors:s.sortedCharactors,field:{climate:tR(n)}};return i.sortedCharactors=i.sortedCharactors.map(t=>tJ(t,e,n)),i},tz=t=>{let e=tE(t.turns);if("SURRENDER"===e.action.type)return e.action.actor.isVisitor?tL:tW;let r=e.sortedCharactors.filter(t=>!t.isVisitor&&t.hp),n=e.sortedCharactors.filter(t=>t.isVisitor&&t.hp);return 0===r.length&&0===n.length?tM:r.length>0&&0===n.length?tL:0===r.length&&n.length>0?tW:tk},tZ={type:"object",properties:{type:{const:"SURRENDER"},actor:tS.lo},required:["type","actor"]},tY={type:"object",properties:{type:{const:"DO_SKILL"},actor:tS.lo,skill:{type:"string"},receivers:{type:"array",items:tS.lo}},required:["type","actor","skill","receivers"]},tQ={type:"object",properties:{type:{const:"DO_NOTHING"},actor:tS.lo},required:["type","actor"]},t0={anyOf:[tY,tQ,{type:"object",properties:{type:{const:"TIME_PASSING"},wt:{type:"integer"}},required:["type","wt"]},tZ]},t1={type:"object",properties:{datetime:{type:"string",format:"date-time"},action:t0,sortedCharactors:{type:"array",items:tS.lo},field:{type:"object",properties:{climate:{type:"string"}},required:["climate"]}},required:["datetime","action","sortedCharactors","field"]},t3=t=>"DO_SKILL"===t.type?{type:"DO_SKILL",actor:(0,tS.AM)(t.actor),skill:t.skill.name,receivers:t.receivers.map(tS.AM)}:"SURRENDER"===t.type?{type:"SURRENDER",actor:(0,tS.AM)(t.actor)}:"DO_NOTHING"===t.type?{type:"DO_NOTHING",actor:(0,tS.AM)(t.actor)}:{type:"TIME_PASSING",wt:t.wt},t5=t=>(0,h.Z)(t,"yyyy-MM-dd'T'HH:mm:ss"),t7=t=>({datetime:t5(t.datetime),action:t3(t.action),sortedCharactors:t.sortedCharactors.map(tS.AM),field:t.field}),t2=t=>{let e=(0,l.y)(),r=e(t0);if(!r(t)){let{errors:t}=r;return console.debug(t),new tb.$b(t,"actionのjsonデータではありません")}if("DO_SKILL"===t.type){let e=(0,tS.m$)(t.actor);if(e instanceof f.m||e instanceof tb.Xs||e instanceof tb.$b)return e;if(!(0,tg.Ix)(e))return new t_(e,"actor(".concat(e.name,")にisVisitor propertyがありません"));let r=[];for(let e of t.receivers){let t=(0,tS.m$)(e);if(t instanceof f.m||t instanceof tb.Xs||t instanceof tb.$b)return t;if(!(0,tg.Ix)(t))return new t_(t,"receiver(".concat(t.name,")にisVisitor propertyがありません"));r.push(t)}let n=tv(t.skill);return n?{type:"DO_SKILL",actor:e,skill:n,receivers:r}:new tb.Xs(t.skill,"skill","".concat(t.skill,"というskillは存在しません"))}if("SURRENDER"===t.type){let e=(0,tS.m$)(t.actor);return e instanceof f.m||e instanceof tb.Xs||e instanceof tb.$b?e:(0,tg.Ix)(e)?{type:"SURRENDER",actor:e}:new t_(e,"actor(".concat(e.name,")にisVisitor propertyがありません"))}if("DO_NOTHING"===t.type){let e=(0,tS.m$)(t.actor);return e instanceof f.m||e instanceof tb.Xs||e instanceof tb.$b?e:(0,tg.Ix)(e)?{type:"DO_NOTHING",actor:e}:new t_(e,"actor(".concat(e.name,")にisVisitor propertyがありません"))}return{type:"TIME_PASSING",wt:0+t.wt}},t9=t=>{let e=(0,l.y)(),r=e(t1);if(!r(t)){let{errors:t}=r;return console.debug(t),new tb.$b(t,"turnのjsonデータではありません")}let n=null;try{n=(0,u.Z)(t.datetime,"yyyy-MM-dd'T'HH:mm:ss",new Date)}catch(t){return new tb.$b(t,"日付が間違っています")}let s=t2(t.action);if(s instanceof f.m||s instanceof tb.Xs||s instanceof tb.$b||s instanceof t_)return s;let i=[];for(let e of t.sortedCharactors){let t=(0,tS.m$)(e);if(t instanceof f.m||t instanceof tb.Xs||t instanceof tb.$b)return t;if(!(0,tg.Ix)(t))return new t_(t,"charactor(".concat(t.name,")にisVisitor propertyがありません"));i.push(t)}let a={climate:t.field.climate};return{datetime:n,action:s,sortedCharactors:i,field:a}};var t4=r(4533),t6=r(5618);let t8={type:"object",properties:{title:{type:"string"},home:t4.ZL,visitor:t4.ZL,turns:{type:"array",items:t1},result:{type:"string",enum:[tk,tL,tW,tM]}},required:["title","home","visitor","turns","result"]},et=t=>({title:t.title,home:(0,t4.KD)(t.home),visitor:(0,t4.KD)(t.visitor),turns:t.turns.map(t7),result:t.result}),ee=t=>{let e=(0,l.y)(),r=e(t8);if(!r(t)){let{errors:t}=r;return console.debug(t),new tb.$b(t,"battleのjsonデータではありません")}let{title:n}=t,s=(0,t4.r7)(t.home);if(s instanceof f.m||s instanceof tb.Xs||s instanceof t6.hi||s instanceof tb.$b)return s;if(!(0,t6.TD)(s))return new t_(s,"home party(".concat(s.name,")のcharactorにisVisitor propertyがありません"));let i=(0,t4.r7)(t.visitor);if(i instanceof f.m||i instanceof tb.Xs||i instanceof t6.hi||i instanceof tb.$b)return i;if(!(0,t6.TD)(i))return new t_(i,"visitor party(".concat(i.name,")のcharactorにisVisitor propertyがありません"));let a=[];for(let e of t.turns){let t=t9(e);if(t instanceof f.m||t instanceof tb.Xs||t instanceof tb.$b||t instanceof t_)return t;a.push(t)}let{result:o}=t;return{title:n,home:s,visitor:i,turns:a,result:o}},er="battle",en=t=>async e=>t.save(er,e.title,et(e)),es=t=>async e=>{let r=await t.get(er,e);return r?ee(r):null},ei=t=>async e=>t.remove(er,e),ea=t=>async()=>t.list(er),eo=t=>async(e,r)=>t.exportJson(er,e,r),ec=async t=>(await t.checkNamespace(er),{save:en(t),list:ea(t),get:es(t),remove:ei(t),exportJson:eo(t)});var el=r(8429),eu=r(1163),eh=r(1664),ef=r.n(eh),ep=r(5332),em=r(7536),ed=r(8020),ey=r(6529),ex=r(1731),ej=r(2916),ew=r(1001),ev=r(8371),eb=r(2757),eS=r(5541),eg=r(3090),eI=r(1039),eC=r(1077),eV=r(1581),eO=r.n(eV);let eN="DO_NOTHING";class eR{constructor(t){this.message=t}}let eD={type:"object",properties:{skillName:{type:"string",minLength:1},receiversWithIsVisitor:{type:"array",items:{type:"object",properties:{value:{type:"string",minLength:1}},required:["value"]}}},required:["skillName","receiversWithIsVisitor"]},eT=t=>({value:"".concat(t.name,"__").concat((0,tg.oR)(t.isVisitor)),label:"".concat(t.name,"(").concat((0,tg.oR)(t.isVisitor),")")}),eE=(t,e)=>{let r=t.match(/^(.*)__(HOME|VISITOR)$/);if(!r)throw Error("no match");let n=r[0];if(!n)throw Error("no name");let s=r[1];if("HOME"!==s&&"VISITOR"!==s)throw Error("isVisitorStr must be HOME or VISITOR. (".concat(s,")"));let i="VISITOR"===s,a=e.find(t=>t.name===n&&t.isVisitor===i);return a||new tb.Xs(n,"charactor","".concat(n,"というcharactorは存在しません"))},e_=(t,e)=>{let r=new(eO()),n=r.compile(eD);if(!n(t)){let{errors:t}=n;return console.debug(t),new tb.$b(t,"partyのformデータではありません")}let{skillName:s}=t;if(s===eN)return null;let i=tv(s);if(!i)return new tb.Xs(s,"skill","".concat(s,"というskillは存在しません"));let a=new Set(t.receiversWithIsVisitor.map(t=>t.value));if(a.size!==t.receiversWithIsVisitor.length)return new eR("同じキャラクターを複数回えらべません");let o=[];for(let r of t.receiversWithIsVisitor){let t=eE(r.value,e);if(t instanceof tb.Xs)return t;o.push(t)}return{skill:i,receivers:o}},ek=t=>{let{battle:e}=t,r="".concat(e.home.name,"(HOME) vs ").concat(e.visitor.name,"(VISITOR)");switch(e.result){case tL:return(0,s.jsx)(c.x,{children:"".concat(r," HOME側の勝利")});case tW:return(0,s.jsx)(c.x,{children:"".concat(r," VISITOR側の勝利")});case tM:return(0,s.jsx)(c.x,{children:"".concat(r," 引き分け")});default:return(0,s.jsx)(c.x,{children:r})}},eL=t=>{let{battle:e,actor:r,lastTurn:n,skill:a,index:c,getValues:l,register:u}=t,h="receiversWithIsVisitor.".concat(c,".value"),[f,p]=(0,i.useState)(null);if(!a)return null;let m=n.sortedCharactors.map(eT);return(0,s.jsxs)(o.xu,{children:[(0,s.jsxs)(ed.NI,{children:[(0,s.jsx)(ey.l,{htmlFor:h,children:"receiver"}),(0,s.jsx)(ex.P,{...u(h,{onBlur:()=>{if(!a){p(null);return}let t=l(h),s=eE(t,n.sortedCharactors);if(s instanceof tb.Xs){p(null);return}let i=tB(e,r,a,[s],new Date,tO()),o=i.sortedCharactors.find(t=>t.isVisitor===s.isVisitor&&t.name===s.name);p(o||null)}}),placeholder:"receiver",children:m.map(t=>(0,s.jsx)("option",{value:t.value,children:t.label},"".concat(t.value)))})]}),(0,s.jsx)(o.xu,{children:f&&(0,s.jsx)(eC.i,{charactor:f})})]})},eW=t=>{let{battle:e,actor:r,store:n}=t,i=async()=>{if(window.confirm("降参してもよいですか？")){let t=tF(e,r,new Date);e.turns.push(t),await n.save({...e,result:r.isVisitor?tL:tW})}};return(0,s.jsx)(ej.z,{type:"button",onClick:i,children:"降参"})},eM=t=>{let{actor:e,replace:r,getValues:n,register:i,errors:a}=t,o=(0,tg.SM)(e),c=o.filter(t=>t.mpConsumption<=e.mp).filter(t=>!(0,tT.V)(tD.silent,e)||t.magicType===z.LB).map(t=>({value:t.name,label:t.name}));return c.push({value:eN,label:"何もしない"}),(0,s.jsxs)(ed.NI,{isInvalid:!!a.skillName,children:[(0,s.jsx)(ey.l,{htmlFor:"skill",children:"skill"}),(0,s.jsx)(ex.P,{...i("skillName",{onBlur:()=>{let t=n("skillName");if(t===eN){r([]);return}let e=tv(t);if(!e||!e.receiverCount){r([]);return}let s=Array(e.receiverCount).fill("");r(s)}}),placeholder:"skill",children:c.map(t=>(0,s.jsx)("option",{value:t.value,children:t.label},"".concat(t.value)))}),(0,s.jsx)(ew.J1,{children:!!a.skillName&&a.skillName.message})]})},eH=async(t,e,r,n)=>{if(null===n)e.turns.push(tq(e,r,new Date));else{let t=n.skill,s="SKILL_TO_FIELD"===t.type?tK(e,r,t,new Date,tV()):tB(e,r,t,n.receivers,new Date,tV());e.turns.push(s)}if(e.result=tz(e),e.result!==tk){await t.save(e);return}let s=t$(e);if(e.turns.push(tU(e,s.restWt,new Date,tV())),e.result=tz(e),e.result!==tk){await t.save(e);return}for(;(0,tT.V)(tD.sleep,s);)if(e.turns.push(tq(e,s,new Date)),e.result=tz(e),e.result!==tk||(s=t$(e),e.turns.push(tU(e,s.restWt,new Date,tV())),e.result=tz(e),e.result!==tk)){await t.save(e);return}await t.save(e)},e$=t=>{let{battle:e,store:r}=t,n=tH(e),a=t$(e),{handleSubmit:l,register:u,getValues:h,formState:{errors:f,isSubmitting:p},control:m}=(0,em.cI)({resolver:(0,ep.G)(eD)}),{fields:d,replace:y}=(0,em.Dq)({control:m,name:"receiversWithIsVisitor"}),[x,j]=(0,i.useState)(""),w=async t=>{let s=e_(t,n.sortedCharactors);if(s instanceof tb.$b||s instanceof tb.Xs){j("入力してください");return}if(s instanceof eR){j(s.message);return}window.confirm("実行していいですか？")&&await eH(r,e,a,s)},v=a.isVisitor?(0,s.jsx)(ev.Vp,{children:"VISITOR"}):(0,s.jsx)(ev.Vp,{children:"HOME"});return(0,s.jsxs)(o.xu,{p:4,children:[(0,s.jsx)(ef(),{href:{pathname:"battle"},children:(0,s.jsx)("a",{children:"戻る"})}),(0,s.jsx)(c.x,{children:"This is the battle page"}),e.result!==tk&&(0,s.jsx)(ej.z,{type:"button",onClick:()=>r.exportJson&&r.exportJson(e.title,""),children:"Export"}),(0,s.jsx)(ek,{battle:e}),(0,s.jsxs)("form",{onSubmit:l(w),children:[x&&(0,s.jsx)(ew.J1,{children:x}),e.result===tk&&(0,s.jsx)(eW,{battle:e,actor:a,store:r}),(0,s.jsxs)(o.xu,{as:"dl",children:[(0,s.jsx)(eb.X,{as:"dt",children:"battle title"}),(0,s.jsx)(c.x,{as:"dd",children:e.title})]}),(0,s.jsxs)(c.x,{children:["".concat(a.name,"のターン"),v]}),(0,s.jsx)(eM,{actor:a,getValues:h,register:u,errors:f,replace:y}),(0,s.jsx)(eS.aV,{children:d.map((t,r)=>(0,s.jsx)(eS.HC,{children:(0,s.jsx)(eL,{battle:e,actor:a,lastTurn:n,skill:tv(h("skillName")),getValues:h,register:u,index:r})},"receiversWithIsVisitor.".concat(r)))}),(0,s.jsx)(ej.z,{colorScheme:"teal",isLoading:p,type:"submit",children:"実行"})]}),(0,s.jsx)(o.xu,{children:(0,s.jsx)(eS.aV,{children:n.sortedCharactors.map(t=>(0,s.jsx)(eS.HC,{children:(0,s.jsx)(eC.i,{charactor:t})},"CharactorDetail-".concat(t.name,"-").concat((0,tg.oR)(t.isVisitor))))})})]})},eA=t=>{let{store:e,battleTitle:r}=t,n=(0,eI.useLiveQuery)(()=>e.get(r),[r]);if(!e.exportJson)throw Error("invalid store");return n instanceof f.m||n instanceof tb.Xs||n instanceof t6.hi||n instanceof tb.$b||n instanceof t_?(0,s.jsxs)(o.xu,{children:[(0,s.jsx)(c.x,{children:n.message}),(0,s.jsx)(ef(),{href:{pathname:"battle"},children:(0,s.jsx)("a",{children:"戻る"})})]}):n?(0,s.jsx)(e$,{battle:n,store:e}):(0,s.jsxs)(o.xu,{children:[(0,s.jsx)(ef(),{href:{pathname:"battle"},children:(0,s.jsx)("a",{children:"戻る"})}),(0,s.jsx)(c.x,{children:"".concat(r,"というbattleは見つかりません")})]})},eG=t=>{let{type:e,party:r,setParty:n}=t,i=async()=>{let t=await (0,el.x)();if(!t)return;let e=(0,t4.r7)(t);if(e instanceof f.m||e instanceof tb.Xs||e instanceof t6.hi||e instanceof tb.$b){window.alert(e.message);return}n(e)};return(0,s.jsxs)(o.xu,{children:[r&&(0,s.jsx)(c.x,{children:"".concat(e," Party: ").concat(r.name)}),(0,s.jsx)(ej.z,{type:"button",onClick:i,children:"Select ".concat(e," Party")})]})},eX=t=>{let{store:e}=t,r=(0,eu.useRouter)(),[n,a]=(0,i.useState)(""),{handleSubmit:l,register:u,formState:{errors:h,isSubmitting:f}}=(0,em.cI)(),[p,m]=(0,i.useState)(null),[d,y]=(0,i.useState)(null),x=async t=>{let n=[],{title:s}=t;if(!s){n.push("titleを入力してください");return}if(!p){n.push("home partyを入力してください");return}if(!d){n.push("visitor partyを入力してください");return}if(n.length>0){a(n.join("\n"));return}let i=tG(s,p,d),o=tX(i,new Date,tV());i.turns.push(o);let c=t$(i);i.turns.push(tU(i,c.restWt,new Date,tV())),await e.save(i),await r.push({pathname:"battle",query:{title:i.title}})};return(0,s.jsxs)(o.xu,{p:4,children:[(0,s.jsx)(ef(),{href:{pathname:"battle"},children:(0,s.jsx)("a",{children:"戻る"})}),(0,s.jsx)(c.x,{children:"This is the battle page"}),(0,s.jsxs)("form",{onSubmit:l(x),children:[n&&(0,s.jsx)(ew.J1,{children:n}),(0,s.jsxs)(ed.NI,{isInvalid:!!h.title,children:[(0,s.jsx)(ey.l,{htmlFor:"title",children:"title"}),(0,s.jsx)(eg.I,{id:"title",placeholder:"title",...u("title")}),(0,s.jsx)(ew.J1,{children:h.title&&h.title.message})]}),(0,s.jsx)(eG,{type:"HOME",party:p,setParty:m}),(0,s.jsx)(eG,{type:"VISITOR",party:d,setParty:y}),(0,s.jsx)(ej.z,{colorScheme:"teal",isLoading:f,type:"submit",children:"Start Battle"})]})]})},eq=t=>{let{store:e}=t,r=(0,eI.useLiveQuery)(()=>e.list(),[]);return(0,s.jsxs)(o.xu,{children:[(0,s.jsx)(ef(),{href:{pathname:"/"},children:(0,s.jsx)("a",{children:"戻る"})}),(0,s.jsx)(o.xu,{children:(0,s.jsxs)(eS.aV,{children:[(0,s.jsx)(eS.HC,{children:(0,s.jsx)(ef(),{href:{pathname:"battle",query:{title:"__new"}},children:(0,s.jsx)("a",{children:"新しく作る"})})},"battle-new"),r&&r.map((t,e)=>(0,s.jsx)(eS.HC,{children:(0,s.jsx)(ef(),{href:{pathname:"battle",query:{title:t}},children:(0,s.jsx)("a",{children:t})})},"battle-".concat(e)))]})})]})};var eP=()=>{let t=(0,a.useSearchParams)(),e=t.get("title"),[r,n]=(0,i.useState)(null);return((0,i.useEffect)(()=>{(async()=>{let t=await (0,el.h)(),e=await ec(t);n(e)})()},[]),r)?e?"__new"===e?(0,s.jsx)(eX,{store:r}):(0,s.jsx)(eA,{battleTitle:e,store:r}):(0,s.jsx)(eq,{store:r}):(0,s.jsx)(o.xu,{children:(0,s.jsx)(c.x,{children:"loading..."})})}}},function(t){t.O(0,[905,550,348,971,774,888,179],function(){return t(t.s=7156)}),_N_E=t.O()}]);