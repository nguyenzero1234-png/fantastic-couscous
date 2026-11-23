/* Danh sách NPC và cấu hình mô phỏng tĩnh; tạo một roster riêng cho mỗi game runtime. */
(function(root){
"use strict";
function create(hash,value){
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
const hs=hash, vn=value;
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

return {B,BH,F,hs,vn,CDN,isTK,bio,STG,NVC_TITLES};
}
root.GameNpcRoster={create};
})(typeof window!=="undefined"?window:globalThis);
