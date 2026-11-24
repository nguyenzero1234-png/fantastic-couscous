const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const window={};
const context=vm.createContext({window,Date});
for(const file of ['systems/subjects.js','systems/review-cards.js','data/review-card-prompt.js','ui/review-cards.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../www/js',file),'utf8'),context);
const api=window.GameReviewCards;
const values={subjectId:'math',question:'  Công thức? ',answer:' x² '};
function state(){const S={points:23};window.GameSubjects.init(S);return S}

test('Ôn Cố Lục: lịch ôn, quên, bậc tối đa và ngày thực',()=>{
 const S=state();S.reviewCards=api.upsert(S,null,values,'2026-12-31',1);
 const id=S.reviewCards[0].id;
 assert.equal(api.valid(S.reviewCards),true);
 assert.equal(S.reviewCards[0].question,'Công thức?');
 assert.equal(api.upsert(S,null,values,'2026-02-30'),null);
 assert.equal(api.grade(S,id,true,'2026-12-30'),null);
 for(const [day,next,stage] of [['2026-12-31','2027-01-01',1],['2027-01-01','2027-01-04',2],['2027-01-04','2027-01-11',3],['2027-01-11','2027-01-25',4],['2027-01-25','2027-02-24',5],['2027-02-24','2027-03-26',5]]){
  S.reviewCards=api.grade(S,id,true,day);
  assert.equal(S.reviewCards[0].due,next);assert.equal(S.reviewCards[0].stage,stage);
  assert.equal(api.due(S,day).length,0);
 }
 S.reviewCards=api.grade(S,id,false,'2027-03-26');
 assert.equal(S.reviewCards[0].stage,0);assert.equal(S.reviewCards[0].due,'2027-03-27');
 assert.equal(S.points,23);
});

test('Ôn Cố Lục: sửa thẻ, trùng ID, thứ tự và giới hạn',()=>{
 const S=state();S.reviewCards=api.upsert(S,null,values,'2026-11-24',1);
 const id=S.reviewCards[0].id;
 S.reviewCards=api.upsert(S,null,values,'2026-11-23',1);
 assert.notEqual(S.reviewCards[1].id,id);
 assert.equal(api.due(S,'2026-11-24')[0].due,'2026-11-23');
 S.reviewCards=api.grade(S,id,true,'2026-11-24');
 S.reviewCards=api.upsert(S,id,{...values,subjectId:'code'},'2026-11-24');
 assert.equal(S.reviewCards[0].stage,1);
 S.reviewCards=api.upsert(S,id,{...values,answer:'Mới'},'2026-11-24');
 assert.equal(S.reviewCards[0].stage,0);assert.equal(S.reviewCards[0].due,'2026-11-24');
 assert.equal(api.valid([S.reviewCards[0],S.reviewCards[0]]),false);
 assert.equal(api.valid([{...S.reviewCards[0],due:'2026-02-29'}]),false);
 assert.equal(api.upsert(S,null,{...values,subjectId:'missing'},'2026-11-24'),null);
 assert.equal(api.remove(S,id).length,1);
 S.reviewCards=Array.from({length:300},(_,i)=>({...S.reviewCards[0],id:'review-'+i}));
 assert.equal(api.valid(S.reviewCards),true);assert.equal(api.upsert(S,null,values,'2026-11-24'),null);
});

test('Ôn Cố Lục: prompt AI có môn hiện tại và hướng dẫn đọc ảnh',()=>{
 const prompt=window.GameReviewCardPrompt.build(state());
 assert.match(prompt,/Toán học/);assert.match(prompt,/ảnh chụp/i);assert.match(prompt,/không tự suy đoán/);
 assert.match(prompt,/3 cột/);assert.match(prompt,/TAB/);
});

