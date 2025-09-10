# Aldor Idle

Protótipo de RPG idle/managerial inspirado em mundos de fantasia medieval (Mushoku Tensei / Gladiatus / Melvor Idle).

## ⚙️ Stack e Estrutura
- **Next.js 14** + **React 18**
- **TailwindCSS**
- **SQLite local (autosave client-side)** — sem API/Prisma
- **Autosave multi-slot**: até 5 saves por usuário (`userId:slot:playerId`), persistido localmente no navegador.

## 🎮 Gameplay e Features
- **Atributos do jogador**: força, destreza, vigor, arcano, carisma, sagacidade.
- **Economia**: moedas (ouro, prata, bronze, cobre), conversão interna para cobre.
- **Inventário**: itens, equipamentos, poções, kits de reparo, durabilidade exposta na UI.
- **Guilda**:
  - Contratos (15+ missões) com rank F→SSS.
  - Afinidade com missões (quanto mais repetir, maior chance de sucesso).
  - Afinidade com NPCs (sinergia se repetir interações).
  - Promoção de rank automática baseada em contratos concluídos.
  - Filtros/ordenação por rank, duração, risco, recompensa.
  - Cadeia de contratos com recompensa épica final.
  - Indicador visual de progresso para próximo rank.
- **Combate simulado**:
  - `simulateCombat` considera atributos, buffs/debuffs, armas/armaduras e damageModel.
  - Derrota aplica debuffs reais (hpLoss, durabilidade, penalidades).
- **Drops**: sistema de loot aleatório diferenciado por missão (itens, moedas, XP).
- **Mercado**: ofertas rotativas a cada 6h com preço/estoque.
- **Crafting**: receitas (RECIPES) para criar equipamentos/consumíveis.
- **HUD/Header**: mostra nome, rank, HP, moedas e relógio interno.
- **Modal de resultados**: exibe loot, XP, moedas, chance real e dano recebido.

## ✅ Melhorias já implementadas
- Afinidade de missões e NPC reintroduzidas e amarradas ao playerId.
- Debug overlay mostrando playerId, rank, contratos e afinidades.
- Sistema de reparo de itens (kit ou ferreiro).
- Modal de resultado mais completo.
- Inventário global, persistido por save.
- Promoção de rank revalidada em cada missão.
- Filtros de guilda (rank, risco, duração, recompensa).

## 🐞 Problemas e Correções Frequentes
1. **`'use client'` no Next.js 14**  
   - Sempre precisa estar na primeira linha.  
   - Erro clássico: *The 'use client' directive must be placed before other expressions*.

2. **Estado e Save multi-slot**  
   - Bugs de estado compartilhado entre saves.  
   - Corrigido usando `userId:slot:playerId` como chave única.

3. **Promoção de rank**  
   - Falhas por falta de import (`getNextRank`, `countCompletedAtOrAbove`).  
   - Hoje: usa `canPromote`, `rankThresholds` e helpers importados de `rankProgress.ts`.

4. **Função `undertakeQuest`** (a mais problemática)  
   - Variável `res` usada dentro do `setState` sem estar definida.  
   - Uso de `mul` inexistente.  
   - `return` no lugar errado → sintaxe quebrada.  
   - **Correção final**: calcular `res = simulateCombat(...)` **antes** do `setState` e só usar depois.

5. **Imports duplicados/mal formatados**  
   - Ex: juntar `import React` com `import rankProgress` na mesma linha → erro de sintaxe.

6. **ID de player**  
   - `newId()` não existia → substituído por `crypto.randomUUID()`.

7. **Afinidade**  
   - Foi removida sem querer em patches → recriada e persistida em `player.npcAffinity` e `player.missionAffinity`.

8. **Inventário**  
   - Inicialmente não persistia ou mostrava itens.  
   - Hoje é global, persistido no provider e renderizado na UI.

## 🚨 Notas para IA / Futuro Dev
- **Nunca remover funcionalidades existentes** sem aviso (ex: afinidade, drops).  
- **Revisar o projeto inteiro antes de aplicar patches** para não quebrar saves ou UI.  
- **Ao alterar `undertakeQuest`, revisar se `res`, afinidades e promoção de rank continuam funcionando.**  
- **Validação rigorosa em imports**: sempre separar `React` e `rankProgress`.  
- **Manter compatibilidade entre Praça e Guilda** (missões).  
- **Itens, inventário, moedas, XP, atributos, skills, debuffs, afinidades e contratos devem sempre ser player-scoped.**

## 📜 Histórico
- Versão inicial previa API `/api/players` com Prisma + SQLite.
- **Simplificado para singleplayer**: hoje usa apenas autosave local multi-slot, sem backend/API.
