const DB_NAME = "beesafe-replays";
const DB_VERSION = 1;
const STORE_NAME = "recordings";
const MAX_RECORDINGS = 3;
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function getAllMetas(db) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      const metas = req.result.map(({ videoBlob: _, ...m }) => m);
      resolve(metas.sort((a, b) => b.timestamp - a.timestamp));
    };
    req.onerror = () => reject(req.error);
  });
}
function del(db, id) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
async function saveRecording(blob, duration, mimeType, sessionId = null, score = null) {
  const db = await openDB();
  const all = await getAllMetas(db);
  if (all.length >= MAX_RECORDINGS) {
    const oldest = [...all].sort((a, b) => a.timestamp - b.timestamp);
    for (const rec of oldest.slice(0, all.length - MAX_RECORDINGS + 1)) {
      await del(db, rec.id);
    }
  }
  const id = crypto.randomUUID();
  const finalScore = score ?? Math.floor(70 + Math.random() * 26);
  const record = { id, timestamp: Date.now(), duration, videoBlob: blob, mimeType, score: finalScore, sessionId };
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).add(record);
    req.onsuccess = () => {
      resolve(id);
      db.close();
    };
    req.onerror = () => reject(req.error);
  });
}
async function listRecordings() {
  const db = await openDB();
  const result = await getAllMetas(db);
  db.close();
  return result;
}
async function getRecording(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    req.onsuccess = () => {
      resolve(req.result ?? null);
      db.close();
    };
    req.onerror = () => reject(req.error);
  });
}
export {
  getRecording as g,
  listRecordings as l,
  saveRecording as s
};
