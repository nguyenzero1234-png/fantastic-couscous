const GameStateHandle=GameState.create();
let S=GameStateHandle.state;
let KSALT=(S.rb||0)*7919;
const save=GameStateHandle.save;
const $=id=>document.getElementById(id);
const today=()=>GameDateData.today(S.dOff||0);
const esc=GameText.escapeHtml;
const isDone=q=>GameQuestData.isDone(q,today());
const pad=GameTimeFormat.pad;
const fmt=GameTimeFormat.formatDuration;
let extra="",tmr=0;
const say=t=>{const m=t+extra;extra="";$("msg").textContent=m;if(!m)return;const el=$("toast");el.textContent=m;el.classList.add("on");clearTimeout(tmr);tmr=setTimeout(()=>el.classList.remove("on"),3800);if(/\+\d|Đột phá|Danh hiệu mới|Hoàn thành/.test(m))burst()};
function burst(){sfx(523);setTimeout(()=>sfx(784),130);if(navigator.vibrate)try{navigator.vibrate(40)}catch(e){}for(let i=0;i<26;i++){const c=document.createElement("i");c.className="cf";const a=Math.random()*6.283,d=80+Math.random()*140;c.style.cssText="--dx:"+Math.cos(a)*d+"px;--dy:"+(Math.sin(a)*d-60)+"px;--r:"+(Math.random()*720-360)+"deg;background:hsl("+(Math.random()*360|0)+" 80% 60%)";document.body.appendChild(c);setTimeout(()=>c.remove(),1300)}}



const QM={"1":2,"3":1.75,"0":1.5};
const cl=p=>Object.keys(S.claimed).filter(k=>k[0]===p).length;
const TITLES=[
 {id:"t1",n:"Phá Hiểu Tân Tinh",d:"Nhận thưởng event tuần lần đầu",b:"+3 linh lực cố định mỗi nhiệm vụ",ok:()=>cl("w")>=1},
 {id:"t2",n:"Hỏa Luyện Bất Diệt",d:"Nhận thưởng event tuần 4 lần",b:"Mỗi ngày chuỗi cộng +1 linh lực cố định mỗi nhiệm vụ (tối đa +14)",ok:()=>cl("w")>=4},
 {id:"t3",n:"Nguyệt Hạ Kiếm Tiên",d:"Nhận thưởng event tháng lần đầu",b:"Thưởng event +60 linh lực",ok:()=>cl("m")>=1},
 {id:"t4",n:"Bách Chiến Bất Khuất",d:"Nhận thưởng event tháng 3 lần",b:"Khi mang tâm ma, mỗi nhiệm vụ +12 linh lực",ok:()=>cl("m")>=3},
 {id:"t5",n:"Song Tuyệt Học Bá",d:"Nhận cả event tuần và tháng trong cùng một tháng",b:"Mỗi lần nhận thưởng event hoặc lệnh bài +20 linh lực",ok:()=>{const K=Object.keys(S.claimed);return K.some(k=>k[0]==="m"&&K.some(j=>j[0]==="w"&&j.slice(2,9)===k.slice(2)))}},
 {id:"t6",n:"Thiên Kiếp Khôi Thủ",d:"Đạt mức Xuất sắc ở một đợt thiên kiếp và nhận thưởng",b:"Nhiệm vụ từ 60 phút +10 linh lực cố định",ok:()=>xr().some(r=>r.rows.some(z=>z.u&&z.g==="Xuất sắc"))},
 {id:"t7",n:"Vạn Kiếp Bất Hoại",d:"Vượt mọi thiên kiếp với từ Trung bình trở lên",b:"Hoàn thành liên hoàn +120 linh lực",ok:()=>xr().length>=EX.length&&xr().every(r=>r.rows.some(z=>z.u&&z.s>=50))},
 {id:"n1",n:"Dạ Hành Kiếm Tiên",d:"Hoàn thành 10 nhiệm vụ trong khoảng 22 giờ đến 5 giờ sáng",b:"Nhiệm vụ làm lúc 22 giờ đến 5 giờ +10 linh lực cố định",ok:()=>LS().ni>=10},
 {id:"n2",n:"Thần Hi Đạo Quân",d:"Hoàn thành 10 nhiệm vụ trước 7 giờ sáng",b:"Nhiệm vụ làm trước 9 giờ +10 linh lực cố định",ok:()=>LS().da>=10},
 {id:"n3",n:"Phách Lực Vô Song",d:"Hoàn thành 15 nhiệm vụ nhanh có hạn giờ",b:"+12 linh lực cố định cho nhiệm vụ nhanh",ok:()=>LS().ru>=15},
 {id:"n4",n:"Luân Hồi Chi Chủ",d:"Chuyển kiếp lần đầu",b:"Mỗi lần đổi nhàn hạ rẻ hơn 8 linh lực",ok:()=>(S.rb||0)>=1},
 {id:"n5",n:"Thượng Cổ Đan Sư",d:"Dùng 10 vật phẩm",b:"Vật phẩm tăng cường kéo dài thêm 1 nhiệm vụ",ok:()=>LS().it>=10},
 {id:"n6",n:"Bảng Thượng Hữu Danh",d:"Lọt top 10 bảng Thiên Kiêu khi hoàn thành một nhiệm vụ",b:"Cửu Vĩ Hồ thu thêm 2 linh lực mỗi giờ",ok:()=>LS().top>=1},
 {id:"n7",n:"Bế Quan Vạn Niên",d:"Hoàn thành 10 nhiệm vụ dài từ 120 phút",b:"Nhiệm vụ từ 120 phút +30 linh lực cố định",ok:()=>LS().lg>=10},
 {id:"n8",n:"Cuồng Phong Tốc Thủ",d:"Hoàn thành 8 nhiệm vụ trong một ngày",b:"Từ nhiệm vụ thứ 4 trong ngày, mỗi nhiệm vụ +6 linh lực",ok:()=>(LS().mc||0)>=8},
 {id:"n9",n:"Thiên Kiêu Độc Tôn",d:"Đứng hạng 1 bảng Thiên Kiêu khi hoàn thành nhiệm vụ",b:"Khi đang hạng 1 đến 3, mỗi nhiệm vụ +10 linh lực",ok:()=>!!LS().t1},
 {id:"n10",n:"Bất Hủ Kim Thân",d:"Giữ chuỗi ngày học 21 ngày",b:"Nhiệm vụ đầu tiên mỗi ngày +25 linh lực",ok:()=>LS().ms>=21},
 {id:"n11",n:"Vạn Thú Chi Vương",d:"Ấp nở 5 loài linh thú",b:"Khi có linh thú theo cùng, mỗi nhiệm vụ +4 linh lực",ok:()=>Object.keys(S.pets||{}).length>=5},
 {id:"n12",n:"Phá Ma Thần Tướng",d:"Trừ tâm ma 3 lần",b:"Mỗi lần trừ tâm ma nhận ngay +40 linh lực",ok:()=>(LS().tmc||0)>=3},
 {id:"n13",n:"Nhàn Vân Dã Hạc",d:"Đổi tổng cộng 300 phút nhàn hạ",b:"Mỗi lần đổi nhàn hạ tặng thêm 5 phút",ok:()=>(LS().lv||0)>=300},
 {id:"n14",n:"Độ Kiếp Hành Giả",d:"Vượt 30 kiếp nạn",b:"Mỗi lần vượt kiếp nạn +25 linh lực",ok:()=>(LS().kn||0)>=30},
 {id:"n15",n:"Tông Môn Chi Trụ",d:"Thắng 3 trận tông môn chiến",b:"Thắng tông môn chiến +100 linh lực",ok:()=>(LS().sw||0)>=3},
 {id:"n16",n:"Phi Thăng Chi Tử",d:"Đạt Chân Tiên lần đầu",b:"Điểm danh mỗi ngày +15 linh lực",ok:()=>S.points>=END||(S.rbh||[]).some(r=>r.pk>=END)},
 {id:"n17",n:"Càn Khôn Bảo Chủ",d:"Giữ 15 vật phẩm trong Càn Khôn Giới cùng lúc",b:"Mỗi lần dùng vật phẩm nhận ngay +15 linh lực",ok:()=>Object.values(S.inv).reduce((a,b)=>a+b,0)>=15},
 {id:"n18",n:"Nguyên Lưu Chưởng Khống Giả",d:"Đạt Chân Tiên và từng đứng hạng 1 bảng Thiên Kiêu khi hoàn thành nhiệm vụ",b:"Mỗi nhiệm vụ +12 linh lực cố định",ok:()=>(S.points>=END||(S.rbh||[]).some(r=>r.pk>=END))&&!!LS().t1}
];
// Giá ≈ 2,5–4× giá trị kỳ vọng của hiệu ứng (linh lực / tiện ích)
/* Hệ thống vật phẩm: mọi vật phẩm tăng linh lực đều hoàn lại ít nhất bằng giá mua, phát dần theo nhiệm vụ.
   q:[số nhiệm vụ, linh lực cố định mỗi nhiệm vụ, điều kiện ("" mọi nhiệm vụ, "q" nhiệm vụ nhanh, "l" từ 60 phút)]
   ex: linh lực cộng thêm một lần (ngoài q). u: tác dụng riêng của vật phẩm tiện ích.
   Vật phẩm tăng linh lực thuần: tổng nhận = 2 lần giá. Vật phẩm tiện ích: tác dụng riêng + hoàn lại 1 lần giá.
   Tổng nhận = số nhiệm vụ × linh lực mỗi nhiệm vụ + ex. */
const ITEMS=GameItemData.catalog();
const { PN, PLAN, AI_PROMPT, CHAIN_PROMPT, SCHED_PROMPT, PRESET_MIX, DEF_Q, DEF_C, DEF_S } = GameQuestTemplates;


