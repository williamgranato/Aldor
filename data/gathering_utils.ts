export type GatheringSkill = 'woodcutting' | 'mining';

type SkillState = { level: number; xp: number; };
export type GatheringSkills = {
  woodcutting: SkillState;
  mining: SkillState;
};

const KEY = 'aldor_gathering_skills';

function levelFromXp(xp: number): number {
  // curva simples: cada nível requer +100 xp
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function loadSkills(): GatheringSkills {
  if (typeof window === 'undefined') {
    return { woodcutting: { level: 1, xp: 0 }, mining: { level: 1, xp: 0 } };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { woodcutting: { level: 1, xp: 0 }, mining: { level: 1, xp: 0 } };
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return { woodcutting: { level: 1, xp: 0 }, mining: { level: 1, xp: 0 } };
  }
}

export function addSkillXp(which: GatheringSkill, amount: number) {
  if (typeof window === 'undefined') return loadSkills();
  const s = loadSkills();
  s[which].xp += amount;
  s[which].level = levelFromXp(s[which].xp);
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}
