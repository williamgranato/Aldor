// utils/rankProgress.ts
export type Rank = 'Sem Guilda'|'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

const THRESHOLDS: Record<Exclude<Rank,'Sem Guilda'|'SSS'>, number> = {
  'F': 10,  // F -> E
  'E': 20,  // E -> D
  'D': 80,  // D -> C
  'C': 160, // C -> B
  'B': 320, // B -> A
  'A': 400, // A -> S
  'S': 999999, // S -> SS depende de requisitos especiais (não por contador)
  'SS': 999999
};

export function canPromote(current: Rank, completedAtOrAbove: number): { ok: boolean; next?: Rank }{
  const order: Rank[] = ['Sem Guilda','F','E','D','C','B','A','S','SS','SSS'];
  const idx = order.indexOf(current);
  if(idx<0) return { ok:false };
  const next = order[idx+1] as Rank | undefined;
  if(!next) return { ok:false };
  if(current==='S'){ return { ok:false }; } // SS é especial
  const need = THRESHOLDS[current as Exclude<Rank,'Sem Guilda'|'SSS'>];
  if(typeof need!=='number') return { ok:false };
  return { ok: completedAtOrAbove >= need, next };
}

export function countCompletedAtOrAbove(completed: {id:string, rank:Rank}[], current: Rank): number{
  const order: Rank[] = ['Sem Guilda','F','E','D','C','B','A','S','SS','SSS'];
  const idx = order.indexOf(current);
  return completed.filter(x=> order.indexOf(x.rank)>=idx ).length;
}
