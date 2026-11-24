const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const window={};
const context=vm.createContext({window,Date});
for(const file of ['systems/subjects.js','systems/review-cards.js','systems/knowledge-trial.js','ui/knowledge-trial.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../www/js',file),'utf8'),context);
const api=window.GameKnowledgeTrial;
function state(){
 const S={points:23};window.GameSubjects.init(S);
 for(let i=0;i<8;i++)S.reviewCards=window.GameReviewCards.upsert(S,null,{subjectId:i<6?'math':i===6?'code':null,question:'Hỏi '+i,answer:'<Đáp> '+i},'2026-12-31',i);
 return S;
}
test('Thí luyện: lọc môn, chọn ngẫu nhiên không trùng, đủ số câu khả dụng',()=>{
 const S=state();
 assert.equal(api.pool(S,'*').length,8);assert.equal(api.pool(S,'none').length,1);
 assert.equal(api.start(S,'english',5),null);assert.equal(api.start(S,'math',6),null);
 const r=api.start(S,'math',5,()=>0);
 assert.equal(r.cards.length,5);assert.equal(new Set(r.cards.map(c=>c.id)).size,5);
 assert.ok(r.cards.every(c=>c.subjectId==='math'));
 assert.equal(api.start(S,'math',20).cards.length,6);
 assert.notEqual(r.cards[0].id,S.reviewCards[0].id);
});
test('Thí luyện: xem đáp án, chấm một lần, luyện lại câu quên và không đổi lịch',()=>{
 const S=state(),original=JSON.stringify(S);
 let r=api.start(S,'*',5,()=>0);
 const first=api.current(r).id;
 assert.equal(api.grade(r,first,true),null);assert.equal(api.summary(r),null);
 for(let i=0;i<5;i++){
  const card=api.current(r);
  r=api.reveal(r,card.id);assert.equal(api.reveal(r,card.id),null);
  r=api.grade(r,card.id,i!==0&&i!==3);
  assert.equal(api.grade(r,card.id,true),null);
 }
 const result=api.summary(r);assert.equal(result.correct,3);assert.equal(result.percent,60);
 const retry=api.retry(r);assert.equal(retry.cards.length,2);assert.equal(retry.cards[0].id,first);
 assert.equal(retry.revealed,false);assert.equal(retry.results.length,0);
 assert.equal(JSON.stringify(S),original);
 assert.equal(api.grade(null,undefined,true),null);
});
test('Thí luyện: hiển thị an toàn, chặn nút cũ, làm lại và hủy phiên',()=>{
 const S=state(),nodes=new Map();let allow=false;
 const $=id=>{if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',hidden:false});return nodes.get(id)};
 const ui=window.GameKnowledgeTrialUI.create({S,$,today:()=>'2026-12-31',escapeHtml:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;'),confirm:()=>allow});
 ui.bind();ui.render();$('trial-subject').value='code';$('trial-subject').onchange();$('trial-count').value='5';
 assert.equal($('trial-available').textContent,'1 thẻ khả dụng');$('trial-start').onclick();
 const host=$('trial-current'),click=(trial,token='1-0')=>host.onclick({target:{closest:()=>({dataset:{trial,token}})}});
 assert.doesNotMatch(host.innerHTML,/&lt;Đáp&gt;/);click('remember');assert.match(host.innerHTML,/Câu 1\/1/);
 click('end');assert.equal($('trial-setup').hidden,true);
 click('reveal');assert.match(host.innerHTML,/&lt;Đáp&gt;/);click('forget');
 assert.match(host.innerHTML,/0\/1 · 0%/);click('retry','1-1');
 click('reveal');assert.doesNotMatch(host.innerHTML,/&lt;Đáp&gt;/);
 click('reveal','2-0');click('remember','2-0');assert.match(host.innerHTML,/1\/1 · 100%/);
 click('end','2-1');assert.equal($('trial-setup').hidden,false);
 $('trial-start').onclick();allow=true;click('end','3-0');assert.equal($('trial-setup').hidden,false);
});
test('Ôn ngày mai: giữ bậc, lịch sớm hơn và bỏ qua thẻ đã sửa hoặc xóa',()=>{
 const S=state(),missed=S.reviewCards.slice(0,5).map(c=>({...c}));
 Object.assign(S.reviewCards[0],{due:'2027-01-12',stage:4});
 S.reviewCards[1].due='2027-01-01';
 Object.assign(S.reviewCards[3],{question:'Nội dung đã sửa',due:'2027-01-12'});
 S.reviewCards.splice(4,1);
 S.reviewCards[4].due='2027-01-12';
 const before=JSON.stringify(S);
 const plan=window.GameReviewCards.reviewTomorrow(S,missed,'2026-12-31');
 assert.equal(plan.count,1);
 assert.equal(plan.cards[0].due,'2027-01-01');
 assert.equal(plan.cards[0].stage,4);
 for(let i=1;i<plan.cards.length;i++)assert.equal(plan.cards[i],S.reviewCards[i]);
 assert.equal(JSON.stringify(S),before);
 assert.equal(window.GameReviewCards.reviewTomorrow({...S,reviewCards:plan.cards},missed,'2026-12-31'),null);
});
