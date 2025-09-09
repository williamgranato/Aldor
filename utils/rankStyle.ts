// utils/rankStyle.ts
export const rankOrder = ['Sem Guilda','F','E','D','C','B','A','S','SS','SSS'] as const;
export type Rank = typeof rankOrder[number];

export const rankColors: Record<Rank, { bg:string; text:string; shadow?:string; hex?:string; emblem?:string }> = {
  'Sem Guilda': { bg:'bg-zinc-800/60', text:'text-zinc-200', hex:'#a1a1aa', emblem:'/images/ui/rank/NG.png' },
  F:  { bg:'bg-stone-900/40',  text:'text-stone-200', hex:'#e7e5e4', emblem:'/images/ui/rank/F.png' },
  E:  { bg:'bg-emerald-900/30',text:'text-emerald-300', hex:'#34d399', emblem:'/images/ui/rank/E.png' },
  D:  { bg:'bg-sky-900/30',    text:'text-sky-300', hex:'#38bdf8', emblem:'/images/ui/rank/D.png' },
  C:  { bg:'bg-indigo-900/30', text:'text-indigo-300', hex:'#818cf8', emblem:'/images/ui/rank/C.png' },
  B:  { bg:'bg-purple-900/30', text:'text-purple-300', hex:'#a78bfa', emblem:'/images/ui/rank/B.png' },
  A:  { bg:'bg-rose-900/30',   text:'text-rose-300', hex:'#f43f5e', emblem:'/images/ui/rank/A.png' },
  S:  { bg:'bg-amber-900/30',  text:'text-amber-300', hex:'#f59e0b', emblem:'/images/ui/rank/S.png' },
  SS: { bg:'bg-amber-800/40',  text:'text-amber-200', hex:'#fbbf24', emblem:'/images/ui/rank/SS.png' },
  SSS:{ bg:'bg-yellow-700/50', text:'text-yellow-200', hex:'#facc15', emblem:'/images/ui/rank/SSS.png' },
};

export const rankDescriptions: Record<Rank,string>={
  'Sem Guilda': 'Aventureiro independente, sem acesso aos contratos da guilda.',
  F:  'Novato — missões simples e de baixo risco.',
  E:  'Aprendiz — já encarou perigos básicos.',
  D:  'Intermediário — lida com monstros comuns.',
  C:  'Veterano — missões com risco considerável.',
  B:  'Elite — contratos perigosos e bem pagos.',
  A:  'Mestre — ameaça para monstros de alto nível.',
  S:  'Lenda — poucos alcançam tal fama.',
  SS: 'Mito — feitos além do comum.',
  SSS:'Ascendente — honra dourada da guilda.'
};
