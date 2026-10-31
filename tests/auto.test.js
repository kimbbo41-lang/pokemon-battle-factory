// 자동전투로 한 판 진행하며 예외가 없는지 확인
const R={errors:[],fail:[],pass:0};window.addEventListener('error',e=>R.errors.push(String(e.message)));
window.addEventListener('unhandledrejection',e=>R.errors.push('rej '+String(e.reason&&e.reason.stack||e.reason)));
window.addEventListener('load',()=>{localStorage.clear();const os=startRound;startRound=async f=>{R.pass++;return os(f);};AUTO=true;reset();startDraft(false);
 setTimeout(()=>document.body.insertAdjacentHTML('beforeend','<pre id="RES">RESULT '+JSON.stringify(R)+'</pre>'),1500000);});
