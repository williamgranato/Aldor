'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shield, Coins, Building, Sword, User } from 'lucide-react';

const nav = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/guilda', label: 'Guilda', icon: Shield },
  { href: '/mercado', label: 'Mercado', icon: Coins },
  { href: '/praca', label: 'Praça', icon: Building },
  { href: '/treino', label: 'Treino', icon: Sword },
  { href: '/personagem', label: 'Personagem', icon: User },
];

export default function NavMenu() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl flex items-center justify-center gap-4 p-2 
        bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 
        border border-amber-600/30 rounded-2xl shadow-lg backdrop-blur-sm">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition
                ${active
                  ? 'bg-amber-600/20 border border-amber-600 text-amber-300'
                  : 'text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-neutral-800/50 border border-transparent'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
