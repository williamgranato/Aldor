"use client";

import React, { useMemo, useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Trees, Pickaxe, Zap, Timer, Gift, Lock, ShieldCheck, Hammer } from "lucide-react";

import {
  FOREST_RESOURCES,
  MINE_RESOURCES,
  type GatheringResource,
} from "@/data/gathering_catalog";
import { loadSkills, addSkillXP, type GatheringSkills } from "@/data/gathering_utils";

// Tipos mínimos para integração suave com seu GameProvider (fallback seguro)
type GameCtxLike = {
  player?: { level?: number; stamina?: number };
  spendStamina?: (n: number) => boolean | void;
  addLootToInventory?: (loot: { id: string; quantity: number }[]) => void;
  giveXP?: (n: number) => void;
};

// Tentar achar o contexto se existir (sem quebrar caso não exista)
let GameContext: React.Context<GameCtxLike> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maybe = require("@/context/GameContext");
  GameContext = maybe?.GameContext ?? null;
} catch { /* noop */ }

const useGame = (): GameCtxLike => {
  if (GameContext) {
    try {
      return useContext(GameContext);
    } catch {
      return {};
    }
  }
  return {};
};

function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

type RunState =
  | { status: "idle" }
  | { status: "running"; start: number; duration: number; staminaCost: number; res: GatheringResource }
  | { status: "cooldown"; until: number };

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-emerald-400"
        initial={{ width: "0%" }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ type: "tween", ease: "linear", duration: 0.15 }}
      />
    </div>
  );
}

