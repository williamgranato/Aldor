'use client';
import React from 'react';

type Props = { deltas: Record<string, number> };

export default function DeltaStatBadge({ deltas }: Props) {
  const keys = Object.keys(deltas||{}).filter(k => deltas[k] !== 0);
  if (!keys.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
      {keys.map(k => {
        const v = deltas[k];
        const sign = v>0?'+':'';
        return (
          <span key={k}
            className={`px-1.5 py-0.5 rounded-md border text-xs ${
              v>0? 'border-emerald-700 text-emerald-400 bg-emerald-900/40'
              : 'border-rose-700 text-rose-400 bg-rose-900/40'
            }`}
          >
            {k.toUpperCase()} {sign}{v}
          </span>
        );
      })}
    </div>
  );
}
