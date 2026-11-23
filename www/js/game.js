const KEY="quest-study-v1";
let S=GameStorage.load(KEY,{quests:[],points:0,gameSec:0,rate:2,perHour:200,streak:{last:"",n:0},hist:{},chains:[],ev:{w:{h:10,r:100},m:{h:40,r:500}},claimed:{},inv:{},buff:{n:0,m:1},title:"",sched:{},lb:null,sem:null,menh:100,tdPenalty:false,failStreak:0,tdStacks:0,dailyBought:{},tmTasks:0,tmaTasks:0,tcCharges:0,petReveal:null,petEvolution:null});
if(!S.ph200){S.perHour=200;S.ph200=1}
if(S.menh==null)S.menh=100;if(S.tdPenalty==null)S.tdPenalty=false;if(S.failStreak==null)S.failStreak=0;if(S.tdStacks==null)S.tdStacks=0;if(!S.dailyBought)S.dailyBought={};if(S.tmTasks==null)S.tmTasks=0;if(S.tmaTasks==null)S.tmaTasks=0;if(S.tcCharges==null)S.tcCharges=0;
if(S._balCleared==null){if(S.lb&&S.lb.bal)S.lb.bal=Array(50).fill(0);S.bal=0;S._balCleared=1;}
if(!S.ui)S.ui={skin:"classic",density:"normal",fs:"md",theme:"auto"};
GameUI.apply(S);
if(S.fb&&S.fb.n>0)(S.fx=S.fx||[]).push({n:S.fb.n,v:S.fb.v,t:""});delete S.fb;let KSALT=(S.rb||0)*7919;
const save=()=>GameStorage.save(KEY,S);
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
const ITEMS=[
 {id:"ca",n:"Tỉnh Thần Linh Trà",c:100,q:[2,100,""],use:1},
 {id:"tl",n:"Tụ Linh Phù",c:200,q:[3,100,""],use:1},
 {id:"ll",n:"Linh Thú Lương",c:300,q:[3,150,""],u:"3 nhiệm vụ kế tiếp buff cố định của linh thú ×2",use:1},
 {id:"hy",n:"Hồ Ly Quả",c:400,q:[3,200,""],u:"Cửu Vĩ Hồ tích thêm 4 giờ linh lực",use:1},
 {id:"tq",n:"Thời Quang Sa",c:500,q:[3,250,""],u:"lần đổi nhàn hạ kế tiếp tặng thêm 15 phút",use:1},
 {id:"ln",n:"Thiên Nhãn Phù",c:600,q:[3,300,""],u:"hôm nay mục tiêu kiếp nạn giảm 25%",use:1},
 {id:"bm",n:"Tích Cốc Đan",c:700,q:[4,175,""],use:1},
 {id:"td",n:"Thần Hành Phù",c:800,q:[4,200,"q"],use:1},
 {id:"bq",n:"Bế Quan Đan",c:900,q:[3,300,"l"],use:1},
 {id:"sl",n:"Sa Lậu Cổ Kính",c:1000,q:[4,250,""],u:"lần đổi nhàn hạ kế tiếp rẻ hơn 30%",use:1},
 {id:"lq",n:"Thiên Địa Linh Quả",c:1100,q:[4,275,""],use:1},
 {id:"hx",n:"Tụ Linh Hương",c:1200,q:[4,300,""],use:1},
 {id:"ty",n:"Thanh Tâm Phù",c:1300,q:[4,325,""],u:"xóa tâm ma ngay",use:1},
 {id:"cb",n:"Cố Bản Đan",c:1400,q:[4,350,""],u:"xóa tâm ma và tăng 10% linh lực trong 24 giờ",use:1},
 {id:"ht",n:"Hộ Tâm Phù",c:1500,q:[4,375,""],u:"chặn lần tâm ma kế tiếp",use:1},
 {id:"dk",n:"Độ Kiếp Đan",c:1600,q:[4,400,""],u:"hôm nay mỗi kiếp nạn vượt được +30 linh lực",use:1},
 {id:"vh",n:"Vạn Hóa Đan",c:1700,q:[5,340,""],use:1},
 {id:"tc",n:"Tụ Linh Trận Đồ",c:1800,q:[5,360,""],use:1},
 {id:"ghe",n:"Ngộ Đạo Bồ Đoàn",c:1900,q:[5,380,""],use:1},
 {id:"cl",n:"Thiên Cơ Lệnh",c:2100,q:[5,420,""],u:"+50% linh lực cho 4 lần nhận thưởng sự kiện kế tiếp",use:1},
 {id:"the",n:"Tục Mệnh Phù",c:2400,d:"Tự dùng khi lỡ 1 ngày, giữ nguyên chuỗi ngày học",use:1}
];
ITEMS.forEach(i=>Object.assign(i,GameItemData.describe(i)));
const PN={en:"Tiếng Anh học kì",code:"Lập trình học kì",nckh:"NCKH học kì"};
const PLAN={
 en:["Kiểm tra trình độ, đặt mục tiêu IELTS hoặc TOEIC|60","Nghe: shadowing 1 bài TED-Ed|60","Từ vựng học thuật: 50 từ và đặt câu|60","Đọc 2 bài báo công nghệ, tóm tắt 5 câu|75","Viết đoạn văn 150 từ về chủ đề CS|75","Nói: ghi âm tự giới thiệu 2 phút|60","Ngữ pháp: các thì và câu điều kiện, 30 câu|60","Ôn giữa kì: tự làm mini test|90","Nghe podcast công nghệ, ghi ý chính|60","Viết email học thuật và CV tiếng Anh|75","Đọc 1 bài báo khoa học, tóm tắt abstract|90","Nói: thuyết trình 5 phút về một dự án|90","Viết bài luận 250 từ|90","Mock test đủ 4 kỹ năng|120","Tổng kết: sửa lỗi sai, viết nhật ký tiến bộ|60"],
 code:["Cài môi trường, Git, tạo repo đầu tiên|60","Ôn cú pháp C++ hoặc Python: 10 bài cơ bản|90","Cấu trúc dữ liệu: mảng, stack, queue|90","Danh sách liên kết: tự cài đặt|90","Cây nhị phân và các cách duyệt|90","Giải thuật sắp xếp, so sánh độ phức tạp|90","Đồ thị: BFS và DFS|90","Ôn giữa kì: 5 bài LeetCode Easy|120","OOP: thiết kế lớp cho mini project|90","Mini project: khung chương trình, chức năng 1|120","Mini project: chức năng 2 và viết test|120","Quy hoạch động: 5 bài kinh điển|120","Mini project: hoàn thiện, viết README|120","Code review và tối ưu mã nguồn|90","Tổng kết: đẩy lên GitHub, viết bài học kinh nghiệm|60"],
 nckh:["Chọn chủ đề, đọc 3 bài tổng quan|90","Tìm 10 tài liệu, quản lý bằng Zotero|75","Xác định câu hỏi nghiên cứu và giả thuyết|75","Viết tổng quan tài liệu (1 trang)|90","Thiết kế phương pháp và dữ liệu|90","Viết đề cương, gửi giảng viên|120","Thu thập và chuẩn bị dữ liệu|120","Chạy thí nghiệm đầu tiên|120","Phân tích kết quả, vẽ biểu đồ|90","Viết phần Phương pháp và Kết quả|120","Viết phần Giới thiệu và Thảo luận|120","Viết abstract tiếng Anh|75","Làm slide báo cáo|90","Tập báo cáo, xin phản hồi|90","Nộp bài hoặc hội nghị sinh viên, rút kinh nghiệm|60"]
};
const nowHM=GameTimeFormat.currentClock;
const tm=GameTimeFormat.toMinutes;
const hm=GameTimeFormat.toClock;
const sq=x=>S.quests.find(y=>y.id===x.qid);
const B=[
 {n:"Miêu Miên Tử",t:"Thụy Miêu Đạo Nhân",b:.05,r:.8,v:4,p:3,d:"Ngủ nhiều hơn tu, thỉnh thoảng bật dậy khổ luyện một đợt rồi lại ngủ"},
 {n:"Diên Thời Tử",t:"Trì Hoãn Chân Nhân",b:.08,r:1.2,v:16,p:8,d:"Linh lực giật cục, sát kỳ hạn mới dốc sức"},
 {n:"Hàm Ngư Tán Nhân",t:"Hàm Ngư Tự Tại",b:.1,r:1.6,v:5,p:12,d:"Chậm mà chắc, ít biến động, đạo tâm bình hòa"},
 {n:"Sơ Học Mông Đồng",t:"Mông Đồng Nhập Đạo",b:.15,r:2.2,v:12,p:10,d:"Mới nhập môn, tu vi lên xuống thất thường"},
 {n:"Cần Lao Đạo Nhân",t:"Cần Lao Bất Nghỉ",b:.2,r:3,v:9,p:20,d:"Đều đặn mỗi ngày, lấy cần cù bù thiên phú"},
 {n:"Dạ Hành Tử",t:"Dạ Hành Giả",b:.25,r:3.6,v:22,p:15,d:"Canh khuya bứt tốc rồi lại lắng xuống"},
 {n:"Trường Chinh Hành Giả",t:"Trường Chinh Bất Tức",b:.3,r:4.2,v:10,p:25,d:"Bền bỉ đường dài, hiếm khi tụt hạng"},
 {n:"Ẩn Cốc Chân Nhân",t:"Ẩn Cốc Ngộ Đạo",b:.4,r:5,v:30,p:30,d:"Ẩn cư lâu năm, một lần xuất thế khiến cả bảng chấn động"},
 {n:"Linh Đồng Thiên Tài",t:"Thiên Tài Linh Đồng",b:.55,r:5.8,v:45,p:40,d:"Tu tốc cực cao, biến động mạnh, khó lường"},
 {n:"Vô Song",t:"Thiên Kiêu Vô Song",b:.5,r:6.6,v:35,p:50,d:"Vô Song Chi Tư — tăng thêm 20% tốc độ học."}
];
const F=[9.7,31.3,107.9,389.1];
const hs=GameNoise.hash, vn=GameNoise.value;
const BH=[{h:4,lam:.5,dh:3},{h:4,lam:.5,dh:3},{h:4.5,lam:.6,dh:3},{h:5,lam:.7,dh:3.5},{h:6,lam:.8,dh:3.5},{h:7,lam:.9,dh:4},{h:9,lam:.9,dh:4},{h:12,lam:.8,dh:4},{h:12,lam:.9,dh:4},{h:12,lam:1,dh:4,eb:.2,sm:.95}];
const CDN=["Gặp cao nhân chỉ linh lực","Nhặt được bí kíp cổ","Linh tuyền tẩy thể","Ngộ đạo dưới trăng","Đột phá bình cảnh","Trúng linh dược","Tìm thấy động phủ thượng cổ","Thiên tượng dị biến","Thiên giáng linh quả"];
const BD={dm:1,dhm:1,vm:1,jm:1,jp:0,cap:24,bm:1,fh:0,lm:1,eb:0,sm:1,neg:0};
BH.forEach((o,i)=>{BH[i]=Object.assign({},BD,o)});
const H30=[4,4,4,4,4.5,4.5,5,5,5,5.5,6,6,6,6.5,7,7,7,7.5,8,8,8,8.5,9,9,9,9.5,10,10,10,10];
const N30=[["Mạc Thanh Phong","Tàn Kiếm Khách"],["Lục Vân Sinh","Đan Đạo Tán Nhân"],["Hoắc Linh Nhi","Phù Văn Tiểu Sư"],["Ngụy Cảnh Hành","Trận Pháp Tông Sư"],["Thượng Quan Diệp","Thú Linh Sứ Giả"],["Đoàn Tử Mặc","Dược Vương Truyền Nhân"],["Tạ Huyết Y","Huyết Y Lãng Tử"],["Phó Tuyết Sơn","Tuyết Sơn Ẩn Giả"],["Dương Nhược Thủy","Thủy Nguyệt Tiên Tử"],["Khương Vô Ngân","Vô Ngân Kiếm Khách"],["Tiêu Hàn Lâm","Hàn Lâm Thư Sinh"],["Âu Dương Khuyết","Khuyết Nguyệt Đạo Nhân"],["Nhạc Thiên Hựu","Hộ Pháp Bất Hủ"],["Trì Mộ Vân","Mộ Vân Tản Nhân"],["Cung Ngọc Lan","Ngọc Lan Tiên Tử"],["Văn Nhân Tuấn","Thiên Thư Sứ Giả"],["Yến Phi Tuyết","Phi Tuyết Kiếm Nữ"],["Lâm Ngạo Sương","Ngạo Sương Hàn Mai"],["Từ Hồng Trần","Hồng Trần Du Hiệp"],["Bùi Thiên Cơ","Thiên Cơ Học Đồ"],["Ôn Như Ngọc","Ôn Ngọc Công Tử"],["Địch Thanh Vân","Thanh Vân Khách"],["Quản Đạo Nguyên","Đạo Nguyên Chân Nhân"],["Thương Nguyệt Hoa","Nguyệt Hoa Thánh Nữ"],["Triệu Cửu Uyên","Cửu Uyên Ma Tôn"],["Hồ Thạch Đầu","Thạch Đầu Hành Giả"],["Kỳ Bạch Lộ","Bạch Lộ Tuyết Linh"],["La Chấn Hải","Chấn Hải Đại Hiệp"],["Mộc Tử Lăng","Tử Lăng Linh Thú Sư"],["Diệp Thu Thủy","Thu Thủy Lưu Quang"]];
N30.forEach(([n,t],j)=>{B.push({n,t,b:.05+.01*j,r:0,v:4+(j*13)%37,p:20+j*2,d:"Tu sĩ đang vươn lên từng ngày"});BH.push(Object.assign({},BD,{h:H30[j],lam:.5+.01*j,dh:3.5}))});
const N10=[
 ["Lăng Tiêu Hàn","Thái Dương Hậu Duệ","Thái Dương Vương Triều — Mỗi 10 ngày kích hoạt 1 lần (lần đầu vào ngày thứ 10), hiệu ứng duy trì 5 ngày. Nếu Lăng Tiêu Hàn đứng hạng 1, hắn nhận buff 35% tỉ lệ xuất hiện cơ duyên. Đứng hạng 2-5: nhận thêm 20% tốc độ tu luyện. Hạng 6-50: mỗi ngày nhận thêm 500 linh lực.",{}],
 ["Mạc Vô Cực","Thái Cổ Kỳ Lân","Khí Vận Dẫn Giả — Cơ duyên xuất hiện nhiều hơn 1,5 lần, kéo dài gấp 2,5 lần.",{lm:1.5,dm:2.5}],
 ["Liễu Như Yên","Mị Thiên Thể","Hồng Nhan Hoạ Thủy — Mỗi 20 ngày, nếu Liễu Như Yên đứng từ hạng 6 trở xuống thì giáng hiệu ứng «Tâm thần điên đảo» lên các tu sĩ hạng 5 trở lên (trừ người chơi và Cố Thái Hư), đồng thời nhận ngay hiệu ứng «Thăng Hoa» trong 5 ngày. «Tâm thần điên đảo» trực tiếp giảm 15% linh lực nhận từ mọi nguồn. «Thăng Hoa» giúp nàng nhận 2k linh lực mỗi ngày.",{}],
 ["Tần Hạo Thiên","Hỗn Độn Thánh Thể","Hỗn Nguyên Tinh Luyện — Lượng linh lực nhận từ tất cả mọi nguồn tăng 20%.",{sm:1.2}],
 ["Giang Thừa Ảnh","Bất Diệt Kim Thân","Bất Diệt Kim Thân — «Nếu ta không diệt, thiên địa diệt». Mỗi Thiên Kiếp giáng xuống có 70% kích hoạt: nhận ngay lượng linh lực chênh lệch với hạng 5 trên bảng xếp hạng. Khi kích hoạt, có 30% nhận chênh lệch với hạng 2 thay vì hạng 5. Mỗi lần kích hoạt còn tăng 10% tốc độ học trong 5 ngày; nếu rơi vào nhánh 30% (hạng 2) thì tăng thêm 10% nữa, tổng 20% trong 5 ngày.",{}],
 ["Phong Vân Tử","Thiên Cơ Diễn Giả","Thiên Cơ Diễn Toán — Cú bật linh lực xuất hiện gấp 2 lần và 60% là bật lên.",{jm:2,jp:.2}],
 ["Đường Thanh Liên","Thanh Liên Đạo Thể","Quang Âm Chân Liên — Giờ học nền mỗi ngày là 24 giờ và không bị giới hạn 24 giờ mỗi ngày như những người khác, nhưng cơ duyên xuất hiện ít hơn 90%, và các cơ duyên cộng linh lực trực tiếp sẽ biến thành trừ linh lực.",{fh:12,cap:Infinity,lm:.1,neg:1}],
 ["Bạch Nhược Hư","Đạo Thiên Chí Tôn","Đạo Vận — Mỗi 10 ngày (bắt đầu có hiệu lực từ ngày 5 của kiếp), cướp toàn bộ tăng trưởng linh lực của hạng 1 trong 3 ngày; nếu hạng 1 là người chơi thì chuyển sang cướp của hạng 2 (cộng dồn với tăng trưởng cá nhân). Có 30% cướp đoạt thất bại.",{}],
 ["Hạ Trường Ca","Vạn Hóa Thần Quân","Hóa Họa Vi Phúc — Hóa Họa: khi bị «Đạo Vận» cướp đoạt, hắn nhận lại 50% phần bị cướp; khi bị «Tâm thần điên đảo», hiệu ứng chỉ còn giảm 7,5% thay vì 15%. Bách Gia Hội Tụ: mỗi loại cơ duyên khác nhau hắn đã gặp trong kiếp tăng 2% hiệu suất tu luyện, tối đa 9 loại (+18%); khi gặp đủ cả 9 loại, hắn nhận ngay 50.000 linh lực một lần mỗi kiếp. Vạn Hóa Quy Nhất: sau khi gặp đủ 9 loại, mỗi ngày hắn tăng thêm 0,3% hiệu suất tu luyện, tối đa +20% (đạt tối đa sau khoảng 67 ngày).",{ht:1}],
 ["Cố Thái Hư","Thái Hư Cổ Long","Thái Hư Bất Thoái — Cú bật linh lực ít hơn 50% nhưng luôn có lợi, không bao giờ suy giảm. Miễn nhiễm Đạo Vận cướp đoạt và hiệu ứng nhận chênh lệch lấy Cố Thái Hư làm đối tượng tham chiếu; đối phương không nhận phần linh lực chênh lệch từ ông. Buff tự thân của đối phương, như tăng tốc độ học, vẫn hoạt động.",{jm:.5,jp:1,sm:1}]
];
N10.forEach(([n,t,d,o])=>{B.push({n,t,b:.5,r:0,v:100,p:60,d,tk:1});BH.push(Object.assign({},BD,{h:12,lam:.9,dh:4},o))});
// Giới tính từng NPC theo thứ tự B (n = nam, u = nữ). 37 nam, 13 nữ.
const GD="nnnnnnnnnnnnununnnunnnnuunuunnnnnunnunuunnunnnunnn";
B.forEach((b,i)=>{b.g=GD[i]==="u"?"nu":"nam"});
const isTK=i=>GameNpcData.isUniqueTalent(i,B);
const BIO10=[
"Miêu Miên Tử vốn là đệ tử ngoại môn của một tiểu tông bên sông. Mỗi trưa vẫn nằm dưới gốc linh thụ già, nửa mơ nửa tỉnh, miệng vẫn lẩm bẩm «mai sẽ khổ luyện». Ba năm trôi qua, đồng môn đã phá bình cảnh, hắn mới vừa vững Luyện Khí. Thế mà mỗi khi tỉnh giấc thật sự, linh lực lại bùng lên một đợt ngắn ngủi khiến cả tông kinh ngạc — rồi lại ngủ tiếp.",
"Diên Thời Tử nổi danh trong giới tu sĩ trẻ với «bí kíp sát kỳ hạn». Cả tháng không động đến kinh thư, đến ba ngày cuối mới đốt đèn suốt canh. Kỳ lạ thay, hắn chưa từng một lần bỏ lỡ thiên kiếp hay hạn cuối của tông môn. Người ta nói đạo tâm của hắn chỉ thức tỉnh khi áp lực đủ lớn.",
"Hàm Ngư Tán Nhân tự nhận mình chỉ là «con cá muối» trong biển tu sĩ. Không tranh, không giành, mỗi ngày chỉ đọc vài trang đạo kinh, luyện vài canh hơi thở. Đồng môn cười chê chậm chạp, nhưng mười năm sau, khi nhiều kẻ bạo phát đã ngã xuống, hắn vẫn bình ổn trên bảng, chậm mà không dừng.",
"Sơ Học Mông Đồng mới nhập môn chưa đầy một năm. Mắt còn tròn xoe, thường luyện sai khẩu quyết khiến linh khí loạn, bị sư huynh sư tỷ trách. Song chưa từng một lần bỏ cuộc. Mỗi lần ngã, hắn đứng dậy lau máu, lại ngồi xuống tiếp. Trong mắt nhiều trưởng lão, đó mới là mầm mống chân chính của đạo.",
"Cần Lao Đạo Nhân xuất thân thợ rèn núi sâu. Cha mẹ không có linh căn, chỉ dạy «chăm chỉ thắng thiên phú». Hắn mang câu ấy vào tông môn, mỗi ngày dậy từ canh năm, luyện đến canh hai. Không có dị tượng, không có cơ duyên lớn, chỉ có mồ hôi và sự bền bỉ khiến tu vi tăng đều như nước chảy đá mòn.",
"Dạ Hành Tử ban ngày ngủ gật trong giảng đường, ban đêm đèn trong động phủ sáng đến tận canh tư. Có người nói hắn là cú đêm đầu thai, có người bảo chỉ là lười buổi sáng. Dù thế nào, những đợt bứt tốc lúc nửa đêm của hắn từng khiến cả bảng Thiên Kiêu rung chuyển trong vài canh giờ — rồi lại lặng xuống chờ lần sau.",
"Trường Chinh Hành Giả mỗi sáng chạy quanh núi bảy vòng trước khi ngồi thiền. Hắn tin cuộc đua dài quan trọng hơn trận chiến ngắn. Không bao giờ bứt tốc điên cuồng, cũng hiếm khi dừng lại. Năm này qua năm khác, tên hắn từ từ leo lên bảng, vững như núi, khó ai kéo xuống.",
"Ẩn Cốc Chân Nhân từng lui về động phủ sâu trong Cửu U Cốc suốt mười tám năm. Không ai biết hắn còn sống hay đã hóa đạo. Một ngày nọ hắn bước ra, linh lực đã ngang hàng các lão tổ, khiến cả Thiên Kiêu Bảng chấn động. Rồi hắn lại biến mất. Mỗi lần xuất hiện là một lần bảng xếp hạng phải viết lại.",
"Linh Đồng Thiên Tài năm tuổi đã đọc hết đạo kinh trong tàng thư các, mười tuổi ngồi giảng đạo cho sư phụ nghe. Thiên phú kinh người, tu tốc khiến đồng môn vừa ghen vừa sợ. Song biến động cũng lớn: có tháng vọt lên đầu bảng, có tháng suýt rớt khỏi top. Không ai đoán được kiếp này hắn sẽ đi đến đâu.",
"Vô Song là Nhân tộc thuần huyết. Xuất thân bần hèn, cha mẹ mất sớm, tứ hải vi gia. Hắn lang bạt sinh tồn, biết bao đêm đói tưởng không sống nổi, bị ức hiếp, chà đạp tàn tạ nhưng hắn cũng vượt qua. Cứ tưởng một kiếp cứ thế trôi qua, nhưng vào đêm hắn 16 tuổi, thức tỉnh phản tổ, nhận được nhân tổ chi huyết, từ đó cải thiện tư chất. Cùng thiên tư trác tuyệt vốn có kết hợp với đã trải qua biết bao gian truân, hắn một đường tiến tới không ai cản được không ai đuổi kịp. Từ đó đổi tên thành Vô Song. Thế nhân khâm phục hắn, vạn tộc truyền rằng: Cái tên Vô Song được viết nên từ không biết bao lần thất bại, vô số đau khổ, chịu được những điều mà không ai có thể gánh vác."
];
const BIO_TK={
 "Phong Vân Tử":"Từ xưa đến nay, thiên cơ khó đoán, tu đạo khó cầu. Truyền nhân của Thiên Cơ các chủ, là Đại Thần Chủ trong 9 vị thần chủ, thiên tư trác tuyệt, thực lực tuyệt luân. Thiên đạo nổi giận can thiệp nhân quả, khiến kiếp số thành vô tử nhất sinh, duyên số suy tàn. Nhưng may mắn nhờ sư phụ lén nhìn thiên cơ, phát hiện hắn lúc nhỏ rồi chịu phản phệ thọ nguyên mang hắn khỏi số phận. Hắn giờ đây có tài năng thiên bẩm, vừa dùng bí pháp diễn toán của Thiên Cơ Các lấy ra cơ duyên của kẻ khác.",
 "Cố Thái Hư":"Cố Thái Hư mang huyết mạch của một trong 11 vị Khai Thiên Thần Thú - Thái Hư Cổ Long. Cũng là thân truyền của vị tiên nhân duy nhất tọa trấn Thái Hư Điện. Tính tình trầm hùng, không kiêu ngạo, ung dung không nhanh không chậm. Từng bước tu luyện của hắn vững trải như núi. Từng lựa chọn như được tính toán cả ngàn năm. Tu vi lẫn mưu kế đều không một bước lùi.",
 "Lăng Tiêu Hàn":"Lăng Tiêu Hàn là truyền nhân trực hệ của Thái Dương. Khác với người Kim Ô cùng là trực hệ có hình dạng yêu thú, hắn sở hữu cơ thể hoàn mỹ của nhân loại. Thái Dương hậu duệ sau nhiều năm ẩn cư nay lấy Thiếu Chủ Lăng Tiêu Hàn làm chủ mà quật khởi. Tiêu Hàn mang một trái tim đầy nhiệt huyết, muốn tìm ra chân đạo của mình và đưa gia tộc lên tới đỉnh cao. Sự kiên định của hắn được người khác khen ngợi là đứng đầu trong thập nhất Thiên Kiêu. Đi kèm với chính hướng lớn lao, khả năng lãnh đạo của hắn cũng tài tình không kém. Là người có tính cách hào sảng và ôn hòa, hắn dùng đức phục nhân, xây dựng thế lực của bản thân ngày càng lớn mạnh, người đi theo hắn đều là trung thần. Vì mang trong người huyết mạch của Thái Dương, hắn có thể dựa trên tín ngưỡng để đạt các tăng phúc ngẫu nhiên.",
 "Hạ Trường Ca":"Hạ Trường Ca vốn là một kẻ hát rong phàm nhân, đi qua trăm tông nghìn phái mà không nhập tông nào. Cuối cùng hắn trở thành tán tu và được tôn xưng là Vạn Hóa Thần Quân. Hắn không nhận đạo của ai làm của mình. Hắn nhặt từng mảnh đạo vụn rơi dọc đường, hát lại thành khúc của riêng mình, nên thiên hạ gọi hắn là Trường Ca. Với hắn, mọi thứ trên đời đều có thể chuyển hóa thành nhau: họa thành phúc, thù thành bạn, mất mát thành con đường tiếp theo. Hắn phóng khoáng, xem danh lợi như phù vân, nhưng cũng không giữ được thứ gì quá lâu: không có sư môn để quay về, không có chốn để dừng chân. Khi Bạch Nhược Hư cướp đoạt thứ của người khác để làm đạo của mình, Hạ Trường Ca chỉ cười, vì thứ đến tay hắn chưa bao giờ cần phải cướp. Kẻ khác sợ họa, còn hắn tin rằng không có họa nào là mãi mãi, chỉ có phúc chưa kịp hóa mà thôi.",
 "Đường Thanh Liên":"Đường Thanh Liên sinh ra đã mang đạo thể thanh liên hiếm có, là hóa thân của một trong 11 vị Khai Thiên Thần Thú - Tiên Thiên Thanh Liên, thiên tư thông minh, đạo tâm vững chắc. Từ khi nàng xuất thế, thiên địa reo vang, vạn linh tín ngưỡng. Bản tính đơn thuần, tính tình lương thiện, không màng danh lợi, một đời một kiếp truy cầu đại đạo. Thiên đạo đố kị anh tài, hạ ấn trảm duyên, phong bế cơ duyên, làm cho nàng vận khí không thông, bị vận mệnh trong cõi U Minh âm thầm phản phệ.",
 "Tần Hạo Thiên":"Hỗn Độn là khởi nguyên của vạn vật, có thể hấp thu mọi loại linh khí với hiệu suất tối đa. Tần Hạo Thiên sinh ra từ Hỗn Độn mang Hỗn Độn Thánh Thể. Hắn có thể hấp thu, tu luyện, ngộ đạo nhanh hơn rất nhiều so với người khác, thiên tư thuộc top đầu trên bảng thiên kiêu. Tính tình kiêu ngạo, hắn khao khát vị trí đệ nhất nhân của Thiên Kiêu bảng.",
 "Mạc Vô Cực":"Từ thuở khai thiên lập địa, thế gian xuất hiện 11 vị cổ thú, được xưng là Khai Thiên Thần Thú. Mỗi cổ thú đại diện cho một loại «Đạo» khác nhau. Và Kỳ Lân - Thần Thú sở hữu Vận Đạo là một trong số đó. Mặc dù Mạc Vô Cực không sở hữu hoàn toàn huyết mạch của thủy tổ nhưng hắn là truyền nhân duy nhất được Lân hồn chọn. Khí vận gia trì, phúc duyên không dứt, con đường tu luyện trải thẳng, tu một tiến mười. So với Thập Nhất Thiên Kiêu đương thời ngộ tính kém nhất nhưng khí vận cũng là một loại tư chất vô cùng khó lường.",
 "Giang Thừa Ảnh":"Giang Thừa Ảnh mang huyết mạch và là thiếu chủ của Thiết Giáp Binh tộc. Từ nhỏ hắn đã không chọn đại đạo của tộc là từ bỏ tiềm năng phát triển để củng cố sức mạnh, mà chọn đi theo con đường của riêng mình. Nên trong thời niên thiếu hắn phải đối mặt vô số lần sinh tử, vì thế khi đại nạn Thiết Giáp tộc ập tới, hắn chỉ có thể vô lực chạy trốn. Và rồi hắn luyện thành Bất Diệt Kim Thân, lấy sức mạnh của thiên kiếp rèn thể, càng đối mặt với sinh tử hắn càng mạnh. Một lòng trả thù hắn không từ thủ đoạn, hắn thề một ngày sẽ trả nợ máu tên tiên nhân đã diệt tộc hắn.",
 "Bạch Nhược Hư":"«Vận mệnh vốn bất công, kẻ là thiên mệnh chi tử làm sao hiểu được đau khổ của phàm nhân?». Đạo Thiên như cái tên, thiên phú độc nhất của hắn là cướp đoạt: đoạt cơ duyên, tu luyện, thân phận của kẻ khác. Mặc dù thiên tư không tệ, nhưng so với các thiên kiêu khác vẫn còn kém xa. Hắn vận dụng thiên phú độc nhất ấy cướp đoạt hết thảy của người khác để đạt được đại đạo của mình. Vì năng lực quá mức bỉ ổi, hắn bị vô số thế lực, thiên kiêu truy sát, thiên địa bất dung.",
 "Liễu Như Yên":"Liễu Như Yên là đại công chúa của Vân Lâm Vương Triều hùng mạnh. Ngày nàng chào đời, Hoá Thần lôi kiếp bất ngờ giáng xuống 10 vị hộ pháp mạnh nhất, cuối cùng chỉ còn một vị may mắn thăng Hoá Thần. Nàng cũng nhận được Mị Thiên Thể. Năm 10 tuổi, một con thái cổ hung thú vô tình tấn công vương triều, khiến nó sụp đổ; nàng thuận lợi bái nhập môn hạ của một vị Đại Thừa cảnh. Năm 15 tuổi, sư phụ nàng gặp trùng kiếp, thần hồn câu diệt, nàng thành công dung nhập Mị Hồn Châu. Tất cả tai hoạ dường như đều không liên quan tới nàng, nhưng tai hoạ nào nàng cũng đạt được lợi ích. Đến nay, nàng là nữ tử đẹp nhất trên Thiên Kiêu Bảng, đi đến thế lực nào thì thế lực đó không suy tàn cũng diệt môn. Thiên tư không cao nhưng tốc độ tu luyện kinh người."
};
const XT=[
"Con út của một gia tộc luyện đan đã sa sút, mang theo vài viên đan dở và một tấm lòng không chịu khuất phục",
"Cô nhi lớn lên trong tàng kinh các, lấy sách làm bạn, lấy chữ làm thầy",
"Thiếu chủ một thương hội linh thạch, bỏ hết gia sản để theo đuổi con đường cầu đạo",
"Đệ tử ngoại môn bị coi thường nhiều năm, mỗi lời chế giễu chỉ khiến đạo tâm thêm cứng cỏi",
"Hậu nhân của một vị trận pháp tông sư đã khuất, mang theo di thư chưa ai giải được",
"Tán tu lang bạt từ nhỏ, tự học thành tài giữa gió mưa và núi rừng",
"Tiểu thư danh môn bỏ nhà đi tìm đạo, cắt đứt tóc xanh để giữ một lời thề",
"Thợ rèn vô danh nơi sơn cốc, một ngày nghe tiếng kiếm kêu mà ngộ ra kiếm ý"
];
const ST=[
"giỏi trận pháp, mỗi đêm đều khắc phù văn đến sáng, tay không lúc nào rời bút lông",
"luyện đan tỉ mỉ, thất bại trăm lần vẫn không nản, khói lò chưa từng tắt",
"kiếm ý sắc bén nhưng ít nói, một kiếm ra tay thì không cần đến kiếm thứ hai",
"đọc hết tàng kinh các trong ba năm, nhớ từng chữ như khắc vào xương",
"tâm tĩnh như nước mùa thu, hiếm khi nổi nóng dù trước mặt thiên kiếp",
"thích đấu pháp, thua một trận là cày thêm ba đêm, thắng cũng không kiêu",
"giỏi ghi chép, mỗi bài học đều chép thành sách, truyền cho hậu bối không giữ riêng",
"bình tĩnh trước lúc độ kiếp, nổi tiếng gan dạ khiến cả tông môn nể phục"
];
const TN=[
"nguyện phá bình cảnh để bảo vệ tông môn khỏi họa diệt môn",
"muốn một lần đứng đầu Thiên Kiêu Bảng, để thiên hạ biết tên",
"chỉ mong tìm lại người thân thất lạc trong biển người tu sĩ",
"muốn viết lại sử sách của tiên môn bằng chính máu và mồ hôi mình",
"quyết trả thù kẻ đã hủy gia tộc, dù phải đi đến tận cùng đạo lộ",
"tìm cách phi thăng để được gặp lại sư phụ đã hóa đạo",
"muốn chứng minh người thường không thiên phú cũng có thể thành tiên",
"chỉ cầu một đời yên ổn bên đèn sách, không tranh không giành"
];
const STG=["Sương đọng đầu vai, một sợi linh khí lách qua kinh mạch như cá nhỏ ngược khe. Đêm dài còn vạn dặm, ngọn đèn trong tay mới vừa nhóm lên.","Móng đạo đã đổ, gió lay không chuyển. Trên bia đá sơn môn có thêm một nét khắc, mực chưa ráo mà người đi qua đã chậm bước.","Đan hỏa bừng trong bụng, một đêm thắp sáng cả sơn môn. Kẻ từng cười người mới nhập môn nay phải đổi cách xưng hô.","Anh nhi phá thể bay ra, nhìn xác thân như nhìn chiếc áo cũ. Cổ thụ trăm năm trước sơn môn rụng lá, như cúi chào.","Thần niệm vươn xa, mây dừng gió ngoảnh. Chỉ cần mở mắt, kẻ có lòng gian đã thấy lạnh sau gáy.","Một bước đạp qua hư không, ngàn dặm gấp lại như tờ giấy. Bậc ẩn cư ngủ trăm năm chợt mở mắt giữa mộng.","Núi là xương, sông là mạch, người đứng đó mà thành một góc đất trời. Rút một sợi tóc, mưa bão cũng đổi hướng.","Đạo quả đã tròn, ngoảnh lại đường xưa chỉ thấy một vệt sáng. Mây tiên ngoài chín tầng trời trải sẵn, chờ người đặt chân.","Phàm cốt tiêu tan, tiên khí quấn thân. Lôi vân tụ trên đầu như bầy thú đói, còn người ngước nhìn, khóe môi khẽ nhếch."];
const NVC_TITLES=["Vô Danh Khách","Khai Nguyên Giả","Tụ Lưu Đạo Nhân","Nghịch Lưu Chân Nhân","Quan Lưu Thần Quân","Đạp Hư Chân Quân","Hợp Lưu Tôn Giả","Quy Nguyên Đại Năng","Nguyên Lưu Chưởng Khống Giả"];
// XT[2] mặc định là nam (Thiếu chủ), XT[6] mặc định là nữ (Tiểu thư): hai câu này đổi theo giới tính của NPC
const XTG={2:{nu:"Nữ thiếu chủ một thương hội linh thạch, bỏ hết gia sản để theo đuổi con đường cầu đạo"},6:{nam:"Công tử danh môn bỏ nhà đi tìm đạo, cắt đứt tóc dài để giữ một lời thề"}};
const bio=i=>{const b=B[i];if(i<10)return BIO10[i];if(b.tk&&BIO_TK[b.n])return BIO_TK[b.n];const g=k=>Math.floor(Math.abs(hs(i+1,70+k,0))*8)%8;const x0=g(0),xt=(XTG[x0]&&XTG[x0][b.g])||XT[x0];return (b.tk?"Thiên phú độc nhất: "+b.d+". ":"")+xt+". "+ST[g(1)]+". Chí hướng: "+TN[g(2)]+".";};
const EC=[],RK=[];let RKn=0;
function advance(M){
  while(RKn<M){
    RKn++;
    const x=[];for(let j=0;j<B.length;j++){cum(j,RKn*60);x.push([j,CD[j][RKn*60]+B[j].p])}
    x.sort((a,b)=>b[1]-a[1]);const r=[];x.forEach((q,k)=>{r[q[0]]=k});RK[RKn]=r;
  }
}
const rkf=(i,m)=>{if(m<=0)return 1;advance(m);return 1+2*Math.pow(RK[m][i]/(B.length-1),1.5)};
/* Thái Dương Vương Triều (Lăng Tiêu Hàn): hạng 1 lúc kích hoạt → ×1,35 tỉ lệ xuất hiện cơ duyên trong cửa sổ 5 ngày (m tính theo giờ mô phỏng) */
function lthM(i,m){
  const w=S.lb&&S.lb.td;if(!w||!w.length||B[i].n!=="Lăng Tiêu Hàn")return 1;
  for(const g of w)if(g.t===1&&m*60>=g.x0&&m*60<g.x1)return 1.35;
  return 1;
}
/* Bách Gia Hội Tụ (Hạ Trường Ca): đếm số loại cơ duyên khác nhau đã xuất hiện; HTC.f[k] = thời điểm (giờ) loại k xuất hiện lần đầu */
const HTC={s:0,f:Array(9).fill(Infinity)};
const htReset=()=>{HTC.s=0;HTC.f.fill(Infinity)};
function htCount(i,t){
  const n=Math.floor(t);
  while(HTC.s<=n){const m=HTC.s++,v=evAt(i,m);if(v&&HTC.f[v.k]===Infinity)HTC.f[v.k]=v.m+v.ph}
  let c=0;for(const x of HTC.f)if(x<=t)c++;
  return c;
}
/* Vạn Hóa Quy Nhất: sau khi gặp đủ 9 loại, mỗi ngày +0,3% hiệu suất, tối đa +20% */
function htLate(t){const T=Math.max(...HTC.f);return isFinite(T)&&T<=t?Math.min(0.2,0.003*(t-T)/24):0}
function htExtra(i,ms){
  if(!BH[i].ht)return 0;
  const t=(ms-S.lb.t0)/SP/60;if(!(t>0))return 0;
  htCount(i,t);
  return HTC.f.every(x=>x<=t)?50000:0;
}
function evAt(i,m){
  const ec=EC[i]||(EC[i]={});if(m in ec)return ec[m];
  const o=BH[i];let r=null;
  if(hs(i+1+KSALT,20,m)>1-o.lam*o.lm*lthM(i,m)*rkf(i,m)/12){
    const a=Math.abs(hs(i+1+KSALT,21,m)),c=Math.abs(hs(i+1+KSALT,22,m)),k=Math.floor(Math.abs(hs(i+1+KSALT,23,m))*9)%9;
    r={i,m,k,c,ph:Math.abs(hs(i+1+KSALT,24,m)),dur:(6+a*18)*o.dm*(k===5?2:1),dh:1+(o.dh*o.dhm-1)*c,flat:Math.round(500+2500*c),name:CDN[k]};
  }
  return ec[m]=r;
}
const FL=[];
function fl(i,n){const c=FL[i]||(FL[i]={});if(c[n])return c[n];const L=[];for(let m=n-79;m<=n;m++){const v=evAt(i,m);if(v&&m+v.ph+v.dur>n)L.push(v)}return c[n]=L}
function eff(i,t){
  const o=BH[i];let h=o.h+o.fh,e=1+o.eb,nv=1;if(o.ht)e*=1+0.02*htCount(i,t)+htLate(t);
  for(const v of fl(i,Math.floor(t))){const st=v.m+v.ph;if(t<st||t>=st+v.dur)continue;
    if(v.k===0||v.k===5)h+=v.dh;else if(v.k===1)e*=1.25+0.35*v.c;else if(v.k===3){nv*=0.35;h+=0.5*v.dh}else if(v.k===6){e*=1.3;h+=1}else if(v.k===7){nv*=2.5;e*=1.4}}
  return {h:Math.min(o.cap,h),e,nv};
}
const hrAt=(i,t)=>eff(i,t).h;
const hrs=(i,n)=>hrAt(i,n+0.5);
const efTxt=e=>GameLeaderboardData.eventEffectText(e,B[e.i],BH[e.i]);
const CH=[],CD=[],SP=60000;
function cum(i,k){
  const c=CH[i]||(CH[i]=[0]),d=CD[i]||(CD[i]=[0]),b=B[i],o=BH[i];
  while(c.length<=k){
    const s=c.length-1,n=Math.floor(s/60),f=eff(i,s/60);
    let bu=0;
    const v=evAt(i,n);
    if(v&&Math.floor((n+v.ph)*60)===s){if(v.k===2)bu=60*(1+b.b)*(2+4*v.c)*o.bm;else if(v.k===4)bu=Math.max(150,0.02*d[s])*o.bm;else if(v.k===8)bu=v.flat*o.bm;if(o.neg)bu=-bu}
    const dr=f.h*60*(1+b.b)/1440*f.e*(1+0.3*vn(i+1+KSALT,9,s/60))+bu;
    let g=hs(i+1+KSALT,1,s)*b.v*0.237*o.vm*f.nv;
    const j=hs(i+1+KSALT,2,s);
    if(Math.abs(j)>1-0.0024*o.jm)g+=(o.jp?(hs(i+1+KSALT,4,s)>-o.jp?1:-1):Math.sign(j))*b.v*1.8*(0.5+Math.abs(hs(i+1+KSALT,3,s)));
    c.push(c[s]+(dr+g)*o.sm);d.push(d[s]+dr*o.sm);
  }
  return c[k];
}
let PI=null,LBALL=false;
const SECTS=[
 {n:"Thiên Kiếm Tông",d:"Lấy kiếm lập đạo, ưa tốc chiến",lore:"Tông môn cổ kính dựng trên đỉnh Vân Kiếm Sơn. Mỗi đệ tử khi nhập môn đều được trao một thanh linh kiếm, lấy kiếm ý làm đạo tâm. Chủ trương «một kiếm phá vạn pháp», thích quyết thắng nhanh gọn. Tàng kiếm các của tông lưu giữ hơn ba ngàn kiếm phổ từ các đời tổ sư."},
 {n:"Huyền Đan Môn",d:"Đan đạo thâm sâu, bền bỉ đường dài",lore:"Nằm giữa thung lũng Đan Hà, khói lò luyện đan chưa từng tắt suốt ngàn năm. Đệ tử Huyền Đan Môn tin rằng đan dược là cầu nối giữa phàm và tiên. Họ kiên nhẫn, tỉ mỉ, coi thất bại trăm lần chỉ là một bước trên đường cầu đạo. Đan phương thượng cổ được giữ bí truyền trong thất đại trưởng lão."},
 {n:"Vạn Pháp Các",d:"Thu thập trăm pháp, giỏi biến hóa",lore:"Một tòa các chín tầng lơ lửng trên hồ Linh Tâm. Bên trong chứa hàng vạn pháp quyết, trận đồ, phù lục thu thập từ khắp Cửu Châu. Đệ tử Vạn Pháp Các không chuyên một môn, mà học đủ trăm nhà rồi dung hợp thành đạo riêng. Người ngoài thường nói: «Vạn Pháp xuất thủ, không ai đoán được chiêu kế tiếp»."},
 {n:"Thái Hư Điện",d:"Cổ tông ẩn thế, nền tảng vững chắc",lore:"Tồn tại từ thời Thái Cổ, ẩn mình trong lớp không gian nứt vỡ của Thái Hư. Ít khi xuất thế, nhưng mỗi lần xuất hiện đều làm chấn động Thiên Kiêu Bảng. Đệ tử Thái Hư Điện tu luyện chậm rãi, xây nền móng vững như núi, tin rằng chỉ có gốc rễ sâu mới chống được thiên kiếp cuối cùng."},
 {n:"Cửu U Cốc",d:"Hành sự quỷ dị, thích bất ngờ",lore:"Nằm sâu trong Cửu U U Minh, nơi ánh sáng mặt trời không bao giờ chạm tới. Đệ tử Cửu U Cốc tu luyện pháp môn âm hàn, thích hành động trong bóng tối và bất ngờ. Nhiều người e sợ, nhưng trong lịch sử Cửu Châu, không ít lần chính họ đã ngăn được đại họa mà các chính đạo không dám đối mặt."},
 {n:"Bách Thảo Đường",d:"Y đạo nhân từ, đồng tâm hiệp lực",lore:"Dựng giữa cánh đồng dược thảo bạt ngàn, Bách Thảo Đường lấy «cứu người» làm tông chỉ. Đệ tử không chỉ giỏi y đạo mà còn hợp lực thành trận, lấy nhu thắng cương. Trong tông môn chiến, họ ít khi dẫn đầu về sát thương, nhưng luôn là chỗ dựa vững chắc khi đồng đạo gặp nạn."}
];
// Sư phụ mỗi tông: điều kiện bái sư + hiệu ứng
const MASTERS=[
 {n:"Kiếm Tôn Bạch Hồng",title:"Trưởng lão Thiên Kiếm",req:"Trúc Cơ trở lên và tổng ≥8 nhiệm vụ",ok:()=>ri(uxp())>=1&&(LS().q||0)>=8,okTxt:()=>ri(uxp())>=1&&(LS().q||0)>=8?"Đã đủ điều kiện":"Cần Trúc Cơ + ≥8 nhiệm vụ",buff:"+8 linh lực cố định mỗi nhiệm vụ từ 45 phút",apply:()=>({fl:8})},
 {n:"Đan Thánh Huyền Cơ",title:"Thái thượng trưởng lão Huyền Đan",req:"Dùng ≥3 vật phẩm và chuỗi ≥3 ngày",ok:()=>(LS().it||0)>=3&&(S.streak.n||0)>=3,okTxt:()=>(LS().it||0)>=3&&(S.streak.n||0)>=3?"Đã đủ điều kiện đan đạo":"Cần dùng ≥3 vật phẩm + chuỗi 3 ngày",buff:"Mỗi lần dùng vật phẩm +10 linh lực",apply:()=>({itemBonus:10})},
 {n:"Pháp Tôn Vạn Tượng",title:"Các chủ Vạn Pháp",req:"Hoàn thành ≥15 nhiệm vụ",ok:()=>(LS().q||0)>=15,okTxt:()=>(LS().q||0)>=15?"Đã đủ kinh nghiệm":"Cần ≥15 nhiệm vụ",buff:"+5% linh lực mọi nhiệm vụ",apply:()=>({mult:1.05})},
 {n:"Thái Hư Lão Tổ",title:"Điện chủ Thái Hư",req:"Chuỗi ≥7 ngày và không tâm ma",ok:()=>(S.streak.n||0)>=7&&!S.tm,okTxt:()=>(S.streak.n||0)>=7&&!S.tm?"Đạo tâm đủ tĩnh":"Cần chuỗi ≥7 ngày, không tâm ma",buff:"Giảm 15% chi phí đổi nhàn hạ",apply:()=>({dc:15})},
 {n:"U Minh Quỷ Tôn",title:"Cốc chủ Cửu U",req:"≥5 nhiệm vụ đêm (22h–5h)",ok:()=>(LS().ni||0)>=5,okTxt:()=>(LS().ni||0)>=5?"Đã quen bóng tối":"Cần ≥5 nhiệm vụ đêm",buff:"Nhiệm vụ đêm +12 linh lực cố định",apply:()=>({fn:12})},
 {n:"Dược Vương Thanh Liên",title:"Đường chủ Bách Thảo",req:"1 thiên kiếp từ Khá trở lên",ok:()=>xr().some(r=>{const me=r.rows.find(z=>z.u);return me&&["Xuất sắc","Giỏi","Khá"].includes(me.g)}),okTxt:()=>xr().some(r=>{const me=r.rows.find(z=>z.u);return me&&["Xuất sắc","Giỏi","Khá"].includes(me.g)})?"Đã đủ":"Cần 1 thiên kiếp từ Khá trở lên",buff:"Khi có tâm ma, mỗi nhiệm vụ +8 linh lực",apply:()=>({ft:8})}
];
function masterBuff(){
  if(S.master==null||S.sect==null||S.master!==S.sect)return {};
  return MASTERS[S.sect].apply()||{};
}
const EP=Date.parse("2026-01-05T00:00:00");
const SO=[],SN=[0,0,0,0,0,0];
function computeSO(){
  const T=S.lb.t0+7*864e5,q=B.map((b,i)=>({i,v:bxp(i,T)})).sort((x,y)=>y.v-x.v),ord=[0,1,2,3,4,5,5,4,3,2,1,0];
  q.forEach((e,k)=>{SO[e.i]=ord[k%12]});SN.fill(0);SO.forEach(s=>SN[s]++);
}
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
function sectStats(now){const A=SECTS.map(()=>({xp:0,n:0}));B.forEach((b,i)=>{A[SO[i]].xp+=bxp(i,now);A[SO[i]].n++});if(S.sect!=null){A[S.sect].xp+=uxp();A[S.sect].n++}return A}
const ugain=(d1,d2)=>GameAnalytics.sumPointsBetween(S.hist,d1,d2);
function warScores(t1,t2,d1,d2){
  // t1,t2 tính theo lịch ảo (có dOff); NPC chạy theo đồng hồ thật nên phải quy đổi, nếu không cửa sổ tuần nằm ở tương lai và NPC luôn 0 điểm
  const sh=(S.dOff||0)*864e5;t1-=sh;t2-=sh;
  const g=SECTS.map(()=>0);
  B.forEach((b,i)=>{g[SO[i]]+=Math.max(0,bxp(i,t2)-bxp(i,t1))});
  if(S.sect!=null)g[S.sect]+=Math.max(0,ugain(d1,d2));
  return g.map((v,s)=>{const n=SN[s]+(S.sect===s?1:0);return n>0?v/n:0});
}
const warPairs=GameSectWar.pairs;
const warFlavor=GameSectWar.flavor;
function warReward(){
  if(S.sect==null)return "";
  const s0=new Date(S.lb.week+"T00:00:00").getTime(),s1=s0+7*864e5,w=Math.round((s0-EP)/6048e5);
  const sc2=warScores(s0,s1,S.lb.week,new Date(s1).toLocaleDateString("sv"));
  const p=warPairs(w).find(q=>q.includes(S.sect));
  if(!p)return "";
  const o=p[0]===S.sect?p[1]:p[0],sa=sc2[S.sect],sb=sc2[o],diff=sa-sb;
  const fl=warFlavor(S.sect,o);
  if(diff>0){
    // Thắng: thưởng theo biên độ thắng, tối thiểu 150, tối đa ~320 + danh hiệu
    let base=modGain(150+Math.min(150,Math.round(diff*0.35))+(eqT("n15")?100:0));
    const bonus=diff>80&&Math.random()<0.35?1:0; // thắng lớn có cơ hội thêm vật phẩm
    S.points+=base;hAdd(today(),base,0);LS().sw=(LS().sw||0)+1;
    let msg=" Tông môn chiến: "+SECTS[S.sect].n+" đại thắng "+SECTS[o].n+" (+"+base+" linh lực)";
    if(bonus){S.inv.ca=(S.inv.ca||0)+1;msg+=" · nhận thêm 1 Tỉnh Thần Linh Trà nhờ công trạng lớn."}
    vlog("Tông môn chiến: "+SECTS[S.sect].n+" thắng "+SECTS[o].n+" ("+fl[0]+"), +"+base+" linh lực"+(bonus?" +Tỉnh Thần Linh Trà":""));
    return msg+".";
  }
  // Thua: an ủi nhỏ + lời khích lệ
  const consol=modGain(Math.min(40,Math.round(Math.abs(diff)*0.08)+15));
  S.points+=consol;hAdd(today(),consol,0);
  vlog("Tông môn chiến: "+SECTS[S.sect].n+" thua "+SECTS[o].n+" ("+fl[0]+"), nhận "+consol+" linh lực an ủi");
  return " Tông môn chiến: "+SECTS[S.sect].n+" thua "+SECTS[o].n+". Thiên Đạo ban "+consol+" linh lực an ủi — thất bại cũng là tu luyện.";
}
function miles(i){
  const out=[];
  if(i<0){let c=0,k=0;Object.keys(S.hist).sort().forEach(d=>{c+=S.hist[d].p;while(k<RL.length&&c>=RL[k][1]){out.push([k,new Date(d+"T12:00:00").getTime()]);k++}});return out}
  const now=Date.now(),H=36e5,cur=ri(sc(i,now));let r=0;
  for(let t=S.lb.t0;r<=cur&&r<RL.length;t+=H){const tt=Math.min(t,now);while(r<=cur&&r<RL.length&&sc(i,tt)>=RL[r][1]){out.push([r,tt]);r++}if(tt>=now)break}
  return out;
}
function renderProf(){
  const el=$("prof");if(PI==null){el.innerHTML="";return}
  const u=PI<0,i=PI,now=Date.now(),n0=Math.floor((now-S.lb.t0)/36e5),b=u?null:B[i],xp=u?uxp():bxp(i,now),k=ri(xp);
  const sect=u?(S.sect!=null?SECTS[S.sect].n:"Chưa gia nhập tông môn"):SECTS[SO[i]].n;
  const bt=u?"Nguyên Lưu Chi Chủ, kẻ xuyên không đứng ngoài vòng vận mệnh, thân phận thần bí, thực lực khủng bố, khiến cả thiên kiêu cũng phải kiêng dè"+(TITLES.some(t=>t.id===S.title&&tok(t))?", mang danh hiệu "+TITLES.find(t=>t.id===S.title).n:"")+".":bio(i);
  const rankTxt=u?("Hạng "+myRk()+" trên Thiên Kiêu Bảng"):("Hạng "+rkNow(i)+" trên Thiên Kiêu Bảng");
  const nm=u?(S.name||"Bạn"):b.n;
  const avP=u?portrait(nm,{player:1,w:56,h:56}):portrait(nm,{w:56,h:56}),tk=!u&&isTK(i);
  const talentHtml=tk&&b&&b.d?(()=>{const parts=b.d.split(" — "),name=parts.shift(),desc=parts.join(" — ");return `<section class="prof-talent" aria-label="Thiên phú"><div class="prof-talent-tag">✦ THIÊN PHÚ ĐỘC NHẤT</div><h3>${esc(name)}</h3><p>${esc(desc||"Thiên phú chưa được ghi chép.")}</p></section>`})():"";
  const htHtml=(!u&&BH[i].ht)?(()=>{const t=Math.max(0,(now-S.lb.t0)/SP/60),c=htCount(i,t);return `<section class="prof-talent" aria-label="Cơ duyên đã đạt"><div class="prof-talent-tag">✦ CƠ DUYÊN ĐÃ ĐẠT</div><h3>Bách Gia Hội Tụ: ${c}/9 loại · +${Math.round((c*2+htLate(t)*100)*10)/10}% hiệu suất</h3><ul style="list-style:none;padding:0;margin:8px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px">${CDN.map((n,k)=>{const f=HTC.f[k],got=f<=t;return `<li style="${got?"color:var(--gold)":"opacity:.5"}">${got?"✔":"○"} ${esc(n)}${got?` <small>(ngày ${Math.floor(f/24)+1})</small>`:""}</li>`}).join("")}</ul>${c>=9?`<p style="margin-top:8px">Đã gặp đủ 9 loại, nhận 50.000 linh lực thưởng. Vạn Hóa Quy Nhất đang tăng: +${Math.round(htLate(t)*1000)/10}% (tối đa +20%).</p>`:""}</section>`})():"";
  el.innerHTML=`<div class="box prof-card" style="margin-bottom:14px"><div class="row prof-head${tk?" tkf tkh":""}" style="margin:0;align-items:flex-start">${avP}<div class="prof-head-info" style="flex:1;min-width:0"><h2 style="margin:0">${nm}</h2><small>${u?"":b.t+", "}${sect} · ${rankTxt}</small></div><button class="del" data-a="pc" aria-label="Đóng">×</button></div><div class="num prof-realm">${rname(xp)}</div>${u?`<small style="display:block;margin:2px 0 4px;letter-spacing:.04em">«${NVC_TITLES[k]}»</small>`:""}<small>Linh lực ${Math.round(xp)}${u?"":", giờ học "+hrs(i,n0).toFixed(1)+" giờ/ngày"}</small><section class="prof-bio"><h3 class="prof-section-title">Tiểu sử</h3><p class="prof-copy">${esc(bt)}</p></section>${talentHtml}${htHtml}<p class="prof-rank-note">${esc(STG[k])}</p><h3 class="prof-section-title">Lịch sử tu vi</h3><ul class="prof-history">${miles(PI).map(m=>`<li><div class="nm">${RL[m[0]][0]}<small>${fmtT(m[1])}</small></div></li>`).join("")||`<li class="empty" style="display:block">Chưa có mốc nào.</li>`}</ul></div>`;
}
function renderSect(){
  const now=Date.now(),A=sectStats(now),ord=[0,1,2,3,4,5].sort((a,b)=>A[b].xp/A[b].n-A[a].xp/A[a].n);
  const ws=new Date(weekStart()+"T00:00:00").getTime(),w=Math.round((ws-EP)/6048e5),ps=ws-7*864e5;
  const cur=warScores(ws,now+(S.dOff||0)*864e5,weekStart(),"9999"),prv=warScores(ps,ws,new Date(ps).toLocaleDateString("sv"),weekStart());
  const myContrib=S.sect!=null?Math.round(ugain(weekStart(),"9999")):0;
  const card=(pairs,v,live)=>pairs.map(([a,b])=>{
    const sa=v[a]||0,sb=v[b]||0,t=sa+sb||1,mine=a===S.sect||b===S.sect;
    const lead=sa>=sb?a:b,diff=Math.abs(sa-sb),pct=(sa+sb)>0?Math.round(sa/t*100):50;
    const fl=warFlavor(a,b);
    let st="";
    if(live){
      if(diff<8)st="Ngang ngửa, chưa phân thắng bại";
      else if(lead===S.sect)st="Tông môn bạn đang dẫn trước · "+Math.round(diff)+" điểm";
      else if(mine)st="Tông môn bạn đang bị dẫn · kém "+Math.round(diff)+" điểm";
      else st=SECTS[lead].n+" đang dẫn";
    }else st="Thắng: "+SECTS[lead].n+(diff>=50?" (đại thắng)":diff>=20?" (thắng rõ)":" (thắng sát nút)");
    return `<li class="${mine?"now":""}" style="display:block">
      <div class="row" style="margin:0"><b style="flex:1">${SECTS[a].n}</b><b>${Math.round(sa)}</b></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="row" style="margin:0"><b style="flex:1">${SECTS[b].n}</b><b>${Math.round(sb)}</b></div>
      <small>${fl[0]} — ${fl[1]}</small>
      <small style="display:block;margin-top:2px">${st}</small>
    </li>`}).join("");
  // Bảng xếp hạng theo điểm chiến tuần này
  const warOrd=[0,1,2,3,4,5].sort((a,b)=>cur[b]-cur[a]);
  let h="";
  if(S.sect==null){
    h=`<div class="box"><h2>Bạn chưa có tông môn</h2><small>Gia nhập một tông môn bên dưới. Mỗi tuần tông môn của bạn sẽ đấu với một tông khác. Đóng góp linh lực bằng cách hoàn thành nhiệm vụ — càng học nhiều, tông môn càng mạnh. Thắng nhận thưởng lớn, thua vẫn nhận linh lực an ủi.</small></div>`;
  }else{
    const p=warPairs(w).find(q=>q.includes(S.sect));
    const o=p?(p[0]===S.sect?p[1]:p[0]):null;
    const sa=cur[S.sect]||0,sb=o!=null?cur[o]:0,diff=sa-sb;
    let status="Chưa có đối thủ tuần này.";
    if(o!=null){
      if(diff>15)status="Đang dẫn trước "+SECTS[o].n+" · +"+Math.round(diff)+" điểm. Giữ vững!";
      else if(diff<-15)status="Đang bị "+SECTS[o].n+" dẫn · kém "+Math.round(-diff)+" điểm. Hãy cày thêm nhiệm vụ!";
      else status="Ngang ngửa với "+SECTS[o].n+". Mỗi nhiệm vụ đều có thể lật kèo.";
    }
    const M=MASTERS[S.sect],hasM=S.master===S.sect,canBai=M.ok();
    h=`<div class="box"><span class="lbl">Tông môn của bạn</span><div class="num">${SECTS[S.sect].n}</div>
      <small style="display:block;line-height:1.55;margin-top:4px">${SECTS[S.sect].lore}</small>
      <small style="display:block;margin-top:6px">Hạng tổng ${ord.indexOf(S.sect)+1}/6 · Hạng chiến tuần ${warOrd.indexOf(S.sect)+1}/6</small>
      <small style="display:block;margin-top:4px">Đóng góp tuần này của bạn: <b style="color:var(--gold)">${myContrib}</b> linh lực</small>
      <small style="display:block;margin-top:2px;color:var(--mute)">${status}</small></div>`;
    h+=`<div class="box"><h2>Bái sư</h2>
      <div class="row" style="margin:0"><b style="flex:1">${M.n}</b><span class="pb">${M.title}</span></div>
      <small style="display:block;margin-top:6px;line-height:1.55"><b>Điều kiện:</b> ${M.req}</small>
      <small style="display:block;margin-top:4px;line-height:1.55"><b>Hiệu ứng khi thụ giáo:</b> ${M.buff}</small>
      <small style="display:block;margin-top:4px;color:var(--mute)">Trạng thái: ${M.okTxt()}</small>
      ${hasM
        ?`<small style="display:block;margin-top:8px;color:var(--jade)">Đã bái sư — đang thụ giáo. Buff đang có hiệu lực (xem ô hiệu ứng).</small>
          <div class="row" style="margin-top:8px"><button class="btn alt" style="margin-left:0" data-a="unbai">Hủy bái sư</button></div>
          <small style="display:block;margin-top:4px;color:var(--mute)">Hủy sẽ mất buff ngay. Có thể bái lại khi đủ điều kiện.</small>`
        :`<div class="row" style="margin-top:10px"><button class="btn" style="margin-left:0" data-a="bai" ${canBai?"":"disabled"}>${canBai?"Bái sư ngay":"Chưa đủ điều kiện"}</button></div>`}
    </div>`;
    const sms=sectMissions();
    h+=`<div class="box"><h2>Nhiệm vụ tông · tuần này</h2><small>Hoàn thành để nhận linh lực và đóng góp danh dự tông môn. Làm mới mỗi tuần.</small>`+
      sms.map(m=>{const cur=Math.min(m.met(),m.need),got=S.sm&&S.sm.got[m.id];
        return `<div style="margin-top:10px"><b>${m.n}</b><br><small>${m.d}: ${cur}/${m.need}</small>
          <div class="bar"><i style="width:${Math.round(cur/m.need*100)}%"></i></div>
          <button class="btn" style="margin-left:0;margin-top:4px" data-a="sm" data-id="${m.id}" ${got||cur<m.need?"disabled":""}>${got?"Đã nhận":"Nhận +"+m.r}</button></div>`;
      }).join("")+`</div>`;
  }
  h+=`<div class="box"><h2>Xếp hạng tông môn</h2><small>Theo linh lực bình quân toàn bộ (không chỉ tuần này).</small><ul>${ord.map((s,k)=>`<li class="${s===S.sect?"now":""}"><b style="width:22px">${k+1}</b><div class="nm">${SECTS[s].n}<small>${SECTS[s].d}, ${A[s].n} đệ tử</small></div><b>${Math.round(A[s].xp/A[s].n)}</b>${s===S.sect?"":`<button class="btn alt" data-a="sj" data-id="${s}">${S.sect==null?"Gia nhập":"Chuyển (100 linh lực)"}</button>`}</li>`).join("")}</ul></div>`;
  h+=`<div class="box"><h2>Tông môn chiến tuần này</h2>
    <small>Điểm = linh lực trung bình mỗi đệ tử kiếm được từ thứ Hai đến nay. Tông đông người không được lợi. Học nhiều = đóng góp lớn. Thắng theo biên độ nhận thưởng cao hơn, thắng lớn có cơ hội thêm bảo vật.</small>
    <ul>${card(warPairs(w),cur,true)}</ul></div>`;
  h+=`<div class="box"><h2>Bảng điểm chiến tuần</h2><ul>${warOrd.map((s,k)=>`<li class="${s===S.sect?"now":""}"><b style="width:22px">${k+1}</b><div class="nm">${SECTS[s].n}</div><b>${Math.round(cur[s])}</b></li>`).join("")}</ul></div>`;
  h+=`<div class="box"><h2>Tuần trước</h2><ul>${card(warPairs(w-1),prv,false)}</ul></div>`;
  $("sect").innerHTML=h;
}
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
function renderVan(){
  lbInit();
  const now=Date.now(),H=36e5,t0=S.lb.t0,L=recentEv(),n0=Math.floor((now-t0)/H),end=e=>t0+(e.m+e.ph+e.dur)*H,act=L.filter(e=>end(e)>now);
  let h=`<div class="box"><h2>Nhật ký của bạn</h2><ul>${(S.vlog||[]).slice(0,8).map(x=>`<li><div class="nm">${esc(x.t)}<small>${fmtT(x.ts)}</small></div></li>`).join("")||`<li class="empty" style="display:block">Chưa có hoạt động. Hoàn thành nhiệm vụ để ghi vào đây.</li>`}</ul></div>`;
  h+=`<div class="box"><h2>Đang diễn ra</h2>${act.length?`<ul>${act.map(e=>`<li><div class="nm">${B[e.i].n}: ${e.name}<small>${efTxt(e)}, còn ${Math.ceil((end(e)-now)/H)} giờ</small></div><b>${hrs(e.i,n0).toFixed(1)}h</b></li>`).join("")}</ul>`:`<small>Chưa có cơ duyên nào.</small>`}</div>`;
  h+=`<div class="box"><h2>Top 10 hiện tại</h2><ul><li class="now"><div class="nm">Bạn<small>${rname(uxp())}, Hạng ${myRk()} trên Thiên Kiêu Bảng</small></div><b>${((S.hist[today()]||{m:0}).m/60).toFixed(1)} giờ hôm nay</b></li>${B.map((b,i)=>({b,i})).sort((x,y)=>sc(y.i,now)-sc(x.i,now)).slice(0,10).map(({b,i})=>`<li><div class="nm">${b.n}<small>${rname(bxp(i,now))}, Hạng ${rkNow(i)} trên Thiên Kiêu Bảng</small></div><b>${hrs(i,n0).toFixed(1)} giờ/ngày</b></li>`).join("")}</ul></div>`;
  h+=`<div class="box"><h2>Dòng sự kiện (3 ngày gần nhất)</h2><ul>${L.slice(0,25).map(e=>{
    const st=t0+(e.m+e.ph)*H,en=end(e),af=Math.min(now,en),r0=rkAt(e.i,st),r1=rkAt(e.i,af),dr=r0-r1;
    return `<li><div class="nm">${B[e.i].n}: ${e.name}<small>${fmtT(st)}, ${efTxt(e)}, trong ${Math.round(e.dur)} giờ${en>now?" (đang diễn ra)":""}</small><small>Giờ học ${hrAt(e.i,e.m+e.ph-0.01).toFixed(1)} → ${hrAt(e.i,e.m+e.ph+0.01).toFixed(1)} giờ/ngày. Tu vi ${rname(bxp(e.i,st))} → ${rname(bxp(e.i,af))} (+${Math.round(bxp(e.i,af)-bxp(e.i,st))} linh lực). Hạng ${r0} → ${r1}${dr?(dr>0?" ▲"+dr:" ▼"+(-dr)):""}</small></div></li>`}).join("")}</ul></div>`;
  h+=spStatsHtml();
  $("van").innerHTML=h;
}
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
const bsX=(i,x)=>{const k=Math.floor(x);if(k<0)return B[i].p;const f=x-k;return B[i].p+cum(i,k)*(1-f)+cum(i,k+1)*f};
// Bất Diệt Kim Thân: cửa sổ buff tốc độ học (x0..x1 theo phút mô phỏng, m = +10% hoặc +20%)
function gbExtra(i,ms,fn){
  const w=S.lb&&S.lb.gb;if(!w||!w.length||B[i].n!=="Giang Thừa Ảnh")return 0;
  const x=(ms-S.lb.t0)/SP;let t=0;
  for(const g of w){const x1=Math.min(x,g.x1);if(x1>g.x0)t+=g.m*(fn(i,x1)-fn(i,g.x0))}
  return t;
}
/* ===== Đạo Vận (Bạch Nhược Hư) =====
   Mỗi 10 ngày kể từ ngày 5 của kiếp, cướp toàn bộ tăng trưởng linh lực của hạng 1 (không tính chính hắn) trong 3 ngày.
   Hạng 1 là người chơi → cướp của hạng 2. 30% thất bại. Cướp được cộng dồn với tăng trưởng cá nhân; nạn nhân mất đúng phần bị cướp.
   Cửa sổ được chốt (người bị cướp, thành/bại) một lần khi tới giờ và lưu ở S.lb.dv. */
