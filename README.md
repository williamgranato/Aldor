# Aldor Idle

Um RPG idle/managerial medieval no navegador — inspirado em Mushoku Tensei, Gladiatus e Melvor Idle.  
Construído em **Next.js 14 + React 18 + TypeScript + TailwindCSS**.

---

## 🚀 Funcionalidades

### 🎮 Personagem
- Criação de personagem épica:
  - Distribuição de **10 pontos** em Força, Destreza, Inteligência, Vigor e Sorte.
  - Escolha da **cidade de nascimento** (Continente → Reino → Cidade).
  - Mensagem criativa de boas-vindas.
- Atributos afetam:
  - **Stamina máxima**: 100 + 3×Inteligência.
  - Combate e chances nas missões (planejado).

### ⚡ Stamina
- Máx. 100 + 3×INT.
- Consumo: **5 por missão**.
- Regeneração: **+1 a cada 5s**.
- Exibida no Header e na tela inicial.

### 🏛️ Guilda
- Cadastro: custa **1 prata**.
- Modal explica progressão, loop de missões e stamina.
- Progressão de Rank:
  - F → E: 10 missões
  - E → D: 20 missões
  - D → C: 40 missões
  - … sempre dobrando
- Missões:
  - Título + descrição criativa.
  - Recompensas: XP, cobre, itens.
  - Botão **Loop** para repetir até acabar stamina.
- Histórico:
  - Últimas 15 missões listadas.
  - Drops exibidos com **ícones reais** (catálogo → `/public/images/items/...`).
  - Moldura colorida por raridade (badge pequeno: quadrado com borda + ícone + nome reduzido).
  - Tooltip simples: nome do item + raridade.

### 🏞️ Praça
- Sempre exibe **3 missões aleatórias**.
- Missões rápidas (3s).
- Também com barra de progresso + loop.

### 🎁 Loot
- Sorteio ponderado por raridade:
  - Comum → **cinza claro**
  - Incomum → **verde**
  - Raro → **azul**
  - Épico → **roxo**
  - Lendário → **laranja**
  - Mítico → **dourado**
- Itens caem no inventário, com nome, ícone e raridade.
- **MissionResultModal** exibe recompensas com a mesma lógica de moldura colorida + ícone.

### 💾 Save
- Save único por máquina em `localStorage`.
- Implementado com **dirty flag**:
  - Salva só quando o estado muda.
  - Flush em intervalos + `beforeunload`/`visibilitychange`.
- Ao **deletar conta**, volta para criação de personagem.

---

## 🛠️ Stack
- **Next.js 14 (App Router)**
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **lucide-react** (ícones)
- **framer-motion** (animações)

---

## 📌 Próximos Passos
- Molduras visuais no inventário (**parcialmente feito**: já no histórico e no modal).
- Sistema de combate mais profundo.
- Taverna funcional (descanso recupera stamina/HP).
- Ofertas diárias no mercado.
- Reputação com NPCs.

---

## 👑 Créditos
Projeto *Game do Will* — evolução contínua com base em feedback e patchs incrementais.  
