'use client';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useToasts } from '@/components/ToastProvider';

export default function PracaPage(){
  const { state, setState, giveCoins, takeCoins } = useGame();
  const { add } = useToasts();

  function coinsToCopper(c:any){
    return (c.gold||0)*10000 + (c.silver||0)*100 + (c.bronze||0)*10 + (c.copper||0);
  }
  function giveCopper(n:number){
    setState(s=>{
      const c = (s.player.coins||{});
      const tot = coinsToCopper(c)+n;
      const gold = Math.floor(tot/10000);
      const silver = Math.floor((tot%10000)/100);
      const bronze = Math.floor((tot%100)/10);
      const copper = tot%10;
      return { ...s, player:{ ...s.player, coins:{ gold, silver, bronze, copper }}, updatedAt: Date.now() };
    });
  }

  const playDice = ()=>{
    if(!takeCoins({ copper:5 })){ add({type:'error', title:'Sem fundos', message:'Custa 5 cobre'}); return; }
    const r = Math.ceil(Math.random()*6);
    if(r>=5){ giveCopper(20); add({type:'success', title:'Dados', message:'Você tirou alto! +20 cobre'}); }
    else if(r>=3){ giveCopper(8); add({type:'info', title:'Dados', message:'+8 cobre'}); }
    else { add({type:'error', title:'Dados', message:'Nada desta vez.'}); }
  };

  const armWrestle = ()=>{
    if(!takeCoins({ bronze:1 })){ add({type:'error', title:'Sem fundos', message:'Custa 1 bronze'}); return; }
    const str = state.player.attributes.strength||0;
    const r = Math.random()*100 + str*2;
    if(r>120){ giveCopper(80); add({type:'success', title:'Braço de Ferro', message:'Vitória! +8 bronze (80 cobre)'}); }
    else if(r>80){ giveCopper(30); add({type:'info', title:'Braço de Ferro', message:'+3 bronze (30 cobre)'}); }
    else { add({type:'error', title:'Braço de Ferro', message:'Derrota.'}); }
  };

  const lottery = ()=>{
    if(!takeCoins({ silver:1 })){ add({type:'error', title:'Sem fundos', message:'Bilhete custa 1 prata'}); return; }
    const luck = state.player.attributes.luck||0;
    const r = Math.random()*100 + luck;
    if(r>180){ giveCopper(10000); add({type:'success', title:'Loteria da Feira', message:'JACKPOT! +1 ouro'}); }
    else if(r>120){ giveCopper(1200); add({type:'info', title:'Loteria da Feira', message:'+12 prata'}); }
    else if(r>90){ giveCopper(200); add({type:'info', title:'Loteria da Feira', message:'+2 prata'}); }
    else { add({type:'error', title:'Loteria da Feira', message:'Não foi dessa vez.'}); }
  };

  return (
    <div className="space-y-4">
      <div className="font-semibold">Praça da Cidade</div>
      <div className="grid md:grid-cols-3 gap-3">
        <button className="rounded-xl border px-3 py-3 text-left button" onClick={playDice}>
          <div className="font-medium">Jogo de Dados</div>
          <div className="text-xs opacity-70">Custo: 5 cobre • Recompensa: até 20 cobre</div>
        </button>
        <button className="rounded-xl border px-3 py-3 text-left button" onClick={armWrestle}>
          <div className="font-medium">Braço de Ferro</div>
          <div className="text-xs opacity-70">Custo: 1 bronze • Recompensa: até 8 bronze</div>
        </button>
        <button className="rounded-xl border px-3 py-3 text-left button" onClick={lottery}>
          <div className="font-medium">Loteria da Feira</div>
          <div className="text-xs opacity-70">Custo: 1 prata • Recompensa: até 1 ouro</div>
        </button>
      </div>
    </div>
  );
}
