'use client';
import React from 'react';
import { MarketProviderBridge } from '@/components/market/MarketProviderBridge';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';

function getNarrative(season?:string, weather?:string){
  if(season==='inverno') return 'Mercador: As estradas congeladas trouxeram pouco comércio hoje.';
  if(weather==='chuva') return 'Mercador: Com a chuva, só restaram mercadorias resistentes à água!';
  if(season==='verão') return 'Chegou um lote de aço das Montanhas Cinzentas!';
  return 'Veja nossas mercadorias frescas do dia!';
}

export default function MercadoPage(){
  const { state } = useGame();
  const { season, weather } = state.world||{};
  const narrative = getNarrative(season,weather);

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div 
        initial={{opacity:0,y:-10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4}} 
        className="p-6 flex flex-col gap-2 bg-gradient-to-r from-amber-800/50 to-yellow-600/30 backdrop-blur-md border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <Store size={24} className="text-amber-300"/>
          <h1 className="text-2xl font-bold">Mercado de Aldor</h1>
        </div>
        <p className="text-sm opacity-80">{narrative}</p>
      </motion.div>
      <div className="flex-1 overflow-y-auto">
        <MarketProviderBridge/>
      </div>
    </div>
  );
}
