// data/gathering_utils.ts
// Utilitários de skills de coleta com fallback seguro (sem exigir GameProvider).

export type GatheringSkillKey = "woodcutting" | "mining";

export interface SkillState {
  level: number;
  xp: number;
}

export interface GatheringSkills {
  woodcutting: SkillState;
  mining: SkillState;
}

const KEY = "aldor:gathering:skills";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function loadSkills(): GatheringSkills {
  if (typeof window === "undefined") {
    return { woodcutting: { level: 1, xp: 0 }, mining: { level: 1, xp: 0 } };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("no skills");
    const parsed = JSON.parse(raw) as GatheringSkills;
    return {
      woodcutting: parsed.woodcutting ?? { level: 1, xp: 0 },
      mining: parsed.mining ?? { level: 1, xp: 0 },
    };
  } catch {
    return { woodcutting: { level: 1, xp: 0 }, mining: { level: 1, xp: 0 } };
  }
}

export function saveSkills(sk: GatheringSkills) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(sk));
}

export function xpToNext(level: number) {
  // 100 XP * nível (curva leve para coleta)
  return 100 * level;
}

export function addSkillXP(skills: GatheringSkills, key: GatheringSkillKey, amount: number): GatheringSkills {
  const s = { ...skills };
  const st = { ...s[key] };
  st.xp += Math.max(0, Math.floor(amount));
  // loop de level-up
  let changed = false;
  while (st.xp >= xpToNext(st.level)) {
    st.xp -= xpToNext(st.level);
    st.level += 1;
    changed = true;
  }
  s[key] = st;
  if (changed) saveSkills(s);
  else saveSkills(s);
  return s;
}
