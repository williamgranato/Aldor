// /app/page.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import EffectiveStatsPanel from '@/components/EffectiveStatsPanel';
import { computeEffectiveStats, type EquippedState, type Item, type CharacterBase, type SkillsBonus } from '@/data/items_catalog';

type ProviderAPI = {
  getEquipped: () => EquippedState;
  getInventory: () => Item[];
  getBaseStats: () => CharacterBase;
  getSkillsBonus: () => SkillsBonus;
  equip: (slot: any, item: Item) => void;
  unequip: (slot: any) => void;
};

export default function HomePage() {
  const [api, setApi] = useState<ProviderAPI | null>(null);
  const [equipped, setEquipped] = useState<EquippedState | undefined>(undefined);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [baseStats, setBaseStats] = useState<CharacterBase | null>(null);
  const [skills, setSkills] = useState<SkillsBonus>({ bonuses: {} });

  useEffect(() => {
    let mounted = true;
    function loadFromWindow() {
      const h = typeof window !== 'undefined' ? (window as any).__aldorHook?.() : null;
      if (!mounted) return;
      if (h) {
        const apiBuilt: ProviderAPI = {
          getEquipped: () => h.equipped ?? {},
          getInventory: () => h.inventory ?? [],
          getBaseStats: () => (h.base ?? h.character ?? { STR:10, AGI:10, INT:10, VIT:10, LUCK:5, ATQ:10, DEF:10, CRIT:5, DODGE:5, HP:100 }),
          getSkillsBonus: () => (h.skillsBonus ?? { bonuses: {} }),
          equip: (slot, item) => h.equip?.(slot, item),
          unequip: (slot) => h.unequip?.(slot),
        };
        setApi(apiBuilt);
        setEquipped(apiBuilt.getEquipped());
        setInventory(apiBuilt.getInventory());
        setBaseStats(apiBuilt.getBaseStats());
        setSkills(apiBuilt.getSkillsBonus());
      } else {
        setEquipped({});
        setInventory([]);
        setBaseStats({ STR:10, AGI:10, INT:10, VIT:10, LUCK:5, ATQ:10, DEF:10, CRIT:5, DODGE:5, HP:100 });
        setSkills({ bonuses: {} });
      }
    }
    loadFromWindow();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      setEquipped(api.getEquipped());
      setInventory(api.getInventory());
      setBaseStats(api.getBaseStats());
      setSkills(api.getSkillsBonus());
    }, 500);
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
            onEquip={(slot, item) => { game.equip?.(slot as any, item); /* persist */  api?.equip(slot, item); }}
            onUnequip={(slot) => { game.unequip?.(slot as any); /* persist */  api?.unequip(slot); }}
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
            const slot = (item.slot ?? 'mão_principal') as any;
            api?.equip(slot, item);
          }}
          onDiscard={(item) => { game.removeItem?.(item.id, 1); /* persist */ 
            const anyApi: any = api as any;
            anyApi?.discard?.(item);
          }}
        />
      </div>
    </div>
  );
}
