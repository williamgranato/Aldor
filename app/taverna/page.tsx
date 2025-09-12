'use client';
import React, { useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useToasts } from '@/components/ToastProvider';

type CoinPouch = { gold:number; silver:number; bronze:number; copper:number };

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

const ROOMS = [
  { id:'simples', name:'Quarto Simples', price:{silver:1}, desc:'Cama dura e corredor barulhento.', effects:{ stamina:0.5, hp:0 } },
  { id:'superior', name:'Quarto Superior', price:{silver:5}, desc:'Silêncio e conforto moderado.', effects:{ stamina:1.0, hp:0.1 } },
  { id:'luxo', name:'Quarto de Luxo', price:{silver:20}, desc:'Cama macia e refeição incluída.', effects:{ stamina:1.0, hp:1.0, charisma:+2 } },
  { id:'master', name:'Suíte Master', price:{gold:1}, desc:'Serviço real e eventos raros.', effects:{ stamina:1.0, hp:1.0, charisma:+2, luck:+2, rareEvent:true } },
];

export default function Page(){
  const { state, setState, touch } = useGame();
  const { add } = useToasts();
  const pouch = (state.player?.coins||{}) as CoinPouch;
  const [bet, setBet] = useState<number>(10); // cobre

  function canPay(cost:Partial<CoinPouch>){
    return coinsToCopper(pouch) >= coinsToCopper(cost);
  }
  function pay(cost:Partial<CoinPouch>){
    const remain = coinsToCopper(pouch) - coinsToCopper(cost);
    setState((prev:any)=>({ ...prev, player:{ ...prev.player, coins: copperToCoins(remain) }, updatedAt: Date.now() }));
    touch?.();
  }
  function advanceToNextMorning(prev:any){
    const d = new Date(prev.world?.dateMs || Date.now());
    d.setUTCDate(d.getUTCDate()+1);
    d.setUTCHours(6,0,0,0);
    return d.getTime();
  }
  function addStatus(prev:any, st:{id:string; name:string; value?:number; expiresAt:number}){
    const status = Array.isArray(prev.player?.status)? [...prev.player.status] : [];
    status.push(st);
    return status;
  }
  function rest(room:any){
    // 10% de chance de "ocupado" => efeitos reduzidos
    const occupied = Math.random() < 0.1;
    const effective = occupied ? { ...room.effects, stamina: Math.max(0.3, (room.effects.stamina||1)*0.6), hp: (room.effects.hp||0)*0.5 } : room.effects;

    if(!canPay(room.price)){
      add({ type:'error', title:'Sem moedas', message:'Você não tem dinheiro para este quarto.' });
      return;
    }
    setState((prev:any)=>{
      const nextWorld = { ...(prev.world||{}), dateMs: advanceToNextMorning(prev) };
      let stamina = { ...(prev.player?.stamina||{current:100,max:100}) };
      stamina.current = Math.min(stamina.max, Math.floor(stamina.max * (effective.stamina ?? 1)));
      let stats = { ...(prev.player?.stats||{hp:30,maxHp:30}) };
      if(effective.hp){
        const gain = Math.floor(stats.maxHp * (effective.hp));
        stats.hp = Math.min(stats.maxHp, gain>=1 ? stats.maxHp : stats.hp + gain);
      }

      const expiresAt = nextWorld.dateMs + (24*60*60*1000);
      let status = Array.isArray(prev.player?.status)? [...prev.player.status] : [];
      if(effective.charisma){ status.push({ id:'buff_charisma', name:'+Carisma', value:effective.charisma, expiresAt }); }
      if(effective.luck){ status.push({ id:'buff_luck', name:'+Sorte', value:effective.luck, expiresAt }); }

      const remain = coinsToCopper(prev.player?.coins||{}) - coinsToCopper(room.price);
      const coins = copperToCoins(remain);

      const player = { ...prev.player, stamina, stats, coins, status };
      return { ...prev, player, world: nextWorld, updatedAt: Date.now() };
    });
    touch?.();
    if(occupied){
      add({ type:'warning', title:'Quartos cheios', message:'Você conseguiu um canto improvisado. Efeitos reduzidos.' });
    }
    // Eventos aleatórios ricos
    const r = Math.random();
    if(room.effects.rareEvent && r < 0.2){
      add({ type:'info', title:'Evento Raro', message:'Um viajante sussurrou sobre uma missão secreta nas montanhas.' });
    }else if(r < 0.35){
      add({ type:'warning', title:'Ladrão!', message:'Tentaram mexer nos seus pertences, mas você notou a tempo.' });
    }else if(r < 0.5){
      add({ type:'success', title:'Sonho profético', message:'Você acorda com uma certeza: evite o mercado negro amanhã.' });
    }
    add({ type:'success', title:'Bom descanso', message:`Você dormiu no ${room.name}.` });
  }

  function gambleCopper(amount:number){
    if(coinsToCopper(pouch) < amount){
      add({ type:'error', title:'Aposta negada', message:'Moedas insuficientes.' });
      return;
    }
    const win = Math.random() < 0.5;
    setState((prev:any)=>{
      let c = coinsToCopper(prev.player?.coins||{});
      c += win ? amount : -amount;
      return { ...prev, player:{ ...prev.player, coins: copperToCoins(c) }, updatedAt: Date.now() };
    });
    touch?.();
    add({ type: win?'success':'error', title: win?'Vitória!':'Derrota...', message: win? 'Ganhou o dobro da aposta!':'Perdeu sua aposta.' });
  }

  function drink(){
    const cost = 5; // cobre
    if(coinsToCopper(pouch) < cost){
      add({ type:'error', title:'Sem moedas', message:'Você precisa de 5 cobres.' });
      return;
    }
    setState((prev:any)=>{
      let c = coinsToCopper(prev.player?.coins||{});
      c -= cost;
      const expiresAt = (prev.world?.dateMs||Date.now()) + 24*60*60*1000;
      const status = Array.isArray(prev.player?.status)? [...prev.player.status] : [];
      if(Math.random() < 0.7){
        status.push({ id:'buff_coragem', name:'+Coragem', value:1, expiresAt });
        add({ type:'success', title:'Bebida forte', message:'Você se sente corajoso. (+Coragem)' });
      }else{
        status.push({ id:'debuff_bebado', name:'Bêbado', value:-1, expiresAt });
        add({ type:'warning', title:'Bebida traiçoeira', message:'Sua agilidade parece menor... (-AGI)' });
      }
      return { ...prev, player:{ ...prev.player, coins: copperToCoins(c), status }, updatedAt: Date.now() };
    });
    touch?.();
  }

  function rumor(){
    const cost = { silver:1 };
    if(!canPay(cost)){
      add({ type:'error', title:'Sem prata', message:'O taberneiro só fala por 1 prata.' });
      return;
    }
    pay(cost);
    const hints = [
      'Dizem que o mercado negro está mais caro amanhã...',
      'Um mercador feliz dá melhores descontos ao amanhecer.',
      'Há uma joia rara na guilda, mas peça com jeitinho.',
      'Um aventureiro perdeu um anel no campo ao norte.'
    ];
    const msg = hints[Math.floor(Math.random()*hints.length)];
    add({ type:'info', title:'Rumor do dia', message: msg });
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-2xl font-semibold">Taverna do Vento Norte</div>
      <p className="opacity-80">Descanse, jogue, beba e descubra rumores. O tempo avança para 06:00 do próximo dia ao alugar um quarto.</p>

      {/* Quartos */}
      <div>
        <div className="font-semibold mb-2">Quartos</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROOMS.map(r=>(
            <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm opacity-80">{r.desc}</div>
              <div className="mt-2 text-sm">Preço: {r.price.gold? `${r.price.gold} ouro` : r.price.silver? `${r.price.silver} prata` : `${r.price.bronze||0} bronze`} / noite</div>
              <button onClick={()=>rest(r)} className="mt-3 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700">
                Alugar e descansar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mini-jogos */}
      <div>
        <div className="font-semibold mb-2">Salão de Jogos</div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col md:flex-row gap-2 items-center">
          <div>Aposta em cobre:</div>
          <input type="number" min={1} value={bet} onChange={e=>setBet(parseInt(e.target.value)||1)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-28" />
          <button onClick={()=>gambleCopper(bet)} className="px-3 py-2 rounded bg-amber-700 hover:bg-amber-800">Apostar</button>
          <div className="text-xs opacity-70">(50% de chance de dobrar, 50% de perder)</div>
        </div>
      </div>

      {/* Balcão */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="font-semibold">Bebidas</div>
          <div className="text-sm opacity-80">Uma caneca por 5 cobres. Buff de Coragem ou debuff Bêbado por 24h.</div>
          <button onClick={drink} className="mt-2 px-3 py-2 rounded bg-rose-700 hover:bg-rose-800">Beber</button>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="font-semibold">Rumores</div>
          <div className="text-sm opacity-80">Pague 1 prata para ouvir dicas valiosas.</div>
          <button onClick={rumor} className="mt-2 px-3 py-2 rounded bg-emerald-700 hover:bg-emerald-800">Comprar rumor</button>
        </div>
      </div>
    </div>
  );
}