const nowHM=GameTimeFormat.currentClock;
const tm=GameTimeFormat.toMinutes;
const hm=GameTimeFormat.toClock;
const sq=x=>S.quests.find(y=>y.id===x.qid);
const {B,BH,F,hs,vn,CDN,isTK,bio,STG,NVC_TITLES}=GameNpcRoster.create(GameNoise.hash,GameNoise.value);
const LeaderboardSimulation=GameLeaderboardSimulation.create({state:S,B,BH,CDN,hash:hs,noise:vn,getSalt:()=>KSALT,getBxp:(...args)=>bxp(...args),leaderboardData:GameLeaderboardData});
const {advance,rkf,lthM,HTC,htReset,htCount,htLate,htExtra,evAt,EC,FL,fl,eff,hrAt,hrs,efTxt,CH,CD,SP,cum,SO,SN,computeSO}=LeaderboardSimulation;
/* Icon SVG tự vẽ — vật phẩm, linh thú, chân dung */
const _svg=(w,h,body)=>`<svg class="ico" viewBox="0 0 ${w} ${h}" width="1em" height="1em" aria-hidden="true">${body}</svg>`;
const IC_SVG={
  ca:_svg(32,32,`<ellipse cx="16" cy="22" rx="10" ry="4" fill="#6b8f71"/><path d="M8 18c0-6 4-12 8-12s8 6 8 12" fill="none" stroke="#4a6b50" stroke-width="2"/><path d="M12 10c2-3 6-3 8 0" fill="none" stroke="#8fbf7a" stroke-width="1.5"/><circle cx="16" cy="16" r="2" fill="#c9e4a8"/>`),
  bm:_svg(32,32,`<ellipse cx="16" cy="18" rx="9" ry="11" fill="#c45c4a"/><ellipse cx="16" cy="14" rx="7" ry="4" fill="#e8a090"/><path d="M10 18h12" stroke="#fff8" stroke-width="1.5"/>`),
  tl:_svg(32,32,`<circle cx="16" cy="16" r="11" fill="none" stroke="#6a5a9a" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="#9a8ac8"/><path d="M16 5v4M16 23v4M5 16h4M23 16h4" stroke="#6a5a9a" stroke-width="1.5"/>`),
  lq:_svg(32,32,`<path d="M16 6c-6 8-10 14-10 18a10 10 0 0020 0c0-4-4-10-10-18z" fill="#e87840"/><ellipse cx="16" cy="22" rx="5" ry="3" fill="#f0a070"/><path d="M16 6c2 2 4 2 5 1" stroke="#5a8a40" stroke-width="2" fill="none"/>`),
  ty:_svg(32,32,`<path d="M16 28V12M10 16c4-2 8-2 12 0M8 22c5-3 11-3 16 0" stroke="#4a8a50" stroke-width="2" fill="none"/><circle cx="16" cy="10" r="3" fill="#7aba60"/>`),
  sl:_svg(32,32,`<circle cx="16" cy="16" r="10" fill="#5a7aaa"/><circle cx="16" cy="16" r="6" fill="#8ab0d0"/><path d="M12 14l4 4 6-7" stroke="#fff" stroke-width="1.8" fill="none"/>`),
  ln:_svg(32,32,`<ellipse cx="16" cy="16" rx="12" ry="8" fill="#4a6080"/><circle cx="16" cy="16" r="5" fill="#c9e0f0"/><circle cx="16" cy="16" r="2.5" fill="#1a2a3a"/>`),
  tc:_svg(32,32,`<path d="M16 4l3 8h8l-6 5 2 8-7-5-7 5 2-8-6-5h8z" fill="#c9a84c" stroke="#8a6d3b" stroke-width="1"/>`),
  the:_svg(32,32,`<rect x="7" y="6" width="18" height="22" rx="1" fill="#e8d8a8" stroke="#8a7a50"/><path d="M11 12h10M11 16h10M11 20h7" stroke="#6a5a30" stroke-width="1.2"/>`),
  ghe:_svg(32,32,`<ellipse cx="16" cy="24" rx="11" ry="4" fill="#6a5a40"/><path d="M8 22c0-10 4-16 8-16s8 6 8 16" fill="#8a7a5a"/><circle cx="16" cy="12" r="3" fill="#c9b080"/>`),
  hx:_svg(32,32,`<path d="M10 28V14h12v14" fill="#8a6a40"/><path d="M8 14h16l-2-6H10z" fill="#6a4a30"/><path d="M14 10c0-4 4-6 4-6s2 3 0 6" fill="#e8a040"/>`),
  vh:_svg(32,32,`<path d="M16 4l10 8-4 14H10L6 12z" fill="#6a9acc" stroke="#3a6a9a"/><path d="M16 4v22M6 12h20" stroke="#a8d0f0" stroke-width="1"/>`),
  td:_svg(32,32,`<path d="M8 20h16l-2 8H10z" fill="#5a4a3a"/><path d="M10 20c0-8 3-12 6-12s6 4 6 12" fill="#8a7a60"/><circle cx="16" cy="10" r="2" fill="#c9b080"/>`),
  bq:_svg(32,32,`<rect x="6" y="14" width="20" height="14" fill="#7a6a50"/><path d="M4 14h24L16 4z" fill="#9a2a20"/><rect x="13" y="18" width="6" height="10" fill="#3a2a1a"/>`),
  cb:_svg(32,32,`<path d="M16 28c-8-4-10-12-8-18 4 2 8 2 12 0 2 6 0 14-4 18z" fill="#5a9a50"/><path d="M16 10c0-6 4-8 4-8s1 4-1 8" stroke="#3a6a30" fill="none" stroke-width="1.5"/>`),
  ht:_svg(32,32,`<path d="M6 12l10-8 10 8v10c0 6-6 10-10 12-4-2-10-6-10-12z" fill="#6a7a9a" stroke="#3a4a6a"/><path d="M16 10v14M10 16h12" stroke="#c0d0e8" stroke-width="1.5"/>`),
  tq:_svg(32,32,`<circle cx="16" cy="16" r="11" fill="none" stroke="#8a6d3b" stroke-width="2"/><path d="M16 8v8l5 4" stroke="#c9a84c" stroke-width="2" fill="none"/><circle cx="16" cy="16" r="2" fill="#8a6d3b"/>`),
  dk:_svg(32,32,`<path d="M16 4l2 10h8l-6 5 2 10-6-6-6 6 2-10-6-5h8z" fill="#e0b45a"/><path d="M16 14v10" stroke="#8a5a12" stroke-width="1.5"/>`),
  cl:_svg(32,32,`<path d="M8 8c0 0 4 4 8 4s8-4 8-4v16c0 0-4-4-8-4s-8 4-8 4z" fill="#c9a84c" stroke="#8a6d3b"/><circle cx="16" cy="16" r="3" fill="#8a5a12"/>`),
  ll:_svg(32,32,`<ellipse cx="16" cy="18" rx="10" ry="8" fill="#c87840"/><path d="M8 14c4-6 12-6 16 0" fill="#e09860"/><circle cx="12" cy="18" r="1.5" fill="#5a3a20"/>`),
  hy:_svg(32,32,`<ellipse cx="16" cy="18" rx="9" ry="7" fill="#e87840"/><circle cx="16" cy="12" r="6" fill="#f09860"/><path d="M8 8l4 4M24 8l-4 4" stroke="#c85820" stroke-width="2"/><circle cx="13" cy="11" r="1.2" fill="#2a1a10"/><circle cx="19" cy="11" r="1.2" fill="#2a1a10"/>`)
};
const IC=IC_SVG;
const PET_IMG={ct:"assets/pets/ct.jpg",pg:"assets/pets/pg.jpg",ko:"assets/pets/ko.jpg",dm:"assets/pets/dm.jpg",ty:"assets/pets/ty.jpg",mm:"assets/pets/mm.jpg",hq:"assets/pets/hq.jpg",bh:"assets/pets/bh.jpg",tn:"assets/pets/tn.jpg",tt:"assets/pets/tt.jpg",hl:"assets/pets/hl.jpg",kl:"assets/pets/kl.jpg",hg:"assets/pets/hg.jpg"}
function petIcon(id){
  if(PET_IMG[id])return `<img class="pet-img" src="${PET_IMG[id]}" alt="" draggable="false">`;
  const P={
    hl:`<ellipse cx="16" cy="20" rx="8" ry="6" fill="#e87840"/><circle cx="16" cy="12" r="6" fill="#f09860"/><path d="M8 8l3 4M24 8l-3 4M10 22q6 6 12 0" stroke="#c85820" fill="none"/><circle cx="13" cy="11" r="1.2" fill="#2a1a"/><circle cx="19" cy="11" r="1.2" fill="#2a1a"/>`,
    hq:`<path d="M10 22c0-10 4-16 6-16s6 6 6 16" fill="#e8e8f0"/><path d="M16 8c4-6 10-4 8 2" fill="#c0c0d8"/><circle cx="18" cy="14" r="1.2" fill="#2a2a"/>`,
    kl:`<path d="M8 24c2-12 6-18 8-18s6 6 8 18" fill="#e8d8a0"/><path d="M12 10l4-6 4 6" fill="#c9a84c"/><circle cx="14" cy="16" r="1" fill="#4a3a"/><circle cx="18" cy="16" r="1" fill="#4a3a"/>`,
    ct:`<path d="M6 20c4-10 8-14 10-14s6 4 10 14" fill="#c8483a"/><path d="M16 8l4-4M16 8l-4-4" stroke="#e07050" stroke-width="2"/><circle cx="14" cy="14" r="1" fill="#2a1a"/><circle cx="18" cy="14" r="1" fill="#2a1a"/>`,
    hg:`<ellipse cx="16" cy="20" rx="11" ry="8" fill="#4a6a5a"/><path d="M10 16c2-6 10-6 12 0" fill="#6a8a7a"/><line x1="8" y1="22" x2="6" y2="28" stroke="#3a4a"/><line x1="24" y1="22" x2="26" y2="28" stroke="#3a4a"/>`,
    bh:`<ellipse cx="16" cy="18" rx="10" ry="8" fill="#e8e0d0"/><path d="M8 10l4 4M24 10l-4 4" fill="#d0c8b0"/><circle cx="12" cy="16" r="1.5" fill="#2a2a"/><circle cx="20" cy="16" r="1.5" fill="#2a2a"/><path d="M14 20h4" stroke="#2a2a"/>`,
    tt:`<ellipse cx="16" cy="18" rx="9" ry="7" fill="#a08060"/><circle cx="16" cy="12" r="5" fill="#b89070"/><circle cx="14" cy="11" r="1" fill="#2a1a"/><path d="M22 14q4-2 6 2" stroke="#8a6a40" fill="none"/>`,
    tn:`<path d="M6 18c4-12 8-14 10-14s6 2 10 14c-4 6-16 6-20 0z" fill="#3a8a7a"/><path d="M16 6v4M10 10l-4-2M22 10l4-2" stroke="#2a6a5a" stroke-width="1.5"/>`,
    pg:`<path d="M8 18c3-12 6-14 8-14s5 2 8 14c-2 8-12 8-16 0z" fill="#c8483a"/><path d="M16 6c4-4 8 0 6 4" fill="#e07050"/><circle cx="14" cy="14" r="1" fill="#2a1a"/>`,
    ko:`<circle cx="16" cy="16" r="9" fill="#e0b45a"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="#c9a84c" stroke-width="2"/><circle cx="16" cy="16" r="4" fill="#f0d080"/>`,
    dm:`<path d="M8 16c4-10 8-12 8-12s4 2 8 12c-2 8-12 8-16 0z" fill="#3a3a5a"/><circle cx="13" cy="14" r="1.5" fill="#c0e0ff"/><circle cx="19" cy="14" r="1.5" fill="#c0e0ff"/>`,
    ty:`<ellipse cx="16" cy="18" rx="10" ry="8" fill="#c9b080"/><path d="M10 12l-4-4M22 12l4-4" stroke="#8a7a50" stroke-width="2"/><circle cx="13" cy="16" r="1.2" fill="#2a1a"/><circle cx="19" cy="16" r="1.2" fill="#2a1a"/>`,
    mm:`<ellipse cx="16" cy="18" rx="9" ry="7" fill="#3a3a3a"/><circle cx="16" cy="12" r="6" fill="#4a4a4a"/><path d="M8 8l3 3M24 8l-3 3" stroke="#2a2a"/><circle cx="13" cy="11" r="1.3" fill="#c9e0a0"/><circle cx="19" cy="11" r="1.3" fill="#c9e0a0"/>`
  };
  return _svg(32,32,P[id]||`<circle cx="16" cy="16" r="10" fill="#8a7a5a"/>`);
}
const AV_NAM="assets/avatars/nam.jpg";
const AV_NU="assets/avatars/nu.jpg";
const AV_ICON="assets/avatars/icon.jpg";
const AVATARS={"Bạch Nhược Hư":"assets/avatars/bach-nhuoc-hu.jpg","Giang Thừa Ảnh":"assets/avatars/giang-thua-anh.jpg","Hạ Trường Ca":"assets/avatars/ha-truong-ca.jpg","Liễu Như Yên":"assets/avatars/lieu-nhu-yen.jpg","Lăng Tiêu Hàn":"assets/avatars/lang-tieu-han.jpg","Mạc Vô Cực":"assets/avatars/mac-vo-cuc.jpg","Tần Hạo Thiên":"assets/avatars/tan-hao-thien.jpg","Vô Song":"assets/avatars/vo-song.jpg","Đường Thanh Liên":"assets/avatars/duong-thanh-lien.jpg","Cố Thái Hư":"assets/avatars/co-thai-hu.jpg","Phong Vân Tử":"assets/avatars/phong-van-tu.jpg"};
function playerAvSrc(){return (S.gender==="nu"?AV_NU:AV_NAM)}
function portrait(seed,opts){
  opts=opts||{};
  const w=opts.w||48,h=opts.h||48;
  // Avatar NVC theo giới tính
  if(opts.player||seed===S.name||(opts.forcePlayer)){
    const src=playerAvSrc();
    return `<img class="av-img" src="${src}" width="${w}" height="${h}" alt="" style="width:${w}px;height:${h}px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);box-shadow:0 2px 8px rgba(0,0,0,.2);display:block">`;
  }
  // Avatar NPC đặc biệt theo tên
  if(typeof seed==="string" && AVATARS[seed]){
    return `<img class="av-img" src="${AVATARS[seed]}" width="${w}" height="${h}" alt="${seed}" style="width:${w}px;height:${h}px;border-radius:50%;object-fit:cover;border:2px solid var(--jade);box-shadow:0 2px 8px rgba(0,0,0,.2);display:block">`;
  }
  return ""; // NPC thường không có avatar
}
const avatar=name=>`<span class="av">${portrait(name)}</span>`;
function sectStats(now){return GameSectWar.stats(SECTS.length,B.map((b,i)=>({sect:SO[i],xp:bxp(i,now)})),S.sect,uxp())}
const ugain=(d1,d2)=>GameAnalytics.sumPointsBetween(S.hist,d1,d2);
function warScores(t1,t2,d1,d2){
  const sh=(S.dOff||0)*864e5;t1-=sh;t2-=sh;
  const npc=B.map((b,i)=>({sect:SO[i],gain:Math.max(0,bxp(i,t2)-bxp(i,t1))}));
  const userGain=S.sect!=null?Math.max(0,ugain(d1,d2)):0;
  return GameSectWar.score(SECTS.length,npc,S.sect,userGain,SN);
}
const warPairs=GameSectWar.pairs;
const warFlavor=GameSectWar.flavor;
function warReward(){return GameSectWar.reward({
  state:S,sects:SECTS,weekEnd:EP,modGain,hasTitle:()=>eqT("n15"),
  today,addHistory:(day,points,mins)=>hAdd(day,points,mins),log:vlog,
  random:Math.random
});}

