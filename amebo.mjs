// Amebo of the Day: drop-in add-on for the Love in Lagos backend (does not touch your existing routes).
// It works out who is logged in by asking your own /api/me, so it needs no knowledge of your login code.
import "./amebo-core.cjs";
const C = globalThis.AmeboCore;
export default function createAmebo({ store = { load: async () => null, save: async () => {} }, base } = {}) {
  let S = null; const cache = new Map();
  const who = async auth => { if (!auth) return null; const c = cache.get(auth); if (c && c.t > Date.now() - 6e4) return c.u;
    try { const r = await fetch((base || `http://127.0.0.1:${process.env.PORT || 3000}`) + "/api/me", { headers: { Authorization: auth } }); if (!r.ok) return null; const u = await r.json(); cache.set(auth, { u, t: Date.now() }); return u; } catch { return null; } };
  return async (req, res) => { const url = new URL(req.url, "http://x"); if (!/^\/api\/amebo(\/|$)/.test(url.pathname)) return false;
    const send = (c, j) => { res.writeHead(c, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS" }); res.end(j === undefined ? "" : JSON.stringify(j)); };
    if (req.method === "OPTIONS") { send(204); return true; }
    const me = await who(req.headers.authorization); if (!me) { send(401, { error: "Please log in" }); return true; }
    S = S || (await store.load()) || { gists: [], posted: {}, streak: {} };
    let b = req.body; if (!b || typeof b !== "object") { let s = ""; for await (const c of req) s += c; try { b = JSON.parse(s || "{}"); } catch { b = {}; } }
    const [c, j] = C.handle(S, { uid: me.id, now: Date.now(), me }, req.method, url.pathname.split("/").slice(3).filter(Boolean), url.searchParams, b);
    if (req.method !== "GET") await store.save(S).catch(() => {});
    send(c, j); return true; };
}
