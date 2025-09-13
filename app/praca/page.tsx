'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameProvider_aldor_client';
import { getPracaMissions } from '@/data/missoes';
import {
  Swords, Droplets, Sparkles,
  Music, Megaphone, ShoppingBag, Flame, Bird, HandCoins, CloudRain, Snowflake, Sun, Leaf
} from 'lucide-react';

// === Missões ===
function MissionCard({ mission, onStart }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 shadow-md cursor-pointer flex flex-col gap-2 backdrop-blur-sm"
      onClick={() => onStart(mission)}
    >
      <div className="flex items-center gap-2">
        {mission.id.includes('p1') && <Swords className="w-5 h-5 text-red-400" />}
        {mission.id.includes('p2') && <Droplets className="w-5 h-5 text-blue-400" />}
        {mission.id.includes('p3') && <Sparkles className="w-5 h-5 text-yellow-400" />}
        <h3 className="font-semibold text-lg text-slate-100">{mission.name}</h3>
      </div>
      <p className="text-sm text-slate-300">{mission.description}</p>
      <div className="flex items-center justify-between text-sm mt-2">
        <span className="text-emerald-400">+{mission.rewards.xp} XP</span>
        <span className="text-amber-400">{mission.rewards.coins.copper ?? 0}⚙ cobre</span>
      </div>
    </motion.div>
  );
}

// === NPC simples ===
function NPC({ icon: Icon, text, color, onClick }: { icon: any; text: string; color: string; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex items-center gap-2 shadow-sm backdrop-blur-sm cursor-pointer"
    >
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-slate-200 text-sm">{text}</span>
    </motion.div>
  );
}

export default function PracaPage() {
  const { dispatch, state } = useGame();
  const missions = getPracaMissions();

  const handleStartMission = (mission: any) => {
    dispatch({ type: 'START_MISSION', payload: mission });
  };

  // === Rumores dinâmicos ===
  const rumors = [
    'Um viajante trouxe notícias de monstros na floresta.',
    'A taverna prepara um festival para esta noite!',
    'O arauto anuncia aumento no preço do trigo.',
    'Um grupo de aventureiros retornou vitorioso da dungeon.'
  ];
  const rumorOfDay = useMemo(
    () => rumors[state.world.dateMs % rumors.length],
    [state.world.dateMs]
  );

  // === Decoração de estação/clima ===
  const season = state.world.season ?? 'verão';
  const weather = state.world.weather ?? 'ensolarado';

  const seasonIcon =
    season === 'inverno' ? <Snowflake className="w-5 h-5 text-blue-200" /> :
    season === 'outono' ? <Leaf className="w-5 h-5 text-orange-400" /> :
    season === 'primavera' ? <Sparkles className="w-5 h-5 text-pink-300" /> :
    <Sun className="w-5 h-5 text-yellow-300" />;

  // === Ações especiais ===
  const donateCoin = () => {
    if (state.player.coins.copper > 0) {
      dispatch({ type: 'ADD_COINS', payload: { copper: -1 } });
      alert('Você jogou uma moeda na fonte. Os deuses sorriem para você!');
    } else {
      alert('Você não tem cobre para doar.');
    }
  };

  const feedBeggar = () => {
    if (state.player.coins.copper > 0) {
      dispatch({ type: 'ADD_COINS', payload: { copper: -1 } });
      alert('O mendigo agradece: "Que os deuses o abençoem!"');
    } else {
      alert('Você não tem nada para dar.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fundos dinâmicos */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-black to-slate-900" />
      {weather === 'chuva' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <CloudRain className="absolute top-10 left-10 w-10 h-10 text-blue-400 opacity-40" />
        </motion.div>
      )}
      {weather === 'neve' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <Snowflake className="absolute top-5 right-20 w-6 h-6 text-sky-200 opacity-60" />
        </motion.div>
      )}

      {/* Conteúdo */}
      <div className="relative z-10 p-6 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-slate-100 drop-shadow flex items-center gap-2"
        >
          Praça Central {seasonIcon}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 max-w-2xl"
        >
          Um espaço de encontro dos moradores de Aldor. Aqui você encontra tarefas simples,
          eventos sociais e pode sentir a vida da cidade.
        </motion.p>

        {/* Rumor do dia */}
        <NPC icon={Megaphone} text={rumorOfDay} color="text-yellow-400" />

        {/* NPCs fixos e interativos */}
        <div className="grid md:grid-cols-3 gap-3">
          <NPC icon={Music} text="Um bardo toca canções antigas." color="text-pink-400" />
          <NPC icon={ShoppingBag} text="Uma barraca vende pão fresco." color="text-amber-400" />
          <NPC icon={Flame} text="A fogueira aquece os viajantes." color="text-red-500" />
          <NPC icon={HandCoins} text="Um mendigo pede uma moeda." color="text-green-400" onClick={feedBeggar} />
          <NPC icon={Droplets} text="Jogar moeda na fonte." color="text-blue-400" onClick={donateCoin} />
        </div>

        {/* Missões disponíveis */}
        <h2 className="text-xl font-semibold text-slate-200 mt-6">Tarefas disponíveis</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {missions.map((m) => (
            <MissionCard key={m.id} mission={m} onStart={handleStartMission} />
          ))}
        </div>

        {/* Pássaro animado */}
        <motion.div
          className="absolute bottom-6 right-6 text-slate-500"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Bird className="w-6 h-6" />
        </motion.div>
      </div>
    </div>
  );
}