const ProfileUI=GameProfileUI.create({S,B,SO,SECTS,TITLES,BH,SP,CDN,HTC,NVC_TITLES,RL,STG,$,uxp,bxp,ri,tok,bio,myRk,rkNow,portrait,isTK,escapeHtml:esc,esc,htCount,htLate,hrs,miles,fmtT,rname,realmColors:RC,quotes:QT,document,prevMemory:()=>prevMemory(),days:KD,getKAge:()=>kAge(),getProfileIndex:()=>PI});
function renderProf(){ProfileUI.render()}
const SectUI=GameSectUI.create({S,sectStats,warScores,ugain,warPairs,warFlavor,SECTS,MASTERS,sectMissions,weekStart:()=>weekStart(),weekEnd:EP,$});
function renderSect(){SectUI.render()}
const rkAt=(i,ms)=>{const s=sc(i,ms);let r=1;for(let j=0;j<B.length;j++)if(j!==i&&sc(j,ms)>s)r++;return r};
/* Hạng hiện tại của NPC trên bảng chung (tính cả người chơi, hòa điểm thì NPC đứng trước, khớp thứ tự bảng xếp hạng) */
const rkNow=i=>{const t=Date.now(),s=sc(i,t);let r=1;for(let j=0;j<B.length;j++){if(j===i)continue;const o=sc(j,t);if(o>s||(o===s&&j<i))r++}if(S.points>s)r++;return r};
const myRk=()=>{const t=Date.now();let r=1;for(let i=0;i<B.length;i++)if(sc(i,t)>=S.points)r++;return r};
function vlog(t){(S.vlog||(S.vlog=[])).unshift({t,ts:Date.now()});S.vlog.length=Math.min(S.vlog.length,40)}
function brk(){const rr=ri(uxp());S.pk=Math.max(S.pk||0,rr);if(S.rm!=null&&rr<S.rm)S.rm=rr;if(S.rm==null)S.rm=rr;else if(rr>S.rm){S.rm=rr;vlog("Đột phá tu vi: "+rname(uxp()));burst();sfx(660);setTimeout(()=>sfx(880),120);setTimeout(()=>say("Đột phá tu vi: "+rname(uxp())+"!"),300)}}
const fmtT=ms=>GameTimeFormat.eventTimestamp(ms);
function recentEv(){
  const n0=Math.floor((Date.now()-S.lb.t0)/3600000),L=[];
  for(let i=0;i<B.length;i++)for(let m=n0-72;m<=n0;m++){const e=evAt(i,m);if(e)L.push(e)}
  return L.filter(e=>S.lb.t0+(e.m+e.ph)*36e5<=Date.now()).sort((a,b)=>(b.m+b.ph)-(a.m+a.ph));
}
function renderVan(){LeaderboardUI.renderTimeline()}
const CDE=["+giờ học/ngày trong thời gian cơ duyên","hiệu suất ×1,25 đến ×1,60","cộng thẳng linh lực (60×(1+hệ số)×2 đến 6)","biến động còn 35%, +0,5× giờ học","cộng thẳng khoảng 2% linh lực (tối thiểu 150)","+giờ học/ngày, kéo dài gấp đôi","hiệu suất ×1,30 và +1 giờ học/ngày","hiệu suất ×1,40 nhưng biến động ×2,5","cộng thẳng 500 đến 3.000 linh lực"];
let SPC=null;
function spStatsHtml(){
  const now=Date.now(),H=36e5,n0=Math.min(24*KD,Math.max(0,Math.floor((now-S.lb.t0)/H)));
  if(!SPC||SPC.n0!==n0||SPC.t0!==S.lb.t0||SPC.k!==KSALT){
    const cn=Array(9).fill(0);
    for(let i=0;i<B.length;i++)for(let m=0;m<=n0;m++){const e=evAt(i,m);if(e&&S.lb.t0+(e.m+e.ph)*H<=now)cn[e.k]++}
    SPC={n0,t0:S.lb.t0,k:KSALT,cn};
  }
  const h1=Math.floor((now-KT0)/H),h0=Math.max(0,Math.floor((KS().start-KT0)/H)),pn=Array(KN.length).fill(0),pg=Array(KN.length).fill(0);
  for(let h=h0;h<=h1;h++){const o=knAt(h);if(o&&o.st<=now){pn[o.k]++;if(S.claimed["o:"+h])pg[o.k]++}}
  const spl=S.lb.spl||[],cnt=(k,u)=>spl.filter(x=>x.k===k&&!!x.u===!!u).length;
  const T=(head,rows)=>`<div style="overflow-x:auto;margin-top:6px"><table style="width:100%;border-collapse:collapse;font-size:12.5px;line-height:1.45"><thead><tr>${head.map(x=>`<th style="text-align:left;white-space:nowrap;padding:4px 6px;border-bottom:1px solid var(--mute)">${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td style="padding:4px 6px;border-bottom:1px solid rgba(128,128,128,.25);vertical-align:top">${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const hold=[];const ps=spA();if(ps)hold.push("Bạn: "+SPQ[ps.k].n+" (đến "+((EX.find(z=>z.id===ps.ex)||{}).n||"thiên kiếp kế tiếp")+")");
  for(const k in (S.lb.sp||{})){const p=S.lb.sp[k];hold.push(B[+k].n+": "+SPQ[p.k].n+" (đến "+((EX.find(z=>z.id===p.ex)||{}).n||"thiên kiếp kế tiếp")+")")}
  let h=`<div class="box"><h2>Bảng thống kê cơ duyên</h2><small>Số liệu tính từ đầu kiếp hiện tại. Có ba nhóm: cơ duyên đặc biệt cho 3 hạng cuối, cơ duyên của NPC và kỳ ngộ của người chơi.</small>`;
  h+=`<b style="display:block;margin-top:10px;font-size:13px;color:var(--gold)">1. Cơ duyên đặc biệt (chỉ 3 hạng cuối, cả NPC lẫn người chơi)</b><small>Mỗi lần chốt bảng tuần, mỗi nhân vật đứng 3 hạng cuối quay một lần: 20% mỗi loại, 40% không trúng. Không ai giữ hai cơ duyên này cùng lúc. Hiệu lực chỉ riêng người đó, kéo dài đến thiên kiếp kế tiếp.</small>`;
  h+=T(["Cơ duyên","Người chơi","NPC","Tỉ lệ","NPC nhận","Bạn nhận"],SPQ.map((q,k)=>[`<b>${q.n}</b>`,q.pd,q.nd,Math.round(q.p*100)+"%",cnt(k,0),cnt(k,1)]));
  h+=`<small style="display:block;margin-top:6px">Đang hiệu lực: ${hold.length?hold.join("; "):"chưa có ai."}</small>`;
  h+=`<b style="display:block;margin-top:14px;font-size:13px;color:var(--gold)">2. Cơ duyên của NPC (${CDN.length} loại)</b><small>Mỗi NPC gặp trung bình 0,5 đến 3 lần mỗi ngày (hạng càng thấp càng dễ gặp). Khi cơ duyên xuất hiện, mỗi loại có xác suất 1/${CDN.length}.</small>`;
  h+=T(["Cơ duyên","Hiệu ứng","Tỉ lệ","Số lần (mọi NPC)"],CDN.map((n,k)=>[`<b>${n}</b>`,CDE[k],"1/"+CDN.length,SPC.cn[k]]));
  h+=`<b style="display:block;margin-top:14px;font-size:13px;color:var(--gold)">3. Kỳ ngộ của người chơi (${KN.length} loại)</b><small>Mỗi giờ có khoảng 6% xuất hiện một kỳ ngộ (khoảng 1 đến 2 lần mỗi ngày). Mỗi loại có xác suất 1/${KN.length}. Cần học đủ số phút trong khung giờ để nhận.</small>`;
  h+=T(["Kỳ ngộ","Thưởng thêm","Tỉ lệ","Đã xuất hiện","Đã nhận"],KN.map((q,k)=>[`<b>${q[0]}</b>`,KX[k]+(q[2]!==1?" (thưởng gốc ×"+String(q[2]).replace(".",",")+")":""),"1/"+KN.length,pn[k],pg[k]]));
  return h+`</div>`;
}
const xr=()=>S.sem?Object.values(S.sem.res).filter(r=>r.claimed):[];
const RL=[["Luyện Khí",0],["Trúc Cơ",20000],["Kim Đan",42000],["Nguyên Anh",66000],["Hóa Thần",92000],["Luyện Hư",118000],["Hợp Thể",145000],["Đại Thừa",172000],["Chân Tiên",200000]];
const END=200000,KD=119;/* END = ngưỡng vào Chân Tiên (không có trần: linh lực tăng đến hết kiếp). Kiếp chỉ kết thúc khi hết KD ngày */
const ri=x=>GameProgressData.realmIndex(x,RL);
const rname=x=>GameProgressData.realmName(x,RL);
// Thiên kiếp gắn với ngày trong kiếp (0..KD-1), không phụ thuộc học kỳ
const EX=[
 {id:"tl",n:"Trúc Cơ Lôi Kiếp",kind:"Lôi kiếp khai môn · viên mãn Luyện Khí, thăng Trúc Cơ",day:13,need:0,chuan:20000,w:0.5,a:.98,bm:2,ls:5,desc:"Tầng mây đầu tiên nổ sấm. Luyện Khí viên mãn thì lôi quang tẩy thể, dựng nền Trúc Cơ; ai chưa vững sẽ bị lôi đánh tan đạo tâm."},
 {id:"ho",n:"Kết Đan Hỏa Kiếp",kind:"Kiếp nạn lửa · viên mãn Trúc Cơ, thăng Kim Đan",day:24,need:1,chuan:42000,w:0.75,a:.96,bm:4,ls:10,desc:"Thiên hỏa giáng xuống, đốt sạch tạp niệm để kim đan thành hình. Cần đạo tâm bền và thân thể chịu được nhiệt. Thất bại để lại vết thương trên Mệnh."},
 {id:"gk",n:"Anh Biến Lôi Kiếp",kind:"Lôi kiếp phá đan hóa anh · viên mãn Kim Đan, thăng Nguyên Anh",day:36,need:2,chuan:66000,w:1,a:.94,bm:6,ls:16,desc:"Chín đạo lôi quang xoáy quanh thân, phá đan để nguyên anh xuất khiếu. Chỉ ai đã kết Kim Đan vững mới đứng được giữa trời giông."},
 {id:"tm",n:"Hóa Thần Tâm Ma Kiếp",kind:"Kiếp nạn tâm ma · viên mãn Nguyên Anh, thăng Hóa Thần",day:48,need:3,chuan:92000,w:1.25,a:.9,bm:10,ls:28,desc:"Không có sấm sét bên ngoài — chỉ có ma trong lòng. Muốn hóa thần phải vượt qua ký ức, hối hận, tham sân hiện hình. Đạo tâm yếu sẽ bị nuốt chửng."},
 {id:"hb",n:"Luyện Hư Hàn Băng Kiếp",kind:"Kiếp nạn băng giá · viên mãn Hóa Thần, thăng Luyện Hư",day:61,need:4,chuan:118000,w:1.5,a:.9,bm:10,ls:40,desc:"Thiên địa đóng băng khi Hóa Thần viên mãn muốn luyện hư nhập thực. Linh lực phải đủ dày để không bị đóng thành băng tượng."},
 {id:"ck1",n:"Hợp Thể Cửu Trọng Lôi Kiếp",kind:"Đại lôi kiếp · viên mãn Luyện Hư, thăng Hợp Thể",day:75,need:5,chuan:145000,w:1.75,a:.9,bm:10,ls:55,desc:"Chín tầng lôi kiếp liên hoàn, mỗi tầng mạnh hơn tầng trước. Chỉ Luyện Hư viên mãn mới dám nghênh chiến để hợp nhất cùng thiên địa."},
 {id:"ck2",n:"Đại Thừa Hỗn Nguyên Kiếp",kind:"Đại thiên kiếp · viên mãn Hợp Thể, thăng Đại Thừa",day:88,need:6,chuan:172000,w:2,a:.9,bm:10,ls:70,desc:"Hỗn nguyên chi khí giáng xuống, phân rõ viên mãn và nửa đường. Hợp Thể viên mãn mới đủ tư cách bước vào Đại Thừa."},
 {id:"pt",n:"Phi Thăng Kiếp",kind:"Thiên kiếp phi thăng · viên mãn Đại Thừa, thăng Chân Tiên",day:100,need:7,chuan:200000,w:2.5,a:.9,bm:10,ls:85,desc:"Chín mươi chín đạo thiên lôi, ba nghìn hỏa tai, tâm ma hiện hình cùng lúc. Chỉ Đại Thừa viên mãn với đạo tâm bất đoạn suốt cả kiếp mới bước qua được cổng trời thành Chân Tiên."}
];
const RW={"Xuất sắc":200,"Giỏi":140,"Khá":90,"Trung bình":40,"Yếu":0};
const gr=s=>GameProgressData.grade(s);
const exD=e=>GameDateData.examDate(KS().start,e.day);
const uxp=ds=>ds?GameAnalytics.pointsThrough(S.hist,ds):S.points;
const bxX=(i,x)=>{const k=Math.floor(x);if(k<0)return B[i].p;cum(i,k+1);const f=x-k,d=CD[i];return B[i].p+d[k]*(1-f)+d[k+1]*f};
/* Tu vi của NPC = đúng điểm hiện trên bảng xếp hạng (sc), để cảnh giới và linh lực luôn khớp nhau */
const bxp=(i,ms)=>sc(i,ms);
// Điểm = A·L + bm·D  (A = 100 − bm). L (0..1): phần linh lực, đầy khi linh lực ≥ chuan; D (0..1): đạo tâm = số ngày học/14.
// Đạo tâm cộng tối đa bm điểm (2 → 10, tăng dần theo độ khó của thiên kiếp, không quá 10).
const kh=(xp,e,D)=>GameProgressData.examScore(xp,e,D);
// Điểm NPC (hàm riêng, không dùng chung với người chơi): chỉ dựa vào linh lực, thang 0..100.
// Cùng đường cong L như kh() nhưng nhân 100 thay vì A, nên NPC đạt 100 khi linh lực ≥ mốc viên mãn (chuan).
const khNpc=(xp,e)=>GameProgressData.npcExamScore(xp,e);
// Chỉ hiện ở chế độ god: điều kiện để đạt 100 điểm
function exCond(e){return GameProgressData.examConditions(e,kh,rname)}
const exGod=e=>S.god?`<small style="display:block;margin-top:6px;color:var(--gold);line-height:1.5"><b>[God] Điều kiện đạt 100:</b><br>${exCond(e).join("<br>")}</small>`:"";
// Đạo tâm: số ngày (trong 14 ngày trước kiếp) có học, tính từ nhật ký HOẶC chuỗi ngày liên tiếp đang có.
const actDays=(d,cur)=>GameProgressData.activeDays(S.hist,S.streak,d,cur,today());
// Linh lực người chơi tại ngày dv: lịch sử đến ngày đó + phần linh lực không có trong nhật ký (đặt tay).
// Nếu lịch sử đã được tính hết (độ kiếp đúng hạn / hạn đã qua so với dữ liệu) thì dùng đúng linh lực hiện có.
function playerXpAt(dv){return GameProgressData.playerXpAt(S.hist,S.points,dv.toLocaleDateString("sv"))}
// Chuỗi học liên tục (số ngày liên tiếp có học) tính đến ngày d. cur: đang độ kiếp đúng hạn/bị tua → tính đến hôm nay và gộp chuỗi hiện tại (kể cả được Tục Mệnh Phù giữ).
function streakAt(d,cur){return GameProgressData.streakAt(S.hist,S.streak,d,cur,today(),dayStr(1))}
// Đạo tâm 0..1 = chuỗi / chuỗi yêu cầu của kiếp (chuỗi càng dài, kiếp càng cuối càng đòi hỏi nhiều)
const daoTam=(st,e)=>GameProgressData.taoTamProgress(st,e);
const LeaderboardSystem=GameLeaderboardSystem.create({S,B,KS,save,vlog,simulation:LeaderboardSimulation,leaderboardData:GameLeaderboardData,npcData:GameNpcData,hash:hs,getSalt:()=>KSALT,exams:EX,days:KD,examDate:exD,playerXpAt,weekStart:()=>weekStart(),myRank:myRk,warReward,bxpAt:bxX});
const {SPQ,spA,spK,spKn,spE,nextEx,spUntil,spExtra,lbRows,spRoll,spRetire,BAL_RANK,BAL_MULT,sc,lbInit,playerBalanced,settle,spark,bs,bsX,immuneTaiHu}=LeaderboardSystem;
const EXOPEN={};
const TribulationSystem=GameTribulationSystem.create({S,EX,exD,KD,KS,B,SP,sc,playerXpAt,immuneTaiHu,vlog,bxp,spKn,kh,khNpc,spE,streakAt,SPQ,ri,gr,daoTam,spRetire,save,hash:hs,getSalt:()=>KSALT,showTdLenh:()=>showTdLenh(),showExModal:e=>showExModal(e),schedule:(fn,ms)=>setTimeout(fn,ms),buildRecord:()=>buildRec(),vlog,burst,sfx,KS,setSalt:v=>{KSALT=v},weekStart,LeaderboardSimulation,LeaderboardUI,setProfileIndex:()=>{PI=null},chkLegacy,save,render,showThd:(...args)=>showThd(...args)});
function resolveEx(){TribulationSystem.resolveEx()}
function showExModal(e){
  GameExamModal.show({state:S,realmLabels:RL,exGod,save,go,render,findNext:()=>EX.find(x=>S.sem&&S.sem.res[x.id]&&!S.sem.res[x.id].seen),document,body:document.body,setTimeout},e);
}
const TribulationUI=GameTribulationUI.create({S,uxp,ri,RL,rname,KD,END,EX,exD,spA,SPQ,exGod,modGain,RW,EXOPEN,$,today,weekStart:()=>weekStart(),kmet,kAge:()=>kAge(),kEnd:()=>kEnd(),KS,bestKiep:()=>bk(),fold,doRebirth:()=>doRebirth(),say,document,Blob,URL,prompt});
function renderExams(){TribulationUI.render()}
const LeaderboardUI=GameLeaderboardUI.create({S,B,sc,lbInit,BAL_RANK,BAL_MULT,SECTS,SO,rname,uxp,bxp,spark,AVATARS,KD,$,escapeHtml:esc,portrait,isTopCultivator:i=>isTK(i),renderProfile:()=>renderProf(),getKAge:()=>kAge(),getCurStreak:()=>curStreak(),myRank:myRk,today,dayStr,recentEv,efTxt,hrs,myRk,rkNow,fmtT,hrAt,rkAt,spStatsHtml:()=>spStatsHtml()});
function renderLb(){LeaderboardUI.render()}
const rn=x=>x.qid&&sq(x)?sq(x).name:x.label;
const qm=()=>QM[$("nq").value]||1;
const rem=t=>GameTimeFormat.remaining(t,Date.now());
const expired=q=>GameQuestData.isExpired(q,isDone,Date.now());
const weekStart=()=>GameDateData.weekStart(S.dOff||0);
const sumMins=f=>GameAnalytics.sumMinutes(S.hist,f);
const evCur=p=>p==="w"?sumMins(k=>k>=weekStart()&&k<=today()):sumMins(k=>k.slice(0,7)===today().slice(0,7));
const unlocked=q=>GameQuestData.isUnlocked(S.quests,q,isDone);
const stepRow=(q,lock)=>{const d=isDone(q);return `<li class="${d?"done":""}${lock?" lock":""}"><button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành bước">${d?"✓":lock?"🔒":""}</button><div class="nm">${esc(q.name)}<small>${q.mins} phút</small></div>${!d&&!lock?`<button class="play" data-a="p" data-id="${q.id}">Học</button>`:""}<span class="pb">+${d&&q.got?q.got:q.pts}</span></li>`};
const ActivityUI=GameActivityUI.create({S,nowHM,today,tm,isDone,sq,rn,ITEMS,IC,buffTxt,TITLES,nwS,escapeHtml:esc,isExpired:q=>expired(q),isUnlocked:q=>unlocked(q),isTitleUnlocked:t=>tok(t),renderStepRow:(q,l)=>stepRow(q,l),getLQ:()=>LQ,getLP:()=>LP,lval:t=>lval(t),lpk:p=>lpk(p),getFortunes:()=>knList(),studyMinutes:o=>kmins(o),remaining:t=>rem(t),fortuneEffects:KX,dayStr,formatTime:fmtT,getCheckinRewards:()=>CI,itemIcons:IC,$});
function renderLich(){ActivityUI.renderSchedule()}
function renderShop(){ActivityUI.renderShop()}
function renderChains(){ActivityUI.renderChains()}
var FO={};
function fold(k,t,b,o){return `<details class="fold" data-k="${k}"${(FO[k]===undefined?o:FO[k])?" open":""}><summary>${t}</summary>${b}</details>`}
var KSD={};
const EventsUI=GameEventsUI.create({S,evCur,ugain,GameAnalytics,dayStr,today,KSD,weekStart:()=>weekStart(),escapeHtml:esc,$});
function renderEvents(){EventsUI.render()}
function hAdd(d,p,m){const h=S.hist[d]||(S.hist[d]={p:0,m:0});h.p=Math.max(0,h.p+p);h.m=Math.max(0,h.m+m)}
// Trừng Phạt xếp chồng: mỗi lần hết Mệnh +1 stack, −5% mỗi stack (tối đa −30%)
function tdMult(){return S.tdPenalty?Math.max(0.7,1-0.05*Math.max(1,S.tdStacks||1)):1}
function balMult(){return playerBalanced()?BAL_MULT:1}
function rewardFactors(){return GameRewards.rewardFactors({tdPenalty:S.tdPenalty,tdStacks:S.tdStacks,balanced:playerBalanced(),balMult:BAL_MULT,tm:S.tm,tma:S.tma,cbUntil:S.cbUntil},Date.now())}
function modGain(n){return GameRewards.modGain(n,rewardFactors())}
function eventGain(n){const r=GameRewards.eventGain(n,S.tcCharges,rewardFactors());S.tcCharges=r.charges;if(r.exhausted)extra+=" Thiên Cơ Lệnh đã dùng hết 4 lần.";return r.gain}
function addPts(n,mins,day){
  const before=ri(S.points||0);
  const g=modGain(n);if(!g&&!mins)return 0;
  S.points+=g;hAdd(day||today(),g,mins||0);
  const after=ri(S.points||0);
  if(after>before){try{onRealmUp(before,after);}catch(e){}}
  return g;
}
function showTdLenh(){
  const name=S.name||"đạo hữu",st=Math.max(1,S.tdStacks||1),pct=Math.min(30,5*st);
  $("thd").innerHTML=`<div class="box" style="border-color:var(--red)"><h2>Thiên Đạo Lệnh Bảng</h2>
    <small>Thiên chỉ · Lần thứ ${st}</small>
    <p style="margin:12px 0;line-height:1.6">${name}. Tên đã được đọc. Không có lý do nào khác.</p>
    <p style="margin:10px 0;line-height:1.6">Mệnh cạn không do ai rút. Nó chảy hết vì không có gì chắn. Thiên kiếp đến, gục. Thiên kiếp lại đến, gục. Xác thân còn đứng, linh căn đã tắt.</p>
    <p style="margin:10px 0;line-height:1.6">Cán cân nghiêng thì Thiên Đạo ghi lại. Không giận, không thương. <b>Thiên Đạo Trừng Phạt</b> áp xuống (chồng lần ${st}):</p>
    <p style="margin:10px 0;line-height:1.6">• Mọi nguồn linh lực thu về bị bớt <b>${pct}%</b> (mỗi lần Mệnh cạn thêm 5%, tối đa 30%).<br>• Gục thêm một lần, Mệnh mất thêm một phần. Không ai đếm hộ.<br>• Mệnh nằm ở 0 cho đến khi tự đứng dậy.</p>
    <p style="margin:10px 0;line-height:1.6">Điều kiện gỡ: một kiếp <b>viên mãn</b>, mọi thiên kiếp từ <b>Khá</b> trở lên. Không có đường tắt. Không có ngoại lệ.</p>
    <p style="margin:12px 0;font-style:italic;color:var(--mute)">Cửa không đóng. Cũng không có ai đứng chờ ở cửa.</p>
    <div class="row"><button class="btn" style="margin-left:0" id="thx">Kính tuân</button></div>
  </div>`;
  $("thd").hidden=false;
  $("thx").onclick=()=>{$("thd").hidden=true};
}
const dayStr=o=>GameDateData.dayOffset(S.dOff||0,o);
const dur=()=>Math.min(480,Math.max(5,parseInt($("nd").value)||0));
const calc=()=>Math.max(1,Math.round(dur()/60*S.perHour*parseFloat($("nl").value)*qm()));
function finish(q){
  return GameQuestCompletion.finish(q, {
    S, today, dayStr, GameTimer, GameStreak, KS,
    extraGet:()=>extra, extraSet:value=>{extra=value;}, vlog, TB, LS, petBuff,
    GameRewards, eqT, rewardFactors, hourNow, ITEMS, myRk, hAdd, rname, uxp, isDone
  });
}
function startFocus(q){
  if(!GameTimer.startFocus(q,q.mins*60000)){say("Đang có một phiên học. Hãy hủy hoặc chờ xong.");return}
  say("Bắt đầu học: "+q.name);render();
}
const MapUI=GameMapUI.create({S,SECTS,escapeHtml:esc,rank:()=>myRk(),navigate:(...args)=>go(...args),render:()=>render(),$});
function renderMap(){MapUI.render()}
const LoreUI=GameLoreUI.create({SECTS,$});
function renderLore(){LoreUI.render()}
function renderMore(){
  renderChains();renderEvents();renderLich();renderShop();renderLb();renderExams();renderVan();renderSect();renderStats();renderLenh();renderHero();renderKn();renderLore();renderMap();renderGod();renderDiary();renderAch();chkLegacy();renderX();
  $("prev").textContent="= "+calc()+" linh lực";
  if(document.activeElement!==$("ph"))$("ph").value=S.perHour;
  const focusTask=GameTimer.activeFocus();$("focus").hidden=!focusTask;if(focusTask)$("fn").textContent=focusTask.name;
  $("st").textContent=(S.streak.last===today()||S.streak.last===dayStr(1))?S.streak.n:0;
  const th=S.hist[today()]||{p:0,m:0};
  $("sm").textContent=th.m+" phút";
  let tot=0;for(const k in S.hist)tot+=S.hist[k].m;
  $("sa").textContent="Tổng: "+Math.floor(tot/60)+" giờ "+tot%60+" phút";
  const days=[6,5,4,3,2,1,0].map(o=>{const d=dayStr(o);return {d,p:(S.hist[d]||{p:0}).p}});
  const mx=Math.max(10,...days.map(x=>x.p));
  $("bars").innerHTML=days.map(x=>`<div><span>${x.p}</span><i style="height:${Math.round(x.p/mx*80)}px"></i><span>${x.d.slice(8)}</span></div>`).join("");
  nwUpdate();
}

function render(){
  lbInit();settle();resolveEx();brk();chkT();
  if(S.exLock&&S.sem&&S.sem.res[S.exLock]&&!S.sem.res[S.exLock].seen&&$("thd").hidden){const e=EX.find(x=>x.id===S.exLock);if(e)showExModal(e)}
  if(kEnd()&&!S.thdAsk&&$("thd").hidden&&!S.exLock){S.thdAsk=1;showThd(buildRec(),1)}
  $("pts").textContent=S.points;
  $("today").textContent="Hôm nay: +"+(S.hist[today()]||{p:0}).p+" linh lực"+(TITLES.some(t=>t.id===S.title&&tok(t))?", danh hiệu "+TITLES.find(t=>t.id===S.title).n:"");
  $("gt").textContent=$("gt2").textContent=fmt(S.gameSec);
  $("run").textContent=GameTimer.isPlaying()?"Tạm dừng":"Khai mở nhàn hạ";
  if(document.activeElement!==$("rate"))$("rate").value=S.rate;
  const m=Math.max(0,parseInt($("mins").value)||0);
  $("cost").textContent="Cần "+LC(m)+" linh lực, tu vi giảm tương ứng";
  const qs=S.quests.filter(x=>!x.chain).sort((a,b)=>(isDone(a)||expired(a))-(isDone(b)||expired(b)));
  $("list").innerHTML=qs.length?qs.map(q=>{const d=isDone(q);
    return `<li class="${d?"done":expired(q)?"exp":""}"><button class="tick" data-a="t" data-id="${q.id}" aria-label="${d?"Bỏ hoàn thành":"Hoàn thành"}">${d?"✓":""}</button><div class="nm">${esc(q.name)}<small>${[q.due&&!d?(expired(q)?"hết hạn":"nhanh, còn "+rem(q.due)):"",q.mins?q.mins+" phút":"",q.repeat?"lặp lại mỗi ngày":""].filter(Boolean).join(", ")}</small></div>${!d&&q.mins&&!expired(q)?`<button class="play" data-a="p" data-id="${q.id}">Học</button>`:""}${expired(q)?`<button class="play" data-a="rn" data-id="${q.id}">Tạo lại</button>`:""}<span class="pb">+${d&&q.got?q.got:q.pts}</span><button class="del" data-a="d" data-id="${q.id}" aria-label="Xóa nhiệm vụ">×</button></li>`}).join("")
    :`<li class="empty" style="display:block">Chưa có nhiệm vụ. Thêm việc học đầu tiên ở phía trên.</li>`;
  renderMore();
}

function addQuest(){
  const name=$("nm").value.trim();
  const mins=dur(),pts=calc();
  if(!name){say("Hãy nhập tên nhiệm vụ.");$("nm").focus();return}
  const qv=$("nq").value,due=qv===""?0:(qv==="0"?new Date().setHours(23,59,59,999):Date.now()+qv*3600000);
  S.quests.push({id:Date.now().toString(36),name,pts,mins,due,repeat:qv===""&&$("nr").checked,doneOn:null});
  $("nm").value="";say("Đã thêm nhiệm vụ.");save();render();
}

$("add").onclick=addQuest;
$("nm").onkeydown=e=>{if(e.key==="Enter")addQuest()};



const parseDiff=s=>GameQuestData.parseDiff(s);
function parseBulkLine(line){return GameQuestData.parseBulkLine(line,{perHour:S.perHour||200,now:Date.now,random:Math.random})}
function importBulkQuests(){
  const raw=$("qbulk").value||"";
  const lines=raw.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith("#")&&!s.startsWith("//"));
  if(!lines.length){say("Chưa có dòng nào để nhập.");return}
  const added=[];
  lines.forEach(l=>{const q=parseBulkLine(l);if(q){S.quests.push(q);added.push(q.name)}});
  if(!added.length){say("Không đọc được nhiệm vụ. Kiểm tra mẫu: Tên | phút");return}
  $("qbulk").value="";
  if($("qbulkhint"))$("qbulkhint").textContent="Đã nhập "+added.length+" nhiệm vụ.";
  save();render();say("Đã nhập "+added.length+" nhiệm vụ từ bộ dán.");
}
function exportQuestsText(){
  const qs=S.quests.filter(x=>!x.chain&&!isDone(x)&&!expired(x));
  if(!qs.length){say("Không có nhiệm vụ đang mở để xuất.");return}
  const text=qs.map(q=>{
    const diff=q.diff||1;
    const lim=q.due?(q.due-Date.now()<2*3600000?"1":q.due-Date.now()<4*3600000?"3":"homnay"):"";
    return [q.name,q.mins||30,diff,q.repeat?1:0,lim].join(" | ");
  }).join("\n");
  $("qbulk").value=text;
  try{navigator.clipboard.writeText(text)}catch(e){}
  if($("qbulkhint"))$("qbulkhint").textContent="Đã xuất "+qs.length+" nhiệm vụ (cũng đã chép nếu trình duyệt cho phép).";
  say("Đã xuất "+qs.length+" nhiệm vụ ra ô dán.");
}

$("qbulkin").onclick=importBulkQuests;
const cpy=(t,m)=>{const ok=()=>say(m||"Đã chép prompt AI. Dán vào ChatGPT/Claude, điền các mục [ ], rồi dán kết quả vào app.");
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,()=>fb());else fb();
  function fb(){const a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();let r=false;try{r=document.execCommand("copy")}catch(e){}a.remove();say(r?(m||"Đã chép prompt AI."):"Trình duyệt chặn chép. Hãy thử lại hoặc dùng HTTPS.")}};
