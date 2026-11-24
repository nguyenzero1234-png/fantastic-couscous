const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
const window={};
const ctx=vm.createContext({window,Date});
for(const name of ['quests','study-planner'])vm.runInContext(readFileSync(join(__dirname,'../www/js/systems',name+'.js'),'utf8'),ctx);
const recommend=window.GameStudyPlanner.recommend;
const today='2026-11-24',now=new Date(2026,10,24,8).getTime();
const task=(id,mins=30,extra={})=>({id,name:id,mins,...extra});
const slot=(s,e,qid)=>({s,e,qid});
const plan=(quests,slots=[],extra={})=>recommend({quests,slots,today,now,active:false,...extra});

test('Stage 6C: ưu tiên hạn có thể kịp, bỏ qua việc đã xếp lịch sau',()=>{
 const quests=[task('free',10),task('later',15,{due:now+3600000}),task('impossible',30,{due:now+60000}),task('urgent',20,{due:now+40*60000})];
 const slots=[slot('08:30','09:00','later')];
 const before=JSON.stringify({quests,slots});
 assert.equal(plan(quests,slots).quest.id,'urgent');
 assert.equal(plan(quests,slots).reason,'Ưu tiên hạn gần nhất');
 assert.equal(JSON.stringify({quests,slots}),before);
});
test('Stage 6C: giữ giờ đã hẹn, kể cả lịch lặp và khung chồng lấn',()=>{
 const quests=[task('a'),task('b',10)];
 assert.equal(plan(quests,[slot('08:00','08:30','a')]).quest.id,'a');
 assert.equal(plan(quests,[slot('08:00','08:30','a')],{now:now+1}).status,'short');
 assert.equal(plan(quests,[{s:'08:00',e:'08:30',rep:1,label:'a'}]).quest.id,'a');
 assert.equal(plan(quests,[slot('08:00','09:00','a'),slot('08:05','09:00','b')]).status,'short');
 assert.equal(plan(quests,[slot('08:00','09:00','a'),slot('07:50','09:00','b')]).status,'busy');
 assert.equal(plan(quests,[slot('08:00','08:30','')]).status,'busy');
});
test('Stage 6C: loại nhiệm vụ hoàn thành, khóa, quá hạn, biên nhận khôi phục và thời lượng sai',()=>{
 const quests=[task('done',5,{doneOn:today}),task('first',5,{chain:'c',due:now-1}),task('locked',5,{chain:'c'}),task('undo',5,{completion:{undone:true,day:today}}),task('bad',0),task('repeat',5,{repeat:true,doneOn:'2026-11-23',completion:{undone:true,day:'2026-11-23'}})];
 assert.equal(plan(quests).quest.id,'repeat');
 assert.equal(plan(quests.slice(0,-1)).status,'empty');
 assert.equal(plan(quests,[],{active:true}).status,'active');
 assert.equal(plan([task('deadline',5,{due:now+300000})]).quest.id,'deadline');
 assert.equal(plan([task('deadline',5,{due:now+299999})]).status,'short');
 assert.equal(plan([task('night',5)],[],{now:new Date(2026,10,24,23,58).getTime()}).status,'short');
});
