/* =====================================================================
   JOM BACA! - Pangkalan data admin (Google Sheets + Apps Script)

   Menyimpan: PIN admin (cincang SHA-256 bergaram, dalam Script Properties),
   tetapan kongsi, dan bahan yang disunting (dalam helaian "data").
   Semua guru MEMBACA data ini. Hanya admin (selepas mengesahkan PIN di pelayan)
   boleh MENULIS.

   Cara guna: lihat PANDUAN-PANGKALAN-DATA.md
   ===================================================================== */
var SHEET_NAME = 'data';
var CHUNK = 40000;          // had sel Google Sheets ialah 50,000 aksara
var TOKEN_TTL = 1800;       // sesi admin 30 minit (saat)
var MAX_FAILS = 5;          // PIN salah berturutan sebelum disekat 60 saat

/* Jalankan SEKALI daripada editor untuk memberi kebenaran dan menyediakan helaian. */
function setup() {
  sheet_();
  if (!props_().getProperty('VERSION')) props_().setProperty('VERSION', '0');
  Logger.log('Siap. Sekarang pilih Deploy > New deployment > Web app.');
}

/* ---------- Titik masuk ---------- */
function doGet(e) {
  // GET hanya boleh membaca
  return json_(safe_(function () { return handle_({ action: 'get' }); }));
}
function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_json' }); }
  return json_(safe_(function () { return handle_(req || {}); }));
}
function safe_(fn) {
  try { return fn(); } catch (err) { return { ok: false, error: 'server', message: String(err && err.message || err) }; }
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Penghala ---------- */
function handle_(req) {
  switch (req.action) {
    case 'get': return get_();
    case 'verify': return verify_(req);
    case 'setpin': return withLock_(function () { return setPin_(req); });
    case 'removepin': return withLock_(function () { return removePin_(req); });
    case 'save': return withLock_(function () { return save_(req); });
    default: return { ok: false, error: 'bad_action' };
  }
}
function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { return fn(); } finally { lock.releaseLock(); }
}

/* ---------- Tindakan ---------- */
function get_() {
  var d = readAll_();
  return {
    ok: true,
    version: Number(props_().getProperty('VERSION') || 0),
    updated: d.updated || '',
    settings: parse_(d.settings, {}),
    overrides: parse_(d.overrides, {}),
    dropped: parse_(d.dropped, {}),
    hasPin: hasPin_()
  };
}

function verify_(req) {
  if (!hasPin_()) return { ok: false, error: 'no_pin' };
  var c = cache_();
  if (c.get('blocked')) return { ok: false, error: 'blocked', retry: 60 };
  var pin = String(req.pin || '');
  if (hash_(pin, props_().getProperty('PIN_SALT')) === props_().getProperty('PIN_HASH')) {
    c.remove('fails');
    return { ok: true, token: newToken_(), ttl: TOKEN_TTL };
  }
  var n = Number(c.get('fails') || 0) + 1;
  c.put('fails', String(n), 600);
  if (n >= MAX_FAILS) { c.put('blocked', '1', 60); c.remove('fails'); return { ok: false, error: 'blocked', retry: 60 }; }
  return { ok: false, error: 'wrong_pin', left: MAX_FAILS - n };
}

function setPin_(req) {
  var pin = String(req.pin || '');
  if (pin.length < 4 || pin.length > 64) return { ok: false, error: 'pin_short' };
  if (hasPin_() && !validToken_(req.token)) return { ok: false, error: 'auth' };   // PIN pertama boleh ditetapkan tanpa token
  var salt = Utilities.getUuid();
  props_().setProperty('PIN_SALT', salt);
  props_().setProperty('PIN_HASH', hash_(pin, salt));
  return { ok: true, token: newToken_(), ttl: TOKEN_TTL };
}

function removePin_(req) {
  if (!validToken_(req.token)) return { ok: false, error: 'auth' };
  props_().deleteProperty('PIN_SALT');
  props_().deleteProperty('PIN_HASH');
  return { ok: true };
}

function save_(req) {
  if (hasPin_() && !validToken_(req.token)) return { ok: false, error: 'auth' };
  var current = Number(props_().getProperty('VERSION') || 0);
  if (!req.force && Number(req.baseVersion || 0) !== current) return { ok: false, error: 'conflict', version: current };
  if (!isObj_(req.settings) || !isObj_(req.overrides) || !isObj_(req.dropped)) return { ok: false, error: 'bad_data' };
  var d = readAll_();
  d.settings = JSON.stringify(req.settings);
  d.overrides = JSON.stringify(req.overrides);
  d.dropped = JSON.stringify(req.dropped);
  d.updated = new Date().toISOString();
  writeAll_(d);
  var next = current + 1;
  props_().setProperty('VERSION', String(next));
  return { ok: true, version: next };
}

/* ---------- Pembantu ---------- */
function props_() { return PropertiesService.getScriptProperties(); }
function cache_() { return CacheService.getScriptCache(); }
function hasPin_() { return !!props_().getProperty('PIN_HASH'); }
function isObj_(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
function parse_(s, def) { try { return s ? JSON.parse(s) : def; } catch (e) { return def; } }
function newToken_() { var t = Utilities.getUuid().replace(/-/g, ''); cache_().put('t:' + t, '1', TOKEN_TTL); return t; }
function validToken_(t) { return !!t && !!cache_().get('t:' + t); }
function hash_(pin, salt) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + pin, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

/* ---------- Helaian "data": kunci | bahagian | nilai (teks panjang dipecah) ---------- */
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, 3).setValues([['kunci', 'bahagian', 'nilai']]);
  }
  return sh;
}
function readAll_() {
  var sh = sheet_(), n = sh.getLastRow(), out = {};
  if (n < 2) return out;
  var rows = sh.getRange(2, 1, n - 1, 3).getValues(), parts = {};
  rows.forEach(function (r) { if (!r[0]) return; (parts[r[0]] = parts[r[0]] || []).push([Number(r[1]), String(r[2])]); });
  Object.keys(parts).forEach(function (k) {
    out[k] = parts[k].sort(function (a, b) { return a[0] - b[0]; }).map(function (p) { return p[1]; }).join('');
  });
  return out;
}
function writeAll_(obj) {
  var sh = sheet_(), rows = [];
  Object.keys(obj).forEach(function (k) {
    var s = String(obj[k]), n = Math.max(1, Math.ceil(s.length / CHUNK));
    for (var i = 0; i < n; i++) rows.push([k, i, s.slice(i * CHUNK, (i + 1) * CHUNK)]);
  });
  var last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, 3).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, 3).setValues(rows);
}
