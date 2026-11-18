/* Doubt Corner: students post doubts and feedback, and anyone in the class can reply.
   Firestore: board/{postId} and board/{postId}/replies/{replyId}. See firestore.rules.
   A post marked "Only my teacher" (vis "teacher") is seen by its author and the teacher only. */
(()=>{
const KIND = { doubt:{ label:"Doubt", cls:"blue" }, feedback:{ label:"Feedback", cls:"soft" } };
const MAXT = 150, MAXB = 3000;
let thr = { id:null, unsub:null, replies:null };
const seenKey = () => "rc-dbt-seen-"+me();
const getSeen = () => { try{ return JSON.parse(localStorage.getItem(seenKey())||"{}"); }catch(e){ return {}; } };
const markSeen = p => { try{ const s=getSeen(); s[p.id]=p.lastAt||p.createdAt; localStorage.setItem(seenKey(),JSON.stringify(s)); }catch(e){} };
// The signed-in Firebase uid (the teacher's session id is "admin", so the session id is not used here).
const me = () => { const u=app.auth&&app.auth.current(); return u?u.uid:null; };
const isT = () => !!app.isAdmin;
if(ui.dbtF===undefined) ui.dbtF="all";

const css = document.createElement("style");
css.textContent = `
.dbt-intro{display:flex; gap:16px; align-items:center; justify-content:space-between; flex-wrap:wrap}
.dbt-intro p{max-width:62ch}
.dbt-actions{display:flex; gap:10px; flex-wrap:wrap}
.dbt-list{display:flex; flex-direction:column; gap:12px}
.dbt{display:block; width:100%; text-align:left; background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:16px 18px; color:var(--ink); font:inherit; cursor:pointer}
.dbt:hover{border-color:var(--gold)}
.dbt.pinned{border-color:#f2b237}
.dbt .tags{display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-bottom:6px}
.dbt h4{font-size:16px; line-height:1.35}
.dbt .snip{font-size:14px; color:var(--muted); margin-top:4px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow-wrap:anywhere}
.dbt .meta{font-size:13px; color:var(--muted); margin-top:8px; display:flex; gap:12px; flex-wrap:wrap}
.dbt .meta b{color:var(--ink); font-weight:600}
.dbt .new{color:var(--gold-ink); font-weight:700}
.thr-post{white-space:pre-wrap; overflow-wrap:anywhere; font-size:15px; line-height:1.55}
.thr-by{font-size:13px; color:var(--muted); margin:6px 0 2px}
.thr-tools{display:flex; gap:8px; flex-wrap:wrap; margin-top:10px}
.replies{display:flex; flex-direction:column; gap:10px; margin-top:18px; padding-top:16px; border-top:1px solid var(--line)}
.reply{background:var(--surface-2); border-radius:12px; padding:12px 14px}
.reply.teacher{background:var(--gold-soft); border-left:3px solid #f2b237}
.reply .who{display:flex; gap:8px; align-items:center; font-size:13px; color:var(--muted); flex-wrap:wrap}
.reply .who b{color:var(--ink)}
.reply .txt{white-space:pre-wrap; overflow-wrap:anywhere; margin-top:4px; font-size:14.5px; line-height:1.5}
.reply .del{margin-left:auto}
.dbt-check{display:flex; gap:10px; align-items:flex-start; font-size:14px}
.dbt-check input{width:18px; height:18px; margin-top:2px; flex:0 0 18px}
`;
document.head.appendChild(css);

const ago = iso => {
  const t=Date.parse(iso||""); if(isNaN(t)) return "";
  const s=Math.max(0,(Date.now()-t)/1000);
  if(s<60) return "just now"; if(s<3600) return Math.floor(s/60)+" min ago"; if(s<86400) return Math.floor(s/3600)+" h ago";
  if(s<7*86400) return Math.floor(s/86400)+" d ago";
  return new Date(t).toLocaleDateString("en-IN",{ day:"numeric", month:"short" });
};
const subjName = sid => sid==="gen"?"General":(S[sid]?.name||"General");
const hasNew = p => p.uid===me() && (p.replies||0)>0 && String(p.lastAt||"")>String(getSeen()[p.id]||p.createdAt||"");

function posts(){
  return [...(app.board||[])].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0) || String(b.lastAt||b.createdAt||"").localeCompare(String(a.lastAt||a.createdAt||"")));
}
function filtered(){
  const f=ui.dbtF;
  return posts().filter(p=> f==="all" || (f==="mine"?p.uid===me() : f==="wait"?(p.kind==="doubt"&&!p.teacherReplied&&!p.solved) : f==="solved"?p.solved : p.kind===f));
}
// Badge: for the teacher, doubts still waiting for a reply; for a student, own posts with replies not yet read.
window.doubtsCount = () => {
  if(!app.board||!app.session) return 0;
  return isT() ? app.board.filter(p=>!p.teacherReplied&&!p.solved&&p.uid!==me()).length : app.board.filter(hasNew).length;
};

