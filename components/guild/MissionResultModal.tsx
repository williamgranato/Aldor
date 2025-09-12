'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function MissionResultModal({ open, success, onClose, xp=0, copper=0, title }:{ open:boolean; success:boolean; onClose:()=>void; xp?:number; copper?:number; title?:string; }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className={"relative w-[min(520px,92vw)] rounded-2xl p-5 shadow-xl border " + (success?'bg-emerald-950/80 border-emerald-800/50':'bg-rose-950/80 border-rose-800/50')}>
        <div className="flex items-center gap-2 mb-2">
          {success? <CheckCircle2 className="w-6 h-6 text-emerald-400"/> : <XCircle className="w-6 h-6 text-rose-400"/>}
          <div className="text-lg font-semibold">{title || (success?'Missão concluída!':'Missão falhou')}</div>
        </div>
        <div className="text-sm opacity-80">
          {xp? <div>XP: <span className="text-amber-200">{xp}</span></div> : null}
          {copper? <div>Cobre: <span className="text-amber-200">{copper}</span></div> : null}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700">Fechar</button>
        </div>
      </motion.div>
    </div>
  );
}
