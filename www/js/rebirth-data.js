(function(root){
  "use strict";
  function gradeSummary(r,end){
    const avg=r.hrs/r.days,full=r.pk>=end;
    let grade="Trung Bình",text="Chưa thành hình.";
    if(full&&avg>=5&&r.rank<=5){grade="Viên Mãn Xuất Chúng";text="Một kiếp trọn vẹn. Hiếm có người đi hết như vậy.";}
    else if(full||(avg>=5&&r.rank<=10&&r.pk>=end*0.7)){grade="Xuất Sắc";text="Một kiếp vững vàng. Không có gì phải hổ thẹn.";}
    else if(avg>=3.5&&r.rank<=20){grade="Giỏi";text="Một kiếp đáng nhớ. Thiếu một chút nữa là xong.";}
    else if(avg>=2||r.pk>=end*0.3){grade="Trung Bình";text="Một kiếp bình thường. Bình thường cũng là đã sống.";}
    else{grade="Yếu";text="Một kiếp lơi tay. Kiếp sau còn trang trắng.";}
    return {grade,text};
  }
  function previousMemory(records){
    const h=records||[];if(!h.length)return "";
    const last=h[h.length-1];
    const bits=[];
    if(last.grade)bits.push("kiếp trước đánh giá "+last.grade);
    if(last.pk)bits.push("đỉnh "+last.pk+" linh lực");
    if(last.rank)bits.push("hạng "+last.rank);
    if(last.sect)bits.push("từng thuộc "+last.sect);
    return bits.length?"Ký ức kiếp trước: "+bits.join(", ")+".":"";
  }
  root.GameRebirthData={gradeSummary,previousMemory};
})(typeof window!=="undefined"?window:globalThis);