$("qbulkcp").onclick=()=>cpy(AI_PROMPT);
$("ccp").onclick=()=>cpy(CHAIN_PROMPT);
$("lcp").onclick=()=>cpy(SCHED_PROMPT);
function importSched(){
  const day=S.sched[today()]||(S.sched[today()]=[]);let n=0,bad=0;
  ($("lbulk").value||"").split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith("#")).forEach(l=>{
    const slot=GameScheduleData.parseLine(l,day);if(!slot){bad++;return}
    const q=S.quests.find(x=>x.name===slot.label&&!isDone(x)&&!expired(x)&&(!x.chain||unlocked(x)));
    day.push({id:"s"+Date.now().toString(36)+n,s:hm(slot.start),e:hm(slot.end),qid:q?q.id:"",label:slot.label});n++});
  if(n){$("lbulk").value="";save();render()}
  say(n?("Đã nhập "+n+" khung"+(bad?", bỏ "+bad+" dòng lỗi/trùng giờ":"")+"."):"Không đọc được dòng nào. Mẫu: 19:00-19:45 | Tên việc");
}
$("lin").onclick=importSched;

function addDefQ(){let n=0;DEF_Q.split("\n").forEach(l=>{const q=parseBulkLine(l);if(!q||S.quests.some(x=>x.name===q.name&&!isDone(x)))return;S.quests.push(q);n++});return n}
$("qdef").onclick=()=>{const n=addDefQ();if(n){save();render()}say(n?"Đã thêm "+n+" nhiệm vụ mặc định.":"Nhiệm vụ mặc định đã có sẵn trong danh sách.")};

$("cdef").onclick=()=>{let n=0;DEF_C.forEach(([nm,st],k)=>{if(S.chains.some(c=>c.name===nm))return;const id="c"+Date.now().toString(36)+"d"+k;S.chains.push({id,name:nm,paid:false,bonus:0});st.forEach((l,i)=>{const [a,m]=l.split("|"),mins=+m;S.quests.push({id:id+i,name:a.trim(),pts:Math.max(1,Math.round(mins/60*S.perHour)),mins,chain:id,doneOn:null})});n++});if(n){save();render()}say(n?"Đã thêm "+n+" chuỗi mẫu.":"Các chuỗi mẫu đã có rồi.")};

$("ldef").onclick=()=>{addDefQ();save();render();$("lbulk").value=DEF_S;importSched()};
{const cut=new Date(Date.now()-30*864e5).toLocaleDateString("sv");Object.keys(S.sched||{}).forEach(k=>{if(k<cut)delete S.sched[k]})}
let _ud=null,_ut=0;
$("und").onclick=()=>{if(_ud){S.quests.push(_ud);_ud=null;$("und").hidden=true;save();render();say("Đã khôi phục nhiệm vụ.")}};
$("list").addEventListener("click",e=>{const n=e.target.closest(".nm");if(!n||e.target.closest("button"))return;
  const li=n.closest("li"),id=li&&li.querySelector("[data-id]")&&li.querySelector("[data-id]").dataset.id,q=S.quests.find(x=>x.id===id);
  if(!q||isDone(q)||q.chain)return;
  const v=prompt("Sửa nhiệm vụ: Tên | phút",q.name+" | "+(q.mins||30));if(v==null)return;
  const p=v.split("|"),nm=(p[0]||"").trim().slice(0,80);if(!nm)return;
  const mi=Math.min(480,Math.max(5,parseInt(p[1])||q.mins||30));
  q.name=nm;q.mins=mi;q.pts=Math.max(1,Math.round(mi/60*S.perHour*(q.diff||1)));save();render();say("Đã sửa nhiệm vụ.")});
$("qbulkex").onclick=exportQuestsText;
$("qbulkmix").onclick=()=>{
  $("qbulk").value=PRESET_MIX;
  if($("qbulkhint"))$("qbulkhint").textContent="Đã nạp 21 nhiệm vụ mẫu (VSTEP + Code + NCKH + môn khác). Sửa nếu cần rồi bấm Nhập bộ nhiệm vụ.";
  say("Đã nạp bộ VSTEP + Code + NCKH vào ô dán. Bấm Nhập để thêm vào danh sách.");
};
$("list").onclick=$("chains").onclick=$("slots").onclick=$("now").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.a==="ld"){S.sched[today()]=(S.sched[today()]||[]).filter(x=>x.id!==b.dataset.id);save();render();return}
  if(b.dataset.a==="cd"){S.chains=S.chains.filter(c=>c.id!==b.dataset.id);S.quests=S.quests.filter(x=>x.chain!==b.dataset.id);save();render();say("Đã xóa chuỗi.");return}
  const q=S.quests.find(x=>x.id===b.dataset.id);if(!q)return;
  if(b.dataset.a!=="d"&&b.dataset.a!=="rn"){
    if(q.chain&&!isDone(q)&&!unlocked(q)){say("Hãy hoàn thành bước trước.");return}
    if(q.chain&&isDone(q)){say("Bước của chuỗi không thể hoàn tác.");return}
    if(expired(q)){say("Nhiệm vụ nhanh đã hết hạn. Hãy xóa hoặc tạo lại.");return}
  }
  if(b.dataset.a==="rn"){q.due=0;q.pts=Math.max(1,Math.round((q.mins||30)/60*S.perHour*(q.diff||1)));save();render();say("Đã tạo lại, không còn hạn.");return}
  if(b.dataset.a==="d"){if(GameTimer.activeFocus()===q)GameTimer.cancelFocus();S.quests=S.quests.filter(x=>x!==q);if(!q.chain){_ud=q;$("und").hidden=false;clearTimeout(_ut);_ut=setTimeout(()=>{$("und").hidden=true;_ud=null},8000)}say("Đã xóa nhiệm vụ.")}
  else if(b.dataset.a==="p"){startFocus(q);return}
  else if(isDone(q)){const g=q.got||q.pts;S.points=Math.max(0,S.points-g);hAdd(q.doneOn,-g,-(q.mins||0));if(S.cnt&&S.cnt[q.doneOn]>0)S.cnt[q.doneOn]--;q.doneOn=null;q.got=0;say("Đã bỏ hoàn thành, trừ "+g+" linh lực.")}
  else{finish(q);say("Hoàn thành! +"+q.got+" linh lực"+(q.got>q.pts?" (có thưởng chuỗi ngày học)":"")+".")}
  save();render();
};


