export type RarityKey = 'comum'|'incomum'|'raro'|'épico'|'lendário';

export const RARITY_COLORS: Record<RarityKey, string> = {
  comum: 'text-zinc-200',
  incomum: 'text-emerald-300',
  raro: 'text-sky-300',
  épico: 'text-violet-300',
  lendário: 'text-amber-300',
};

export const RARITY_RING: Record<RarityKey, string> = {
  comum: 'ring-zinc-700',
  incomum: 'ring-emerald-600',
  raro: 'ring-sky-600',
  épico: 'ring-violet-700',
  lendário: 'ring-amber-500',
};
