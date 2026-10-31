// 방어 연속 사용 · 끌려나온 포켓몬 · 피해 숫자/컷인
const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
const ok=(n,c,i)=>{if(c)R.pass++;else R.fail.push(n+(i!==undefined?' :: '+JSON.stringify(i):''));};
const mk=(d,moves)=>{const m=makeMon({d,m:moves,n:'Hardy',e:[0,0,0,0,0,0],it:''},31,'');m.ability=m.origAbility='run-away';m.maxHp=m.hp=5000;return m;};
function setup(p,e){reset();S.player=p;S.enemy=e;S.pIdx=0;S.eIdx=0;S.pScreen={reflect:0,light:0};S.eScreen={reflect:0,light:0};S.pSide={safeguard:0,tailwind:0};S.eSide={safeguard:0,tailwind:0};S.pHaz={};S.eHaz={};S.trickRoom=0;show('battle');renderBattle();}
window.addEventListener('load',async()=>{try{
 {const a=mk(143,['Protect','Tackle']),d=mk(143,['Tackle']);setup([a],[d]);
  let two=0,three=0,N=800;for(let i=0;i<N;i++){a.protectStreak=0;const l=[];protectOk(a,l);if(protectOk(a,l)){two++;if(protectOk(a,l))three++;}}
  ok('방어 2연속 ~50%',two>N*.42&&two<N*.58,two);ok('방어 3연속 ~12.5%',three>N*.07&&three<N*.19,three);
  a.protectStreak=0;await useMove(a,d,'Protect','p');ok('첫 방어 성공',a._protect&&a.protectStreak===1);
  a.stage.acc=6;await useMove(a,d,'Tackle','p');ok('다른 기술 쓰면 초기화',a.protectStreak===0,a.protectStreak);}
 {const a=mk(143,['Endure']),d=mk(143,['Tackle']);setup([a],[d]);a.protectStreak=30;await useMove(a,d,'Endure','p');ok('버티기도 연속 실패',!a._endure&&a.protectStreak===0);}
 {const a=mk(143,['Roar']),d=mk(143,['Thunderbolt']),e2=mk(25,['Thunderbolt']);setup([a],[d,e2]);const pr=M('Roar').pr;M('Roar').pr=5;
  await runTurn('Roar','Thunderbolt');M('Roar').pr=pr;ok('끌려나온 포켓몬은 행동 안 함',eActive()===e2&&e2.lastMove===null&&a.hp===a.maxHp,[e2.lastMove,a.hp]);}
 {const a=mk(143,['Tackle']),d=mk(143,['Tackle']);setup([a],[d]);let seen=[];const of=fxDamage;fxDamage=(...x)=>{seen.push(x);of(...x);};a.stage.acc=6;await useMove(a,d,'Tackle','p');fxDamage=of;ok('피해 숫자 호출',seen.length===1&&seen[0][1]>0,seen);}
 {const a=mk(143,['Bullet Seed']),d=mk(143,['Tackle']);setup([a],[d]);let n=0;const of=fxDamage;fxDamage=(...x)=>{n++;of(...x);};a.stage.acc=6;await useMove(a,d,'Bullet Seed','p');fxDamage=of;ok('연속기 타마다 숫자',n>=2,n);}
 {const a=mk(143,['Tackle']),d=mk(143,['Tackle']);setup([a],[d]);FXA.q=[];fxCutin('p','💎 메가진화!','#c04fd8');const l=FXA.q[0];const c=document.getElementById('fx-canvas').getContext('2d');for(const t of [.05,.5,.95])l.f(c,t,l.o);ok('컷인 그리기',!!l);FXA.q=[];fxDamage('p',123,2,true);const m=FXA.q[0];for(const t of [.05,.5,.9])m.f(c,t,m.o);ok('피해 숫자 그리기',!!m);}
}catch(x){R.err=x.stack}document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
