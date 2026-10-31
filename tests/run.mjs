// 사용법: node tests/run.mjs            (엔진 테스트)
//        node tests/run.mjs --online   (+ 실제 MQTT 서버를 쓰는 온라인 시나리오)
// 헤드리스 크롬으로 index.html에 테스트를 끼워 실행한다. CHROME 환경변수로 경로 지정 가능.
import fs from 'fs';import os from 'os';import path from 'path';import {spawn} from 'child_process';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here);
const chrome=process.env.CHROME||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(p=>fs.existsSync(p));
if(!chrome){console.error('크롬을 찾지 못했습니다. CHROME 환경변수를 지정하세요.');process.exit(2);}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'bf-test-'));
const game=fs.readFileSync(path.join(root,'index.html'),'utf8');
const unesc=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
const sl=ms=>new Promise(r=>setTimeout(r,ms));
const fileUrl=f=>'file:///'+f.replace(/\\/g,'/').replace(/^\//,'');
function dumpDom(file,profile){return new Promise(res=>{let out='';const c=spawn(chrome,['--headless=new','--disable-gpu','--user-data-dir='+profile,'--virtual-time-budget=1800000','--dump-dom',fileUrl(file)],{stdio:['ignore','pipe','ignore']});
  c.stdout.on('data',d=>out+=d);c.on('close',()=>res(out));});}
async function engine(name){
  const js=fs.readFileSync(path.join(here,name),'utf8'),f=path.join(tmp,name+'.html');
  fs.writeFileSync(f,game.replace('</body>',()=>'<script>'+js+'</script></body>'));
  const m=[...(await dumpDom(f,path.join(tmp,'p_'+name))).matchAll(/<pre id="RES">RESULT (\{.*?)<\/pre>/gs)].pop();
  if(!m)return {name,ok:false,info:'결과 없음'};
  const r=JSON.parse(unesc(m[1]));const bad=[...(r.fail||[]),...(r.errors||[]),...(r.err?[r.err]:[])];
  return {name,ok:!bad.length,info:bad.length?bad.join('\n   '):`통과 ${r.pass??''}`.trim()};
}
async function online(scn,port){
  const dir=path.join(tmp,'on_'+scn);fs.mkdirSync(dir);fs.writeFileSync(path.join(dir,'game.html'),game);fs.copyFileSync(path.join(here,'online.html'),path.join(dir,'online.html'));
  const c=spawn(chrome,['--headless=new','--disable-gpu','--remote-debugging-port='+port,'--user-data-dir='+path.join(dir,'p'),'--disable-web-security','--allow-file-access-from-files',fileUrl(path.join(dir,'online.html'))+'#'+scn],{stdio:'ignore'});
  try{
    let pg;for(let i=0;i<60&&!pg;i++){try{pg=(await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x=>x.type==='page');}catch(e){}await sl(300);}
    const ws=new WebSocket(pg.webSocketDebuggerUrl);let id=0;const pend={};ws.onmessage=e=>{const m=JSON.parse(e.data);if(pend[m.id]){pend[m.id](m);delete pend[m.id];}};await new Promise(r=>ws.onopen=r);
    const ev=x=>new Promise(r=>{const i=++id;pend[i]=m=>r(m.result?.result?.value);ws.send(JSON.stringify({id:i,method:'Runtime.evaluate',params:{expression:x,returnByValue:true}}));});
    const t0=Date.now();while(Date.now()-t0<540000){const v=await ev('JSON.stringify(window.__RES||null)');if(v&&v!=='null'){const r=JSON.parse(v);const e=[...r.errors.A,...r.errors.B,...(r.err?[r.err]:[]),...(r.fail||[])];return {name:'online:'+scn,ok:!e.length,info:e.length?e.join('\n   '):JSON.stringify(r.info)};}await sl(1500);}
    return {name:'online:'+scn,ok:false,info:'시간 초과'};
  }finally{c.kill();}
}
const jobs=fs.readdirSync(here).filter(f=>f.endsWith('.test.js'));
const res=await Promise.all(jobs.map(engine));
if(process.argv.includes('--online'))res.push(...await Promise.all(['full','bye','afk'].map((s,i)=>online(s,9400+i))));
let fail=0;for(const r of res){console.log(`${r.ok?'✔':'✘'} ${r.name}: ${r.info}`);if(!r.ok)fail++;}
try{fs.rmSync(tmp,{recursive:true,force:true});}catch(e){}
process.exit(fail?1:0);
