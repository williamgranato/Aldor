'use client';
import React from 'react';
import { Coins, Sword, ShoppingCart, Star, Shield } from 'lucide-react';

const iconMap:any = {
  coins: Coins,
  loot: Sword,
  shop: ShoppingCart,
  xp: Star,
  guild: Shield,
};

export default function ActivityLog({logs}:{logs:any[]}){
  if(!Array.isArray(logs)||logs.length===0) return <div className="text-sm text-neutral-400">Sem atividades recentes.</div>;
  return (
    <div className="space-y-3">
      {logs.slice(-10).reverse().map((log:any,idx:number)=>{
        const Icon = iconMap[log.type]||Star;
        return (
          <div key={idx} className="flex items-start gap-2">
            <div className="p-1 rounded-full bg-neutral-800"><Icon className="w-4 h-4 text-amber-400"/></div>
            <div className="text-sm">
              <div>{log.msg||log.type}</div>
              <div className="text-xs text-neutral-400">{new Date(log.at||Date.now()).toLocaleString()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
