'use client';
import React from 'react';
import Image from 'next/image';

type Item = { id:string; name:string; type?:string; image?:string };
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

function resolvePlaceholder(item?: Item|null){
  const t = item?.type;
  if(t==='arma' || t==='weapon') return '/images/sword.png';
  if(t==='armadura' || t==='armor') return '/images/armor_leather.png';
  if(t==='comida' || t==='food') return '/images/food.png';
  return '/images/items/placeholder.png';
}

function imgOf(item?: Item|null){
  if(item?.image) return item.image.startsWith('/images') ? item.image : `/images/items/${item.image}`;
  return resolvePlaceholder(item);
}

export default function PaperDoll({
  equipment,
  size=128,
  onDropItem,
  onUnequip,
}:{
  equipment: Partial<Equipment>,
  size?: number,
  onDropItem?: (slot:keyof Equipment, payload:any)=>void,
  onUnequip?: (slot:keyof Equipment)=>void,
}){
  const slots = equipment || {} as Equipment;

  const Box = ({slot,label}:{slot:keyof Equipment,label:string})=>{
    const item = (slots as any)[slot] as Item|null;
    const src = imgOf(item);
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
      <div
        onDrop={handleDrop}
        onDragOver={allow}
        className="relative w-20 h-20 border border-slate-700 rounded-lg bg-slate-900/50 flex items-center justify-center overflow-hidden"
        title={item?.name || label}
      >
        <Image src={src} alt={label} width={64} height={64} className="object-contain opacity-90" />
        {item && (
          <button
            onClick={()=> onUnequip?.(slot)}
            className="absolute top-1 right-1 text-[10px] px-1 rounded bg-black/60 hover:bg-black/80"
            aria-label={`Remover ${item.name}`}
          >x</button>
        )}
        {!item && <span className="text-[10px] absolute bottom-1 opacity-60">{label}</span>}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
      <Box slot="cabeca" label="Cabeça" />
      <Box slot="peito" label="Peito" />
      <Box slot="mao_principal" label="Mão (P)" />
      <Box slot="mao_secundaria" label="Mão (S)" />
      <Box slot="pernas" label="Pernas" />
      <Box slot="botas" label="Botas" />
      <Box slot="anel" label="Anel" />
      <Box slot="amuleto" label="Amuleto" />
    </div>
  );
}
