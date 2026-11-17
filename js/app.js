// On-Trac UI: state, rendering, and event handlers. Pure helpers live in logic.js.
const KEY='on-trac-v2';
let S={user:null,signedIn:false,goal:150,theme:null,sessions:[]};
const $=id=>document.getElementById(id);
const today=()=>{const t=new Date();t.setHours(0,0,0,0);return t};
const wkStart=()=>weekStart(today());
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.sessions))S=Object.assign(S,s)}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function toast(m){const t=$('toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)}
const cal=(type,mins)=>calories(type,mins,S.user&&S.user.weight);
const inRange=(a,b)=>S.sessions.filter(s=>s.date>=iso(a)&&s.date<=iso(b));
const weekOf=i=>{const a=addD(wkStart(),-7*i);return inRange(a,addD(a,6))};
const bars=(arr)=>{const m=Math.max(1,...arr.map(x=>x.v));return arr.map(x=>`<div class="bar ${x.hl?'hl':''} ${x.v?'':'z'}"><span>${x.v||''}</span><i style="height:${x.v/m*100}%"></i><span>${x.l}</span></div>`).join('')};
const tile=(v,l)=>`<div class="panel"><b>${v}</b><span>${l}</span></div>`;
const item=(s,del)=>`<li class="it"><div><strong>${esc(s.type)}</strong><small>${parse(s.date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})} · ${s.mins} min${s.dist?` · ${s.dist} mi`:''} · ${s.cal} cal</small></div>${del?`<button class="del" data-del="${s.id}" aria-label="Delete ${esc(s.type)} workout">Delete</button>`:''}</li>`;
const list=(a,del,msg)=>a.length?a.map(s=>item(s,del)).join(''):`<li class="empty">${msg}</li>`;
const sorted=()=>[...S.sessions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);

const views={
dashboard(){
  const w=weekOf(0),mins=sum(w,'mins');
  $('hi').textContent=`Welcome back, ${S.user.name.split(' ')[0]}`;
  $('dSub').textContent=`Current streak: ${streak(S.sessions.map(s=>s.date),today())} day(s). Here’s your activity summary for this week.`;
  $('tiles').innerHTML=tile(round(sum(w,'dist'))+' mi','Distance')+tile(mins+' min','Workout time')+tile(sum(w,'cal'),'Estimated calories')+tile(w.length,'Workouts this week');
  $('wk').innerHTML=bars([...Array(7)].map((_,i)=>{const d=addD(wkStart(),i);return{l:d.toLocaleDateString(undefined,{weekday:'short'}),v:sum(S.sessions.filter(s=>s.date===iso(d)),'mins'),hl:iso(d)===iso(today())}}));
  $('gMin').textContent=mins;$('gSub').textContent=mins>=S.goal?`goal reached (${S.goal} min)`:`of ${S.goal} min`;
  $('lap').setAttribute('stroke-dashoffset',100-Math.min(100,mins/S.goal*100));
  $('recent').innerHTML=list(sorted().slice(0,4),false,'No workouts yet. Head to Track workout to log your first.');
},
track(){updCal()},
history(){
  const f=$('filter').value;
  $('hist').innerHTML=list(sorted().filter(s=>f==='All'||s.type===f),true,'Nothing here yet.');
},
progress(){
  const ws=[...Array(8)].map((_,i)=>weekOf(7-i)),lab=(i)=>i===7?'Now':`-${7-i}w`;
  $('pTiles').innerHTML=tile(S.sessions.length,'Total workouts')+tile(round(S.sessions.length/Math.max(1,ws.filter((w,i)=>w.length||i>=4).length),1),'Workouts per week')+tile(round(sum(S.sessions,'dist'))+' mi','Total distance')+tile(Math.round(sum(S.sessions,'mins')/60*10)/10+' hr','Total time');
  $('wMin').innerHTML=bars(ws.map((w,i)=>({l:lab(i),v:sum(w,'mins'),hl:i===7})));
  $('wDist').innerHTML=bars(ws.map((w,i)=>({l:lab(i),v:round(sum(w,'dist')),hl:i===7})));
  const A=S.sessions,ld=[...A].sort((a,b)=>(b.dist||0)-(a.dist||0))[0],lt=[...A].sort((a,b)=>b.mins-a.mins)[0],
        pc=A.filter(s=>s.dist>=1).sort((a,b)=>a.mins/a.dist-b.mins/b.dist)[0],
        pr=(l,v)=>`<div class="pr"><span>${l}</span><strong>${v}</strong></div>`,fp=s=>{const p=s.mins/s.dist;return`${Math.floor(p)}:${pad(Math.round((p%1)*60)%60)} /mi`};
  $('prs').innerHTML=A.length?pr('Longest distance',ld&&ld.dist?`${ld.dist} mi (${esc(ld.type)})`:'–')+pr('Longest workout',`${lt.mins} min (${esc(lt.type)})`)+pr('Best pace (1+ mi)',pc?fp(pc):'–')+pr('Most calories',Math.max(...A.map(s=>s.cal))+' cal'):'<p class="empty">Log workouts to set records.</p>';
  const t=today(),f=new Date(t.getFullYear(),t.getMonth(),1),dim=new Date(t.getFullYear(),t.getMonth()+1,0).getDate(),days=new Set(S.sessions.map(s=>s.date));
  $('calT').textContent=t.toLocaleDateString(undefined,{month:'long',year:'numeric'});
  let h='MTWTFSS'.split('').map(c=>`<div class="h">${c}</div>`).join('')+'<div></div>'.repeat((f.getDay()+6)%7);
  for(let d=1;d<=dim;d++){const k=`${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(d)}`;h+=`<div class="${days.has(k)?'w':''} ${d===t.getDate()?'t':''}">${d}</div>`}
  $('cal').innerHTML=h;
},
profile(){const u=S.user;$('pName').value=u.name;$('pEmail').value=u.email;$('pAge').value=u.age||'';$('pWt').value=u.weight||'';$('pGoal').value=S.goal}
};

function route(){
  if(!S.signedIn){$('auth').hidden=false;$('app').hidden=true;
    if(S.user){$('aName').value=S.user.name;$('aEmail').value=S.user.email;$('aAge').value=S.user.age||'';$('aWt').value=S.user.weight||''}return}
  $('auth').hidden=true;$('app').hidden=false;
  let v=location.hash.slice(1);if(!views[v])v='dashboard';
  Object.keys(views).forEach(k=>{$('v-'+k).hidden=k!==v});
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.hash==='#'+v));
  views[v]();
}
function applyTheme(){document.documentElement.dataset.theme=S.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}
function updCal(){const m=Number($('mins').value)||0;$('calPrev').textContent=`Estimated calories: ${cal($('type').value,m)}`}
function fmt(s){return`${pad(Math.floor(s/60))}:${pad(s%60)}`}

