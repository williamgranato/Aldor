'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavTabs() {
  const path = usePathname();
  const tabs = [
    { href: '/', label: 'Início' },
    { href: '/guilda', label: 'Guilda' },
    { href: '/mercado', label: 'Mercado' },
    { href: '/atributos', label: 'Atributos' },
    { href: '/nivel', label: 'Nível / XP' },
  ];
  return (
    <div className="container mt-4 mb-2 flex gap-2 flex-wrap">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className={`px-3 py-2 rounded-lg border ${path===t.href?'border-zinc-300 text-white':'border-zinc-700 hover:bg-zinc-800/40'}`}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
