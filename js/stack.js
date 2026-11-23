// Love in Lagos: Stack Game. Built into the website, so it works on every device and needs no outside page.
const StackGame=(()=>{
const W=360,BH=26,BW=170,DP=9,BK="lil_stack_best",SK="lil_stack_sound";
let cv,cx,box,raf=0,last=0,s=1,Hh=640,dpr=1,state="ready",stack=[],mv=null,dir=1,speed=130,combo=0,score=0,best=0,cam=0,camT=0,debris=[],parts=[],pops=[],flash=0,shake=0,muted=false,ac=null,live=false,xpMsg="",overAt=0,tt=0,newBest=false,city=[],stars=[],bound=false;
const rnd=(a,b)=>a+Math.random()*(b-a),mix=(a,b,k)=>a.map((v,i)=>Math.round(v+(b[i]-v)*k)),rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`,hueOf=i=>(i*13+335)%360,col=(h,l,a=1)=>`hsla(${h},78%,${l}%,${a})`;
const Y=y=>Hh-64-(y-cam);
function load(){try{best=+localStorage.getItem(BK)||0;muted=localStorage.getItem(SK)==="0"}catch(e){best=0;muted=false}}
function save(){try{localStorage.setItem(BK,best);localStorage.setItem(SK,muted?"0":"1")}catch(e){}}
function beep(f,d=.08,type="square",v=.045){if(muted)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch(e){}}
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function scenery(){if(city.length)return;let x=-10;while(x<W+30){const w=rnd(26,54),h=rnd(50,160);city.push({x,w,h,seed:Math.random()});x+=w+rnd(2,10)}for(let i=0;i<46;i++)stars.push({x:rnd(0,W),y:rnd(0,900),r:rnd(.6,1.6),p:rnd(0,6)})}
function reset(){stack=[{x:(W-BW)/2,w:BW,h:hueOf(0)}];score=0;combo=0;speed=130;cam=0;camT=0;debris=[];parts=[];pops=[];flash=0;xpMsg="";newBest=false;newMover()}
function newMover(){const top=stack[stack.length-1];dir=Math.random()<.5?1:-1;mv={x:dir>0?-top.w*.5:W-top.w*.5,w:top.w,h:hueOf(stack.length)}}
function sparks(x,y,w,h){for(let i=0;i<16;i++)parts.push({x:x+rnd(0,w),y,vx:rnd(-90,90),vy:rnd(40,200),life:rnd(.4,.8),h})}
function pop(t,x,y){pops.push({t,x,y,life:1})}
function drop(){const top=stack[stack.length-1],m=mv,l=Math.max(top.x,m.x),r=Math.min(top.x+top.w,m.x+m.w),ov=r-l,yw=stack.length*BH;
 if(ov<=2){return over()}
 let nb;
 if(Math.abs(m.x-top.x)<=5){combo++;nb={x:top.x,w:top.w,h:m.h};if(combo>=3&&nb.w<BW){const g=Math.min(6,BW-nb.w);nb.x-=g/2;nb.w+=g}flash=1;sparks(nb.x,yw+BH,nb.w,m.h);pop(combo>1?"PERFECT x"+combo:"PERFECT",nb.x+nb.w/2,yw+BH+10);beep(500+Math.min(combo,8)*70,.12,"triangle",.07);buzz(12)}
 else{combo=0;nb={x:l,w:ov,h:m.h};const cw=m.w-ov;debris.push({x:m.x<top.x?m.x:r,y:yw,w:cw,h:m.h,vy:0,vx:(m.x<top.x?-1:1)*45});beep(300,.07);buzz(8)}
 stack.push(nb);score++;speed=125+Math.min(score*5,235);newMover()}
function over(){const m=mv;if(m)debris.push({x:m.x,y:stack.length*BH,w:m.w,h:m.h,vy:0,vx:dir*60});mv=null;state="over";overAt=performance.now();shake=8;if(score>best){best=score;newBest=score>0}save();buzz([30,50,30]);beep(160,.25,"sawtooth",.06);const b=document.getElementById("sgb");if(b)b.textContent="Best "+best;
 if(score>0&&typeof me!=="undefined"&&me&&typeof api==="function"){xpMsg="";api("POST","/play",{score}).then(r=>{xpMsg=r&&r.xp?"+"+r.xp+" XP earned ⭐":"Daily game XP limit reached";if(typeof loadXP==="function")loadXP()}).catch(()=>{xpMsg=""})}else xpMsg=score>0&&!(typeof me!=="undefined"&&me)?"Log in to earn XP from your score":""}
function act(){if(!live)return;if(state==="ready"){reset();state="playing";beep(440,.06)}else if(state==="playing")drop();else if(state==="over"&&performance.now()-overAt>450){reset();state="playing";beep(440,.06)}}
function step(dt){tt+=dt;if(state==="playing"&&mv){mv.x+=dir*speed*dt;const lo=-mv.w*.5,hi=W-mv.w*.5;if(mv.x>hi){mv.x=hi;dir=-1}else if(mv.x<lo){mv.x=lo;dir=1}}
 camT=Math.max(0,(stack.length+1)*BH-Hh*.4);cam+=(camT-cam)*Math.min(1,dt*5);flash=Math.max(0,flash-dt*3);shake=Math.max(0,shake-dt*30);
 debris.forEach(d=>{d.vy+=950*dt;d.y-=d.vy*dt;d.x+=d.vx*dt});debris=debris.filter(d=>d.y>cam-300);
 parts.forEach(p=>{p.vy-=520*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt});parts=parts.filter(p=>p.life>0);
 pops.forEach(p=>{p.y+=38*dt;p.life-=dt*1.1});pops=pops.filter(p=>p.life>0)}
function block(x,yt,w,h,hu,a=1){cx.globalAlpha=a;cx.fillStyle=col(hu,58);cx.fillRect(x,yt,w,h);const g=cx.createLinearGradient(0,yt,0,yt+h);g.addColorStop(0,"rgba(255,255,255,.22)");g.addColorStop(1,"rgba(0,0,0,.2)");cx.fillStyle=g;cx.fillRect(x,yt,w,h);
 cx.fillStyle=col(hu,74);cx.beginPath();cx.moveTo(x,yt);cx.lineTo(x+DP,yt-DP);cx.lineTo(x+w+DP,yt-DP);cx.lineTo(x+w,yt);cx.closePath();cx.fill();
 cx.fillStyle=col(hu,40);cx.beginPath();cx.moveTo(x+w,yt);cx.lineTo(x+w+DP,yt-DP);cx.lineTo(x+w+DP,yt-DP+h);cx.lineTo(x+w,yt+h);cx.closePath();cx.fill();cx.globalAlpha=1}
const txt=(t,x,y,size,fill="#fff",w="800")=>{cx.font=`${w} ${size}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`;cx.textAlign="center";cx.lineWidth=Math.max(2,size/9);cx.strokeStyle="rgba(20,10,30,.55)";cx.lineJoin="round";cx.strokeText(t,x,y);cx.fillStyle=fill;cx.fillText(t,x,y)};
function draw(){cx.setTransform(dpr*s,0,0,dpr*s,0,0);const k=Math.min(1,score/45),sx=shake?rnd(-shake,shake)*.4:0,sy=shake?rnd(-shake,shake)*.4:0;cx.save();cx.translate(sx,sy);
 const sky=cx.createLinearGradient(0,0,0,Hh);sky.addColorStop(0,rgb(mix([255,176,140],[16,16,58],k)));sky.addColorStop(1,rgb(mix([255,232,186],[70,52,120],k)));cx.fillStyle=sky;cx.fillRect(-20,-20,W+40,Hh+40);
 if(k>.25){stars.forEach(t=>{const yy=(t.y-cam*.08)%Hh;cx.globalAlpha=Math.min(1,(k-.25)*1.6)*(.55+.45*Math.sin(tt*2+t.p));cx.fillStyle="#fff";cx.beginPath();cx.arc(t.x,yy<0?yy+Hh:yy,t.r,0,6.3);cx.fill()});cx.globalAlpha=1}
 const by=Hh-64+cam*.5;city.forEach(b=>{if(by-b.h>Hh+20)return;cx.fillStyle=rgb(mix([120,86,110],[22,20,50],k));cx.fillRect(b.x,by-b.h,b.w,b.h+80);if(k>.1){cx.fillStyle="rgba(255,214,120,"+(.25+k*.6)+")";for(let wy=by-b.h+8;wy<by-6;wy+=14)for(let wx=b.x+5;wx<b.x+b.w-6;wx+=10)if(((wx*7+wy*13+b.seed*100)|0)%5<2)cx.fillRect(wx,wy,4,6)}});
 const gy=Y(0);if(gy<Hh+10){cx.fillStyle="#2b2236";cx.fillRect(-20,gy,W+40,Hh-gy+60);cx.fillStyle="#3a2f48";cx.fillRect(-20,gy,W+40,6);cx.fillStyle="rgba(255,226,140,.8)";for(let x=-10;x<W+20;x+=46)cx.fillRect(x,gy+26,24,3)}
 stack.forEach((b,i)=>{const yt=Y((i+1)*BH);if(yt>Hh+BH||yt<-BH*2)return;block(b.x,yt,b.w,BH,b.h)});
 if(flash>0&&stack.length){const b=stack[stack.length-1],yt=Y(stack.length*BH);cx.fillStyle="rgba(255,255,255,"+flash*.55+")";cx.fillRect(b.x,yt,b.w,BH)}
 if(mv&&state==="playing")block(mv.x,Y((stack.length+1)*BH),mv.w,BH,mv.h);
 debris.forEach(d=>block(d.x,Y(d.y+d.h),d.w,BH,d.h,Math.max(0,Math.min(1,(d.y-cam+250)/250))));
 parts.forEach(p=>{cx.globalAlpha=Math.max(0,p.life*1.4);cx.fillStyle=col(p.h,80);cx.fillRect(p.x,Y(p.y),3.4,3.4)});cx.globalAlpha=1;
 pops.forEach(p=>{cx.globalAlpha=Math.min(1,p.life*1.6);txt(p.t,p.x,Y(p.y),17,"#ffe27a");cx.globalAlpha=1});
 cx.restore();
 if(state!=="ready"){txt(String(score),W/2,78,60);if(combo>1)txt("combo x"+combo,W/2,104,17,"#ffe27a")}
 if(state==="ready"){panel();txt("STACK",W/2,Hh/2-52,46,"#ffd166");txt("Tap to drop each block",W/2,Hh/2-14,17);txt("Line it up for PERFECT combos",W/2,Hh/2+10,14,"#ffe9f1","700");txt(best?"Best: "+best:"Tap to start",W/2,Hh/2+46,19,"#ffffff");cx.globalAlpha=.6+.4*Math.sin(tt*5);txt("▶",W/2,Hh/2+84,24);cx.globalAlpha=1}
 if(state==="over"){panel();txt("Game over",W/2,Hh/2-58,34,"#ff9aa8");txt(String(score),W/2,Hh/2-4,64);txt(newBest?"🏆 New best!":"Best: "+best,W/2,Hh/2+28,20,newBest?"#ffe27a":"#fff");if(xpMsg)txt(xpMsg,W/2,Hh/2+56,16,"#9ff0b5");if(performance.now()-overAt>450){cx.globalAlpha=.6+.4*Math.sin(tt*5);txt("Tap to play again",W/2,Hh/2+90,19);cx.globalAlpha=1}}}
function panel(){cx.fillStyle="rgba(24,12,36,.62)";const x=22,w=W-44,h=250,y=Hh/2-h/2-4;cx.beginPath();if(cx.roundRect)cx.roundRect(x,y,w,h,22);else cx.rect(x,y,w,h);cx.fill()}
function fit(){if(!box||!cv)return;const r=box.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2.5);cv.width=Math.max(1,Math.round(r.width*dpr));cv.height=Math.max(1,Math.round(r.height*dpr));s=r.width/W;Hh=r.height/s}
function loop(ts){if(!live)return;raf=requestAnimationFrame(loop);const dt=Math.min(.033,(ts-last)/1000||0);last=ts;step(dt);draw()}
const onPtr=e=>{e.preventDefault();act()},onKey=e=>{if(e.code==="Space"||e.code==="Enter"||e.code==="ArrowDown"){e.preventDefault();act()}else if(e.key==="Escape"&&typeof closeM==="function")closeM()},onVis=()=>{if(!live)return;if(document.hidden)cancelAnimationFrame(raf);else{last=performance.now();raf=requestAnimationFrame(loop)}},onSize=()=>setTimeout(fit,60);
function open(){load();scenery();if(typeof gameVH==="function")gameVH();
 modal(`<div class="stack-game-head"><div><b>Stack Game</b><small id="sgb">Best ${best}</small></div><button class="stack-game-new" id="sgm" type="button" aria-label="Sound on or off">${muted?"🔇":"🔊"}</button><button class="stack-game-close" type="button" onclick="closeM()" aria-label="Close game">✕</button></div><div class="stack-game-box"><canvas id="sgc" class="sg" aria-label="Stack game. Tap to drop the block."></canvas></div><p class="stack-game-foot">Tap, click or press Space to drop. Perfect drops build combos and earn XP.</p>`,"stack-game-overlay");
 document.body.style.overflow="hidden";box=document.querySelector(".stack-game-box");cv=document.getElementById("sgc");cx=cv.getContext("2d");live=true;reset();state="ready";fit();
 cv.addEventListener("pointerdown",onPtr,{passive:false});window.addEventListener("keydown",onKey);window.addEventListener("resize",onSize);window.addEventListener("orientationchange",onSize);document.addEventListener("visibilitychange",onVis);bound=true;
 document.getElementById("sgm").onclick=()=>{muted=!muted;save();document.getElementById("sgm").textContent=muted?"🔇":"🔊";if(!muted)beep(600,.06)};
 last=performance.now();raf=requestAnimationFrame(loop)}
function destroy(){if(!live&&!bound)return;live=false;cancelAnimationFrame(raf);if(cv)cv.removeEventListener("pointerdown",onPtr);window.removeEventListener("keydown",onKey);window.removeEventListener("resize",onSize);window.removeEventListener("orientationchange",onSize);document.removeEventListener("visibilitychange",onVis);bound=false;cv=cx=box=null}
return{open,destroy,_tap:act,_aligned:()=>state==="playing"&&!!mv&&Math.abs(mv.x-stack[stack.length-1].x)<2.2,_s:()=>({state,score,best,combo,n:stack.length,live})}})();
