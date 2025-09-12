'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useToasts } from '@/components/ToastProvider';
import * as Catalog from '@/data/items_catalog';

type CoinPouch = { gold:number; silver:number; bronze:number; copper:number };
type RarityPt = 'comum'|'incomum'|'raro'|'épico'|'lendário';

type MarketEntry = {
  id: string;
  name: string;
  rarity: RarityPt;
  type?: string;
  slot?: string;
  image?: string;
  reqLevel?: number;
  priceCopper: number;
  stock: number;
  isFlash?: boolean;
  isSecret?: boolean;
  requiredRep?: number;
};

function coinsToCopper(p: Partial<CoinPouch>): number {
  const g = Math.max(0, Math.floor(Number(p.gold||0)));
  const s = Math.max(0, Math.floor(Number(p.silver||0)));
  const b = Math.max(0, Math.floor(Number(p.bronze||0)));
  const c = Math.max(0, Math.floor(Number(p.copper||0)));
  return g*10000 + s*100 + b*10 + c;
}
function copperToCoins(c:number): CoinPouch {
  c = Math.max(0, Math.floor(c));
  const gold = Math.floor(c/10000); c -= gold*10000;
  const silver = Math.floor(c/100); c -= silver*100;
  const bronze = Math.floor(c/10); c -= bronze*10;
  const copper = c;
  return { gold, silver, bronze, copper };
}

function seedFromDateMs(ms:number){
  const d = new Date(ms||Date.now());
  const yyyy = String(d.getUTCFullYear());
  const mm = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  return `${yyyy}${mm}${dd}`;
}
function mulberry32(a:number){ return function(){ var t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; } }

function rarityFactor(r:RarityPt){
  switch(r){
    case 'comum': return 1;
    case 'incomum': return 1.5;
    case 'raro': return 2.25;
    case 'épico': return 3.5;
    case 'lendário': return 6;
    default: return 1;
  }
}

function basePriceCopper(item:any){
  const v = Number((item as any).valueCopper ?? 0);
  if (v > 0) return Math.max(1, Math.floor(v));
  const lvl = Number(item.reqLevel||1);
  const rf = rarityFactor((item.rarity||'comum') as RarityPt);
  const typeMul = (item.type==='arma'||item.type==='armadura') ? 120 : (item.type==='poção'? 25 : 60);
  return Math.max(3, Math.floor((10 + lvl*lvl) * rf * typeMul));
}

function resolveImage(item:any){
  const tryImg = (p?:string)=> p ? `/images/items/${p}` : '';
  if(item.image) return tryImg(item.image);
  if(item.icon) return tryImg(item.icon);
  return '/images/items/placeholder.png';
}

function colorByRarity(r:RarityPt){
  switch(r){
    case 'comum': return 'border-zinc-500';
    case 'incomum': return 'border-emerald-500';
    case 'raro': return 'border-sky-500';
    case 'épico': return 'border-purple-500';
    case 'lendário': return 'border-orange-500';
    default: return 'border-zinc-600';
  }
}

