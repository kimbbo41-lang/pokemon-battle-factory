const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
const ok=(n,c,i)=>{if(c)R.pass++;else R.fail.push(n+(i!==undefined?' :: '+JSON.stringify(i):''));};
const mk=(d,moves,ab)=>{const m=makeMon({d,m:moves,n:'Hardy',e:[0,0,0,0,0,0],it:''},31,'');m.ability=m.origAbility=ab||'run-away';m.maxHp=m.hp=5000;return m;};
function setup(p,e){reset();S.player=p;S.enemy=e;S.pIdx=0;S.eIdx=0;S.pScreen={reflect:0,light:0};S.eScreen={reflect:0,light:0};S.pSide={safeguard:0,tailwind:0};S.eSide={safeguard:0,tailwind:0};S.pHaz={};S.eHaz={};S.trickRoom=0;show('battle');renderBattle();}
window.addEventListener('load',async()=>{try{
 {const a=mk(143,['Roar']),d=mk(143,['Tackle']),e2=mk(25,['Tackle']);setup([a],[d,e2]);S.eHaz={sr:true};await useMove(a,d,'Roar','p');ok('끌려나오면 스텔스록 피해',eActive()===e2&&e2.hp<e2.maxHp,e2.hp);ok('처리 후 대기 없음',!S._dragged);}
 {const a=mk(143,['Roar']),d=mk(143,['Tackle']),e2=mk(130,['Tackle'],'intimidate');setup([a],[d,e2]);await useMove(a,d,'Roar','p');ok('끌려나오면 위협 발동',a.stage.atk===-1,a.stage.atk);}
 {const a=mk(143,['Roar']),d=mk(143,['Tackle']),e2=mk(25,['Tackle']);setup([a],[d,e2]);S.eHaz={sr:true};e2.hp=1;await useMove(a,d,'Roar','p');await handleFaints();ok('장애물로 쓰러지면 처리',e2.fainted&&eActive()===d,[e2.hp,e2.fainted]);}
 {const a=mk(143,['Roar']),b=mk(25,['Tackle']),d=mk(143,['Magic Coat']);setup([a,b],[d]);S.pHaz={sr:true};await useMove(d,a,'Magic Coat','e');await useMove(a,d,'Roar','p');ok('반사된 울부짖기도 등장 처리',active()===b&&b.hp<b.maxHp,b.hp);}
}catch(x){R.err=x.stack}document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