window.vDoubts = () => {
  const list=filtered();
  return `
  <section class="panel dbt-intro">
    <div>
      <h3 style="font-family:var(--f-display);font-weight:400;font-size:20px">Ask, answer, improve</h3>
      <p class="hint" style="margin-top:4px">Stuck on a step from class? Post it here. Classmates and your teacher can reply. Use Feedback to tell us what to explain again or how classes can be better. Write maths like <code>\\(x^2+1\\)</code>.</p>
    </div>
    <div class="dbt-actions">
      <button class="btn primary" data-dbt-new="doubt">Ask a doubt</button>
      <button class="btn ghost" data-dbt-new="feedback">Give feedback</button>
    </div>
  </section>
  <div class="toolbar">
    <div class="chips" role="group" aria-label="Show">${chip("dbtF","all","All")}${chip("dbtF","doubt","Doubts")}${chip("dbtF","feedback","Feedback")}${chip("dbtF","mine","My posts")}${isT()?chip("dbtF","wait","Awaiting reply"):""}${chip("dbtF","solved","Solved")}</div>
  </div>
  <div class="dbt-list">
    ${app.board===null?`<div class="skel" aria-label="Loading"><i></i><i></i><i></i></div>`
      :list.length?list.map(card).join("")
      :`<div class="empty"><b>${ui.dbtF==="all"?"No posts yet":"Nothing here"}</b>${ui.dbtF==="all"?"Be the first to ask. Every doubt you post helps someone else who had the same question.":"Try another filter."}</div>`}
  </div>`;
};
function card(p){
  const n=p.replies||0;
  return `<button class="dbt ${p.pinned?"pinned":""}" data-dbt="${esc(p.id)}">
    <div class="tags">
      <span class="pill ${KIND[p.kind]?.cls||""}">${esc(KIND[p.kind]?.label||"Post")}</span>
      ${p.sid?`<span class="pill">${esc(subjName(p.sid))}</span>`:""}
      ${p.pinned?`<span class="pill gold">Pinned</span>`:""}
      ${p.solved?`<span class="pill ok">Solved</span>`:""}
      ${p.vis==="teacher"?`<span class="pill">Only teacher</span>`:""}
      ${p.teacherReplied?`<span class="pill gold">Teacher replied</span>`:""}
    </div>
    <h4>${esc(p.title)}</h4>
    ${p.body?`<p class="snip">${esc(p.body)}</p>`:""}
    <p class="meta"><span><b>${esc(p.uid===me()?"You":p.name||"Student")}</b> · ${esc(ago(p.createdAt))}</span><span>${n?n+(n===1?" reply":" replies"):"No replies yet"}</span>${hasNew(p)?`<span class="new">New reply</span>`:""}</p>
  </button>`;
}

window.bindDoubts = () => {
  const v=$("#view");
  v.querySelectorAll("[data-dbt-new]").forEach(b=>b.addEventListener("click",()=>openNew(b.dataset.dbtNew)));
  v.querySelectorAll("[data-dbt]").forEach(b=>b.addEventListener("click",()=>openThread(b.dataset.dbt)));
  typeset(v);
};

window.doubtsHome = () => `
  <section class="panel">
    <div class="panel-head"><h3>Doubt Corner</h3><button class="btn ghost sm" data-goto="doubts">Open</button></div>
    <p class="hint">${app.board===null?"Loading…":isT()?(window.doubtsCount()?window.doubtsCount()+" post(s) waiting for your reply.":"All caught up. No doubts waiting for a reply."):(window.doubtsCount()?"You have new replies on your posts.":"Got a doubt from class? Ask it here, and reply to your classmates' doubts.")}</p>
  </section>`;

