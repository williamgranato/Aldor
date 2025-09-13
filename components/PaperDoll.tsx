'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Item = { id:string; name:string; type?:string; image?:string; rarity?:string };
type Equipment = {
  cabeca: Item|null;
  peito: Item|null;
  mao_principal: Item|null;
  mao_secundaria: Item|null;
  pernas: Item|null;
  botas: Item|null;
  anel: Item|null;
  amuleto: Item|null;
};

// === Mapear raridade → cor/glow ===
const rarityColors: Record<string, string> = {
  comum: 'border-gray-400 shadow-[0_0_6px_rgba(200,200,200,0.4)]',
  incomum: 'border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
  raro: 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  epico: 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
  lendario: 'border-orange-500 shadow-[0_0_14px_rgba(249,115,22,0.6)]',
  mitico: 'border-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.7)]',
};

function imgOf(item?: Item|null){
  if(item?.image) return item.image.startsWith('/images') ? item.image : `/images/items/${item.image}`;
  return '/images/items/placeholder.png';
}

// === Ícones de slots default ===
const slotBg: Record<string,string> = {
  cabeca: '/images/slots/helmet.png',
  peito: '/images/slots/armor.png',
  mao_principal: '/images/slots/sword.png',
  mao_secundaria: '/images/slots/shield.png',
  pernas: '/images/slots/legs.png',
  botas: '/images/slots/boots.png',
  anel: '/images/slots/ring.png',
  amuleto: '/images/slots/amulet.png',
};

export default function PaperDoll({
  equipment,
  onDropItem,
  onUnequip,
}:{
  equipment: Partial<Equipment>,
  onDropItem?: (slot:keyof Equipment, payload:any)=>void,
  onUnequip?: (slot:keyof Equipment)=>void,
}) {
  const slots = equipment || {} as Equipment;

  const Box = ({slot,label}:{slot:keyof Equipment,label:string})=>{
    const item = (slots as any)[slot] as Item|null;
    const src = imgOf(item);
    const rarityClass = item?.rarity ? rarityColors[item.rarity] : 'border-slate-700';

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e)=>{
      e.preventDefault();
      const text = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
      if(!text) return;
      try{
        const payload = JSON.parse(text);
        onDropItem?.(slot, payload);
      }catch{}
    };
    const allow: React.DragEventHandler<HTMLDivElement> = (e)=>{ e.preventDefault(); };

    return (
      <motion.div
        onDrop={handleDrop}
        onDragOver={allow}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`relative w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden 
          bg-slate-900/30 border ${rarityClass}`}
        title={item?.name || label}
      >
        {/* Glow animado se vazio */}
        {!item && (
          <motion.span
            className="absolute inset-0 bg-amber-400/5 blur-lg"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        )}

        <Image
          src={item ? src : slotBg[slot]}
          alt={label}
          width={64}
          height={64}
          className={`object-contain ${item ? 'opacity-100' : 'opacity-60'}`}
        />

        {item && (
          <button
            onClick={()=> onUnequip?.(slot)}
            className="absolute top-1 right-1 text-[10px] px-1 rounded bg-black/60 hover:bg-black/80"
            aria-label={`Remover ${item.name}`}
          >x</button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-2 rounded-xl border border-slate-800 bg-transparent">
      
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {/* Cabeça + Amuleto */}
        <div></div>
        <Box slot="cabeca" label="Cabeça" />
        <Box slot="amuleto" label="Amuleto" />

        {/* Peito + Mãos */}
        <Box slot="mao_principal" label="Mão (P)" />
        <Box slot="peito" label="Peito" />
        <Box slot="mao_secundaria" label="Mão (S)" />

        {/* Pernas + Anel */}
        <div></div>
        <Box slot="pernas" label="Pernas" />
        <Box slot="anel" label="Anel" />

        {/* Botas */}
        <div></div>
        <Box slot="botas" label="Botas" />
        <div></div>
      </div>
    </div>
  );
}
