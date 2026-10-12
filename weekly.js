/* Weekly tests, taken inside the app with the student's own sign-in.
   Results go to Firestore results/{testId}/entries/{uid}; each student's best attempt is kept for the rank list.
   To add a test, append to WEEKLY with a new id. */
(()=>{
const R = String.raw;
const Q = [
  /* ---------- Section A: MCQ ---------- */
  { t:"mcq", q:R`The number of elements of order \(10\) in the group \(\Z_{30}\times\Z_{20}\) is`,
    o:[R`\(24\)`,R`\(48\)`,R`\(72\)`,R`\(96\)`], a:2,
    s:R`Let \(N(d)\) be the number of pairs whose order divides \(d\); in \(\Z_n\) there are \(\gcd(d,n)\) such elements. \(N(10)=10\cdot10,\ N(5)=5\cdot5,\ N(2)=2\cdot2,\ N(1)=1\). Order exactly \(10\): \(100-25-4+1=72\).` },
  { t:"mcq", q:R`Let \(p\) be a prime and \(G\) a non-abelian group of order \(p^3\). Then \(|Z(G)|\) equals`,
    o:[R`\(1\)`,R`\(p\)`,R`\(p^2\)`,R`\(p^3\)`], a:1,
    s:R`A \(p\)-group has non-trivial centre. \(|Z(G)|=p^3\) means \(G\) abelian; \(|Z(G)|=p^2\) makes \(G/Z(G)\) cyclic, again forcing \(G\) abelian. Hence \(|Z(G)|=p\).` },
  { t:"mcq", q:R`The number of group homomorphisms from \(S_3\) to \(S_3\) is`,
    o:[R`\(4\)`,R`\(6\)`,R`\(9\)`,R`\(10\)`], a:3,
    s:R`Classify by kernel. Kernel \(\{e\}\): automorphisms, \(|\operatorname{Aut}S_3|=6\). Kernel \(A_3\): image is a subgroup of order \(2\), and \(S_3\) has \(3\) of them. Kernel \(S_3\): the trivial map. Total \(6+3+1=10\).` },
  { t:"mcq", q:R`Let \(G=\Q/\Z\) and let \(n\) be a positive integer. Then \(G\) has a cyclic subgroup of order \(n\):`,
    o:[R`not necessarily`,R`yes, and it is the unique subgroup of \(G\) of order \(n\)`,R`yes, but it need not be unique`,R`never, since \(G\) is infinite`], a:1,
    s:R`\(\tfrac1n+\Z\) has order \(n\). Any element \(x\) of order dividing \(n\) satisfies \(nx\in\Z\), so \(x\in\langle \tfrac1n+\Z\rangle\). The subgroup \(\left\{\tfrac kn+\Z\right\}\) is therefore the only one of order \(n\).` },
  { t:"mcq", q:R`The number of distinct subgroups of the cyclic group \(\Z_{50000}\) is`,
    o:[R`\(30\)`,R`\(20\)`,R`\(25\)`,R`\(36\)`], a:0,
    s:R`A cyclic group of order \(n\) has exactly one subgroup for each divisor of \(n\). \(50000=2^4\cdot5^5\), so \(\tau(n)=(4+1)(5+1)=30\).` },
  { t:"mcq", q:R`The number of elements of order \(6\) in the symmetric group \(S_6\) is`,
    o:[R`\(240\)`,R`\(120\)`,R`\(200\)`,R`\(360\)`], a:0,
    s:R`Cycle types with lcm \(6\) on \(6\) points: a \(6\)-cycle, \(5!=120\); and type \((3)(2)(1)\), \(\binom63\cdot2\cdot\binom32=120\). Total \(240\).` },
  { t:"mcq", q:R`The number of elements of order \(2\) in the group \(U(1000)\) is`,
    o:[R`\(1\)`,R`\(3\)`,R`\(7\)`,R`\(15\)`], a:2,
    s:R`\(U(1000)\cong U(8)\times U(125)\cong(\Z_2\times\Z_2)\times\Z_{100}\). Elements with \(x^2=e\): \(4\cdot2=8\). Removing the identity leaves \(7\).` },
  { t:"mcq", q:R`The number of distinct subgroups of \(\Z_4\times\Z_2\) is`,
    o:[R`\(5\)`,R`\(6\)`,R`\(7\)`,R`\(8\)`], a:3,
    s:R`Order \(1\): \(1\). Order \(2\): one per element of order \(2\), namely \((2,0),(0,1),(2,1)\), giving \(3\). Order \(4\): cyclic \(\langle(1,0)\rangle,\langle(1,1)\rangle\) and the Klein group \(\{(0,0),(2,0),(0,1),(2,1)\}\), giving \(3\). Order \(8\): \(1\). Total \(8\).` },
  { t:"mcq", q:R`The remainder when \(3^{2026}\) is divided by \(100\) is`,
    o:[R`\(9\)`,R`\(29\)`,R`\(49\)`,R`\(69\)`], a:1,
    s:R`The exponent of \(U(100)\cong\Z_2\times\Z_{20}\) is \(20\), so \(3^{20}\equiv1\pmod{100}\). Since \(2026\equiv6\pmod{20}\), \(3^{2026}\equiv3^6=729\equiv29\).` },
  { t:"mcq", q:R`Let \(S\) be the set of positive divisors of \(10^{55}\). The number of elements of \(S\) that are multiples of \(10^{44}\) is`,
    o:[R`\(11\)`,R`\(12\)`,R`\(121\)`,R`\(144\)`], a:3,
    s:R`Divisors are \(2^a5^b\) with \(0\le a,b\le55\). Multiples of \(10^{44}\) need \(44\le a,b\le55\): \(12\) choices each, so \(12^2=144\).` },

  /* ---------- Section B: MSQ ---------- */
  { t:"msq", q:R`In \(S_4\), let \(H=\{e,(1\,2)(3\,4)\}\) and \(K=\{e,(1\,2)(3\,4),(1\,3)(2\,4),(1\,4)(2\,3)\}\). Which of the following are true?`,
    o:[R`\(K\) is normal in \(S_4\)`,R`\(H\) is normal in \(K\), but \(H\) is not normal in \(A_4\)`,R`\(A_4\) has a subgroup of order \(6\)`,R`\(S_4/K\cong S_3\)`], a:[0,1,3],
    s:R`(A) \(K\) is a union of conjugacy classes. (B) \(K\) is abelian, so \(H\trianglelefteq K\); conjugating \((1\,2)(3\,4)\) by \((1\,2\,3)\in A_4\) gives \((2\,3)(1\,4)\notin H\). (C) False: the classic counterexample to the converse of Lagrange. (D) \(S_4/K\) has order \(6\) and is non-abelian, so it is \(S_3\).` },
  { t:"msq", q:R`Let \(G=\Z_{10}\times\Z_{15}\). Which of the following are true?`,
    o:[R`\(G\) has exactly one element of order \(2\)`,R`\(G\cong\Z_{150}\)`,R`\(G\) has exactly \(24\) elements of order \(5\)`,R`\(G\) has exactly \(24\) elements of order \(10\)`], a:[0,2,3],
    s:R`\(G\cong\Z_2\times\Z_3\times(\Z_5\times\Z_5)\). (A) The Sylow \(2\)-subgroup is \(\Z_2\). (B) False, since \(\gcd(10,15)\ne1\). (C) \(\Z_5\times\Z_5\) has \(25-1=24\) elements of order \(5\). (D) Order \(10\) means \(2\)-part of order \(2\) (one choice) and \(5\)-part of order \(5\) (\(24\) choices), \(3\)-part trivial: \(24\).` },
  { t:"msq", q:R`Let \(G=S_3\times S_3\). Which of the following are true?`,
    o:[R`\(A_3\times A_3\) is a normal subgroup of \(G\)`,R`The centre \(Z(G)\) is trivial`,R`\(G\) has a normal subgroup of order \(18\)`,R`Every subgroup of \(G\) of order \(4\) is normal in \(G\)`], a:[0,1,2],
    s:R`(A) A product of normal subgroups is normal. (B) \(Z(G)=Z(S_3)\times Z(S_3)\) is trivial. (C) \(S_3\times A_3\) has index \(2\). (D) False: subgroups of order \(4\) are Sylow \(2\)-subgroups \(\langle\tau\rangle\times\langle\sigma\rangle\), and there are \(3\cdot3=9\) of them, so none is normal.` },
  { t:"msq", q:R`On a group \(G\) define \(a\sim b \iff b=gag^{-1}\) for some \(g\in G\). Which of the following are true?`,
    o:[R`\(\sim\) is an equivalence relation on \(G\)`,R`The equivalence class of the identity \(e\) is \(\{e\}\)`,R`For \(G=S_4\), the number of equivalence classes is \(5\)`,R`Every equivalence class is a subgroup of \(G\)`], a:[0,1,2],
    s:R`(A) Conjugacy is reflexive, symmetric and transitive. (B) \(geg^{-1}=e\). (C) Classes of \(S_4\) correspond to cycle types, i.e. the \(5\) partitions of \(4\). (D) False: a class other than \(\{e\}\) does not contain \(e\).` },
  { t:"msq", q:R`Which of the following groups are cyclic?`,
    o:[R`\(U(162)\)`,R`\(U(1000)\)`,R`\(\Z_{10}\times\Z_{21}\)`,R`The multiplicative group \(\F_{27}^{\,*}\) of the field with \(27\) elements`], a:[0,2,3],
    s:R`\(U(n)\) is cyclic exactly for \(n=1,2,4,p^k,2p^k\) with \(p\) an odd prime. (A) \(162=2\cdot3^4\): cyclic. (B) \(8\mid1000\): not cyclic. (C) \(\gcd(10,21)=1\), so it is \(\Z_{210}\). (D) The multiplicative group of a finite field is always cyclic.` }
];
const WEEKLY = [{
  id:"wt1-algebra", title:"Weekly Test 1 · Abstract Algebra", sid:"alg", date:"10 Oct 2026",
  syllabus:"Sets, Relations & Functions · Groups · Subgroups · Normal Subgroups · Cyclic Groups",
  minutes:45, mcq:{ plus:2, minus:2/3 }, msq:{ plus:2 },
  note:R`\(\Z_n\): additive cyclic group of order \(n\); \(U(n)\): group of units modulo \(n\); \(\F_q\): field with \(q\) elements.`,
  qs:Q
}];
const KEYS=["A","B","C","D"];
const T=()=>WEEKLY.find(t=>t.id===W.test)||WEEKLY[WEEKLY.length-1];
const maxOf=t=>t.qs.reduce((s,q)=>s+(q.t==="msq"?t.msq.plus:t.mcq.plus),0);
const nA=t=>t.qs.filter(q=>q.t!=="msq").length;
const fmt=sec=>{ sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60; return (h?h+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"); };
const fs2=n=>String(Math.round(n*100)/100);
const W={ test:null, phase:"start", ans:[], mk:[], cur:0, start:0, end:0, confirming:false, msg:"", tab:"test", rows:null, unsub:null, rowsFor:null };
let tick=null;
const uid=()=>{ try{ const u=app.auth&&app.auth.current(); return u?u.uid:null; }catch(e){ return null; } };
const saveKey=()=>"rc-wt-"+(app.session&&app.session.u)+"-"+T().id;

function answered(k){ const a=W.ans[k]; return T().qs[k].t==="msq"?a.length>0:a!==null; }
function status(k){ const q=T().qs[k], a=W.ans[k]; if(!answered(k)) return "skip"; return (q.t==="msq"?sameSet(a,q.a):a===q.a)?"ok":"bad"; }
function marks(k){ const t=T(), st=status(k), msq=t.qs[k].t==="msq"; return st==="ok"?(msq?t.msq.plus:t.mcq.plus):st==="bad"?(msq?0:-t.mcq.minus):0; }
function grade(){ let c=0,w=0,A=0,B=0; T().qs.forEach((q,k)=>{ const st=status(k); if(st==="ok")c++; if(st==="bad")w++; if(q.t==="msq")B+=marks(k); else A+=marks(k); }); return { correct:c, wrong:w, skipped:T().qs.length-c-w, secA:A, secB:B, score:A+B }; }
const remaining=()=>T().minutes*60-(Date.now()-W.start)/1000;

function listen(){
  const t=T(); if(W.rowsFor===t.id||!app.db) return;
  if(W.unsub) try{ W.unsub(); }catch(e){}
  W.rows=null; W.rowsFor=t.id;
  W.unsub=app.db.collection("results/"+t.id+"/entries").limit(500).onSnapshot(s=>{
    W.rows=s.docs.map(d=>({ id:d.id, ...d.data() })).sort((a,b)=>(b.score-a.score)||(a.timeSec-b.timeSec));
    if(ui.view==="weekly"&&(W.tab==="rank"||W.phase!=="test")) draw();
  },()=>{ W.rows=W.rows||[]; if(ui.view==="weekly") draw(); });
}

function vWeekly(){
  if(!W.test){
    W.test=WEEKLY[WEEKLY.length-1].id;
    const saved=store.get(saveKey(),null);
    if(saved&&saved.start&&Date.now()-saved.start<T().minutes*60000){ Object.assign(W,{ phase:"test", ans:saved.ans, mk:saved.mk, start:saved.start, cur:saved.cur||0 }); startTick(); }
  }
  listen();
  return `<div id="wk" style="display:flex;flex-direction:column;gap:18px">${body()}</div>`;
}
function body(){
  const t=T();
  const tabs=`<div class="wk-tabs" role="tablist">
    <button role="tab" data-wtab="test" aria-selected="${W.tab==="test"}">Test</button>
    <button role="tab" data-wtab="rank" aria-selected="${W.tab==="rank"}">Rank list</button></div>`;
  const head=`<div class="wk-head"><div><p class="eyebrow" style="color:var(--gold-ink)">Ramanujan Class, Namakkal · ${esc(t.date)}</p><h2 style="font-family:var(--f-display);font-weight:400;margin:4px 0 0">${esc(t.title)}</h2></div>${W.phase==="test"?"":tabs}</div>`;
  if(W.tab==="rank"&&W.phase!=="test") return head+rankHTML();
  return head+(W.phase==="start"?startHTML():W.phase==="test"?testHTML():resultHTML());
}
function startHTML(){
  const t=T(), a=nA(t), b=t.qs.length-a, mine=W.rows&&W.rows.find(r=>r.id===uid());
  return `<div class="wk-grid2">
    <div class="panel">
      <h3 style="margin:0 0 4px">${esc(t.syllabus)}</h3>
      <ul class="wk-facts"><li><b>${t.qs.length}</b><span>Questions</span></li><li><b>${t.minutes} min</b><span>Time</span></li><li><b>${maxOf(t)}</b><span>Maximum marks</span></li></ul>
      <div class="wk-sec"><b>Section A · MCQ · Q1–Q${a}</b><span>Exactly one option is correct. +${t.mcq.plus} each, −${fs2(t.mcq.minus)} for a wrong answer.</span></div>
      <div class="wk-sec"><b>Section B · MSQ · Q${a+1}–Q${a+b}</b><span>One or more options are correct. +${t.msq.plus} only for the exact set of correct options. No negative marks.</span></div>
      <p class="hint mjx" style="margin-top:12px">${t.note}</p>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px;justify-content:center">
      <p style="margin:0">Taking the test as <b>${esc(app.session.name)}</b>.</p>
      <p class="hint" style="margin:0">${app.session.admin?"Teacher preview: your score is not added to the rank list.":mine?`Your best so far: <b>${fs2(mine.score)} / ${maxOf(t)}</b>. Only your best attempt counts.`:"Your score goes on the batch rank list. Only your best attempt counts."}</p>
      <p class="hint" style="margin:0">The timer keeps running if you leave this page, so finish in one sitting.</p>
      <button class="btn primary" data-wgo="begin">Start test</button>
    </div></div>`;
}
function palBtn(k){ return `<button data-wq="${k}" class="${answered(k)?"ans":""} ${W.mk[k]?"mk":""} ${k===W.cur?"cur":""}" aria-label="Question ${k+1}">${k+1}</button>`; }
function testHTML(){
  const t=T(), i=W.cur, q=t.qs[i], msq=q.t==="msq", a=nA(t);
  const sel=k=>msq?W.ans[i].includes(k):W.ans[i]===k;
  const done=t.qs.filter((_,k)=>answered(k)).length;
  return `<div class="wk-test">
    <div class="panel">
      <div class="wk-qmeta"><span class="hint">Section ${msq?"B":"A"} · Question ${i+1} of ${t.qs.length}</span><b class="wk-mtimer" id="wkTimer2">${fmt(remaining())}</b><span class="pill ${msq?"gold":"blue"}">${msq?"MSQ · select all that apply":"MCQ · one correct"}</span></div>
      <p class="wk-q mjx">${q.q}</p>
      <p class="hint">${msq?`+${t.msq.plus} only for the exact set · no negative marks`:`+${t.mcq.plus} if correct · −${fs2(t.mcq.minus)} if wrong`}</p>
      <div class="wk-opts ${q.t}">${q.o.map((o,k)=>`<button class="wk-opt" data-wk="${k}" aria-pressed="${sel(k)}"><span class="key">${KEYS[k]}</span><span class="val mjx">${o}</span></button>`).join("")}</div>
      <div class="wk-nav">
        <div><button class="btn ghost sm" data-wgo="clear" ${answered(i)?"":"disabled"}>Clear answer</button> <button class="btn ghost sm" data-wgo="mark">${W.mk[i]?"Unmark":"Mark for review"}</button></div>
        <div><button class="btn ghost" data-wgo="prev" ${i===0?"disabled":""}>Previous</button> <button class="btn primary" data-wgo="next">${i===t.qs.length-1?"Review &amp; submit":"Save &amp; next"}</button></div>
      </div>
    </div>
    <aside class="wk-side">
      <div class="panel"><div class="hint">Time left</div><div class="wk-timer" id="wkTimer">${fmt(remaining())}</div></div>
      <div class="panel">
        <div class="hint">Answer sheet · ${done}/${t.qs.length} answered</div>
        <div class="wk-pal-sec">Section A · MCQ</div><div class="wk-pal">${t.qs.slice(0,a).map((_,k)=>palBtn(k)).join("")}</div>
        <div class="wk-pal-sec">Section B · MSQ</div><div class="wk-pal">${t.qs.slice(a).map((_,k)=>palBtn(k+a)).join("")}</div>
      </div>
      ${W.confirming?`<div class="wk-confirm"><span>Submit now? ${t.qs.length-done} unanswered, ${W.mk.filter(Boolean).length} marked for review.</span><div><button class="btn primary sm" data-wgo="submit">Submit test</button> <button class="btn ghost sm" data-wgo="keep">Keep working</button></div></div>`
        :`<button class="btn ghost" data-wgo="confirm">Submit test</button>`}
    </aside></div>`;
}
function ansText(k,a){ const q=T().qs[k]; if(q.t==="msq") return a.length?a.map(x=>KEYS[x]).join(", "):"—"; return a===null?"—":KEYS[a]+". "+q.o[a]; }
function resultHTML(){
  const t=T(), g=grade(), secs=(W.end-W.start)/1000, a=nA(t);
  const maxA=a*t.mcq.plus, maxB=(t.qs.length-a)*t.msq.plus;
  return `<div class="panel">
    <div class="wk-score"><div><div class="hint">${esc(app.session.name)}</div><div class="wk-big">${fs2(g.score)}<small> / ${maxOf(t)}</small></div></div>
      <div class="wk-tally"><div><b style="color:var(--ok)">${g.correct}</b>Correct</div><div><b style="color:var(--bad)">${g.wrong}</b>Wrong</div><div><b>${g.skipped}</b>Skipped</div><div><b>${fmt(secs)}</b>Time taken</div></div></div>
    <div class="wk-split"><div>Section A (MCQ)<b>${fs2(g.secA)} / ${maxA}</b></div><div>Section B (MSQ)<b>${fs2(g.secB)} / ${maxB}</b></div></div>
    <p class="hint" id="wkMsg" style="margin-top:12px">${esc(W.msg)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px"><button class="btn primary" data-wtab="rank">See rank list</button><button class="btn ghost" data-wgo="again">Retake test</button></div>
  </div>
  <h3 style="font-family:var(--f-display);font-weight:400;margin:6px 0 0">Answers and solutions</h3>
  <div style="display:flex;flex-direction:column;gap:12px">${t.qs.map((q,k)=>{ const st=status(k), m=marks(k);
    return `<div class="wk-rv ${st}"><p class="mjx" style="margin:0"><b>Q${k+1}.</b> ${q.q}</p>
      <div class="wk-row"><span class="pill ${st==="ok"?"ok":st==="bad"?"bad":""}">${m>0?"+"+fs2(m):m<0?"−"+fs2(-m):"0"}</span>
      <span>Your answer: <span class="mjx">${ansText(k,W.ans[k])}</span></span>
      <span>Correct: <span class="mjx">${q.t==="msq"?q.a.map(x=>KEYS[x]).join(", "):KEYS[q.a]+". "+q.o[q.a]}</span></span></div>
      <p class="hint mjx" style="margin:8px 0 0">${q.s}</p></div>`; }).join("")}</div>`;
}
function rankHTML(){
  const t=T(), me=uid(); let b;
  if(W.rows===null) b=`<p class="hint" style="padding:24px;text-align:center">Loading the rank list…</p>`;
  else if(!W.rows.length) b=`<p class="hint" style="padding:24px;text-align:center"><b style="color:var(--ink)">No attempts yet.</b> The first student to submit will appear here, ranked by marks and then by time.</p>`;
  else b=`<div class="tblwrap"><table><thead><tr><th>Rank</th><th>Name</th><th style="text-align:right">Marks</th><th style="text-align:right">Sec A</th><th style="text-align:right">Sec B</th><th style="text-align:right">Time</th></tr></thead><tbody>
    ${W.rows.map((r,k)=>`<tr ${r.id===me?'style="background:var(--gold-soft)"':""}><td><b>${k+1}</b></td><td>${esc(r.name||"Student")}${r.id===me?' <span class="pill gold">you</span>':""}</td><td style="text-align:right">${fs2(r.score)}</td><td style="text-align:right">${fs2(r.secA||0)}</td><td style="text-align:right">${fs2(r.secB||0)}</td><td style="text-align:right">${fmt(r.timeSec)}</td></tr>`).join("")}</tbody></table></div>`;
  return `<div class="panel"><div class="panel-head"><h3>Rank list · ${esc(t.title)}</h3><span class="hint">${W.rows&&W.rows.length?W.rows.length+(W.rows.length===1?" student":" students")+" · best attempt each":"Ties broken by shorter time"}</span></div>${b}</div>
    ${W.phase==="start"?`<div><button class="btn ghost" data-wtab="test">Back to the test</button></div>`:""}`;
}

function draw(){ const el=$("#wk"); if(!el) return; el.innerHTML=body(); bind(el); typeset(el); }
function persist(){ if(W.phase==="test") store.set(saveKey(),{ start:W.start, ans:W.ans, mk:W.mk, cur:W.cur }); }
function startTick(){ clearInterval(tick); tick=setInterval(()=>{
  if(W.phase!=="test"){ clearInterval(tick); return; }
  const r=remaining(); ["#wkTimer","#wkTimer2"].forEach(sel=>{ const el=$(sel); if(el){ el.textContent=fmt(r); el.classList.toggle("low",r<300); } });
  if(r<=0) submit();
},500); }
function begin(){
  const t=T(); Object.assign(W,{ phase:"test", ans:t.qs.map(q=>q.t==="msq"?[]:null), mk:t.qs.map(()=>false), cur:0, confirming:false, start:Date.now() });
  persist(); startTick(); draw(); window.scrollTo(0,0);
}
async function submit(){
  if(W.phase!=="test") return;
  clearInterval(tick);
  const t=T(); W.end=Math.min(Date.now(),W.start+t.minutes*60000); W.phase="result"; store.del(saveKey());
  W.msg=app.session.admin?"Teacher preview: not added to the rank list.":"Saving to the rank list…";
  if(ui.view==="weekly"){ draw(); window.scrollTo(0,0); }
  if(app.session.admin) return;
  const g=grade(), id=uid(); if(!id){ setMsg("You're signed out, so this score wasn't saved."); return; }
  const rec={ name:String(app.session.name||"Student").slice(0,60), score:Math.round(g.score*100)/100, secA:Math.round(g.secA*100)/100, secB:g.secB,
    correct:g.correct, wrong:g.wrong, timeSec:Math.round((W.end-W.start)/1000), at:new Date().toISOString() };
  try{
    const ref=app.db.doc("results/"+t.id+"/entries/"+id), prev=await ref.get(), p=prev.exists?prev.data():null;
    const attempts=(p&&p.attempts||0)+1;
    const better=!p||rec.score>p.score||(rec.score===p.score&&rec.timeSec<p.timeSec);
    if(better){ await ref.set({ ...rec, attempts }); setMsg(p?"New personal best, saved to the rank list.":"Saved to the rank list."); }
    else { await ref.set({ ...p, name:rec.name, attempts }); setMsg(`Your best of ${fs2(p.score)} stays on the rank list.`); }
  }catch(e){ setMsg("Couldn't reach the rank list just now. Your score above is still correct."); }
}
function setMsg(m){ W.msg=m; const el=$("#wkMsg"); if(el) el.textContent=m; }
function bind(el){
  el.querySelectorAll("[data-wtab]").forEach(b=>b.addEventListener("click",()=>{ W.tab=b.dataset.wtab; draw(); }));
  el.querySelectorAll("[data-wq]").forEach(b=>b.addEventListener("click",()=>{ W.cur=+b.dataset.wq; persist(); draw(); }));
  el.querySelectorAll("[data-wk]").forEach(b=>b.addEventListener("click",()=>{
    const k=+b.dataset.wk, i=W.cur;
    if(T().qs[i].t==="msq"){ const a=W.ans[i]; W.ans[i]=a.includes(k)?a.filter(x=>x!==k):[...a,k].sort(); } else W.ans[i]=k;
    persist(); draw();
  }));
  el.querySelectorAll("[data-wgo]").forEach(b=>b.addEventListener("click",()=>{
    const a=b.dataset.wgo, i=W.cur, n=T().qs.length;
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
window.vWeekly=vWeekly;
window.bindWeekly=()=>{ const el=$("#wk"); if(el){ bind(el); typeset(el); } };
window.weeklyTests=()=>WEEKLY.map(t=>({ id:t.id, sid:t.sid, max:maxOf(t), title:t.title }));
window.weeklyTitle=()=>WEEKLY[WEEKLY.length-1].title;
window.weeklyFacts=()=>{ const t=WEEKLY[WEEKLY.length-1]; return `${t.qs.length} questions · ${t.minutes} minutes · ${maxOf(t)} marks · MCQ + MSQ · batch rank list`; };
})();