/* ---------- new post ---------- */
function openNew(kind){
  const fb=kind==="feedback";
  openModal("Doubt Corner",fb?"Give feedback":"Ask a doubt",`
    <form id="dbtForm" class="form" novalidate>
      <div class="field"><label for="dbtKind">Type</label><select id="dbtKind"><option value="doubt" ${fb?"":"selected"}>Doubt</option><option value="feedback" ${fb?"selected":""}>Feedback</option></select></div>
      <div class="field"><label for="dbtSid">Subject</label><select id="dbtSid"><option value="gen">General</option>${SUBJ.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select></div>
      <div class="field"><label for="dbtTitle">${fb?"In one line":"Your doubt in one line"}</label><input id="dbtTitle" maxlength="${MAXT}" placeholder="${fb?"e.g. Please slow down in proofs":"e.g. Why is every group of order p² abelian?"}"></div>
      <div class="field"><label for="dbtBody">Details (optional)</label><textarea id="dbtBody" maxlength="${MAXB}" placeholder="${fb?"What helped, what didn't, what should we do more of?":"Write the step where you got stuck. Maths: \\(a^2\\), \\(\\frac{1}{n}\\), \\(\\mathbb{Z}_n\\)"}"></textarea></div>
      <label class="dbt-check"><input type="checkbox" id="dbtPriv" ${fb?"checked":""}><span>Only my teacher can see this<br><small class="hint">Leave unticked to let classmates read and reply.</small></span></label>
      <p class="status-line" id="dbtMsg" role="status"></p>
      <button class="btn primary" type="submit">Post</button>
    </form>`);
  $("#dbtKind").addEventListener("change",e=>{ $("#dbtPriv").checked=e.target.value==="feedback"; });
  $("#dbtForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const title=$("#dbtTitle").value.trim(), body=$("#dbtBody").value.trim(), msg=t=>{ $("#dbtMsg").textContent=t; };
    if(!title) return msg("Write your "+($("#dbtKind").value==="feedback"?"feedback":"doubt")+" in one line first.");
    const btn=e.target.querySelector("button[type=submit]"); btn.disabled=true; msg("Posting…");
    const now=new Date().toISOString();
    try{
      await app.db.collection("board").add({ kind:$("#dbtKind").value, sid:$("#dbtSid").value, title:title.slice(0,MAXT), body:body.slice(0,MAXB),
        vis:$("#dbtPriv").checked?"teacher":"class", uid:me(), name:isT()?"Teacher":String(app.session.name||"Student"), teacher:isT(),
        createdAt:now, lastAt:now, replies:0, teacherReplied:false, solved:false, pinned:false });
      closeModal(); ui.dbtF="all"; if(ui.view!=="doubts") go("doubts"); else render();
    }catch(ex){ btn.disabled=false; msg(ex&&ex.code==="permission-denied"?"Posting isn't switched on yet. Ask your teacher to publish the new Firestore rules.":"It wasn't posted. Check your connection and try again."); }
  });
  $("#dbtTitle").focus();
}

