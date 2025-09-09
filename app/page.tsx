// /app/page.tsx
'use client';
import React, { useMemo } from 'react';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import EffectiveStatsPanel from '@/components/EffectiveStatsPanel';
import { computeEffectiveStats, type EquippedState, type Item, type CharacterBase, type SkillsBonus } from '@/data/items_catalog';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function HomePage() {
  const game = useGame(); // hook no topo, dentro do Provider (app/layout.tsx)
  const s = game.state;

  // Inventário vem somente do provider
  const inventory: Item[] = (s.player?.inventory ?? []) as any;

  // Equipped vem do provider; converte para shape esperado (EquippedState)
  const equipped: EquippedState = useMemo(() => {
    const eq:any = s.player?.equipped ?? {};
    // já está no formato { slot: { itemId } }, então só repassamos
    return eq as EquippedState;
  }, [s.player?.equipped]);

  // Base stats (mapeados do provider)
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

  const skills: SkillsBonus = { bonuses: {} };

  const eff = useMemo(() => computeEffectiveStats(base, equipped ?? {}, skills), [base, equipped]);

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

        {/* Coluna direita: PaperDoll/Slots */}
        <div className="lg:col-span-2">
          <PaperDoll
            equipped={equipped}
            inventory={inventory}
            onEquip={(slot, item) => { game.equip?.(slot as any, item); }}
            onUnequip={(slot) => { game.unequip?.(slot as any); }}
          />
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Inventário</div>
        </div>
        <InventoryPanel
          view="grid"
          onEquip={(item) => {
            const slot = (item.slot ?? 'mão_principal') as any;
            game.equip?.(slot, item);
          }}
          onDiscard={(item) => {
            game.removeItem?.(item.id, 1);
          }}
        />
      </div>
    </div>
  );
}
