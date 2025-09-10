export type CoinPrice = { gold:number; silver:number; bronze:number; copper:number; };
export type Rarity = 'common'|'uncommon'|'rare'|'epic'|'legendary';
export type MarketItem = {
  id:string; name:string; type:'weapon'|'armor'|'shield'|'trinket'|'potion';
  slot?:string; material?:string; rarity:Rarity; reqLevel?:number;
  durability?:number; weight?:number; atq?:number; def?:number; crit?:number; dodge?:number; hp?:number;
  bonuses?: Partial<Record<'STR'|'AGI'|'INT'|'VIT'|'LUCK',number>>; sockets?:number; set?:string; setBonus?:string;
  lore?:string; image?:string; price: CoinPrice;
};
export type GeneratedMarketItem = MarketItem & { stock:number; isFlash:boolean; flashEndsAtMs?:number; discountedPrice?:CoinPrice; };
export type SeasonalContext = { season:'spring'|'summer'|'autumn'|'winter'; weather:'sunny'|'rain'|'storm'|'snow'|'cloudy'; temperature:number; };
export type MarketState = { seed:string; items:GeneratedMarketItem[]; rep:number; haggledIds:Record<string,boolean>; slotId?:string|number; };