/* ---------- thread ---------- */
function stopThread(){ if(thr.unsub){ try{ thr.unsub(); }catch(e){} } thr={ id:null, unsub:null, replies:null }; }
function openThread(id){
  const p=(app.board||[]).find(x=>x.id===id); if(!p) return;
  stopThread(); thr.id=id;
  openModal("Doubt Corner · "+(KIND[p.kind]?.label||"Post"),p.title,`<div id="thr"></div>`,true);
  paintThread();
  thr.unsub=app.db.collection("board/"+id+"/replies").orderBy("createdAt","asc").limit(300).onSnapshot(s=>{
    if(thr.id!==id) return;
    if(!$("#thr")){ stopThread(); return; }
    thr.replies=s.docs.map(d=>({ id:d.id, ...d.data() })); paintReplies();
  },()=>{ thr.replies=thr.replies||[]; paintReplies(); });
  if(p.uid===me()) markSeen(p);
}
function paintThread(){
  const el=$("#thr"), p=(app.board||[]).find(x=>x.id===thr.id); if(!el) return;
  if(!p){ el.innerHTML=`<p class="hint">This post was removed.</p>`; return; }
  const own=p.uid===me();
  el.innerHTML=`
    <div class="tags" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
      ${p.sid?`<span class="pill">${esc(subjName(p.sid))}</span>`:""}${p.solved?`<span class="pill ok">Solved</span>`:""}${p.vis==="teacher"?`<span class="pill">Only teacher</span>`:""}${p.pinned?`<span class="pill gold">Pinned</span>`:""}
    </div>
    ${p.body?`<div class="thr-post">${esc(p.body)}</div>`:""}
    <p class="thr-by">${esc(own?"You":p.name||"Student")} · ${esc(ago(p.createdAt))}</p>
    <div class="thr-tools">
      ${(own||isT())&&p.kind==="doubt"?`<button class="btn ghost sm" data-t="solve">${p.solved?"Mark not solved":"Mark solved"}</button>`:""}
      ${isT()?`<button class="btn ghost sm" data-t="pin">${p.pinned?"Unpin":"Pin to top"}</button>`:""}
      ${isT()||(own&&!(p.replies>0))?`<button class="btn ghost sm" data-t="del">Delete post</button>`:""}
    </div>
    <div class="replies" id="thrReplies"><div class="skel" aria-label="Loading"><i></i><i></i></div></div>
    <form id="replyForm" class="form" novalidate style="margin-top:14px">
      <div class="field"><label for="replyTxt">${isT()?"Reply as Teacher":"Your reply"}</label><textarea id="replyTxt" maxlength="${MAXB}" style="min-height:90px" placeholder="Explain the step, or share how you solved it. Maths: \\(x^2\\)"></textarea></div>
      <p class="status-line" id="replyMsg" role="status"></p>
      <div><button class="btn primary" type="submit">Reply</button></div>
    </form>`;
  el.querySelectorAll("[data-t]").forEach(b=>b.addEventListener("click",()=>tool(b,b.dataset.t,p)));
  $("#replyForm").addEventListener("submit",e=>{ e.preventDefault(); sendReply(p); });
  paintReplies();
  typeset(el);
}
function paintReplies(){
  const box=$("#thrReplies"); if(!box||thr.replies===null) return;
  const rs=thr.replies;
  box.innerHTML=rs.length?rs.map(r=>`
    <div class="reply ${r.teacher?"teacher":""}">
      <div class="who"><b>${esc(r.uid===me()?"You":r.name||"Student")}</b>${r.teacher?`<span class="pill gold">Teacher</span>`:""}<span>${esc(ago(r.createdAt))}</span>
        ${(isT()||r.uid===me())?`<button class="btn ghost sm del" data-rdel="${esc(r.id)}">Delete</button>`:""}</div>
      <div class="txt">${esc(r.body)}</div>
    </div>`).join(""):`<p class="hint">No replies yet. ${isT()?"Your answer will be marked as the teacher's.":"If you know the answer, help your classmate."}</p>`;
  box.querySelectorAll("[data-rdel]").forEach(b=>b.addEventListener("click",()=>armButton(b,async()=>{
    try{
      await app.db.doc("board/"+thr.id+"/replies/"+b.dataset.rdel).delete();
      await app.db.doc("board/"+thr.id).update({ replies:app.db.inc(-1) });
    }catch(e){ $("#replyMsg").textContent="That reply wasn't deleted. Try again."; }
  })));
  typeset(box);
}
async function sendReply(p){
  const t=$("#replyTxt"), body=t.value.trim(), msg=s=>{ $("#replyMsg").textContent=s; };
  if(!body) return msg("Write your reply first.");
  const btn=$("#replyForm button[type=submit]"); btn.disabled=true; msg("Sending…");
  const now=new Date().toISOString();
  try{
    await app.db.collection("board/"+p.id+"/replies").add({ body:body.slice(0,MAXB), uid:me(), name:isT()?"Teacher":String(app.session.name||"Student"), teacher:isT(), createdAt:now });
    const up={ replies:app.db.inc(1), lastAt:now }; if(isT()) up.teacherReplied=true;
    await app.db.doc("board/"+p.id).update(up);
    t.value=""; msg(""); btn.disabled=false;
    if(p.uid===me()) markSeen({ id:p.id, lastAt:now });
  }catch(ex){ btn.disabled=false; msg("The reply wasn't sent. Check your connection and try again."); }
}
async function tool(btn,t,p){
  const ref=app.db.doc("board/"+p.id);
  try{
    if(t==="solve") await ref.update({ solved:!p.solved });
    if(t==="pin") await ref.update({ pinned:!p.pinned });
    if(t==="del") armButton(btn,async()=>{
      try{
        for(const r of (thr.replies||[])) await app.db.doc("board/"+p.id+"/replies/"+r.id).delete();
        await ref.delete(); closeModal();
      }catch(e){ $("#replyMsg").textContent="The post wasn't deleted. Try again."; }
    });
  }catch(e){ $("#replyMsg").textContent="That didn't save. Try again."; }
}

/* ---------- live data ---------- */
// The teacher reads every post. A student reads the class posts plus their own "only teacher" posts (two queries, merged).
window.doubtsListen = on => {
  app.board=null;
  const parts={};
  const merge=()=>{
    if(Object.keys(parts).length<(isT()?1:2)) return;
    const m=new Map(); Object.values(parts).flat().forEach(p=>m.set(p.id,p));
    app.board=[...m.values()]; refresh();
    if(thr.id&&$("#thr")) paintThread();
  };
  const fail=k=>()=>{ parts[k]=parts[k]||[]; merge(); };
  if(isT()){
    on(app.db.collection("board").orderBy("createdAt","desc").limit(400),s=>{ parts.all=s.docs.map(d=>({ id:d.id, ...d.data() })); merge(); },fail("all"));
  }else{
    on(app.db.collection("board").where("vis","==","class").limit(400),s=>{ parts.cls=s.docs.map(d=>({ id:d.id, ...d.data() })); merge(); },fail("cls"));
    on(app.db.collection("board").where("uid","==",me()).limit(200),s=>{ parts.mine=s.docs.map(d=>({ id:d.id, ...d.data() })); merge(); },fail("mine"));
  }
};
window.doubtsStop = () => { stopThread(); app.board=null; };
})();