$("rate").oninput=()=>{const v=parseInt($("rate").value);if(v>=1){S.rate=Math.min(500,v);save();render()}};
$("mins").oninput=render;
document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{$("mins").value=b.dataset.m;render()});
$("buy").onclick=()=>{
  const m=parseInt($("mins").value)||0;if(m<1){say("Nhập số phút muốn đổi.");return}
  const cost=LC(m);
  if(S.points<cost){say("Chưa đủ linh lực: cần "+cost+", bạn có "+S.points+". Làm thêm nhiệm vụ nhé.");return}
  S.points-=cost;const bo=(S.lt||0)+(petBuff().mn||0)+(eqT("n13")?5:0);S.sl=0;S.lt=0;S.gameSec+=(m+bo)*60;LS().lv=(LS().lv||0)+m;save();render();say("Đã đổi "+cost+" linh lực lấy "+m+(bo?" (+"+bo+")":"")+" phút chơi.");
};
$("run").onclick=()=>{
  if(!GameTimer.isPlaying()&&S.gameSec<=0){say("Chưa có giờ chơi. Hãy đổi linh lực trước.");return}
  const playing=GameTimer.togglePlay(S.gameSec);say(playing?"Đang tính giờ chơi.":"Đã tạm dừng.");render();
};
setInterval(()=>{
  if(!GameTimer.isPlaying())return;
  const tick=GameTimer.tickPlay(S.gameSec);if(tick.elapsed<1)return;
  S.gameSec=tick.remaining;
  if(tick.ended)say("Hết giờ chơi. Quay lại làm nhiệm vụ nhé.");
  save();render();
},500);
setInterval(()=>{
  const q=GameTimer.activeFocus();if(!q)return;
  if(!S.quests.includes(q)){GameTimer.cancelFocus();render();return}
  const left=GameTimer.focusRemaining();
  if(left<=0){GameTimer.cancelFocus();finish(q);save();render();say("Học xong "+q.mins+" phút! +"+q.got+" linh lực"+(q.got>q.pts?" (đã gồm thưởng chuỗi ngày học)":"")+".");return}
  $("ft").textContent=fmt(left);
},500);
$("fx").onclick=()=>{GameTimer.cancelFocus();say("Đã hủy phiên học, không tính linh lực.");render()};
$("nd").oninput=$("nl").onchange=$("nq").onchange=renderMore;
$("ladd").onclick=()=>{
  const s=$("ls").value,e=$("le").value,qid=$("lq").value,q=S.quests.find(x=>x.id===qid),label=q?q.name:$("ll").value.trim();
  if(!s||!e||s>=e||!label){say("Chọn giờ bắt đầu trước giờ kết thúc, và một nhiệm vụ hoặc tên việc.");return}
  const dd=S.sched[today()]||(S.sched[today()]=[]),ov=dd.find(x=>s<x.e&&e>x.s);
  if(ov){say("Trùng khung "+ov.s+" - "+ov.e+" ("+rn(ov)+"). Hãy chọn giờ khác.");return}
  dd.push({id:"s"+Date.now().toString(36),s,e,qid,label});
  $("ll").value="";save();render();say("Đã thêm vào lịch.");
};
$("lauto").onclick=()=>{
  const cand=S.quests.filter(q=>!isDone(q)&&!expired(q)&&q.mins&&(!q.chain||unlocked(q))).sort((a,b)=>(a.due||9e15)-(b.due||9e15));
  const day=S.sched[today()]||(S.sched[today()]=[]),have=new Set(day.map(x=>x.qid));
  let t=Math.ceil(tm(nowHM())/15)*15,n=0;
  for(const q of cand){
    if(have.has(q.id))continue;
    const len=Math.min(q.mins,120);
    for(let i=0;i<50;i++){const bad=day.find(x=>t<tm(x.e)&&t+len>tm(x.s));if(!bad)break;t=tm(bad.e)}
    if(t+len>1320)break;
    day.push({id:"s"+Date.now().toString(36)+n++,s:hm(t),e:hm(t+len),qid:q.id,label:q.name});t+=len+10;
  }
  save();render();say(n?"Đã xếp "+n+" nhiệm vụ vào lịch hôm nay.":"Không còn khung giờ hoặc nhiệm vụ để xếp.");
};
document.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>{
  const k=b.dataset.plan;
  if(S.chains.some(c=>c.name===PN[k])){say("Bạn đã có chuỗi này rồi.");return}
  const id="c"+Date.now().toString(36)+k;
  S.chains.push({id,name:PN[k],paid:false,bonus:0});
  PLAN[k].forEach((l,i)=>{const [n,m]=l.split("|"),mins=+m;S.quests.push({id:id+i,name:"Tuần "+(i+1)+": "+n,pts:Math.max(1,Math.round(mins/60*S.perHour)),mins,chain:id,doneOn:null})});
  save();render();say("Đã tạo chuỗi 15 tuần ở bên dưới.");
});
setInterval(()=>{if(!$("b").hidden)renderLb()},1000);
setInterval(()=>{if(!$("v").hidden)renderVan()},3000);
setInterval(()=>{if(!$("z").hidden)renderSect()},3000);
const RC=GameCultivationDisplayData.realmColors, QT=GameCultivationDisplayData.quotes;
function renderHero(){ProfileUI.renderHero()}
const KT0=GameFortuneData.epoch, KN=GameFortuneData.events, KX=GameFortuneData.effects;
function knAt(h){
  if(!S.seed)S.seed=1+Math.floor(Math.random()*1e9);
  return GameKiepNanData.create(S.seed,h,KT0,KN,hs);
}
function grantPet(prefer){
  const P=S.pets||(S.pets={});
  const avail=PS.filter(p=>!P[p.id]);
  if(!avail.length)return null;
  let p=prefer?PS.find(x=>x.id===prefer&&!P[x.id]):null;
  if(!p)p=avail[Math.floor(Math.random()*avail.length)];
  if(!p)return null;
  P[p.id]={lv:1,t:Date.now()};nwS().p[p.id]=1;
  if(!S.act)S.act=p.id;
  const prize={id:p.id,n:petRank(p,1),base:p.n,p};S.petReveal={id:p.id,n:prize.n,base:p.n,e:p.e(1),d:p.d};
  return prize;
}
const kmins=o=>GameAnalytics.sumStudyMinutesBetween(S.stl,o.st,o.en);
function knList(){const now=Date.now(),h0=Math.floor((now-KT0)/36e5),L=[];for(let h=h0-14;h<=h0;h++){const o=knAt(h);if(o&&o.st<=now&&now-o.en<6*36e5)L.push(o)}return L.reverse()}function renderKn(){ActivityUI.renderFortunes()}
function claimKn(h){
  const o=knAt(h),ck="o:"+h;if(!o||S.claimed[ck]||kmins(o)<o.T)return;
  S.claimed[ck]=1;const op=eventGain(o.pts);S.points+=op;hAdd(today(),op,0);
  let extraPet="";
  if(o.k===1)S.inv.ca=(S.inv.ca||0)+1;
  else if(o.k===3)S.inv.bm=(S.inv.bm||0)+1;
  else if(o.k===4)hAdd(today(),80,0);
  else if(o.k===2){if(S.buff.n>0)addPts(20);else S.buff={n:3,m:1.3}}
  else if(o.k===5){const pet=grantPet();if(pet){extraPet=" · Linh thú xuất hiện: "+pet.n+"!";vlog("Nhận linh thú từ kỳ ngộ: "+pet.n)}}
  // Kỳ ngộ dài (≥90 phút) có thêm cơ hội nhỏ nhận linh thú
  if(o.k!==5&&o.T>=90&&Math.random()<0.18){const pet=grantPet();if(pet){extraPet=" · Kỳ ngộ ban thêm linh thú: "+pet.n+"!";vlog("Nhận linh thú từ kỳ ngộ: "+pet.n)}}
  vlog("Kỳ ngộ "+o.name+": +"+op+" linh lực");save();render();say("Kỳ ngộ "+o.name+": +"+op+" linh lực, "+KX[o.k]+extraPet+".");
}
const CI=[[10],[15],[20,"ca"],[30],[40,"bm"],[60],[120,"the"]];
function checkin(){
  const c=S.ci||(S.ci={last:"",n:0}),T=today();if(c.last===T)return;
  c.n=c.last===dayStr(1)?c.n%7+1:1;c.last=T;const r=CI[c.n-1],rr=modGain(r[0]+(eqT("n16")?15:0));
  S.points+=rr;hAdd(T,rr,0);if(r[1])S.inv[r[1]]=(S.inv[r[1]]||0)+1;
  let petMsg="";
  if(c.n===7&&Math.random()<0.35){const pet=grantPet();if(pet){petMsg=" · Điểm danh tròn tuần, linh thú theo về: "+pet.n+"!";vlog("Nhận linh thú từ điểm danh: "+pet.n)}}
  vlog("Điểm danh ngày "+c.n+": +"+rr+" linh lực");save();render();say("Điểm danh ngày "+c.n+": +"+rr+" linh lực"+(r[1]?" và 1 "+ITEMS.find(i=>i.id===r[1]).n:"")+petMsg+".");
}
$("kn").onclick=e=>{nwSeenK();const k=e.target.closest("[data-a=kc]");if(k&&!k.disabled)claimKn(+k.dataset.id)};
$("tpl").onclick=e=>{const b=e.target.closest("[data-tn]");if(!b)return;$("nm").value=b.dataset.tn;$("nd").value=b.dataset.tm;renderMore()};
let SPD=7,SMT="p";
const StatsUI=GameStatisticsUI.create({S,$,today,dayStr,GameAnalytics,GameTimeFormat,fold,uxp,ri,RL,rname,EX,exD,getKD:()=>KD,getKAge:()=>kAge(),bestKiep:()=>bk()});
function renderStats(){StatsUI.render()}
$("stats").onclick=e=>StatsUI.handleClick(e);
const LQ=[
 {id:"d1",n:"Nhật Khóa Tu Luyện",per:"d",met:"m",tg:60,r:20,desc:"Học đủ 60 phút trong ngày"},
 {id:"d2",n:"Dạ Độc Kinh Thư",per:"d",met:"m",tg:120,r:45,desc:"Học đủ 120 phút trong ngày"},
 {id:"d3",n:"Trảm Yêu Trừ Ma",per:"d",met:"c",tg:3,r:25,desc:"Hoàn thành 3 nhiệm vụ trong ngày"},
 {id:"d4",n:"Nhật Nhật Tinh Tiến",per:"d",met:"p",tg:150,r:30,desc:"Kiếm 150 linh lực trong ngày"},
 {id:"w1",n:"Chu Thiên Vận Chuyển",per:"w",met:"m",tg:360,r:80,desc:"Học đủ 6 giờ trong tuần"},
 {id:"w2",n:"Ngũ Nhật Bất Đoạn",per:"w",met:"d",tg:5,r:100,desc:"Học ít nhất 30 phút trong 5 ngày khác nhau"},
 {id:"w3",n:"Phá Quan Thập Tướng",per:"w",met:"c",tg:10,r:90,it:"bm",desc:"Hoàn thành 10 nhiệm vụ trong tuần"},
 {id:"m1",n:"Nguyệt Quan Đại Điển",per:"m",met:"m",tg:1800,r:300,it:"the",desc:"Học đủ 30 giờ trong tháng"},
 {id:"m2",n:"Nhị Thập Nhật Khổ Tu",per:"m",met:"d",tg:20,r:350,desc:"Học ít nhất 30 phút trong 20 ngày khác nhau"},
 {id:"m3",n:"Bách Chiến Bách Thắng",per:"m",met:"c",tg:60,r:300,desc:"Hoàn thành 60 nhiệm vụ trong tháng"}
];
const LP={d:["Nhật khóa","Làm mới mỗi ngày"],w:["Tuần khóa","Làm mới mỗi thứ Hai"],m:["Nguyệt khóa","Làm mới mỗi tháng"]};
const lpk=p=>GameDateData.periodKey(p,today(),weekStart());
function lval(t){return GameAnalytics.questProgress(S.hist,S.cnt,t,today(),weekStart())}
function renderLenh(){ActivityUI.renderDailyMissions()}
$("lenh").onclick=e=>{
  const k=e.target.closest("[data-a=kc],[data-a=ci]");if(k&&!k.disabled){if(k.dataset.a==="kc")claimKn(+k.dataset.id);else checkin();return}
  const b=e.target.closest("[data-a=lc]");if(!b||b.disabled)return;
  const t=LQ.find(x=>x.id===b.dataset.id),ck="q:"+t.id+":"+lpk(t.per);
  if(S.claimed[ck]||lval(t)<t.tg)return;
  S.claimed[ck]=1;const rr=eventGain(evB(t.r));S.eb=0;S.points+=rr;hAdd(today(),rr,0);if(t.it)S.inv[t.it]=(S.inv[t.it]||0)+1;
  save();render();say("Hoàn thành "+t.n+": +"+rr+" linh lực"+(t.it?" và 1 "+ITEMS.find(i=>i.id===t.it).n:"")+".");
};
$("lb").onclick=e=>{const li=e.target.closest("li[data-pi]");if(!li)return;PI=+li.dataset.pi;renderProf();$("prof").scrollIntoView({behavior:"smooth",block:"nearest"})};
$("prof").onclick=e=>{if(e.target.closest("[data-a=pc]")){PI=null;renderProf()}};
$("lball").onclick=()=>LeaderboardUI.toggleAll();
$("sect").onclick=e=>{
  const sm=e.target.closest("[data-a=sm]");if(sm&&!sm.disabled){claimSectM(sm.dataset.id);return}
  const un=e.target.closest("[data-a=unbai]");
  if(un&&S.sect!=null){S.master=null;vlog("Hủy bái sư");save();render();say("Đã hủy bái sư. Buff sư phụ không còn hiệu lực.");return}
  const bai=e.target.closest("[data-a=bai]");
  if(bai&&!bai.disabled&&S.sect!=null){
    const M=MASTERS[S.sect];
    if(!M.ok()){say("Chưa đủ điều kiện: "+M.okTxt());return}
    S.master=S.sect;vlog("Bái sư: "+M.n+" ("+SECTS[S.sect].n+")");save();render();say("Đã bái sư "+M.n+". "+M.buff);return;
  }
  const b=e.target.closest("[data-a=sj]");if(!b)return;
  const s=+b.dataset.id;
  if(S.sect!=null){if(S.points<100){say("Cần 100 linh lực để chuyển tông môn.");return}S.points-=100}
  S.sect=s;S.master=null;vlog("Gia nhập "+SECTS[s].n);save();render();say("Đã gia nhập "+SECTS[s].n+". Có thể bái sư trong tông.");
};
/* Học kỳ bắt đầu đã bị gỡ — thiên kiếp gắn với ngày trong kiếp */
$("exams").onclick=e=>{
  const xl=e.target.closest("[data-a=xl]");
  if(xl){const id=xl.dataset.id,ul=xl.parentNode.querySelector("ul.exl");EXOPEN[id]=!EXOPEN[id];if(ul)ul.classList.toggle("open",!!EXOPEN[id]);const n=ul?ul.children.length:0;xl.textContent=EXOPEN[id]?"Thu gọn":"Xem đủ "+n+" người";return}
  const m=e.target.closest("[data-a=xm]"),c=e.target.closest("[data-a=xc]");
  if(m){if(!S.tma){if(S.sh)S.sh=0;else if(Math.random()<0.5){S.tma=1;S.tmaTasks=0;}}const ex=EX.find(z=>z.id===m.dataset.id),ee=spE(ex,(S.sp&&S.sp.ex===ex.id)?S.sp.k:-1),s=kh(uxp(),ee,daoTam(streakAt(new Date(),true),ee));save();render();say("Diễn kiếp "+ex.n+": "+s+" điểm ("+gr(s)+"). "+(ri(uxp()/(ee!==ex?SPQ[2].f:1))>=ex.need?"Đủ tu vi độ kiếp.":"Chưa đủ tu vi."));return}
  if(!c)return;
  const ex=EX.find(z=>z.id===c.dataset.id),r=S.sem.res[ex.id];
  if(!r||r.claimed)return;const me=r.rows.find(z=>z.u);if(!me.ok)return;
  const had=new Set(TITLES.filter(t=>tok(t)).map(t=>t.id)),pts=eventGain(RW[me.g]*ex.w);
  r.claimed=true;S.points+=pts;hAdd(today(),pts,0);
  if(me.g==="Xuất sắc")S.inv.bm=(S.inv.bm||0)+1;
  const nt=TITLES.filter(t=>tok(t)&&!had.has(t.id)).map(t=>t.n);
  save();render();say("Nhận thưởng "+ex.n+": +"+pts+" linh lực"+(me.g==="Xuất sắc"?" và 1 Tích Cốc Đan":"")+".");
};
$("k").onclick=$("i").onclick=e=>{
  const b=e.target.closest("[data-a]");if(!b||b.disabled)return;
  const a=b.dataset.a,id=b.dataset.id,it=ITEMS.find(x=>x.id===id);
  if(a==="buy"&&it){const bought=S.dailyBought[today()]||(S.dailyBought[today()]=[]);if(bought.includes(id)){say("Vật phẩm này đã mua hôm nay; ngày mai có thể mua lại.");return}if(S.points<it.c){say("Chưa đủ linh lực.");return}S.points=S.points-it.c+(petBuff().rf||0);S.inv[id]=(S.inv[id]||0)+1;bought.push(id);say("Đã mua "+it.n+".")}
  else if(a==="use"&&it&&S.inv[id]){useItem(id,it)}
  else if(a==="eq"){const t=TITLES.find(x=>x.id===id);if(!t||!tok(t))return;S.title=S.title===id?"":id;if(S.nw&&S.nw.t)delete S.nw.t[id];say(S.title?"Đã đeo danh hiệu "+t.n+".":"Đã gỡ danh hiệu.")}
  else return;
  save();render();
};
$("cadd").onclick=()=>{
  let raw=$("cs").value.split("\n").map(s=>s.trim()).filter(Boolean);
  const mt=raw.length&&raw[0].match(/^t[êe]n chu[ỗo]i\s*:\s*(.+)/i);
  if(mt){if(!$("cn").value.trim())$("cn").value=mt[1].slice(0,60);raw=raw.slice(1)}
  const name=$("cn").value.trim();
  const lines=raw.filter(l=>!l.startsWith("#")).slice(0,15);
  if(!name||lines.length<2){say("Cần tên chuỗi và ít nhất 2 bước, mỗi bước một dòng.");return}
  const id="c"+Date.now().toString(36);
  S.chains.push({id,name,paid:false,bonus:0});
  lines.forEach((l,i)=>{const [n,m]=l.split("|");if(!n.trim())return;const mins=Math.min(480,Math.max(5,parseInt(m)||30));S.quests.push({id:id+i,name:n.trim().slice(0,80),pts:Math.max(1,Math.round(mins/60*S.perHour)),mins,chain:id,doneOn:null})});
  $("cn").value=$("cs").value="";save();render();say("Đã tạo chuỗi "+lines.length+" bước.");
};
$("events").oninput=e=>{if(e.target.dataset.kd)KSD[e.target.dataset.kd]=e.target.value;const t=e.target,v=parseInt(t.value);if(S.god&&t.dataset.f&&v>=1){S.ev[t.dataset.p][t.dataset.f]=Math.min(9999,v);save()}};
$("events").onchange=render;
$("events").onclick=e=>{
  const ga=e.target.closest("[data-a=kadd],[data-a=kdel],[data-a=ked],[data-a=kreset]");
  if(ga&&S.god){const a=ga.dataset.a,id=ga.dataset.id;S.ks=S.ks||[];S.kso=S.kso||{};
    if(a==="kadd"){const n=(KSD.n||"").trim().slice(0,40);if(!n){say("Hãy nhập tên kỳ sự.");return}
      S.ks.push({id:"k"+Date.now().toString(36),n,desc:(KSD.d||"").trim().slice(0,120),met:KSD.m||"c",tg:Math.min(9999,Math.max(1,parseInt(KSD.t)||5)),r:Math.min(9999,Math.max(1,parseInt(KSD.r)||60)),per:KSD.p||"w"});
      KSD={};vlog("Thiên Đạo: thêm kỳ sự "+n);say("Đã thêm kỳ sự.")}
    else if(a==="kdel"){S.ks=S.ks.filter(x=>x.id!==id);say("Đã xóa kỳ sự.")}
    else if(a==="kreset"){delete S.kso[id];say("Đã khôi phục bản gốc.")}
    else{const d=ga.dataset,cu=d.c==="1",v=prompt("Sửa kỳ sự: Tên | thưởng | mô tả"+(cu?" | mục tiêu":""),d.n+" | "+d.r+" | "+d.d+(cu?" | "+d.tg:""));if(v==null)return;
      const p=v.split("|").map(x=>x.trim()),n=(p[0]||"").slice(0,40),r=Math.min(9999,Math.max(1,parseInt(p[1])||+d.r)),ds=(p[2]||"").slice(0,120);if(!n)return;
      if(cu){const c=S.ks.find(x=>x.id===id);if(c){c.n=n;c.r=r;c.desc=ds;c.tg=Math.min(9999,Math.max(1,parseInt(p[3])||c.tg))}}else S.kso[id]={n,r,desc:ds};
      say("Đã sửa kỳ sự.")}
    save();render();return}
  const xs=e.target.closest("[data-a=xs]");
  if(xs&&!xs.disabled){
    const ck=xs.dataset.ck,r=+xs.dataset.r;
    if(S.claimed[ck])return;
    S.claimed[ck]=1;const rr=modGain(r);S.points+=rr;hAdd(today(),rr,0);
    vlog("Kỳ sự: +"+rr+" linh lực");save();render();say("Kỳ sự hoàn thành: +"+rr+" linh lực.");return;
  }
  const b=e.target.closest("[data-a]");if(!b||b.disabled||b.dataset.a!=="ec")return;
  const p=b.dataset.p,k=b.dataset.k;
  if(S.claimed[k]||evCur(p)<S.ev[p].h*60)return;
  const had=new Set(TITLES.filter(t=>tok(t)).map(t=>t.id));
  const er=modGain(evB(S.ev[p].r));S.eb=0;S.claimed[k]=1;S.points+=er;hAdd(today(),er,0);
  const drop=p==="w"?"ca":"the";S.inv[drop]=(S.inv[drop]||0)+1;
  let petMsg="";
  const petChance=p==="m"?0.45:0.22;
  if(Math.random()<petChance){const pet=grantPet();if(pet){petMsg=" · Linh thú theo về: "+pet.n+"!";vlog("Nhận linh thú từ kỳ sự: "+pet.n)}}
  const nt=TITLES.filter(t=>tok(t)&&!had.has(t.id)).map(t=>t.n);
  save();render();say("Nhận thưởng kỳ sự: +"+er+" linh lực và 1 "+ITEMS.find(i=>i.id===drop).n+petMsg+".");
};
setInterval(()=>{const a=document.activeElement;if(!a||!a.matches("input,select,textarea"))render()},30000);
$("ph").oninput=()=>{const v=parseInt($("ph").value);if(v>=1){S.perHour=Math.min(1000,v);save();renderMore()}};
/* ===== Bản 2: gộp tab, kiếp nạn, linh sủng, Thiên Đạo, sao lưu, âm thanh ===== */
const AudioUI=GameAudio.create(()=>S.snd===0,window);
const sfx=AudioUI.sfx;
const clk=AudioUI.clk;
AudioUI.bind(document);
const GR=[
 {id:"u",n:"Tu Luyện",s:[["q","Nhiệm vụ"],["c","Liên hoàn"],["l","Nhật trình"]]},
 {id:"t",n:"Thiên Kiêu",s:[["b","Bảng"],["f","Thiên diễn"],["v","Vạn Sự Điện"],["z","Tông môn",1],["p","Bản đồ",1]]},
 {id:"w",n:"Thử Thách",s:[["j","Kiếp nạn"],["e","Kỳ sự"],["y","Lệnh bài"],["x","Thiên kiếp",1]]},
 {id:"k",n:"Bảo Khố",s:[["k","Kỳ Bảo"],["i","Càn Khôn"],["r","Nhàn hạ"]]},
 {id:"s",n:"Thiên Thư",s:[["s","Thống kê"],["d","Nhật ký"],["a","Sứ mệnh"],["o","Thiên Cơ Lục"],["g","Thiên Đạo",9]]}
];
const GR_SIMPLE=[
 {id:"u",n:"Tu Luyện",s:[["q","Nhiệm vụ"],["l","Nhật trình"]]},
 {id:"w",n:"Thử Thách",s:[["x","Thiên kiếp",1]]},
 {id:"s",n:"Thiên Thư",s:[["s","Thống kê"],["d","Nhật ký"]]}
];
const ALLS=["q","c","l","j","e","y","x","b","f","v","z","p","k","i","r","s","o","g","d","a"];
let TG="u",TS="q";
function activeGR(){return (S.ui&&S.ui.studyOnly)?GR_SIMPLE:GR}
/* ===== Chấm đỏ thông báo =====
   Hiện chấm đỏ ở tab (nhóm + mục con) và cạnh từng mục khi có: phần thưởng chưa nhận, danh hiệu mới chưa đeo,
   linh thú mới, kỳ ngộ bất ngờ chưa xem. Trạng thái "mới" lưu ở S.nw (t: danh hiệu, p: linh thú, k: kỳ ngộ đã xem, kt: đã báo). */
