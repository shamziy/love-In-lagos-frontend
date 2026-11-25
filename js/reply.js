// Love in Lagos: reply to a particular message.
// Swipe a message to the right (on desktop: drag it with the mouse) and let go past the halfway mark to reply to it.
// The reply shows a small quote of the original. Tap the quote to jump back to the original message.
// Only function declarations and listeners here: app.js may draw a chat before the end of this file is read.
let RPL = null;   // the message being replied to: { id, from_id, text }
const SW = { armed: false, on: false, el: null, pid: 0, x: 0, y: 0, dx: 0, hit: false, redraw: false };
const SW_GO = 60;   // how far (in pixels) to swipe before it counts as a reply

function hapt(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }

function startReply(el) {
  const id = +el.dataset.id, m = MSG.find(x => x.id === id);
  if (!m) return;
  RPL = { id, from_id: m.from_id, text: m.text };
  renderReplyBar();
  el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  const i = $("#ci"); if (i) i.focus({ preventScroll: true });
}
function clearReply() { RPL = null; renderReplyBar(); }
function renderReplyBar() {
  const b = $("#rbar"); if (!b) return;
  if (!RPL || !me) { b.classList.add("hid"); b.innerHTML = ""; return; }
  const who = RPL.from_id === me.id ? "yourself" : esc((UC[cur] || {}).name || "them");
  b.innerHTML = `<div class="rbt"><b>Replying to ${who}</b><span>${esc(String(RPL.text).slice(0, 120))}</span></div><button type="button" class="rbx" onclick="clearReply()" aria-label="Cancel reply">✕</button>`;
  b.classList.remove("hid");
}
function quoteHTML(x) {
  if (!x.replyTo) return "";
  const who = x.replyTo.from_id === me.id ? "You" : esc((UC[cur] || {}).name || "Them");
  return `<div class="rq" data-rid="${x.replyTo.id}"><b>${who}</b><span>${esc(x.replyTo.text || "Original message")}</span></div>`;
}

function swEnd(e) {
  if (e.pointerId !== SW.pid) return;
  const el = SW.el, go = SW.on && SW.dx >= SW_GO && e.type !== "pointercancel";
  if (el) { el.classList.remove("swp"); el.style.transform = ""; el.style.removeProperty("--sw"); }
  SW.armed = false; SW.on = false; SW.el = null; SW.hit = false;
  if (go && el) startReply(el);
  if (SW.redraw) { SW.redraw = false; drawThread(); }
}
document.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  const m = e.target.closest && e.target.closest("#msgs .m");
  if (!m || typeof CT === "undefined" || CT !== "msg") return;
  SW.armed = true; SW.on = false; SW.el = m; SW.pid = e.pointerId; SW.x = e.clientX; SW.y = e.clientY; SW.dx = 0; SW.hit = false;
}, { passive: true });
document.addEventListener("pointermove", e => {
  if (!SW.armed || e.pointerId !== SW.pid) return;
  const dx = e.clientX - SW.x, dy = e.clientY - SW.y;
  if (!SW.on) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { SW.armed = false; return; }   // up or down: that is just scrolling
    if (dx < -10) { SW.armed = false; return; }                                             // left: not a reply
    if (dx > 10 && dx > Math.abs(dy) * 1.2) { SW.on = true; SW.el.classList.add("swp"); try { SW.el.setPointerCapture(e.pointerId); } catch (_) {} }
    else return;
  }
  SW.dx = Math.max(0, dx);
  const shown = SW.dx > SW_GO ? SW_GO + (SW.dx - SW_GO) * 0.25 : SW.dx;   // it gets stiffer after the "reply" point
  SW.el.style.transform = `translateX(${Math.min(shown, 84)}px)`;
  SW.el.style.setProperty("--sw", Math.min(1, SW.dx / SW_GO));
  if (!SW.hit && SW.dx >= SW_GO) { SW.hit = true; hapt(12); }
  if (SW.hit && SW.dx < SW_GO) SW.hit = false;
});
document.addEventListener("pointerup", swEnd);
document.addEventListener("pointercancel", swEnd);
document.addEventListener("click", e => {
  const q = e.target.closest && e.target.closest("#msgs .rq");
  if (!q) return;
  const t = document.querySelector(`#msgs .m[data-id="${+q.dataset.rid}"]`);
  if (!t) { toast("That message is further up in the chat"); return; }
  t.scrollIntoView({ block: "center", behavior: "smooth" });
  t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
});
