/* Ảnh đại diện, linh thú và biểu tượng vật phẩm. */
(function(root){
  "use strict";
  const _svg=(w,h,body)=>`<svg class="ico" viewBox="0 0 ${w} ${h}" width="1em" height="1em" aria-hidden="true">${body}</svg>`;
  const IC={
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
  const AVATARS={"Bạch Nhược Hư":"assets/avatars/bach-nhuoc-hu.jpg","Giang Thừa Ảnh":"assets/avatars/giang-thua-anh.jpg","Hạ Trường Ca":"assets/avatars/ha-truong-ca.jpg","Liễu Như Yên":"assets/avatars/lieu-nhu-yen.jpg","Lăng Tiêu Hàn":"assets/avatars/lang-tieu-han.jpg","Mạc Vô Cực":"assets/avatars/mac-vo-cuc.jpg","Tần Hạo Thiên":"assets/avatars/tan-hao-thien.jpg","Vô Song":"assets/avatars/vo-song.jpg","Đường Thanh Liên":"assets/avatars/duong-thanh-lien.jpg","Cố Thái Hư":"assets/avatars/co-thai-hu.jpg","Phong Vân Tử":"assets/avatars/phong-van-tu.jpg"};
  const validPortrait=src=>typeof src==="string" && src.length<=160000 && /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(src);
  function playerPortraitSource(state){
    const src=state.ui?.portrait;
    return validPortrait(src)?src:state.gender==="nu"?AV_NU:AV_NAM;
  }
  async function readPortrait(file){
    if(!file || !["image/jpeg","image/png","image/webp"].includes(file.type) || file.size>10*1024*1024)throw Error("Chọn ảnh JPG, PNG hoặc WebP dưới 10 MB.");
    const url=URL.createObjectURL(file);
    try{
      const img=new Image();
      img.src=url;
      try{await img.decode()}catch{throw Error("Ảnh không hợp lệ hoặc không đọc được.")}
      const side=Math.min(img.naturalWidth,img.naturalHeight);
      if(!side)throw Error("Ảnh không hợp lệ.");
      const canvas=document.createElement("canvas");
      canvas.width=canvas.height=192;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#d8cbb0";
      ctx.fillRect(0,0,192,192);
      ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,192,192);
      const src=canvas.toDataURL("image/jpeg",0.82);
      if(!validPortrait(src))throw Error("Không thể xử lý ảnh.");
      return src;
    }finally{URL.revokeObjectURL(url)}
  }
  function portrait(state,seed,opts){
    opts=opts||{};
    const w=opts.w||48,h=opts.h||48;
    // Avatar NVC theo giới tính
    if(opts.player||opts.forcePlayer||(!opts.npc&&seed===state.name)){
      const src=playerPortraitSource(state);
      return `<img class="av-img" src="${src}" width="${w}" height="${h}" alt="" style="width:${w}px;height:${h}px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);box-shadow:0 2px 8px rgba(0,0,0,.2);display:block">`;
    }
    // Avatar NPC đặc biệt theo tên
    if(typeof seed==="string" && AVATARS[seed]){
      return `<img class="av-img" src="${AVATARS[seed]}" width="${w}" height="${h}" alt="${seed}" style="width:${w}px;height:${h}px;border-radius:50%;object-fit:cover;border:2px solid var(--jade);box-shadow:0 2px 8px rgba(0,0,0,.2);display:block">`;
    }
    return ""; // NPC thường không có avatar
  }
  root.GameIcons=Object.freeze({IC,AV_NAM,AV_NU,AVATARS,petIcon,portrait,validPortrait,playerPortraitSource,readPortrait});
})(window);
