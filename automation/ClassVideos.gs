/**
 * Ramanujan Class: put new class recordings into the app automatically.
 *
 * How it works
 *   Drive folder "Ramanujan Class Videos" has one subfolder per subject.
 *   Move (or upload) a video into a subject folder. Every 15 minutes this script:
 *     1. shares the video as "Anyone with the link can view",
 *     2. adds it to the app's Daily Lessons for that subject as the next day
 *        (videos from the same class date share one day).
 *   Each video is added once; moving it again does nothing.
 *   Rename a recording to its topic first and the topic shows on the video and its thumbnail.
 *   The app draws the thumbnail (Ramanujan Class, Namakkal · subject · date · topic) the next
 *   time the teacher opens the app.
 *
 * Setup: see SETUP-VIDEOS.md next to this file.
 */

const CONFIG = {
  FIREBASE_PROJECT: "ramanujan-class1",
  ROOT_FOLDER: "Ramanujan Class Videos",
  // Folder name -> subject id used by the app. Keep these names exactly.
  SUBJECTS: {
    "Abstract Algebra": "alg",
    "Real Analysis": "ana",
    "Linear Algebra": "lin",
    "Complex Analysis": "cpx",
    "Differential Equations": "de",
    "Probability & Statistics": "prob",
    "Number Theory": "num"
  },
  SHARE_PUBLIC_LINK: true
};

const FS = "https://firestore.googleapis.com/v1/projects/" + CONFIG.FIREBASE_PROJECT + "/databases/(default)/documents";

/** Run once by hand: creates the folders and the 15-minute timer. */
function setup() {
  const root = folder_(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER);
  Object.keys(CONFIG.SUBJECTS).forEach(name => folder_(root, name));
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "addNewVideos").forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("addNewVideos").timeBased().everyMinutes(15).create();
  addNewVideos();
  Logger.log("Ready. Folder: " + root.getUrl());
}

/** Runs on the timer. Safe to run by hand any time. */
function addNewVideos() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    const root = folder_(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER);
    Object.keys(CONFIG.SUBJECTS).forEach(name => {
      const sid = CONFIG.SUBJECTS[name];
      const files = [];
      const it = folder_(root, name).getFiles();
      while (it.hasNext()) {
        const f = it.next();
        if (f.getMimeType().indexOf("video/") === 0) files.push(f);
      }
      files.sort((a, b) => a.getDateCreated() - b.getDateCreated());
      files.forEach(f => {
        try { addVideo_(f, sid); }
        catch (e) { Logger.log("Skipped " + f.getName() + ": " + e.message); }
      });
    });
    shareAppVideos_();
  } finally {
    lock.releaseLock();
  }
}

/** Also shares videos added by hand in the app (Admin → Drive link), so they play inside the app. */
function shareAppVideos_() {
  if (!CONFIG.SHARE_PUBLIC_LINK) return;
  const props = PropertiesService.getScriptProperties();
  const done = JSON.parse(props.getProperty("shared") || "{}");
  const body = { structuredQuery: {
    from: [{ collectionId: "content" }],
    where: { fieldFilter: { field: { fieldPath: "kind" }, op: "EQUAL", value: { stringValue: "video" } } }
  } };
  (fs_("post", ":runQuery", body) || []).filter(r => r.document).forEach(r => {
    const link = fromFields_(r.document.fields || {}).link || "";
    const m = /\/d\/([\w-]{10,})/.exec(link) || /[?&]id=([\w-]{10,})/.exec(link);
    if (!m || done[m[1]]) return;
    try {
      const f = DriveApp.getFileById(m[1]);
      if (f.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      done[m[1]] = 1;
    } catch (e) { Logger.log("Could not share " + link + ": " + e.message); }
  });
  props.setProperty("shared", JSON.stringify(done));
}

function addVideo_(file, sid) {
  const docId = "drive_" + file.getId().replace(/[^A-Za-z0-9_-]/g, "");
  if (fs_("get", "content/" + docId, null, true)) return; // already in the app

  if (CONFIG.SHARE_PUBLIC_LINK) {
    try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); }
    catch (e) { Logger.log("Could not share " + file.getName() + " publicly: " + e.message); }
  }

  const classDate = classDate_(file);
  const existing = subjectVideos_(sid);
  const sameDay = existing.filter(v => v.classDate === classDate && v.day > 0)[0];
  const day = sameDay ? sameDay.day : existing.reduce((m, v) => Math.max(m, v.day || 0), 0) + 1;
  const order = existing.length + 1;

  const doc = {
    kind: "video",
    title: title_(file.getName(), classDate, existing.filter(v => v.classDate === classDate).length),
    topic: topic_(file.getName()),
    sid: sid,
    type: "",
    duration: duration_(file.getId()),
    parts: [],
    link: "https://drive.google.com/file/d/" + file.getId() + "/view",
    thumb: "",
    classDate: classDate,
    day: day,
    sizeBytes: 0,
    pages: 0,
    order: order,
    createdAt: new Date().toISOString()
  };
  fs_("patch", "content/" + docId + "?currentDocument.exists=false", { fields: toFields_(doc) });
  Logger.log("Added " + doc.title + " as Day " + day);
}