const NW_BASE=document.title;
let NW_F={};
function nwS(){const n=S.nw||(S.nw={});if(!n.t)n.t={};if(!n.p)n.p={};if(!n.k)n.k={};if(!n.kt)n.kt={};return n}
const nwHas=s=>!!document.querySelector(s);
const nwFull=()=>{const a=S.pets&&S.pets.hl;return !!a&&S.act==="hl"&&(Date.now()-a.t)/36e5>=8};
function nwCompute(){
  const n=nwS(),now=Date.now(),f={};
  f.j=nwHas('#kiep button[data-k]:not([disabled])');
  f.e=nwHas('#events button[data-a="ec"]:not([disabled]),#events button[data-a="xs"]:not([disabled])');
  f.y=nwHas('#lenh button[data-a="lc"]:not([disabled]),#lenh button[data-a="ci"]:not([disabled]),#lenh button[data-a="kc"]:not([disabled]),#kn button[data-a="kc"]:not([disabled])')||knList().some(o=>o.en>now&&!n.k[o.h]);
  f.x=nwHas('#exams button[data-a="xc"]:not([disabled])');
  f.z=nwHas('#sect button[data-a="sm"]:not([disabled])');
  f.i=Object.keys(n.t).length>0||Object.keys(n.p).length>0||nwFull();
  return f;
}
function nwKn(){
  const n=nwS(),now=Date.now();let fresh=null;
  knList().forEach(o=>{if(o.en>now&&!n.kt[o.h]){n.kt[o.h]=1;fresh=o}});
  const ks=Object.keys(n.kt);if(ks.length>300){ks.map(Number).sort((a,b)=>a-b).slice(0,ks.length-200).forEach(k=>{delete n.kt[k];delete n.k[k]})}
  if(fresh){save();sfx(880);say("Kỳ ngộ bất ngờ: "+fresh.name+"! Học "+fresh.T+" phút trong "+fresh.W+" giờ để nhận thưởng.")}
}
function nwApply(){
  const f=NW_F,L=S.god?99:Math.max(ri(uxp()),S.pk||0);
  const gf={};activeGR().forEach(g=>{gf[g.id]=g.s.some(x=>((x[2]||0)<=L||S.god)&&f[x[0]])});
  document.querySelectorAll("#gn button[data-g]").forEach(b=>b.classList.toggle("rd",!!gf[b.dataset.g]));
  document.querySelectorAll("#sn button[data-s]").forEach(b=>b.classList.toggle("rd",!!f[b.dataset.s]));
  document.title=(Object.keys(f).some(k=>f[k])?"● ":"")+NW_BASE;
}
function nwUpdate(){try{NW_F=nwCompute();nwKn();nwApply()}catch(e){}}
function nwSeenK(){const n=nwS();let ch=0;knList().forEach(o=>{if(!n.k[o.h]){n.k[o.h]=1;ch=1}});if(ch){document.querySelectorAll("#kn .nd").forEach(x=>x.remove());save();nwUpdate()}}
function nwOpen(s){
  if(s!=="y"&&s!=="i")return;
  setTimeout(()=>{if(TS!==s)return;
    if(s==="y")nwSeenK();
    else{const n=nwS();if(Object.keys(n.p).length){n.p={};save();renderPet();nwUpdate()}}
  },2500);
}
function drawNav(){
  const nav=activeGR();
  const L=S.god?99:Math.max(ri(uxp()),S.pk||0);
  let G=nav.find(x=>x.id===TG);if(!G){TG=nav[0].id;G=nav[0];TS=G.s[0][0]}
  const vis=G.s.filter(x=>(x[2]||0)<=L||S.god);
  if(!vis.some(x=>x[0]===TS)){TS=vis[0][0];ALLS.forEach(i=>{const el=$(i);if(el)el.hidden=i!==TS})}
  $("gn").innerHTML=nav.map(g=>`<button data-g="${g.id}" class="${g.id===TG?"on":""}">${g.n}</button>`).join("");
  $("sn").innerHTML=vis.map(x=>`<button data-s="${x[0]}" class="${x[0]===TS?"on":""}">${x[1]}</button>`).join("");
  $("sn").hidden=vis.length<2;try{nwApply()}catch(e){}
  ["gn","sn"].forEach(id=>{const n=$(id),b=n.querySelector(".on");if(b)n.scrollLeft=b.offsetLeft-(n.clientWidth-b.offsetWidth)/2});
  $("lkh").textContent=(S.ui&&S.ui.studyOnly)?"Chế độ Chỉ học — bật lại trong Cài đặt.":(L<2?"Trúc Cơ mở Tông môn và Thiên kiếp.":"");
}
function go(g,s){TG=g;const G=activeGR().find(x=>x.id===g)||activeGR()[0];TS=s||(G.s.some(x=>x[0]===TS)?TS:G.s[0][0]);ALLS.forEach(i=>{const el=$(i);if(el)el.hidden=i!==TS});drawNav();nwOpen(TS);say("")}
$("gn").onclick=e=>{const b=e.target.closest("button");if(b)go(b.dataset.g)};
$("sn").onclick=e=>{const b=e.target.closest("button");if(b)go(TG,b.dataset.s)};

/* Kiếp nạn */
function kmet(days){return GameAnalytics.kiepMetrics(S.hist,S.cnt||{},S.stl||[],days)}
function renderKiep(){TribulationUI.renderKiep()}
$("kiep").onclick=e=>{
  const b=e.target.closest("button[data-k]");if(!b||b.disabled)return;
  const KC=S.kc||(S.kc={}),k=b.dataset.k,r=Math.round(+b.dataset.r)+(petBuff().kp||0)+(eqT("n14")?25:0)+(S.kd===today()?30:0),pre=k.slice(0,11);if(KC[k])return;
  KC[k]=1;LS().kn=(LS().kn||0)+1;const rr=modGain(r);S.points+=rr;hAdd(today(),rr,0);let m="Vượt kiếp thành công: +"+rr+" linh lực.";
  if([0,1,2].every(i=>KC[pre+i])){if(k[0]==="d"){const b30=modGain(30);S.points+=b30;hAdd(today(),b30,0);m+=" Vượt đủ ba kiếp, thêm +"+b30+" linh lực."}else{S.inv.ca=(S.inv.ca||0)+1;m+=" Nhận 1 Tỉnh Thần Linh Trà."}}
  save();render();say(m);
};

/* Linh sủng */
const PS=[
  {id:"hl",n:"Cửu Vĩ Hồ",c:0,d:"Thu linh lực khi bạn vắng mặt",e:l=>`thu ${2+l} linh lực mỗi giờ, tối đa 8 giờ`,
  ranks:["Sơ Vĩ Hồ","Tam Vĩ Hồ","Ngũ Vĩ Hồ","Thất Vĩ Hồ","Cửu Vĩ Thiên Hồ"]},
  {id:"hq",n:"Linh Hạc",c:300,d:"Hộ đạo từng nhiệm vụ",e:l=>`+${l} linh lực cố định mỗi nhiệm vụ`,
  ranks:["Bạch Hạc Đồng","Linh Hạc Sứ","Vân Hạc Chân Quân","Tiên Hạc Trưởng Lão","Huyền Hạc Thánh Tôn"]},
  {id:"kl",n:"Kỳ Lân",c:500,d:"Thưởng cho buổi học dài",e:l=>`+${2+2*l} linh lực cố định cho nhiệm vụ từ 45 phút`,
  ranks:["Kỳ Lân Ấu Thể","Kỳ Lân Linh Thú","Kỳ Lân Thánh Thú","Thái Cổ Kỳ Lân","Thiên Đạo Kỳ Lân"]},
  {id:"ct",n:"Chu Tước",c:500,d:"Lửa đỏ thiêu kiếp nạn",e:l=>`+${2+2*l} linh lực mỗi lần vượt kiếp nạn`,
  ranks:["Hỏa Tước","Chu Tước Linh","Nam Minh Chu Tước","Liệt Diệm Thánh Tước","Thiên Hỏa Chu Tước"]},
  {id:"hg",n:"Huyền Quy",c:600,d:"Thủ hộ nhàn hạ",e:l=>`mỗi lần đổi nhàn hạ rẻ hơn ${2+2*l} linh lực`,
  ranks:["Huyền Quy Ấu","Huyền Quy Linh","Bắc Vũ Huyền Quy","Huyền Thiên Quy Thánh","Thái Cổ Huyền Quy"]},
  {id:"bh",n:"Bạch Hổ",c:700,d:"Sát phạt tâm ma",e:l=>`nhiệm vụ nhanh +${2*l} linh lực, khi có tâm ma mỗi nhiệm vụ +${2*l}`,
  ranks:["Bạch Hổ Ấu","Bạch Hổ Linh","Tây Phương Bạch Hổ","Sát Phạt Hổ Tôn","Thiên Binh Bạch Hổ"]},
  {id:"tt",n:"Thôn Thiên Thử",c:800,d:"Nhặt bảo vật rơi rớt",e:l=>`${2*l}% mỗi nhiệm vụ nhặt được một vật phẩm`,
  ranks:["Linh Thử","Thôn Bảo Thử","Thôn Thiên Thử","Hư Không Thôn Thử","Thôn Nhật Nguyệt Thử"]},
  {id:"tn",n:"Thanh Long",c:650,d:"Khai mở ngày mới",e:l=>`nhiệm vụ đầu tiên mỗi ngày +${4+2*l} linh lực`,
  ranks:["Thanh Long Ấu","Thanh Long Linh","Đông Hải Thanh Long","Cửu Thiên Thanh Long","Thái Cổ Thanh Long"]},
  {id:"pg",n:"Phượng Hoàng",c:900,d:"Lửa tái sinh theo chuỗi ngày",e:l=>`mỗi ngày chuỗi +${l} linh lực mỗi nhiệm vụ (tối đa +10)`,
  ranks:["Phượng Hoàng Ấu","Niết Bàn Phượng","Hỏa Phượng Hoàng","Bất Diệt Phượng Hoàng","Thiên Đạo Phượng Hoàng"]},
  {id:"ko",n:"Kim Ô",c:550,d:"Thần điểu buổi sớm",e:l=>`nhiệm vụ trước 9 giờ sáng +${2*l} linh lực`,
  ranks:["Kim Ô Ấu","Kim Ô Linh","Tam Túc Kim Ô","Đại Nhật Kim Ô","Thái Dương Kim Ô"]},
  {id:"dm",n:"Dạ Minh Điểu",c:550,d:"Bạn đồng hành đêm khuya",e:l=>`nhiệm vụ từ 22 giờ đến 5 giờ sáng +${2*l} linh lực`,
  ranks:["Dạ Minh Ấu","Dạ Minh Linh","U Minh Điểu","Cửu U Dạ Minh","Vĩnh Dạ Thánh Điểu"]},
  {id:"ty",n:"Tỳ Hưu",c:750,d:"Thu tài vào túi",e:l=>`mỗi lần mua vật phẩm hoàn lại ${2*l} linh lực`,
  ranks:["Tỳ Hưu Ấu","Tụ Tài Tỳ Hưu","Thôn Kim Tỳ Hưu","Vạn Bảo Tỳ Hưu","Thiên Tài Tỳ Hưu"]},
  {id:"mm",n:"Mặc Miêu",c:600,d:"Kéo dài giờ nhàn hạ",e:l=>`mỗi lần đổi nhàn hạ tặng thêm ${l} phút`,
  ranks:["Mặc Miêu Ấu","Mặc Miêu Linh","Huyền Mặc Miêu","Thời Quang Mặc Miêu","Thái Cổ Mặc Miêu"]}
];
const petRank=(p,lv)=>GamePetData.rank(p,lv);
if(S.pet&&!S.pets){S.pets={hl:{lv:S.pet.lv+1,t:S.pet.t}};S.act="hl";delete S.pet}
function petBuff(){return GamePetData.buff(S.pets,S.act)}
function petAcc(){const a=S.pets&&S.pets.hl;if(!a||S.act!=="hl")return 0;return Math.floor(Math.min(8,(Date.now()-a.t)/36e5)*(2+a.lv+(eqT("n6")?2:0)))}
function setAct(id){if(S.act==="hl"){const g=petAcc();if(g){S.points+=g;hAdd(today(),g,0)}}S.act=id;if(id==="hl")S.pets.hl.t=Date.now()}
function renderPet(){GamePetUI.render({S,$,PS,petIcon,petRank,nwS,petAcc,save,render,document})}
$("pet").onclick=e=>GamePetUI.handleClick(e,{S,$,PS,petRank,setAct,say,modGain,petAcc,hAdd,today,Date,save,render});

