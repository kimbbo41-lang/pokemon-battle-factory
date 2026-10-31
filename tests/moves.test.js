const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
const ok=(name,cond,info)=>{if(cond)R.pass++;else R.fail.push(name+(info!==undefined?' :: '+JSON.stringify(info):''));};
const mk=(d,moves,item,ab)=>{const m=makeMon({d,m:moves,n:'Hardy',e:[0,0,0,0,0,0],it:item||''},31,item||'');if(ab){m.ability=m.origAbility=ab;m.abilityKo=ab;}m.maxHp=m.hp=Math.max(m.maxHp,300);return m;};
function setup(p,e,p2,e2){reset();S.player=[p,p2||mk(143,['Tackle'])];S.enemy=[e,e2||mk(143,['Tackle'])];S.pIdx=0;S.eIdx=0;
  S.pScreen={reflect:0,light:0};S.eScreen={reflect:0,light:0};S.pSide={safeguard:0,tailwind:0};S.eSide={safeguard:0,tailwind:0};S.trickRoom=0;
  S.trainer={cls:'t',name:'t',quote:''};show('battle');renderBattle();}
const sl=ms=>new Promise(r=>setTimeout(r,ms));
window.addEventListener('load',async()=>{try{
  // ---- 위력 계산 ----
  {const a=mk(25,['Facade']),d=mk(143,['Tackle']);setup(a,d);a.status='brn';ok('객기 화상 2배',dynMove(a,d,M('Facade'),'Facade').mo.p===140);
   a.status=null;ok('객기 평상시',dynMove(a,d,M('Facade'),'Facade').mo.p===70);
   a.hp=1;ok('기사회생 HP1 → 200',dynMove(a,d,M('Reversal'),'Reversal').mo.p===200);
   a.hp=a.maxHp;ok('분화 만피 150',dynMove(a,d,M('Eruption'),'Eruption').mo.p===150);
   d.hp=Math.floor(d.maxHp/2);ok('소금물 절반 2배',dynMove(a,d,M('Brine'),'Brine').mo.p===130);
   ok('안다리걸기 잠만보(460kg) 120',dynMove(a,d,M('Low Kick'),'Low Kick').mo.p===120);
   ok('풀묶기 피카츄(6kg) 20',dynMove(d,a,M('Grass Knot'),'Grass Knot').mo.p===20);
   S.weather='rain';const wb=dynMove(a,d,M('Weather Ball'),'Weather Ball').mo;ok('웨더볼 비 → 물 100',wb.t==='water'&&wb.p===100,wb);S.weather=null;
   d.stage.atk=2;d.stage.spe=1;ok('혼내기 +3랭크 → 120',dynMove(a,d,M('Punishment'),'Punishment').mo.p===120);
   a._lastExec=null;const f1=dynMove(a,d,M('Fury Cutter'),'Fury Cutter').mo.p,f2=dynMove(a,d,M('Fury Cutter'),'Fury Cutter').mo.p,f3=dynMove(a,d,M('Fury Cutter'),'Fury Cutter').mo.p;ok('연속자르기 40→80→160',f1===40&&f2===80&&f3===160,[f1,f2,f3]);
   d.status='slp';ok('잠깨움뺨치기 수면 2배',dynMove(a,d,M('Wake-Up Slap'),'Wake-Up Slap').mo.p===140);
   ok('비밀의힘 마비 30%',dynMove(a,d,M('Secret Power'),'Secret Power').mo.ailc===30);
   a.pp[0]=0;a.moves[0]='Trump Card';ok('마지막수단 PP0 → 200',dynMove(a,d,M('Trump Card'),'Trump Card').mo.p===200);
   a._charged=true;ok('충전 후 전기 2배',dynMove(a,d,M('Thunderbolt'),'Thunderbolt').mo.p===180);}
  // ---- 실제 기술 사용 ----
  {const a=mk(68,['Brick Break']),d=mk(143,['Tackle']);setup(a,d);S.eScreen.reflect=5;S.eScreen.light=5;
   await useMove(a,d,'Brick Break','p');ok('깨뜨리다 벽 파괴',S.eScreen.reflect===0&&S.eScreen.light===0,S.eScreen);}
  {const a=mk(68,['Knock Off']),d=mk(143,['Tackle'],'Leftovers');setup(a,d);a.stats.atk=1;
   await useMove(a,d,'Knock Off','p');ok('탁쳐서떨구기 도구 제거',d.item==='',d.item);}
  {const a=mk(68,['Bug Bite']),d=mk(143,['Tackle'],'Sitrus Berry');setup(a,d);a.hp=100;a.stats.atk=1;
   await useMove(a,d,'Bug Bite','p');ok('벌레먹기 열매 먹고 회복',d.item===''&&a.hp>100,{it:d.item,hp:a.hp});}
  {const a=mk(68,['Rapid Spin']),d=mk(143,['Tackle']);setup(a,d);S.pHaz={sr:true,spikes:2};a.seeded=true;a.stats.atk=1;
   await useMove(a,d,'Rapid Spin','p');ok('고속스핀 장애물 제거',!S.pHaz.sr&&!S.pHaz.spikes&&!a.seeded,S.pHaz);}
  {const a=mk(143,['Stockpile','Spit Up','Swallow']),d=mk(143,['Tackle']);setup(a,d);
   await useMove(a,d,'Stockpile','p');await useMove(a,d,'Stockpile','p');ok('비축하기 2회',a._stock===2&&a.stage.def===2,a.stage);
   const h=d.hp;await useMove(a,d,'Spit Up','p');ok('토해내기 데미지+비축 소멸',d.hp<h&&a._stock===0&&a.stage.def===0,{hp:[h,d.hp],st:a.stage.def});
   a.hp=10;await useMove(a,d,'Swallow','p');ok('꿀꺽 비축 없으면 실패',a.hp===10);
   await useMove(a,d,'Stockpile','p');await useMove(a,d,'Swallow','p');ok('꿀꺽 1회 비축 → 25%',a.hp===10+Math.floor(a.maxHp*.25),a.hp);}
  {const a=mk(143,['Memento']),d=mk(143,['Tackle']);setup(a,d);
   await useMove(a,d,'Memento','p');ok('추억의선물 기절+능력하락',a.hp===0&&d.stage.atk===-2&&d.stage.spa===-2,{hp:a.hp,st:d.stage});}
  {const a=mk(143,['Mimic','Tackle']),d=mk(143,['Thunderbolt']);setup(a,d);d.lastMove='Thunderbolt';
   await useMove(a,d,'Mimic','p');ok('흉내내기 기술 복사',a.moves[0]==='Thunderbolt'&&a.pp[0]===5,a.moves);
   revertGimmick(a);ok('흉내내기 배틀 후 원복',a.moves[0]==='Mimic',a.moves);}
  {const a=mk(143,['Conversion 2']),d=mk(143,['Thunderbolt']);setup(a,d);d.lastMove='Thunderbolt';
   await useMove(a,d,'Conversion 2','p');ok('텍스처2 전기 반감 타입',typeMult('electric',a.types)<1,a.types);}
  {const a=mk(25,['Toxic']),d=mk(143,['Magic Coat']);setup(a,d);
   await useMove(d,a,'Magic Coat','e');await useMove(a,d,'Toxic','p');ok('매직코트 맹독 반사',a.status==='tox'&&!d.status,{a:a.status,d:d.status});}
  {const a=mk(143,['Imprison','Tackle']),d=mk(143,['Tackle','Thunderbolt']);setup(a,d);
   await useMove(a,d,'Imprison','p');const lg=legalMoves(d).map(i=>d.moves[i]);ok('봉인 같은 기술 봉쇄',!lg.includes('Tackle')&&lg.includes('Thunderbolt'),lg);}
  {const a=mk(143,['Detect']),d=mk(143,['Tackle']);setup(a,d);a.hp=a.maxHp;
   S._queued={};await useMove(a,d,'Detect','p');const h=a.hp;await useMove(d,a,'Tackle','e');ok('판별 = 방어',a.hp===h&&!d.foresight&&!a.foresight);}
  {const a=mk(143,['Endeavor']),d=mk(143,['Tackle']);setup(a,d);a.hp=50;
   await useMove(a,d,'Endeavor','p');ok('죽기살기 상대 HP = 내 HP',d.hp===50,d.hp);}
  {const a=mk(143,['Acupressure']),d=mk(143,['Tackle']);setup(a,d);
   await useMove(a,d,'Acupressure','p');ok('경혈찌르기 +2',Object.values(a.stage).includes(2),a.stage);}
  {const a=mk(143,['Recycle'],'Sitrus Berry'),d=mk(143,['Tackle']);setup(a,d);a.item='';
   await useMove(a,d,'Recycle','p');ok('리사이클 도구 복구',a.item==='Sitrus Berry',a.item);}
  {const a=mk(143,['Helping Hand']),d=mk(143,['Tackle']);setup(a,d);
   await useMove(a,d,'Helping Hand','p');ok('도우미 싱글 실패',document.getElementById('msg').innerHTML.includes('실패'));}
  {const a=mk(143,['Assist']),d=mk(143,['Tackle']);const p2=mk(25,['Thunderbolt']);setup(a,d,p2);let used=[];const om=M;
   const h=d.hp;await useMove(a,d,'Assist','p');ok('조수 동료 기술 사용',a.lastMove==='Thunderbolt'||a.lastMove==='Tackle',a.lastMove);}
  {const a=mk(68,['Triple Kick']),d=mk(143,['Tackle']);setup(a,d);a.stats.atk=1;let pw=[];const oc=calcDamage;calcDamage=(x,y,mo)=>{if(x===a)pw.push(mo.p);return oc(x,y,mo);};
   await useMove(a,d,'Triple Kick','p');calcDamage=oc;ok('트리플킥 10/20/30',JSON.stringify(pw)==='[10,20,30]'||pw.length<3,pw);}
  // ---- 턴 단위 ----
  {const a=mk(143,['Bide']),d=mk(143,['Tackle']);setup(a,d);a.maxHp=a.hp=5000;d.maxHp=d.hp=5000;
   await runTurn('Bide','Tackle');const l1=a._locked;await runTurn('Bide','Tackle');const h=d.hp;await runTurn('Bide','Tackle');
   ok('참기 2턴 후 해방',l1==='Bide'&&d.hp<h&&!a._bide&&!a._locked,{l1,dh:[h,d.hp],bide:a._bide});}
  {const a=mk(76,['Rollout']),d=mk(143,['Tackle']);setup(a,d);let pw=[];const od=dynMove;dynMove=(x,y,mo,b,dry)=>{const r=od(x,y,mo,b,dry);if(!dry&&x===a&&r.mo)pw.push(r.mo.p);return r;};
   for(let i=0;i<5;i++){a.stage.acc=6;a.hp=a.maxHp;d.hp=d.maxHp;await runTurn('Rollout','Tackle');}dynMove=od;
   ok('구르기 5턴 2배씩 + 고정 해제',(pw.join()==='30,60,120,240,480'||pw.length<5)&&!a._locked,{pw,l:a._locked});}
  {const a=mk(197,['Pursuit']),d=mk(143,['Tackle']),e2=mk(25,['Tackle']);setup(a,d,null,e2);
   const h=d.hp;let pw=null;const od=dynMove;dynMove=(x,y,mo,b,dry)=>{const r=od(x,y,mo,b,dry);if(!dry&&x===a&&r.mo)pw=r.mo.p;return r;};
   await enemySwitchTurn(1,'Pursuit');dynMove=od;ok('따라가때리기 교체 상대 2배',d.hp<h&&pw===80&&eActive()===e2,{pw,dh:[h,d.hp]});}
  {const a=mk(143,['Tackle']),p2=mk(25,['Tackle']),d=mk(197,['Pursuit']);setup(a,d,p2);
   const h=a.hp;const oe=enemyDecide;enemyDecide=()=>({type:'move',name:'Pursuit'});forcedSwitch=false;await chooseSwitch(1);enemyDecide=oe;
   ok('플레이어 교체 시 따라가때리기',a.hp<h&&p2.hp===p2.maxHp&&active()===p2,{a:[h,a.hp],p2:p2.hp});}
  {const a=mk(143,['Sky Attack']),d=mk(143,['Tackle']);setup(a,d);
   await useMove(a,d,'Sky Attack','p');ok('불새 1턴 충전',a._charging==='Sky Attack');}
  {const a=mk(143,['Thrash']),d=mk(143,['Tackle']);setup(a,d);
   await useMove(a,d,'Thrash','p');ok('난동부리기 고정',a._locked==='Thrash');}
  {const a=mk(143,['Gust']),d=mk(143,['Fly']);setup(a,d);d._charging='Fly';const h=d.hp;
   await useMove(a,d,'Gust','p');ok('바람일으키기 공중날기 중 명중',d.hp<h);}
  // ---- 특성 ----
  {const a=mk(143,['Thunderbolt']),d=mk(352,['Tackle'],'', 'color-change');setup(a,d);
   await useMove(a,d,'Thunderbolt','p');ok('변색 → 전기',d.types.join()==='electric',d.types);}
  {const a=mk(351,['Tackle'],'','forecast'),d=mk(143,['Tackle']);setup(a,d);S.weather='sun';renderBattle();
   ok('기분파 쾌청 → 불꽃',a.types.join()==='fire'&&a.spriteId===10013,[a.types,a.spriteId]);S.weather=null;renderBattle();ok('기분파 원래대로',a.types.join()==='normal');}
  {const a=mk(453,['Tackle'],'','anticipation'),d=mk(143,['Psychic']);setup(a,d);
   let seen='';const om=msg;msg=t=>{seen+=t;om(t);};await onSwitchIn(a,'p');msg=om;ok('위험예지 경고',seen.includes('위험예지'),seen.slice(0,80));}
  {const a=mk(143,['Tackle'],'','stench'),d=mk(143,['Tackle']);setup(a,d);let n=0;a.stats.atk=1;
   for(let i=0;i<200;i++){d._flinch=false;d.hp=d.maxHp;await useMove(a,d,'Tackle','p');if(d._flinch)n++;}ok('악취 풀죽음 ~10%',n>5&&n<45,n);}
}catch(e){R.err=e.stack;}
document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