let BNH_I=-2,BNH_BUSY=0;
const bnhI=()=>BNH_I>=-1?BNH_I:(BNH_I=B.findIndex(b=>b.n==="Bạch Nhược Hư"));
const immuneTaiHu=i=>GameNpcData.isImmuneTaiHu(i,B);
const bnhBase=()=>{const k=KS().start,b=(k-S.lb.t0)/SP;return isFinite(b)?b:0};
const bnhX0=w=>bnhBase()+(4+10*w)*1440;
function bnhSync(){
  if(BNH_BUSY||!S.lb)return;const bi=bnhI();if(bi<0)return;
  if(!S.lb.dv)S.lb.dv=[];
  const now=Date.now();
  if(now<S.lb.t0+bnhX0(S.lb.dv.length)*SP)return;
  BNH_BUSY=1;
  try{
    while(S.lb.dv.length<60){
      const w=S.lb.dv.length,x0=bnhX0(w),ms=S.lb.t0+x0*SP;if(now<ms)break;
      const rows=[];
      for(let j=0;j<B.length;j++)if(j!==bi)rows.push({j,s:sc(j,ms)});
      rows.push({j:-1,s:playerXpAt(new Date(ms))});
      rows.sort((a,b)=>b.s-a.s);
      let tg=rows[0];if(tg&&tg.j===-1)tg=rows[1];
       const immune=!!tg&&immuneTaiHu(tg.j),ok=!immune&&Math.abs(hs(bi+1+KSALT,330,w))>=.3;
       S.lb.dv.push({x0,x1:x0+3*1440,v:tg?tg.j:-1,ok,immune});
       vlog(immune?"Thái Hư Bất Thoái: Cố Thái Hư miễn nhiễm Đạo Vận; Bạch Nhược Hư không cướp được tăng trưởng.":ok&&tg?"Đạo Vận: Bạch Nhược Hư cướp tăng trưởng linh lực của "+B[tg.j].n+" trong 3 ngày.":"Đạo Vận: Bạch Nhược Hư cướp đoạt thất bại.");
    }
  }finally{BNH_BUSY=0}
}
function bnhExtra(i,ms,fn){
  const w=S.lb&&S.lb.dv;if(!w||!w.length)return 0;
  const bi=bnhI();let t=0;const x=(ms-S.lb.t0)/SP;
  for(const g of w){
    if(!g.ok||g.v<0||immuneTaiHu(g.v)||(i!==bi&&i!==g.v))continue;
    const x1=Math.min(x,g.x1);if(x1<=g.x0)continue;
    const d=Math.max(0,fn(g.v,x1)-fn(g.v,g.x0));
    t+=i===bi?d:-d*(B[i].n==="Hạ Trường Ca"?.5:1);
  }
  return t;
}
/* ===== Hồng Nhan Hoạ Thủy (Liễu Như Yên) =====
   Mỗi 20 ngày (mốc ngày 20, 40, ... của kiếp): nếu Liễu đứng hạng 6 trở xuống thì
   - hạng 1-5 (trừ người chơi và Cố Thái Hư) chịu «Tâm thần điên đảo»: -15% linh lực nhận từ mọi nguồn trong 5 ngày;
   - Liễu nhận «Thăng Hoa» trong 5 ngày: +2.000 linh lực mỗi ngày.
   Cửa sổ được chốt một lần khi tới giờ và lưu ở S.lb.hh. */
