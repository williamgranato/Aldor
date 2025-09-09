'use client';
import React from 'react';
export default function Tooltip({ label, children }: { label: string; children: React.ReactNode }){
  return (
    <span className="relative group inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-100 opacity-0 shadow-lg shadow-black/40 ring-1 ring-zinc-700 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
