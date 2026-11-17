"use strict";
/* WebBuilder Studio — servidor: sirve la app y guarda cuentas y proyectos para usarlos desde cualquier dispositivo.
   Sin dependencias: solo Node 16+.  Uso: node server.js   (variables: PORT, DATA_DIR, HTTPS=1 detrás de un proxy HTTPS) */
const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const PORT = +process.env.PORT || 3000, ROOT = __dirname, DATA = process.env.DATA_DIR || path.join(ROOT, "data");
const MAX_BODY = 40 * 1024 * 1024, DAY = 864e5;
fs.mkdirSync(path.join(DATA, "projects"), { recursive: true });
const FU = path.join(DATA, "users.json"), FS = path.join(DATA, "sessions.json");
const load = f => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return {}; } };
const save = (f, o) => { const t = f + ".tmp"; fs.writeFileSync(t, JSON.stringify(o)); fs.renameSync(t, f); };
let users = load(FU), sessions = load(FS);          // users: por correo · sessions: por hash del token
const sha = s => crypto.createHash("sha256").update(s).digest("hex");
const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 32).toString("hex");
const same = (a, b) => { a = Buffer.from(a); b = Buffer.from(b); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const normCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function newCode() { const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", b = crypto.randomBytes(12); let c = ""; for (let i = 0; i < 12; i++) { c += A[b[i] % 32]; if (i % 4 === 3 && i < 11) c += "-"; } return c; }
const pub = u => ({ id: u.id, name: u.name, email: u.email });
const setCode = u => { const c = newCode(); u.recSalt = crypto.randomBytes(16).toString("hex"); u.recHash = hashPw(normCode(c), u.recSalt); return c; };

/* Límite de intentos por IP + correo. */
const fails = new Map();
const locked = k => (fails.get(k) || {}).until > Date.now();
const fail = k => { const f = fails.get(k) || { n: 0 }; if (++f.n >= 5) { f.until = Date.now() + 60000; f.n = 0; } fails.set(k, f); };

/* Sesiones: cookie HttpOnly con un token aleatorio; en disco solo se guarda su hash. */
function startSession(res, uid, remember) {
  const tok = crypto.randomBytes(32).toString("hex"), ttl = remember ? 30 * DAY : DAY;
  sessions[sha(tok)] = { uid, exp: Date.now() + ttl }; save(FS, sessions);
  res.setHeader("Set-Cookie", `wb_sid=${tok}; Path=/; HttpOnly; SameSite=Lax${process.env.HTTPS ? "; Secure" : ""}${remember ? "; Max-Age=" + ttl / 1000 : ""}`);
}
function auth(req) {
  const m = /(?:^|;\s*)wb_sid=([a-f0-9]{64})/.exec(req.headers.cookie || ""); if (!m) return null;
  const s = sessions[sha(m[1])]; if (!s || s.exp < Date.now()) return null;
  return Object.values(users).find(u => u.id === s.uid) || null;
}
const pdir = uid => path.join(DATA, "projects", uid);
const idxFile = uid => path.join(pdir(uid), "index.json");
const okId = s => /^[A-Za-z0-9]{1,40}$/.test(s);

const send = (res, code, obj) => { const b = JSON.stringify(obj); res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(b); };
const readBody = req => new Promise((ok, no) => {
  let n = 0; const ch = [];
  req.on("data", c => { n += c.length; if (n > MAX_BODY) { no(Object.assign(new Error("Proyecto demasiado grande"), { code: 413 })); req.destroy(); } else ch.push(c); });
  req.on("end", () => { try { ok(ch.length ? JSON.parse(Buffer.concat(ch).toString("utf8")) : {}); } catch (e) { no(Object.assign(new Error("JSON inválido"), { code: 400 })); } });
});

async function api(req, res, url) {
  const route = url.pathname.replace(/^\/api\//, ""), M = req.method;
  if (route === "ping") return send(res, 200, { ok: true });
  if (M !== "GET" && req.headers["x-wb"] !== "1") return send(res, 403, { error: "Solicitud no permitida." });   // protección CSRF
  const ip = req.socket.remoteAddress;

  if (M === "POST" && route === "register") {
    const b = await readBody(req), email = String(b.email || "").trim().toLowerCase(), name = String(b.name || "").trim().slice(0, 40);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: "Ingresá un correo válido." });
    if (!name) return send(res, 400, { error: "Ingresá tu nombre." });
    if (String(b.password || "").length < 8) return send(res, 400, { error: "La contraseña debe tener al menos 8 caracteres." });
    if (users[email]) return send(res, 409, { error: "Ya existe una cuenta con ese correo." });
    const u = { id: "u" + crypto.randomBytes(8).toString("hex"), name, email, salt: crypto.randomBytes(16).toString("hex"), created: Date.now() };
    u.hash = hashPw(b.password, u.salt); const code = setCode(u);
    users[email] = u; save(FU, users); startSession(res, u.id, b.remember !== false);
    return send(res, 200, { user: pub(u), code });
  }
  if (M === "POST" && route === "login") {
    const b = await readBody(req), email = String(b.email || "").trim().toLowerCase(), k = ip + email;
    if (locked(k)) return send(res, 429, { error: "Demasiados intentos. Probá de nuevo en un minuto." });
    const u = users[email], h = hashPw(b.password || "", u ? u.salt : "0".repeat(32));   // se calcula siempre: no revela si el correo existe
    if (!u || !same(h, u.hash)) { fail(k); return send(res, 401, { error: "Correo o contraseña incorrectos." }); }
    startSession(res, u.id, b.remember !== false); return send(res, 200, { user: pub(u) });
  }
  if (M === "POST" && route === "reset") {
    const b = await readBody(req), email = String(b.email || "").trim().toLowerCase(), k = ip + email;
    if (locked(k)) return send(res, 429, { error: "Demasiados intentos. Probá de nuevo en un minuto." });
    const u = users[email], h = hashPw(normCode(b.code), u && u.recSalt ? u.recSalt : "0".repeat(32));
    if (!u || !u.recHash || !same(h, u.recHash)) { fail(k); return send(res, 401, { error: "El correo o el código de recuperación no son correctos." }); }
    if (String(b.password || "").length < 8) return send(res, 400, { error: "La nueva contraseña debe tener al menos 8 caracteres." });
    u.salt = crypto.randomBytes(16).toString("hex"); u.hash = hashPw(b.password, u.salt); const code = setCode(u);
    for (const t of Object.keys(sessions)) if (sessions[t].uid === u.id) delete sessions[t];   // cierra las sesiones abiertas
    save(FU, users); startSession(res, u.id, true); return send(res, 200, { user: pub(u), code });
  }
  const me = auth(req);
  if (!me) return send(res, 401, { error: "Sesión vencida. Ingresá de nuevo." });
  if (M === "GET" && route === "me") return send(res, 200, { user: pub(me) });
  if (M === "POST" && route === "logout") { const m = /wb_sid=([a-f0-9]{64})/.exec(req.headers.cookie || ""); if (m) { delete sessions[sha(m[1])]; save(FS, sessions); } res.setHeader("Set-Cookie", "wb_sid=; Path=/; Max-Age=0"); return send(res, 200, { ok: true }); }
  if (M === "POST" && route === "recovery") { const code = setCode(me); save(FU, users); return send(res, 200, { code }); }
  if (M === "GET" && route === "library") { const ix = load(idxFile(me.id)); return send(res, 200, { library: Object.values(ix) }); }

  const pm = /^project\/([A-Za-z0-9]+)$/.exec(route);
  if (pm && okId(pm[1])) {
    const id = pm[1], file = path.join(pdir(me.id), id + ".json");
    if (M === "GET") { try { return send(res, 200, { project: JSON.parse(fs.readFileSync(file, "utf8")) }); } catch (e) { return send(res, 404, { error: "No existe." }); } }
    if (M === "PUT") {
      const b = await readBody(req); if (!b.project || !b.project.files || !b.meta) return send(res, 400, { error: "Datos incompletos." });
      fs.mkdirSync(pdir(me.id), { recursive: true });
      const ix = load(idxFile(me.id)); b.meta.id = id; ix[id] = b.meta;
      save(file, b.project); save(idxFile(me.id), ix); return send(res, 200, { ok: true });
    }
    if (M === "DELETE") { try { fs.unlinkSync(file); } catch (e) {} const ix = load(idxFile(me.id)); delete ix[id]; if (fs.existsSync(pdir(me.id))) save(idxFile(me.id), ix); return send(res, 200, { ok: true }); }
  }
  send(res, 404, { error: "No encontrado." });
}

/* Archivos estáticos: solo index.html, css/, js/ y assets/ (nunca data/ ni server.js). */
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".json": "application/json" };
function serve(req, res, url) {
  let p = decodeURIComponent(url.pathname); if (p === "/") p = "/index.html";
  const f = path.normalize(path.join(ROOT, p));
  if (!f.startsWith(ROOT + path.sep) || !/^\/(index\.html|(css|js|assets)\/)/.test(p) || p.includes("..")) { res.writeHead(404); return res.end("No encontrado"); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end("No encontrado"); } res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-cache" }); res.end(d); });
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (url.pathname.startsWith("/api/")) await api(req, res, url); else serve(req, res, url);
  } catch (e) { if (!res.headersSent) send(res, e.code || 500, { error: e.code ? e.message : "Error del servidor." }); }
}).listen(PORT, () => console.log(`WebBuilder Studio en http://localhost:${PORT}  (datos en ${DATA})`));
