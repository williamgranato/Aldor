export const persistKey = 'aldor_save_v1';

export type AnyObj = Record<string, any>;

export function saveGame(state: AnyObj) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(persistKey, JSON.stringify(state));
  } catch (e) {
    console.error('[saveGame] cannot save:', e);
  }
}

export function loadGame<T = AnyObj>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(persistKey);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('[loadGame] cannot parse:', e);
    return null;
  }
}

export function clearSave() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(persistKey);
  } catch {}
}

export function exportSave(state: AnyObj) {
  try {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aldor-save.json';
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('[exportSave] failed:', e);
  }
}

export async function importSaveBlob(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed.player) throw new Error('Arquivo de save inválido.');
  saveGame(parsed);
  return parsed;
}
