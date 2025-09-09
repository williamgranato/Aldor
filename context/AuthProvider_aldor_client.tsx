
'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import type { User, Profile, SaveSlot } from '@/utils/auth_local_aldor_client';
import { getUsers, upsertUser, getProfile, saveProfile, upsertSlot, deleteSlot as delSlot, getSession, saveSession, hashPass } from '@/utils/auth_local_aldor_client';

type Ctx = {
  user: User | null;
  profile: Profile | null;
  currentSlotId: 1|2|3|4|5 | null;
  // auth
  createUser: (username:string, password:string) => Promise<User>;
  login: (username:string, password:string) => Promise<boolean>;
  logout: () => void;
  // slots
  listSlots: () => SaveSlot[];
  loadSlot: (id: 1|2|3|4|5) => boolean;
  saveSlot: (id: 1|2|3|4|5, name?: string) => boolean;
  deleteSlot: (id: 1|2|3|4|5) => void;
  createNewCharacter: (name:string, options?: any) => Promise<{ ok:boolean, slotId?:1|2|3|4|5 }>;
  exportSlot: (id: 1|2|3|4|5) => void;
  importSlot: (json:any) => boolean;
  selectSlot: (id: 1|2|3|4|5 | null) => void;
};

const AuthCtx = createContext<Ctx|null>(null);

export function AuthProvider({ children }:{children:React.ReactNode}){
  const { state, setState } = useGame();
  const [user, setUser] = useState<User|null>(null);
  const [profile, setProfile] = useState<Profile|null>(null);
  const [currentSlotId, setCurrentSlotId] = useState<1|2|3|4|5|null>(null);

  // boot from session
  useEffect(()=>{
    const s = getSession();
    if (s?.userId){
      const users = getUsers();
      const u = users.find(x => x.id===s.userId) || null;
      setUser(u);
      if (u){
        const p = getProfile(u.id);
        setProfile(p);
        if (s.slotId){
          setCurrentSlotId(s.slotId);
          const slot = p.slots.find(sl => sl.id===s.slotId);
          if (slot?.state) setState(slot.state);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autosave when state changes and we have user+slot
  useEffect(()=>{
    if (!user || !profile || !currentSlotId) return;
    // debounce save by 600ms
    const t = setTimeout(()=>{
      const p2 = upsertSlot(profile, {
        id: currentSlotId,
        name: (profile.slots.find(s=>s.id===currentSlotId)?.name) || state.player?.character?.name || 'Personagem',
        updatedAt: Date.now(),
        state
      });
      setProfile(p2);
    }, 600);
    return ()=> clearTimeout(t);
  }, [state?.updatedAt, user?.id, currentSlotId]); // updatedAt já existe no GameProvider

  async function createUser(username:string, password:string){
    const passHash = await hashPass(username, password);
    const u = upsertUser({ username, passHash } as any);
    setUser(u);
    setProfile(getProfile(u.id));
    saveSession({ userId: u.id });
    return u;
  }
  async function login(username:string, password:string){
    const passHash = await hashPass(username, password);
    const u = getUsers().find(x => x.username===username && x.passHash===passHash) || null;
    if (!u) return false;
    setUser(u);
    setProfile(getProfile(u.id));
    saveSession({ userId: u.id });
    return true;
  }
  function logout(){
    setUser(null); setProfile(null); setCurrentSlotId(null);
    saveSession(null);
  }
  function listSlots(){ return profile?.slots?.slice(0,5).sort((a,b)=>a.id-b.id) || []; }
  function loadSlot(id:1|2|3|4|5){
    if (!profile) return false;
    const sl = profile.slots.find(s => s.id===id);
    if (!sl) return false;
    setState(sl.state);
    setCurrentSlotId(id);
    saveSession({ userId: user!.id, slotId: id });
    return true;
  }
  function saveSlotFn(id:1|2|3|4|5, name?:string){
    if (!user) return false;
    const p = profile || { userId: user.id, slots: [] };
    const p2 = upsertSlot(p, { id, name: name || (state?.player?.character?.name||'Personagem'), updatedAt: Date.now(), state });
    setProfile(p2);
    setCurrentSlotId(id);
    saveSession({ userId: user.id, slotId: id });
    return true;
  }
  function deleteSlot(id:1|2|3|4|5){
    if (!profile) return;
    const p2 = delSlot(profile, id);
    setProfile(p2);
    if (currentSlotId===id){ setCurrentSlotId(null); saveSession({ userId: user!.id }); }
  }
  async function createNewCharacter(name:string, options?:any){
    // estado inicial simples reaproveitando estrutura atual
    const initial = { ...state, player: { ...state.player, character: { ...(state.player.character||{}), name } }, updatedAt: Date.now() };
    setState(initial as any);
    // salvar no primeiro slot vazio
    const taken = new Set((profile?.slots||[]).map(s=>s.id));
    const free = ([1,2,3,4,5] as const).find(id => !taken.has(id));
    if (!free) return { ok:false };
    saveSlotFn(free, name);
    return { ok:true, slotId: free };
  }
  function exportSlot(id:1|2|3|4|5){
    if (!profile) return;
    const sl = profile.slots.find(s=>s.id===id); if (!sl) return;
    const blob = new Blob([JSON.stringify(sl, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `aldor-slot-${id}.json`; a.click();
    URL.revokeObjectURL(url);
  }
  function importSlot(json:any){
    if (!user) return false;
    try {
      const parsed = typeof json==='string' ? JSON.parse(json) : json;
      const slot: SaveSlot = { id: parsed.id, name: parsed.name||'Personagem', updatedAt: Date.now(), state: parsed.state };
      const p = profile || { userId: user.id, slots: [] };
      const p2 = upsertSlot(p, slot);
      setProfile(p2);
      return true;
    } catch { return false; }
  }
  function selectSlot(id:1|2|3|4|5|null){
    setCurrentSlotId(id);
    if (user) saveSession({ userId: user.id, slotId: id||undefined });
  }

  const value: Ctx = { user, profile, currentSlotId,
    createUser, login, logout,
    listSlots, loadSlot: loadSlot, saveSlot: saveSlotFn, deleteSlot,
    createNewCharacter, exportSlot, importSlot, selectSlot
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(){ const ctx = useContext(AuthCtx); if(!ctx) throw new Error('useAuth must be inside AuthProvider'); return ctx; }
