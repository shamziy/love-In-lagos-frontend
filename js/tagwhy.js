// Love in Lagos: tap a tag in a chat header to see what it means and why you got it.
// Only function declarations here (they are hoisted), because app.js may draw a chat before this file's end is reached.
function tagB(m) {
  if (!m || m.pct === undefined) return "";
  return `<button class="tag tgb lv${lvc(m.pct)}" onclick="tagWhy('m')" aria-label="Why this tag?">${lvl(m.pct)}<i>ⓘ</i></button>` +
    (m.talking ? '<button class="tag tgb" onclick="tagWhy(\'t\')" aria-label="What is Talking stage?">💬 Talking stage<i>ⓘ</i></button>' : "") +
    (m.photoUnlocked ? '<button class="tag tgb" onclick="tagWhy(\'p\')" aria-label="Why are photos visible?">📸 Photos visible<i>ⓘ</i></button>' : "");
}
function tagCommon(a, b) {
  const STOP = "this that with have from your about just like love lagos and the for are but you not who what when where been into than then them they their there here very much more some also".split(" "),
    w = t => new Set((String(t || "").toLowerCase().match(/[a-z]{4,}/g) || []).filter(x => !STOP.includes(x))),
    both = (x, y) => (x || []).filter(i => (y || []).includes(i)), out = [], wb = w(b.bio);
  const si = both(a.interests, b.interests), sl = both(a.look, b.look), sw = [...w(a.bio)].filter(x => wb.has(x)).slice(0, 4);
  if (si.length) out.push("🎯 Interests you share: <b>" + si.map(esc).join(", ") + "</b>");
  if (sl.length) out.push("💞 You are both looking for: <b>" + sl.map(esc).join(", ") + "</b>");
  if (a.area && a.area === b.area) out.push("📍 You are both in <b>" + esc(a.area) + "</b>");
  if (sw.length) out.push("💬 Words in both your bios: <b>" + sw.map(esc).join(", ") + "</b>");
  return out;
}
function tagWhy(k) {
  const u = UC[cur], mt = M.matches.find(x => x.user.id === cur); if (!u || !mt) return;
  const nm = esc(u.name); let h;
  if (k === "t") h = `<h2 class="at">💬 Talking stage</h2><p class="sub as">You and ${nm} have really clicked. This tag shows up when two people are a very strong match, or keep a great conversation going over several days. Keep it going!</p>`;
  else if (k === "p") h = `<h2 class="at">📸 Photos visible</h2><p class="sub as">You and ${nm} have chatted enough that your profile pictures are now visible to each other.</p>`;
  else {
    const p = Math.round(mt.pct), L = [[91, "💖 Perfect Match", "91 to 100%", "Your profiles line up really closely."], [80, "🔥 Sparks Flying", "80 to 90%", "You have a lot in common and the chemistry looks promising."], [51, "✨ Real Potential", "51 to 79%", "A solid base to build on. You share some things and differ in others."], [0, "🌱 Worth a Trial", "0 to 50%", "Not much overlap on paper yet. Plenty of great connections start with one conversation, so give it a try."]],
      cur4 = L.find(x => p >= x[0]), com = tagCommon(me, u);
    h = `<h2 class="at">${lvl(p)}</h2><p class="sub as">Your match score with ${nm} is <b>${p}%</b>. ${cur4[3]}</p>` +
      `<h3 class="sec" style="margin-top:14px">What you have in common</h3>` + (com.length ? `<div class="tgl">${com.map(x => `<p>${x}</p>`).join("")}</div>` : `<p class="note" style="text-align:left">Nothing in common is listed on your profiles yet. That is fine: real chemistry shows up in conversation, not on a form.</p>`) +
      `<h3 class="sec" style="margin-top:14px">All the tags</h3><div class="tgl">${L.map(x => `<p class="${x === cur4 ? "on" : ""}"><b>${x[1]}</b> <small>${x[2]}</small></p>`).join("")}</div>` +
      `<p class="note" style="text-align:left;margin-top:10px">Your score is worked out from your profiles when you match, using interests, what you are looking for, your bios and where you are. It stays the same as you chat. A fuller profile gives a more accurate score next time.</p>`;
  }
  modal(`${xb()}${h}<button class="btn" onclick="closeM()">Got it</button>`);
}