/* Thiên Đạo (godmode) — nhóm gọn, đủ chức năng */
const GMG=[
  {h:"Linh lực & cảnh giới",b:[
    ["pt","+1.000"],["pb","+10.000"],["sv","Đặt theo ô"],["xp","Lên cảnh kế"],["dt","Lên Chân Tiên"]
  ]},
  {h:"Kiếp & giờ",n:"Tua ngày và tăng chuỗi nằm ở bảng Thiên Kiêu: hai nút nhỏ «+1 ngày», «+1 chuỗi» (chỉ hiện khi bật Thiên Đạo).",b:[
    ["k0","Kiếp hết hạn"],["hh","Giờ giả (23/6/12/thật)"]
  ]},
  {h:"Thiên kiếp & Mệnh",b:[
    ["ex","Chốt mọi thiên kiếp"],["xr","Làm lại thiên kiếp"],["kf","Vượt kiếp nạn hôm nay"],["kc","Xóa nhận kiếp nạn"],
    ["mh","Mệnh = 100"],["m0","Mệnh = 0"],["ax","Xóa Trừng Phạt"],["fp","Gây Trừng Phạt"]
  ]},
  {h:"Tông môn & chiến",b:[
    ["sw","Thắng tông chiến"],["js","Gia nhập tông ngẫu"],["bm","Bái sư (bỏ điều kiện)"]
  ]},
  {h:"Vật phẩm · thú · danh hiệu",b:[
    ["it","+3 mỗi vật phẩm"],["ic","Dọn kho & buff"],["pa","Mọi thú đỉnh danh"],["pe","Hồ tích đầy"],["ps","Xóa linh thú"],
    ["ti","Cấp mọi danh hiệu"],["tr","Thu hồi danh hiệu"],["ft","Mở/khóa mọi danh hiệu"]
  ]},
  {h:"Chuỗi ngày học",b:[
    ["sx","Xóa chuỗi (không tâm ma)"],["sb","Đứt chuỗi + tâm ma"]
  ]},
  {h:"Cơ duyên đặc biệt",n:"Chỉ 3 hạng cuối mới tự quay được, nhưng ở đây có thể ban thẳng cho bạn để thử. Hiệu lực đến thiên kiếp kế tiếp. «Quay 3 hạng cuối ngay» quay lại cho cả NPC và bạn (bỏ qua giới hạn một lần mỗi tuần).",b:[
    ["sp0","Ban Chi Lực cho bạn"],["sp1","Ban Gia Tốc cho bạn"],["sp2","Ban Khai Ân cho bạn"],["spr","Quay 3 hạng cuối ngay"],["spx","Xóa mọi cơ duyên đặc biệt"]
  ]},
  {h:"Trạng thái tu luyện",b:[
    ["tm","Gây tâm ma"],["tx","Xóa tâm ma"],["gt","+1 giờ nhàn hạ"],
    ["bf","Bơm buff tạm"],["ev","Đầy tiến độ kỳ sự"],["cr","Xóa nhận thưởng"],["qs","Nhiệm vụ mẫu"]
  ]},
  {h:"Luân hồi & hệ thống",b:[
    ["pv","Xem phán quyết"],["rb","Luân hồi ngay"],["rc","Xóa sử luân hồi"],
    ["wk","Chốt bảng tuần"],["sd","Làm mới kỳ ngộ"],["cal","Hiệu chuẩn NPC"],["ck","Tự kiểm tra"],
    ["nm","Đổi tên"],["fx","Thử âm thanh"],["wp","Tẩy trắng"],["off","Tắt Thiên Đạo"]
  ]}
];
// Đặt chuỗi = n ngày tính đến hôm nay (lịch ảo), đồng bộ nhật ký ngày để streakAt/actDays đọc từ lịch sử vẫn khớp
function setStreak(n){
  n=Math.max(0,Math.min(400,n|0));
  const t=today();
  S.streak={last:n>0?t:"",n:n};
  for(let i=0;i<420;i++){
    const d=new Date(Date.now()+(S.dOff||0)*864e5);d.setDate(d.getDate()-i);
    const k=d.toLocaleDateString("sv"),h=S.hist[k];
    if(i<n){if(!h)S.hist[k]={p:0,m:1,g:1};else if(!(h.m>0)){h.m=1;h.g=1}}
    else if(h&&h.g){if(h.p===0&&h.m<=1)delete S.hist[k];else{h.m=Math.max(0,h.m-1);delete h.g}}
  }
  LS().ms=Math.max(LS().ms||0,n);KS().ms=Math.max(KS().ms||0,n);
}
const curStreak=()=>GameStreak.current(S.streak,today(),dayStr(1));
function godAdvance(n,keep){
  const prev=curStreak();
  KS().skd=(KS().skd||0)+n*864e5;S.dOff=(S.dOff||0)+n;if(S.lb)S.lb.t0-=n*864e5;KS().start-=n*864e5;
  if(keep)setStreak(prev+n);
}
function renderGod(){
  const g=$("g");if(!g)return;
  g.innerHTML=`<div class="box"><h2>Thiên Đạo</h2>
    <small>Chế độ kiểm tra — ảnh hưởng dữ liệu thật. Mọi tab được mở khóa khi bật.</small>
    <div class="row" style="margin-top:8px"><label>Linh lực đặt tay <input type="number" id="gv" min="0" value="${Math.round(S.points)||1000}"></label>
      <small style="margin-left:8px">Chuỗi hiện tại: ${curStreak()} ngày</small>
      <small style="margin-left:8px">Mệnh ${S.menh==null?100:S.menh}/100${S.tdPenalty?" · Trừng Phạt ×"+(S.tdStacks||1):""}</small></div>
    ${GMG.map(G=>`<div style="margin-top:12px"><b style="font-size:13px;color:var(--gold)">${G.h}</b>${G.n?`<small style="display:block;margin-top:2px">${G.n}</small>`:""}
      <div class="chips" style="margin-top:6px">${G.b.map(([id,lab])=>`<button class="btn alt" data-gm="${id}">${lab}</button>`).join("")}</div></div>`).join("")}
    <pre id="gout" style="white-space:pre-wrap;font:13px/1.6 var(--serif);margin:12px 0 0;max-height:200px;overflow:auto"></pre>
  </div>`;
}
const GodModeSystem=GameGodModeSystem.create({S,KD,END,B,cum,CD,ALLS,RL,TITLES,ITEMS,IC,PS,SPQ,SECTS,KEY,today,hAdd,ri,say,doRebirth,showThd,lbInit,weekStart,settle,KS,vlog,resolveEx,warGain,nextEx,spRoll,lbRows,save,renderGod,render,go,askName,sfx,burst,setStreak:v=>setStreak(v),curStreak:()=>curStreak(),kAge:()=>kAge(),storage:localStorage,location,schedule:(fn,ms)=>setTimeout(fn,ms),getMaxXp:()=>typeof MAXXP==="number"?MAXXP:END,$});
function calib(){GodModeSystem.calib()}
function selfCheck(){GodModeSystem.selfCheck()}
function runGod(a,btn){return GodModeSystem.run(a,btn)}
$("lbgod").onclick=e=>{
  const b=e.target.closest("button[data-q]");if(!b||!S.god)return;
  if(b.dataset.q==="d"){godAdvance(1,false);vlog("Thiên Đạo: tua 1 ngày")}
  else{setStreak(curStreak()+1);vlog("Thiên Đạo: chuỗi +1")}
  save();render();say(b.dataset.q==="d"?"Đã tua thêm 1 ngày.":"Chuỗi: "+curStreak()+" ngày.");
};
$("g").onclick=e=>{
  const b=e.target.closest("button[data-gm]");if(!b)return;
  const a=b.dataset.gm,r=runGod(a,b);
  if(r===null){say("Lệnh không nhận diện: "+a);return}
  if(r===false)return;
  save();renderGod();render();
  say("Đã thi triển: "+b.textContent+".");
};

/* Sao lưu và cài đặt + tùy chỉnh giao diện */
const bx=document.createElement("div");bx.style.display="contents";bx.id="setbox";
const SettingsUI=GameSettingsUI.create({S,fold,container:bx});
function renderSettings(){SettingsUI.render()}
renderSettings();
$("setpanel").appendChild(bx);
$("gear").onclick=()=>{const p=$("setpanel"),on=p.hidden;p.hidden=!on;$("sbody").hidden=on;$("gear").classList.toggle("on",on);$("gear").setAttribute("aria-expanded",on)};
$("s").addEventListener("toggle",e=>{const k=e.target.dataset&&e.target.dataset.k;if(k)FO[k]=e.target.open},true);
bx.onclick=e=>{
  const ui=e.target.closest("[data-ui]");
  if(ui){
    S.ui=S.ui||{};
    if(ui.dataset.ui==="studyOnly"){S.ui.studyOnly=ui.dataset.v==="1";save();applyUi();renderSettings();drawNav();render();say(S.ui.studyOnly?"Đã bật chế độ Chỉ học.":"Đã về chế độ đầy đủ.");return}
    S.ui[ui.dataset.ui]=ui.dataset.v;save();applyUi();renderSettings();say("Đã đổi giao diện.");return;
  }
  const b=e.target.closest("button");if(!b)return;const a=b.dataset.bk;
  if(a==="ex"||a==="dl"){
    try{
      const raw=GameStorage.exportData(S);$("bk").value=raw;$("bk").select();
      if(a==="ex"){try{navigator.clipboard&&navigator.clipboard.writeText(raw)}catch(x){}say("Đã tạo backup. Hãy sao chép hoặc tải file để cất giữ.")}
      else{
        const blob=new Blob([raw],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
        link.href=url;link.download="tu-tien-hoc-dao-backup-"+today()+".json";document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);say("Đã tải file backup JSON.");
      }
    }catch(x){say("Không thể tạo backup: "+(x.message||"dữ liệu không hợp lệ."))}
  }
  else if(a==="file"){$("bkfile").click()}
  else if(a==="im"){
    try{
      if(!window.confirm("Nhập backup sẽ thay thế tiến trình hiện tại. Bản hiện tại sẽ được lưu thành backup nội bộ trước. Tiếp tục?"))return;
      const imported=GameStorage.importData(KEY,$("bk").value);
      S=Object.assign(DEF(),imported);if(!S.ui)S.ui={skin:"classic",density:"normal",fs:"md",theme:"auto"};
      applyUi();render();say("Đã nhập backup thành công.");
    }catch(x){say("Không thể nhập backup: "+(x.message||"dữ liệu không hợp lệ.")+" Tiến trình hiện tại chưa bị thay thế.")}
  }
  else if(a==="sn"){S.snd=S.snd===0?1:0;save();renderSettings();say(S.snd===0?"Đã tắt âm thanh.":"Đã bật âm thanh.");sfx(660)}
  else if(a==="nm")askName();
  else if(a==="tut"){S.tutDone=0;S.tutStep=0;save();showTut()}
  else if(a==="god"){S.god=!S.god;save();renderSettings();render();say(S.god?"Thiên Đạo đã mở, mọi tab được mở khóa.":"Đã tắt Thiên Đạo.")}
};

$("bkfile").addEventListener("change",async e=>{
  const file=e.target.files&&e.target.files[0];if(!file)return;
  try{
    $("bk").value=await file.text();
    say("Đã đọc file backup. Kiểm tra nội dung rồi bấm «Nhập JSON» để xác nhận.");
  }catch(x){say("Không đọc được file backup.")}
  e.target.value="";
});

