'use client';
import React from 'react';
import GuildCard from '@/components/GuildCard';
import GuildMissions from '@/components/GuildMissions';

export default function GuildBoard(){
  return (
    <div className="space-y-4">
      <GuildCard />
      <GuildMissions />
    </div>
  );
}
