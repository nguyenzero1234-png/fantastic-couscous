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
  root.GameRebirthData={gradeSummary};
})(typeof window!=="undefined"?window:globalThis);
