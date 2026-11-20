// Amebo of the Day: the rules, in one place. The website's demo mode and the Render backend (amebo-core.cjs) run this same file.
(()=>{const WAT=36e5,CATS=["rel","fri","lag","con","rnd"],EM=["😂","👀","❤️","🍿","😭"],MAX=500,MAXP=3;
const dk=(n,o=0)=>new Date(n+WAT-o*864e5).toISOString().slice(0,10);
const reset=n=>{const d=new Date(n+WAT);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+1)-WAT};
// What a reader may see. Anonymous gists never include who wrote them.
const view=(g,uid)=>{const r={};Object.values(g.r).forEach(e=>r[e]=(r[e]||0)+1);return{id:g.id,cat:g.cat,text:g.text,at:g.at,anon:!!g.anon,author:g.anon?null:g.au,mine:g.uid===uid,reactions:r,my:g.r[uid]||null}};
function handle(S,x,m,p,q,b){const n=x.now,t=dk(n),uid=x.uid,E=(c,e)=>[c,{error:e}],O=[200,{ok:true}];
S.gists=S.gists.filter(g=>g.day===t);S.reads=S.reads||{};const rd=S.reads[uid]&&S.reads[uid].day===t?S.reads[uid]:(S.reads[uid]={day:t,ids:[]});
const pc=u=>{const q=S.posted[u];return q&&typeof q==="object"?(q.day===t?q.n:0):(q===t?1:0)},live=S.gists.filter(g=>g.rep.length<3),bump=()=>{const s=S.streak[uid]||(S.streak[uid]={streak:0,best:0,last:""});if(s.last===t)return;s.streak=s.last===dk(n,1)?s.streak+1:1;s.best=Math.max(s.best,s.streak);s.last=t};
if(!p.length&&m==="GET"){const mine=live.find(g=>g.uid===uid),s=S.streak[uid];return[200,{day:t,resetsAt:reset(n),total:live.filter(g=>g.uid!==uid).length,mine:mine?view(mine,uid):null,mineAll:live.filter(g=>g.uid===uid).map(g=>view(g,uid)).reverse(),canPost:pc(uid)<MAXP,postsLeft:Math.max(0,MAXP-pc(uid)),max:MAXP,streak:s&&(s.last===t||s.last===dk(n,1))?s.streak:0,best:s?s.best:0}]}
if(p[0]==="next"&&m==="GET"){const seen=String(q.get("seen")||"").split(","),pool=live.filter(g=>g.uid!==uid&&!seen.includes(g.id)&&!rd.ids.includes(g.id)),pk=pool.length?pool[Math.floor(Math.random()*pool.length)]:null;if(pk){bump();rd.ids.push(pk.id)}return[200,{gist:pk?view(pk,uid):null,left:Math.max(0,pool.length-1)}]}
if(p[0]==="read"&&m==="GET")return[200,rd.ids.map(i=>live.find(g=>g.id===i)).filter(g=>g&&g.r[uid]).map(g=>view(g,uid)).reverse()];
if(!p.length&&m==="POST"){const text=String(b.text||"").trim().slice(0,MAX);if(pc(uid)>=MAXP)return E(409,"You've dropped your "+MAXP+" gists for today. Come back tomorrow!");if(text.length<10)return E(400,"Say a little more (at least 10 characters)");if(!CATS.includes(b.cat))return E(400,"Pick a category");if(!x.me)return E(401,"Please log in");
const g={id:Math.random().toString(36).slice(2,9)+n.toString(36),day:t,uid,anon:b.anon!==false,cat:b.cat,text,at:n,r:{},rep:[],au:{id:x.me.id,name:x.me.name,username:x.me.username,avatar:x.me.avatar||{},bio:x.me.bio,area:x.me.area,fav:x.me.fav,interests:x.me.interests||[]}};S.gists.push(g);S.posted[uid]={day:t,n:pc(uid)+1};bump();return[201,view(g,uid)]}
const g=S.gists.find(k=>k.id===p[0]);if(!g)return E(404,"That gist has already gone");
if(m==="DELETE"&&!p[1]){if(g.uid!==uid)return E(403,"Not yours");S.gists=S.gists.filter(k=>k!==g);return O}
if(p[1]==="react"&&m==="POST"){if(g.uid===uid)return E(400,"React to other people's gists");if(!EM.includes(b.emoji))return E(400,"Pick a reaction");if(g.r[uid]===b.emoji)delete g.r[uid];else g.r[uid]=b.emoji;const v=view(g,uid);return[200,{reactions:v.reactions,my:v.my}]}
if(p[1]==="report"&&m==="POST"){if(g.uid!==uid&&!g.rep.includes(uid))g.rep.push(uid);return O}
return E(404,"Not found")}
globalThis.AmeboCore={handle,CATS,EM,MAX,MAXP}})();
