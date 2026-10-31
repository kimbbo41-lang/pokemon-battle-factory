const R={errors:[]};window.addEventListener('error',e=>R.errors.push(String(e.message)));window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
window.addEventListener('load',async()=>{try{
 const keys=Object.keys(DATA.moves);if(keys.filter(k=>!FX_MOVES[k]&&k!=="__struggle__").length)R.errors.push("미지정 기술");R.table=Object.keys(FX_MOVES).length;
 R.missing=keys.filter(k=>!FX_MOVES[k]);R.extra=Object.keys(FX_MOVES).filter(k=>!DATA.moves[k]);
 const by={};Object.entries(FX_MOVES).forEach(([k,v])=>(by[v]=by[v]||[]).push(k));R.dup=Object.values(by).filter(x=>x.length>1);
 const bad=[];Object.entries(FX_MOVES).forEach(([k,v])=>v.split('|').forEach(l=>{const m=FX_RE.exec(l);if(!m||!FXP[m[1]])bad.push(k+':'+l);}));R.badSpec=bad;
 // 실제 그리기: 전 기술 레이어를 진행도별로 예외 없이 실행
 reset();const mk=d=>makeMon(DATA.sets.find(s=>s.d===d),31,'');S.player=[mk(6)];S.enemy=[mk(9)];S.pIdx=0;S.eIdx=0;S.pScreen={reflect:0,light:0};S.eScreen={reflect:0,light:0};S.pSide={};S.eSide={};show('battle');renderBattle();
 const c=document.getElementById('fx-canvas').getContext('2d'),g=fxGeom('p');R.geom=[g.w,g.h,Math.round(g.a.x),Math.round(g.b.x)];const drawErr=[];let draws=0;
 for(const k of keys){const mo=M(k),{out}=fxLayers(fxSpec(k,mo),g,mo,fxSelf(mo));if(!out.length)drawErr.push(k+':empty');for(const l of out)for(const t of [0,.1,.3,.5,.7,.9,.99]){try{l.f(c,t,l.o);draws++;}catch(e){drawErr.push(k+':'+e.message);}}}
 R.draws=draws;R.drawErr=drawErr.slice(0,12);
 // 합성 기술·실제 사용
 for(const n of [gimmickMove('Flamethrower','z'),gimmickMove('Flamethrower','max'),gimmickMove('Protect','max')]){const mo=M(n);R['lead_'+mo.ko]=playMoveFx('p',mo,n);}
 await useMove(active(),eActive(),S.player[0].moves.find(x=>M(x).c!=='x'),'p');R.afterUse=FXA.q.length>=0;
}catch(x){R.err=x.stack}document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>');});
