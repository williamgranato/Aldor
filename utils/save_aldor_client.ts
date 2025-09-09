const KEY = 'aldor_save_v1';
const LEGACY_KEYS = ['aldor_save', 'aldor_save_v0', 'ALDORIA_SAVE'];

export function loadGame<T=any>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch { return null; }
}

export function saveGame<T=any>(data: T){
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function clearSave(){
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
    for (const k of LEGACY_KEYS) localStorage.removeItem(k);
    // extra: clean possible session keys
    try { sessionStorage.removeItem(KEY); } catch {}
  } catch {}
}

export function nukeAllSaves(){
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) if (k.toLowerCase().includes('aldor')) localStorage.removeItem(k);
  } catch {}
}

export function exportSave(data: any){
  const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aldor_save.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

export async function importSaveBlob(file: File){
  const text = await file.text();
  const data = JSON.parse(text);
  saveGame(data);
  return data;
}
