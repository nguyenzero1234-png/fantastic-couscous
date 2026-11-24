/* Tính cách, vấn đạo và phong văn. Các tương tác chỉ ghi ký lục. */
(function(root){
  "use strict";
  const early=[
    ["Ung dung","Đặt một việc nhỏ trước mắt. Làm xong rồi hãy nghỉ.","Đã tu luyện thì cũng nên dành chút thời gian dưỡng thần."],
    ["Hay trì hoãn","Đừng đợi đến kỳ hạn mới bắt đầu như ta.","Giữ nhịp hôm nay, ngày mai sẽ nhẹ gánh."],
    ["Điềm đạm","Một trang đạo kinh cũng là một bước tiến.","Chậm mà đều, đạo lộ tự dài."],
    ["Ham học","Chỗ nào chưa hiểu, chúng ta cùng đọc lại.","Hãy thử tự giải thích điều vừa học bằng lời của mình."],
    ["Cần mẫn","Chọn một việc vừa sức rồi bắt tay vào làm.","Ngày mai vẫn giữ một khoảng giờ cho đèn sách nhé."],
    ["Trầm tư","Ban ngày còn dài, đừng để mọi việc dồn về đêm.","Học đủ rồi hãy ngủ đúng giờ. Đạo tâm cũng cần nghỉ."],
    ["Bền bỉ","Hãy bắt đầu bằng một bước có thể lặp lại mỗi ngày.","Đường dài quý ở sự đều đặn. Giữ sức cho ngày mai."],
    ["Ẩn dật","Tìm một chỗ tĩnh lặng và đọc kỹ một đoạn kinh.","Tĩnh tâm ôn lại điều đã ngộ trước khi đi tiếp."],
    ["Thông tuệ","Thử một bài vừa vượt khỏi sở trường của ngươi.","Biết đáp án rồi, hãy tìm xem còn cách giải nào khác."],
    ["Bất khuất","Một lần vấp ngã cũng có thể dạy ngươi cách đứng lên.","Điều đáng quý là nỗ lực ngươi đã tự mình bỏ ra."]
  ];
  const ordinary=[
    ["Tỉ mỉ","Chia bài khó thành từng phần rõ ràng.","Kiểm tra lại từng bước. Sai một nét, trận pháp có thể lệch."],
    ["Kiên nhẫn","Chưa hiểu thì thử lại với một ví dụ đơn giản.","Ghi lại lỗi vừa gặp để lần sau tránh được."],
    ["Ít lời","Chọn một bài trọng tâm, tập trung giải cho trọn.","Thử giải lại bài ấy bằng một cách ngắn gọn hơn."],
    ["Hiếu học","Mở sách, đọc một đoạn rồi tự đặt câu hỏi.","Khép sách và thử nhớ lại những ý chính."],
    ["Tĩnh tâm","Hít thở đều, chọn việc học đầu tiên của hôm nay.","Dừng một lát để tâm trí được thanh thản."],
    ["Hiếu thắng","Tự đặt một mục tiêu nhỏ để vượt qua chính mình.","So với hôm qua, ngươi đã hiểu thêm điều gì?"],
    ["Hiếu khách","Ghi vài dòng về điều ngươi muốn hiểu rõ.","Thử giảng lại bài học cho một đồng môn."],
    ["Gan dạ","Bài khó cứ thử từng bước, chưa cần giải hết.","Nhìn lại những chỗ chưa chắc trước khi sang bài khác."]
  ];
  const talents=[
    ["Hào sảng","Nếu chưa biết bắt đầu ở đâu, hãy chọn việc quan trọng nhất.","Hôm nay đã có tiến bộ. Cùng giữ lời hẹn ngày mai."],
    ["Lạc quan","Cơ duyên có lúc đến, lúc đi. Hãy chuẩn bị bằng việc học.","Gặp điều hay thì ghi lại, lần sau sẽ dùng được."],
    ["Khó dò","Thời gian trôi qua rất nhanh. Đạo hữu định dành nó cho việc gì?","Biết mình còn thiếu gì cũng là một loại ngộ tính."],
    ["Kiêu ngạo","Muốn tranh đệ nhất, trước hết hãy hoàn thành việc trước mắt.","Tự kiểm tra xem mình thực sự hiểu được bao nhiêu."],
    ["Quyết liệt","Chọn một trở ngại ngươi có thể vượt qua hôm nay.","Vững căn cơ rồi mới tiến. Không cần ép bản thân quá sức."],
    ["Mưu lược","Sắp xếp việc cần học theo thứ tự ưu tiên.","Nhìn lại kế hoạch, dành thời gian cho phần còn yếu."],
    ["Ôn hòa","Hôm nay đọc một trang cũng đáng quý, cứ thong thả.","Đạo hữu đã vất vả rồi. Hãy để thân tâm nghỉ ngơi."],
    ["Thực dụng","Đừng trông chờ vận may. Hãy tự tạo cơ hội bằng việc học.","Xem phần nào cần ôn lại, đừng để công sức trôi đi."],
    ["Phóng khoáng","Đổi cách tiếp cận xem, biết đâu lại mở được một lối đi.","Điều vừa học có thể dùng ở đâu nữa?"],
    ["Trầm ổn","Một bước vững vàng hôm nay đáng giá hơn một lời hứa.","Căn cơ đã dày thêm. Cứ giữ nhịp của riêng mình."]
  ];
  const gatherings=[
    ["Luận đạo đình","Một buổi đàm đạo về cách ôn kinh và ghi chép."],
    ["Tàng thư mở cửa","Các tu sĩ cùng trao đổi kinh thư và kiến giải."],
    ["Thanh trà hội","Đồng môn gặp nhau bên trà, kể chuyện trên đường cầu đạo."],
    ["Bút đàm","Tu sĩ chia sẻ những điều còn vướng mắc trong đạo kinh."]
  ];
  function create({S,B,hash,today,getKAge,days,pushStory,save}){
    const personality=i=>early[i]||talents[i-40]||
      ordinary[Math.floor(Math.abs(hash(i+1,71,0))*8)%8];
    function dialogue(i){
      const p=personality(i);
      return {trait:p[0],line:p[(S.hist[today()]?.m||0)>0?2:1]};
    }
    function canRecord(){
      return !(S.storyFlags?.npcTalkDay>=today());
    }
    function record(i){
      if(!Number.isInteger(i)||!B[i]||!canRecord())return false;
      const day=today(),previousLog=S.storyLog?.slice(),previousFlags=S.storyFlags;
      const line=dialogue(i).line;
      if(!pushStory("npc-talk:"+day,"Vấn đạo · "+B[i].n,[line],{npc:i}))return false;
      S.storyFlags={...previousFlags,npcTalkDay:day};
      if(save())return true;
      S.storyLog=previousLog;S.storyFlags=previousFlags;
      return false;
    }
    function events(){
      const day=Math.max(1,Math.min(days,Math.floor(getKAge())+1));
      const period=Math.floor((day-1)/3),life=S.rb||0;
      const out=[];
      for(let p=period;p>=Math.max(0,period-2);p--){
        const i=(p*17+(life%B.length)*11)%B.length;
        const [title,description]=gatherings[(p+life)%gatherings.length];
        out.push({day:p*3+1,title,description,npc:B[i].n,trait:personality(i)[0]});
      }
      return out;
    }
    return Object.freeze({personality:i=>personality(i)[0],dialogue,canRecord,record,events});
  }
  root.GameNpcWorld=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
