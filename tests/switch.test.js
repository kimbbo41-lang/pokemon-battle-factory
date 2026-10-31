const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
const ok=(n,c,i)=>{if(c)R.pass++;else R.fail.push(n+(i!==undefined?' :: '+JSON.stringify(i):''));};
const mk=(d,moves)=>{const m=makeMon({d,m:moves,n:'Hardy',e:[0,0,0,0,0,0],it:''},31,'');m.ability=m.origAbility='run-away';m.maxHp=m.hp=5000;return m;};
function setup(p,e){reset();S.player=p;S.enemy=e;S.pIdx=0;S.eIdx=0;S.pScreen={reflect:0,light:0};S.eScreen={reflect:0,light:0};S.pSide={safeguard:0,tailwind:0};S.eSide={safeguard:0,tailwind:0};S.trickRoom=0;show('battle');renderBattle();}
const dirty=m=>{m.stage.atk=3;m.stage.def=-2;m.cnfN=3;m.attract=true;m.sub=100;m.seeded=true;};
const clean=m=>Object.values(m.stage).every(v=>v===0)&&m.cnfN===0&&!m.attract&&m.sub===0&&!m.seeded;
window.addEventListener('load',async()=>{try{
 {const a=mk(143,['Tackle']),b=mk(25,['Tackle']),d=mk(143,['Splash']);setup([a,b],[d]);dirty(a);forcedSwitch=false;enemyDecide=(o=>a=>({type:'move',name:'Splash'}))(enemyDecide);await chooseSwitch(1);await chooseSwitch(0);
  ok('플레이어 교체 후 복귀 → 초기화',clean(a),a.stage);ok('혼란·랭크 표시 없음',!document.getElementById('player-info').innerHTML.includes('혼란')&&!document.getElementById('player-info').textContent.includes('공+'));}
 {const a=mk(143,['Tackle']),d=mk(143,['Tackle']),e2=mk(25,['Tackle']);setup([a],[d,e2]);dirty(d);a.stats.atk=1;await enemySwitchTurn(1,'Tackle');S.eIdx=0;onEnter(d);ok('상대 교체 후 복귀 → 초기화',clean(d),d.stage);}
 {const a=mk(143,['Roar']),d=mk(143,['Tackle']),e2=mk(25,['Tackle']);setup([a],[d,e2]);dirty(e2);await useMove(a,d,'Roar','p');ok('울부짖기로 끌려나온 포켓몬 초기화',eActive()===e2&&clean(e2),e2.stage);}
 {const a=mk(143,['Tackle']),b=mk(25,['Tackle']),d=mk(143,['Tackle']),e2=mk(25,['Tackle']);setup([a,b],[d,e2]);a.attract=true;a.trapped=3;a.noSwitch=true;S.eIdx=1;onEnter(e2);ok('건 쪽이 나가면 헤롱헤롱·속박·봉쇄 해제',!a.attract&&a.trapped===0&&!a.noSwitch,a.attract);}
 {const a=mk(143,['Baton Pass']),b=mk(25,['Tackle']),d=mk(143,['Tackle']);setup([a,b],[d]);a.stage.atk=2;a.cnfN=3;a.sub=100;a.seeded=true;a.attract=true;AUTO=true;S._pivotPending='p';a._batonPass=true;await handlePivot('p');AUTO=false;
  ok('배턴터치 계승',active()===b&&b.stage.atk===2&&b.cnfN===3&&b.sub===100&&b.seeded&&!b.attract,b.stage);}
}catch(x){R.err=x.stack}document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
