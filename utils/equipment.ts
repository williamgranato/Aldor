export type EquipSlots = 'weapon'|'armor'|'trinket';
export type EquipMap = Partial<Record<EquipSlots, any>>;

export function equipItem(state:any, itemId:string){
  const inv = [...state.player.inventory];
  const idx = inv.findIndex((x:any)=>x.id===itemId && (x.qty??1)>0);
  if(idx<0) return state;
  const it = inv[idx];
  // infer slot by type
  const slot = it.type==='weapon' ? 'weapon' : it.type==='armor' ? 'armor' : it.type==='trinket' ? 'trinket' : null;
  if(!slot) return state;
  const eq = { ...(state.player as any).equipment || {} };
  const prev = eq[slot];
  eq[slot] = it;
  // decrease qty of new item
  inv[idx].qty = (inv[idx].qty??1) - 1; if(inv[idx].qty<=0) inv.splice(idx,1);
  // return previous to inventory
  if(prev){ inv.push({ ...prev, qty: (prev.qty??0)+1 }); }
  return { ...state, player:{ ...state.player, inventory: inv, equipment: eq }, updatedAt: Date.now() };
}

export function unequip(state:any, slot:'weapon'|'armor'|'trinket'){
  const eq = { ...(state.player as any).equipment || {} };
  const it = eq[slot];
  if(!it) return state;
  delete eq[slot];
  const inv = [...state.player.inventory, { ...it, qty: (it.qty??0)+1 }];
  return { ...state, player:{ ...state.player, equipment: eq, inventory: inv }, updatedAt: Date.now() };
}
