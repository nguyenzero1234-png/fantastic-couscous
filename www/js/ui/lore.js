/* UI phần Thiên Cơ Lục; danh sách tông môn được truyền từ hệ thống. */
(function(root){
 "use strict";
 function create(deps){
  const {SECTS,$}=deps;
  function render(){
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
  return Object.freeze({render});
 }
 root.GameLoreUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
