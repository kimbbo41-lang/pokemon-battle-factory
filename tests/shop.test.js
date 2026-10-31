// BP 획득·상점·예약 포켓몬 합류
const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
const ok=(n,c,i)=>{if(c)R.pass++;else R.fail.push(n+(i!==undefined?' :: '+JSON.stringify(i):''));};
const $$=q=>[...document.querySelectorAll(q)];const wait=ms=>new Promise(r=>setTimeout(r,ms));
window.addEventListener('load',async()=>{try{localStorage.clear();
 ok('BP 표',[7,14,21,28,35,42,49].map(bpForRound).join()==='5,5,20,5,7,7,20');
 // 승리로 획득, 이어하기 중복 없음
 reset();startDraft(false);draftPicks=[0,1,2];S.player=buildTeam();S.round=6;S.enemy=S.player.map(m=>makeMon(m.set,12));await winRound();ok('세트 중간엔 BP 없음',bpGet()===0,bpGet());
 S.round=7;await winRound();ok('7전 승리 5 BP',bpGet()===5,bpGet());reset();resumeRun();await wait(300);ok('이어하기 중복 지급 없음',bpGet()===5,bpGet());
 // 패배해도 유지
 reset();S.player=[];S.round=3;await loseGame();ok('패배해도 BP 유지',bpGet()===5&&document.getElementById('result-body').textContent.includes('5 BP'));
 // 상점
 bpSet(10);openShop();ok('상점 화면',!document.getElementById('screen-shop').classList.contains('hidden')&&$$('#shop-species .card').length>30,$$('#shop-species .card').length);
 $$('#shop-species .card')[0].click();const btn=()=>$$('#shop-sets button')[0];ok('BP 부족 구매 불가',btn().disabled,btn().textContent);
 bpSet(100);openShop();$$('#shop-species .card')[0].click();const price=+btn().textContent.match(/\d+/)[0];btn().click();const tk=ticketGet();ok('구매',tk&&bpGet()===100-price,bpGet());
 $$('#shop-species .card')[1].click();ok('중복 예약 불가',btn().disabled);
 show('title');await wait(30);ok('타이틀 표시',document.getElementById('best-rec').textContent.includes(DATA.species[tk.d].ko)&&document.getElementById('btn-shop').textContent.includes('BP'));
 openShop();$$('#shop-ticket button')[0].click();ok('예약 취소 환불',bpGet()===100&&!ticketGet());
 $$('#shop-species .card')[0].click();btn().click();const t2=ticketGet();
 // 새 게임 합류
 document.getElementById('btn-start').click();await wait(50);ok('예약권 소멸',!ticketGet());ok('렌탈 2마리만',draftNeed()===2);ok('후보와 중복 없음',!draftSets.some(s=>s.d===t2.d||s.it===t2.it));
 draftPicks=[0,1];const team=buildTeam();ok('팀 합류',team.length===3&&team[0].dex===t2.d&&team[0].origItem===t2.it&&team[0].moves.join()===t2.m.join(),team.map(m=>m.ko));
 reset();newGame();ok('다음 게임엔 없음',draftNeed()===3);
 ok('전설 가격',bpPrice(DATA.sets[LEGEND_FROM])===50);
}catch(x){R.err=x.stack}document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
