/* ===== Sinh nội dung nhật ký tu tiên =====
   Hàm thuần: nhận toàn bộ trạng thái cần thiết qua tham số. */
(function(root){
  "use strict";
  function generate(day,stats,context,quotes){
    const n=stats.n||0,m=stats.m||0,p=stats.p||0;
    const lines=[],isT=!!context.isToday;
    const seed=[...day].reduce((a,c)=>a+c.charCodeAt(0),0);
    const pick=arr=>arr[Math.abs(seed+arr.length*7)%arr.length];
    const dow=new Date(day+"T12:00:00").getDay();
    if(n===0&&m===0){
      lines.push(pick([
        "Hôm nay không có gì để ghi. Trang để trắng. Không hỏi vì sao.",
        "Án thư trống. Bút không mở. Thiên Đạo cũng không giục.",
        "Một ngày không ngồi xuống. Sổ vẫn mở, chờ."
      ]));
      if(isT&&(context.streak||0)>=3)lines.push("Chuỗi đang giữ từ hôm trước. Hôm nay còn chưa viết tiếp.");
    }else{
      lines.push(`Ghi nhận: ${n} nhiệm vụ, tu luyện ${Math.floor(m/60)} giờ ${m%60} phút, thu ${Math.round(p)} linh lực.`);
      if(m>=180)lines.push(pick([
        "Ba canh giờ. Linh khí trong phòng đặc đến mức tiếng động cũng chậm lại.",
        "Ngồi lâu đến mức quên trời đã tối. Tu vi không quên."
      ]));
      else if(m>=120)lines.push(pick([
        "Hơn hai canh giờ. Bụi trên án thư không dám rơi.",
        "Lâu. Đủ để đạo tâm hết cãi nhau với thân xác."
      ]));
      else if(m>=60)lines.push(pick([
        "Một canh giờ đủ đầy. Không dư để khoe, không thiếu để đổ lỗi.",
        "Vừa đủ. Sổ ghi sạch một dòng."
      ]));
      else if(m>=25)lines.push(pick([
        "Ngắn nhưng có. Đạo không chê phiên ngắn nếu phiên ấy thật.",
        "Hai mươi lăm phút cũng là một viên gạch."
      ]));
      else lines.push(pick([
        "Ít. Sổ không phân biệt ít nhiều, chỉ phân biệt có hay không.",
        "Mỏng. Vẫn là một trang có chữ."
      ]));
      if((context.streak||0)>=14&&isT)lines.push(`Chuỗi ${context.streak} ngày. Thói quen đã thành xương.`);
      else if((context.streak||0)>=7&&isT)lines.push(`Chuỗi ${context.streak} ngày. Thói quen là đạo của kẻ không cần nghĩ.`);
      else if((context.streak||0)>=3&&isT)lines.push("Chuỗi đang dựng. Đứt thì dựng lại. Không ai giúp.");
      if(context.tm&&isT)lines.push(pick([
        "Tâm ma vẫn còn đó. Nó kiên nhẫn hơn.",
        "Tâm ma ngồi cạnh án thư, không nói. Cũng không cần nói."
      ]));
      if(context.sectName&&isT)lines.push(`Dưới cờ ${context.sectName}. Tông môn nhận phần này, rồi quên, như mọi tông môn.`);
      if(context.menh<40&&isT)lines.push("Mệnh mỏng như giấy ướt. Thiên kiếp tới sẽ không dừng lại chờ.");
      else if(context.menh<70&&isT&&(seed%3===0))lines.push("Mệnh không đầy. Đi chậm vẫn hơn đứng im.");
      if(context.petName&&isT&&(seed%2===0))lines.push(pick([
        context.petName+" nằm trong tầm mắt. Không đòi hỏi. Chỉ hiện diện.",
        "Linh thú "+context.petName+" thở cùng nhịp linh khí trong phòng."
      ]));
      if(dow===1)lines.push(pick(["Đầu tuần. Án thư sạch. Chữ đầu tiên thường nặng hơn chữ sau.","Ngày một. Núi không cao hơn — chỉ mới bắt đầu leo."]));
      if(dow===5)lines.push(pick(["Cuối tuần gần kề. Có người nghỉ. Có người ngồi thêm một phiên.","Ngày năm. Linh lực trong tuần đã có hình."]));
      if(dow===0)lines.push(pick(["Ngày nghỉ của thế gian. Tu tiên không có ngày nghỉ — chỉ có ngày có và ngày không.","Chủ nhật. Trang sổ không biết lịch."]));
    }
    const recent=context.storyTitles||[];
    if(recent.length)lines.push("Đạo Văn: "+recent.join(" · ")+".");
    if(isT&&context.prevMemory)lines.push(context.prevMemory);
    const q=quotes[Math.abs(seed)%quotes.length];
    lines.push("Trích: "+q.replace(/—.*$/,"").trim());
    return lines.slice(0,7);
  }
  root.GameDiaryData=Object.freeze({generate});
})(typeof window!=="undefined"?window:globalThis);
