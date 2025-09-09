// /app/page.tsx
'use client';
import React, { useMemo } from 'react';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import EffectiveStatsPanel from '@/components/EffectiveStatsPanel';
import { computeEffectiveStats, type EquippedState, type Item, type CharacterBase, type SkillsBonus } from '@/data/items_catalog';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function HomePage() {
  const game = useGame(); // ✅ hook no topo do componente dentro do Provider
  const s = game.state;

  // Mapeia dados do provider para as estruturas usadas nos componentes
  const inventory: Item[] = (s.player?.inventory ?? []) as any;
  const base: CharacterBase = {
    STR: s.player?.attributes?.strength ?? 5,
    AGI: s.player?.attributes?.agility ?? 5,
    INT: s.player?.attributes?.intelligence ?? 5,
    VIT: s.player?.attributes?.vitality ?? 5,
    LUCK: s.player?.attributes?.luck ?? 5,
    ATQ: s.player?.stats?.attack ?? 10,
    DEF: s.player?.stats?.defense ?? 5,
    CRIT: Math.round((s.player?.stats?.crit ?? 0) * 100),
    DODGE: 0,
    HP: s.player?.stats?.maxHp ?? 100
  };
  const equipped: EquippedState = {}; // ainda sem slots persistentes no provider

  const skills: SkillsBonus = { bonuses: {} };

  const eff = useMemo(() => computeEffectiveStats(base, equipped, skills), [base]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna esquerda: Avatar + Atributos */}
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
            <img src="/images/avatar.png" alt="Aventureiro" title="Aventureiro" className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <div className="text-sm font-semibold">{s.player?.character?.name ?? 'Aventureiro'}</div>
              <div className="text-[11px] text-neutral-400">Toque nos slots ao lado para equipar</div>
            </div>
          </div>
          <EffectiveStatsPanel stats={eff} />
        </div>

        {/* Coluna direita: PaperDoll/Slots + seletor compacto */}
        <div className="lg:col-span-2">
          <PaperDoll
            equipped={equipped}
            inventory={inventory}
            onEquip={(slot, item) => {
              // placeholder: até o provider suportar slots, não faz nada destrutivo
              // game.setState(...): podemos implementar depois conforme schema
            }}
            onUnequip={(slot) => {}}
          />
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Inventário</div>
        </div>
        <InventoryPanel
          items={inventory}
          view="grid"
          onEquip={(item) => {
            // placeholder: sem slots persistentes ainda
          }}
          onDiscard={(item) => {
            game.removeItem?.(item.id, 1);
          }}
        />
      </div>
    </div>
  );
}
