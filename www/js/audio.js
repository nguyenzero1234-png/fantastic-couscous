/* Âm thanh giao diện, tách khỏi state và bootstrap gameplay. */
(function(root){
"use strict";
function create(isMuted,host){
 const env=host||{};
 let audio=null;
 function context(){
  if(audio)return audio;
  const C=env.AudioContext||env.webkitAudioContext;
  if(!C)return null;
  audio=new C();
  return audio;
 }
 function sfx(f){
  if(isMuted())return;
  try{
   const ac=context();if(!ac)return;
   const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
   o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.14,t);
   g.gain.exponentialRampToValueAtTime(.001,t+.6);
   o.connect(g);g.connect(ac.destination);o.start();o.stop(t+.6);
  }catch(e){}
 }
 function clk(){
  if(isMuted())return;
  try{
   const ac=context();if(!ac)return;
   if(ac.state==="suspended")ac.resume();
   const n=Math.floor(ac.sampleRate*.035),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);
   for(let k=0;k<n;k++)d[k]=(env.Math||Math).random()*2-1===0?0:((env.Math||Math).random()*2-1)*Math.pow(1-k/n,5);
   const o=ac.createBufferSource();o.buffer=b;
   const f=ac.createBiquadFilter();f.type="bandpass";f.frequency.value=2400;f.Q.value=.8;
   const g=ac.createGain();g.gain.value=.45;o.connect(f);f.connect(g);g.connect(ac.destination);o.start();
  }catch(e){}
 }
 function bind(doc){
  if(!doc||typeof doc.addEventListener!=="function")return;
  doc.addEventListener("pointerdown",e=>{
   const t=e.target&&e.target.closest&&e.target.closest("button,summary,select,.tick");
   if(t&&!t.disabled)clk();
  },true);
 }
 return {sfx,clk,bind};
}
root.GameAudio={create};
})(typeof window!=="undefined"?window:globalThis);
