
# Aldória Guilds — Documentação do Projeto

Este é um protótipo de jogo **RPG idle/managerial** construído em **Next.js 14** com **React** e **TailwindCSS**.  
O objetivo é simular a vida de um aventureiro em uma cidade medieval/fantasia, com foco em **guilda**, **mercado**, **crafting** e **progressão de personagem**.

---

## Estrutura de Pastas

```
/components
  AldoriaGuilds.jsx   -> Arquivo principal do jogo (estado + lógica central)
  Header.jsx          -> Cabeçalho simplificado
  /ui
    HeaderHUD.jsx     -> HUD do aventureiro (nome, rank, hp/stamina, moedas)
  /tabs
    TabPrincipalView.jsx -> Tela principal (atributos, inventário rápido, ações)
    TabGuildaView.jsx    -> Tela da guilda (contratos)
    TabMercadoView.jsx   -> Tela do mercado (ofertas giratórias)
    TabLeilaoView.jsx    -> Tela do leilão semanal
    TabCraftingView.jsx  -> Tela de crafting (receitas)
/lib
  currency.js         -> Utilitário para formatar moedas (ouro, prata, cobre, bronze)
  db.ts               -> (opcional) Conexão Prisma/SQLite
/prisma
  schema.prisma       -> (opcional) Esquema Prisma para salvar jogadores
/app/api/players/route.ts -> API REST (GET/POST) para salvar/carregar jogadores
```

---

## Recursos do Jogo

### 🎭 Personagem
- Nome, nível, XP, atributos (`força`, `destreza`, `vigor`, `arcano`, `carisma`, `sagacidade`).
- HP e Stamina com barras visuais.
- Sistema de equipamentos (arma + armadura) com durabilidade.

### 💰 Sistema de Moedas
- Quatro camadas de moedas:
  - **Ouro**
  - **Prata**
  - **Cobre**
  - **Bronze**
- Internamente tudo é convertido em **bronze** (menor unidade).  
- Arquivo `lib/currency.js` faz conversões (fmtCoins, coinsToTotal).

### 🏹 TabPrincipalView
- Mostra atributos, XP, moedas e status geral.
- Inventário rápido com compra/venda/equipar itens.
- Ações: beber poção, golpe poderoso, usar kit de reparos.

### 📜 TabGuildaView
- Lista de contratos disponíveis, aceitos, concluídos, abandonados.
- Cada contrato mostra risco, tempo, recompensa e estrelas.
- Jogador pode aceitar, trabalhar +3h, concluir, ou abandonar (com multa).

### 🛒 TabMercadoView
- Ofertas que mudam a cada 6h no jogo.
- Itens com estoque e preço variável.
- Jogador pode comprar diretamente.

### ⚖️ TabLeilaoView
- Leilão semanal com lotes especiais.
- Jogador pode arrematar itens exclusivos.

### ⚒️ TabCraftingView
- Lista de receitas (`RECIPES`).
- Jogador pode craftar itens a partir dos recursos necessários.

### 🧾 Log e Debug
- Registro de eventos (contratos, crafting, etc).
- Debug interno com `JSON.stringify` (ativado em modo dev).

---

## Integração com Banco de Dados (Prisma + SQLite)

- `lib/db.ts` configura o Prisma Client.
- `prisma/schema.prisma` define modelo `Player`.
- `app/api/players/route.ts` permite:
  - `GET /api/players` → lista jogadores.
  - `POST /api/players` → cria jogador novo.

Rodar migrações:
```bash
npm install @prisma/client
npm install -D prisma
npx prisma migrate dev --name init
```

---

## Como Criamos a Estrutura

1. **Separação de UI e lógica:**
   - UI foi extraída em componentes (`HeaderHUD`, `Tab*View`).
   - Lógica central e estado permanecem em `AldoriaGuilds.jsx`.
   - As Views recebem um objeto `ctx` com todos os estados e ações necessários.

2. **Moedas remodeladas:**
   - HeaderHUD mostra moedas em coluna (uma linha para cada tipo).
   - Funções utilitárias em `lib/currency.js` fazem a conversão.

3. **Integração com API:**
   - Frontend (`AldoriaGuilds.jsx`) consulta API `/api/players`.
   - Se não houver jogador, mostra tela de criação de personagem.

4. **Expansão planejada:**
   - Inventário persistido em banco.
   - Sistema de itens raros, crafting avançado.
   - UI mais rica com animações e ícones personalizados.

---

## Como Usar Outras IAs Neste Projeto

- O README já descreve os módulos, recursos e integrações.
- Quando for pedir ajuda a uma IA, detalhe em qual módulo você precisa de alterações (ex.: "alterar TabGuildaView para permitir mais contratos simultâneos").
- A IA poderá navegar com base neste README e propor patches isolados.

---

## Comandos Úteis

- `npm run dev` → iniciar servidor Next.js em dev.
- `npx prisma studio` → abrir painel visual do banco SQLite.
- `curl http://localhost:3000/api/players` → testar API de jogadores.

---

## Conclusão

Este projeto já está modularizado e documentado.  
Você pode evoluir:
- Conectar frontend ao backend para persistir inventário.
- Adicionar IA para gerar novos contratos/itens aleatórios.
- Melhorar UI/UX com animações e ícones melhores.


### Controles no Header (Sessão)
- **Trocar save**: botão no topo (header) que chama `selectSlot(null)`, abrindo a **Seleção de Personagem**.
- **Sair**: botão no topo que executa `logout()`, retornando à tela de **Login/Criar conta**.
> Mantém layout e gradientes; sem dependências novas.
