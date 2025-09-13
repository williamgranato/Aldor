# Dev Notes - Histórico de Erros e Soluções

Este arquivo documenta erros que já ocorreram no projeto Aldor Idle e como foram (ou devem ser) resolvidos.
Serve como referência para evitar repetir os mesmos problemas no futuro.

---

## 1. `Unexpected token div` / `Return statement is not allowed here`
- **Arquivo:** `app/page.tsx`
- **Causa:** `return (...)` estava fora de um componente React válido.
- **Raiz:** uso incorreto de `};` ao fechar funções declaradas com `function nome() { }`.
- **Solução:** garantir que todas as funções declaradas fechem apenas com `}`. `};` só em arrow functions atribuídas a `const`.

---

## 2. `The default export is not a React Component in page: "/praca"`
- **Arquivo:** `app/praca/page.tsx`
- **Causa:** exportava `export default function PracaPage()` em vez de `Page()`.
- **Solução:** usar `export default function Page(){ ... }` no App Router.

---

## 3. `getPracaMissions is not a function`
- **Arquivo:** `app/praca/page.tsx` / `data/missoes.ts`
- **Causa:** import incorreto. O módulo não exportava `getPracaMissions` como função.
- **Solução:** alinhar export/import. Se o módulo exportar um array, importar o default; se exportar função, usar import nomeado.

---

## 4. Webpack cache corrompido (`invalid block type`)
- **Causa:** sequência de builds quebrados e Hot Reload corromperam `.next/cache`.
- **Solução:** limpar cache manualmente (`rm -rf .next` ou `Remove-Item -Recurse -Force .next` no Windows).

---

## 5. 404 de imagens (`/images/items/images/items/...`)
- **Causa:** paths duplicados ao renderizar ícones (concatenação dupla).
- **Solução:** criar helper para normalizar caminhos, ex.:
  ```ts
  export function iconSrc(icon: string) {
    return `/images/items/${icon.replace(/^\/?images\/items\//, '')}`;
  }
  ```

---

## Observações
- Sempre verificar se cada `page.tsx` exporta um componente válido via `export default function Page(){}`.
- Evitar mudanças de sintaxe que causem `return` fora de escopo de função.
- Em caso de erros persistentes após correções, **limpar `.next` e reiniciar o dev server**.
