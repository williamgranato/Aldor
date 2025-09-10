// Trecho patchado em undertakeQuest para consumir stamina
// dentro do useGame/GameProviderClient
const undertakeQuest=(q:Quest)=>{
  const costByRank:any={F:5,E:10,D:20,C:40,A:80,S:160,SS:320};
  const cost = costByRank[q.requiredRank||'F']||5;
  if(state.player.stamina.current < cost){
    return {win:false, message:'Sem stamina suficiente!'};
  }
  setState(s=>{
    const p={...s.player};
    p.stamina={...p.stamina, current:Math.max(0,p.stamina.current-cost)};
    return {...s, player:p};
  });
  // resto igual...
};