/* ---------- helpers ---------- */

function folder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

// Meet names recordings like "Class name - 2026/10/04 05:27 IST – Recording 2".
function classDate_(file) {
  const m = file.getName().match(/(\d{4})[\/-](\d{2})[\/-](\d{2})/);
  if (m) return m[1] + "-" + m[2] + "-" + m[3];
  return Utilities.formatDate(file.getDateCreated(), "Asia/Kolkata", "yyyy-MM-dd");
}

// Rename a recording to its topic (for example "Sylow theorems") before moving it, and the topic goes on the thumbnail.
// Meet's own names (they contain a date) give no topic.
function topic_(name) {
  const n = name.replace(/\.[a-z0-9]{2,4}$/i, "").trim();
  return /\d{4}[\/-]\d{2}[\/-]\d{2}/.test(n) ? "" : n;
}

function title_(name, classDate, partsSoFar) {
  const base = name.replace(/\.[a-z0-9]{2,4}$/i, "").split(" - ")[0].trim() || "Class recording";
  const d = Utilities.formatDate(new Date(classDate + "T12:00:00+05:30"), "Asia/Kolkata", "d MMM yyyy");
  return base + " · " + d + (partsSoFar ? " · Part " + (partsSoFar + 1) : "");
}

function duration_(fileId) {
  try {
    const r = UrlFetchApp.fetch("https://www.googleapis.com/drive/v3/files/" + fileId + "?fields=videoMediaMetadata&supportsAllDrives=true",
      { headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
    const ms = Number((JSON.parse(r.getContentText()).videoMediaMetadata || {}).durationMillis || 0);
    if (!ms) return "";
    const min = Math.round(ms / 60000);
    return min >= 60 ? Math.floor(min / 60) + " h " + (min % 60) + " min" : min + " min";
  } catch (e) { return ""; }
}

function subjectVideos_(sid) {
  const body = { structuredQuery: {
    from: [{ collectionId: "content" }],
    where: { fieldFilter: { field: { fieldPath: "sid" }, op: "EQUAL", value: { stringValue: sid } } }
  } };
  const rows = fs_("post", ":runQuery", body) || [];
  return rows.filter(r => r.document).map(r => fromFields_(r.document.fields || {})).filter(d => d.kind === "video");
}

function fs_(method, path, payload, allow404) {
  const opts = { method: method, muteHttpExceptions: true, contentType: "application/json",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() } };
  if (payload) opts.payload = JSON.stringify(payload);
  const url = path.charAt(0) === ":" ? FS + path : FS + "/" + path;
  const r = UrlFetchApp.fetch(url, opts);
  const code = r.getResponseCode();
  if (allow404 && code === 404) return null;
  if (code >= 300) throw new Error("Firestore " + code + ": " + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText() || "null");
}

function toFields_(o) {
  const f = {};
  Object.keys(o).forEach(k => f[k] = val_(o[k]));
  return f;
}
function val_(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: v.length ? { values: v.map(val_) } : {} };
  if (typeof v === "object") return { mapValue: { fields: toFields_(v) } };
  return { stringValue: String(v) };
}
function fromFields_(f) {
  const o = {};
  Object.keys(f).forEach(k => {
    const v = f[k];
    o[k] = "stringValue" in v ? v.stringValue : "integerValue" in v ? Number(v.integerValue) : "doubleValue" in v ? v.doubleValue : "booleanValue" in v ? v.booleanValue : null;
  });
  return o;
}
