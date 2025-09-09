// components/NavTabs.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const TABS = [
  { href: '/', label: 'Início', icon: '/images/ui/nav/home.png' },
  { href: '/guilda', label: 'Guilda', icon: '/images/ui/nav/guild.png' },
  { href: '/mercado', label: 'Mercado', icon: '/images/ui/nav/market.png' },
  { href: '/leilao', label: 'Leilão', icon: '/images/ui/nav/auction.png' },
  { href: '/treino', label: 'Treino', icon: '/images/ui/nav/training.png' },
  { href: '/praca', label: 'Praça', icon: '/images/ui/nav/plaza.png' },
];

export default function NavTabs(){
  const pathname = usePathname();
  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800 sticky top-[56px] z-40">
      <div className="max-w-5xl mx-auto px-2 md:px-4">
        <div className="flex gap-2 overflow-x-auto py-2">
          {TABS.map(t=>{
            const active = pathname===t.href;
            return (
              <Link href={t.href} key={t.href} className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border ${active? 'border-amber-400/60 bg-amber-500/10 text-amber-200' : 'border-zinc-800 hover:bg-zinc-900/60 text-zinc-200'}`}>
                <Image src={t.icon} alt="" width={16} height={16} />
                <span className="text-sm">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
