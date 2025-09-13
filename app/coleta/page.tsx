'use client';

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Trees, Pickaxe, Zap, Timer, Gift, Lock } from 'lucide-react'

// Game context (não quebra se o caminho variar)
let GameContext: any = null
try {
  // ajuste o caminho se seu projeto usar alias
  // @ts-ignore
  GameContext = require('../../context/GameProvider_aldor_client').GameContext
} catch {}

import { GATHERING_RESOURCES, type GatheringResource } from '../../data/gathering_catalog'
import { addSkillXp, loadSkills, type GatheringSkill } from '../../data/gathering_utils'

type CtxType = {
  state?: any
  giveXP?: (n: number)=>void
  addLootToInventory?: (items: any[])=>void
  spendStamina?: (n: number)=>boolean
}

function useGameCtx(): CtxType {
  // fallback seguro se o contexto não existir
  const ReactCtx = (GameContext ? React.useContext(GameContext) : {})
  return ReactCtx || {}
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded">
      <div
        className="h-2 bg-emerald-500 rounded transition-all"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

function ResourceCard({
  res,
  locked,
  onCollect
}: {
  res: GatheringResource
  locked: boolean
  onCollect: (res: GatheringResource) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: locked ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className={`relative rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm shadow-md ${locked ? 'opacity-60' : ''}`}
    >
      <div className="flex gap-3 items-start">
        <div className="w-14 h-14 relative shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/30">
          <Image src={res.image} alt={res.name} fill sizes="56px" className="object-contain p-1" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold">{res.name}</div>
            <span className="text-xs text-white/60 flex items-center gap-1">{locked && <Lock size={14}/>}Lv {res.reqLevel}</span>
          </div>
          <p className="text-sm text-white/80">{res.desc}</p>
          <div className="mt-2 text-xs text-white/70 flex flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1"><Timer size={14}/> {res.timeMs/1000}s</span>
            <span className="inline-flex items-center gap-1"><Zap size={14}/> {res.staminaCost}</span>
            <span>Qty {res.qtyMin}-{res.qtyMax}</span>
            {res.bonusItemId ? (
              <span className="inline-flex items-center gap-1"><Gift size={14}/> {Math.round((res.bonusChance ?? 0)*100)}%</span>
            ) : null}
          </div>
        </div>
      </div>
      <button
        disabled={locked}
        onClick={()=>onCollect(res)}
        className="mt-3 w-full rounded-lg px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {locked ? `Desbloqueia no nível ${res.reqLevel}` : 'Coletar'}
      </button>
    </motion.div>
  )
}

function Section({
  title,
  icon,
  group,
  playerLevel,
  onCollect
}: {
  title: string
  icon: React.ReactNode
  group: 'wood' | 'ore'
  playerLevel: number
  onCollect: (res: GatheringResource) => void
}) {
  const list = useMemo(
    () => GATHERING_RESOURCES.filter(r => r.group === group).sort((a,b)=>a.reqLevel-b.reqLevel),
    [group]
  )

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(res => {
          const locked = playerLevel < res.reqLevel
          return (
            <ResourceCard key={res.itemId} res={res} locked={locked} onCollect={onCollect} />
          )
        })}
      </div>
    </section>
  )
}

export default function ColetaPage() {
  const ctx = useGameCtx()
  const playerLevel = ctx?.state?.player?.level ?? ctx?.state?.playerLevel ?? 1
  const stamina = ctx?.state?.stamina ?? ctx?.state?.player?.stamina ?? 100

  const [progress, setProgress] = useState(0)
  const [working, setWorking] = useState<GatheringResource | null>(null)
  const [skills, setSkills] = useState(loadSkills())

  useEffect(()=>{
    let id: any
    if (working) {
      const start = Date.now()
      const run = () => {
        const elapsed = Date.now() - start
        const pct = (elapsed / working.timeMs) * 100
        if (pct >= 100) {
          setProgress(100)
          const finished = working
          setWorking(null)
          // entrega loot
          finishCollect(finished)
          return
        }
        setProgress(pct)
        id = requestAnimationFrame(run)
      }
      id = requestAnimationFrame(run)
    } else {
      setProgress(0)
    }
    return ()=> cancelAnimationFrame(id)
  }, [working])

  function finishCollect(res: GatheringResource) {
    // Quantidade
    const qty = Math.floor(Math.random()*(res.qtyMax - res.qtyMin + 1)) + res.qtyMin
    const items = [{ id: res.itemId, quantity: qty }]
    // Bonus
    if (res.bonusItemId && Math.random() < (res.bonusChance ?? 0)) {
      items.push({ id: res.bonusItemId, quantity: 1 })
    }
    // Inventário do jogo (se existir)
    ctx?.addLootToInventory?.(items)
    // XP geral (opcional)
    ctx?.giveXP?.(Math.max(1, Math.floor(res.timeMs/2000)))
    // Skills locais
    const skill: GatheringSkill = (res.group === 'wood' ? 'woodcutting' : 'mining')
    const updated = addSkillXp(skill, Math.max(5, Math.floor(res.timeMs/1000)))
    setSkills(updated)
  }

  function startCollect(res: GatheringResource) {
    // stamina custo
    if (ctx?.spendStamina && stamina < res.staminaCost) {
      alert('Stamina insuficiente.')
      return
    }
    ctx?.spendStamina?.(res.staminaCost)
    setWorking(res)
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coleta</h1>
        <div className="flex gap-4 text-sm">
          <span>Jogador: Lv {playerLevel}</span>
          <span>Stamina: {stamina}</span>
          <span>Madeireiro Lv {skills.woodcutting.level} ({skills.woodcutting.xp}/ {skills.woodcutting.level*100})</span>
          <span>Minerador Lv {skills.mining.level} ({skills.mining.xp}/ {skills.mining.level*100})</span>
        </div>
      </header>

      {working && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image src={working.image} alt={working.name} fill sizes="32px" className="object-contain" />
            </div>
            <div className="font-medium">Coletando {working.name}...</div>
          </div>
          <div className="mt-3">
            <ProgressBar progress={progress} />
          </div>
        </motion.div>
      )}

      {/* Floresta em cima */}
      <Section
        title="Floresta"
        icon={<Trees className="text-emerald-400" size={20}/>}
        group="wood"
        playerLevel={playerLevel}
        onCollect={startCollect}
      />

      {/* Minas em baixo */}
      <Section
        title="Minas"
        icon={<Pickaxe className="text-cyan-400" size={20}/>}
        group="ore"
        playerLevel={playerLevel}
        onCollect={startCollect}
      />

      <footer className="text-sm text-white/70 leading-relaxed">
        As florestas de Aldor sussurram com vida antiga e resina fresca — madeiras raras escondem bônus valiosos
        para artesãos atentos. Nas entranhas das montanhas, veios metálicos ecoam marteladas do futuro: cada extração
        consome sua energia, mas alimenta habilidades, experiência e a economia local. Gerencie sua stamina,
        suba de nível e transforme recursos brutos em lendas forjadas.
      </footer>
    </div>
  )
}
