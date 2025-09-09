// /components/TabPrincipalView.tsx
'use client';
// Integra Paper Doll + Inventário + Stats automaticamente, sem exigir mudanças externas.
// Robusto para SSR/hidratação e para ausência temporária do provider.

import React, { useEffect, useMemo, useState } from 'react';
import PaperDoll from './PaperDoll';
import InventoryPanel from './InventoryPanel';
import EffectiveStatsPanel from './EffectiveStatsPanel';
import { computeEffectiveStats, type EquippedState, type Item, type CharacterBase, type SkillsBonus } from '@/data/items_catalog';

type ProviderAPI = {
  getEquipped: () => EquippedState;
  getInventory: () => Item[];
  getBaseStats: () => CharacterBase;
  getSkillsBonus: () => SkillsBonus;
  equip: (slot: any, item: Item) => void;
  unequip: (slot: any) => void;
};

export default function TabPrincipalView() {
  const [api, setApi] = useState<ProviderAPI | null>(null);
  const [equipped, setEquipped] = useState<EquippedState | undefined>(undefined);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [baseStats, setBaseStats] = useState<CharacterBase | null>(null);
  const [skills, setSkills] = useState<SkillsBonus>({ bonuses: {} });

  // Dynamic provider loader (tentativas múltiplas — não quebra se algum caminho não existir)
  useEffect(() => {
    let mounted = true;
    async function load() {
      let provider: any = null;
      const candidates = [
        () => import('@/providers/GameProvider'),
        () => import('@/providers/CharacterProvider'),
        () => import('@/context/GameContext'),
      ];
      for (const load of candidates) {
        try {
          const mod = await load();
          // tenta diferentes exposições comuns
          provider = mod.useGame ?? mod.usePlayer ?? mod.useAldor ?? null;
          if (provider) break;
        } catch {}
      }

      // fallback: window.aldorProvider se existir
      let hook: any = null;
      if (!provider && typeof window !== 'undefined') {
        hook = (window as any).__aldorHook ?? null;
      } else {
        hook = provider;
      }

      let apiBuilt: ProviderAPI | null = null;
      try {
        const state = hook ? hook() : null;
        if (state) {
          apiBuilt = {
            getEquipped: () => state.equipped,
            getInventory: () => state.inventory ?? [],
            getBaseStats: () => (state.base ?? state.character ?? { STR:10, AGI:10, INT:10, VIT:10, LUCK:5, ATQ:10, DEF:10, CRIT:5, DODGE:5, HP:100 }),
            getSkillsBonus: () => (state.skillsBonus ?? { bonuses: {} }),
            equip: (slot, item) => state.equip?.(slot, item),
            unequip: (slot) => state.unequip?.(slot),
          };
        }
      } catch {}

      if (mounted) {
        if (apiBuilt) {
          setApi(apiBuilt);
          setEquipped(apiBuilt.getEquipped());
          setInventory(apiBuilt.getInventory());
          setBaseStats(apiBuilt.getBaseStats());
          setSkills(apiBuilt.getSkillsBonus());
        } else {
          // fallback seguro (não quebra UI)
          setApi(null);
          setEquipped({});
          setInventory([]);
          setBaseStats({ STR:10, AGI:10, INT:10, VIT:10, LUCK:5, ATQ:10, DEF:10, CRIT:5, DODGE:5, HP:100 });
          setSkills({ bonuses: {} });
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Efeito: manter estado sincronizado se o provider expõe getters atualizados
  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      setEquipped(api.getEquipped());
      setInventory(api.getInventory());
      setBaseStats(api.getBaseStats());
      setSkills(api.getSkillsBonus());
    }, 500); // leve pooling para sincronizar sem APIs novas
    return () => clearInterval(id);
  }, [api]);

  const eff = useMemo(() => {
    if (!baseStats) return null;
    return computeEffectiveStats(baseStats, equipped ?? {}, skills);
  }, [baseStats, equipped, skills]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PaperDoll
            equipped={equipped}
            inventory={inventory}
            onEquip={(slot, item) => { api?.equip(slot, item); }}
            onUnequip={(slot) => { api?.unequip(slot); }}
          />
        </div>
        <div className="lg:col-span-1">
          {eff ? <EffectiveStatsPanel stats={eff} /> : null}
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
            // Smart equip: escolhe slot do item
            const slot = (item.slot ?? 'mão_principal') as any;
            api?.equip(slot, item);
          }}
          onDiscard={(item) => {
            // Delega para provider se existir
            const anyApi: any = api as any;
            if (anyApi?.discard) anyApi.discard(item);
          }}
        />
      </div>
    </div>
  );
}