// auth + profile
$('authForm').onsubmit=e=>{e.preventDefault();S.user={name:$('aName').value.trim(),email:$('aEmail').value.trim(),age:Number($('aAge').value)||null,weight:Number($('aWt').value)||null};S.signedIn=true;save();location.hash='#dashboard';route()};
$('out').onclick=()=>{S.signedIn=false;save();route()};
$('pForm').onsubmit=e=>{e.preventDefault();S.user={name:$('pName').value.trim(),email:$('pEmail').value.trim(),age:Number($('pAge').value)||null,weight:Number($('pWt').value)||null};S.goal=Math.max(10,Number($('pGoal').value)||150);save();toast('Profile saved')};
$('theme').onclick=()=>{S.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';save();applyTheme()};

// logging
$('type').innerHTML=Object.keys(MET).map(t=>`<option>${t}</option>`).join('');
$('filter').innerHTML=['All',...Object.keys(MET)].map(t=>`<option>${t}</option>`).join('');
$('filter').onchange=()=>views.history();
$('type').onchange=$('mins').oninput=updCal;
$('form').onsubmit=e=>{e.preventDefault();const mins=Number($('mins').value),t=$('type').value;
  S.sessions.push({id:Date.now(),type:t,date:$('date').value,mins,dist:Number($('dist').value)||0,cal:cal(t,mins)});
  save();$('mins').value='';$('dist').value='';toast('Workout saved');location.hash='#dashboard'};
document.addEventListener('click',e=>{const id=e.target.dataset&&e.target.dataset.del;if(id){S.sessions=S.sessions.filter(s=>s.id!==Number(id));save();route()}});

// stopwatch
let sec=0,tmr=null;
$('swGo').onclick=()=>{if(tmr){clearInterval(tmr);tmr=null;$('swGo').textContent='Resume'}else{tmr=setInterval(()=>{sec++;$('sw').textContent=fmt(sec)},1000);$('swGo').textContent='Pause'}};
$('swReset').onclick=()=>{clearInterval(tmr);tmr=null;sec=0;$('sw').textContent='00:00';$('swGo').textContent='Start'};
$('swUse').onclick=()=>{$('mins').value=Math.max(1,Math.round(sec/60));updCal();toast('Time added to the form')};

// data tools
$('demo').onclick=()=>{const T=Object.keys(MET);[0,1,2,4,5,7,8,10,12,15,19,23,28].forEach((n,i)=>{const t=T[i%5],mins=20+(i*7)%35;S.sessions.push({id:Date.now()+i,type:t,date:iso(addD(today(),-n)),mins,dist:t==='StairMaster'?0:round(mins/(t==='Cycling'?3.5:t==='Walking'?19:10),2),cal:cal(t,mins)})});save();toast('Sample data added');route()};
$('clear').onclick=()=>{if(confirm('Delete all workouts? This cannot be undone.')){S.sessions=[];save();route()}};

load();applyTheme();$('date').value=iso(today());
addEventListener('hashchange',route);route();
