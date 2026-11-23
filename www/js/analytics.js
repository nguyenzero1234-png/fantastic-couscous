/* Các phép tổng hợp thống kê và lịch sử học, không thao tác DOM/storage. */
(function(global){
 "use strict";
 function summarize(history,counts,options){
  const H=history||{},C=counts||{},o=options||{},today=o.today||"",d7=o.days7||[],d30=o.days30||[];
  const g=(d,f)=>(H[d]||{})[f]||0;
  const sm=(days,f)=>days.reduce((t,d)=>t+g(d,f),0);
  const sn=days=>days.reduce((t,d)=>t+(C[d]||0),0);
  const mo=Object.keys(H).filter(k=>k.slice(0,7)===today.slice(0,7));
  let mA=0,pA=0,bp=0,bd="";
  for(const k in H){mA+=H[k].m;pA+=H[k].p;if(H[k].p>bp){bp=H[k].p;bd=k}}
  let ls=0,run=0,pv=null;
  Object.keys(H).filter(k=>H[k].m>0).sort().forEach(k=>{run=pv&&Math.round((new Date(k)-new Date(pv))/864e5)===1?run+1:1;ls=Math.max(ls,run);pv=k});
  return {g,sm,sn,mo,mA,pA,bp,bd,ls,streak:o.streak||0};
 }
 function kiepMetrics(history,counts,studyLog,days){
  let m=0,n=0,d=0;const H=history||{},C=counts||{},L=studyLog||[],D=days||[];
  D.forEach(k=>{const h=H[k];if(h&&h.m>0){m+=h.m;d++}n+=C[k]||0});
  const l=L.filter(x=>D.includes(new Date(x[0]).toLocaleDateString("sv"))).reduce((a,x)=>Math.max(a,x[1]),0);
  return {m,n,d,l};
 }
 global.GameAnalytics=Object.freeze({summarize,kiepMetrics});
})(window);
