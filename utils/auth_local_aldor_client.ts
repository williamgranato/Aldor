
'use client';

export type User = {
  id: string;
  username: string;
  passHash: string;
  createdAt: number;
  lastSeen: number;
};

export type SaveSlot = {
  id: 1|2|3|4|5;
  name: string;
  updatedAt: number;
  state: any;
};

export type Profile = {
  userId: string;
  slots: SaveSlot[]; // up to 5
};

type Session = { userId: string, slotId?: 1|2|3|4|5 };

const K_USERS = 'aldor_auth_users_v1';
const K_PROFILES = 'aldor_auth_profiles_v1';
const K_SESSION = 'aldor_auth_session_v1';

function readJSON<T>(k:string, fallback:T): T {
  if (typeof window==='undefined') return fallback;
  try { const s = localStorage.getItem(k); return s? JSON.parse(s) as T : fallback; } catch { return fallback; }
}
function writeJSON<T>(k:string, v:T){
  if (typeof window==='undefined') return;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

export async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function hashPass(username:string, password:string){
  return sha256(`${username}:${password}`);
}

export function getUsers(): User[] { return readJSON<User[]>(K_USERS, []); }
export function saveUsers(users: User[]){ writeJSON(K_USERS, users); }

export function getProfile(userId: string): Profile {
  const all = readJSON<Record<string, Profile>>(K_PROFILES, {});
  return all[userId] || { userId, slots: [] };
}
export function saveProfile(p: Profile){
  const all = readJSON<Record<string, Profile>>(K_PROFILES, {});
  all[p.userId] = p;
  writeJSON(K_PROFILES, all);
}

export function getSession(): Session | null { return readJSON<Session|null>(K_SESSION, null); }
export function saveSession(s: Session | null){ writeJSON(K_SESSION, s); }

export function upsertUser(u: Omit<User,'id'|'createdAt'|'lastSeen'> & { id?: string }): User {
  let users = getUsers();
  if (u.id){
    users = users.map(x => x.id===u.id ? ({...x, ...u} as User) : x);
  } else {
    const id = `u_${Math.random().toString(36).slice(2,10)}`;
    users.push({ id, username: u.username, passHash: (u as any).passHash, createdAt: Date.now(), lastSeen: Date.now() });
    u.id = id;
  }
  saveUsers(users);
  return users.find(x => x.id===u.id)!;
}

// Profile slot helpers
export function upsertSlot(profile: Profile, slot: SaveSlot): Profile {
  const slots = [...profile.slots];
  const idx = slots.findIndex(s => s.id === slot.id);
  if (idx>=0) slots[idx] = slot; else slots.push(slot);
  const p2 = { ...profile, slots: slots.sort((a,b)=>a.id-b.id).slice(0,5) };
  saveProfile(p2);
  return p2;
}
export function deleteSlot(profile: Profile, slotId: 1|2|3|4|5): Profile {
  const p2 = { ...profile, slots: profile.slots.filter(s => s.id!==slotId) };
  saveProfile(p2);
  return p2;
}