export default function Page(){
  const { state, setState, touch } = useGame();
  const { add } = useToasts();
  const worldMs = state?.world?.dateMs || Date.now();
  const seed = seedFromDateMs(worldMs);
  const slotId = (state as any)?.slotId ?? 's0';
  const storageKey = useMemo(()=> `aldor_market_${slotId}_${seed}`, [slotId, seed]);
  const repKey = useMemo(()=> `aldor_market_rep_${slotId}`, [slotId]);
  const haggleKey = useMemo(()=> `aldor_market_haggled_${slotId}_${seed}`, [slotId, seed]);
  const revealKey = useMemo(()=> `aldor_market_secret_${slotId}_${seed}`, [slotId, seed]);
  const logKey = useMemo(()=> `aldor_market_log_${slotId}`, [slotId]);

  const items = useDailyItems(seed, state?.player?.level||1);
  const [stock, setStock] = usePersistentStock(storageKey, items);
  const [reputation, setReputation] = usePersistentReputation(repKey);
  const [haggled, setHaggled] = useHaggled(haggleKey);
  const [secretRevealed, setSecretRevealed] = useRevealed(revealKey);
  const [logs, setLogs] = useLogs(logKey);

  // merchant mood: -0.1, 0, +0.1
  const mood = useMemo(()=>{
    const r = mulberry32(Number(seed.slice(-8)) || 0)();
    return r < 0.33 ? -0.1 : r > 0.66 ? 0.1 : 0;
  }, [seed]);

  // UI controls
  const [tab, setTab] = useState<'normal'|'negro'>('normal');
  const [filter, setFilter] = useState<'todos'|'armas'|'armaduras'|'consumiveis'>('todos');
  const [sort, setSort] = useState<'preco'|'nivel'|'raridade'>('preco');

  const equipped = (state?.player as any)?.equipment || {};

  function persistStock(next: Record<string,number>){
    try{ localStorage.setItem(storageKey, JSON.stringify(next)); }catch{}
  }
  function pushLog(entry:any){
    setLogs(prev=>{
      const next = [ { ts: Date.now(), ...entry }, ...prev ].slice(0,10);
      try{ localStorage.setItem(logKey, JSON.stringify(next)); }catch{}
      return next;
    });
  }

  function canAfford(costCopper:number){
    const pouch = (state?.player?.coins||{}) as CoinPouch;
    return coinsToCopper(pouch) >= costCopper;
  }

  function applyRepDiscount(price:number){
    let pct = 0;
    if(reputation >= 80) pct = 0.15;
    else if(reputation >= 60) pct = 0.10;
    else if(reputation >= 40) pct = 0.07;
    else if(reputation >= 20) pct = 0.05;
    let p = Math.floor(price * (1 - pct));
    if(mood !== 0){ p = Math.floor(p * (1 + mood)); }
    return Math.max(1, p);
  }

  function visible(items:MarketEntry[]){
    return items.filter(it=>{
      if(it.requiredRep && reputation < it.requiredRep) return false;
      if(filter==='armas' && it.type!=='arma') return false;
      if(filter==='armaduras' && it.type!=='armadura') return false;
      if(filter==='consumiveis' && it.type!=='comida' && it.type!=='poção') return false;
      return true;
    });
  }
  function sortList(list:MarketEntry[]){
    const rank = (r:RarityPt)=> ({'comum':1,'incomum':2,'raro':3,'épico':4,'lendário':5}[r]||0);
    const arr = [...list];
    if(sort==='preco') arr.sort((a,b)=>a.priceCopper-b.priceCopper);
    if(sort==='nivel') arr.sort((a,b)=>(a.reqLevel||1)-(b.reqLevel||1));
    if(sort==='raridade') arr.sort((a,b)=>rank(a.rarity)-rank(b.rarity));
    return arr;
  }

  function buy(entry: MarketEntry){
    if(stock[entry.id] <= 0) return;
    let cost = entry.priceCopper;
    cost = applyRepDiscount(cost);
    if(entry.isFlash) cost = Math.floor(cost * 0.85);
    if(tab==='negro') cost = Math.floor(cost * 1.5);
    if(!canAfford(cost)) return;

    setState((prev:any)=>{
      const pouch = (prev.player?.coins||{gold:0,silver:0,bronze:0,copper:0}) as CoinPouch;
      const newCopper = coinsToCopper(pouch) - cost;
      const newCoins = copperToCoins(newCopper);
      const inv = Array.isArray(prev.player?.inventory) ? [...prev.player.inventory] : [];
      inv.push({
        id: entry.id,
        name: entry.name,
        rarity: entry.rarity,
        image: entry.image,
        valueCopper: entry.priceCopper,
        type: entry.type,
        slot: entry.slot,
        qty: 1,
      });
      return { ...prev, player: { ...prev.player, coins: newCoins, inventory: inv }, updatedAt: Date.now() };
    });
    touch?.();
    setStock((prev:any)=> {
      const next = { ...prev, [entry.id]: Math.max(0, (prev[entry.id]||0) - 1) };
      persistStock(next);
      return next;
    });
    setReputation(reputation+1);
    const icon = resolveImage(entry);
    add({ type:'success', title:'Compra realizada', message:`Você comprou ${entry.name}.`, icon, ttl:3000 });
    pushLog({ type:'buy', item:entry.name, price:cost });
    if(tab==='negro' && Math.random() < 0.2){
      add({ type:'warning', title:'Olhares suspeitos', message:'Você sente que foi observado após essa compra...' });
    }
  }

  function haggle(entry: MarketEntry){
    if(stock[entry.id] <= 0) return;
    if(haggled[entry.id]) return; // apenas uma tentativa por item
    const car = (state?.player?.attributes?.charisma || (state?.player as any)?.attributes?.CARISMA || 0);
    const luck = (state?.player?.attributes?.luck || (state?.player as any)?.attributes?.SORTE || 0);
    const baseChance = 0.2 + car*0.005 + luck*0.003;
    const rng = mulberry32(Number(seed.slice(-8))+entry.id.length)();
    const success = rng < Math.min(0.6, baseChance);
    const delta = success ? -(0.05 + rng*0.05) : 0.05;
    entry.priceCopper = Math.max(1, Math.floor(entry.priceCopper * (1+delta)));
    setHaggled(prev=>{
      const next = { ...prev, [entry.id]: true };
      try{ localStorage.setItem(haggleKey, JSON.stringify(next)); }catch{}
      return next;
    });
    setStock((prev:any)=> { const next = {...prev}; persistStock(next); return next; });
    if(success){
      add({ type:'success', title:'Pechincha bem-sucedida', message:`Preço de ${entry.name} reduziu!`, icon: resolveImage(entry), ttl:3000 });
      pushLog({ type:'haggle', item:entry.name, result:'success' });
    }else{
      add({ type:'warning', title:'Pechincha falhou', message:`O mercador elevou o preço de ${entry.name}.`, icon: resolveImage(entry), ttl:3000 });
      pushLog({ type:'haggle', item:entry.name, result:'fail' });
    }
  }

  function revealSecret(costCopper:number){
    const pouch = (state?.player?.coins||{}) as CoinPouch;
    if(coinsToCopper(pouch) < costCopper){
      add({ type:'error', title:'Sem moedas', message:'Moedas insuficientes para revelar.' });
      return false;
    }
    setState((prev:any)=>{
      const remain = coinsToCopper(prev.player?.coins||{}) - costCopper;
      return { ...prev, player:{ ...prev.player, coins: copperToCoins(remain) }, updatedAt: Date.now() };
    });
    touch?.();
    setSecretRevealed(true);
    add({ type:'info', title:'Oferta revelada', message:'O mercador mostra um item raro sob o balcão...' });
    return true;
  }

  // Build lists for current tab
  const charisma = (state?.player as any)?.attributes?.charisma || 0;
  const canAutoReveal = charisma >= 10 || secretRevealed;

  const listBase = useMemo(()=>{
    const repGates = [ {thr:80},{thr:60},{thr:40},{thr:20} ];
    const list = items.map((it, idx)=>{
      const gated = idx % 7 === 0 ? (repGates[Math.floor(idx/7)%repGates.length]?.thr) : undefined;
      return { ...it, requiredRep: gated };
    });
    return list;
  }, [items]);

  const secretId = useMemo(()=>{
    if(listBase.length===0) return null;
    return listBase[ listBase.length-1 ]?.id || null;
  }, [listBase]);

  const withSecret = useMemo(()=>{
    return listBase.map(it=>{
      if(it.id===secretId){
        return { ...it, isSecret: !canAutoReveal };
      }
      return it;
    });
  }, [listBase, secretId, canAutoReveal]);

  const normalList = sortList( visible( withSecret.filter(i=>!i.isSecret || canAutoReveal) ) );
  const blackList = sortList( visible( withSecret.filter(i=> (i.rarity==='épico'||i.rarity==='lendário') ).map(x=>({...x, priceCopper: Math.floor(x.priceCopper*1.5)})) ) );

  const display = tab==='normal' ? normalList : blackList;

  return (
    <div className="p-3 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Mercado</div>
        <div className="opacity-80 text-sm">Reputação: <b>{reputation}</b> · seed <b>{seed}</b> · Humor: <b>{mood<0? 'Irritado (-10%)' : mood>0? 'Feliz (-10% preços)': 'Neutro'}</b></div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="inline-flex rounded-lg overflow-hidden border border-zinc-700">
          <button onClick={()=>setTab('normal')} className={`px-3 py-1 ${tab==='normal'?'bg-zinc-700':''}`}>Loja</button>
          <button onClick={()=>setTab('negro')} className={`px-3 py-1 ${tab==='negro'?'bg-zinc-700':''}`}>Mercado Negro</button>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1">
          <option value="todos">Todos</option>
          <option value="armas">Armas</option>
          <option value="armaduras">Armaduras</option>
          <option value="consumiveis">Consumíveis</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1">
          <option value="preco">Ordenar: Preço</option>
          <option value="nivel">Ordenar: Nível</option>
          <option value="raridade">Ordenar: Raridade</option>
        </select>
        {(!canAutoReveal && tab==='normal') && (
          <button onClick={()=>revealSecret(100)} className="ml-2 px-3 py-1 rounded bg-amber-700 hover:bg-amber-800">
            Revelar oferta secreta (1 prata)
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {display.map(it=>{
          const left = stock[it.id] ?? 0;
          let finalPrice = applyRepDiscount(it.priceCopper);
          if(it.isFlash) finalPrice = Math.floor(finalPrice * 0.85);
          if(tab==='negro') finalPrice = Math.floor(finalPrice * 1.5);
          const hagDisabled = !!haggled[it.id];
          const img = resolveImage(it);

          // Comparison with equipped (simple: atk/def delta if same slot)
          const eq = (it.slot && (equipped as any)[it.slot]) || null;
          const deltaAtk = typeof (it as any).atk === 'number' && eq ? ((it as any).atk - (eq as any).atk||0) : 0;
          const deltaDef = typeof (it as any).def === 'number' && eq ? ((it as any).def - (eq as any).def||0) : 0;

          // Tooltip text
          const tip = [
            `${it.name} [${it.rarity}]`,
            it.type? `Tipo: ${it.type}`: null,
            it.slot? `Slot: ${it.slot}`: null,
            it.reqLevel? `Nível: ${it.reqLevel}`: null,
            (it as any).atk? `ATQ: ${(it as any).atk}`: null,
            (it as any).def? `DEF: ${(it as any).def}`: null,
            `Preço base: ${finalPrice}c`
          ].filter(Boolean).join(' \n');

          return (
            <div key={it.id} className={`rounded-xl border p-3 bg-zinc-900/40 ${colorByRarity(it.rarity)}`}>
              <div className="flex items-center gap-3" title={tip}>
                <img src={img} alt={it.name} className="w-12 h-12 object-contain rounded-lg border border-white/10 bg-black/20" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.isSecret && !canAutoReveal ? '??? (secreto)' : it.name} {it.isFlash && <span className="text-red-500">🔥</span>}</div>
                  <div className="text-xs opacity-70 capitalize">{it.rarity}{it.requiredRep? ` · Rep ${it.requiredRep}+`:''}</div>
                </div>
              </div>

              {eq ? (
                <div className="mt-2 text-xs">
                  {deltaAtk ? <div>ATQ: <span className={deltaAtk>=0?'text-emerald-400':'text-red-400'}>{deltaAtk>=0?'+':''}{deltaAtk}</span></div>:null}
                  {deltaDef ? <div>DEF: <span className={deltaDef>=0?'text-emerald-400':'text-red-400'}>{deltaDef>=0?'+':''}{deltaDef}</span></div>:null}
                </div>
              ) : null}

              <div className="mt-2 text-sm">
                <Price copper={finalPrice} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs opacity-80">
                <span>Estoque: <b>{left}</b></span>
                <span>Nível: <b>{it.reqLevel||1}</b></span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={()=>buy(it)}
                  disabled={left<=0 || !canAfford(finalPrice) || (it.isSecret && !canAutoReveal)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                    ${left<=0 || !canAfford(finalPrice) || (it.isSecret && !canAutoReveal) ? 'bg-zinc-800 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {left<=0 ? 'Esgotado' : (it.isSecret && !canAutoReveal) ? 'Secreto' : 'Comprar'}
                </button>
                <button
                  onClick={()=>haggle(it)}
                  disabled={left<=0 || hagDisabled || (it.isSecret && !canAutoReveal)}
                  className={`px-2 py-2 rounded-lg text-sm ${left<=0 || hagDisabled || (it.isSecret && !canAutoReveal)? 'bg-zinc-800 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                  Pechinchar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Histórico */}
      <div className="mt-4 text-sm">
        <div className="font-semibold mb-1">Histórico</div>
        <div className="space-y-1">
          {logs.length===0? <div className="opacity-60">Sem transações ainda.</div> : logs.map((l,i)=>(
            <div key={i} className="opacity-80">{new Date(l.ts).toLocaleTimeString()} — {l.type==='buy'?'Compra':'Pechincha'}: {l.item} {l.price? `por ${l.price}c`: l.result? `(${l.result})`: ''}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Price({ copper }:{ copper:number }){
  const coins = copperToCoins(copper);
  return (
    <div className="flex items-center gap-2">
      {coins.gold>0 && <Coin t="gold" n={coins.gold} />}
      {(coins.gold>0 || coins.silver>0) && <Coin t="silver" n={coins.silver} />}
      {(coins.gold>0 || coins.silver>0 || coins.bronze>0) && <Coin t="bronze" n={coins.bronze} />}
      <Coin t="copper" n={coins.copper} />
    </div>
  );
}
function Coin({t,n}:{t:'gold'|'silver'|'bronze'|'copper'; n:number}){
  return (
    <span className="inline-flex items-center gap-1">
      <img src={`/images/items/${t}.png`} alt={t} className="w-4 h-4 object-contain" />
      <span>{n}</span>
    </span>
  );
}

function useDailyItems(seedStr:string, playerLevel:number){
  return useMemo(()=>{
    const rng = mulberry32(Number(seedStr.slice(-8)) || 12345678);
    const all = (Catalog as any).ITEMS ?? (Array.isArray((Catalog as any).default) ? (Catalog as any).default : []);
    const pool = (Array.isArray(all)? all : []).filter((it:any)=> !!it && typeof it==='object');

    // Shuffle-lite
    const shuffle = [...pool];
    for(let i=shuffle.length-1;i>0;i--){
      const j = Math.floor(rng()* (i+1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }
    const take = shuffle.slice(0, Math.min(28, shuffle.length));

    // sorteia 3 ofertas-relâmpago
    const flashIdx = new Set<number>();
    while(flashIdx.size<Math.min(3,take.length)){
      flashIdx.add(Math.floor(rng()*take.length));
    }

    const list: MarketEntry[] = take.map((it:any,idx:number)=>{
      const price = basePriceCopper(it);
      const stock = Math.max(1, (it.rarity==='lendário'? 1 : it.rarity==='épico'? 1+Math.floor(rng()*1) : 1+Math.floor(rng()*3)));
      return {
        id: it.id || it.name,
        name: it.name || String(it.id),
        rarity: (it.rarity||'comum') as RarityPt,
        type: it.type,
        slot: it.slot,
        image: it.image,
        reqLevel: it.reqLevel || 1,
        priceCopper: Math.max(1, Math.floor(price * (1 + Math.max(0, playerLevel-1)*0.02))),
        stock,
        isFlash: flashIdx.has(idx)
      };
    });
    return list;
  }, [seedStr, playerLevel]);
}

function usePersistentStock(key:string, items:MarketEntry[]){
  const [stock, setStock] = useState<Record<string,number>>({});

  useEffect(()=>{
    const base: Record<string, number> = {};
    for(const it of items){
      const id = it.id || it.name;
      base[id] = typeof it.stock === 'number' ? Math.max(0, Math.floor(it.stock)) : 0;
    }
    let saved: Record<string, number> | null = null;
    try{ const raw = localStorage.getItem(key); if(raw){ saved = JSON.parse(raw); } }catch{}
    const merged: Record<string, number> = {};
    for(const id of Object.keys(base)){
      merged[id] = saved && typeof saved[id]==='number' ? saved[id] : base[id];
    }
    setStock(merged);
    try{ localStorage.setItem(key, JSON.stringify(merged)); }catch{}
  }, [key, JSON.stringify(items.map(i=>({id:i.id, stock:i.stock}))) ]);

  useEffect(()=>{
    try{ localStorage.setItem(key, JSON.stringify(stock)); }catch{}
  }, [key, stock]);

  return [stock, setStock] as const;
}

function usePersistentReputation(key:string){
  const [rep, setRep] = useState<number>(0);
  useEffect(()=>{
    try{ const raw = localStorage.getItem(key); if(raw) setRep(parseInt(raw)||0);}catch{}
  }, [key]);
  useEffect(()=>{
    try{ localStorage.setItem(key, String(rep)); }catch{}
  }, [key, rep]);
  return [rep, setRep] as const;
}

function useHaggled(key:string){
  const [map,setMap] = useState<Record<string, boolean>>({});
  useEffect(()=>{ try{ const raw = localStorage.getItem(key); if(raw){ setMap(JSON.parse(raw)||{}); } }catch{} }, [key]);
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(map)); }catch{} }, [key, map]);
  return [map, setMap] as const;
}

function useRevealed(key:string){
  const [val, setVal] = useState<boolean>(false);
  useEffect(()=>{ try{ const raw = localStorage.getItem(key); if(raw){ setVal(JSON.parse(raw)); } }catch{} }, [key]);
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(val)); }catch{} }, [key, val]);
  return [val, setVal] as const;
}

function useLogs(key:string){
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(()=>{ try{ const raw = localStorage.getItem(key); if(raw){ setLogs(JSON.parse(raw)||[]); } }catch{} }, [key]);
  return [logs, setLogs] as const;
}