let LNY_I=-2,LNY_BUSY=0;
const lnyI=()=>LNY_I>=-1?LNY_I:(LNY_I=B.findIndex(b=>b.n==="Liễu Như Yên"));
const lnyX0=w=>bnhBase()+20*(w+1)*1440;
function lnySync(){
  if(LNY_BUSY||!S.lb)return;const li=lnyI();if(li<0)return;
  if(!S.lb.hh)S.lb.hh=[];
  const now=Date.now();
  if(now<S.lb.t0+lnyX0(S.lb.hh.length)*SP)return;
  LNY_BUSY=1;
  try{
    while(S.lb.hh.length<40){
      const w=S.lb.hh.length,x0=lnyX0(w),ms=S.lb.t0+x0*SP;if(now<ms)break;
      const rows=B.map((b,j)=>({j,s:sc(j,ms)}));
      rows.push({j:-1,s:playerXpAt(new Date(ms))});
      rows.sort((a,b)=>b.s-a.s);
      const rk=rows.findIndex(r=>r.j===li)+1,on=rk>=6?1:0;
      const tg=on?rows.slice(0,5).filter(r=>r.j>=0&&!immuneTaiHu(r.j)).map(r=>r.j):[];
      S.lb.hh.push({x0,x1:x0+5*1440,on,tg});
      vlog(on?"Hồng Nhan Hoạ Thủy: Liễu Như Yên đứng hạng "+rk+", giáng «Tâm thần điên đảo» (-15% linh lực mọi nguồn, 5 ngày) lên "+(tg.length?tg.map(j=>B[j].n).join(", "):"không ai")+" và nhận «Thăng Hoa» (+2.000 linh lực/ngày, 5 ngày).":"Hồng Nhan Hoạ Thủy: Liễu Như Yên đứng hạng "+rk+" nên không kích hoạt.");
    }
  }finally{LNY_BUSY=0}
}
function lnyExtra(i,ms,fn){
  const w=S.lb&&S.lb.hh;if(!w||!w.length)return 0;
  const li=lnyI(),x=(ms-S.lb.t0)/SP;let t=0;
  for(const g of w){
    if(!g.on)continue;
    const x1=Math.min(x,g.x1);if(x1<=g.x0)continue;
    if(i===li)t+=2000*(x1-g.x0)/1440;
    else if(g.tg.indexOf(i)>=0)t-=(B[i].n==="Hạ Trường Ca"?.075:.15)*Math.max(0,fn(i,x1)-fn(i,g.x0));
  }
  return t;
}
/* ===== Thái Dương Vương Triều (Lăng Tiêu Hàn) =====
   Mỗi 10 ngày kích hoạt 1 lần (lần đầu vào ngày 10 của kiếp), hiệu ứng kéo dài 5 ngày. Hạng được chốt đúng lúc kích hoạt:
   - hạng 1: ×1,35 tỉ lệ xuất hiện cơ duyên (xử lý trong evAt qua lthM);
   - hạng 2-5: +20% tốc độ tu luyện (cộng thêm 20% phần linh lực tăng trong 5 ngày);
   - hạng 6-50: +500 linh lực mỗi ngày.
   Cửa sổ được chốt một lần khi tới giờ và lưu ở S.lb.td. Khi chốt cửa sổ hạng 1 thì xóa cache mô phỏng từ mốc đó trở đi. */
let LTH_I=-2,LTH_BUSY=0;
const lthI=()=>LTH_I>=-1?LTH_I:(LTH_I=B.findIndex(b=>b.n==="Lăng Tiêu Hàn"));
const lthX0=w=>bnhBase()+10*(w+1)*1440;
function lthInval(x0){
  const kx=Math.floor(x0),hm=Math.ceil(x0/60);
  for(let j=0;j<B.length;j++){
    if(CH[j]&&CH[j].length>kx+1)CH[j].length=kx+1;
    if(CD[j]&&CD[j].length>kx+1)CD[j].length=kx+1;
    const ec=EC[j];if(ec)for(const m in ec)if(+m>=hm)delete ec[m];
    const fc=FL[j];if(fc)for(const n in fc)if(+n>=hm)delete fc[n];
  }
  RKn=Math.min(RKn,Math.max(0,hm-1));RK.length=Math.min(RK.length,RKn+1);htReset();
}
function lthSync(){
  if(LTH_BUSY||!S.lb)return;const li=lthI();if(li<0)return;
  if(!S.lb.td)S.lb.td=[];
  const now=Date.now();
  if(now<S.lb.t0+lthX0(S.lb.td.length)*SP)return;
  LTH_BUSY=1;
  try{
    while(S.lb.td.length<12){
      const w=S.lb.td.length,x0=lthX0(w),ms=S.lb.t0+x0*SP;if(now<ms)break;
      const rows=B.map((b,j)=>({j,s:sc(j,ms)}));
      rows.push({j:-1,s:playerXpAt(new Date(ms))});
      rows.sort((a,b)=>b.s-a.s);
      const rk=rows.findIndex(r=>r.j===li)+1,t=rk===1?1:rk<=5?2:rk<=50?3:0;
      S.lb.td.push({x0,x1:x0+5*1440,t,rk});
      if(t===1)lthInval(x0);
      vlog(t===1?"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng 1, cơ duyên xuất hiện thường xuyên hơn 35% trong 5 ngày."
        :t===2?"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng "+rk+", nhận thêm 20% tốc độ tu luyện trong 5 ngày."
        :t===3?"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng "+rk+", mỗi ngày nhận thêm 500 linh lực trong 5 ngày."
        :"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng "+rk+" nên không nhận hiệu ứng.");
    }
  }finally{LTH_BUSY=0}
}
function lthExtra(i,ms,fn){
  const w=S.lb&&S.lb.td;if(!w||!w.length||i!==lthI())return 0;
  const x=(ms-S.lb.t0)/SP;let t=0;
  for(const g of w){
    const x1=Math.min(x,g.x1);if(x1<=g.x0)continue;
    if(g.t===2)t+=.2*(fn(i,x1)-fn(i,g.x0));
    else if(g.t===3)t+=500*(x1-g.x0)/1440;
  }
  return t;
}
const bs=(i,ms)=>{bnhSync();lnySync();lthSync();return bsX(i,(ms-S.lb.t0)/SP)+spExtra(i,ms,bsX)+gbExtra(i,ms,bsX)+bnhExtra(i,ms,bsX)+lnyExtra(i,ms,bsX)+lthExtra(i,ms,bsX)+htExtra(i,ms)};
/* ===== Cơ duyên đặc biệt (chỉ 3 hạng cuối) =====
   Mỗi lần chốt bảng tuần, mỗi nhân vật đứng 3 hạng cuối quay một lần: 20% Chi Lực, 20% Gia Tốc, 20% Khai Ân, 40% không có.
   Một nhân vật chỉ giữ một cơ duyên đặc biệt tại một thời điểm. Hiệu lực đến thiên kiếp kế tiếp (chỉ riêng người đó). */
