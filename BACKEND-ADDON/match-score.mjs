// Match score that does NOT depend on similarities. Replace your backend's own compatibility function with this one.
// Same pair always gets the same score. Similarities only ever add a bonus; there is no penalty and no "low" band.
// Typical result: 52-92% with nothing in common, about 1 in 12 pairs get a "spark" up to 99%, shared interests add up to +10.
const h = s => { let x = 7; for (const c of String(s)) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x % 256; };
const STOP = new Set("this that with have from your about just like love lagos and the for are but you not who what when where been into than then them they their there here very much more some also".split(" "));
const words = t => new Set((String(t || "").toLowerCase().match(/[a-z]{4,}/g) || []).filter(w => !STOP.has(w)));
export function compat(a, b) {
  const ia = a.interests || [], ib = b.interests || [], wb = words(b.bio), si = ia.filter(x => ib.includes(x)), sw = [...words(a.bio)].filter(w => wb.has(w)),
    sa = !!a.area && a.area === b.area, sf = !!a.fav && a.fav === b.fav, k = [a.id, b.id].sort((x, y) => x - y).join("|"),
    r = (h(k) * 256 + h("m" + k) + 1) / 65536, spark = h("s" + k) % 100 < 8 ? 10 : 0;
  return { pct: Math.min(99, Math.round(52 + 40 * Math.pow(r, .6) + Math.min(10, si.length * 3 + Math.min(3, sw.length) + (sa ? 2 : 0) + (sf ? 1 : 0)) + spark)),
    why: [...si, ...sw.slice(0, 2), ...(sa ? ["both in " + a.area] : [])].slice(0, 5) };
}