function checkStreakBreak(){
  // Mất chuỗi vì bỏ ngày (chưa học hôm qua / trước đó) → tâm ma, không cần đợi nhiệm vụ mới
  const decision=GameStreak.checkBreak({last:S.streak.last,streak:S.streak.n,today:today(),yesterday:dayStr(1),twoDaysAgo:dayStr(2),lifeCharm:S.inv&&S.inv.the,heartCharm:!!S.sh,random:Math.random});
  if(!decision)return;
  if(decision.consumeHeartCharm)S.sh=0;
  if(decision.triggerDemon){S.tm=1;S.tmTasks=0;KS().tm=(KS().tm||0)+1;}
  vlog(decision.log);
  S.streak.n=0;save();
  say(decision.message);
}
function renderX(){
  checkStreakBreak();
  let tb="";
  {const sp=spA();if(sp){const e=EX.find(z=>z.id===sp.ex);tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--gold)"><b style="color:var(--gold)">${SPQ[sp.k].n}</b><br><small>${SPQ[sp.k].pd}. Hiệu lực đến ${e?e.n:"thiên kiếp kế tiếp"}.</small></div>`}}
  if(S.tm)tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--red)"><b style="color:var(--red)">Tâm Ma Tự Thân</b><br><small>Linh lực nhận −20%. Hoàn thành 2 nhiệm vụ, mỗi nhiệm vụ ≥25 phút để trừ ma (${S.tmTasks||0}/2).</small></div>`;if(S.tma)tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--red)"><b style="color:var(--red)">Thiên Ma Nhập Tâm</b><br><small>Linh lực nhận −35%. Hoàn thành 3 nhiệm vụ, mỗi nhiệm vụ ≥45 phút để trừ ma (${S.tmaTasks||0}/3).</small></div>`;
  if(typeof playerBalanced==="function"&&playerBalanced())tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--jade)"><b style="color:var(--jade)">Thiên Đạo Cân Bằng</b><br><small>Hạng ${myRk()} ≥ ${BAL_RANK}: mọi nguồn linh lực ×${BAL_MULT} (+${Math.round((BAL_MULT-1)*100)}%). Vào top ${BAL_RANK-1} thì buff tắt. Không còn phạt đứng cuối bảng.</small></div>`;
  $("tmb").innerHTML=tb;
  renderKiep();renderPet();renderRb();renderRbs();drawNav();KS().pk=Math.max(KS().pk,S.points);
}
/* Chuyển kiếp */
const DEF=()=>({quests:[],points:0,gameSec:0,rate:2,perHour:200,streak:{last:"",n:0},hist:{},chains:[],ev:{w:{h:10,r:100},m:{h:40,r:500}},claimed:{},inv:{},buff:{n:0,m:1},title:"",sched:{},lb:null,sem:null});
const MAXXP=END;
const LS=()=>S.ls||(S.ls={q:0,m:0,ni:0,da:0,ru:0,lg:0,kn:0,it:0,top:0,ms:0,tmc:0});
const KS=()=>S.kst||(S.kst={start:Date.now(),pk:0,ms:0,tm:0});
const tok=t=>!!S.ft||!!(S.tt&&S.tt[t.id])||t.ok();
const eqT=id=>{const t=TITLES.find(x=>x.id===id);return !!t&&S.title===id&&tok(t)};
const evB=r=>r+(eqT("t3")?60:0)+(eqT("t5")?20:0)+(S.eb||0);
const LC=m=>Math.max(1,Math.ceil(m*S.rate*(1-(S.sl?.3:0))*(masterBuff().dc?1-masterBuff().dc/100:1))-(petBuff().dc||0)-(eqT("n4")?8:0));
const hourNow=()=>S.hh!=null?S.hh:new Date().getHours();
const kAge=()=>(Date.now()-KS().start)/864e5;
const kEnd=()=>kAge()>=KD; // kiếp chỉ kết thúc khi hết thời gian
const bk=()=>GameProgressData.bestKiep(S.rbh,KS().pk,S.points,(S.rb||0)+1);
function chkT(){const T=S.tt||(S.tt={}),nw=[];TITLES.forEach(x=>{if(!T[x.id]&&x.ok()){T[x.id]=Date.now();nwS().t[x.id]=1;nw.push(x.n)}});if(nw.length){save();setTimeout(()=>say("Danh hiệu mới: "+nw.join(", ")+"!"),200)}}
function warGain(){const w=addPts(150+(eqT("n15")?100:0));LS().sw=(LS().sw||0)+1;return w}
function TB(q){
  const pt=petBuff(),mb=masterBuff(),H=hourNow(),mins=q.mins||0,nT=(S.cnt&&S.cnt[today()])||0,pm=S.pw>0?2:1;
  let flat=3*ri(uxp());
  if(S.xb&&Date.now()<S.xb.u)flat+=S.xb.v;
  if(eqT("t1"))flat+=3;if(eqT("t2"))flat+=Math.min(14,S.streak.n);
  if(eqT("t4")&&S.tm)flat+=12;if(eqT("t6")&&mins>=60)flat+=10;
  if(eqT("n1")&&(H>=22||H<5))flat+=10;if(eqT("n2")&&H<9)flat+=10;if(eqT("n3")&&q.due)flat+=12;
  if(eqT("n7")&&mins>=120)flat+=30;if(eqT("n8")&&nT>=3)flat+=6;if(eqT("n9")&&myRk()<=3)flat+=10;
  if(eqT("n10")&&nT===0)flat+=25;if(eqT("n11")&&S.act)flat+=4;if(eqT("n18"))flat+=12;
  // Buff sư phụ
  if(mb.fl&&mins>=45)flat+=mb.fl;
  if(mb.fn&&(H>=22||H<5))flat+=mb.fn;
  if(mb.ft&&S.tm)flat+=mb.ft;
  flat+=pm*((pt.fq||0)+(mins>=45?pt.fl||0:0)+(q.due?pt.fr||0:0)+(S.tm?pt.ft||0:0)+(nT===0?pt.f1||0:0)+Math.min(10,Math.min(14,S.streak.n)*(pt.fs||0))+(H<9?pt.fm||0:0)+(H>=22||H<5?pt.fn||0:0));
  return{flat:flat+(spK()===0?SPQ[0].pl:0),mult:(mb.mult||1)*(spK()===1?SPQ[1].mul2:1),cap:.5,tm:.2};
}
function buffTxt(){
  const a=[];
  if(S.buff.n>0)a.push("×"+S.buff.m+" linh lực cho "+S.buff.n+" nhiệm vụ");
  (S.fx||[]).forEach(e=>a.push("+"+e.v+" linh lực cố định cho "+e.n+" nhiệm vụ"+(e.t==="q"?" nhanh":e.t==="l"?" từ 60 phút":"")));
  if(S.xb&&Date.now()<S.xb.u)a.push("+"+S.xb.v+" linh lực cố định mỗi nhiệm vụ, còn "+rem(S.xb.u));
  if(S.tb&&Date.now()<S.tb)a.push("+20% linh lực trong "+Math.ceil((S.tb-Date.now())/36e5)+" giờ");
  if(S.sl)a.push("lần đổi nhàn hạ tới rẻ hơn 30%");if(S.lt)a.push("lần đổi nhàn hạ tới tặng thêm "+S.lt+" phút");
  if(S.ln===today())a.push("kiếp nạn hôm nay nhẹ hơn 25%");if(S.kd===today())a.push("kiếp nạn hôm nay +30 linh lực");
  if(S.sh)a.push("Hộ Tâm Phù đang chờ chặn lần tâm ma kế tiếp");if(S.eb)a.push("lần nhận thưởng event hoặc lệnh bài tới +"+S.eb+" linh lực");if(S.tcCharges>0)a.push("Thiên Cơ Lệnh: +50% cho "+S.tcCharges+" lần nhận thưởng");
  if(S.pw>0)a.push("buff linh thú ×2 cho "+S.pw+" nhiệm vụ");
  if(S.tdPenalty)a.push("Thiên Đạo Trừng Phạt: −"+Math.min(30,5*Math.max(1,S.tdStacks||1))+"% linh lực (×"+Math.max(1,S.tdStacks||1)+")");
  if((S.failStreak||0)>0)a.push("Chuỗi độ kiếp thất bại: "+S.failStreak);
  if(S.master!=null&&S.sect===S.master)a.push("Sư phụ "+MASTERS[S.master].n+": "+MASTERS[S.master].buff);
  return a.length?"Đang có hiệu ứng: "+a.join("; "):"";
}
function useItem(id,it){
  const ex=eqT("n5")?1:0,on="Đang có hiệu ứng rồi.",now=Date.now(),td="Hôm nay đã dùng rồi.";
  const pf=(n,v,k)=>{if((S.fx||[]).length>=6)return"Đang có quá nhiều hiệu ứng cố định.";(S.fx=S.fx||[]).push({n:n+ex,v,t:k||""})};
  // Tác dụng riêng của vật phẩm tiện ích: chk kiểm tra điều kiện dùng, ap áp dụng sau khi đã nhận phần linh lực theo nhiệm vụ
  const U={
    ty:{chk:()=>S.tm||S.tma?null:"Bạn không có tâm ma.",ap:()=>{S.tm=0;S.tmTasks=0;S.tma=0;S.tmaTasks=0}},
    cb:{chk:()=>null,ap:()=>{S.tm=0;S.tma=0;S.tmTasks=0;S.tmaTasks=0;S.cbUntil=now+864e5}},
    ht:{chk:()=>S.sh?on:null,ap:()=>{S.sh=1}},
    sl:{chk:()=>S.sl?on:null,ap:()=>{S.sl=1}},
    tq:{chk:()=>S.lt?on:null,ap:()=>{S.lt=15}},
    ln:{chk:()=>S.ln===today()?td:null,ap:()=>{S.ln=today()}},
    dk:{chk:()=>S.kd===today()?td:null,ap:()=>{S.kd=today()}},
    cl:{chk:()=>S.tcCharges>0?on:null,ap:()=>{S.tcCharges=4}},
    ll:{chk:()=>S.pw>0?on:null,ap:()=>{S.pw=5+ex}},
    hy:{chk:()=>S.pets&&S.pets.hl?null:"Bạn chưa có Cửu Vĩ Hồ.",ap:()=>{S.pets.hl.t-=4*36e5}}
  };
  const u=U[id];let err=u?u.chk():null;
  if(!err&&it.q)err=pf(it.q[0],it.q[1],it.q[2]);
  if(err){say(err);return}
  if(u)u.ap();
  S.inv[id]--;LS().it++;
  let bonus=0;
  if(eqT("n17"))bonus+=15;
  if(masterBuff().itemBonus)bonus+=masterBuff().itemBonus;
  if(bonus){S.points+=modGain(bonus);hAdd(today(),modGain(bonus),0)}
  say("Đã dùng "+it.n+(bonus?" (+"+modGain(bonus)+" linh lực)":"")+".");
}
function renderRb(){TribulationUI.renderRb()}
$("tmb").onclick=e=>{
  const b=e.target.closest("button[data-rb]");if(!b)return;
  if(!b.dataset.arm){b.dataset.arm=1;b.textContent="Bấm lần nữa để xác nhận";return}
  doRebirth();
};
function buildRec(){
  const ks=KS(),H=S.hist,days=Object.keys(H).filter(k=>H[k].p>0||H[k].m>0).sort(),now=Date.now();
  let m=0,bp=0,bd="";days.forEach(k=>{m+=H[k].m;if(H[k].p>bp){bp=H[k].p;bd=k}});
  const pt=PS.find(p=>p.id===S.act),ti=TITLES.find(t=>t.id===S.title&&tok(t));
  const r={n:(S.rb||0)+1,name:S.name||"đạo hữu",pk:Math.round(Math.max(ks.pk,S.points)),fin:Math.round(S.points),days:Math.max(1,Math.round((now-ks.start)/864e5)),hrs:m/60,quests:Object.values(S.cnt||{}).reduce((a,b)=>a+b,0),best:{d:bd,p:bp},ms:ks.ms,tm:ks.tm,kn:Object.keys(S.kc||{}).length,miles:miles(-1).filter(x=>x[0]>0),rank:myRk(),pet:pt?pt.n:"",title:ti?ti.n:"",at:now};
  r.npc=Math.round(B.reduce((a,b,i)=>a+bxp(i,now),0)/B.length);r.exg=S.sem?Object.values(S.sem.res).map(z=>(z.rows.find(q=>q.u)||{}).g).filter(Boolean):[];r.tt=Object.keys(S.tt||{}).length;r.it=LS().it;r.sect=S.sect!=null?SECTS[S.sect].n:"";r.txt=narrate(r);return r;
}
function narrate(r){
  const P=[],f=ts=>new Date(ts).toLocaleDateString("vi-VN"),avg=r.hrs/r.days,full=r.pk>=END;
  // Đánh giá tổng thể dựa trên giờ học, hạng, linh lực đỉnh và chuỗi ngày
  const summary=GameRebirthData.gradeSummary(r,END),grade=summary.grade,gTxt=summary.text;
  r.grade=grade;
  P.push(`Kiếp thứ ${r.n}, có một người tên ${r.name}${r.sect?`, đệ tử ${r.sect}`:""}. Tu hành ${r.days} ngày, tổng cộng ${Math.round(r.hrs)} canh giờ, bình quân ${avg.toFixed(1)} giờ mỗi ngày. ${avg>=6?"Người ngoài gọi là liều mạng. Người ấy chỉ gọi là học.":avg>=3?"Không nhanh, không chậm. Ngày nào cũng ngồi xuống.":"Có ngày ngồi trước án thư, có ngày không."}`);
  const L=[];
  if(r.miles.length){const a=r.miles[0],z=r.miles[r.miles.length-1];L.push(`Ngày ${f(a[1])}, nhập ${RL[a[0]][0]}.`+(z!==a?` Ngày ${f(z[1])}, bước vào ${RL[z[0]][0]}.`:""))}
  if(r.best.d)L.push(`Ngày ${r.best.d} học nhiều nhất: ${Math.round(r.best.p)} linh lực.`);
  if(L.length)P.push(L.join(" "));
  P.push((r.ms>=14?`Có lần giữ trọn ${r.ms} ngày không đứt.`:r.ms>=5?`Chuỗi dài nhất ${r.ms} ngày.`:`Chuỗi dài nhất chỉ ${r.ms} ngày.`)+(r.tm?` Tâm ma tìm đến ${r.tm} lần. ${r.tm>2?"Ngã xuống, đứng dậy, rồi lại ngã xuống, lại đứng dậy.":"Đều qua được."}`:` Tâm ma chưa từng tìm đến.`));
  P.push(`Hoàn thành ${r.quests} nhiệm vụ${r.kn?`, vượt ${r.kn} kiếp nạn`:""}.${r.pet?` ${r.pet} đi cùng đến cuối.`:""}${r.title?` Người đời gọi là 「${r.title}」.`:""}`);
  if(r.exg.length){const c=g=>r.exg.filter(x=>x===g).length;P.push(`Thiên kiếp ${r.exg.length} đợt: ${c("Xuất sắc")} lần Xuất sắc, ${c("Giỏi")} lần Giỏi, ${c("Yếu")} lần Yếu.`);}
  P.push(`Khi kiếp khép, đứng hạng ${r.rank}/${B.length+1} Thiên Kiêu Bảng, linh lực đỉnh ${r.pk}. ${r.pk>=r.npc?`Cao hơn mức trung bình ${r.npc} của chúng tu sĩ.`:`Thấp hơn mức trung bình ${r.npc}, thiếu ${r.npc-r.pk}.`} Mang theo ${r.tt} danh hiệu, ${r.it} vật phẩm.`);
  P.push(full?`Một đời tu hành, dừng chân ở Chân Tiên.`:`Một đời tu hành, dừng chân ở ${rname(r.pk)}.`);
  // Thiên Đạo Ân Xá: viên mãn + mọi thiên kiếp từ Khá trở lên
  const allKhá=r.exg.length>0&&r.exg.every(g=>g==="Xuất sắc"||g==="Giỏi"||g==="Khá");
  const anXa=S.tdPenalty&&full&&allKhá&&(grade==="Viên Mãn Xuất Chúng"||grade==="Xuất Sắc"||grade==="Giỏi");
  r.anXa=!!anXa;
  if(anXa){
    P.push(`【Ân Xá】Một kiếp viên mãn, mọi thiên kiếp từ Khá trở lên. Lệnh Trừng Phạt được gỡ.`);
  }else if(S.tdPenalty){
    P.push(`Lệnh Trừng Phạt vẫn còn. Điều kiện gỡ: một kiếp viên mãn, mọi thiên kiếp từ Khá trở lên.`);
  }
  P.push(`【Tổng Kết】Kiếp này: ${grade}. ${gTxt}`);
  const EL={
    full:[`Không qua cầu Nai Hà. Phía trước là bậc thang mây, không có bát canh nào đặt sẵn.`,`Lão lái đò Vong Xuyên đứng dậy khi ${r.name} bước lên bến. Lão chưa từng đứng dậy vì ai.`,`Tấm bia vô tự bên bến Vong Xuyên có thêm một cái tên. Mưa không xóa được.`],
    good:[`Hồn phách qua cầu Nai Hà. Bát canh Mạnh Bà còn ấm. ${r.name} uống cạn, nhưng đạo tâm thì không tan.`,`Đò Vong Xuyên cập bến chậm một nhịp. Lão lái đò nói: lần sau đi tiếp, đừng dừng ở đây.`,`Kiếp này thiếu một bước. Cầu Nai Hà vẫn dài như mọi cầu.`],
    mid:[`Hồn phách đến bến Vong Xuyên. Bát canh Mạnh Bà đặt sẵn, còn ấm. ${r.name} uống cạn, không hỏi đó là gì. Chỉ đạo tâm là không tan.`,`Sương xuống bến. Một bóng người lên đò, như hàng ngàn bóng khác. Đò vẫn chèo.`,`Cầu Nai Hà không hỏi kiếp này dài hay ngắn. Chỉ hỏi có đi hết cầu hay không.`],
    weak:[`Bát canh Mạnh Bà còn nóng. Người uống không nhớ mình đã bỏ dở điều gì. Có lẽ vậy lại nhẹ hơn.`,`Hồn phách lên đò. Lão lái đò không hỏi tên, vì kiếp này chưa kịp để lại tên.`,`Kiếp sau, trang vẫn trắng. Đò vẫn chờ.`],
    pen:[`Lệnh phạt vẫn đeo theo qua cầu Nai Hà. Cầu không mang nổi nó, nhưng ${r.name} thì mang được.`,`Đò Vong Xuyên nặng hơn mọi chuyến. Lão lái đò không nói gì, chỉ chèo chậm lại.`]
  };
  const ecat=full?"full":(S.tdPenalty&&!anXa)?"pen":(grade==="Viên Mãn Xuất Chúng"||grade==="Xuất Sắc"||grade==="Giỏi")?"good":grade==="Yếu"?"weak":"mid";
  const EA=EL[ecat];P.push(EA[(r.n+r.days)%EA.length]);
  return P;
}
/* ===== Hướng dẫn lần đầu ===== */
const TUT=[
  {t:"Chào mừng đạo hữu",b:"Đây là con đường Tu Tiên Học Đạo: mỗi giờ học thật sẽ hóa thành linh lực, đẩy tu vi lên cao. Bấm Tiếp để biết cách bắt đầu."},
  {t:"Lập nhiệm vụ",b:"Vào Tu Luyện → Nhiệm vụ. Đặt tên việc học, số phút, độ khó — hoàn thành để nhận linh lực. Có mẫu sẵn phía trên."},
  {t:"Linh lực & cảnh giới",b:"Linh lực là tu vi. Đủ mốc sẽ đột phá cảnh giới (Luyện Khí → … → Đại Thừa → Chân Tiên). Tiêu linh lực (đổi bảo vật, nhàn hạ) cũng làm tu vi giảm."},
  {t:"Thiên Kiêu Bảng",b:"Ngươi cạnh tranh với các tu sĩ trên bảng. Học đều để giữ hạng. Tông môn mở từ Trúc Cơ — có bái sư và nhiệm vụ tông."},
  {t:"Thiên kiếp & Mệnh",b:"Theo ngày trong kiếp, thiên kiếp giáng xuống. Thất bại trừ Mệnh; hết Mệnh chịu Trừng Phạt. Phải xác nhận bảng kiếp trước khi chơi tiếp."},
  {t:"Nhật ký & Sứ mệnh",b:"Thiên Thư có Nhật ký đạo hữu và Sứ mệnh xuyên kiếp (chỉ danh hiệu). Cài đặt cho phép chế độ Chỉ học nếu muốn tối giản. Chúc tu luyện thuận lợi."}
];
function showTut(){
  if(S.tutDone)return;
  const i=S.tutStep||0,step=TUT[i];if(!step){S.tutDone=1;save();$("tut").hidden=true;return}
  $("tut").innerHTML=`<div class="box"><h2>Hướng dẫn · ${i+1}/${TUT.length}</h2><p style="margin:12px 0;line-height:1.7"><b>${step.t}</b><br>${step.b}</p>
    <div class="row"><button class="btn" style="margin-left:0" id="tutn">${i===TUT.length-1?"Bắt đầu tu luyện":"Tiếp"}</button>
    <button class="btn alt" id="tutsk">Bỏ qua</button></div></div>`;
  $("tut").hidden=false;
  $("tutn").onclick=()=>{S.tutStep=(S.tutStep||0)+1;if(S.tutStep>=TUT.length){S.tutDone=1;S.tutStep=0;$("tut").hidden=true;say("Hướng dẫn xong. Hãy lập nhiệm vụ đầu tiên.");}save();if(!S.tutDone)showTut();else render()};
  $("tutsk").onclick=()=>{S.tutDone=1;S.tutStep=0;save();$("tut").hidden=true;say("Đã bỏ qua hướng dẫn. Có thể xem lại trong Cài đặt.")};
}

/* ===== Nhật ký đạo hữu ===== */

/* ===== Đạo Văn · Ký lục đột phá cảnh giới (Story) ===== */
const StorySystem=GameStorySystem.create({S,GameStoryData,GameDiaryData,today,realmIndex:ri,SECTS,PS,TITLES,say,QT,previousMemory:()=>prevMemory(),isTitleUnlocked:tok});
function storyLog(){return StorySystem.storyLog()}
function storyFlags(){return StorySystem.storyFlags()}
function pushStory(...args){return StorySystem.pushStory(...args)}
function onRealmUp(...args){return StorySystem.onRealmUp(...args)}
function chkStoryFlags(){return StorySystem.checkFlags()}
function genDiary(day){return StorySystem.generateDiary(day)}
const DiaryUI=GameDiaryUI.create({S,dayStr,today,generateDiary:d=>genDiary(d),checkStoryFlags:()=>chkStoryFlags(),$});
function renderDiary(){DiaryUI.render()}
/* ===== Nhiệm vụ tông môn tuần ===== */
function sectMissions(){return GameSectMissions.list(S,{weekStart,sumMins,Date});}
function claimSectM(id){return GameSectMissions.claim(S,id,{weekStart,sumMins,Date,say,addPts,vlog,save,render});}

const LegacyMissions=GameLegacyMissions.create({S,save,say});
const LEGACY=LegacyMissions.definitions;
function lifeTrack(){return LegacyMissions.lifeTrack()}
function chkLegacy(){return LegacyMissions.check()}
function renderAch(){const el=$("ach");if(el)el.innerHTML=LegacyMissions.render()}

/* ===== Ký ức kiếp trước ===== */
function prevMemory(){return GameRebirthData.previousMemory(S.rbh||[]);}

function showThd(r,ask){TribulationUI.showThd(r,ask)}
function doRebirth(){TribulationSystem.doRebirth()}
const rbx=document.createElement("div");rbx.style.display="contents";rbx.id="rbs";$("sbody").appendChild(rbx);
function renderRbs(){TribulationUI.renderRbs()}
$("rbs").onclick=e=>{const b=e.target.closest("[data-vi]");if(b&&S.rbh&&S.rbh[+b.dataset.vi])showThd(S.rbh[+b.dataset.vi])};
const OnboardingUI=GameOnboardingUI.create({S,AV_NAM,AV_NU,$,save,render,say,showTutorial:()=>showTut(),schedule:(fn,ms)=>setTimeout(fn,ms)});
function askName(){OnboardingUI.askName()}
if(!S.name||!S.gender)askName();
else if(!S.tutDone)setTimeout(showTut,400);

/* Thiên diễn */
$("f").innerHTML=`<div class="box"><h2>Thiên Diễn</h2><small>Suy diễn tu vi các tu sĩ sau số ngày bạn nhập, rồi tính bạn cần tu luyện thế nào để giữ hạng hiện tại. Tối đa 90 ngày.</small><div class="row"><label>Sau <input type="number" id="fd" min="1" max="90" value="7"> ngày</label><button class="btn" id="fgo">Diễn toán</button></div></div><div id="fout"></div>`;
function thienDien(){LeaderboardUI.renderForecast()}
$("fgo").onclick=thienDien;
drawNav();

render();

/* Thanh trạng thái hệ thống: nếu trình duyệt không báo vùng an toàn phía trên thì tự chừa chỗ */
(function(){
  const probe=document.createElement("div");probe.style.cssText="position:fixed;top:0;left:0;height:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const apply=()=>{
    let h=probe.getBoundingClientRect().height;
    const full=matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||navigator.standalone||(matchMedia("(pointer:coarse)").matches&&innerHeight>=screen.height-2);
    if(!h&&full&&matchMedia("(pointer:coarse)").matches)h=28;
    document.documentElement.style.setProperty("--sat",h+"px");
  };
  apply();addEventListener("resize",apply);addEventListener("orientationchange",apply);
})();
