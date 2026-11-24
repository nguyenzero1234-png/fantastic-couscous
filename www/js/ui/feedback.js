/* Shared visual and audio feedback for rewards and realm breakthroughs. */
(function(root){
 "use strict";
 function create({document,$,sfx,navigator,schedule,cancel,matchMedia,realmColors,realmStory}){
  const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
  const card=$("realm-breakthrough");
  let cardTimer=null;
  function burst(){
   sfx(523);schedule(()=>sfx(784),130);
   if(navigator.vibrate)try{navigator.vibrate(40)}catch(e){}
   if(reduced())return;
   for(let i=0;i<26;i++){
    const c=document.createElement("i");
    c.className="cf";
    const a=Math.random()*6.283,d=80+Math.random()*140;
    c.style.cssText="--dx:"+Math.cos(a)*d+"px;--dy:"+(Math.sin(a)*d-60)+"px;--r:"+(Math.random()*720-360)+"deg;background:hsl("+(Math.random()*360|0)+" 80% 60%)";
    document.body.appendChild(c);schedule(()=>c.remove(),1300);
   }
  }
  function clear(){
   cancel(cardTimer);cardTimer=null;card.hidden=true;
  }
  function breakthrough(index){
   const story=realmStory[index];if(!story)return;
   cancel(cardTimer);
   card.style.setProperty("--realm-accent",realmColors[index]);
   $("realm-breakthrough-name").textContent=story.t;
   $("realm-breakthrough-story").textContent=story.lines[0];
   card.hidden=false;
   sfx(660);schedule(()=>sfx(880),120);
   cardTimer=schedule(clear,4200);
  }
  clear();
  return Object.freeze({burst,breakthrough,clear,active:()=>!card.hidden});
 }
 root.GameFeedbackUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
