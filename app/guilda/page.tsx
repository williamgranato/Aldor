'use client';
import React from 'react';
import LoginGate from '../../components/LoginGate';
import { useGame } from '../../context/GameProvider';

const sampleQuests = [
  { id: 'q1', name: 'Caçar Slimes', description: 'Limpe o pasto fora da cidade', rewards: { xp: 50, coinsCopper: 220 } },
  { id: 'q2', name: 'Coletar Ervas', description: 'Traga 5 ervas curativas', rewards: { xp: 80, coinsCopper: 350 } },
  { id: 'q3', name: 'Rato da Adega', description: 'Derrote o rei rato', rewards: { xp: 120, coinsCopper: 500 } },
];

export default function GuildaPage() {
  const { state, startQuest, completeQuest } = useGame();
  const active = state.guild.activeQuests;

  return (
    <LoginGate>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Quests Disponíveis</h2>
          <div className="space-y-2">
            {sampleQuests.map(q => (
              <div key={q.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{q.name}</div>
                  <div className="text-sm opacity-80">{q.description}</div>
                </div>
                <button className="button" onClick={() => startQuest(q as any)}>Aceitar</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Quests Ativas</h2>
          <div className="space-y-2">
            {active.length===0 && <div className="opacity-70">Nenhuma.</div>}
            {active.map(q => (
              <div key={q.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{q.name}</div>
                  <div className="text-sm opacity-80">{q.description}</div>
                </div>
                <button className="button" onClick={() => completeQuest(q.id)}>Concluir</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoginGate>
  );
}
