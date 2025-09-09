'use client';
import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { getQuestById } from '@/data/quests';

export type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS'|string;

export function useGameV2State(){
  const { state, startQuest, completeQuest } = useGame();
  const [activeMissionsRaw, setActiveMissionsRaw] = useState(state.guild.activeQuests);

  useEffect(()=>{ setActiveMissionsRaw(state.guild.activeQuests); }, [state.guild.activeQuests]);

  // Compat: expor state.activeMissions como antes (com missionId)
  const compatState = useMemo(()=>{
    const activeMissions = (state.guild.activeQuests || []).map((q:any)=>({ missionId: q.id, ...q }));
    return { ...state, activeMissions };
  }, [state]);

  async function loadActiveMissions(){
    return { active: state.guild.activeQuests };
  }

  async function startMissionServer(missionId: string, rank: Rank){
    const quest = getQuestById(missionId);
    if(!quest) throw new Error('Missão inválida');
    startQuest(quest);
    return { progress: quest };
  }

  async function finishMissionServer(missionId: string){
    completeQuest(missionId);
    return { ok: true };
  }

  function playerRank(){
    return state.player?.guildRank || 1;
  }

  return {
    state: compatState as any,
    activeMissions: activeMissionsRaw,
    loadActiveMissions,
    startMissionServer,
    finishMissionServer,
    playerRank,
  };
}
