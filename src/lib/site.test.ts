import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { projects, services, processSteps, site } from "../config/site";

describe("conteúdo do site", () => {
  it("todos os slugs de projeto são únicos e seguros para URL", () => {
    const slugs = projects.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("há exatamente seis cases, como especificado", () => {
    assert.equal(projects.length, 6);
  });

  it("cada projeto tem variante de arte válida, abordagem e resultado", () => {
    for (const p of projects) {
      assert.ok([0, 1, 2, 3, 4, 5].includes(p.art), `arte inválida em ${p.slug}`);
      assert.ok(p.approach.length >= 2, `abordagem curta em ${p.slug}`);
      assert.ok(p.outcome.length > 0 && p.challenge.length > 0);
    }
  });

  it("todas as métricas são marcadas como demonstrativas", () => {
    for (const p of projects) {
      assert.ok(p.metrics.length >= 1);
      for (const m of p.metrics) {
        assert.match(m.label, /demonstrativ|decisão de direção/i, `métrica sem rótulo em ${p.slug}`);
      }
    }
  });

  it("serviços e processo estão preenchidos", () => {
    assert.equal(services.length, 4);
    assert.ok(services.every((s) => s.deliverables.length >= 2));
    assert.equal(processSteps.length, 4);
  });

  it("links de navegação são rotas internas", () => {
    for (const item of site.nav) assert.ok(item.to.startsWith("/"));
  });
});
