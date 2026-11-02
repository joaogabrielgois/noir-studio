# Auditoria técnica e visual: NOIR STUDIO

Este documento registra o que foi verificado, o que foi corrigido e o que **não** foi testado. Ele existe para que nenhuma afirmação de qualidade seja feita sem evidência.

## 1. Ambiente da auditoria

- Sandbox sem acesso ao registro npm: `npm install`, `npm run build` e `vite` **não puderam ser executados**. O `package-lock.json` não foi gerado de propósito, porque um lockfile sem resolução real teria hashes inválidos.
- Disponíveis localmente: Node 22, TypeScript 6.0.3 global (o projeto fixa `~5.6.3`), tsx e React sem tipos.

## 2. Problemas encontrados e corrigidos

| # | Arquivo | Problema | Correção |
|---|---|---|---|
| 1 | `tsconfig.json` + testes | Arquivos de teste importam `node:test`, mas o `tsconfig` de build inclui `src/`. Sem `@types/node`, o `npm run build` falharia | Testes excluídos do build; `tsconfig.test.json` próprio com `types: ["node"]`; `@types/node` em devDependencies |
| 2 | `components/MenuOverlay.tsx` | Tipagem de `first`/`last` inferida como `unknown` no foco preso | Tipagem explícita `HTMLElement[]` |
| 3 | `components/MenuOverlay.tsx` | Ao fechar, o foco não voltava ao botão do menu; sem armadilha de Tab | Devolução do foco ao botão e Tab preso dentro do diálogo; `aria-hidden` quando fechado |
| 4 | `components/MenuOverlay.tsx` | Ordem dos links do menu invertida (`.reverse()` no array) | Início primeiro, depois a navegação na ordem definida |
| 5 | `pages/About.tsx` | `<div>` (Reveal) dentro de `<ol>`: HTML inválido | Reveal movido para dentro do `<li>` |
| 6 | `pages/ProjectDetail.tsx` | Lista de abordagens em `<ol>`, sem sequência real | `<ul>` |
| 7 | `config/site.ts` | `export const process` colide com o nome global `process` do Node/bundlers | Renomeado para `processSteps` (usado em Serviços e Sobre) |
| 8 | `config/site.ts` | `import.meta.env` acessado direto: quebra em testes em Node | Leitura defensiva de `import.meta.env` com valor padrão |
| 9 | `styles/index.css` | Classe `.font-display` duplicada com o utilitário do Tailwind | Removida a duplicata; a fonte vem do `tailwind.config.js` |
| 10 | `styles/index.css` | `.grain::after` com `inset: -50%` gerava uma camada fixa muito maior que a tela (custo de composição em mobile) | `inset: 0` |
| 11 | `components/Cursor.tsx` | `pointerleave` no `document` não confiável para ocultar o cursor ao sair da janela | Listener `mouseleave` no `<html>` |
| 12 | `components/HeroOrb.tsx` | Seletor global `"[data-core]"` dentro de um tween; `querySelector` pode retornar `null` | Busca escopada no elemento e checagem de `null` |
| 13 | `components/Header.tsx` | Sem estado ao rolar: header translúcido e fixo sem separação do conteúdo | Estado `scrolled` com fundo, borda e compactação suave |
| 14 | `vercel.json` | Ausência de cabeçalhos de segurança; `rewrites` sem exceções explícitas | Cabeçalhos adicionados; rewrite SPA padrão (arquivos estáticos já têm prioridade na Vercel) |
| 15 | `package.json` | Sem script de teste nem de typecheck separado; sem `tsx` | Scripts `test` e `typecheck`; `tsx` e `@types/node` em devDependencies |
| 16 | `.nvmrc` | Ausente | Criado com Node 20 |

## 3. Melhorias visuais e de experiência

- Faixa de clientes em rolagem contínua entre o hero e a introdução. Com reduced motion, a faixa fica estática (regra específica, para não deslocar o conteúdo).
- Header que ganha fundo e borda ao rolar, sem competir com o hero no topo.
- Menu fullscreen com tipografia maior e foco visível.
- Revelação de imagem no hover da lista de projetos (desktop), com fallback em miniatura no mobile.

## 4. Verificações realizadas

| Verificação | Resultado |
|---|---|
| Testes unitários (`node --test` com tsx): 12 casos | **12 aprovados, 0 falhas** |
| Transpilação de todos os 27 arquivos TS/TSX (sintaxe) | **0 erros** |
| Checagem de tipos do app com `tsc` strict + noUnused* | Erros restantes apenas de **módulos não instalados** (react, gsap, react-router-dom, tipos do Vite). Nenhum erro de lógica ou de tipagem interna do projeto |
| Validação de JSON (`package.json`, `tsconfig.json`, `vercel.json`) | Válidos |
| Varredura de segredos (chaves, tokens, senhas literais) | Nenhum encontrado |
| Imports locais entre os módulos (via checagem TypeScript) | Nenhum erro de módulo relativo: todos os imports locais resolvem. Exports nomeados conferidos por leitura |
| Revisão estática de classes Tailwind | Revisão por leitura apenas. Nenhuma classe foi validada pelo compilador do Tailwind (não instalado) |
| Revisão estática do uso de GSAP (quickTo, timeline, ScrollTrigger, svgOrigin) | Revisão por leitura apenas, sem execução. A API não foi validada contra o pacote instalado |

## 5. Testes NÃO realizados

- **`npm install`**: não executado (sem registro npm).
- **`npm run build` e `vite build`**: não executados. O build pode revelar erros de bundling que a análise estática não detecta.
- **`npm run typecheck` completo**: não executado com as dependências. A verificação parcial acima não substitui o typecheck real.
- **Execução no navegador**: nenhuma página foi renderizada. Não foram verificados layout responsivo, animações, cursor, menu, hover, formulário ou 404 visualmente.
- **Acessibilidade automatizada** (axe, Lighthouse): não executada.
- **Desempenho medido** (Lighthouse, Web Vitals): não executado.
- **E2E** (Playwright): não existe e não foi executado.

## 6. Pendências antes de publicar

1. Rodar `npm install`, `npm run typecheck`, `npm test`, `npm run build` e `npm run preview`.
2. Revisar cada página em 375px, 768px e 1440px, e com reduced motion ativado.
3. Testar o menu com teclado (Tab, Shift+Tab, Esc).
4. Rodar Lighthouse em produção.
5. Trocar os textos e dados fictícios, e definir `VITE_SITE_URL`.
6. Adicionar `sitemap.xml` e `robots.txt`.
7. Avaliar uma Content-Security-Policy depois de testar as fontes e o endpoint de contato.
