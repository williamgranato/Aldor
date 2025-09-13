
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Pickaxe, Hourglass, CircleStop, Flame } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { GATHER_NODES, GatherNode } from '@/data/gather_nodes';
import { ITEMS } from '@/data/items_catalog';

type LoopState = { running: boolean; nodeId?: string; nextAt?: number };

function formatSec(s: number){ return s.toFixed(0)+'s'; }

function rollYield(node: GatherNode){
  const drops:{id:string; name:string; image?:string; qty:number}[] = [];
  for(const y of node.yields){
    const r = Math.random();
    if((y.chance ?? 1) >= r){
      const qty = y.min + Math.floor(Math.random()*(y.max - y.min + 1));
      const def = ITEMS[y.itemId];
      drops.push({ id: y.itemId, name: def?.name ?? y.itemId, image: def?.image, qty });
    }
  }
  return drops;
}

export default function ColetaPage(){
  const game = useGame() as any;
  const [loop, setLoop] = useState<LoopState>({ running:false });
  const [toast, setToast] = useState<string|null>(null);
  const timerRef = useRef<NodeJS.Timeout|null>(null);

  const forest = useMemo(()=>GATHER_NODES.filter(n=>n.source==='forest'),[]);
  const mines = useMemo(()=>GATHER_NODES.filter(n=>n.source==='mine'),[]);
  const playerLevel = (game?.state?.player?.level ?? 1);

  function start(node: GatherNode){
    if(loop.running && loop.nodeId === node.id){ return; }
    if(playerLevel < node.minLevel){
      setToast(`Nível ${node.minLevel}+ necessário.`);
      return;
    }
    if(game?.spendStamina && game.state?.player?.stamina < node.staminaCost){
      setToast('Stamina insuficiente.');
      return;
    }
    setLoop({ running:true, nodeId: node.id, nextAt: Date.now() + node.timeSec*1000 });
  }

  function stop(){
    setLoop({ running:false });
    if(timerRef.current){ clearTimeout(timerRef.current); timerRef.current=null; }
  }

  useEffect(()=>{
    if(!loop.running){ return; }
    const node = GATHER_NODES.find(n=>n.id===loop.nodeId)!;
    const now = Date.now();
    const delay = Math.max(0, (loop.nextAt ?? now) - now);
    timerRef.current = setTimeout(()=>{
      // spend stamina
      if(game?.spendStamina){
        const ok = game.spendStamina(node.staminaCost);
        if(!ok){
          setToast('Sem stamina suficiente para continuar.');
          stop();
          return;
        }
      }
      // give items
      const drops = rollYield(node);
      if(game?.addLootToInventory && drops.length){
        game.addLootToInventory(drops);
      }
      // toast
      if(drops.length){
        const line = drops.map(d=>`${d.qty}x ${d.name}`).join(', ');
        setToast(`Coleta: ${line}`);
        // history of today
        try{
          const key = `gather_history_${new Date().toISOString().slice(0,10)}`;
          const hist = JSON.parse(localStorage.getItem(key) || '{}');
          for(const d of drops){
            hist[d.id] = (hist[d.id]||0) + d.qty;
          }
          localStorage.setItem(key, JSON.stringify(hist));
        }catch{}
      }
      // schedule next tick
      setLoop({ running:true, nodeId: node.id, nextAt: Date.now() + node.timeSec*1000 });
    }, delay);
    return ()=>{ if(timerRef.current) clearTimeout(timerRef.current as any); };
  }, [loop]);

  function NodeCard({n}:{n:GatherNode}){
    const unlocked = playerLevel >= n.minLevel;
    const runningThis = loop.running && loop.nodeId===n.id;
    return (
      <motion.div
        layout
        className={`rounded-2xl p-4 border bg-white/5 backdrop-blur-sm ${unlocked?'border-white/10':'border-red-500/30 opacity-60'}`}
        whileHover={{ scale: unlocked?1.01:1 }}
      >
        <div className="flex items-center gap-4">
          <img src={n.image} alt={n.name} className="w-16 h-16 rounded-lg object-contain bg-black/20 p-2"/>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-lg font-semibold">
              {n.source==='forest'?<Leaf className="w-5 h-5"/>:<Pickaxe className="w-5 h-5"/>}
              <span>{n.name}</span>
            </div>
            <p className="text-sm text-zinc-300">{n.description}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-300">
              <span className="inline-flex items-center gap-1"><Hourglass className="w-4 h-4"/>{formatSec(n.timeSec)}</span>
              <span className="inline-flex items-center gap-1"><Flame className="w-4 h-4"/>-{n.staminaCost} stamina</span>
              <span>Nível ≥ {n.minLevel}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {!runningThis ? (
              <button onClick={()=>unlocked && start(n)} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white">
                Iniciar coleta
              </button>
            ) : (
              <button onClick={stop} className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition text-white inline-flex items-center gap-1">
                <CircleStop className="w-4 h-4"/> Parar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-bold">Coleta</h1>
        <p className="text-zinc-300">Corte árvores, desça às minas e troque suor por matéria-prima. A natureza de Aldor é generosa com aventureiros persistentes.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Leaf className="w-5 h-5"/> Floresta</h2>
        <div className="grid gap-3">
          {forest.map(n=><NodeCard key={n.id} n={n}/>)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Pickaxe className="w-5 h-5"/> Minas</h2>
        <div className="grid gap-3">
          {mines.map(n=><NodeCard key={n.id} n={n}/>)}
        </div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-lg border border-white/10 shadow-lg"
            onAnimationComplete={()=>{ setTimeout(()=>setToast(null), 1600); }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
