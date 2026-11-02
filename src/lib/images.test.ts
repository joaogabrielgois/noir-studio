import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSlugs, projects } from "../config/site";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, "..", "..", "public", "images", "projects");

describe("imagens dos projetos", () => {
  it("cada projeto usa a imagem do próprio slug", () => {
    for (const p of projects) {
      assert.equal(imageSlugs[p.art], p.slug, `variante ${p.art} não corresponde a ${p.slug}`);
    }
  });

  it("não há duas variantes apontando para a mesma imagem", () => {
    assert.equal(new Set(imageSlugs).size, imageSlugs.length);
  });

  it("existem AVIF e WebP nas três larguras para cada projeto", () => {
    for (const slug of imageSlugs) {
      for (const w of [800, 1200, 1600]) {
        for (const ext of ["avif", "webp"]) {
          const file = path.join(dir, `${slug}-${w}.${ext}`);
          assert.ok(existsSync(file), `arquivo ausente: ${file}`);
          assert.ok(statSync(file).size > 1000, `arquivo suspeito (muito pequeno): ${file}`);
        }
      }
    }
  });
});
