(function (root) {
  "use strict";

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
  root.GamePetData = Object.freeze({ PS, rank, buff, accrued, grant, setActive });
})(typeof window !== "undefined" ? window : globalThis);
