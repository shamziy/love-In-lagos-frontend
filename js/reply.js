// Love in Lagos: reply to a particular message.
// Phone: swipe a message to the right and let go past the halfway mark.
// Laptop: swipe two fingers sideways on the trackpad over a message, or drag it with the mouse.
// The reply shows a small quote of the original. Tap the quote to jump back to it.
// Only RPL and SW are shared with app.js directly; everything else lives inside the function below, so its names can never clash with other files.
let RPL = null;   // the message being replied to: { id, from_id, text }
const SW = { armed: false, on: false, id: 0, pid: 0, x: 0, y: 0, dx: 0, hit: false, redraw: false, t: 0 };   // finger / mouse swipe
(function () {
const TPW = { el: 0, acc: 0, dir: 0, last: 0, fired: false, timer: 0 };                                       // trackpad swipe
const SW_GO = 60, TP_GO = 100;   // how far (pixels) counts as "reply"

function hapt(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }
function bubble(id) { return document.querySelector(`#msgs .m[data-id="${id}"]`); }
function pull(el, dx, go) {   // move the bubble with the swipe; it gets stiffer after the "reply" point
  const shown = dx > go ? go + (dx - go) * 0.25 : dx;
  el.style.transform = `translateX(${Math.min(shown, 84)}px)`;
  el.style.setProperty("--sw", Math.min(1, dx / go));
}
function release(el) { if (el) { el.classList.remove("swp"); el.style.transform = ""; el.style.removeProperty("--sw"); } }

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

// ---------- finger or mouse ----------
function swEnd(e) {
  if (e && e.pointerId !== SW.pid) return;
  const el = bubble(SW.id), go = SW.on && SW.dx >= SW_GO && !(e && e.type === "pointercancel");
  release(el);
  SW.armed = false; SW.on = false; SW.hit = false;
  if (go && el) startReply(el);
  if (SW.redraw) { SW.redraw = false; drawThread(); }
}
function swAbort() {   // the gesture was interrupted (tab switched, call came in...): put everything back
  if (!SW.armed && !SW.on) return;
  release(bubble(SW.id)); SW.armed = false; SW.on = false; SW.hit = false;
  if (SW.redraw) { SW.redraw = false; drawThread(); }
}
document.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  if (SW.armed || SW.on) swAbort();   // leftovers from an earlier gesture that never finished
  const m = e.target.closest && e.target.closest("#msgs .m");
  if (!m || typeof CT === "undefined" || CT !== "msg") return;
  SW.armed = true; SW.on = false; SW.id = +m.dataset.id; SW.pid = e.pointerId; SW.x = e.clientX; SW.y = e.clientY; SW.dx = 0; SW.hit = false; SW.t = Date.now();
}, { passive: true });
document.addEventListener("pointermove", e => {
  if (!SW.armed || e.pointerId !== SW.pid) return;
  const el = bubble(SW.id); if (!el) return;   // looked up each time: the chat may have refreshed under your finger
  const dx = e.clientX - SW.x, dy = e.clientY - SW.y;
  SW.t = Date.now();
  if (!SW.on) {
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx) * 1.2) { SW.armed = false; return; }   // mostly up or down: that is just scrolling
    if (dx < -12) { SW.armed = false; return; }                                                   // to the left: not a reply
    if (dx > 10 && dx > Math.abs(dy)) { SW.on = true; el.classList.add("swp"); try { el.setPointerCapture(e.pointerId); } catch (_) {} }
    else return;
  }
  SW.dx = Math.max(0, dx);
  pull(el, SW.dx, SW_GO);
  if (!SW.hit && SW.dx >= SW_GO) { SW.hit = true; hapt(12); }
  if (SW.hit && SW.dx < SW_GO) SW.hit = false;
});
document.addEventListener("pointerup", swEnd);
document.addEventListener("pointercancel", swEnd);
addEventListener("blur", swAbort);
document.addEventListener("visibilitychange", () => { if (document.hidden) swAbort(); });

// ---------- two-finger swipe on a laptop trackpad ----------
// Trackpads send "wheel" events. Cancelling the first sideways ones also stops Chrome and Safari from treating the
// swipe as "go Back". The direction is accepted either way because laptops differ in their scroll-direction setting.
function wheelEnd() {
  release(bubble(TPW.el)); TPW.el = 0; TPW.acc = 0; TPW.dir = 0; TPW.fired = false;
}
document.addEventListener("wheel", e => {
  if (e.ctrlKey) return;                                        // pinch-zoom
  if (SW.armed || SW.on) return;                                // a finger is already doing the swipe
  const now = Date.now(), going = !!TPW.el && now - TPW.last < 350;
  // Once a swipe has started it keeps following the same message, even when the bubble slides away from under the pointer.
  const m = going ? bubble(TPW.el) : e.target.closest && e.target.closest("#msgs .m");
  if (!m || typeof CT === "undefined" || CT !== "msg") return;
  const k = e.deltaMode === 1 ? 16 : 1, dx = e.deltaX * k, dy = e.deltaY * k, id = +m.dataset.id;
  if (!going && !(Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) >= 2)) return;   // mostly vertical: normal scrolling
  e.preventDefault();
  if (!going) { wheelEnd(); TPW.el = id; TPW.dir = Math.sign(dx) || 1; m.classList.add("swp"); }
  TPW.last = now;
  TPW.acc = Math.max(0, TPW.acc + TPW.dir * dx);
  pull(m, TPW.acc, TP_GO);
  if (!TPW.fired && TPW.acc >= TP_GO) { TPW.fired = true; hapt(12); startReply(m); }
  clearTimeout(TPW.timer); TPW.timer = setTimeout(wheelEnd, 260);
}, { passive: false });

// ---------- tap the quote to jump to the original ----------
document.addEventListener("click", e => {
  const q = e.target.closest && e.target.closest("#msgs .rq");
  if (!q) return;
  const t = bubble(+q.dataset.rid);
  if (!t) { toast("That message is further up in the chat"); return; }
  t.scrollIntoView({ block: "center", behavior: "smooth" });
  t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
});

window.startReply = startReply; window.clearReply = clearReply; window.renderReplyBar = renderReplyBar; window.quoteHTML = quoteHTML;
})();
