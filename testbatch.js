/* CSIR NET Test Batch · December 2026 (course page "Test Batch").
   Schedule below. Each paper opens at 6:30 PM IST on its date; the detailed answer key opens at 10:00 AM IST the next day.
   Papers live in tbpapers.js (window.TB_PAPERS, pushed on the test day) and solutions in tbkeys.js (window.TB_KEYS, pushed next morning),
   so the public repository never holds a paper before its day or a solution before its key time.
   Results go to Firestore results/{testId}/entries/{uid}; only attempts submitted before the key opens count for the rank list. */
(()=>{
const IST="+05:30";
const SCHED=[
  { id:"tb-t1",  code:"T1",  title:"Algebra I", unit:"Unit 2", date:"2026-11-20", open:"2026-11-20T18:00:00"+IST,
    syl:"Elementary number theory, combinatorics, groups, subgroups, normal subgroups, homomorphisms, permutation groups, class equation, Sylow theorems" },
  { id:"tb-t2",  code:"T2",  title:"Algebra II", unit:"Unit 2", date:"2026-11-22",
    syl:"Rings, ideals, prime and maximal ideals, quotient rings, UFD, PID, Euclidean domains, polynomial rings, irreducibility, field extensions, Galois theory, finite fields" },
  { id:"tb-t3",  code:"T3",  title:"Linear Algebra I", unit:"Unit 1", date:"2026-11-24",
    syl:"Vector spaces, bases, dimension, linear transformations, matrices, rank, systems of equations, determinants" },
  { id:"tb-t4",  code:"T4",  title:"Linear Algebra II", unit:"Unit 1", date:"2026-11-26",
    syl:"Eigenvalues and eigenvectors, Cayley–Hamilton, minimal polynomial, diagonalisation, Jordan and rational canonical forms, inner product spaces, quadratic forms" },
  { id:"tb-t5",  code:"T5",  title:"Complex Analysis", unit:"Unit 2", date:"2026-11-28",
    syl:"Analytic functions, Cauchy–Riemann equations, Cauchy's theorem and formula, Liouville, maximum modulus, Taylor and Laurent series, residues, conformal and Möbius maps" },
  { id:"tb-t6",  code:"T6",  title:"Real Analysis I", unit:"Unit 1", date:"2026-11-30",
    syl:"Sequences and series of reals, limsup/liminf, continuity, uniform continuity, differentiability, mean value theorems, Riemann integral, improper integrals" },
  { id:"tb-t7",  code:"T7",  title:"Real Analysis II", unit:"Unit 1", date:"2026-12-02",
    syl:"Sequences and series of functions, uniform convergence, power series, functions of several variables, metric spaces, compactness, connectedness, Lebesgue measure and integral" },
  { id:"tb-t8",  code:"T8",  title:"Topology", unit:"Unit 2", date:"2026-12-04",
    syl:"Basis, dense sets, subspace and product topology, separation axioms, connectedness, compactness" },
  { id:"tb-t9",  code:"T9",  title:"ODE & PDE", unit:"Unit 3", date:"2026-12-06",
    syl:"Existence and uniqueness, linear ODEs, Sturm–Liouville problems, Green's function; Lagrange and Charpit methods, classification of second-order PDEs, Laplace, heat and wave equations" },
  { id:"tb-t10", code:"T10", title:"Numerical Analysis & Calculus of Variations", unit:"Unit 3", date:"2026-12-08",
    syl:"Roots of equations, interpolation, numerical differentiation and integration, numerical solution of ODEs; Euler–Lagrange equation, variational problems" },
  { id:"tb-t11", code:"T11", title:"Integral Equations & Classical Mechanics", unit:"Unit 3", date:"2026-12-10",
    syl:"Fredholm and Volterra equations, separable kernels, resolvent kernel; generalised coordinates, Lagrange and Hamilton equations, central force, rigid body motion" },
  { id:"tb-ft1", code:"FT1", title:"Full Test 1", unit:"Units 1–3", date:"2026-12-12",
    syl:"Complete Units 1–3 + Part A General Aptitude" },
  { id:"tb-ft2", code:"FT2", title:"Full Test 2", unit:"Units 1–3", date:"2026-12-15",
    syl:"Complete Units 1–3 + Part A General Aptitude" }
];
const MCQ={ plus:3, minus:0.75 }, MSQ={ plus:4 };
const P=()=>window.TB_PAPERS||{}, K=()=>window.TB_KEYS||{};
const openAt=s=>new Date(s.open||(s.date+"T18:30:00"+IST)).getTime();
const keyAt=s=>{ const d=new Date(s.date+"T10:00:00"+IST); d.setUTCDate(d.getUTCDate()+1); return d.getTime(); };
const isOpen=s=>Date.now()>=openAt(s);
const keyOut=s=>Date.now()>=keyAt(s);
const when=t=>new Date(t).toLocaleString("en-IN",{ timeZone:"Asia/Kolkata", weekday:"short", day:"numeric", month:"short", hour:"numeric", minute:"2-digit" });
const dateLabel=s=>new Date(s.date+"T12:00:00"+IST).toLocaleDateString("en-IN",{ timeZone:"Asia/Kolkata", day:"numeric", month:"short", year:"numeric" });
// Answers are stored lightly encoded so they are not readable at a glance in the page source.
const dec=k=>{ try{ return JSON.parse(atob(String(k).split("").reverse().join(""))); }catch(e){ return []; } };
function paper(s){
  const p=P()[s.id]; if(!p) return null;
  const a=dec(p.k), sol=K()[s.id]||[], ko=keyOut(s);
  return { ...s, minutes:p.minutes||90, note:p.note||"", mcq:MCQ, msq:MSQ,
    qs:p.qs.map((q,i)=>({ ...q, a:a[i], s:ko&&sol[i]?sol[i]:"" })) };
}
const KEYS=["A","B","C","D"];
const maxOf=t=>t.qs.reduce((s,q)=>s+(q.t==="msq"?MSQ.plus:MCQ.plus),0);
const nA=t=>t.qs.filter(q=>q.t!=="msq").length;
const fmt=sec=>{ sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60; return (h?h+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"); };
const fs2=n=>String(Math.round(n*100)/100);
const W={ test:null, phase:"start", ans:[], mk:[], cur:0, start:0, end:0, confirming:false, msg:"", tab:"test", rows:null, unsub:null, rowsFor:null, qs:null, qsFor:null };
let tick=null;
const S=()=>SCHED.find(s=>s.id===W.test)||current();
function current(){ // the open test whose key is not out yet, else the next one, else the last
  const now=Date.now();
  return SCHED.find(s=>isOpen(s)&&!keyOut(s))||SCHED.find(s=>openAt(s)>now)||SCHED[SCHED.length-1];
}
const base=()=>paper(S());
const T=()=>{ const b=base(); return b&&W.qs&&W.qsFor===b.id?{ ...b, qs:W.qs }:b; };
const uid=()=>{ try{ const u=app.auth&&app.auth.current(); return u?u.uid:null; }catch(e){ return null; } };
const saveKey=()=>"rc-tb-"+(app.session&&app.session.u)+"-"+S().id;
const lastKey=id=>"rc-tb-last-"+(app.session&&app.session.u)+"-"+id;

function answered(k){ const a=W.ans[k]; return T().qs[k].t==="msq"?a.length>0:a!==null; }
function status(k){ const q=T().qs[k], a=W.ans[k]; if(!answered(k)) return "skip"; return (q.t==="msq"?sameSet(a,q.a):a===q.a)?"ok":"bad"; }
function marks(k){ const st=status(k), msq=T().qs[k].t==="msq"; return st==="ok"?(msq?MSQ.plus:MCQ.plus):st==="bad"?(msq?0:-MCQ.minus):0; }
function grade(){ let c=0,w=0,A=0,B=0; T().qs.forEach((q,k)=>{ const st=status(k); if(st==="ok")c++; if(st==="bad")w++; if(q.t==="msq")B+=marks(k); else A+=marks(k); }); return { correct:c, wrong:w, skipped:T().qs.length-c-w, secA:A, secB:B, score:A+B }; }
const remaining=()=>T().minutes*60-(Date.now()-W.start)/1000;

function listen(){
  const s=S(); if(W.rowsFor===s.id||!app.db) return;
  if(W.unsub) try{ W.unsub(); }catch(e){}
  W.rows=null; W.rowsFor=s.id;
  W.unsub=app.db.collection("results/"+s.id+"/entries").limit(500).onSnapshot(q=>{
    W.rows=q.docs.map(d=>({ id:d.id, ...d.data() })).sort((a,b)=>(b.score-a.score)||(a.timeSec-b.timeSec));
    if(ui.view==="tbatch"&&(W.tab==="rank"||W.phase!=="test")) draw();
  },()=>{ W.rows=W.rows||[]; if(ui.view==="tbatch") draw(); });
}

function vTBatch(){
  if(!W.test){
    W.test=current().id;
    const saved=store.get(saveKey(),null), b=base();
    if(b&&saved&&saved.start&&Date.now()-saved.start<b.minutes*60000){ Object.assign(W,{ phase:"test", ans:saved.ans, mk:saved.mk, start:saved.start, cur:saved.cur||0, qs:saved.ord?shuffleQs(b.qs,saved.ord):null, qsFor:b.id }); startTick(); }
  }
  listen();
  return `<div id="tb" style="display:flex;flex-direction:column;gap:18px">${body()}</div>`;
}
function pill(s){
  if(keyOut(s)) return P()[s.id]?`<span class="pill ok">Key out</span>`:`<span class="pill">Closed</span>`;
  if(isOpen(s)) return P()[s.id]?`<span class="pill gold">Open now</span>`:`<span class="pill gold">Uploading</span>`;
  return `<span class="pill soft">${esc(dateLabel(s))}</span>`;
}
function schedHTML(){
  return `<div class="tb-sched">${SCHED.map(s=>`<button class="tb-item ${s.id===S().id?"cur":""}" data-tbtest="${s.id}">
    <span class="tb-code">${s.code}</span><span class="tb-t"><b>${esc(s.title)}</b><small>${esc(dateLabel(s))} · ${esc(s.unit)}</small></span>${pill(s)}</button>`).join("")}</div>`;
}
function body(){
  const s=S(), t=T();
  const tabs=t&&isOpen(s)?`<div class="wk-tabs" role="tablist">
    <button role="tab" data-tbtab="test" aria-selected="${W.tab==="test"}">Test</button>
    ${keyOut(s)?`<button role="tab" data-tbtab="key" aria-selected="${W.tab==="key"}">Answer key</button>`:""}
    <button role="tab" data-tbtab="rank" aria-selected="${W.tab==="rank"}">Rank list</button></div>`:"";
  const head=`<div class="wk-head"><div><p class="eyebrow" style="color:var(--gold-ink)">CSIR NET Test Batch · Dec 2026 · ${esc(s.code)} · ${esc(dateLabel(s))}</p><h2 style="font-family:var(--f-display);font-weight:400;margin:4px 0 0">${esc(s.code)} · ${esc(s.title)}</h2></div>${W.phase==="test"?"":tabs}</div>`;
  if(W.phase==="test") return head+testHTML();
  const top=`<details class="panel tb-wrap" ${W.schedOpen?"open":""}><summary><b>Schedule · 13 papers · 20 Nov – 15 Dec 2026</b><span class="hint">Each paper opens at 6:30 PM · answer key next day 10:00 AM</span></summary>${schedHTML()}</details>`;
  if(!isOpen(s)) return top+head+`<div class="panel"><h3 style="margin:0 0 6px">${esc(s.syl)}</h3><p style="margin:8px 0 0">This paper opens at <b>${esc(when(openAt(s)))}</b>.</p><p class="hint" style="margin:6px 0 0">100 marks · 20 MCQ (60 marks) + 10 MSQ (40 marks) · half of the questions are real CSIR NET / GATE previous-year questions. Detailed answer key at ${esc(when(keyAt(s)))}.</p></div>`;
  if(!t) return top+head+`<div class="panel"><p style="margin:0">The paper is being uploaded. Please check again in a few minutes.</p></div>`;
  if(W.tab==="rank") return top+head+rankHTML();
  if(W.tab==="key"&&keyOut(s)) return top+head+keyHTML();
  return top+head+(W.phase==="start"?startHTML():resultHTML());
}
function startHTML(){
  const s=S(), t=T(), a=nA(t), b=t.qs.length-a, mine=W.rows&&W.rows.find(r=>r.id===uid()), ko=keyOut(s);
  return `<div class="wk-grid2">
    <div class="panel">
      <h3 style="margin:0 0 4px">${esc(s.syl)}</h3>
      <ul class="wk-facts"><li><b>${t.qs.length}</b><span>Questions</span></li><li><b>${t.minutes} min</b><span>Time</span></li><li><b>${maxOf(t)}</b><span>Maximum marks</span></li></ul>
      <div class="wk-sec"><b>Section A · MCQ · Q1–Q${a}</b><span>Exactly one option is correct. +${MCQ.plus} each, −${fs2(MCQ.minus)} for a wrong answer.</span></div>
      <div class="wk-sec"><b>Section B · MSQ · Q${a+1}–Q${a+b}</b><span>One or more options are correct. +${MSQ.plus} only for the exact set of correct options. No negative marks.</span></div>
      <p class="hint mjx" style="margin-top:12px">${t.note}</p>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px;justify-content:center">
      <p style="margin:0">Taking the test as <b>${esc(app.session.name)}</b>.</p>
      <p class="hint" style="margin:0">${app.session.admin?"Teacher preview: your score is not added to the rank list."
        :ko?"The answer key is out, so a new attempt is for practice only and does not change the rank list."
        :mine?`Your best so far: <b>${fs2(mine.score)} / ${maxOf(t)}</b>. Only your best attempt before the key counts.`:"Your score goes on the batch rank list. Only your best attempt counts."}</p>
      <p class="hint" style="margin:0">Detailed answer key: ${esc(when(keyAt(s)))}. The timer keeps running if you leave this page, so finish in one sitting.</p>
      <button class="btn primary" data-tbgo="begin">Start test</button>
    </div></div>`;
}
function palBtn(k){ return `<button data-tbq="${k}" class="${answered(k)?"ans":""} ${W.mk[k]?"mk":""} ${k===W.cur?"cur":""}" aria-label="Question ${k+1}">${k+1}</button>`; }
function testHTML(){
  const t=T(), i=W.cur, q=t.qs[i], msq=q.t==="msq", a=nA(t);
  const sel=k=>msq?W.ans[i].includes(k):W.ans[i]===k;
  const done=t.qs.filter((_,k)=>answered(k)).length;
  return `<div class="wk-test">
    <div class="panel">
      <div class="wk-qmeta"><span class="hint">Section ${msq?"B":"A"} · Question ${i+1} of ${t.qs.length}</span><b class="wk-mtimer" id="tbTimer2">${fmt(remaining())}</b><span class="pill ${msq?"gold":"blue"}">${msq?"MSQ · select all that apply":"MCQ · one correct"}</span></div>
      <p class="wk-q mjx">${q.q}</p>
      <p class="hint">${msq?`+${MSQ.plus} only for the exact set · no negative marks`:`+${MCQ.plus} if correct · −${fs2(MCQ.minus)} if wrong`}</p>
      <div class="wk-opts ${q.t}">${q.o.map((o,k)=>`<button class="wk-opt" data-tbk="${k}" aria-pressed="${sel(k)}"><span class="key">${KEYS[k]}</span><span class="val mjx">${o}</span></button>`).join("")}</div>
      <div class="wk-nav">
        <div><button class="btn ghost sm" data-tbgo="clear" ${answered(i)?"":"disabled"}>Clear answer</button> <button class="btn ghost sm" data-tbgo="mark">${W.mk[i]?"Unmark":"Mark for review"}</button></div>
        <div><button class="btn ghost" data-tbgo="prev" ${i===0?"disabled":""}>Previous</button> <button class="btn primary" data-tbgo="next">${i===t.qs.length-1?"Review &amp; submit":"Save &amp; next"}</button></div>
      </div>
    </div>
    <aside class="wk-side">
      <div class="panel"><div class="hint">Time left</div><div class="wk-timer" id="tbTimer">${fmt(remaining())}</div></div>
      <div class="panel">
        <div class="hint">Answer sheet · ${done}/${t.qs.length} answered</div>
        <div class="wk-pal-sec">Section A · MCQ</div><div class="wk-pal">${t.qs.slice(0,a).map((_,k)=>palBtn(k)).join("")}</div>
        <div class="wk-pal-sec">Section B · MSQ</div><div class="wk-pal">${t.qs.slice(a).map((_,k)=>palBtn(k+a)).join("")}</div>
      </div>
      ${W.confirming?`<div class="wk-confirm"><span>Submit now? ${t.qs.length-done} unanswered, ${W.mk.filter(Boolean).length} marked for review.</span><div><button class="btn primary sm" data-tbgo="submit">Submit test</button> <button class="btn ghost sm" data-tbgo="keep">Keep working</button></div></div>`
        :`<button class="btn ghost" data-tbgo="confirm">Submit test</button>`}
    </aside></div>`;
}
const corr=q=>q.t==="msq"?q.a.map(x=>KEYS[x]).join(", "):KEYS[q.a]+". "+q.o[q.a];
function ansText(q,a){ if(q.t==="msq") return a&&a.length?a.map(x=>KEYS[x]).join(", "):"—"; return a===null||a===undefined?"—":KEYS[a]+". "+q.o[a]; }
function resultHTML(){
  const s=S(), t=T(), g=grade(), secs=(W.end-W.start)/1000, a=nA(t), ko=keyOut(s);
  const maxA=a*MCQ.plus, maxB=(t.qs.length-a)*MSQ.plus;
  return `<div class="panel">
    <div class="wk-score"><div><div class="hint">${esc(app.session.name)}</div><div class="wk-big">${fs2(g.score)}<small> / ${maxOf(t)}</small></div></div>
      <div class="wk-tally"><div><b style="color:var(--ok)">${g.correct}</b>Correct</div><div><b style="color:var(--bad)">${g.wrong}</b>Wrong</div><div><b>${g.skipped}</b>Skipped</div><div><b>${fmt(secs)}</b>Time taken</div></div></div>
    <div class="wk-split"><div>Section A (MCQ)<b>${fs2(g.secA)} / ${maxA}</b></div><div>Section B (MSQ)<b>${fs2(g.secB)} / ${maxB}</b></div></div>
    <p class="hint" id="tbMsg" style="margin-top:12px">${esc(W.msg)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px"><button class="btn primary" data-tbtab="rank">See rank list</button>${ko?`<button class="btn ghost" data-tbtab="key">Answer key</button>`:""}<button class="btn ghost" data-tbgo="again">Retake test</button></div>
  </div>
  ${ko?reviewHTML(t.qs,W.ans):`<div class="panel"><p style="margin:0"><b>Detailed answer key: ${esc(when(keyAt(s)))}.</b></p><p class="hint" style="margin:6px 0 0">Your answers are saved on this phone. The key will show them next to the correct answers and full solutions.</p></div>`}`;
}
function reviewHTML(qs,ans){
  return `<h3 style="font-family:var(--f-display);font-weight:400;margin:6px 0 0">Answers and solutions</h3>
  <div style="display:flex;flex-direction:column;gap:12px">${qs.map((q,k)=>{ const a=ans?ans[k]:undefined, has=ans!=null,
      st=!has||a===null||a===undefined||(Array.isArray(a)&&!a.length)?"skip":(q.t==="msq"?sameSet(a,q.a):a===q.a)?"ok":"bad",
      m=st==="ok"?(q.t==="msq"?MSQ.plus:MCQ.plus):st==="bad"?(q.t==="msq"?0:-MCQ.minus):0;
    return `<div class="wk-rv ${has?st:""}"><p class="mjx" style="margin:0"><b>Q${k+1}.</b> ${q.q}</p>
      ${has?"":`<ol type="A" class="tb-opts mjx">${q.o.map(o=>`<li>${o}</li>`).join("")}</ol>`}
      <div class="wk-row">${has?`<span class="pill ${st==="ok"?"ok":st==="bad"?"bad":""}">${m>0?"+"+fs2(m):m<0?"−"+fs2(-m):"0"}</span><span>Your answer: <span class="mjx">${ansText(q,a)}</span></span>`:""}
      <span>Correct: <span class="mjx">${corr(q)}</span></span></div>
      ${q.s?`<p class="hint mjx" style="margin:8px 0 0">${q.s}</p>`:""}</div>`; }).join("")}</div>`;
}
function keyHTML(){
  const s=S(), b=base(), last=store.get(lastKey(s.id),null);
  if(last&&last.ord){ const qs=shuffleQs(b.qs,last.ord); return `<p class="hint" style="margin:0">Showing your last attempt (${fs2(last.score)} / ${maxOf(b)}), in the order you saw it.</p>`+reviewHTML(qs,last.ans); }
  return reviewHTML(b.qs,null);
}
function rankHTML(){
  const s=S(), t=T(), me=uid(); let b;
  if(W.rows===null) b=`<p class="hint" style="padding:24px;text-align:center">Loading the rank list…</p>`;
  else if(!W.rows.length) b=`<p class="hint" style="padding:24px;text-align:center"><b style="color:var(--ink)">No attempts yet.</b> The first student to submit will appear here, ranked by marks and then by time.</p>`;
  else b=`<div class="tblwrap"><table><thead><tr><th>Rank</th><th>Name</th><th style="text-align:right">Marks</th><th style="text-align:right">Sec A</th><th style="text-align:right">Sec B</th><th style="text-align:right">Time</th></tr></thead><tbody>
    ${W.rows.map((r,k)=>`<tr ${r.id===me?'style="background:var(--gold-soft)"':""}><td><b>${k+1}</b></td><td>${esc(r.name||"Student")}${r.id===me?' <span class="pill gold">you</span>':""}</td><td style="text-align:right">${fs2(r.score)}</td><td style="text-align:right">${fs2(r.secA||0)}</td><td style="text-align:right">${fs2(r.secB||0)}</td><td style="text-align:right">${fmt(r.timeSec)}</td></tr>`).join("")}</tbody></table></div>`;
  return `<div class="panel"><div class="panel-head"><h3>Rank list · ${esc(s.code)} ${esc(s.title)}</h3><span class="hint">${W.rows&&W.rows.length?W.rows.length+(W.rows.length===1?" student":" students")+" · best attempt before the key":"Ties broken by shorter time"}</span></div>${b}</div>
    <div><button class="btn ghost" data-tbtab="test">Back to the test</button></div>`;
}
function draw(){ const el=$("#tb"); if(!el) return; el.innerHTML=body(); bind(el); typeset(el); }
function persist(){ if(W.phase==="test") store.set(saveKey(),{ start:W.start, ans:W.ans, mk:W.mk, cur:W.cur, ord:W.qs?qsOrder(W.qs):null }); }
function startTick(){ clearInterval(tick); tick=setInterval(()=>{
  if(W.phase!=="test"){ clearInterval(tick); return; }
  const r=remaining(); ["#tbTimer","#tbTimer2"].forEach(sel=>{ const el=$(sel); if(el){ el.textContent=fmt(r); el.classList.toggle("low",r<300); } });
  if(r<=0) submit();
},500); }
function begin(){
  const b=base(); if(!b) return;
  W.qs=shuffleQs(b.qs); W.qsFor=b.id;
  const t=T(); Object.assign(W,{ phase:"test", tab:"test", ans:t.qs.map(q=>q.t==="msq"?[]:null), mk:t.qs.map(()=>false), cur:0, confirming:false, start:Date.now() });
  persist(); startTick(); draw(); window.scrollTo(0,0);
}
async function submit(){
  if(W.phase!=="test") return;
  clearInterval(tick);
  const s=S(), t=T(); W.end=Math.min(Date.now(),W.start+t.minutes*60000); W.phase="result"; store.del(saveKey());
  const g=grade();
  store.set(lastKey(s.id),{ ans:W.ans, ord:qsOrder(W.qs), score:g.score });
  const late=W.end>=keyAt(s);
  W.msg=app.session.admin?"Teacher preview: not added to the rank list.":late?"Practice attempt after the answer key: not added to the rank list.":"Saving to the rank list…";
  if(ui.view==="tbatch"){ draw(); window.scrollTo(0,0); }
  if(app.session.admin||late) return;
  const id=uid(); if(!id){ setMsg("You're signed out, so this score wasn't saved."); return; }
  const rec={ name:String(app.session.name||"Student").slice(0,60), score:Math.round(g.score*100)/100, secA:Math.round(g.secA*100)/100, secB:g.secB,
    correct:g.correct, wrong:g.wrong, timeSec:Math.round((W.end-W.start)/1000), at:new Date().toISOString(),
    qs:W.qs.map((q,k)=>({ i:q._i, r:status(k)==="ok"?1:status(k)==="bad"?-1:0 })) };
  try{
    const ref=app.db.doc("results/"+s.id+"/entries/"+id), prev=await ref.get(), p=prev.exists?prev.data():null;
    const attempts=(p&&p.attempts||0)+1;
    const better=!p||rec.score>p.score||(rec.score===p.score&&rec.timeSec<p.timeSec);
    if(better){ await ref.set({ ...rec, attempts }); setMsg(p?"New personal best, saved to the rank list.":"Saved to the rank list."); }
    else { await ref.set({ ...p, name:rec.name, attempts }); setMsg(`Your best of ${fs2(p.score)} stays on the rank list.`); }
  }catch(e){ setMsg("Couldn't reach the rank list just now. Your score above is still correct."); }
}
function setMsg(m){ W.msg=m; const el=$("#tbMsg"); if(el) el.textContent=m; }
function bind(el){
  const d=el.querySelector("details.tb-wrap"); if(d) d.addEventListener("toggle",()=>{ W.schedOpen=d.open; });
  el.querySelectorAll("[data-tbtest]").forEach(b=>b.addEventListener("click",()=>{ if(W.test===b.dataset.tbtest) return; Object.assign(W,{ test:b.dataset.tbtest, phase:"start", tab:"test", qs:null, qsFor:null, msg:"" }); listen(); draw(); }));
  el.querySelectorAll("[data-tbtab]").forEach(b=>b.addEventListener("click",()=>{ W.tab=b.dataset.tbtab; draw(); }));
  el.querySelectorAll("[data-tbq]").forEach(b=>b.addEventListener("click",()=>{ W.cur=+b.dataset.tbq; persist(); draw(); }));
  el.querySelectorAll("[data-tbk]").forEach(b=>b.addEventListener("click",()=>{
    const k=+b.dataset.tbk, i=W.cur;
    if(T().qs[i].t==="msq"){ const a=W.ans[i]; W.ans[i]=a.includes(k)?a.filter(x=>x!==k):[...a,k].sort(); } else W.ans[i]=k;
    persist(); draw();
  }));
  el.querySelectorAll("[data-tbgo]").forEach(b=>b.addEventListener("click",()=>{
    const a=b.dataset.tbgo, i=W.cur, n=T().qs.length;
    if(a==="begin") return begin();
    if(a==="submit") return submit();
    if(a==="again"){ W.phase="start"; W.tab="test"; }
    if(a==="clear") W.ans[i]=T().qs[i].t==="msq"?[]:null;
    if(a==="mark") W.mk[i]=!W.mk[i];
    if(a==="prev") W.cur--;
    if(a==="next"){ if(i<n-1) W.cur++; else W.confirming=true; }
    if(a==="confirm") W.confirming=true;
    if(a==="keep") W.confirming=false;
    persist(); draw();
  }));
}
window.vTBatch=vTBatch;
window.bindTBatch=()=>{ const el=$("#tb"); if(el){ bind(el); typeset(el); } };
// For Admin → Test reports.
window.tbTests=()=>SCHED.filter(s=>P()[s.id]).map(s=>{ const p=paper(s); return { id:s.id, sid:"tb", max:maxOf(p), title:"CSIR NET Test Batch "+s.code+" · "+s.title, short:"TB-"+s.code }; });
// For the Home card: the paper that is open now (until its key), else the next one.
window.tbHome=()=>{ const s=current(), p=paper(s), open=isOpen(s)&&!keyOut(s)&&p;
  if(!open&&openAt(s)-Date.now()>24*3600e3) return null;
  return { live:!!open, title:"CSIR NET Test Batch · "+s.code+" "+s.title,
    facts:open?`${p.qs.length} questions · ${p.minutes} minutes · ${maxOf(p)} marks · key ${when(keyAt(s))}`:`Opens ${when(openAt(s))} · 100 marks · MCQ + MSQ` }; };
window.TB_SCHEDULE=SCHED;
})();
