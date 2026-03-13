// src/lib/replay-store.ts
const DB_NAME = "beesafe-replays";
const DB_VERSION = 1;
const STORE_NAME = "recordings";
export const MAX_RECORDINGS = 3;

export interface Recording {
  id: string;
  timestamp: number;
  duration: number; // seconds
  videoBlob: Blob;
  mimeType: string;
  score: number;
}
export type RecordingMeta = Omit<Recording, "videoBlob">;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getAllMetas(db: IDBDatabase): Promise<RecordingMeta[]> {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      const metas = (req.result as Recording[]).map(({ videoBlob: _, ...m }) => m);
      resolve(metas.sort((a, b) => b.timestamp - a.timestamp));
    };
    req.onerror = () => reject(req.error);
  });
}

function del(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveRecording(blob: Blob, duration: number, mimeType: string): Promise<string> {
  const db = await openDB();
  const all = await getAllMetas(db);
  if (all.length >= MAX_RECORDINGS) {
    const oldest = [...all].sort((a, b) => a.timestamp - b.timestamp);
    for (const rec of oldest.slice(0, all.length - MAX_RECORDINGS + 1)) {
      await del(db, rec.id);
    }
  }
  const id = crypto.randomUUID();
  const score = Math.floor(70 + Math.random() * 26);
  const record: Recording = { id, timestamp: Date.now(), duration, videoBlob: blob, mimeType, score };
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).add(record);
    req.onsuccess = () => { resolve(id); db.close(); };
    req.onerror = () => reject(req.error);
  });
}

export async function listRecordings(): Promise<RecordingMeta[]> {
  const db = await openDB();
  const result = await getAllMetas(db);
  db.close();
  return result;
}

export async function getRecording(id: string): Promise<Recording | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    req.onsuccess = () => { resolve(req.result ?? null); db.close(); };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await openDB();
  await del(db, id);
  db.close();
}
