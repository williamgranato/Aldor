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


# Aldor Idle - Atualização do Mercado e Provider

## 📦 O que mudou nesta versão

### GameProvider (`context/GameProvider_aldor_client.tsx`)
- **Campo `market`** adicionado ao estado inicial para armazenar os itens do mercado diário.
- **Regen de Stamina**: continua funcionando (+1 a cada 5 segundos).
- **Novo Regen de HP**: agora o jogador recupera **+1 HP a cada 3 segundos**, até o máximo definido em `stats.maxHp`.
- Nenhuma função original foi removida, apenas complementada.
- `addLootToInventory`, `giveCoins` e `touch` permanecem disponíveis para integração com o mercado e outros sistemas.

### Mercado Novo
Substitui totalmente o antigo sistema baseado em `useDailyMarket`.

- **Arquivos principais**:
  - `hooks/useMarket.ts`
  - `components/market/Market.tsx`
  - `components/market/MarketCard.tsx`
  - `components/market/MarketModal.tsx`
  - `components/market/MarketProviderBridge.tsx`
  - `app/mercado/page.tsx`

- **Lógica**:
  - Geração de itens **diária** baseada em `world.dateMs` (seed determinística).
  - Filtra apenas **armas, armaduras, acessórios/joias e consumíveis**.
  - Cada item tem estoque inicial (1–3 unidades).
  - Estoque e lista são **persistidos no save** em `state.market[dayKey]`.
  - Compra:
    - Deduz moedas do jogador (conversão cobre ⇄ pouch).
    - Adiciona item ao inventário.
    - Atualiza estoque persistido.
    - Dispara autosave (`touch`).

- **Imersão visual** (usa `framer-motion` e `lucide-react`):
  - **Ambientação dinâmica**: cabeçalho muda narrativa e cor baseada em estação/clima.
  - **Vitrines do dia**: 1–2 itens podem aparecer com destaque visual (🔥 Oferta).
  - **Frase do mercador**: contextual (ex.: "Chegou um lote de aço das Montanhas Cinzentas!").
  - **Ícones por categoria**: armas = sabre, armaduras = shield, acessórios = gem, consumíveis = flask.
  - **Coleções semanais**: agrupamento temático (visual apenas).
  - **Histórico de compras**: últimos 3 itens aparecem no rodapé do modal.
  - **Feedback tátil**: cards dão "pop" ao comprar e ficam esmaecidos se esgotados.

## 🚀 Como atualizar
1. **Remover arquivos antigos do mercado**:
   - `hooks/useDailyMarket.ts`
   - `components/Market.tsx`
   - `components/MarketCard.tsx`
   - `components/MarketModal.tsx`
   - `components/MarketProviderBridge.tsx`

2. **Substituir** pelos novos arquivos incluídos neste patch.

3. **Instalar dependências visuais** (caso ainda não tenha):
   ```bash
   npm install framer-motion lucide-react
   ```

4. **Rodar o jogo** e acessar `/mercado` para ver o novo mercado em ação.

## 🔮 Próximos Passos (opcional)
- Adicionar **mini vitrines destacadas** no topo do mercado (coleções do dia).
- Efeitos visuais extras em itens de raridade épica+ (glow animado).
- Expandir narrativa do mercador para refletir eventos do mundo (missões especiais, feriados etc.).


## 📌 Próximos Passos
- Molduras visuais no inventário (**parcialmente feito**: já no histórico e no modal).
- Sistema de combate mais profundo.
- Taverna funcional (descanso recupera stamina/HP).
- Ofertas diárias no mercado.
- Reputação com NPCs.

---

## 👑 Créditos
Projeto *Game do Will* — evolução contínua com base em feedback e patchs incrementais.  
