'use client';
import Image from 'next/image';
import LoginGateAldor from '@/components/LoginGate_aldor_client';
import { useGame } from '@/context/GameProvider_aldor_client';
import { coinsToCopper, copperToCoins } from '@/utils/money_aldor_client';
import Tip from '@/components/Tooltip';
import { useToasts } from '@/components/ToastProvider';

const ATTRS: Array<{k:'strength'|'agility'|'intelligence'|'vitality'|'luck', label:string}> = [
  {k:'strength', label:'Força'},
  {k:'agility', label:'Agilidade'},
  {k:'intelligence', label:'Inteligência'},
  {k:'vitality', label:'Vitalidade'},
  {k:'luck', label:'Sorte'},
];

function trainingCost(level:number){
  const base = 120; // 1 prata e 20 cobre
  const factor = Math.pow(1.28, Math.max(0, level-1));
  return Math.round(base * factor);
}

export default function TreinoPage(){
  const { state, train } = useGame();
  const { add } = useToasts();
  const lvl = state.player.level;
  const cost = trainingCost(lvl);
  const have = coinsToCopper(state.player.coins);
  const can = have >= cost;
  const c = copperToCoins(cost);

  function doTrain(a:'strength'|'agility'|'intelligence'|'vitality'|'luck', label:string){
    if(!can) return;
    train(a);
    setTimeout(()=>add({
      type:'success',
      title:'Treino',
      message:`Treinou ${label} por ${c.gold} ouro, ${c.silver} prata e ${c.copper} cobre.`
    }), 10);
  }

  return (
    <LoginGateAldor>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Treinamento</h2>
        <p className="text-sm opacity-80 mb-3">
          Pague para treinar um atributo. O custo cresce com o seu nível atual.
        </p>
        <div className="mb-3 text-sm flex items-center gap-3">
          <span>Nível atual: <b>{lvl}</b></span>
          <Tip label="Fórmula: 120 × 1.28^(nível-1) cobre">
            <span className="flex items-center gap-2">
              Custo:
              <span className="flex items-center gap-1" title="Ouro"><Image src="/images/items/gold.png" alt="Ouro" width={14} height={14} />{c.gold}</span>
              <span className="flex items-center gap-1" title="Prata"><Image src="/images/items/silver.png" alt="Prata" width={14} height={14} />{c.silver}</span>
              <span className="flex items-center gap-1" title="Cobre"><Image src="/images/items/copper.png" alt="Cobre" width={14} height={14} />{c.copper}</span>
            </span>
          </Tip>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          {ATTRS.map(a => (
            <button
              key={a.k}
              className={`rounded-lg border px-3 py-2 text-left ${can ? 'button' : 'border-zinc-800 bg-zinc-900/40 opacity-60 cursor-not-allowed'}`}
              disabled={!can}
              onClick={() => doTrain(a.k, a.label)}
            >
              <div className="font-medium">{a.label}</div>
              <div className="text-xs opacity-70">+1 {a.label}</div>
            </button>
          ))}
        </div>

        {!can && (<div className="mt-3 text-xs opacity-70">Você não tem moedas suficientes.</div>)}
      </div>
    </LoginGateAldor>
  );
}