test('Ôn Cố Lục: nhập TSV và pipe, bỏ trùng, từ chối môn lạ và không sửa dữ liệu gốc',()=>{
 const S=state(),before=S.reviewCards;
 const text='\uFEFF```tsv\r\nMôn học\tCâu hỏi\tĐáp án\r\n---\t---\t---\r\nToán học\tĐạo hàm của sin(x)?\tcos(x).\r\nToán học\t đạo hàm CỦA sin(x)? \tĐáp án trùng.\r\n\tMột câu chưa phân môn?\tNội dung.\r\nMôn không tồn tại\tCâu hỏi?\tĐáp án.\r\nDòng sai định dạng\r\n```';
 const result=api.importText(S,text,'2026-11-24',100);
 assert.equal(result.added,2);assert.equal(result.skipped,1);assert.equal(result.invalid,2);
 assert.equal(result.cards.length,2);assert.equal(result.cards[0].subjectId,'math');assert.equal(result.cards[1].subjectId,null);
 assert.equal(S.reviewCards,before);
 const pipe=api.importText(S,'| Lập trình | Con trỏ là gì? | Biến lưu địa chỉ. |','2026-11-24',200);
 assert.equal(pipe.added,1);assert.equal(pipe.cards[0].subjectId,'code');
});

test('Ôn Cố Lục: nhập AI tôn trọng giới hạn 300 thẻ',()=>{
 const S=state();S.reviewCards=Array.from({length:300},(_,i)=>({id:'review-'+i,subjectId:'math',question:'Câu '+i,answer:'Đáp án',stage:0,due:'2026-11-24'}));
 const result=api.importText(S,'Toán học\tCâu mới?\tĐáp án.','2026-11-24',300);
 assert.equal(result.added,0);assert.equal(result.capacity,1);assert.equal(result.skipped,1);assert.equal(result.cards,null);
});

test('Ôn Cố Lục: giao diện ẩn đáp án, thoát HTML và hoàn tác khi lưu lỗi',()=>{
 const S=state(),nodes=new Map();let writable=false;
 const $=id=>{if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',hidden:false});return nodes.get(id)};
 const ui=window.GameReviewCardsUI.create({S,$,today:()=> '2026-11-24',escapeHtml:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;'),save:()=>writable,say:()=>{},confirm:()=>true});
 ui.bind();ui.render();
 $('review-question').value='<h1>Hỏi</h1>';$('review-answer').value='<script>Đáp</script>';
 $('review-save').onclick();assert.equal(S.reviewCards,undefined);assert.equal($('review-answer').value,'<script>Đáp</script>');
 writable=true;$('review-save').onclick();
 const id=S.reviewCards[0].id,host=$('review-current');
 assert.match(host.innerHTML,/&lt;h1&gt;/);assert.doesNotMatch(host.innerHTML,/Đáp<|&lt;script&gt;/);
 const click=review=>host.onclick({target:{closest:()=>({dataset:{review,id}})}});
 click('remember');assert.equal(S.reviewCards[0].stage,0);
 click('reveal');assert.match(host.innerHTML,/&lt;script&gt;/);
 writable=false;click('remember');assert.equal(S.reviewCards[0].stage,0);
 writable=true;click('remember');assert.equal(S.reviewCards[0].stage,1);assert.match(host.innerHTML,/Đã ôn hết/);
});

test('Ôn Cố Lục: UI chép prompt và chỉ lưu thẻ AI khi lưu thành công',async()=>{
 const S=state(),nodes=new Map(),messages=[];let writable=false,copied='';
 window.navigator={clipboard:{writeText:text=>{copied=text;return Promise.resolve()}}};
 const $=id=>{if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',hidden:false});return nodes.get(id)};
 const ui=window.GameReviewCardsUI.create({S,$,today:()=> '2026-11-24',escapeHtml:s=>String(s),save:()=>writable,say:message=>messages.push(message),confirm:()=>true});
 ui.bind();$('review-prompt').onclick();await Promise.resolve();
 assert.match(copied,/Ôn Cố Lục/);assert.match($('review-import-hint').textContent,/Đã chép prompt/);
 $('review-import').value='Toán học\tĐịnh lý?\tNội dung định lý.';
 $('review-import-btn').onclick();assert.equal(S.reviewCards,undefined);
 writable=true;$('review-import-btn').onclick();
 assert.equal(S.reviewCards.length,1);assert.equal(S.reviewCards[0].question,'Định lý?');
 assert.match($('review-import-hint').textContent,/Đã nhập 1 thẻ/);assert.ok(messages.length>=2);
});
