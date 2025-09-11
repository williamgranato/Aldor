'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shield, Coins, Building, Sword, User } from 'lucide-react';

export default function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-3 px-6 py-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-700 text-sm font-medium">
      <Link href="/" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${pathname==='/' ? 'bg-amber-600 text-black' : 'hover:bg-amber-500/30'}`}>
        <Home className="w-4 h-4" /> Início
      </Link>
      <Link href="/guilda" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${pathname==='/guilda' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-500/30'}`}>
        <Shield className="w-4 h-4" /> Guilda
      </Link>
      <Link href="/mercado" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${pathname==='/mercado' ? 'bg-emerald-600 text-black' : 'hover:bg-emerald-500/30'}`}>
        <Coins className="w-4 h-4" /> Mercado
      </Link>
      <Link href="/praca" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${pathname==='/praca' ? 'bg-rose-600 text-white' : 'hover:bg-rose-500/30'}`}>
        <Building className="w-4 h-4" /> Praça
      </Link>
      <Link href="/treino" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${pathname==='/treino' ? 'bg-orange-600 text-black' : 'hover:bg-orange-500/30'}`}>
        <Sword className="w-4 h-4" /> Treino
      </Link>
      <Link href="/personagem" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${pathname==='/personagem' ? 'bg-fuchsia-600 text-white' : 'hover:bg-fuchsia-500/30'}`}>
        <User className="w-4 h-4" /> Personagem
      </Link>
    </nav>
  );
}