const SPQ=[
 {n:"Thiên Đạo Chi Lực",p:.2,npc:120,pl:30,pd:"+30 linh lực cố định mỗi nhiệm vụ",nd:"+120 linh lực mỗi ngày"},
 {n:"Thiên Đạo Gia Tốc",p:.2,mul:.4,mul2:1.4,pd:"linh lực nhận từ nhiệm vụ ×1,4",nd:"tốc độ tăng linh lực +40% (phần linh lực tăng thêm kể từ lúc nhận)"},
 {n:"Thiên Đạo Khai Ân",p:.2,f:.8,pd:"giảm 20% mốc linh lực, chuỗi đạo tâm và mức tu vi yêu cầu của thiên kiếp kế tiếp",nd:"giảm 20% mốc linh lực và chuỗi đạo tâm yêu cầu của thiên kiếp kế tiếp"}
];
const spA=()=>S.sp&&!(S.sem&&S.sem.res&&S.sem.res[S.sp.ex])?S.sp:null;
const spK=()=>{const p=spA();return p?p.k:-1};
const spKn=(i,e)=>{const p=S.lb&&S.lb.sp&&S.lb.sp[i];return p&&p.ex===e.id?p.k:-1};
const spE=(e,k)=>k===2?Object.assign({},e,{chuan:Math.round(e.chuan*SPQ[2].f),ls:Math.max(1,Math.round(e.ls*SPQ[2].f))}):e;
const nextEx=()=>EX.find(e=>e.day<KD&&!(S.sem&&S.sem.res[e.id])&&exD(e).getTime()>Date.now());
const spUntil=p=>{const e=EX.find(z=>z.id===p.ex);return e?(exD(e).getTime()+(KS().skx||0)-S.lb.t0)/SP:Infinity};
// Phần linh lực NPC được cộng thêm từ cơ duyên đặc biệt đang hiệu lực (tính theo bước mô phỏng x)
function spExtra(i,ms,fn){
  const p=S.lb&&S.lb.sp&&S.lb.sp[i];if(!p||p.k===2)return 0;
  const x1=Math.min((ms-S.lb.t0)/SP,spUntil(p));if(x1<=p.x0)return 0;
  return p.k===0?SPQ[0].npc*(x1-p.x0)/1440:SPQ[1].mul*(fn(i,x1)-fn(i,p.x0));
}
function lbRows(){const t=Date.now(),rows=B.map((b,i)=>({n:b.n,s:Math.max(0,bs(i,t)+(S.lb.adj[i]||0)),i,u:0}));rows.push({n:S.name||"Bạn",s:S.points,u:1});return GameLeaderboardData.rankRows(rows)}
function spRoll(rows,seed){
  if(!S.lb.sp)S.lb.sp={};if(!S.lb.spl)S.lb.spl=[];
  const nx=nextEx(),got=[];if(!nx)return got;
  const eligible=rows.filter(r=>r.rank>=rows.length-2&&!(r.u?spA():S.lb.sp[r.i]));
  GameLeaderboardData.rollSpecial(eligible,seed,KSALT,hs).forEach(({row:r,k})=>{
    if(r.u){S.sp={k,ex:nx.id,t:Date.now()};vlog("Cơ duyên đặc biệt: "+SPQ[k].n+" — hiệu lực đến "+nx.n)}
    else S.lb.sp[r.i]={k,ex:nx.id,x0:(Date.now()-S.lb.t0)/SP};
    S.lb.spl.unshift({t:Date.now(),n:r.n,u:r.u?1:0,k,ex:nx.id});got.push({n:r.u?"bạn":r.n,k,u:r.u?1:0});
  });
  S.lb.spl.length=Math.min(S.lb.spl.length,60);
  return got;
}
// Hết thiên kiếp e: cơ duyên đặc biệt gắn với kiếp này hết hạn; phần linh lực NPC đã nhận được giữ lại
function spRetire(e,dn){
  if(S.lb&&S.lb.sp){
    if(!S.lb.spx)S.lb.spx={};
    for(const k in S.lb.sp){const p=S.lb.sp[k];if(p.ex!==e.id)continue;const i=+k;
      if(p.k!==2){S.lb.adj[i]=(S.lb.adj[i]||0)+spExtra(i,dn,bsX);S.lb.spx[i]=(S.lb.spx[i]||0)+spExtra(i,dn,bxX)}
      delete S.lb.sp[k]}
  }
  if(S.sp&&S.sp.ex===e.id)S.sp=null;
}
const BAL_RANK=40,BAL_MULT=1.25; // Hạng 40 trở xuống nhận Thiên Đạo Cân Bằng (+25% tốc độ)
const sc=(i,ms)=>Math.max(0,bs(i,ms)+(S.lb.adj[i]||0)+(S.lb.bal&&S.lb.bal[i]||0));
function lbInit(){if(!S.lb)S.lb={t0:Date.now()-24*3600000,week:weekStart(),adj:Array(50).fill(0),bal:Array(50).fill(0),log:""};if(!S.lb.bal)S.lb.bal=Array(50).fill(0);if(!S.lb.sp)S.lb.sp={};if(!S.lb.spx)S.lb.spx={};if(!S.lb.spl)S.lb.spl=[];if(!S.lb.gb)S.lb.gb=[];if(!S.lb.dv)S.lb.dv=[];if(!S.lb.hh)S.lb.hh=[];if(!S.lb.td)S.lb.td=[];if(!SO.length)computeSO()}
function playerBalanced(){return myRk()>=BAL_RANK}
function settle(){
  if(S.lb.week===weekStart())return;
  const t=Date.now();
  // Xếp hạng: 1 = cao nhất
  const rows=B.map((b,i)=>({n:b.n,s:Math.max(0,bs(i,t)+(S.lb.adj[i]||0)),i,u:0}));
  rows.push({n:S.name||"Bạn",s:S.points,u:1});
  rows.sort((a,b)=>b.s-a.s);
  rows.forEach((r,k)=>r.rank=k+1);
  // Thiên Đạo Cân Bằng: hạng 40 trở xuống — không còn trừ/tâm ma cuối bảng
  if(!S.lb.bal)S.lb.bal=Array(50).fill(0);
  S.lb.bal.fill(0);
  const helped=[];
  rows.forEach(r=>{
    if(r.rank<BAL_RANK)return;
    if(r.u){
      S.bal=1; // người chơi: +25% linh lực nhận khi còn hạng ≥40 (kiểm tra liên tục qua playerBalanced)
      helped.push(r.n+" (bạn)");
    }else{
      // NPC: cộng một lần ~12% điểm tuần này vào cột cân bằng (làm mới mỗi tuần)
      const bonus=Math.max(30,Math.floor(r.s*0.12));
      S.lb.bal[r.i]=bonus;
      helped.push(r.n);
    }
  });
  // Hạng < 40 không giữ bal tuần trước
  if(!playerBalanced())S.bal=0;
  const nHelp=rows.filter(r=>r.rank>=BAL_RANK).length;
  S.lb.log="Chốt bảng tuần: Thiên Đạo Cân Bằng ban ân cho "+nHelp+" vị hạng "+BAL_RANK+" trở xuống (+25% tốc độ cho đạo hữu khi còn dưới top "+(BAL_RANK-1)+"; NPC nhận linh lực cân bằng ~12%). Không còn hình phạt đứng cuối.";
  if(helped.length&&helped.length<=8)S.lb.log+=" Gồm: "+helped.slice(0,8).join(", ")+".";
  {const sg=spRoll(rows,Math.floor(Date.parse(weekStart()+"T00:00:00")/6048e5));if(sg.length)S.lb.log+=" Cơ duyên đặc biệt cho 3 hạng cuối: "+sg.map(x=>x.n+" ("+SPQ[x.k].n+")").join(", ")+"."}
  S.lb.log+=warReward();
  S.lb.week=weekStart();save();
}
const spark=(i,t0)=>GameLeaderboardData.sparkline(Array.from({length:40},(_,j)=>sc(i,t0-(39-j)*90000)));
let PV={};
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
function exCond(e){
  let d=0;while(d<=e.ls&&kh(e.chuan*10,e,d/e.ls)<100)d++;
  const rows=[`${e.a*100} điểm linh lực (linh lực ≥ ${e.chuan}, ${rname(e.chuan)}) + ${e.bm} điểm đạo tâm (chuỗi ≥ ${e.ls} ngày)`];
  rows.push(d>e.ls?"Không thể đạt 100":`Đạt 100 khi linh lực ≥ ${e.chuan} và chuỗi học liên tục ≥ ${d} ngày`);
  rows.push(`Chuỗi ${Math.round(e.ls/2)} ngày → +${Math.round(e.bm/2)} điểm đạo tâm · không có chuỗi → +0`);
  return rows;
}
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
const EXOPEN={};
function resolveEx(){
  if(!S.sem)S.sem={res:{}};
  const now=Date.now();let ch=0,pending=null;
  EX.forEach((e,ei)=>{
    const d=exD(e);if(now<d||S.sem.res[e.id])return;
    // Không cho thiên kiếp vượt quá ngày KD của kiếp hiện tại
    if(e.day>=KD)return;
    // dn: mốc thời gian của kiếp (bù phần thời gian bị tua tay bằng Thiên Đạo Lệnh); dv: ngày tương ứng trên lịch ảo của nhật ký
    const dn=d.getTime()+(KS().skx||0),dv=new Date(dn+(S.dOff||0)*864e5);
    // Thiên phú Bất Diệt Kim Thân (Giang Thừa Ảnh): 70% kích hoạt mỗi thiên kiếp, nhận chênh lệch với hạng 5 (30% số lần kích hoạt: hạng 2)
    {const gi=B.findIndex(b=>b.n==="Giang Thừa Ảnh");
     if(gi>=0&&S.lb&&Math.abs(hs(gi+1+KSALT,310,ei))<.7){
       const k=Math.abs(hs(gi+1+KSALT,311,ei))<.3?2:5;
       {const x0=(dn-S.lb.t0)/SP;if(!S.lb.gb)S.lb.gb=[];if(!S.lb.gb.some(g=>g.ex===e.id))S.lb.gb.push({ex:e.id,x0,x1:x0+5*1440,m:k===2?.2:.1})}
       const bd=B.map((b,j)=>({j,s:sc(j,dn)}));bd.push({j:-1,s:playerXpAt(dv)});bd.sort((a,b)=>b.s-a.s);
        const me=bd.find(z=>z.j===gi),tg=bd[k-1],immune=!!tg&&immuneTaiHu(tg.j),dl=tg&&tg.j!==gi&&!immune?Math.max(0,tg.s-me.s):0;
       if(dl>0){S.lb.adj[gi]=(S.lb.adj[gi]||0)+dl;if(!S.lb.spx)S.lb.spx={};S.lb.spx[gi]=(S.lb.spx[gi]||0)+dl}
        vlog("Bất Diệt Kim Thân: Giang Thừa Ảnh kích hoạt ở "+e.n+", "+(immune?"Cố Thái Hư miễn nhiễm phần chênh lệch; Giang không nhận linh lực chênh lệch.":dl>0?"nhận +"+Math.round(dl)+" linh lực, ngang hạng "+k:"đã đứng trên hạng "+k+" nên không nhận thêm")+". Tốc độ học +"+(k===2?20:10)+"% trong 5 ngày.");
     }}
    const rows=B.map((b,i)=>{const xp=bxp(i,dn),sk=spKn(i,e);return{n:b.n,xp,sp:sk,s:khNpc(xp,spE(e,sk))}});
    const ux=playerXpAt(dv);
    const stk=streakAt(dv,!!(KS().skx||KS().skd||(Date.now()-d.getTime())<3*864e5));
    {const psk=(S.sp&&S.sp.ex===e.id)?S.sp.k:-1,pe=spE(e,psk);rows.push({n:S.name||"Bạn",u:1,xp:ux,st:stk,sp:psk,s:kh(ux,pe,daoTam(stk,pe))})}
    rows.forEach(r=>{r.ok=ri(r.xp/(r.sp===2?SPQ[2].f:1))>=e.need;r.g=gr(r.s)});
    // Xếp hạng: điểm đánh giá cao hơn đứng trên; bằng điểm thì tu vi (linh lực) cao hơn đứng trên
    rows.sort((a,b)=>b.s-a.s||b.xp-a.xp);
    const me0=rows.find(r=>r.u);
    let menhLoss=0;
    if(!me0.ok||me0.g==="Yếu"){
      // Chuỗi thất bại tăng trừ Mệnh: +25% mỗi lần fail liên tiếp (tối đa ×2.5)
      S.failStreak=(S.failStreak||0)+1;
      const streakMul=Math.min(2.5,1+0.25*(S.failStreak-1));
      menhLoss=Math.round((10*e.w+(!me0.ok?6:0))*streakMul);
      S.menh=Math.max(0,(S.menh||100)-menhLoss);
      vlog("Kiếp nạn "+e.n+": trừ "+menhLoss+" Mệnh (chuỗi fail ×"+S.failStreak+", còn "+S.menh+")");
      if(S.menh<=0){
        S.menh=0;
        S.tdStacks=(S.tdStacks||0)+1;
        S.tdPenalty=true;
        setTimeout(()=>showTdLenh(),600);
      }
    }else{
      S.failStreak=0;
      if(me0.ok&&me0.g!=="Yếu"&&["Xuất sắc","Giỏi","Khá"].includes(me0.g)){S.life=S.life||{};S.life.exOk=(S.life.exOk||0)+1}
    }
    S.sem.res[e.id]={rows,claimed:false,loss:0,menhLoss,seen:false};spRetire(e,dn);ch=1;
    if(!pending)pending=e;
  });
  if(ch)save();
  // Bắt buộc xem bảng thiên kiếp trước khi chơi tiếp
  if(pending&&!S.exLock){S.exLock=pending.id;setTimeout(()=>showExModal(pending),300)}
}
function showExModal(e){
  const r=S.sem&&S.sem.res[e.id],me=r&&r.rows.find(z=>z.u);
  const ml=r&&r.menhLoss?r.menhLoss:0;
  $("thd").innerHTML=`<div class="box" style="border-color:var(--gold)"><h2>Thiên Kiếp Giáng Lâm</h2>
    <small>Ngày thứ ${e.day} của kiếp · ${e.n}</small>
    <p style="margin:12px 0;line-height:1.65">${e.desc}</p>
    <p style="margin:10px 0;line-height:1.65"><b>${e.kind}</b><br>Viên mãn ${RL[e.need][0]} → thăng ${RL[e.need+1][0]} · Hệ số ×${e.w}</p>${exGod(e)}
    ${me?`<p style="margin:10px 0">Kết quả của ngươi: <b>${me.s} điểm — ${me.g}</b>${me.st!=null?` <small>(chuỗi học ${me.st} ngày)</small>`:""}${me.ok?"":" (chưa đủ tu vi)"}${ml?` · <span style="color:var(--red)">Trừ ${ml} Mệnh</span>${(S.failStreak||0)>1?` (chuỗi fail ${S.failStreak})`:""}`:""}</p>`:""}
    <p style="margin:10px 0;color:var(--mute);font-size:14px">Phải xác nhận đã đối diện thiên kiếp này trước khi tiếp tục tu luyện. Sau đó sẽ chuyển tới tab Thiên kiếp để xem bảng và nhận thưởng (nếu đủ điều kiện).</p>
    <div class="row"><button class="btn" style="margin-left:0" id="exok">Kính nhận thiên kiếp</button></div>
  </div>`;
  $("thd").hidden=false;
  // Khóa tương tác nền
  document.body.style.pointerEvents="none";
  $("thd").style.pointerEvents="auto";
  $("exok").onclick=()=>{
    if(S.sem&&S.sem.res[e.id])S.sem.res[e.id].seen=true;
    S.exLock=null;save();$("thd").hidden=true;
    document.body.style.pointerEvents="";
    const next=EX.find(x=>S.sem&&S.sem.res[x.id]&&!S.sem.res[x.id].seen);
    if(next){S.exLock=next.id;setTimeout(()=>showExModal(next),200)}
    else{go("w","x");render()}
  };
}
function renderExams(){
  const x=uxp(),k=ri(x),lo=RL[k][1],hi=RL[k+1]?RL[k+1][1]:lo+1,p=Math.min(100,Math.round((x-lo)/(hi-lo)*100));
  const menh=S.menh==null?100:S.menh;
  let h=`<div class="box"><span class="lbl">Tu vi của bạn</span><div class="num">${rname(x)}</div><div class="bar"><i style="width:${p}%"></i></div><small>Linh lực ${x}${RL[k+1]?", còn "+(hi-x)+" để lên "+RL[k+1][0]:", Chân Tiên không chia tầng — linh lực tăng không giới hạn đến hết kiếp"}. Linh lực chính là tu vi: tiêu ở Kỳ Bảo điện hay đổi nhàn hạ đều làm tu vi giảm.</small></div>`;
  h+=`<div class="box"><span class="lbl">Mệnh</span><div class="num" style="color:${menh<=20?"var(--red)":menh<=50?"var(--gold)":"inherit"}">${menh}/100</div>
    <div class="bar"><i style="width:${menh}%;background:${menh<=20?"var(--red)":"var(--jade)"}"></i></div>
    <small>Thất bại trừ Mệnh theo sức kiếp; chuỗi fail liên tiếp tăng mức trừ (tối đa ×2,5). Hết Mệnh → Trừng Phạt xếp chồng (−5% mỗi lần, tối đa −30%).${S.tdPenalty?` <b style="color:var(--red)">Đang Trừng Phạt −${Math.min(30,5*Math.max(1,S.tdStacks||1))}%${(S.failStreak||0)>1?" · chuỗi fail "+S.failStreak:""}.</b>`:""}${(S.failStreak||0)>0&&!S.tdPenalty?` Chuỗi fail hiện: ${S.failStreak}.`:""}</small></div>`;
  h+=`<div class="box"><small>Thiên kiếp giáng theo ngày trong kiếp hiện tại (tối đa ${KD} ngày): ngày ${EX.map(e=>e.day).join(", ")}. Mỗi thiên kiếp là cửa ải viên mãn một cảnh giới để thăng lên cảnh giới kế. Khi đến hạn sẽ hiện bảng bắt buộc xác nhận. Thất bại trừ Mệnh theo sức mạnh kiếp.</small></div>`;
  EX.forEach(e=>{
    const d=exD(e),r=S.sem&&S.sem.res[e.id];
    const predLoss=Math.round(8*e.w)+5,sk=(spA()&&S.sp.ex===e.id)?S.sp.k:-1,fk=sk===2?SPQ[2].f:1;
    h+=`<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${e.n}</h2><span class="pb">Ngày ${e.day}</span></div><small>${e.kind}. ${d.toLocaleDateString("vi-VN")}, viên mãn ${RL[e.need][0]} → thăng ${RL[e.need+1][0]}</small>${exGod(e)}<small style="display:block;margin-top:4px;line-height:1.5;color:var(--mute)">${e.desc}</small>`;
    if(!r){
      h+=`<small style="display:block;margin-top:6px">Còn ${Math.max(0,Math.ceil((d-Date.now())/864e5))} ngày. ${ri(x/fk)>=e.need?"Bạn đã đủ tu vi độ kiếp.":"Bạn chưa đủ tu vi, cần thêm "+(Math.ceil(RL[e.need][1]*fk)-x)+" linh lực."}${sk>=0?` <b style="color:var(--gold)">${SPQ[sk].n}: ${SPQ[sk].pd}.</b>`:""} Nếu thất bại sẽ trừ khoảng ${Math.round(8*e.w)}–${predLoss} Mệnh.</small><div class="row"><button class="btn alt" data-a="xm" data-id="${e.id}" style="margin-left:0">Diễn kiếp</button></div></div>`;
    }else{
      const me=r.rows.find(z=>z.u);
      const ml=r.menhLoss||0;
      h+=`<div class="row"><b style="font-size:28px">${me.s}</b><span class="pb">${me.g}</span><small>Hạng ${r.rows.indexOf(me)+1}/${r.rows.length}, ${rname(me.xp)}${me.ok?"":", chưa đủ tu vi nên không nhận thưởng"}${ml?`, <b style="color:var(--red)">trừ ${ml} Mệnh</b>`:""}</small>${me.ok&&!r.claimed?`<button class="btn" data-a="xc" data-id="${e.id}">Nhận ${modGain(RW[me.g]*e.w)} linh lực</button>`:r.claimed?"<small>Đã nhận thưởng</small>":""}</div><ul class="exl${EXOPEN[e.id]?" open":""}" style="margin-top:8px">${r.rows.map((z,i)=>`<li class="${z.u?"now":z.ok?"":"lock"}${(i>=10&&!z.u)?" more":""}"><b style="width:22px">${i+1}</b><div class="nm">${z.n}<small>${rname(z.xp)}</small>${z.sp>=0?`<small style="color:var(--gold)">${SPQ[z.sp].n}</small>`:""}</div><b>${z.s}</b><span class="pb">${z.g}</span></li>`).join("")}</ul>${r.rows.length>10?`<button class="btn alt" data-a="xl" data-id="${e.id}" style="margin-left:0;margin-top:6px">${EXOPEN[e.id]?"Thu gọn":"Xem đủ "+r.rows.length+" người"}</button>`:""}</div>`;
    }
  });
  h+=`<div class="box"><small>Thang 100 điểm: Xuất sắc từ 90, Giỏi 80 đến 89, Khá 65 đến 79, Trung bình 50 đến 64, Yếu dưới 50. NPC có công thức riêng, chỉ dựa vào linh lực (không có đạo tâm): đạt 100 khi linh lực ≥ mốc viên mãn của kiếp đó. Điểm của bạn gồm phần linh lực (so với mốc viên mãn của cảnh giới đó — cũng là mức NPC trung bình đạt được vào ngày giáng kiếp) và đạo tâm (chuỗi ngày học liên tục; kiếp càng cuối càng đòi chuỗi dài); mỗi kiếp chia tỉ trọng khác nhau. Đạo tâm chỉ cộng tối đa từ 2 điểm (kiếp đầu) đến 10 điểm (kiếp khó), phần còn lại đến từ linh lực. Chưa đủ tu vi hoặc đạt mức Yếu → trừ Mệnh theo hệ số kiếp (không trừ linh lực trực tiếp). Hết Mệnh sẽ chịu Thiên Đạo Trừng Phạt (−5% mọi nguồn linh lực). Muốn ân xá: hoàn thành kiếp viên mãn và mọi thiên kiếp từ Khá trở lên.</small></div>`;
  $("exams").innerHTML=h;
}
function renderLb(){
  lbInit();
  const t=Date.now(),rows=B.map((b,i)=>({i,n:b.n,s:sc(i,t)}));rows.push({u:1,n:S.name||"Bạn",s:S.points});
  rows.sort((a,b)=>b.s-a.s);
  const me=rows.findIndex(r=>r.u)+1,last=rows[rows.length-1];
  const nx=new Date();nx.setHours(0,0,0,0);nx.setDate(nx.getDate()+((8-nx.getDay())%7||7));
  const ms=nx-t;
  const balOn=me>=BAL_RANK;
  let h=`<span class="lbl">Thứ hạng của bạn</span><div class="num">${me}/${rows.length}</div><small>Chốt bảng sau ${Math.floor(ms/864e5)} ngày ${Math.floor(ms%864e5/36e5)} giờ.</small>`;
  h+=`<small style="display:block;margin-top:6px"><b>Thiên Đạo Cân Bằng:</b> hạng ${BAL_RANK} trở xuống nhận buff tốc độ (bạn +${Math.round((BAL_MULT-1)*100)}% linh lực nhận; NPC +~12% linh lực cân bằng mỗi tuần). Mục tiêu: dễ chen vào top ${BAL_RANK-1}. Không còn phạt đứng cuối.</small>`;
  if(balOn)h+=`<small style="display:block;margin-top:6px;color:var(--jade)">Bạn đang trong vùng Cân Bằng (hạng ${me}) — mọi nguồn linh lực ×${BAL_MULT}.</small>`;
  else h+=`<small style="display:block;margin-top:6px">Bạn đã vào top ${BAL_RANK-1}; buff Cân Bằng tắt. Đứng cuối hiện: ${last.n}.</small>`;
  if(S.lb.log)h+=`<small style="display:block;margin-top:6px">${esc(S.lb.log)}</small>`;
  $("lbhead").innerHTML=h;
  $("lbgod").hidden=!S.god;if(S.god)$("lbgodi").textContent="Ngày "+Math.floor(kAge())+"/"+KD+" · chuỗi "+curStreak();
  $("lb").innerHTML=rows.map((r,k)=>{if(!LBALL&&k>=20&&!r.u)return "";const b=B[r.i],p=PV[r.n],d=p==null?0:r.s-p;PV[r.n]=r.s;
    const ar=Math.abs(d)<.05?"":`<small style="display:block;color:${d>0?"var(--jade)":"var(--red)"}">${d>0?"▲":"▼"} ${Math.abs(d).toFixed(1)}</small>`;
    const balMark=!r.u&&k+1>=BAL_RANK?` · <span style="color:var(--jade)">Cân Bằng</span>`:(r.u&&balOn?` · <span style="color:var(--jade)">Cân Bằng ×${BAL_MULT}</span>`:"");
    const avHtml=r.u?`<span style="width:36px;height:36px;flex:none;overflow:hidden;border-radius:50%">${portrait(S.name,{player:1,w:36,h:36})}</span>`:(AVATARS[r.n]?`<span style="width:36px;height:36px;flex:none;overflow:hidden;border-radius:50%">${portrait(r.n,{w:36,h:36})}</span>`:"");
    return `<li data-pi="${r.u?-1:r.i}" style="cursor:pointer" class="${r.u?"now":(isTK(r.i)?"tkf":"")}"><b style="width:22px">${k+1}</b>${avHtml}<div class="nm">${r.n}<small>${r.u?"Linh lực hiện có":b.t+", +"+Math.round(b.b*100)+"% tốc độ"}${balMark}</small><small>${r.u?(S.sect!=null?SECTS[S.sect].n:"Chưa có tông môn"):SECTS[SO[r.i]].n}, ${rname(r.u?uxp():bxp(r.i,t))}</small>${r.u?"":`<small>${b.d}</small>`}</div>${r.u?"":spark(r.i,t)}<div style="text-align:right;min-width:64px"><b>${r.u?r.s:r.s.toFixed(1)}</b>${ar}</div></li>`}).join("");
  renderProf();
}
const rn=x=>x.qid&&sq(x)?sq(x).name:x.label;
function renderLich(){
  const now=nowHM(),day=(S.sched[today()]||[]).slice().sort((a,b)=>a.s<b.s?-1:1);
  const v=$("lq").value;
  $("lq").innerHTML="<option value=\"\">Chọn nhiệm vụ (tùy chọn)</option>"+S.quests.filter(q=>!isDone(q)&&!expired(q)&&(!q.chain||unlocked(q))).map(q=>`<option value="${q.id}">${esc(q.name)} (+${q.pts})</option>`).join("");
  $("lq").value=v;
  const cur=day.find(x=>now>=x.s&&now<x.e),nxt=day.find(x=>x.s>now);
  let h=`<span class="lbl">Bây giờ, ${now}</span>`;
  if(cur){const q=sq(cur),d=q&&isDone(q);
    h+=`<h2 style="font-size:20px;margin:4px 0">${esc(rn(cur))}</h2><small>${cur.s} - ${cur.e}, còn ${tm(cur.e)-tm(now)} phút${d?", đã hoàn thành":""}</small>`;
    if(q&&!d&&!expired(q))h+=`<div class="row"><button class="btn" data-a="t" data-id="${q.id}">Hoàn thành</button>${q.mins?`<button class="btn alt" data-a="p" data-id="${q.id}" style="margin-left:0">Học</button>`:""}</div>`;
  }else h+=`<h2 style="font-size:20px;margin:4px 0">Không có việc trong khung giờ này</h2><small>${nxt?"Kế tiếp "+nxt.s+": "+esc(rn(nxt)):"Hôm nay chưa có lịch phía sau"}</small>`;
  $("now").innerHTML=h;
  $("nowbar").hidden=!cur;if(cur)$("nowbar").textContent="Bây giờ ("+cur.s+" - "+cur.e+"): "+rn(cur);
  $("slots").innerHTML=day.length?day.map(x=>{const q=sq(x),d=q&&isDone(q);
    return `<li class="${now>=x.e?"past":now>=x.s?"now":""}${d?" done":""}">${q&&!d&&!expired(q)?`<button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành"></button>`:d?`<button class="tick" disabled>✓</button>`:""}<div class="nm">${esc(rn(x))}<small>${x.s} - ${x.e}</small></div><button class="del" data-a="ld" data-id="${x.id}" aria-label="Xóa khỏi lịch">×</button></li>`}).join("")
    :`<li class="empty" style="display:block">Chưa có lịch hôm nay. Thêm khung giờ hoặc bấm Tự xếp lịch.</li>`;
}
function renderShop(){
  $("shop").innerHTML=ITEMS.map(i=>{const own=S.inv[i.id]||0,bought=S.dailyBought[today()]||[],off=S.points<i.c||bought.includes(i.id);
    return `<li>${IC[i.id]||""}<div class="nm">${i.n}<small>${i.d}${own?", đang có "+own:""}</small></div><span class="pb">${i.c}</span><button class="btn" data-a="buy" data-id="${i.id}" ${off?"disabled":""}>${bought.includes(i.id)?"Đã mua hôm nay":"Mua"}</button></li>`}).join("");
  const inv=ITEMS.filter(i=>S.inv[i.id]);
  $("inv").innerHTML=Array.from({length:Math.max(12,Math.ceil(inv.length/3)*3)},(_,k)=>{const i=inv[k];return i?`<li class="slot"><span class="cnt">×${S.inv[i.id]}</span><span class="ic">${IC[i.id]||""}</span><b>${i.n}</b>${i.use?`<button class="btn" data-a="use" data-id="${i.id}" style="margin:0;padding:6px 10px;font-size:13px">Dùng</button>`:`<small>${i.once?"Đang phát huy":"Tự kích hoạt"}</small>`}</li>`:`<li class="slot blank"><span class="ic">◌</span><small>Ô trống</small></li>`}).join("");
  $("buff").textContent=buffTxt();
  $("titles").innerHTML=TITLES.map(t=>{const ok=tok(t);return `<li class="${ok?"":"lock"}"><div class="nm">${t.n}${nwS().t[t.id]?'<span class="nd" title="Mới"></span>':""}<small>${t.d}</small><small style="color:var(--gold)">Buff: ${t.b}</small></div>${ok?`<button class="btn ${S.title===t.id?"":"alt"}" data-a="eq" data-id="${t.id}">${S.title===t.id?"Đang đeo":"Đeo"}</button>`:"🔒"}</li>`}).join("");
}
const qm=()=>QM[$("nq").value]||1;
const rem=t=>GameTimeFormat.remaining(t,Date.now());
const expired=q=>GameQuestData.isExpired(q,isDone,Date.now());
const weekStart=()=>GameDateData.weekStart(S.dOff||0);
const sumMins=f=>GameAnalytics.sumMinutes(S.hist,f);
const evCur=p=>p==="w"?sumMins(k=>k>=weekStart()&&k<=today()):sumMins(k=>k.slice(0,7)===today().slice(0,7));
const unlocked=q=>GameQuestData.isUnlocked(S.quests,q,isDone);
const stepRow=(q,lock)=>{const d=isDone(q);return `<li class="${d?"done":""}${lock?" lock":""}"><button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành bước">${d?"✓":lock?"🔒":""}</button><div class="nm">${esc(q.name)}<small>${q.mins} phút</small></div>${!d&&!lock?`<button class="play" data-a="p" data-id="${q.id}">Học</button>`:""}<span class="pb">+${d&&q.got?q.got:q.pts}</span></li>`};
function renderChains(){
  $("chains").innerHTML=S.chains.length?S.chains.map(c=>{
    const st=S.quests.filter(x=>x.chain===c.id),d=st.filter(isDone).length;
    return `<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${esc(c.name)}</h2><span class="pb">${c.paid?"Xong +"+c.bonus:d+"/"+st.length+" · còn "+st.filter(x=>!isDone(x)).reduce((t,x)=>t+(x.mins||0),0)+"p"}</span><button class="del" data-a="cd" data-id="${c.id}" aria-label="Xóa chuỗi">×</button></div><div class="bar"><i style="width:${st.length?Math.round(d/st.length*100):0}%"></i></div><ul style="margin-top:8px">${st.map((q,i)=>stepRow(q,!st.slice(0,i).every(isDone))).join("")}</ul></div>`}).join("")
  :`<div class="empty">Chưa có chuỗi. Tạo chuỗi đầu tiên ở phía trên.</div>`;
}
var FO={};
function fold(k,t,b,o){return `<details class="fold" data-k="${k}"${(FO[k]===undefined?o:FO[k])?" open":""}><summary>${t}</summary>${b}</details>`}
var KSD={};
function renderEvents(){
  // Sự kiện cố định tuần/tháng + các kỳ sự cổ phong
  const E=[
    ["w","Tuần Luyện · Thiên Cơ","tuần này","Mỗi tuần Thiên Cơ mở một lần. Học đủ giờ trong tuần để nhận phúc."],
    ["m","Nguyệt Luyện · Thái Ấm","tháng này","Mỗi tháng Thái Ấm chiếu xuống. Học đủ giờ trong tháng để nhận đại phúc."]
  ];
  let h=E.map(([p,n,sub,desc])=>{
    const cur=evCur(p),ev=S.ev[p],goal=ev.h*60,ck=p+":"+(p==="w"?weekStart():today().slice(0,7)),got=S.claimed[ck],ok=cur>=goal;
    return `<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${n}</h2><span class="pb">+${ev.r}</span></div>
      <small style="display:block;line-height:1.5;margin-top:2px">${desc}</small>
      <small>Học đủ ${ev.h} giờ trong ${sub}: ${Math.floor(cur/60)} giờ ${cur%60} phút</small>
      <div class="bar"><i style="width:${Math.min(100,Math.round(cur/goal*100))}%"></i></div>
      <div class="row">${S.god?`<label>Mục tiêu <input type="number" min="1" max="999" value="${ev.h}" data-p="${p}" data-f="h"> giờ</label>
      <label>Thưởng <input type="number" min="1" max="9999" value="${ev.r}" data-p="${p}" data-f="r"> linh lực</label>`:`<small style="flex:1">Mục tiêu ${ev.h} giờ · Thưởng ${ev.r} linh lực</small>`}
      <button class="btn" data-a="ec" data-k="${ck}" data-p="${p}" ${got||!ok?"disabled":""}>${got?"Đã nhận":"Nhận thưởng"}</button></div></div>`;
  }).join("");
  const T=today(),ws=weekStart(),mo=T.slice(0,7);
  const weekQuests=()=>GameAnalytics.sumCountsBetween(S.cnt,ws,T);
  const weekNight=()=>GameAnalytics.countStudyLogEntries(S.stl,ws,T,h=>h>=22||h<5);
  const weekDawn=()=>GameAnalytics.countStudyLogEntries(S.stl,ws,T,h=>h<7);
  const weekStats=()=>GameAnalytics.studyWindowStats(S.hist,ws,T),wDs=()=>weekStats().days,wDays=()=>weekStats().daysWithStudy,wBest=()=>weekStats().bestMinutes,cs=(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0;
  const EXTRA=[
    {id:"xs1",n:"Canh Khuya Tụng Kinh",desc:"Hoàn thành ≥3 nhiệm vụ trong khung 22h–5h tuần này.",ok:()=>weekNight()>=3,r:70,ck:"xs1:"+ws},
    {id:"xs2",n:"Bình Minh Công Pháp",desc:"Hoàn thành ≥3 nhiệm vụ trước 7h tuần này.",ok:()=>weekDawn()>=3,r:70,ck:"xs2:"+ws},
    {id:"xs3",n:"Bách Luyện Thành Cương",desc:"Hoàn thành ≥10 nhiệm vụ trong tuần này.",ok:()=>weekQuests()>=10,r:90,ck:"xs3:"+ws},
    {id:"xs4",n:"Đạo Tâm Bất Chuyển",desc:"Chuỗi ngày học hiện tại ≥5.",ok:()=>(S.streak.n||0)>=5,r:80,ck:"xs4:"+ws},
    {id:"xs5",n:"Linh Thú Hữu Duyên",desc:"Đang có linh thú theo cùng (tháng này nhận 1 lần).",ok:()=>!!(S.pets&&S.act&&S.pets[S.act]),r:50,ck:"xs5:"+mo},
    {id:"xs6",n:"Tông Môn Đồng Tâm",desc:"Gia nhập tông và đóng góp ≥80 linh lực tuần này.",ok:()=>S.sect!=null&&ugain(ws,"9999")>=80,r:100,ck:"xs6:"+ws},
    {id:"xs7",n:"Cần Cù Bù Thông Minh",desc:"Học đủ 5 giờ trong tuần này.",tg:300,cur:evCur("w"),unit:"phút học",per:"w",ok:()=>evCur("w")>=300,r:80,ck:"xs7:"+ws},
    {id:"xs8",n:"Nhật Nhật Tinh Tiến",desc:"Có học ở ít nhất 5 ngày khác nhau trong tuần này.",tg:5,cur:wDays(),unit:"ngày có học",per:"w",ok:()=>wDays()>=5,r:90,ck:"xs8:"+ws},
    {id:"xs9",n:"Một Ngày Bốn Canh",desc:"Có một ngày học đủ 4 giờ trong tuần này.",tg:240,cur:wBest(),unit:"phút (ngày tốt nhất)",per:"w",ok:()=>wBest()>=240,r:80,ck:"xs9:"+ws},
    {id:"xs10",n:"Thạch Phá Thiên Kinh",desc:"Học đủ 20 giờ trong tháng này.",tg:1200,cur:evCur("m"),unit:"phút học",per:"m",ok:()=>evCur("m")>=1200,r:200,ck:"xs10:"+mo},
    {id:"xs11",n:"Trì Chi Dĩ Hằng",desc:"Chuỗi ngày học hiện tại đạt 14 ngày (nhận một lần trong tháng).",tg:14,cur:cs,unit:"ngày chuỗi",per:"m",ok:()=>cs>=14,r:150,ck:"xs11:"+mo}
  ];
  const ea=x=>esc(String(x)).replace(/"/g,"&quot;"),God=!!S.god,so=S.kso||{};
  const rng=p=>p==="m"?mo+"-01":ws;
  const stN=(p,f)=>GameAnalytics.countStudyLogEntries(S.stl||[],rng(p),T,f);
  const KM={c:["nhiệm vụ hoàn thành",p=>{let n=0;for(const k in S.cnt||{})if(k>=rng(p)&&k<=T)n+=S.cnt[k];return n}],m:["phút học",p=>evCur(p)],s:["ngày chuỗi học",()=>(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0],n:["nhiệm vụ đêm (22h-5h)",p=>stN(p,h=>h>=22||h<5)],d:["nhiệm vụ trước 7h",p=>stN(p,h=>h<7)]};
  h+=`<div class="box"><h2>Kỳ Sự Cửu Châu</h2><small>Các kỳ sự mở theo điều kiện. Mỗi kỳ sự chỉ nhận một lần trong tuần hoặc tháng tương ứng.${God?" Thiên Đạo: có thể thêm, sửa và xóa kỳ sự.":""}</small></div>`;
  if(God){const k=KSD;
    h+=`<div class="box"><h2>[God] Thêm kỳ sự</h2>
      <input type="text" data-kd="n" value="${ea(k.n||"")}" placeholder="Tên kỳ sự" maxlength="40">
      <input type="text" data-kd="d" value="${ea(k.d||"")}" placeholder="Mô tả ngắn" maxlength="120" style="margin-top:6px">
      <div class="row"><label>Điều kiện <select data-kd="m">${Object.keys(KM).map(m=>`<option value="${m}"${(k.m||"c")===m?" selected":""}>${KM[m][0]}</option>`).join("")}</select></label>
      <label>Đạt ≥ <input type="number" min="1" max="9999" data-kd="t" value="${ea(k.t||5)}"></label></div>
      <div class="row"><label>Thưởng <input type="number" min="1" max="9999" data-kd="r" value="${ea(k.r||60)}"> linh lực</label>
      <label>Chu kỳ <select data-kd="p"><option value="w"${(k.p||"w")==="w"?" selected":""}>Tuần</option><option value="m"${k.p==="m"?" selected":""}>Tháng</option></select></label>
      <button class="btn" data-a="kadd">Thêm</button></div></div>`}
  const card=(x,custom)=>{const got=S.claimed[x.ck],ok=x.ok();
    return `<div class="box"><div class="row" style="margin:0"><b style="flex:1">${esc(x.n)}</b><span class="pb">+${x.r}</span></div>
      <small style="display:block;margin-top:4px;line-height:1.5">${esc(x.desc)}</small>
      ${x.tg?`<small>${Math.min(x.cur,99999)}/${x.tg} ${x.unit} · ${x.per==="m"?"tháng này":"tuần này"}</small><div class="bar"><i style="width:${Math.min(100,Math.round(x.cur/x.tg*100))}%"></i></div>`:""}
      <div class="row" style="margin-top:8px"><button class="btn" data-a="xs" data-ck="${x.ck}" data-r="${x.r}" ${got||!ok?"disabled":""}>${got?"Đã nhận":ok?"Nhận thưởng":"Chưa đủ điều kiện"}</button>
      ${God?`<button class="btn alt" data-a="ked" data-id="${x.id}" data-n="${ea(x.n)}" data-r="${x.r}" data-d="${ea(x.desc)}" data-tg="${x.tg||""}" data-c="${custom?1:0}">Sửa</button>${custom?`<button class="btn alt" data-a="kdel" data-id="${x.id}">Xóa</button>`:(so[x.id]?`<button class="btn alt" data-a="kreset" data-id="${x.id}">Gốc</button>`:"")}`:""}</div></div>`};
  h+=EXTRA.map(x=>card(Object.assign({},x,so[x.id]||{}),false)).join("");
  h+=(S.ks||[]).map(c=>{const km=KM[c.met]||KM.c,cur=km[1](c.per);return card({id:c.id,n:c.n,desc:c.desc||"",r:c.r,tg:c.tg,cur,unit:km[0],per:c.per,ok:()=>cur>=c.tg,ck:c.id+":"+(c.per==="m"?mo:ws)},true)}).join("");
  $("events").innerHTML=h;
}
function hAdd(d,p,m){const h=S.hist[d]||(S.hist[d]={p:0,m:0});h.p=Math.max(0,h.p+p);h.m=Math.max(0,h.m+m)}
// Trừng Phạt xếp chồng: mỗi lần hết Mệnh +1 stack, −5% mỗi stack (tối đa −30%)
function tdMult(){return S.tdPenalty?Math.max(0.7,1-0.05*Math.max(1,S.tdStacks||1)):1}
function balMult(){return playerBalanced()?BAL_MULT:1}
function rewardFactors(){return{td:tdMult(),balance:balMult(),status:(S.tm?.8:1)*(S.tma?.65:1)*(S.cbUntil>Date.now()?1.1:1)}}
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
  const t=today();
  if(GameTimer.activeFocus()===q)GameTimer.cancelFocus();
  if(S.streak.last!==t){
    const decision=GameStreak.completeDay({last:S.streak.last,today:t,yesterday:dayStr(1),twoDaysAgo:dayStr(2),streak:S.streak.n,lifeCharm:S.inv.the,heartCharm:!!S.sh,random:Math.random});
    if(decision.consumeLifeCharm)S.inv.the--;
    if(decision.consumeHeartCharm)S.sh=0;
    if(decision.triggerDemon){S.tm=1;S.tmTasks=0;KS().tm=(KS().tm||0)+1;}
    if(decision.extra)extra=decision.extra;
    if(decision.log)vlog(decision.log);
    S.streak=decision.streak;
  }
  const tf=TB(q),ls=LS(),pb=petBuff();if(S.pw>0)S.pw--;
  let m=GameRewards.streakMultiplier(S.streak.n,tf.cap);
  const curse=GameStreak.progressCurses({minutes:q.mins||0,tm:!!S.tm,tmTasks:S.tmTasks,tma:!!S.tma,tmaTasks:S.tmaTasks,calmTitle:eqT("n12")});
  S.tm=curse.tm;S.tmTasks=curse.tmTasks;S.tma=curse.tma;S.tmaTasks=curse.tmaTasks;
  if(curse.clearedSelf){ls.tmc=(ls.tmc||0)+1;extra+=" Tâm Ma Tự Thân đã tan."}
  if(curse.clearedHeavenly)extra+=" Thiên Ma Nhập Tâm đã bị trấn áp.";
  const tmb=curse.taskBonus;
  if(S.buff.n>0){m*=S.buff.m;S.buff.n--}
  if(S.tb&&Date.now()<S.tb)m*=1.2;
  m*=tf.mult;
  const questReward=GameRewards.questCompletionReward(q.pts,m,tf.flat,tmb,S.fx||[],rewardFactors(),e=>!e.t||(e.t==="q"&&q.due)||(e.t==="l"&&(q.mins||0)>=60));
  q.got=questReward.gain;S.fx=questReward.effects;
  {const h=hourNow(),ks=KS();ls.q++;S.life=S.life||{};S.life.q=(S.life.q||0)+1;ls.m+=q.mins||0;if(h>=22||h<5)ls.ni++;if(h<7)ls.da++;if(q.due)ls.ru++;if((q.mins||0)>=120)ls.lg++;ls.ms=Math.max(ls.ms,S.streak.n);ks.ms=Math.max(ks.ms,S.streak.n);
   if(pb.dr&&Math.random()<pb.dr){const pool=["ca","tl","sl","ln","hx","ht","tq","ll","td","dk"],d=pool[Math.floor(Math.random()*pool.length)];S.inv[d]=(S.inv[d]||0)+1;extra+=" Thôn Thiên Thử nhặt được "+ITEMS.find(i=>i.id===d).n+"."}}
  const r0=myRk();(S.cnt||(S.cnt={}))[t]=(S.cnt[t]||0)+1;(S.stl||(S.stl=[])).push([Date.now(),q.mins||0]);if(S.stl.length>300)S.stl.shift();q.doneOn=t;
  // q.got đã qua modGain; addPts không nhân lần 2 — ghi hist trực tiếp
  S.points+=q.got;hAdd(t,q.got,q.mins||0);
  ls.top=ls.top||(myRk()<=10?1:0);if(myRk()<=1)ls.t1=1;ls.mc=Math.max(ls.mc||0,S.cnt[t]);
  vlog("Hoàn thành "+q.name+": +"+q.got+" linh lực"+(S.tdPenalty?" (Trừng Phạt −"+Math.min(30,5*Math.max(1,S.tdStacks||1))+"%)":"")+", giờ học hôm nay "+(((S.hist[t]||{}).m||0)/60).toFixed(1)+" giờ, tu vi "+rname(uxp())+", hạng "+r0+" → "+myRk());
  const c=q.chain&&S.chains.find(x=>x.id===q.chain);
  if(c&&!c.paid){const st=S.quests.filter(x=>x.chain===c.id);if(st.every(isDone)){c.paid=true;c.bonus=GameRewards.chainCompletionReward(st.reduce((s,x)=>s+x.got,0),eqT("t7"),rewardFactors());S.points+=c.bonus;hAdd(t,c.bonus,0);extra=" Hoàn thành chuỗi: thưởng thêm +"+c.bonus+" linh lực!"}}
}
function startFocus(q){
  if(!GameTimer.startFocus(q,q.mins*60000)){say("Đang có một phiên học. Hãy hủy hoặc chờ xong.");return}
  say("Bắt đầu học: "+q.name);render();
}
function renderMap(){
  const el=$("map");if(!el)return;
  // Tọa độ % theo bản đồ cổ họa Cửu Châu (ảnh gốc)
  // px/py = left%, top% — khớp chấm trên tranh
  const locs=[
    {id:"cc",n:"Cửu Châu",px:50,py:11,d:"Thiên Sơn trung tâm · Thiên Kiêu Bảng treo trên đỉnh. Cả chín châu hướng về đây mỗi tuần khi bảng chốt.",go:()=>go("t","b"),col:"#f5f0e0",tag:"Bảng xếp hạng"},
    {id:"ccw",n:"Cửu Châu (Tây)",px:28,py:23,d:"Động phủ trên núi mây phía tây. Nơi ghi chép Thiên Cơ và đạo quả các đời.",go:()=>go("s","o"),col:"#c0c0c8",tag:"Thiên Cơ Lục"},
    {id:"dc",n:"Dương Châu",px:72,py:21,d:"Tông môn trên dãy núi phía đông bắc. Không gian cổ, nền tảng vững — Thái Hư Điện đóng tại đây.",go:()=>go("t","z"),sect:3,col:"#8b6bb8",tag:SECTS[3].n},
    {id:"hc",n:"Hoài Châu",px:50,py:34,d:"Đảo giữa sông lớn. Vạn Pháp Các lơ lửng trên hồ Linh Tâm, trăm nhà pháp thuật hội tụ.",go:()=>go("t","z"),sect:2,col:"#5eb0c8",tag:SECTS[2].n},
    {id:"tc",n:"Tùng Châu",px:36,py:40,d:"Rừng phong đỏ và đình cổ. Kỳ ngộ và linh thú thường xuất hiện nơi hoang nguyên này.",go:()=>go("w","e"),col:"#c8483a",tag:"Kỳ ngộ / Linh thú"},
    {id:"thc",n:"Thanh Châu",px:16,py:50,d:"Thác nước và lâu đài trên vách đá. Thiên Kiếm Tông dựng kiếm các tại đây — kiếm ý xé mây.",go:()=>go("t","z"),sect:0,col:"#3a6aaa",tag:SECTS[0].n},
    {id:"tuc",n:"Tứ Châu",px:48,py:54,d:"Núi giữa lòng châu. Lôi Đài Thiên Kiếp đứng trên đỉnh — nơi thiên kiếp giáng xuống thử đạo tâm.",go:()=>go("w","x"),col:"#d4a84a",tag:"Thiên kiếp"},
    {id:"uc",n:"Ung Châu",px:78,py:50,d:"Đình đài giữa đồng xanh. Bách Thảo Đường trồng dược liệu bạt ngàn, hương thuốc bay xa trăm dặm.",go:()=>go("t","z"),sect:5,col:"#3a9a5a",tag:SECTS[5].n},
    {id:"kc",n:"Ký Châu",px:20,py:78,d:"Thành cổ dưới mây núi phía tây nam. Cửu U Cốc ẩn trong bóng tối vĩnh cửu gần đây.",go:()=>go("t","z"),sect:4,col:"#6a5a9a",tag:SECTS[4].n},
    {id:"tec",n:"Tề Châu",px:48,py:80,d:"Đình quán giữa đồng bằng. Càn Khôn Bảo Khố mở cửa tại đây — đổi bảo vật bằng linh lực.",go:()=>go("k","k"),col:"#e8d8b0",tag:"Kỳ Bảo"},
    {id:"lc",n:"Lạc Châu",px:74,py:72,d:"Lâu đài lá vàng mùa thu. Huyền Đan Môn luyện đan trong thung lũng Đan Hà thuộc Lạc Châu.",go:()=>go("t","z"),sect:1,col:"#c9a84c",tag:SECTS[1].n}
  ];
  const mine=S.sect;
  // Ảnh bản đồ: cùng thư mục với HTML (cuu-chau-map.jpg)
  const mapSrc="assets/map/cuu-chau-map.jpg";
  el.innerHTML=`<div class="box"><h2>Bản đồ Cửu Châu · 九州圖</h2>
    <small style="display:block;line-height:1.6;margin-top:4px">Bản đồ cổ họa chín châu. Chạm chấm sáng trên tranh để mở khu vực trong game.</small>
    <small style="display:block;margin-top:4px">Bạn: <b>${esc(S.name||"Đệ tử")}</b> · ${mine!=null?SECTS[mine].n:"Chưa vào tông"} · Hạng ${myRk()}</small>
  </div>
  <div class="box" style="padding:6px;overflow:auto">
    <div id="cmapwrap" style="position:relative;width:100%;max-width:900px;margin:0 auto;line-height:0;border-radius:4px;overflow:hidden;border:1px solid var(--gold);box-shadow:var(--shadow)">
      <img src="${mapSrc}" alt="Bản đồ Cửu Châu" style="width:100%;height:auto;display:block;user-select:none;pointer-events:none" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <div style="display:none;padding:24px;text-align:center;font-size:14px;line-height:1.5;color:var(--mute)">Không tải được ảnh bản đồ. Hãy để file <b>cuu-chau-map.jpg</b> cùng thư mục với file HTML.</div>
      ${locs.map((L,i)=>{
        const on=mine!=null&&L.sect===mine;
        return `<button type="button" data-map="${i}" title="${L.n}" aria-label="${L.n}"
          style="position:absolute;left:${L.px}%;top:${L.py}%;transform:translate(-50%,-50%);
            width:${on?22:16}px;height:${on?22:16}px;border-radius:50%;padding:0;margin:0;
            background:${L.col};border:${on?"3px solid #f5e6a0":"2px solid #fff"};
            box-shadow:0 0 0 2px rgba(0,0,0,.25),0 2px 8px rgba(0,0,0,.35);
            cursor:pointer;z-index:2;transition:transform .12s">
        </button>`;
      }).join("")}
    </div>
  </div>
  <div class="box" id="mapinfo"><small>Chạm một chấm trên bản đồ để xem mô tả châu và dịch chuyển.</small></div>
  <div class="box"><small style="line-height:1.55"><b>Chú giải chín châu:</b> Cửu Châu (đỉnh) · Dương · Hoài · Tùng · Thanh · Tứ · Ung · Ký · Tề · Lạc. Chấm viền vàng = tông môn bạn đang gia nhập.</small></div>`;
  el.onclick=e=>{
    const g=e.target.closest("[data-map]");if(!g)return;
    const L=locs[+g.dataset.map];if(!L)return;
    $("mapinfo").innerHTML=`<div class="row" style="margin:0;align-items:flex-start"><div style="flex:1">
      <b>${L.n}</b> · <span class="pb">${L.tag}</span>
      <br><small style="line-height:1.55;display:block;margin-top:4px">${L.d}</small></div>
      <button class="btn" data-goto="${g.dataset.map}" style="margin-left:8px">Đi tới</button></div>`;
  };
  el.querySelector("#mapinfo").onclick=e=>{
    const b=e.target.closest("[data-goto]");if(!b)return;
    const L=locs[+b.dataset.goto];if(L&&L.go){L.go();render()}
  };
}
function renderLore(){
  const el=$("lore");if(!el)return;
  el.innerHTML=`
<div class="box"><h2>Thiên Cơ Lục · Cửu Châu</h2>
<small style="display:block;line-height:1.7;margin-top:6px">
Giữa lòng hư không, có một mảnh đại lục tên <b>Cửu Châu</b>. Linh khí nơi đây dày đặc, núi sông ẩn chứa động phủ, cổ tích và cơ duyên. Muôn loài sinh linh — người, yêu, linh thú — đều có thể hấp thu linh khí, bước lên con đường cầu đạo. Người đời gọi đó là <b>Tu Tiên</b>.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Cao hơn Cửu Châu là <b>Thiên Đạo</b>. Không phải thần, không phải ma; chưa ai thấy hình hài, cũng chưa ai được ngài nhìn lại. Ngài không thương kẻ cần mẫn, không hận kẻ lười biếng, như sông chảy xuống và đá nằm yên. Từng bước tu luyện, từng lần độ kiếp, từng lần đạo tâm dao động đều được ghi vào một cuốn sổ không có bìa. Khi một tu sĩ khép lại kiếp này, Thiên Đạo gập trang, rồi mở cửa <b>luân hồi</b> cho họ bắt đầu lại từ Luyện Khí.
</small>
</div>

<div class="box"><h2>Nguyên Lưu Chi Chủ</h2>
<small style="display:block;line-height:1.7;margin-top:6px">
Không ai biết người này từ đâu đến. Thiên Kiêu Bảng không ghi tên, Thiên Cơ Các không suy diễn được, và cả những quyển sổ số mệnh cổ xưa nhất cũng để trống ở trang của người này. Mọi sinh linh Cửu Châu đều bị cuốn trong dòng chảy vận mệnh, chỉ có người này đứng ngoài vòng ấy, nhìn dòng chảy từ bên bờ.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Linh hồn người này xuyên qua hư không, mang theo ký ức của một thế giới chưa từng có trong thiên địa. Khi tỉnh lại giữa Cửu Châu, Thiên Đạo lặng đi một nhịp. Người này mang danh <b>Nguyên Lưu Chi Chủ</b>: kẻ đứng ở nguồn của dòng sông, nơi mọi nhân quả bắt đầu. Cơ duyên không tìm đến người này, mà đi theo người này, vì vận mệnh của kẻ khác chỉ là nhánh nhỏ chảy ra từ nguồn.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Thực lực của người này sâu không thấy đáy. Có kẻ từng thấy một người vô danh, tu vi mới Luyện Khí, vung tay làm thiên kiếp tan trước khi kịp giáng xuống; cũng có kẻ thề rằng sau lưng người ấy là cả một dòng sông ánh sáng chảy ngược. Mười một thiên kiêu từng tự cho mình là thiên chi kiêu tử, nhưng đứng trước người này, ai cũng im lặng và khẽ lùi nửa bước.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Người này không vội, không tranh, không khoe. Mỗi giờ học là một bước đi trên con đường mà không ai khác thấy được. Càng ít người hiểu, càng nhiều người kiêng dè.
</small>
</div>

<div class="box"><h2>Cảnh giới tu luyện</h2>
<small style="display:block;line-height:1.7;margin-top:6px">
Đạo lộ chia thành chín cảnh lớn: <b>Luyện Khí → Trúc Cơ → Kim Đan → Nguyên Anh → Hóa Thần → Luyện Hư → Hợp Thể → Đại Thừa → Chân Tiên</b>. Mỗi cảnh có chín tầng. <b>Chân Tiên</b> không chia tầng: linh lực tiếp tục tăng đến hết thời hạn của kiếp. Cửa ải để bước vào Chân Tiên là <b>Phi Thăng Kiếp</b>.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Linh lực chính là thước đo tu vi. Học đạo, khổ luyện, vượt kiếp nạn, nhận kỳ ngộ… đều hóa thành linh lực. Tiêu linh lực (đổi bảo vật, nhàn hạ) cũng làm tu vi giảm — vì trong Cửu Châu, không có gì là miễn phí.
</small>
</div>

<div class="box"><h2>Thiên Kiêu Bảng</h2>
<small style="display:block;line-height:1.7;margin-top:6px">
Thiên Kiêu Bảng là tấm bảng vàng treo trên đỉnh Thiên Kiêu Sơn, do chính Thiên Đạo ghi tên. Ai có linh lực cao hơn sẽ đứng trên. Mỗi tuần bảng chốt một lần: kẻ đứng cuối chịu tâm ma quấy nhiễu, kẻ đứng đầu được cả Cửu Châu biết đến.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Trên bảng không chỉ có đệ tử tông môn, còn có tán tu, ẩn sĩ, thiên tài và cả những cái tên đã đứng đầu nhiều mùa liên tiếp. Vượt qua họ không dễ — nhưng đạo lộ vốn không dành cho kẻ dễ dàng bỏ cuộc.
</small>
</div>

<div class="box"><h2>Sáu đại tông môn</h2>
${SECTS.map(s=>`<div style="margin-top:10px"><b>${s.n}</b><br><small style="line-height:1.65">${s.lore}</small></div>`).join("")}
</div>

<div class="box"><h2>Thiên kiếp và Mệnh</h2>
<small style="display:block;line-height:1.7;margin-top:6px">
Khi tu vi chạm mốc, Thiên Đạo giáng <b>thiên kiếp</b> — lôi kiếp, hỏa tai, tâm ma, hàn băng… Mỗi lần độ kiếp là một lần kiểm tra đạo tâm và thực lực. Đạt Xuất sắc được thưởng lớn; thất bại hoặc chưa đủ tu vi sẽ hao <b>Mệnh</b>.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Mệnh là sợi dây mong manh nối thân xác với đạo quả. Hết Mệnh không chết ngay, nhưng Thiên Đạo sẽ ban <b>Trừng Phạt</b>: linh lực nhận được suy giảm. Muốn được ân xá, phải chứng tỏ bằng một kiếp viên mãn và mọi thiên kiếp từ Khá trở lên.
</small>
</div>

<div class="box"><h2>Kỳ ngộ · Linh thú · Luân hồi</h2>
<small style="display:block;line-height:1.7;margin-top:6px">
Cửu Châu đầy cơ duyên. Kỳ ngộ có thể xuất hiện bất cứ lúc nào — thiên cơ lộ, linh mạch bùng, cố nhân tương ngộ, thậm chí <b>Linh Thú Xuất Thế</b>. Linh thú không thể mua bằng linh lực; chúng chỉ theo về khi duyên đến. Ai cưỡng cầu, duyên sẽ tránh.
</small>
<small style="display:block;line-height:1.7;margin-top:8px">
Một kiếp tu luyện dài khoảng một trăm mười chín ngày. Khi kiếp khép lại — dù viên mãn hay chưa — tu sĩ bước vào <b>luân hồi</b>. Mọi vật phẩm, danh hiệu, tông môn, linh thú của kiếp ấy trở về hư không. Chỉ còn đạo tâm và ký ức phán quyết theo sang kiếp mới. Đó là luật của Thiên Đạo: buông bỏ chấp niệm, mới đi được xa.
</small>
</div>

<div class="box"><h2>Lời kết của Thiên Cơ Lục</h2>
<small style="display:block;line-height:1.7;margin-top:6px;font-style:italic">
«Đạo tại nhân tâm. Học một giờ là một giờ, lười một ngày là một ngày. Thiên Đạo không thiên vị kẻ có thiên phú, cũng không bỏ rơi kẻ chỉ biết cần cù. Hỡi đạo hữu — hãy tự viết nên trang sử của mình trên Thiên Kiêu Bảng.»
</small>
</div>`;
}
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
const AI_PROMPT=`Bạn là gia sư lập kế hoạch học. Tạo bộ nhiệm vụ học cho tôi.

THÔNG TIN CỦA TÔI
- Mục tiêu và hạn chót: [điền]
- Trình độ hiện tại / điểm yếu: [điền]
- Tài liệu đang có: [điền]
- Phạm vi: [1 ngày / 1 tuần]
- Thời gian học mỗi ngày: [vd. 3 giờ]
- Phiên tập trung tối đa: [vd. 45 phút]
- Số nhiệm vụ: [vd. 8]

ĐỊNH DẠNG (mỗi dòng một nhiệm vụ):
Tên nhiệm vụ | phút | độ khó | lặp | hạn

QUY TẮC
1. Chỉ in các dòng trong MỘT khối code, không đánh số, không gạch đầu dòng, không giải thích.
2. Tên tối đa 80 ký tự, bắt đầu bằng động từ, có kết quả đo được (vd. "Nghe Part 2 đề 3, chép 10 câu sai", không viết "Ôn nghe"). Nhiều môn thì thêm tiền tố [Nghe], [Code].
3. phút: số nguyên 5-480, chia hết cho 5, phần lớn 25-50, tối đa 90.
4. độ khó: chỉ 1, 1.25 hoặc 1.5 (khoảng 50% / 35% / tối đa 15%), đánh giá trung thực theo trình độ tôi.
5. lặp: 1 chỉ cho thói quen ngắn hằng ngày (từ vựng, flashcard), còn lại 0.
6. hạn: để trống (không dùng 1, 3, homnay).
7. Thứ tự dòng = thứ tự nên làm: khởi động dễ, việc khó ở giữa, ôn lại/kiểm tra cuối. Xen một nhiệm vụ ôn nội dung cũ, không dồn cùng một kỹ năng liền nhau.
8. Tổng phút không vượt thời gian học mỗi ngày của tôi.

Ví dụ:
[Từ vựng] Học 30 từ Unit 4 bằng flashcard | 25 | 1 | 1
[Nghe] Nghe Part 2 đề 3, chép 10 câu sai | 40 | 1.25 | 0
`;
const CHAIN_PROMPT=`Bạn là gia sư thiết kế lộ trình học theo chuỗi bước tuần tự. Tạo một chuỗi cho tôi.

THÔNG TIN CỦA TÔI
- Mục tiêu cuối: [điền]
- Hạn chót: [điền]
- Trình độ hiện tại: [điền]
- Tài liệu / công cụ: [điền]
- Thời gian mỗi tuần: [vd. 6 giờ]
- Số bước: [vd. 12]

ĐỊNH DẠNG
Dòng 1: TÊN CHUỖI: <tên ngắn, tối đa 60 ký tự>
Các dòng sau, mỗi dòng một bước: Tên bước | phút

QUY TẮC
1. Chỉ in đúng định dạng trong MỘT khối code, không giải thích, không đánh số.
2. 2 đến 15 bước, làm LẦN LƯỢT: bước sau dùng kết quả bước trước (nền tảng, vận dụng, kiểm tra).
3. Mỗi bước có đầu ra kiểm tra được (vd. "Đọc 3 bài báo, ghi 5 ý mỗi bài", không viết "Tìm hiểu tài liệu").
4. phút mỗi bước 20-90 (tối đa 480). Nếu mỗi bước là một tuần thì phút là tổng cả tuần, không vượt 480.
5. Có bước kiểm tra nhỏ (đề thử, tự trình bày) ở khoảng 1/3 và 2/3 chuỗi, bước tổng kết ở cuối.
6. Không thêm bước cho đủ số lượng. Bước đầu dưới 30 phút để dễ bắt đầu.

Ví dụ:
TÊN CHUỖI: Viết báo cáo NCKH
Đọc 3 bài báo đầu, ghi 5 ý chính mỗi bài | 60
Lập dàn ý chi tiết 3 cấp | 45
`;
const SCHED_PROMPT=`Bạn là gia sư lập thời khóa biểu học trong ngày. Xếp lịch cho tôi.

THÔNG TIN CỦA TÔI
- Ngày: [hôm nay / thứ ...]
- Việc cố định: [vd. 07:30-11:30 đi học, 12:00-13:00 ăn trưa]
- Khoảng rảnh có thể học: [vd. 14:00-17:30 và 19:00-22:00]
- Giờ tập trung tốt nhất: [vd. 19:00-21:00]
- Phiên tập trung tối đa: [vd. 45 phút]
- Việc cần học (tên | phút):
[dán danh sách nhiệm vụ, lấy bằng nút "Xuất nhiệm vụ hiện có"]

ĐỊNH DẠNG (mỗi dòng một khung): HH:MM-HH:MM | Tên việc

QUY TẮC
1. Chỉ in các dòng lịch trong MỘT khối code, sắp theo giờ tăng dần, không giải thích.
2. Giờ 24h, phút chia hết cho 5, các khung không trùng nhau.
3. Mỗi khung học tối đa 120 phút (nên 25-50). Chừa 10 phút nghỉ giữa hai khung học, không cần ghi dòng riêng.
4. Việc khó nhất vào giờ tập trung tốt nhất, việc nhẹ/ôn lại vào lúc mệt.
5. Không xếp học sau 22:00 và không đè lên việc cố định.
6. Giữ nguyên tên việc đúng như danh sách tôi đưa.
7. Không đủ thời gian thì bỏ việc ưu tiên thấp nhất, không nén thời gian. Ghi lý do ở một dòng cuối bắt đầu bằng "# ".
8. Cuối ngày có khung 10-15 phút "Tổng kết và chuẩn bị ngày mai".

Ví dụ:
19:00-19:45 | Học 30 từ Unit 4 bằng flashcard
19:55-20:40 | Nghe Part 2 đề 3, chép 10 câu sai
`;
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
const PRESET_MIX=`# Bộ kết hợp: VSTEP + Lập trình + NCKH + môn khác (có thể sửa trước khi Nhập)
# --- VSTEP / tiếng Anh ---
VSTEP Listening · 1 đoạn Part 1–2 | 30 | 1.25 | 0
VSTEP Reading · 1 passage + ghi chú từ | 40 | 1.25 | 0
VSTEP Writing · outline 1 bài Task | 35 | 1.5 | 0
VSTEP Speaking · thu âm 2 câu hỏi | 25 | 1.25 | 0
Ôn grammar VSTEP (thì / mệnh đề) | 25 | 1 | 1
Từ vựng academic 20 từ | 20 | 1 | 1
# --- Lập trình ---
Code · giải 2 bài dễ (warmup) | 40 | 1 | 0
Code · 1 bài vừa / thuật toán | 60 | 1.5 | 0
Đọc code / review PR hoặc bài mẫu | 30 | 1.25 | 0
Luyện debug 1 bug thật hoặc mock | 35 | 1.25 | 0
Viết / cập nhật README hoặc note kỹ thuật | 25 | 1 | 0
# --- NCKH ---
NCKH · đọc 1 paper / chương tài liệu | 45 | 1.25 | 0
NCKH · tóm tắt + 3 ý đóng góp | 30 | 1.5 | 0
NCKH · chỉnh method / thí nghiệm | 50 | 1.5 | 0
NCKH · viết 1 đoạn Introduction hoặc Related Work | 40 | 1.5 | 0
NCKH · cập nhật slide / poster tiến độ | 25 | 1 | 0
# --- Môn khác / nền tảng ---
Toán / xác suất ôn công thức cốt lõi | 35 | 1.25 | 0
Môn chuyên ngành · đọc giáo trình 1 mục | 40 | 1.25 | 0
Môn chuyên ngành · làm 5–10 bài tập | 45 | 1.5 | 0
Ôn nhanh lịch sử / lý thuyết (flashcard) | 20 | 1 | 1
Tổng kết ngày: ghi 5 dòng học được | 15 | 1 | 1`;
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
const DEF_Q=`Khởi động: ôn lại ghi chú hôm qua | 15 | 1 | 1
Học từ vựng 20 từ bằng flashcard | 20 | 1 | 1
Đọc 1 mục tài liệu, ghi 5 ý chính | 40 | 1.25 | 0
Làm 5-10 bài tập, đánh dấu câu sai | 45 | 1.25 | 0
Giải 1 bài khó (code/đề) | 60 | 1.5 | 0
Sửa lại các câu sai và ghi nguyên nhân | 30 | 1.25 | 0
Tổng kết ngày: ghi 5 dòng học được | 15 | 1 | 1`;
function addDefQ(){let n=0;DEF_Q.split("\n").forEach(l=>{const q=parseBulkLine(l);if(!q||S.quests.some(x=>x.name===q.name&&!isDone(x)))return;S.quests.push(q);n++});return n}
$("qdef").onclick=()=>{const n=addDefQ();if(n){save();render()}say(n?"Đã thêm "+n+" nhiệm vụ mặc định.":"Nhiệm vụ mặc định đã có sẵn trong danh sách.")};
const DEF_C=[["Ôn thi một chương",["Đọc lướt chương, ghi mục lục ý chính | 30","Lập sơ đồ tư duy các khái niệm chính | 40","Học thuộc công thức/định nghĩa bằng flashcard | 35","Làm 10 bài tập cơ bản | 45","Làm 5 bài khó, ghi lại chỗ sai | 60","Tự làm đề thử có bấm giờ | 60"]],
["Viết một bài báo cáo",["Chọn đề tài, liệt kê 3 câu hỏi cần trả lời | 30","Đọc 3 tài liệu, ghi 5 ý chính mỗi tài liệu | 60","Lập dàn ý 3 cấp | 40","Viết phần mở đầu | 40","Viết phần nội dung chính | 90","Viết kết luận và danh mục tài liệu | 40","Đọc lại, sửa lỗi và định dạng | 45"]],
["Học một chủ đề mới",["Xem tổng quan chủ đề, ghi 5 từ khóa | 25","Đọc/xem tài liệu nền tảng, ghi chú | 45","Làm ví dụ mẫu theo hướng dẫn | 45","Tự làm một bài không nhìn đáp án | 45","Tóm tắt lại bằng lời của mình | 25"]]];
$("cdef").onclick=()=>{let n=0;DEF_C.forEach(([nm,st],k)=>{if(S.chains.some(c=>c.name===nm))return;const id="c"+Date.now().toString(36)+"d"+k;S.chains.push({id,name:nm,paid:false,bonus:0});st.forEach((l,i)=>{const [a,m]=l.split("|"),mins=+m;S.quests.push({id:id+i,name:a.trim(),pts:Math.max(1,Math.round(mins/60*S.perHour)),mins,chain:id,doneOn:null})});n++});if(n){save();render()}say(n?"Đã thêm "+n+" chuỗi mẫu.":"Các chuỗi mẫu đã có rồi.")};
const DEF_S=`07:40-07:55 | Khởi động: ôn lại ghi chú hôm qua
08:00-08:20 | Học từ vựng 20 từ bằng flashcard
08:30-09:10 | Đọc 1 mục tài liệu, ghi 5 ý chính
14:00-14:45 | Làm 5-10 bài tập, đánh dấu câu sai
15:00-16:00 | Giải 1 bài khó (code/đề)
19:30-20:00 | Sửa lại các câu sai và ghi nguyên nhân
20:10-20:25 | Tổng kết ngày: ghi 5 dòng học được`;
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
const RC=["#7fb8a4","#4fc48a","#e0b341","#6aa3ff","#b07cff","#ff6fae","#ff8a4c","#f4e7b0","#fff3c4"];
const QT=[
  "「Người tôn kính không phải kẻ mạnh, mà là kẻ dám làm mọi thứ vì mục tiêu.」— Phương Nguyên · Cổ Chân Nhân",
  "「Ta vì thành tiên, không vì cứu thế.」— Phương Nguyên · Cổ Chân Nhân",
  "「Thiên địa bất nhân, vạn vật vi sô cẩu.」— Đạo Đức Kinh (phong vị)",
  "「Đạo tâm không vững, tu vi chỉ là cát bụi.」— phong vị cầu đạo",
  "「Một bước sai, vạn kiếp không quay đầu.」— phong vị tu tiên",
  "「Kiếp này không xong, còn có kiếp sau — miễn là còn thở.」— phong vị luân hồi",
  "「Ngồi xuống một canh giờ cũng là đạo. Không cần ai chứng kiến.」— phong vị khổ tu",
  "「Linh lực không nhớ tên ngươi. Chỉ nhớ ngươi có ngồi hay không.」— Thiên Đạo ký lục",
  "「Tông môn cho chỗ đứng. Đạo tâm thì phải tự dựng.」— lời sư phụ vô danh",
  "「Chuỗi ngày không phải huy chương. Chỉ là bằng chứng ngươi chưa bỏ.」— Nhật ký đạo hữu",
  "「Thiên kiếp không hỏi ngươi mệt chưa. Nó chỉ hỏi ngươi còn đứng không.」— Lôi kiếp cổ thư",
  "「Linh thú không nói. Nhưng nó nhớ từng lần ngươi quay lại.」— Sổ Càn Khôn",
  "「Danh hiệu là cái bóng. Người đi trước mới là xương sống.」— Thiên Kiêu Bảng chú",
  "「Sợ chết thì đừng cầu trường sinh.」— phong vị Cầu Ma",
  "「Cơ duyên không đến tìm ta; ta đi gặp cơ duyên.」— phong vị hành giả",
  "「Trang nhật ký trắng không phải thất bại. Chỉ là chưa viết.」— Thiên Thư",
  "「Hôm nay ít. Ngày mai có thể nhiều. Đạo không tính theo một trang.」— Lão giả bên án thư",
  "「Mệnh mỏng thì đi chậm. Đi chậm vẫn là đi.」— lời độ kiếp",
  "「Khi kiếp khép, Thiên Đạo gập trang. Phần còn lại là của ngươi.」— Luân hồi chí",
  "「Không thành ma, không thành tiên — thành người biết ngồi xuống.」— biến tấu Cầu Ma"
];
function renderHero(){
  const x=uxp(),k=ri(x),lo=RL[k][1],hi=RL[k+1]?RL[k+1][1]:lo+1,p=Math.min(1,(x-lo)/(hi-lo)),C=2*Math.PI*52;
  const dn=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5),ttl=TITLES.find(t=>t.id===S.title&&tok(t));
  document.documentElement.style.setProperty("--aura",RC[k]);
  const menh=S.menh==null?100:S.menh;
  const mem=prevMemory();
  if(myRk()<=10){S.life=S.life||{};S.life.top10=1}
  $("hero").innerHTML=`<div class="hero"><div class="av">${portrait(S.name,{player:1,w:56,h:56})}</div><div class="ring"><svg viewBox="0 0 120 120"><circle class="rb" cx="60" cy="60" r="52"/><circle class="rf" cx="60" cy="60" r="52" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-p)).toFixed(1)}"/></svg><div class="hc"><div class="rn">${RL[k][0]}</div><div class="rt">${RL[k+1]?"tầng "+Math.min(9,Math.floor(p*9)+1):"vô cực"}</div></div></div><div class="hi"><b style="font-size:18px">${esc(S.name||"Đệ tử")}</b><br><small>${rname(x)} · Kiếp ${(S.rb||0)+1}${ttl?" · "+ttl.n:""}</small><br><small>Ngày ${Math.min(KD,Math.floor(kAge())+1)}/${KD} của kiếp · Mệnh ${menh}/100${S.tdPenalty?` · <span style="color:var(--red)">Trừng Phạt −${Math.min(30,5*Math.max(1,S.tdStacks||1))}%</span>`:""}${(S.failStreak||0)>1?` · fail×${S.failStreak}`:""}</small><br><small>${S.sect!=null?SECTS[S.sect].n:"Chưa vào tông môn"}, Hạng ${myRk()} trên Thiên Kiêu Bảng</small><br><small>Linh lực ${x}${RL[k+1]?" / "+hi:""}</small>${mem?`<small style="display:block;margin-top:4px;opacity:.85;font-style:italic">${mem}</small>`:""}<div class="qt">${QT[Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/36e5)%QT.length]}</div></div></div>`;
}
const KT0=Date.parse("2026-01-01T00:00:00");
const KN=[
  ["Thiên Cơ Hiện Thế","Thiên cơ lộ ra trong khoảnh khắc, ai nắm bắt được sẽ nhận phúc lớn.",1.5],
  ["Tiên Nhân Khảo Nghiệm","Một vị tiên nhân vô danh ra đề khảo nghiệm.",1],
  ["Linh Mạch Bùng Phát","Linh mạch dưới chân đột ngột tuôn trào.",1],
  ["Bí Cảnh Mở Cửa","Một bí cảnh chỉ mở trong chốc lát.",1],
  ["Cố Nhân Tương Ngộ","Cố nhân xuất hiện, trao một cơ duyên.",1],
  ["Linh Thú Xuất Thế","Trong sương mù hiện ra bóng dáng linh thú — cơ duyên ngàn năm có một.",1.2]
];
const KX=["linh lực thưởng ×1,5","+1 Tỉnh Thần Linh Trà","hiệu ứng ×1,3 cho 3 nhiệm vụ kế tiếp","+1 Tích Cốc Đan","+80 linh lực","cơ hội nhận linh thú"];
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
function knList(){const now=Date.now(),h0=Math.floor((now-KT0)/36e5),L=[];for(let h=h0-14;h<=h0;h++){const o=knAt(h);if(o&&o.st<=now&&now-o.en<6*36e5)L.push(o)}return L.reverse()}
function renderKn(){
  const now=Date.now(),L=knList().filter(o=>o.en>now||(kmins(o)>=o.T&&!S.claimed["o:"+o.h]));
  let h=L.map(o=>{const m=kmins(o),ok=m>=o.T,got=S.claimed["o:"+o.h];
    return `<div class="kn"><div class="row" style="margin:0"><b style="flex:1;font-family:var(--serif)">Kỳ ngộ: ${o.name}${nwS().k[o.h]?"":'<span class="nd" title="Mới"></span>'}</b><span class="pb">+${o.pts}</span></div><small>${o.desc}</small><div style="margin-top:6px;font-size:14px">Học ${o.T} phút trong ${o.W} giờ ${o.en>now?"(còn "+rem(o.en)+")":"(đã hết hạn)"}. Đã học ${Math.min(m,o.T)}/${o.T} phút. Thêm: ${KX[o.k]}.</div><div class="bar"><i style="width:${Math.min(100,Math.round(m/o.T*100))}%"></i></div><button class="btn" style="margin-left:0" data-a="kc" data-id="${o.h}" ${ok&&!got?"":"disabled"}>${got?"Đã nhận":ok?"Nhận thưởng":"Hoàn thành nhiệm vụ để tích phút"}</button></div>`}).join("");
  if(S.streak.last===dayStr(1)&&S.streak.n>=2&&new Date().getHours()>=18)h+=`<div class="kn" style="border-color:var(--red)"><b>Chuỗi ${S.streak.n} ngày học sắp đứt!</b><br><small>Học trước nửa đêm để giữ chuỗi. Đứt chuỗi (≥2 ngày) sẽ bị <b>tâm ma</b> xâm nhập.</small></div>`;
  $("kn").innerHTML=h;
}
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
function lenhTop(){
  const T=today(),c=S.ci||{last:"",n:0},act=(c.last===T||c.last===dayStr(1))?c.n:0,done=c.last===T,now=Date.now();
  let h=`<div class="box"><h2>Điểm danh</h2><small>Điểm danh liên tiếp 7 ngày, ngày thứ 7 thưởng lớn.</small><div class="days7">${CI.map((r,j)=>`<div class="d7 ${j<act?"on":""}"><b>${j+1}</b>+${r[0]}${r[1]?"<br>"+IC[r[1]]:""}</div>`).join("")}</div><button class="btn" style="margin-left:0" data-a="ci" ${done?"disabled":""}>${done?"Đã điểm danh hôm nay":"Điểm danh"}</button></div>`;
  const L=knList();
  h+=`<div class="box"><h2>Kỳ ngộ gần đây</h2><small>Cơ duyên xuất hiện bất ngờ, khoảng 1 đến 2 lần mỗi ngày. Học đủ phút trong khung giờ để nhận thưởng.</small><ul>${L.length?L.map(o=>{const m=kmins(o),got=S.claimed["o:"+o.h];
    return `<li><div class="nm">${o.name}<small>${fmtT(o.st)}: học ${o.T} phút trong ${o.W} giờ, ${Math.min(m,o.T)}/${o.T} phút</small></div><span class="pb">+${o.pts}</span>${got?"<small>Đã nhận</small>":m>=o.T?`<button class="btn" data-a="kc" data-id="${o.h}">Nhận</button>`:o.en>now?"<small>Đang diễn ra</small>":"<small>Bỏ lỡ</small>"}</li>`}).join(""):`<li class="empty" style="display:block">Chưa có kỳ ngộ nào gần đây. Hãy mở app thường xuyên.</li>`}</ul></div>`;
  return h;
}
$("kn").onclick=e=>{nwSeenK();const k=e.target.closest("[data-a=kc]");if(k&&!k.disabled)claimKn(+k.dataset.id)};
$("tpl").onclick=e=>{const b=e.target.closest("[data-tn]");if(!b)return;$("nm").value=b.dataset.tn;$("nd").value=b.dataset.tm;renderMore()};
let SPD=7,SMT="p";
function renderStats(){
  const T=today(),days=n=>Array.from({length:n},(_,k)=>dayStr(n-1-k)),H=S.hist,C=S.cnt||{};
  const d7=days(7),d30=days(30),analytics=GameAnalytics.summarize(H,C,{today:T,days7:d7,days30:d30,streak:(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0});
  const {g,sm,sn,mo,mA,pA,bp,bd,ls}=analytics;
  const hr=m=>GameTimeFormat.hoursLabel(m);
  const cards=[["Hôm nay",hr(g(T,"m")),g(T,"p")+" linh lực, "+(C[T]||0)+" nhiệm vụ"],["7 ngày qua",hr(sm(d7,"m")),sm(d7,"p")+" linh lực, "+sn(d7)+" nhiệm vụ"],["30 ngày qua",hr(sm(d30,"m")),sm(d30,"p")+" linh lực, "+sn(d30)+" nhiệm vụ"],["Tháng này",hr(mo.reduce((t,k)=>t+H[k].m,0)),mo.reduce((t,k)=>t+H[k].p,0)+" linh lực"],["Tổng cộng",hr(mA),pA+" linh lực"],["Trung bình 30 ngày",(sm(d30,"m")/1800).toFixed(1)+" giờ/ngày",Math.round(sm(d30,"p")/30)+" linh lực/ngày"],["Ngày tốt nhất",bp+" linh lực",bd||"chưa có"],["Chuỗi ngày học",((S.streak.last===T||S.streak.last===dayStr(1))?S.streak.n:0)+" ngày","kỷ lục "+ls+" ngày"],["Số kiếp",((S.rbh||[]).length)+" đã qua","Đang ở kiếp "+((S.rb||0)+1)+", còn "+Math.max(0,Math.ceil(KD-kAge()))+" ngày"],["Kiếp linh lực cao nhất","Kiếp "+bk().n+": "+bk().pk,bk().cur?"kiếp hiện tại đang dẫn đầu":"đã qua"]];
  const arr=days(SPD).map(d=>({d,v:g(d,SMT==="p"?"p":"m")})),mx=Math.max(1,...arr.map(x=>x.v));
  const bars=arr.map((x,i)=>`<div><span>${SPD===7?(SMT==="p"?x.v:Math.round(x.v/6)/10):""}</span><i style="height:${Math.round(x.v/mx*80)}px"></i><span>${SPD===7||i%5===0?x.d.slice(8):""}</span></div>`).join("");
  const hm=days(35).map(d=>{const m=g(d,"m");return `<i title="${d}: ${m} phút" style="aspect-ratio:1;border-radius:4px;background:${m?"var(--jade)":"var(--line)"};opacity:${m?(0.3+0.7*Math.min(1,m/240)).toFixed(2):1}"></i>`}).join("");
  const x=uxp(),k=ri(x),a7=sm(d7,"p")/7,nx=RL[k+1];
  const fc=nx?(a7>0?`Với nhịp 7 ngày gần nhất (${Math.round(a7)} linh lực/ngày), bạn lên ${nx[0]} sau khoảng ${Math.ceil((nx[1]-x)/a7)} ngày.`:"Học vài buổi để có dự báo lên cảnh giới."):"Bạn đã đạt đỉnh tu vi.";
  const nk=S.sem?EX.filter(e=>!S.sem.res[e.id]).sort((a,b)=>exD(a)-exD(b))[0]:null;
  const nt=nk?`Kiếp kế tiếp: ${nk.n}, còn ${Math.max(0,Math.ceil((exD(nk)-Date.now())/864e5))} ngày, cần tu vi ${RL[nk.need][0]}${k>=nk.need?" (bạn đã đủ)":", còn thiếu "+(RL[nk.need][1]-x)+" linh lực"}.`:"";
  const bt=(a,l,on,at)=>`<button class="btn ${on?"":"alt"}" ${at}>${l}</button>`;
  $("stats").innerHTML=fold("t1","Tổng quan",`<div class="grid2">${cards.map(c=>`<div class="box"><span class="lbl">${c[0]}</span><div class="num" style="font-size:22px">${c[1]}</div><small>${c[2]}</small></div>`).join("")}</div>`,1)
   +fold("t2","Biểu đồ",`<div class="chips">${bt(0,"7 ngày",SPD===7,'data-sp="7"')}${bt(0,"30 ngày",SPD===30,'data-sp="30"')}${bt(0,"Linh lực",SMT==="p",'data-sm="p"')}${bt(0,"Giờ học",SMT==="m",'data-sm="m"')}</div><div class="bars" style="gap:${SPD===7?8:2}px">${bars}</div>`,1)
   +fold("t3","Bản đồ chuyên cần 5 tuần",`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px">${hm}</div><small>Đậm hơn là học nhiều hơn, đầy màu khi đạt 4 giờ.</small>`,0)
   +fold("t4","Dự báo tu vi",`<small>${rname(x)}. ${fc}</small>${nt?`<small style="display:block;margin-top:6px">${nt}</small>`:""}`,1);
}
$("stats").onclick=e=>{const b=e.target.closest("[data-sp],[data-sm]");if(!b)return;if(b.dataset.sp)SPD=+b.dataset.sp;if(b.dataset.sm)SMT=b.dataset.sm;renderStats()};
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
function renderLenh(){
  $("lenh").innerHTML=lenhTop()+["d","w","m"].map(p=>`<div class="box"><h2>${LP[p][0]}</h2><small>${LP[p][1]}</small><ul>${LQ.filter(t=>t.per===p).map(t=>{const raw=lval(t),v=Math.min(raw,t.tg),got=S.claimed["q:"+t.id+":"+lpk(p)];
    return `<li style="display:block"><div class="row" style="margin:0"><b style="flex:1">${t.n}</b><span class="pb">+${t.r}${t.it?" và "+ITEMS.find(i=>i.id===t.it).n:""}</span></div><small>${t.desc}: ${Math.round(v)}/${t.tg}${t.met==="m"?" phút":""}</small><div class="bar"><i style="width:${Math.round(v/t.tg*100)}%"></i></div><div class="row" style="margin:0"><button class="btn" data-a="lc" data-id="${t.id}" ${got||raw<t.tg?"disabled":""}>${got?"Đã nhận":"Nhận thưởng"}</button></div></li>`}).join("")}</ul></div>`).join("");
}
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
$("lball").onclick=()=>{LBALL=!LBALL;$("lball").textContent=LBALL?"Chỉ hiện top 20":"Hiện tất cả";renderLb()};
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
let AC;
function sfx(f){if(S.snd===0)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.14,t);g.gain.exponentialRampToValueAtTime(.001,t+.6);o.connect(g);g.connect(AC.destination);o.start();o.stop(t+.6)}catch(e){}}
function clk(){if(S.snd===0)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();const n=Math.floor(AC.sampleRate*0.035),b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let k=0;k<n;k++)d[k]=(Math.random()*2-1)*Math.pow(1-k/n,5);const o=AC.createBufferSource();o.buffer=b;const f=AC.createBiquadFilter();f.type="bandpass";f.frequency.value=2400;f.Q.value=0.8;const g=AC.createGain();g.gain.value=.45;o.connect(f);f.connect(g);g.connect(AC.destination);o.start()}catch(e){}}
document.addEventListener("pointerdown",e=>{const t=e.target.closest&&e.target.closest("button,summary,select,.tick");if(t&&!t.disabled)clk()},true);
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
function renderKiep(){
  const t=today(),ws=weekStart(),wk=[0,1,2,3,4,5,6].map(i=>{const d=new Date(ws+"T00:00:00");d.setDate(d.getDate()+i);return d.toLocaleDateString("sv")});
  const ts=(1+.2*ri(uxp()))*(S.ln===t?.75:1),hh=[...t].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7),v=1+(Math.abs(hh)%3)*.25,KC=S.kc||(S.kc={});
  const D=[["Hạ Kiếp","m",Math.round(30*ts*v/5)*5,20,"phút tu luyện"],["Trung Kiếp","n",Math.max(2,Math.round(2*ts*v)),35,"nhiệm vụ hoàn thành"],["Thượng Kiếp","l",Math.round(45*ts*v/5)*5,60,"phút học liền một phiên"]];
  const W=[["Tuần Kiếp","m",Math.round(360*ts/30)*30,150,"phút tu luyện"],["Cần Kiếp","d",5,120,"ngày có tu luyện"],["Thiên Lôi Kiếp","n",Math.round(12*ts),220,"nhiệm vụ hoàn thành"]];
  const dm=S.kf===t?{m:9999,n:99,d:7,l:999}:kmet([t]),wm=S.kf===t?{m:99999,n:999,d:7,l:999}:kmet(wk);
  const row=(p,a,met,i)=>{const[n,k,T,r,u]=a,key=p+(p==="d"?t:ws)+i,cur=Math.min(met[k],T),ok=met[k]>=T;
    return `<li style="display:block"><div class="row" style="margin:0"><b style="flex:1">${n}</b><span class="pb">+${r}</span></div><small>${cur}/${T} ${u}</small><div class="bar"><i style="width:${Math.round(cur/T*100)}%"></i></div><div class="row" style="margin:0"><button class="btn" style="margin-left:auto" data-k="${key}" data-r="${r}" ${KC[key]||!ok?"disabled":""}>${KC[key]?"Đã vượt kiếp":"Độ kiếp"}</button></div></li>`};
  $("kiep").innerHTML=`<div class="box"><h2>Nhật Kiếp</h2><small>Đổi mỗi ngày, độ khó tăng theo cảnh giới. Vượt đủ ba kiếp được thêm 30 linh lực.</small><ul>${D.map((a,i)=>row("d",a,dm,i)).join("")}</ul></div><div class="box"><h2>Tuần Kiếp</h2><small>Đổi vào thứ Hai. Vượt đủ ba kiếp được 1 Tỉnh Thần Linh Trà.</small><ul>${W.map((a,i)=>row("w",a,wm,i)).join("")}</ul></div>`;
}
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
function renderPet(){
  const P=S.pets||(S.pets={});
  const owned=Object.keys(P).length;
  $("pet").innerHTML=`<h2>Linh Thú</h2><small>Linh thú <b>không thể mua</b>. Chỉ nhận được qua <b>Kỳ ngộ</b> (đặc biệt loại Linh Thú Xuất Thế), <b>Kỳ sự tuần/tháng</b> và điểm danh tròn tuần. Chỉ linh thú đang theo cùng mới phát huy buff. Tiến hóa đổi danh hiệu và tăng hiệu ứng. Buff đã được cân bằng lại; thức ăn chỉ nhân đôi buff nhiệm vụ trong 3 nhiệm vụ, không nhân đôi hiệu ứng ngoài nhiệm vụ. Phượng Hoàng tối đa +10 linh lực mỗi nhiệm vụ.</small>
  <small style="display:block;margin-top:4px">Đã thu phục: ${owned}/${PS.length}</small>
  <ul>${PS.map(p=>{const o=P[p.id],on=S.act===p.id,title=o?petRank(p,o.lv):null,next=o&&o.lv<5?petRank(p,o.lv+1):null;
    return `<li style="display:block"><div class="row" style="margin:0;align-items:center"><span class="pet-ico">${petIcon(p.id)}</span><b style="flex:1">${o?title:p.n}${nwS().p[p.id]?'<span class="nd" title="Mới"></span>':""}</b>${on?`<span class="pb">Đang theo</span>`:!o?`<span class="pb" style="opacity:.6">Chưa gặp</span>`:`<span class="pb" style="opacity:.75">${p.n}</span>`}</div><small>${p.d}: ${p.e(o?o.lv:1)}${o?"":" · danh hiệu mở đầu: "+petRank(p,1)}</small><div class="row" style="margin:6px 0 0">${!o?`<small style="color:var(--mute)">Chờ kỳ ngộ hoặc sự kiện…</small>`:`${on?"":`<button class="btn" style="margin-left:0" data-pa="act" data-id="${p.id}">Cho theo cùng</button>`}${o.lv<5?`<button class="btn alt" style="margin-left:0" data-pa="up" data-id="${p.id}" ${S.points<150*o.lv?"disabled":""}>Tiến hóa → ${next} (${150*o.lv})</button>`:`<small style="color:var(--jade)">Đã đạt đỉnh danh hiệu</small>`}${on&&p.id==="hl"?`<button class="btn" style="margin-left:0" data-pa="get" ${petAcc()<1?"disabled":""}>Thu hoạch ${petAcc()}</button>`:""}`}</div></li>`}).join("")}</ul>`;
  const oldReveal=document.getElementById("pet-reveal-overlay");
  if(oldReveal)oldReveal.remove();
  const notice=S.petEvolution||S.petReveal;
  if(notice){
    const r=notice,isEvolution=!!S.petEvolution,overlay=document.createElement("div");
    overlay.id="pet-reveal-overlay";
    overlay.className="pet-reveal-overlay";
    overlay.innerHTML=`<div class="pet-reveal" role="dialog" aria-modal="true" aria-labelledby="pet-reveal-title">
      <div class="pet-sparks">✦　✧　✦　✧　✦</div>
      <div class="pet-seal">THIÊN ĐẠO CHỨNG GIÁM · ${isEvolution?"ĐẠI ĐẠO THĂNG HOA":"CƠ DUYÊN HIỆN THẾ"}</div>
      <div class="pet-reveal-icon">${petIcon(r.id)}</div>
      <h2 id="pet-reveal-title">${isEvolution?"Linh Thú Tiến Hóa":"Linh Thú Xuất Thế"}</h2>
      <span class="pet-name">${isEvolution?r.newRank:r.n}</span>
      <span class="pet-sub">${isEvolution?`ĐỘT PHÁ CẢNH GIỚI · ${r.oldRank} → ${r.newRank} · CẤP ${r.lv}/5`:`DANH HIỆU KHỞI ĐẦU · ${r.base}`}</span>
      <p class="pet-lore">${isEvolution?`Linh quang hội tụ, huyết mạch thức tỉnh. ${r.n} đã vượt qua giới hạn, bước vào cảnh giới mới!`:r.d}</p>
      <div class="pet-talent"><b>✧ ${isEvolution?"Thiên phú sau tiến hóa":"Thiên phú &amp; hiệu ứng"} ✧</b><br>${r.e}</div>
      <div class="pet-sparks">❖　❖　❖</div>
      <button class="pet-confirm" type="button" id="pet-reveal-confirm">${isEvolution?"XÁC NHẬN ĐỘT PHÁ":"XÁC NHẬN THU NHẬN"}</button>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#pet-reveal-confirm").addEventListener("click",()=>{
      S.petReveal=null;S.petEvolution=null;save();render();
    });
  }
}
$("pet").onclick=e=>{
  const b=e.target.closest("button");if(!b||b.disabled)return;
  const a=b.dataset.pa,id=b.dataset.id,P=S.pets||(S.pets={}),p=PS.find(x=>x.id===id),o=P[id];
  if(a==="accept"){S.petReveal=null;S.petEvolution=null;save();render();return}
  if(a==="hatch"){say("Linh thú không thể ấp bằng linh lực. Hãy tìm qua Kỳ ngộ hoặc Sự kiện.");return}
  else if(a==="act"&&o){setAct(id);say("Đã cho "+petRank(p,o.lv)+" theo cùng.")}
  else if(a==="up"&&o&&o.lv<5){const c=150*o.lv;if(S.points<c){say("Chưa đủ linh lực: cần "+c+".");return}const oldRank=petRank(p,o.lv);S.points-=c;o.lv++;S.petEvolution={id:p.id,n:p.n,oldRank,newRank:petRank(p,o.lv),lv:o.lv,e:p.e(o.lv)}}
  else if(a==="get"&&P.hl){const g=modGain(petAcc());P.hl.t=Date.now();S.points+=g;hAdd(today(),g,0);say("Linh thú thu hoạch được +"+g+" linh lực.")}
  save();render();
};

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
function calib(){const o=[];for(const d of [28,56,84,112,KD,126]){const m=d*1440;let s=0;for(let j=0;j<B.length;j++){cum(j,m);s+=CD[j][m]+B[j].p}o.push("Ngày "+d+": NPC trung bình "+Math.round(s/B.length)+" linh lực")}$("gout").textContent="Mốc viên mãn "+END+" ở ngày "+KD+"\n"+o.join("\n")}
function selfCheck(){
  const r=[],ok=(n,c)=>r.push((c?"✓ ":"✗ ")+n),fin=Number.isFinite;
  ok("Linh lực hợp lệ ("+Math.round(S.points)+")",fin(S.points)&&S.points>=0);
  ok("Mệnh "+(S.menh==null?100:S.menh)+"/100",true);
  ok("Giờ nhàn hạ hợp lệ",fin(S.gameSec)&&S.gameSec>=0);
  ok("Đủ "+ALLS.length+" mục giao diện",ALLS.every(i=>$(i)));
  ok("Nhiệm vụ đều có tên và linh lực",S.quests.every(q=>q.name&&fin(q.pts)));
  ok("Bước liên hoàn không mồ côi",S.quests.every(q=>!q.chain||S.chains.some(c=>c.id===q.chain)));
  ok("Lịch sử không có số âm hoặc NaN",Object.values(S.hist).every(h=>fin(h.p)&&h.p>=0&&fin(h.m)&&h.m>=0));
  ok("Bảng xếp hạng ("+B.length+" tu sĩ)",!!S.lb&&B.length>0);
  ok("Mốc cảnh giới tăng dần",RL.every((x,i)=>!i||x[1]>RL[i-1][1]));
  ok("Danh hiệu: "+TITLES.length,TITLES.every(t=>t.n&&t.b&&t.d&&typeof t.ok==="function"));
  ok("Vật phẩm: "+ITEMS.length,ITEMS.every(i=>IC[i.id]));
  ok("Vật phẩm hoàn lại ≥ giá mua",ITEMS.every(i=>!i.q||i.tot>=i.c));
  ok("Linh thú: "+PS.length,PS.every(p=>p.e(1)&&p.e(5)));
  ok("Linh thú đang theo hợp lệ",!S.act||!!(S.pets&&S.pets[S.act]));
  ok("Tên: "+(S.name||"chưa"),true);
  ok("Kiếp "+KD+" ngày, còn "+Math.max(0,Math.ceil(KD-kAge()))+" ngày",true);
  ok("Giờ giả lập: "+(S.hh==null?"thật":S.hh+"h"),true);
  let sz=0;try{sz=(localStorage.getItem(KEY)||"").length}catch(e){}
  ok("Lưu trữ ("+Math.round(sz/1024)+" KB)",sz>0);
  $("gout").textContent=r.join("\n");
}
function runGod(a,btn){
  const t=today(),add=n=>{S.points+=n;hAdd(t,n,0)};
  if(a==="wp"){
    if(!btn.dataset.arm){btn.dataset.arm=1;btn.textContent="Bấm lần nữa!";setTimeout(()=>{delete btn.dataset.arm;btn.textContent="Tẩy trắng"},4000);return false}
    try{localStorage.removeItem(KEY)}catch(x){}
    location.reload();return false;
  }
  if(a==="pt")add(1000);
  else if(a==="pb")add(10000);
  else if(a==="sv"){S.points=Math.max(0,parseInt($("gv")&&$("gv").value)||0);hAdd(t,0,0)}
  else if(a==="xp"){const k=ri(S.points);if(RL[k+1])add(RL[k+1][1]-S.points);else say("Đã ở đỉnh cảnh giới.")}
  else if(a==="dt"){const mx=typeof MAXXP==="number"?MAXXP:END;add(Math.max(0,mx-S.points))}
  else if(a==="rb"){doRebirth();return false}
  else if(a==="pv"){showThd(buildRec());return false}
  else if(a==="rc"){S.rbh=[];S.rb=0}
  else if(a==="gt")S.gameSec=(S.gameSec||0)+3600;
  else if(a==="tm")S.tm=1;
  else if(a==="tx")S.tm=0;
  else if(a==="wk"){if(!S.lb)lbInit();const d=new Date(weekStart()+"T00:00:00");d.setDate(d.getDate()-7);S.lb.week=d.toLocaleDateString("sv");settle()}
  else if(a==="kf")S.kf=t;
  else if(a==="kc")S.kc={};
  else if(a==="it")ITEMS.filter(i=>!i.once).forEach(i=>S.inv[i.id]=(S.inv[i.id]||0)+3);
  else if(a==="bf"){S.buff={n:5,m:1.25};S.fx=[{n:3,v:30,t:""},{n:2,v:30,t:"q"},{n:2,v:30,t:"l"}];S.xb={u:Date.now()+864e5,v:15};S.tb=Date.now()+864e5;S.sl=1;S.ln=t;S.sh=Date.now()+3*864e5;S.lt=15;S.eb=100;S.pw=5;S.kd=t}
  else if(a==="k0"){const o=KS().start;KS().start=Date.now()-KD*864e5-1e3;KS().skx=(KS().skx||0)+(o-KS().start)}
  else if(a==="ti")TITLES.forEach(x=>(S.tt||(S.tt={}))[x.id]=Date.now());
  else if(a==="tr"){S.tt={};S.ft=false;S.title=""}
  else if(a==="ic"){S.inv={};S.buff={n:0,m:1};S.fx=[];S.xb=null;S.sh=0;S.lt=0;S.eb=0;S.pw=0;S.sl=0;S.tb=0}
  else if(a==="hh"){const c=[null,23,6,12];const cur=S.hh==null?null:S.hh;S.hh=c[(c.indexOf(cur)+1)%4]}
  else if(a==="ev")hAdd(t,0,Math.max((S.ev.w||{}).h||10,(S.ev.m||{}).h||40)*60);
  else if(a==="ex"){S.sem=S.sem||{res:{}};const o=KS().start;KS().start=Date.now()-KD*864e5;KS().skx=(KS().skx||0)+(o-KS().start);S.sem.res={};resolveEx()}
  else if(a==="xr"){S.sem=null;S.exLock=null}
  else if(a==="sw"){if(S.sect==null)S.sect=0;const w=warGain();vlog("Thiên Đạo: thắng tông chiến +"+w)}
  else if(a==="js"){S.sect=Math.floor(Math.random()*SECTS.length);S.master=null}
  else if(a==="bm"){if(S.sect==null)S.sect=0;S.master=S.sect}
  else if(a==="mh"){S.menh=100;S.failStreak=0}
  else if(a==="m0"){S.menh=0;S.tdPenalty=true;S.tdStacks=Math.max(1,S.tdStacks||0)}
  else if(a==="ax"){S.tdPenalty=false;S.tdStacks=0;S.failStreak=0;S.menh=Math.max(S.menh||0,100)}
  else if(a==="fp"){S.tdPenalty=true;S.tdStacks=(S.tdStacks||0)+1;S.menh=0}
  else if(a==="cr"){S.claimed={};S.ci={last:"",n:0}}
  else if(a==="ps"){S.pets={};S.act=""}
  else if(a==="cal"){calib();return false}
  else if(a==="pa"){S.pets=S.pets||{};PS.forEach(p=>S.pets[p.id]={lv:5,t:Date.now()});if(!S.act)S.act="hl"}
  else if(a==="pe"){S.pets=S.pets||{};if(!S.pets.hl)S.pets.hl={lv:1,t:Date.now()};S.pets.hl.t=Date.now()-8*36e5;S.act="hl"}
  else if(a==="ft")S.ft=!S.ft;
  else if(a==="sp0"||a==="sp1"||a==="sp2"){const nx=nextEx();if(!nx){say("Không còn thiên kiếp kế tiếp.");return false}S.sp={k:+a.slice(2),ex:nx.id,t:Date.now()};vlog("Thiên Đạo ban "+SPQ[+a.slice(2)].n)}
  else if(a==="spx"){S.sp=null;if(S.lb){S.lb.sp={}}}
  else if(a==="spr"){lbInit();const sg=spRoll(lbRows(),Math.floor(Math.random()*1e6));save();renderGod();render();say(sg.length?"Trúng: "+sg.map(x=>x.n+" ("+SPQ[x.k].n+")").join(", "):"Không ai trúng (không trúng quay, đã giữ cơ duyên, hoặc hết thiên kiếp kế tiếp).");return false}
  else if(a==="sx")setStreak(0);
  else if(a==="sb"){const n=curStreak();setStreak(0);S.tm=1;KS().tm=(KS().tm||0)+1;vlog("Thiên Đạo: đứt chuỗi "+n+" ngày → tâm ma")}
  else if(a==="sd")S.seed=1+Math.floor(Math.random()*1e9);
  else if(a==="qs"){[["Ôn bài",45,0],["Đọc sách",30,0],["Luyện code",60,0],["Làm đề",120,0],["Nhanh 1 giờ",30,Date.now()+36e5]].forEach(([n,m,d],i)=>S.quests.push({id:"g"+Date.now().toString(36)+i,name:"[Mẫu] "+n,pts:Math.max(1,Math.round(m/60*(S.perHour||200))),mins:m,due:d||null,repeat:false,doneOn:null}))}
  else if(a==="fx"){sfx(523);setTimeout(()=>sfx(784),130);burst()}
  else if(a==="nm"){askName();return false}
  else if(a==="ck"){selfCheck();return false}
  else if(a==="off"){S.god=false;go("s","s");save();render();say("Đã tắt Thiên Đạo.");return false}
  else return null;
  return true;
}
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
function renderSettings(){
  const u=S.ui||{skin:"classic",density:"normal",fs:"md",theme:"auto"};
  const on=(k,v)=>u[k]===v?" on":"";
  bx.innerHTML=fold("ui","Giao diện",`<small>Tùy chỉnh phong cách — vẫn giữ tông cổ thư. Thay đổi áp dụng ngay.</small>
<div class="srt"><b>Chủ đề màu</b>
  <div class="ui-opt">
    <button class="btn alt${on("skin","classic")}" data-ui="skin" data-v="classic">Cổ thư (đỏ son)</button>
    <button class="btn alt${on("skin","jade")}" data-ui="skin" data-v="jade">Thanh ngọc</button>
    <button class="btn alt${on("skin","ink")}" data-ui="skin" data-v="ink">Mặc thư</button>
    <button class="btn alt${on("skin","night")}" data-ui="skin" data-v="night">U huyền</button>
  </div></div>
<div class="srt"><b>Sáng / tối</b>
  <div class="ui-opt">
    <button class="btn alt${on("theme","auto")}" data-ui="theme" data-v="auto">Theo hệ thống</button>
    <button class="btn alt${on("theme","light")}" data-ui="theme" data-v="light">Sáng</button>
    <button class="btn alt${on("theme","dark")}" data-ui="theme" data-v="dark">Tối</button>
  </div></div>
<div class="srt"><b>Mật độ giao diện</b>
  <div class="ui-opt">
    <button class="btn alt${on("density","compact")}" data-ui="density" data-v="compact">Gọn</button>
    <button class="btn alt${on("density","normal")}" data-ui="density" data-v="normal">Vừa</button>
    <button class="btn alt${on("density","roomy")}" data-ui="density" data-v="roomy">Rộng</button>
  </div></div>
<div class="srt"><b>Cỡ chữ</b>
  <div class="ui-opt">
    <button class="btn alt${on("fs","sm")}" data-ui="fs" data-v="sm">Nhỏ</button>
    <button class="btn alt${on("fs","md")}" data-ui="fs" data-v="md">Vừa</button>
    <button class="btn alt${on("fs","lg")}" data-ui="fs" data-v="lg">Lớn</button>
  </div></div>
<div class="srt"><b>Chế độ chơi</b>
  <div class="ui-opt">
    <button class="btn alt${u.studyOnly?"":" on"}" data-ui="studyOnly" data-v="0">Đầy đủ</button>
    <button class="btn alt${u.studyOnly?" on":""}" data-ui="studyOnly" data-v="1">Chỉ học</button>
  </div>
  <small style="display:block;margin-top:4px">Chỉ học: ẩn bảng, tông, bảo khố phức tạp — giữ nhiệm vụ, nhật trình, thiên kiếp, nhật ký.</small>
</div>`,1)+fold("bk","Sao lưu & hệ thống",`<small>Dữ liệu chỉ nằm trong trình duyệt này. Xuất ra để không mất khi đổi máy.</small>
<textarea id="bk" placeholder="Dữ liệu xuất ra hiện ở đây…"></textarea>
<div class="chips" style="margin-top:8px">
  <button class="btn alt" data-bk="ex">Xuất</button>
  <button class="btn alt" data-bk="im">Nhập</button>
  <button class="btn alt" data-bk="sn">${S.snd===0?"Bật âm":"Tắt âm"}</button>
  <button class="btn alt" data-bk="nm">Đổi tên</button>
  <button class="btn alt" data-bk="tut">Hướng dẫn lại</button>
  <button class="btn alt" data-bk="god">${S.god?"Tắt Thiên Đạo":"Thiên Đạo"}</button>
</div>`,0);
}
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
  if(a==="ex"){$("bk").value=JSON.stringify(S);$("bk").select();try{navigator.clipboard.writeText($("bk").value)}catch(x){}say("Đã xuất dữ liệu. Hãy sao chép và cất giữ.")}
  else if(a==="im"){try{const o=JSON.parse($("bk").value);if(!Array.isArray(o.quests)||typeof o.points!=="number")throw 0;S=Object.assign({quests:[],points:0,gameSec:0,rate:2,perHour:200,streak:{last:"",n:0},hist:{},chains:[],ev:{w:{h:10,r:100},m:{h:40,r:500}},claimed:{},inv:{},buff:{n:0,m:1},title:"",sched:{},lb:null,sem:null},o);if(!S.ui)S.ui={skin:"classic",density:"normal",fs:"md",theme:"auto"};applyUi();save();render();say("Đã nhập dữ liệu.")}catch(x){say("Dữ liệu không hợp lệ, chưa thay đổi gì.")}}
  else if(a==="sn"){S.snd=S.snd===0?1:0;save();renderSettings();say(S.snd===0?"Đã tắt âm thanh.":"Đã bật âm thanh.");sfx(660)}
  else if(a==="nm")askName();
  else if(a==="tut"){S.tutDone=0;S.tutStep=0;save();showTut()}
  else if(a==="god"){S.god=!S.god;save();renderSettings();render();say(S.god?"Thiên Đạo đã mở, mọi tab được mở khóa.":"Đã tắt Thiên Đạo.")}
};

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
function renderRb(){
  const rb=S.rb||0,left=Math.max(0,Math.ceil(KD-kAge()));let h="";
  if(kEnd())h=`<div class="box" style="margin-bottom:14px;border-color:var(--gold)"><b>Kiếp này đã khép lại</b><br><small>${S.points>=END?"Đã chứng Chân Tiên, kiếp khép lại đúng kỳ hạn.":"Đã đủ "+KD+" ngày của một kiếp."} Bước vào luân hồi: linh lực về 0, mọi vật phẩm, linh thú, danh hiệu, tông môn và hiệu ứng đều trở về hư không. Bảng NPC cùng thiên kiếp làm lại từ đầu. Không còn hiệu ứng vĩnh viễn từ kiếp trước.</small><div class="row"><button class="btn" style="margin-left:0" data-rb="1">Bước vào luân hồi</button></div></div>`;
  else h=`<small style="display:block;margin:0 2px 10px">Kiếp thứ ${rb+1}, còn ${left} ngày.</small>`;
  $("tmb").insertAdjacentHTML("beforeend",h);
}
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
const REALM_STORY=[
  null, // Luyện Khí — khởi đầu, không có đột phá vào
  {t:"Trúc Cơ",lines:[
    "Linh khí lần đầu ngưng thành trụ trong đan điền. Ngực nóng một nhịp, rồi dịu.",
    "Bên ngoài, trời không đổi. Bên trong, có một cái nền vừa được đặt xuống.",
    "Từ đây, tu vi không còn là đống cát rời."
  ]},
  {t:"Kim Đan",lines:[
    "Một viên đan phác hiện trong biển khí. Tròn, nặng, im lặng.",
    "Ngươi nhìn nó như nhìn một lời hứa chưa nói thành lời.",
    "Kim Đan không sáng. Nó chỉ không tan."
  ]},
  {t:"Nguyên Anh",lines:[
    "Trong đan, có thứ gì đó mở mắt. Không phải người, cũng không phải hồn phách thuần.",
    "Nguyên Anh ngồi đó, nhỏ, nhưng biết nhìn ra ngoài.",
    "Lần đầu tiên, tu vi có chỗ để về."
  ]},
  {t:"Hóa Thần",lines:[
    "Thần thức kéo dài hơn thân xác. Nghe được gió ngoài cửa, dù cửa vẫn đóng.",
    "Hóa Thần không phải bay lên. Là đứng giữa hai tầng trời và đất mà không vỡ.",
    "Thiên Đạo ghi thêm một nét. Không khen, không chê."
  ]},
  {t:"Luyện Hư",lines:[
    "Hư không không còn trống. Ngươi chạm vào nó như chạm vào nước lạnh.",
    "Luyện Hư: lấy cái không làm chỗ đứng. Ai không quen sẽ chóng mặt.",
    "Ngươi quen dần. Hoặc giả vờ quen."
  ]},
  {t:"Hợp Thể",lines:[
    "Thân và đạo không còn là hai sổ riêng. Một trang viết đủ cả hai.",
    "Hợp Thể nghe lớn. Thực ra chỉ là hết chỗ trốn trong chính mình.",
    "Bước này, nhiều người dừng. Ngươi không dừng."
  ]},
  {t:"Đại Thừa",lines:[
    "Tu vi đầy đến mức linh khí quanh thân tự xếp thành lớp.",
    "Đại Thừa: gần cuối núi, gió lớn hơn, đường hẹp hơn.",
    "Phía trước còn một bậc. Bậc ấy tên Chân Tiên."
  ]},
  {t:"Chân Tiên",lines:[
    "Không có sấm. Không có hoa rơi. Chỉ có một khoảng lặng đủ dài để nghe nhịp thở.",
    "Chân Tiên không phải hết đường. Là hết cái tên cũ của đường.",
    "Thiên Đạo mở trang luân hồi, rồi khép lại — vì lần này, có thể không cần."
  ]}
];
function storyLog(){return S.storyLog||(S.storyLog=[])}
function storyFlags(){return S.storyFlags||(S.storyFlags={})}
function pushStory(id,title,lines,meta){
  const log=storyLog();
  if(log.some(x=>x.id===id))return false;
  log.push({id,title,lines:lines.slice(),at:Date.now(),day:today(),...(meta||{})});
  if(log.length>40)log.splice(0,log.length-40);
  return true;
}
function onRealmUp(from,to){
  for(let k=from+1;k<=to&&k<REALM_STORY.length;k++){
    const st=REALM_STORY[k];if(!st)continue;
    if(pushStory("realm:"+k,"Đột phá · "+st.t,st.lines,{realm:k})){
      try{say("Đạo Văn ghi lại: đột phá "+st.t+".");}catch(e){}
    }
  }
}
function chkStoryFlags(){
  const f=storyFlags();
  // Backfill đột phá đã qua (save cũ) — chỉ ghi một lần
  if(!f.realmBF){f.realmBF=1;const k=ri(S.points||0);if(k>0)onRealmUp(0,k);}
  if(S.sect!=null&&!f.sect){f.sect=1;const n=SECTS[S.sect]?SECTS[S.sect].n:"tông môn";
    pushStory("sect:"+S.sect,"Bái nhập · "+n,[
      "Dưới cờ "+n+", tên ngươi được viết vào sổ tông.",
      "Tông môn không hứa thành tiên. Chỉ hứa có chỗ đứng khi trời đổ mưa.",
      "Ngươi cúi đầu một cái. Đủ."
    ]);}
  if(S.act&&!f.pet){f.pet=1;const pt=PS.find(p=>p.id===S.act);const pn=pt?pt.n:"linh thú";
    pushStory("pet:"+S.act,"Khế ước · "+pn,[
      pn+" nhận linh lực từ ngươi, rồi trả lại bằng sự hiện diện.",
      "Không lời thề. Chỉ có một sợi dây mỏng không đứt khi ngươi quên nhìn.",
      "Càn Khôn túi nhẹ hơn một chút — vì có chỗ cho nó."
    ]);}
  if(S.title&&!f.title){f.title=1;const ti=TITLES.find(t=>t.id===S.title);const tn=ti?ti.n:S.title;
    pushStory("title:"+S.title,"Danh hiệu · 「"+tn+"」",[
      "Người đời bắt đầu gọi ngươi bằng hai chữ không phải tên.",
      "「"+tn+"」. Danh hiệu không nâng tu vi. Nó chỉ nhắc ngươi đã đi qua gì.",
      "Thiên Kiêu Bảng không cần biết. Nhật ký thì ghi."
    ]);}
  if((S.rb||0)>=1&&!f.rb){f.rb=1;
    pushStory("rb:"+S.rb,"Luân hồi · Kiếp "+((S.rb||0)+1),[
      "Bát canh có thể đã nguội. Ký ức thì chưa.",
      "Kiếp trước gập lại. Kiếp này mở trang trắng — trừ vài vết mờ ở góc.",
      prevMemory()||"Thiên Đạo không nhắc. Ngươi tự nhớ."
    ]);}
  S.storyFlags=f;
}

function genDiary(day){
  const h=S.hist[day]||{p:0,m:0},n=(S.cnt&&S.cnt[day])||0,m=h.m||0,p=h.p||0;
  const isT=day===today(),seed=[...day].reduce((a,c)=>a+c.charCodeAt(0),0);
  const pt=S.act?PS.find(x=>x.id===S.act):null;
  const recent=(S.storyLog||[]).filter(x=>x.day===day).map(x=>x.title);
  const prev=isT&&(S.rb||0)>0&&seed%11===0?prevMemory():null;
  return GameDiaryData.generate(day,{n,m,p},{
    isToday:isT,streak:(S.streak.n||0),tm:!!S.tm,
    sectName:S.sect!=null?SECTS[S.sect].n:null,
    menh:S.menh==null?100:S.menh,
    petName:pt&&pt.n,storyTitles:recent,prevMemory:prev
  },QT);
}
function renderDiary(){
  const el=$("diary");if(!el)return;
  try{chkStoryFlags();}catch(e){}
  const days=[];for(let i=0;i<14;i++)days.push(dayStr(i));
  const log=(S.storyLog||[]).slice().reverse();
  let storyHtml="";
  if(log.length){
    storyHtml=`<div class="box" style="border-color:var(--gold)"><h2>Đạo Văn · Ký lục</h2>
      <small>Những trang đột phá, bái tông, khế ước linh thú và luân hồi. Không buff số liệu — chỉ còn chữ.</small></div>`+
      log.slice(0,12).map(s=>{
        const when=s.day||(s.at?new Date(s.at).toLocaleDateString("vi-VN"):"");
        return `<div class="box"><b>${s.title}</b><small style="display:block;margin:4px 0;opacity:.75">${when}</small>${(s.lines||[]).map(x=>`<p style="margin:6px 0;line-height:1.65;font-size:14px">${x}</p>`).join("")}</div>`;
      }).join("");
  }else{
    storyHtml=`<div class="box"><h2>Đạo Văn · Ký lục</h2><small>Chưa có trang nào. Đột phá cảnh giới, bái tông, nhận linh thú hoặc luân hồi sẽ được Thiên Đạo ghi lại đây.</small></div>`;
  }
  el.innerHTML=`<div class="box"><h2>Nhật ký đạo hữu</h2><small>Thiên Đạo ghi vài dòng mỗi ngày dựa trên tu luyện thật. Không ảnh hưởng số liệu, chỉ là ký lục. Kéo xuống xem Đạo Văn (đột phá & dấu mốc).</small></div>`+
    days.map(d=>{const L=genDiary(d),isT=d===today();
      return `<div class="box"${isT?` style="border-color:var(--gold)"`:""}><b>${isT?"Hôm nay":d}</b>${L.map(x=>`<p style="margin:6px 0;line-height:1.6;font-size:14px">${x}</p>`).join("")}</div>`;
    }).join("")+
    `<div style="margin-top:18px"></div>`+storyHtml;
}

/* ===== Nhiệm vụ tông môn tuần ===== */
function sectMissions(){
  if(S.sect==null)return [];
  const ws=weekStart(),key="sm:"+ws+":"+S.sect;
  if(!S.sm||S.sm.key!==key){
    const pool=[
      {id:"q5",n:"Ngũ Nhiệm Đồng Tâm",d:"Hoàn thành 5 nhiệm vụ trong tuần",need:5,met:()=>{let n=0;for(const k in S.cnt||{})if(k>=ws)n+=S.cnt[k];return n},r:60},
      {id:"m120",n:"Bách Nhị Khổ Luyện",d:"Học đủ 120 phút trong tuần",need:120,met:()=>Math.floor(sumMins(k=>k>=ws)/1),r:80},
      {id:"st3",n:"Tam Nhật Bất Nghỉ",d:"Chuỗi ngày học ≥3",need:3,met:()=>S.streak.n||0,r:50},
      {id:"lg2",n:"Trường Công Hai Phiên",d:"2 nhiệm vụ từ 45 phút trong tuần",need:2,met:()=>(S.stl||[]).filter(x=>{const d=new Date(x[0]).toLocaleDateString("sv");return d>=ws&&x[1]>=45}).length,r:70}
    ];
    const pick=[pool[S.sect%pool.length],pool[(S.sect+2)%pool.length]];
    S.sm={key,ids:pick.map(x=>x.id),got:{}};
  }
  const all=[
    {id:"q5",n:"Ngũ Nhiệm Đồng Tâm",d:"Hoàn thành 5 nhiệm vụ trong tuần",need:5,met:()=>{let n=0;for(const k in S.cnt||{})if(k>=ws)n+=S.cnt[k];return n},r:60},
    {id:"m120",n:"Bách Nhị Khổ Luyện",d:"Học đủ 120 phút trong tuần",need:120,met:()=>Math.floor(sumMins(k=>k>=ws)),r:80},
    {id:"st3",n:"Tam Nhật Bất Nghỉ",d:"Chuỗi ngày học ≥3",need:3,met:()=>S.streak.n||0,r:50},
    {id:"lg2",n:"Trường Công Hai Phiên",d:"2 nhiệm vụ từ 45 phút trong tuần",need:2,met:()=>(S.stl||[]).filter(x=>{const d=new Date(x[0]).toLocaleDateString("sv");return d>=ws&&x[1]>=45}).length,r:70}
  ];
  return all.filter(x=>(S.sm.ids||[]).includes(x.id));
}
function claimSectM(id){
  const m=sectMissions().find(x=>x.id===id);if(!m||S.sm.got[id])return;
  if(m.met()<m.need){say("Chưa đủ tiến độ nhiệm vụ tông.");return}
  S.sm.got[id]=1;const rr=addPts(m.r);vlog("Nhiệm vụ tông: "+m.n+" +"+rr);save();render();say("Hoàn thành 「"+m.n+"」: +"+rr+" linh lực.");
}

/* ===== Sứ mệnh / thành tựu xuyên kiếp (chỉ danh hiệu) ===== */
const LEGACY=[
  {id:"L1",n:"Sơ Nhập Đạo Đồ",d:"Hoàn thành hướng dẫn lần đầu",ok:()=>!!S.tutDone},
  {id:"L2",n:"Bách Nhiệm Chi Nhân",d:"Tổng ≥100 nhiệm vụ (mọi kiếp)",ok:()=>(S.life&&S.life.q||0)>=100},
  {id:"L3",n:"Thiên Kiêu Cựu Nhân",d:"Từng đứng top 10",ok:()=>!!(S.life&&S.life.top10)},
  {id:"L4",n:"Độ Kiếp Giả",d:"Vượt ≥5 thiên kiếp (mọi kiếp, từ Khá)",ok:()=>(S.life&&S.life.exOk||0)>=5},
  {id:"L5",n:"Luân Hồi Khách",d:"Trải ≥2 kiếp",ok:()=>(S.rb||0)>=2},
  {id:"L6",n:"Tông Môn Tín Đồ",d:"Gia nhập tông ≥3 lần (đếm kiếp có tông)",ok:()=>(S.life&&S.life.sectN||0)>=3},
  {id:"L7",n:"Viên Mãn Đạo Hữu",d:"Từng đạt phán quyết Viên Mãn hoặc Xuất Sắc",ok:()=>!!(S.life&&S.life.excel)},
  {id:"L8",n:"Mệnh Cứng Như Sắt",d:"Từng ân xá Trừng Phạt",ok:()=>!!(S.life&&S.life.anXa)}
];
function lifeTrack(){
  S.life=S.life||{q:0,top10:0,exOk:0,sectN:0,excel:0,anXa:0};
  S.life.q=(S.life.q||0); // updated on finish
}
function chkLegacy(){
  lifeTrack();
  const got=S.legacy||(S.legacy={});
  const nw=[];
  LEGACY.forEach(L=>{if(!got[L.id]&&L.ok()){got[L.id]=Date.now();nw.push(L.n)}});
  if(nw.length){save();setTimeout(()=>say("Sứ mệnh hoàn thành: "+nw.join(", ")+"! (danh hiệu vĩnh viễn)"),250)}
}
function renderAch(){
  const el=$("ach");if(!el)return;
  lifeTrack();
  const got=S.legacy||{};
  el.innerHTML=`<div class="box"><h2>Sứ mệnh xuyên kiếp</h2>
    <small>Hoàn thành một lần là mãi mãi. <b>Không buff linh lực</b> — chỉ danh hiệu và ký ức trên Thiên Thư. Không mất khi luân hồi.</small></div>`+
    LEGACY.map(L=>`<div class="box"><div class="row" style="margin:0"><b style="flex:1">${L.n}</b><span class="pb">${got[L.id]?"Đã khắc":"Chưa"}</span></div>
      <small style="display:block;margin-top:4px">${L.d}</small>
      ${got[L.id]?`<small style="color:var(--jade)">Khắc vào đạo quả · ${new Date(got[L.id]).toLocaleDateString("vi-VN")}</small>`:""}
    </div>`).join("");
}

/* ===== Ký ức kiếp trước ===== */
function prevMemory(){return GameRebirthData.previousMemory(S.rbh||[]);}

function showThd(r,ask){
  $("thd").innerHTML=`<div class="box"><h2>Kiếp Trước</h2><small>Kiếp thứ ${r.n} · ${r.name}${r.grade?" · Đánh giá: "+r.grade:""}</small>${r.txt.map(x=>`<p style="margin:10px 0">${x}</p>`).join("")}
    <div class="row">
      ${ask?`<button class="btn" style="margin-left:0" id="thr">Bước vào luân hồi</button>`:""}
      <button class="btn alt" style="margin-left:0" id="thx">${ask?"Để sau":"Đóng"}</button>
      <button class="btn alt" style="margin-left:0" id="thex">Xuất phán quyết</button>
    </div></div>`;
  $("thd").hidden=false;
  $("thx").onclick=()=>{$("thd").hidden=true};
  if(ask)$("thr").onclick=()=>{$("thd").hidden=true;doRebirth()};
  $("thex").onclick=()=>{
    const text=["Kiếp Trước","Kiếp "+r.n+" · "+r.name+(r.grade?" · "+r.grade:""),"",...(r.txt||[])].join("\n");
    try{
      const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="phan-quyet-kiep-"+r.n+".txt";a.click();
      say("Đã tải phán quyết (.txt). Có thể in hoặc chuyển PDF từ trình duyệt.");
    }catch(e){prompt("Sao chép phán quyết:",text)}
  };
}
function doRebirth(){
  const rec=buildRec();(S.rbh||(S.rbh=[])).push(rec);
  if(rec.anXa){S.tdPenalty=false;S.tdStacks=0;S.failStreak=0;S.life=S.life||{};S.life.anXa=1;vlog("Thiên Đạo Ân Xá: Trừng Phạt và chuỗi fail đã được xóa bỏ.");burst();sfx(880)}
  if(rec.grade==="Viên Mãn Xuất Chúng"||rec.grade==="Xuất Sắc"){S.life=S.life||{};S.life.excel=1}
  if(S.sect!=null){S.life=S.life||{};S.life.sectN=(S.life.sectN||0)+1}
  // legacy + life + ui + name + god + tut + diary prefs keep
  S.rb=(S.rb||0)+1;
  S.storyLog=[];S.storyFlags={};S.points=0;S.hist={};S.cnt={};S.stl=[];S.rm=0;S.pk=0;S.tm=0;S.kc={};S.kst=null;KS();
  S.menh=100;S.failStreak=0;
  KSALT=S.rb*7919;S.thdAsk=0;S.sem=null;S.exLock=null;S.fx=[];S.buff={n:0,m:1};S.xb=null;S.tb=null;S.sh=null;S.sl=0;S.lt=0;S.ln=null;S.kd=null;S.eb=0;S.pw=0;S.master=null;
  S.inv={};S.pets={};S.act=null;S.tt={};S.title=null;S.nw=null;S.sect=null;S.gameSec=0;S.streak={n:0,last:""};
  S.quests=[];S.chains=[];S.claimed={};S.sched={};S.ev={w:{h:10,r:100},m:{h:40,r:500}};S.sm=null;
  if(S.lb){S.lb.t0=Date.now();S.lb.adj=Array(50).fill(0);S.lb.bal=Array(50).fill(0);S.lb.week=weekStart();S.lb.log="";S.lb.sp={};S.lb.spx={};S.lb.spl=[];S.lb.gb=[];S.lb.dv=[];S.lb.hh=[];S.lb.td=[]}
  S.bal=0
  S.sp=null;
  CH.length=CD.length=EC.length=FL.length=RK.length=SO.length=0;RKn=0;htReset();PV={};PI=null;
  vlog("Luân hồi lần "+S.rb+". Mọi thứ của kiếp trước đã trở về hư không.");
  chkLegacy();
  save();render();showThd(rec);sfx(392);setTimeout(()=>sfx(659),150);
}
const rbx=document.createElement("div");rbx.style.display="contents";rbx.id="rbs";$("sbody").appendChild(rbx);
function renderRbs(){
  const h=S.rbh||[],cur=KS().pk,best=h.reduce((a,r)=>(!a||r.pk>a.pk)?r:a,null);
  const bb=bk(),top=bb.pk>0?"Kiếp "+bb.n+(bb.cur?" (đang tu)":"")+": "+bb.pk+" linh lực":"chưa có";
  $("rbs").innerHTML=fold("t7","Các Kiếp Trước",`<div class="grid2"><div><span class="lbl">Số kiếp đã qua</span><div class="num">${h.length}</div><small>Đang ở kiếp thứ ${(S.rb||0)+1}</small></div><div><span class="lbl">Kiếp đỉnh nhất</span><div class="num" style="font-size:18px">${top}</div></div></div>${h.length?`<ul>${h.map((r,i)=>`<li><div class="nm">Kiếp ${r.n}${r.name?" · "+r.name:""}${r.grade?" · "+r.grade:""}<small>Dừng chân ở ${r.pk>=END?"Chân Tiên":rname(r.pk)}. ${r.days} ngày, ${r.quests} nhiệm vụ, hạng ${r.rank}, đỉnh ${r.pk} linh lực.</small></div><button class="btn alt" data-vi="${i}">Xem lại</button></li>`).reverse().join("")}</ul>`:""}`,0);
}
$("rbs").onclick=e=>{const b=e.target.closest("[data-vi]");if(b&&S.rbh&&S.rbh[+b.dataset.vi])showThd(S.rbh[+b.dataset.vi])};
function askName(){
  const o=$("nmo");
  const g=S.gender==="nu"?"nu":"nam";
  o.innerHTML=`<div class="box"><h2>Nhập đạo · Chọn hình thể</h2>
    <small>Thiên Đạo cần biết đạo hiệu và hình thể của ngươi. Avatar theo nam hoặc nữ.</small>
    <div class="row" style="margin-top:10px;justify-content:center;gap:16px;flex-wrap:wrap">
      <button type="button" class="btn alt gender-pick${g==="nam"?" on":""}" data-g="nam" style="padding:8px;min-width:120px">
        <img src="${AV_NAM}" alt="Nam" width="88" height="88" style="border-radius:50%;object-fit:cover;border:3px solid ${g==="nam"?"var(--gold)":"var(--line)"};display:block;margin:0 auto 6px">
        <span>Nam tu</span>
      </button>
      <button type="button" class="btn alt gender-pick${g==="nu"?" on":""}" data-g="nu" style="padding:8px;min-width:120px">
        <img src="${AV_NU}" alt="Nữ" width="88" height="88" style="border-radius:50%;object-fit:cover;border:3px solid ${g==="nu"?"var(--gold)":"var(--line)"};display:block;margin:0 auto 6px">
        <span>Nữ tu</span>
      </button>
    </div>
    <div class="row" style="margin-top:12px"><input type="text" id="nmi" maxlength="20" placeholder="Ví dụ: Lăng Vân / Tố Tuyết" value="${S.name||""}"><button class="btn" id="nmk" style="margin-left:0">Nhập đạo</button></div>
  </div>`;
  o.hidden=false;
  let pick=g;
  o.querySelectorAll(".gender-pick").forEach(btn=>{
    btn.onclick=()=>{
      pick=btn.dataset.g;
      o.querySelectorAll(".gender-pick").forEach(b=>{
        const on=b.dataset.g===pick;
        b.classList.toggle("on",on);
        const img=b.querySelector("img");
        if(img)img.style.borderColor=on?"var(--gold)":"var(--line)";
      });
    };
  });
  const done=()=>{
    const v=$("nmi").value.replace(/[<>&"'`]/g,"").trim().slice(0,20);
    if(!v){$("nmi").focus();return}
    S.name=v;S.gender=pick||"nam";
    save();o.hidden=true;render();
    say("Chào mừng "+(S.gender==="nu"?"nữ tu":"đạo hữu")+" "+v+".");
    if(!S.tutDone)setTimeout(showTut,300);
  };
  $("nmk").onclick=done;$("nmi").onkeydown=e=>{if(e.key==="Enter")done()};
}
if(!S.name||!S.gender)askName();
else if(!S.tutDone)setTimeout(showTut,400);

