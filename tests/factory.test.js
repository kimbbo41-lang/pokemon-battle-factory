// 원작 팩토리 규칙: 렌탈 풀·개체값·중복 금지·예고·교환 보상·팩토리헤드·프린트 + 도구 + 기충전
const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
const ok=(n,c,i)=>{if(c)R.pass++;else R.fail.push(n+(i!==undefined?' :: '+JSON.stringify(i):''));};
const mk=(d,moves,it)=>{const m=makeMon({d,m:moves,n:'Hardy',e:[0,0,0,0,0,0],it:it||''},31,it||'');m.ability=m.origAbility='run-away';m.maxHp=m.hp=5000;return m;};
function setup(p,e){reset();S.player=p;S.enemy=e;S.pIdx=0;S.eIdx=0;S.pScreen={reflect:0,light:0};S.eScreen={reflect:0,light:0};S.pSide={safeguard:0,tailwind:0};S.eSide={safeguard:0,tailwind:0};S.pHaz={};S.eHaz={};S.trickRoom=0;show('battle');renderBattle();}
const inTier=(s,t)=>{const i=DATA.sets.indexOf(s);return i>=TIERS[t][0]&&i<TIERS[t][1];};
const uniq=a=>new Set(a).size===a.length;
window.addEventListener('load',async()=>{try{localStorage.clear();
 // 렌탈 풀·개체값·도구
 for(const [r,t,iv] of [[1,0,12],[8,1,16],[15,2,20],[22,3,24],[29,4,31],[43,4,31]]){let good=true,dup=false;
  for(let i=0;i<40;i++){reset();S.round=r;startDraft(false);const rest=draftSets.filter(s=>!STRONG_DEX.has(s.d));
   if(!rest.every(s=>inTier(s,t)))good=false;if(!uniq(draftSets.map(s=>s.d))||!uniq(draftSets.map(s=>s.it)))dup=true;if(!draftSets.every((s,k)=>draftItems[k]===s.it))dup=true;if(!draftIvs.every(v=>v===iv))good=false;}
  ok(`${r}전 렌탈 구간·개체값`,good);ok(`${r}전 종족·도구 중복 없음`,!dup);}
 {reset();S.round=8;S.swaps=14;let n=0;startDraft(false);n=draftIvs.filter(v=>v===20).length;ok('교환 14회 → 후보 2마리 다음 구간',n===2,draftIvs);}
 {reset();S.round=1;S.swaps=7;startDraft(false);ok('후보에 개체값 표시',document.getElementById('draft-grid').textContent.includes('개체값'));}
 // 상대 생성
 {reset();S.round=2;S.player=[mk(143,['Tackle'],'Leftovers')];S.prevFoe=[{d:6,it:'Life Orb'}];let bad=0;for(let i=0;i<200;i++){const f=genFoe(2);if(f.sets.length!==3||!uniq(f.sets.map(s=>s.d))||!uniq(f.sets.map(s=>s.it)))bad++;if(f.sets.some(s=>s.d===143||s.d===6||s.it==='Leftovers'||s.it==='Life Orb'))bad++;}ok('상대는 내 팀·직전 상대와 겹치지 않음',!bad,bad);}
 {reset();S.round=7;S.player=[];const f=genFoe(7);ok('7번째는 다음 구간',f.kind==='strong'&&f.iv===16&&f.sets.every(s=>inTier(s,1)),f.iv);}
 {reset();S.round=10;S.player=[];const ivs=new Set();for(let i=0;i<60;i++)ivs.add(genFoe(10).iv);ok('1~6번째는 현재/이전 구간',ivs.size===2&&ivs.has(16)&&ivs.has(12),[...ivs]);}
 {reset();S.player=[];const f=genFoe(21);ok('21전 팩토리헤드',f.kind==='head'&&f.iv===12);}
 // 예고
 {reset();S.player=[];const h=r=>foeHint(genFoe(r),r);const n=s=>s.split(',').length;
  ok('1~7전 3마리',n(h(3))===3);ok('8~14전 2마리',h(9).includes('외 1마리'));ok('15~21전 선봉+첫 기술',h(16).includes('선봉')&&h(16).includes('첫 기술'));ok('22~28전 첫 기술',h(23).includes('첫 기술')&&!h(23).includes('('));ok('29전~ 타입',/타입/.test(h(30)));ok('49전 보스',h(49).includes('최종 보스'));ok('21전 예고',h(21).includes('팩토리헤드'));}
 // 팩토리헤드 + 프린트
 {reset();S.player=[mk(143,['Tackle'])];S.round=21;startRound(true);await new Promise(r=>setTimeout(r,200));ok('팩토리헤드 등장',S.trainer.name==='팩토리헤드',S.trainer.name);
  S.enemy.forEach(m=>{m.hp=0;m.fainted=true;});await winRound();ok('실버 프린트',prints().silver===1);show('title');await new Promise(r=>setTimeout(r,30));ok('타이틀 표시',document.getElementById('best-rec').textContent.includes('실버 프린트'));}
 {reset();S.player=[mk(143,['Tackle'])];S.round=49;await winGame();ok('골드 프린트',prints().gold===1);}
 // 기충전
 {const a=mk(143,['Focus Energy']),d=mk(143,['Tackle']);setup([a],[d]);await useMove(a,d,'Focus Energy','p');ok('기충전 효과',a._focus&&a.stage.spd===0&&!a._charged,[a._focus,a.stage.spd]);
  let c=0;for(let i=0;i<4000;i++)if(calcDamage(a,d,M('Tackle')).crit)c++;ok('기충전 급소율 1/4',c>800&&c<1200,c);}
 {const a=mk(143,['Charge']),d=mk(143,['Tackle']);setup([a],[d]);await useMove(a,d,'Charge','p');ok('충전은 그대로',a._charged&&a.stage.spd===1);}
 // 도구
 {const a=mk(143,['Tackle']),d=mk(143,['Tackle'],'White Herb');setup([a],[d]);d.stage.atk=-2;d.stage.spe=1;checkBerries(d,[]);ok('하양허브',d.stage.atk===0&&d.stage.spe===1&&!d.item);}
 {const d=mk(143,['Tackle'],'Mental Herb');setup([d],[mk(143,['Tackle'])]);d.attract=true;checkBerries(d,[]);ok('멘탈허브',!d.attract&&!d.item);}
 {const d=mk(143,['Tackle'],'Lansat Berry');setup([d],[mk(143,['Tackle'])]);d.hp=100;checkBerries(d,[]);ok('랑사열매',d._focus&&!d.item);}
 {const a=mk(143,['Tackle'],'Shell Bell'),d=mk(143,['Tackle']);setup([a],[d]);a.hp=100;a.stage.acc=6;await useMove(a,d,'Tackle','p');ok('조개껍질방울',a.hp>100,a.hp);}
 {const a=mk(143,['Giga Drain'],'Big Root'),b=mk(143,['Giga Drain']),d=mk(143,['Tackle']);setup([a],[d]);let x=0,y=0;const oc=calcDamage;calcDamage=(p,q,mo)=>({dmg:1000,eff:1,crit:false});a.hp=100;a.stage.acc=6;await useMove(a,d,'Giga Drain','p');x=a.hp-100;S.player=[b];b.hp=100;b.stage.acc=6;d.hp=d.maxHp;await useMove(b,d,'Giga Drain','p');y=b.hp-100;calcDamage=oc;ok('큰뿌리 1.3배',x===Math.floor(y*1.3),[x,y]);}
 {const a=mk(143,['Rain Dance'],'Damp Rock'),d=mk(143,['Tackle']);setup([a],[d]);await useMove(a,d,'Rain Dance','p');ok('축축한바위 8턴',S.weatherN===8,S.weatherN);}
 {const a=mk(143,['SolarBeam'],'Power Herb'),d=mk(143,['Tackle']);setup([a],[d]);const h=d.hp;a.stage.acc=6;await useMove(a,d,'SolarBeam','p');ok('파워풀허브',!a._charging&&!a.item&&d.hp<h);}
 {const m=mk(105,['Tackle'],'Thick Club'),n=mk(105,['Tackle']);setup([m],[n]);ok('굵은뼈 2배',effStat(m,'atk')===effStat(n,'atk')*2);}
 {const m=mk(366,['Tackle'],'DeepSeaScale'),n=mk(366,['Tackle']);setup([m],[n]);ok('심해의비늘 2배',effStat(m,'spd')===effStat(n,'spd')*2);}
 {const a=mk(83,['Tackle'],'Stick'),d=mk(143,['Tackle']);setup([a],[d]);let c=0;for(let i=0;i<4000;i++)if(calcDamage(a,d,M('Tackle')).crit)c++;ok('대파 급소율',c>800&&c<1200,c);}
 {const a=mk(143,['Bind'],'Grip Claw'),d=mk(143,['Tackle']);setup([a],[d]);a.stage.acc=6;await useMove(a,d,'Bind','p');ok('끈기갈고리손톱',d.trapped===6,d.trapped);}
 {const a=mk(143,['Tackle'],'Quick Claw'),d=mk(143,['Tackle']);setup([a],[d]);let n=0;for(let i=0;i<500;i++){const r=await quickClaw(['e','p']);if(r[0]==='p')n++;}ok('선제공격손톱 20%',n>60&&n<150,n);}
 {const a=mk(143,['Tackle']),d=mk(143,['Tackle'],'Focus Band');setup([a],[d]);let n=0;const oc=calcDamage;calcDamage=()=>({dmg:99999,eff:1,crit:false});for(let i=0;i<300;i++){d.hp=d.maxHp;d.fainted=false;a.stage.acc=6;await useMove(a,d,'Tackle','p');if(d.hp===1)n++;}calcDamage=oc;ok('기합의머리띠 10%',n>10&&n<60,n);}
 {const a=mk(143,['Tackle'],'Zoom Lens'),d=mk(143,['Tackle'],'Lax Incense');setup([a],[d]);ok('렌즈·향로 등록',TYPE_ITEM.SilverPowder==='bug'&&TYPE_ITEM['Twisted Spoon']==='psychic');}
}catch(x){R.err=x.stack}document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
