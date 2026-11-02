import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { emptyContact, validateContact, type ContactForm } from "./validate";

const valid: ContactForm = {
  name: "Maria Silva",
  email: "maria@empresa.com.br",
  company: "",
  budget: "",
  message: "Queremos reposicionar a marca antes do lançamento de outubro.",
  website: "",
};

describe("validateContact", () => {
  it("aceita um formulário válido sem erros", () => {
    assert.deepEqual(validateContact(valid), {});
  });

  it("rejeita nome curto", () => {
    const errors = validateContact({ ...valid, name: " A " });
    assert.ok(errors.name);
  });

  it("rejeita e-mail malformado", () => {
    for (const email of ["maria", "maria@", "maria@empresa", "a b@c.com"]) {
      assert.ok(validateContact({ ...valid, email }).email, `deveria rejeitar: ${email}`);
    }
  });

  it("exige mensagem com pelo menos 20 caracteres", () => {
    assert.ok(validateContact({ ...valid, message: "oi, tudo bem?" }).message);
  });

  it("limita a mensagem a 2000 caracteres", () => {
    assert.ok(validateContact({ ...valid, message: "x".repeat(2001) }).message);
  });

  it("formulário vazio aponta erros em todos os campos obrigatórios", () => {
    const errors = validateContact(emptyContact);
    assert.ok(errors.name && errors.email && errors.message);
    assert.equal(errors.company, undefined);
  });
});
