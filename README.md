# NOIR STUDIO

Site de agência criativa **fictícia** para demonstração: home cinematográfica, seis cases com storytelling, serviços, sobre (manifesto, equipe e processo), contato com validação e página 404.

**Stack:** React 18 · TypeScript 5.6 · Vite 5 · Tailwind CSS 3.4 · GSAP 3 (com ScrollTrigger) · @gsap/react 2 · React Router 6.28
**Node:** 20 LTS (ver `.nvmrc`), mínimo 18.18.

> Conteúdo fictício: clientes, equipe, métricas e depoimentos são demonstrativos e rotulados como tal. As imagens dos projetos são renders 3D originais, gerados por script (ver seção de imagens), não fotografias de terceiros.

---

## 1. Instalação e execução local

```bash
npm install            # gera o package-lock.json (commite-o no seu repositório)
npm run dev            # http://localhost:5173
```

Variáveis opcionais: copie `.env.example` para `.env` e preencha (ver seção 4). O `.env` é ignorado pelo Git.

## 2. Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run typecheck` | `tsc --noEmit` para o app **e** `tsc -p tsconfig.test.json` para os testes |
| `npm test` | Testes unitários com `node:test` + `tsx` (formulário, conteúdo e existência das imagens) |
| `npm run images` | Renderiza as seis cenas (Python + numpy) e gera AVIF/WebP (sharp) em `public/images/projects` |
| `npm run build` | Checagem de tipos do app + build de produção em `dist/` |
| `npm run preview` | Serve `dist/` localmente, como em produção |

Fluxo recomendado antes de publicar: `npm install` → `npm run typecheck` → `npm test` → `npm run build` → `npm run preview` e revisão manual.

## 3. Estrutura

```
src/
  main.tsx                 entrada, BrowserRouter, StrictMode
  App.tsx                  rotas, layout, lazy loading, scroll ao trocar de página
  config/site.ts           TODO o conteúdo editável (textos, projetos, serviços, equipe, nav)
  components/
    Header.tsx             cabeçalho fixo, estado ao rolar, botão do menu
    MenuOverlay.tsx        menu fullscreen: animação, Esc, foco preso, devolução do foco
    Cursor.tsx             cursor personalizado (desktop com ponteiro fino, sem reduced motion)
    Magnetic.tsx           efeito magnético (mesma condição do cursor)
    Reveal.tsx             entrada ao rolar (ScrollTrigger, once)
    PageTransition.tsx     transição entre rotas
    HeroOrb.tsx            objeto SVG animado do hero (estático em dispositivos fracos)
    Artwork.tsx            imagens otimizadas dos projetos (AVIF/WebP, srcset)
    Footer.tsx, SEO.tsx
  hooks/useMotion.ts       reduced motion, ponteiro fino, detecção de dispositivo fraco
  lib/
    gsap.ts                registro do ScrollTrigger (import único)
    seo.ts                 título, descrição, canonical e Open Graph por rota
    validate.ts            regras do formulário de contato
    submit.ts              envio para VITE_CONTACT_ENDPOINT ou modo demonstração
    *.test.ts              testes unitários
  pages/                   Home, Projects, ProjectDetail, Services, About, Contact, NotFound
  styles/index.css         base tipográfica, classes de display, animações utilitárias
public/                    favicon.svg, og.svg
```

Rotas: `/`, `/projetos`, `/projetos/:slug` (seis slugs em `config/site.ts`), `/servicos`, `/sobre`, `/contato`, `*` → 404.

## 4. Variáveis de ambiente

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `VITE_SITE_URL` | Recomendada | Domínio público, usado em canonical, `og:url` e `og:image`. Sem ela, o padrão `https://seu-dominio.com` aparece nos metadados |
| `VITE_CONTACT_ENDPOINT` | Não | URL que recebe `POST` JSON com `name`, `email`, `company`, `budget`, `message` e `source`. Sem ela, o formulário valida e informa o modo demonstração, sem enviar nada |

**Atenção:** variáveis `VITE_*` são embutidas no JavaScript público. Nunca coloque chaves secretas nelas. Para enviar e-mail com chave privada (Resend, SendGrid, SMTP), crie uma função serverless (`/api/contact`) que guarda a chave no servidor, e aponte `VITE_CONTACT_ENDPOINT` para ela. Serviços como Formspree aceitam o endpoint público sem expor segredos.

Na Vercel, configure as variáveis em **Project → Settings → Environment Variables**, para os ambientes Production e Preview, e faça um novo deploy (variáveis `VITE_*` são fixadas no build).

## 5. Publicar na Vercel

**Pelo painel (recomendado)**
1. Suba o projeto para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Em vercel.com: **Add New → Project** e importe o repositório.
3. A Vercel detecta Vite. Confirme: Install `npm install`, Build `npm run build`, Output `dist`. (Já estão definidos em `vercel.json`.)
4. Adicione as variáveis da seção 4.
5. **Deploy.** Cada push na branch principal gera um deploy de produção; outras branches geram previews.

**Pela CLI**
```bash
npm i -g vercel
vercel            # preview
vercel --prod     # produção
```

