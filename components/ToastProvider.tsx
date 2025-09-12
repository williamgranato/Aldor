'use client';
import React, { createContext, useContext, useState } from 'react';

type Toast = { id:number; title?:string; message:string; type:'success'|'error'|'warning'|'info'; ttl?:number };

const ToastContext = createContext<{ add:(t:Omit<Toast,'id'>)=>void }|null>(null);

export function ToastProvider({children}:{children:React.ReactNode}){
  const [toasts,setToasts] = useState<Toast[]>([]);
  function add(t:Omit<Toast,'id'>){
    const id = Date.now();
    const toast:Toast = {id,...t};
    setToasts(prev=>[...prev,toast]);
    setTimeout(()=>setToasts(prev=>prev.filter(x=>x.id!==id)), t.ttl||3000);
  }
  return (
    <ToastContext.Provider value={{add}}>
      {children}
      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center gap-2 mb-4 z-50">
        {toasts.map(t=>(
          <div key={t.id} className={`px-4 py-2 rounded shadow-md text-white max-w-sm w-full text-center ${t.type==='success'?'bg-green-600':t.type==='error'?'bg-red-600':t.type==='warning'?'bg-yellow-600':'bg-blue-600'}`}>
            {t.title? <div className="font-bold">{t.title}</div>:null}
            <div>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToasts(){
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToasts must be used inside <ToastProvider/>');
  return ctx;
}
