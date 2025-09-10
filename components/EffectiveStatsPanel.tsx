// /components/EffectiveStatsPanel.tsx
import React from 'react';
import type { EffectiveStats } from '../data/items_catalog';

type Props = { stats: EffectiveStats };

function Line({ label, d }: { label: string; d: any }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
      <div className="text-sm text-neutral-200">{label}</div>
      <div className="text-sm font-semibold">
        {d.total}{' '}
        <span className="text-[11px] text-neutral-400">
          [Base {d.base}] [+Itens {d.itens}] [+Skills {d.skills}]
        </span>
      </div>
    </div>
  );
}

export default function EffectiveStatsPanel({ stats }: Props) {
  return (
    <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
      <Line label="ATQ" d={stats.ATQ} />
      <Line label="DEF" d={stats.DEF} />
      <Line label="HP" d={stats.HP} />
      <Line label="CRIT" d={stats.CRIT} />
      <Line label="DODGE" d={stats.DODGE} />
    </div>
  );
}
