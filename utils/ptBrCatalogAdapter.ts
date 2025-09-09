// Adapta o catálogo PT-BR (/data/items_catalog.ts) para o formato interno do Mercado
// sem mudar o contrato original do catálogo. Não adiciona dependências novas.
import type { Item as PtItem, Rarity as PtRarity, ItemType as PtType } from '@/data/items_catalog';
import type { GeneratedMarketItem } from '@/types/market';
import { fromCopper, normalizePrice } from '@/utils/marketPricing';

const rarityMap: Record<PtRarity, 'common'|'uncommon'|'rare'|'epic'|'legendary'> = {
  'comum': 'common',
  'incomum': 'uncommon',
  'raro': 'rare',
  'épico': 'epic',
  'lendário': 'legendary',
};

const typeMap: Record<PtType, 'weapon'|'armor'|'potion'|'trinket'|'material'|'trinket'> = {
  'arma': 'weapon',
  'armadura': 'armor',
  'poção': 'potion',
  'joia': 'trinket',
  'gema': 'trinket',
  'material': 'material',
  'acessório': 'trinket',
};

export function mapPtItemToMarket(it: PtItem): GeneratedMarketItem {
  const rarity = rarityMap[it.rarity] ?? 'common';
  const type = typeMap[it.type] ?? 'trinket';

  // Converter valueCopper -> {gold,silver,bronze,copper}
  const price = fromCopper(Math.max(0, Number((it as any).valueCopper ?? 0)));

  // Campos adicionais: usar nomes compatíveis com o mercado
  const image = it.image ? `/images/items/${it.image}` : '/images/items/placeholder.png';
  const atq = (it as any).atk ?? (it as any).ATQ ?? undefined;
  const def = (it as any).def ?? (it as any).DEF ?? undefined;
  const crit = (it as any).crit ?? (it as any).CRIT ?? undefined;
  const dodge = (it as any).dodge ?? (it as any).DODGE ?? undefined;
  const hp   = (it as any).bonuses?.HP ?? undefined; // poções e alguns acessórios
  const bonuses = (it as any).bonuses ?? undefined;

  const out: GeneratedMarketItem = {
    id: it.id,
    name: it.name,
    type,
    rarity,
    image,
    slot: (it as any).slot,
    material: (it as any).material,
    reqLevel: it.reqLevel,
    durability: (it as any).durability,
    weight: (it as any).weight,
    price: normalizePrice(price),
    atq,
    def,
    crit,
    dodge,
    hp,
    bonuses,
    sockets: (it as any).sockets,
    set: (it as any).setId,
    setBonus: undefined, // exibido no modal se você quiser mapear de SET_BONUSES
    lore: undefined,
    stock: 1,
    isFlash: false,
  };
  return out;
}
