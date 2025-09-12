# Patch: Mercado — Ofertas, Reputação e Pechincha

Data: 2025-09-12 07:57:09

Este patch adiciona **Ofertas-relâmpago (6h)**, **Reputação de Mercadores** e **Pechincha** sem quebrar o estado atual.
Ele evita mexer no GameProvider; a persistência de reputação/compra deve ser conectada pelo projeto (via callbacks).

## Arquivos incluídos
- `utils/images.ts` — Centraliza caminho de imagens para `/public/images/items`.
- `data/market_addons.ts` — Lógica de ofertas-relâmpago, reputação, pechincha.
- `components/MarketAddons.tsx` — UI plugável para exibir ofertas e negociar.

## Integração rápida
1. **Imagens**: padronize para usar `getItemImagePath(item.image)` em seus componentes de item.
2. **Tela do Mercado**: importe e renderize o componente:
   ```tsx
   import MarketAddons from '@/components/MarketAddons';
   import { updateReputation } from '@/data/market_addons';

   // Exemplo dentro da sua página/aba de mercado:
   <MarketAddons
     catalog={catalogoDeItensDoSeuProjeto}
     merchantId="mercador_geral"
     carisma={player?.attributes?.CARISMA ?? 0}
     reputationList={save?.reputation ?? []}
     onBuy={(itemId, price, merchantId)=> { api?.comprar?.(itemId, price, merchantId); /* marcar dirty */ }}
     onReputation={(merchantId, delta)=> { api?.reputationAdd?.(merchantId, delta); /* persistir */ }}
   />
   ```

3. **Persistência (opcional mas recomendado)**:
   - Adicione `reputation: ReputationEntry[]` ao seu save (por slot) e use as ações do provider.
   - Marque o **dirty flag** ao chamar `onBuy`/`onReputation`.

## Observação sobre imagens
Este patch **não move arquivos de imagem** automaticamente. Ele padroniza o caminho via `getItemImagePath`. 
Para migração total, mova seus PNGs para `public/images/items` e deixe `item.image` conter apenas `subpastas/arquivo.png`.

## Seguro para rollback
Todos os arquivos são **novos**; substituir/remover é trivial.
