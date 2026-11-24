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
  function buildRecord(state,deps){
    const cycle=deps.cycle(),history=state.hist,now=deps.now();
    const studyDays=Object.keys(history).filter(day=>history[day].p>0||history[day].m>0).sort();
    let minutes=0,best={d:"",p:0};
    for(const day of studyDays){
      minutes+=history[day].m;
      if(history[day].p>best.p)best={d:day,p:history[day].p};
    }
    const pet=deps.pets.find(p=>p.id===state.act);
    const title=deps.titles.find(t=>t.id===state.title&&deps.isTitleUnlocked(t));
    const record={
      n:(state.rb||0)+1,name:state.name||"đạo hữu",
      pk:Math.round(Math.max(cycle.pk,state.points)),fin:Math.round(state.points),
      days:Math.max(1,Math.round((now-cycle.start)/864e5)),hrs:minutes/60,
      quests:Object.values(state.cnt||{}).reduce((total,count)=>total+count,0),
      best,ms:cycle.ms,tm:cycle.tm,kn:Object.keys(state.kc||{}).length,
      miles:deps.milestones().filter(([realm])=>realm>0),rank:deps.rank(),
      pet:pet?pet.n:"",title:title?title.n:"",at:now
    };
    record.npc=Math.round(deps.npcs.reduce((total,_,index)=>total+deps.npcXp(index,now),0)/deps.npcs.length);
    record.exg=state.sem?Object.values(state.sem.res).map(result=>result.rows.find(row=>row.u)?.g).filter(Boolean):[];
    record.tt=Object.keys(state.tt||{}).length;
    record.it=deps.lifeStats().it;
    record.sect=state.sect!=null?deps.sects[state.sect].n:"";
    return Object.assign(record,narrate(record,{
      end:deps.end,realms:deps.realms,realmName:deps.realmName,
      npcCount:deps.npcs.length,penalized:state.tdPenalty
    }));
  }
  function narrate(r,{end,realms,realmName,npcCount,penalized}){
    const P=[],f=ts=>new Date(ts).toLocaleDateString("vi-VN"),avg=r.hrs/r.days,full=r.pk>=end;
    // Đánh giá tổng thể dựa trên giờ học, hạng, linh lực đỉnh và chuỗi ngày
    const summary=gradeSummary(r,end),grade=summary.grade,gTxt=summary.text;
    P.push(`Kiếp thứ ${r.n}, có một người tên ${r.name}${r.sect?`, đệ tử ${r.sect}`:""}. Tu hành ${r.days} ngày, tổng cộng ${Math.round(r.hrs)} canh giờ, bình quân ${avg.toFixed(1)} giờ mỗi ngày. ${avg>=6?"Người ngoài gọi là liều mạng. Người ấy chỉ gọi là học.":avg>=3?"Không nhanh, không chậm. Ngày nào cũng ngồi xuống.":"Có ngày ngồi trước án thư, có ngày không."}`);
    const L=[];
    if(r.miles.length){const a=r.miles[0],z=r.miles[r.miles.length-1];L.push(`Ngày ${f(a[1])}, nhập ${realms[a[0]][0]}.`+(z!==a?` Ngày ${f(z[1])}, bước vào ${realms[z[0]][0]}.`:""))}
    if(r.best.d)L.push(`Ngày ${r.best.d} học nhiều nhất: ${Math.round(r.best.p)} linh lực.`);
    if(L.length)P.push(L.join(" "));
    P.push((r.ms>=14?`Có lần giữ trọn ${r.ms} ngày không đứt.`:r.ms>=5?`Chuỗi dài nhất ${r.ms} ngày.`:`Chuỗi dài nhất chỉ ${r.ms} ngày.`)+(r.tm?` Tâm ma tìm đến ${r.tm} lần. ${r.tm>2?"Ngã xuống, đứng dậy, rồi lại ngã xuống, lại đứng dậy.":"Đều qua được."}`:` Tâm ma chưa từng tìm đến.`));
    P.push(`Hoàn thành ${r.quests} nhiệm vụ${r.kn?`, vượt ${r.kn} kiếp nạn`:""}.${r.pet?` ${r.pet} đi cùng đến cuối.`:""}${r.title?` Người đời gọi là 「${r.title}」.`:""}`);
    if(r.exg.length){const c=g=>r.exg.filter(x=>x===g).length;P.push(`Thiên kiếp ${r.exg.length} đợt: ${c("Xuất sắc")} lần Xuất sắc, ${c("Giỏi")} lần Giỏi, ${c("Yếu")} lần Yếu.`);}
    P.push(`Khi kiếp khép, đứng hạng ${r.rank}/${npcCount+1} Thiên Kiêu Bảng, linh lực đỉnh ${r.pk}. ${r.pk>=r.npc?`Cao hơn mức trung bình ${r.npc} của chúng tu sĩ.`:`Thấp hơn mức trung bình ${r.npc}, thiếu ${r.npc-r.pk}.`} Mang theo ${r.tt} danh hiệu, ${r.it} vật phẩm.`);
    P.push(full?`Một đời tu hành, dừng chân ở Chân Tiên.`:`Một đời tu hành, dừng chân ở ${realmName(r.pk)}.`);
    // Thiên Đạo Ân Xá: viên mãn + mọi thiên kiếp từ Khá trở lên
    const allKhá=r.exg.length>0&&r.exg.every(g=>g==="Xuất sắc"||g==="Giỏi"||g==="Khá");
    const anXa=penalized&&full&&allKhá&&(grade==="Viên Mãn Xuất Chúng"||grade==="Xuất Sắc"||grade==="Giỏi");
    if(anXa){
      P.push(`【Ân Xá】Một kiếp viên mãn, mọi thiên kiếp từ Khá trở lên. Lệnh Trừng Phạt được gỡ.`);
    }else if(penalized){
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
    const ecat=full?"full":(penalized&&!anXa)?"pen":(grade==="Viên Mãn Xuất Chúng"||grade==="Xuất Sắc"||grade==="Giỏi")?"good":grade==="Yếu"?"weak":"mid";
    const EA=EL[ecat];P.push(EA[(r.n+r.days)%EA.length]);
    return {grade,anXa:!!anXa,txt:P};
  }
  root.GameRebirthData={gradeSummary,previousMemory,buildRecord};
})(typeof window!=="undefined"?window:globalThis);