function ResourceCard({
  res,
  canUse,
  onGather,
  running,
  progress,
}: {
  res: GatheringResource;
  canUse: boolean;
  onGather: () => void;
  running: boolean;
  progress: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: running ? 1.0 : 1.01 }}
      className={`rounded-2xl p-5 border shadow-lg backdrop-blur-sm
        ${res.biome === "forest" ? "bg-green-500/5 border-green-400/20" : "bg-sky-500/5 border-sky-400/20"}`}
    >
      <div className="flex gap-4 items-start">
        <img
          src={res.image}
          alt={res.name}
          className="w-16 h-16 rounded-xl object-contain ring-1 ring-white/10 bg-black/20"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {res.biome === "forest" ? (
              <Trees className="w-5 h-5 text-emerald-300" />
            ) : (
              <Pickaxe className="w-5 h-5 text-sky-300" />
            )}
            <h3 className="text-lg font-semibold">{res.name}</h3>
          </div>
          <p className="text-sm text-white/80">{res.description}</p>

          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Requer Nível {res.reqLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span>{(res.timeMs / 1000).toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>-{res.staminaCost} Stamina</span>
            </div>
            {res.bonusItemId && (
              <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                <Gift className="w-4 h-4" />
                <span>Chance de bônus {(Math.round((res.bonusChance ?? 0) * 100))}%</span>
              </div>
            )}
          </div>

          <div className="mt-3">
            {running ? (
              <ProgressBar progress={progress} />
            ) : !canUse ? (
              <div className="inline-flex items-center gap-2 text-amber-300">
                <Lock className="w-4 h-4" />
                <span>Você ainda não possui o nível necessário.</span>
              </div>
            ) : (
              <button
                onClick={onGather}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition
                           inline-flex items-center gap-2"
              >
                <Hammer className="w-4 h-4" />
                Coletar
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ColetaPage() {
  const game = useGame();
  const playerLevel = game?.player?.level ?? 1;
  const stamina = game?.player?.stamina ?? 999;

  const [skills, setSkills] = useState<GatheringSkills>(loadSkills());
  const [run, setRun] = useState<RunState>({ status: "idle" });
  const [progress, setProgress] = useState(0);

  // Barra de progresso
  useInterval(() => {
    if (run.status !== "running") return;
    const elapsed = Date.now() - run.start;
    const p = Math.min(100, (elapsed / run.duration) * 100);
    setProgress(p);
    if (elapsed >= run.duration) {
      // finaliza
      finishRun(run.res, run.staminaCost);
      setRun({ status: "cooldown", until: Date.now() + 300 });
      setTimeout(() => setRun({ status: "idle" }), 300);
    }
  }, run.status === "running" ? 100 : null);

  const forest = useMemo(
    () => FOREST_RESOURCES.map(r => ({ r, canUse: playerLevel >= r.reqLevel })),
    [playerLevel]
  );
  const mine = useMemo(
    () => MINE_RESOURCES.map(r => ({ r, canUse: playerLevel >= r.reqLevel })),
    [playerLevel]
  );

  function startGather(res: GatheringResource) {
    if (run.status !== "idle") return;
    if (playerLevel < res.reqLevel) return;
    if ((game?.player?.stamina ?? 0) < res.staminaCost) return;

    // tenta gastar stamina pelo provider; se não houver, segue localmente
    try {
      const ok = game?.spendStamina?.(res.staminaCost);
      if (ok === false) return;
    } catch { /* noop */ }

    setRun({ status: "running", start: Date.now(), duration: res.timeMs, staminaCost: res.staminaCost, res });
  }

  function finishRun(res: GatheringResource, spent: number) {
    // Sucesso/falha crítica
    const roll = Math.random();
    let qty = res.qtyMin + Math.floor(Math.random() * (res.qtyMax - res.qtyMin + 1));
    let narrative = "Coleta concluída.";

    if (roll < 0.05) {
      // falha crítica: stamina já foi gasta, sem loot
      narrative = "A lâmina desafinou e a chance passou. Nada coletado desta vez.";
      // devolve parte da stamina? opcional: não.
      // retorna cedo
      toast(narrative);
      return;
    }
    if (roll > 0.9) {
      qty *= 2;
      narrative = "Golpe perfeito! Você extraiu o dobro de recursos.";
    }

    // Loot principal
    const loot: { id: string; quantity: number }[] = [{ id: res.id, quantity: qty }];

    // Bônus
    if (res.bonusItemId && Math.random() < (res.bonusChance ?? 0)) {
      loot.push({ id: res.bonusItemId, quantity: 1 });
      narrative += " (Bônus raro encontrado!)";
    }

    // Entrega no inventário via provider
    try { game?.addLootToInventory?.(loot); } catch {}

    // XP de skill
    const updated = addSkillXP(skills, res.skill, res.xpSkill);
    setSkills(updated);

    // XP geral do player se disponível
    try { game?.giveXP?.(res.xpPlayer); } catch {}

    toast(narrative);
  }

  function toast(msg: string) {
    // toast simples usando alert; seu projeto pode usar um componente próprio.
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-alert
      console.log("[Coleta]", msg);
    }
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Coleta</h1>
        <p className="text-white/80 max-w-3xl">
          A floresta sussurra e as minas ecoam. Seu machado e sua picareta contam histórias no ritmo da sua
          stamina — cada golpe rende experiência, recursos e, às vezes, pequenas bênçãos da sorte.
        </p>
      </header>

      {/* FLORESTA */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <Trees className="w-6 h-6 text-emerald-300" />
          <h2 className="text-xl font-semibold">Floresta</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forest.map(({ r, canUse }) => (
            <ResourceCard
              key={r.id}
              res={r}
              canUse={canUse && stamina >= r.staminaCost}
              onGather={() => startGather(r)}
              running={run.status === "running" && run.res.id === r.id}
              progress={run.status === "running" && run.res.id === r.id ? progress : 0}
            />
          ))}
        </div>
      </section>

      {/* MINAS */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <Pickaxe className="w-6 h-6 text-sky-300" />
          <h2 className="text-xl font-semibold">Minas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mine.map(({ r, canUse }) => (
            <ResourceCard
              key={r.id}
              res={r}
              canUse={canUse && stamina >= r.staminaCost}
              onGather={() => startGather(r)}
              running={run.status === "running" && run.res.id === r.id}
              progress={run.status === "running" && run.res.id === r.id ? progress : 0}
            />
          ))}
        </div>
      </section>

      {/* Rodapé narrativo */}
      <footer className="pt-6 text-sm text-white/70 max-w-3xl">
        Ferramentas afiadas, mente atenta. Quanto mais você colhe, mais afiados ficam os seus sentidos —
        e um dia a madeira vai cantar e o minério vai brilhar antes mesmo da primeira pancada.
      </footer>
    </div>
  );
}