**Configuração incluída em `vercel.json`**
- Rewrite SPA: todas as rotas caem em `index.html`, então `/projetos/halo-mobility` funciona ao recarregar ou compartilhar o link.
- Cache de um ano e `immutable` para `/assets/*` (arquivos com hash no nome).
- Cabeçalhos de segurança: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` e `Permissions-Policy`.

**Depois do primeiro deploy:** troque `VITE_SITE_URL` pelo domínio final, adicione o domínio em **Settings → Domains**, e confirme os metadados com um validador de Open Graph.

## 6. Acessibilidade e movimento

- Link "Pular para o conteúdo" no início da página; foco visível em todos os elementos interativos.
- Menu com `role="dialog"`, `aria-expanded`, `aria-controls`, fechamento com Esc, foco preso enquanto aberto e devolução do foco ao botão ao fechar.
- Formulário com `label` explícito, `aria-invalid`, `aria-describedby`, foco no primeiro campo com erro, `role="status"` para sucesso e `role="alert"` para falhas.
- **`prefers-reduced-motion: reduce`** desativa: transições de entrada (Reveal, PageTransition, menu em duração mínima), magnetismo, cursor personalizado, parallax do objeto e a faixa de clientes (marquee é estática). Há também uma regra CSS global que encurta todas as animações.
- Cursor personalizado e magnetismo só são ativados com ponteiro fino (`hover: hover` e `pointer: fine`). Em touch, o comportamento nativo é mantido.
- Dispositivos fracos (≤ 4 núcleos ou economia de dados ativa) veem o objeto do hero estático.

## 7. Desempenho

- Rotas de projeto, serviços, sobre, contato e 404 são carregadas sob demanda (`React.lazy`); a home é carregada de imediato.
- Imagens em AVIF (preferencial) e WebP, em 800, 1200 e 1600 px, com `srcset` e `sizes`. O navegador baixa apenas a largura necessária.
- Imagens abaixo da dobra são `loading="lazy"`; a imagem do hero de cada case é `priority` (carregamento imediato).
- Dimensões `width`/`height` declaradas para evitar deslocamento de layout (CLS).
- Fontes do Google com `preconnect` e `display=swap`.
- Animações apenas com `transform` e `opacity`/`visibility`; ScrollTrigger com `once: true`; listeners de scroll `passive`.
- O grão de fundo é um SVG rasterizado uma vez, sem animação.

## Imagens

As imagens dos seis cases são **renders 3D originais**, gerados por `scripts/render-art.py`. Cada cena é uma composição própria (anéis, grade de potes, fone abstrato, volumes arquitetônicos, cápsulas, garrafa), com sombra suave, oclusão ambiente, reflexos aproximados, bloom e grão. Não há fotografia de terceiros, portanto não há obrigações de licença de banco de imagem.

Para regenerar:
```bash
pip install numpy pillow          # Python 3.10+
npm install                       # inclui sharp
npm run images
```
Renders em 1600×1200 levam de 15 a 230 segundos cada, conforme a complexidade da cena. Os brutos ficam em `scripts/_raw/` e não são versionados.

**Para trocar por fotografias reais:** coloque os arquivos licenciados (com o nome do slug) em `public/images/projects/` nas três larguras e nos dois formatos, ou ajuste `scripts/optimize-art.mjs` para lê-los. Mantenha a proporção 4:3 e o assunto centralizado, porque o layout corta as laterais em telas de celular (`object-fit: cover`). Confira também a licença de uso (Unsplash e Pexels permitem uso comercial sem atribuição obrigatória, mas exigem respeito às regras de cada plataforma).

## 8. SEO e metadados

- `<title>`, `description`, `canonical`, `og:title`, `og:description`, `og:url`, `og:image` e `twitter:card` são atualizados em cada rota (`src/lib/seo.ts`).
- `public/og.svg` é o card de compartilhamento. Muitas redes exigem PNG de 1200×630: converta e atualize `index.html` e `src/lib/seo.ts` se necessário.
- A página 404 recebe `noindex`.
- Não há `sitemap.xml` nem `robots.txt`. Recomendo adicioná-los ao publicar (ver pendências).

## 9. Testes

```bash
npm test
```

Cobrem: regras do formulário (nome, e-mail, tamanho da mensagem, campos obrigatórios) e integridade do conteúdo (slugs únicos e seguros, seis cases, variantes de arte válidas, métricas rotuladas como demonstrativas, serviços e processo preenchidos, navegação com rotas internas).

Não há testes de interface (E2E) nem de snapshot. Para adicioná-los: Playwright (`npx playwright install`) testando navegação, menu, formulário e 404.

## 10. Checklist antes do lançamento

- [ ] Trocar clientes, equipe, textos, e-mail e localização em `src/config/site.ts`
- [ ] Revisar as imagens de cada case em celular e desktop; trocar por fotografias licenciadas se quiser o estilo fotográfico
- [ ] Definir `VITE_SITE_URL` e publicar um `og` PNG 1200×630
- [ ] Configurar `VITE_CONTACT_ENDPOINT` e testar um envio real
- [ ] Rodar `npm run typecheck`, `npm test`, `npm run build` e `npm run preview`
- [ ] Revisar em celular, tablet e desktop (Chrome, Safari, Firefox)
- [ ] Testar navegação por teclado e com leitor de tela
- [ ] Testar com `prefers-reduced-motion` ativado no sistema operacional
- [ ] Rodar Lighthouse (desempenho, acessibilidade, SEO) em produção
- [ ] Configurar o domínio e conferir o cache e os cabeçalhos com as ferramentas do navegador

## 11. Pendências conhecidas

- O `package-lock.json` não está incluído: ele deve ser gerado com `npm install` no seu ambiente.
- Sem `sitemap.xml`/`robots.txt`.
- As imagens são renders estilizados, não fotografias editoriais. Fotografia real exige contratação ou seleção de banco de imagem com licença.
- Sem Content-Security-Policy: adicioná-la exige testar Google Fonts, o endpoint de contato e os scripts do Vite. Está documentado como próxima etapa.
- Sem testes E2E nem Lighthouse automatizado.