/* Thiên diễn */
$("f").innerHTML=`<div class="box"><h2>Thiên Diễn</h2><small>Suy diễn tu vi các tu sĩ sau số ngày bạn nhập, rồi tính bạn cần tu luyện thế nào để giữ hạng hiện tại. Tối đa 90 ngày.</small><div class="row"><label>Sau <input type="number" id="fd" min="1" max="90" value="7"> ngày</label><button class="btn" id="fgo">Diễn toán</button></div></div><div id="fout"></div>`;
function thienDien(){
  const X=Math.min(90,Math.max(1,parseInt($("fd").value)||7)),now=Date.now(),T=now+X*864e5;$("fd").value=X;
  const rows=B.map((b,i)=>({n:b.n,x0:bxp(i,now),x1:bxp(i,T),s1:sc(i,T)})),srt=rows.slice().sort((a,b)=>b.s1-a.s1);
  const r=myRk(),edge=r<=srt.length?srt[r-1].s1:0,need=Math.max(0,Math.ceil(edge-S.points));
  const sn=(S.streak.last===today()||S.streak.last===dayStr(1))?S.streak.n:0;
  const em=(1+Math.min(.5,.05*Math.max(0,sn-1)))*(S.tm?.8:1);
  const hr=need/X/(S.perHour*em),rk=h=>1+rows.filter(z=>z.s1>S.points+h*S.perHour*em*X).length;
  const verdict=need<=0?"Không cần tu thêm, hạng của bạn vẫn giữ nguyên.":hr>24?"Cần hơn 24 giờ mỗi ngày, không thể giữ hạng này.":"Cần tu luyện khoảng "+hr.toFixed(1)+" giờ mỗi ngày ("+Math.ceil(need/X)+" linh lực mỗi ngày).";
  $("fout").innerHTML=`<div class="box" style="margin-top:14px"><h2>Giữ hạng ${r}/${B.length+1}</h2><p style="margin:6px 0">${verdict}</p><small>Tính theo ${S.perHour} linh lực mỗi giờ nhân hệ số thưởng hiện tại ×${em.toFixed(2)}. Chưa tính linh lực cố định và linh lực bạn tiêu cho nhàn hạ. Bot đứng cuối mỗi tuần mất 20% nên kết quả có thể lệch nhẹ.</small></div><div class="box" style="margin-top:14px"><h2>Hạng của bạn sau ${X} ngày</h2><ul>${[0,1,2,3,4,6,8].map(h=>`<li><div class="nm">${h} giờ mỗi ngày</div><b>hạng ${rk(h)}</b></li>`).join("")}</ul></div><div class="box" style="margin-top:14px"><h2>Tu vi các tu sĩ sau ${X} ngày</h2><ul>${rows.slice().sort((a,b)=>b.x1-a.x1).slice(0,15).map(z=>`<li><div class="nm">${z.n}<small>${rname(z.x0)} → ${rname(z.x1)}</small></div><b>${Math.round(z.x1)}</b></li>`).join("")}</ul><small>Hiện 15 tu sĩ mạnh nhất sau ${X} ngày, đơn vị linh lực.</small></div>`;
}
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
