// utils/seasonStyle.ts
export type Season = 'Primavera'|'Verão'|'Outono'|'Inverno';
export type Weather = 'Ensolarado'|'Nublado'|'Chuva'|'Neve'|'Vento';

export const seasonGradient: Record<Season, string> = {
  'Primavera': 'bg-gradient-to-r from-emerald-900/50 via-emerald-700/30 to-emerald-900/50',
  'Verão':     'bg-gradient-to-r from-amber-900/60 via-amber-700/30 to-amber-900/60',
  'Outono':    'bg-gradient-to-r from-orange-900/60 via-orange-700/30 to-orange-900/60',
  'Inverno':   'bg-gradient-to-r from-sky-900/60 via-sky-700/30 to-sky-900/60',
};

export const weatherEmoji: Record<Weather, string> = {
  'Ensolarado': '☀️',
  'Nublado': '☁️',
  'Chuva': '🌧️',
  'Neve': '❄️',
  'Vento': '🌬️',
};
