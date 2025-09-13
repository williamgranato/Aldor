'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Shield, Coins, Building, Sword, Beer, LucidePickaxe } from 'lucide-react';

// Cada aba tem sua cor e animação
const nav = [
  { 
    href: '/', 
    label: 'Início', 
    icon: Home, 
    color: 'text-sky-400',
    animation: { scale: [1, 1.15, 1] }
  },
  { 
    href: '/coleta', 
    label: 'Coleta', 
    icon: LucidePickaxe, 
    color: 'text-green-400',
    animation: { rotate: [0, -15, 15, 0] }
  },
  { 
    href: '/guilda', 
    label: 'Guilda', 
    icon: Shield, 
    color: 'text-purple-400',
    animation: { scale: [1, 1.2, 1] }
  },
  { 
    href: '/mercado', 
    label: 'Mercado', 
    icon: Coins, 
    color: 'text-amber-400',
    animation: { y: [0, -3, 0, 3, 0] }
  },
  { 
    href: '/praca', 
    label: 'Praça', 
    icon: Building, 
    color: 'text-pink-400',
    animation: { rotate: [0, 5, -5, 0] }
  },
  { 
    href: '/treino', 
    label: 'Treino', 
    icon: Sword, 
    color: 'text-red-400',
    animation: { rotate: [0, -10, 10, 0] }
  },
  { 
    href: '/taverna', 
    label: 'Taverna', 
    icon: Beer, 
    color: 'text-yellow-400',
    animation: { rotate: [0, -20, 20, 0] }
  },
];

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-6xl flex items-center justify-center gap-4 p-2 
          bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 
          border border-amber-600/30 rounded-2xl shadow-lg backdrop-blur-sm"
      >
        {nav.map(({ href, label, icon: Icon, color, animation }) => {
          const active = pathname === href;
          return (
            <motion.div
              key={href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Link
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl relative overflow-hidden group
                  transition-colors duration-300 border
                  ${active
                    ? 'bg-amber-600/20 border-amber-600 text-amber-300 shadow-[0_0_12px_rgba(255,200,0,0.5)]'
                    : 'text-neutral-300 border-transparent hover:text-amber-400 hover:border-amber-500/50 hover:bg-neutral-800/50'
                  }`}
              >
                {/* Glow animado ao passar mouse */}
                <span className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                {/* Ícone com cor única + animação se ativo */}
                <motion.div
                  animate={active ? animation : {}}
                  transition={active ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
                  className="relative z-10"
                >
                  <Icon className={`w-5 h-5 ${active ? color : 'text-neutral-400 group-hover:text-amber-400'}`} />
                </motion.div>

                <span className="text-sm font-semibold relative z-10">{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </nav>
  );
}
