(function (root) {
  "use strict";

  function rank(pet, level) {
    const ranks = pet.ranks;
    return ranks ? ranks[Math.min(ranks.length, Math.max(1, level | 0)) - 1] : pet.n;
  }

  function buff(pets, active) {
    const pet = pets && active && pets[active];
    if (!pet) return {};
    const level = pet.lv;
    const out = {};
    const key = active;
    if (key === "hq") out.fq = level;
    if (key === "kl") out.fl = 2 + 2 * level;
    if (key === "ct") out.kp = 2 + 2 * level;
    if (key === "hg") out.dc = 2 + 2 * level;
    if (key === "bh") { out.fr = 2 * level; out.ft = 2 * level; }
    if (key === "tt") out.dr = .02 * level;
    if (key === "tn") out.f1 = 4 + 2 * level;
    if (key === "pg") out.fs = level;
    if (key === "ko") out.fm = 2 * level;
    if (key === "dm") out.fn = 2 * level;
    if (key === "ty") out.rf = 2 * level;
    if (key === "mm") out.mn = level;
    return out;
  }


  function accrued(pets,active,now,bonus){
    const a=pets&&pets.hl;
    if(!a||active!=="hl")return 0;
    return Math.floor(Math.min(8,(now-a.t)/36e5)*(2+a.lv+(bonus||0)));
  }
  function grant(state,roster,prefer,options){
    const o=options||{},P=state.pets||(state.pets={}),avail=roster.filter(x=>!P[x.id]);
    if(!avail.length)return null;
    let pet=prefer?roster.find(x=>x.id===prefer&&!P[x.id]):null;
    if(!pet)pet=avail[Math.floor((o.random||Math.random)()*avail.length)];
    if(!pet)return null;
    const now=o.now==null?Date.now():o.now;
    P[pet.id]={lv:1,t:now};
    if(o.markNew)o.markNew(pet.id);
    if(!state.act)state.act=pet.id;
    const prize={id:pet.id,n:rank(pet,1),base:pet.n,p:pet};
    state.petReveal={id:pet.id,n:prize.n,base:pet.n,e:pet.e(1),d:pet.d};
    return prize;
  }
  function setActive(state,id,now,bonus){
    const collected=accrued(state.pets,state.act,now,bonus);
    if(collected)state.points+=collected;
    state.act=id;
    if(id==="hl"&&state.pets&&state.pets.hl)state.pets.hl.t=now;
    return collected;
  }
  root.GamePetData = Object.freeze({ rank, buff, accrued, grant, setActive });
})(typeof window !== "undefined" ? window : globalThis);
