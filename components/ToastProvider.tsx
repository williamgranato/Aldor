'use client';
import React, {createContext, useContext, useState, useCallback} from 'react';

export type Toast = { id:string; title?:string; message:string; type?:'success'|'info'|'warning'|'error'; ttl?:number };

const ToastContext = createContext<{ add:(t:Omit<Toast,'id'>)=>void } | null>(null);

export function ToastProvider({children}:{children:React.ReactNode}){
  const [toasts,setToasts] = useState<Toast[]>([]);

  const add = useCallback((t:Omit<Toast,'id'>)=>{
    const id = Math.random().toString(36).slice(2);
    const ttl = t.ttl ?? 3200;
    setToasts(prev=>[...prev, {id, ...t}]);
    setTimeout(()=> setToasts(prev=>prev.filter(x=>x.id!==id)), ttl);
  },[]);

  return (
    <ToastContext.Provider value={{add}}>
      {children}
      <div className="pointer-events-none fixed top-3 right-3 z-50 space-y-2">
        {toasts.map(t=>(
          <div key={t.id} className={`pointer-events-auto min-w-[220px] max-w-[340px] rounded-lg border px-3 py-2 shadow-lg bg-zinc-900/90 backdrop-blur-md
          ${t.type==='success'?'border-emerald-500/50':
            t.type==='warning'?'border-amber-500/50':
            t.type==='error'?'border-rose-500/50':'border-zinc-700'}`}>
            {t.title && <div className="text-sm font-semibold mb-0.5">{t.title}</div>}
            <div className="text-sm opacity-90">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToasts(){
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToasts must be used within <ToastProvider/>');
  return ctx;
}
