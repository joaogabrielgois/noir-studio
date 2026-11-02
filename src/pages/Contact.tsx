import { useState, type FormEvent, type ChangeEvent } from "react";
import SEO from "../components/SEO";
import { site } from "../config/site";
import { budgetOptions, emptyContact, validateContact, type ContactErrors, type ContactForm } from "../lib/validate";
import { submitContact } from "../lib/submit";

type Status = "idle" | "sending" | "sent" | "demo" | "error";

const field =
  "w-full border-b border-bone/25 bg-transparent py-3 text-lg text-bone placeholder:text-ash/50 outline-none transition-colors focus:border-acid aria-[invalid=true]:border-[#FF7A59]";

export default function Contact() {
  const [values, setValues] = useState<ContactForm>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    // Honeypot: bots preenchem o campo oculto. Fingimos sucesso sem enviar.
    if (values.website.trim() !== "") {
      setStatus("sent");
      return;
    }

    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const result = await submitContact(values);
      setStatus(result === "demo" ? "demo" : "sent");
      if (result === "sent") setValues(emptyContact);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  const done = status === "sent" || status === "demo";

  return (
    <div className="grid gap-20 px-5 pb-32 pt-36 md:grid-cols-12 md:px-10">
      <SEO title="Contato" path="/contato" description="Conte sobre o seu projeto ao NOIR STUDIO." />

      <aside className="md:col-span-5">
        <h1 className="font-display display-lg">Conte o que você constrói.</h1>
        <p className="body-lg mt-10 text-bone/75">
          Respondemos em até dois dias úteis, com uma primeira conversa sem compromisso.
        </p>
        <dl className="mt-16 space-y-6 text-sm">
          <div>
            <dt className="label">E-mail</dt>
            <dd className="mt-2"><a href={`mailto:${site.email}`} className="link-underline text-lg text-acid">{site.email}</a></dd>
          </div>
          <div>
            <dt className="label">Atendimento</dt>
            <dd className="mt-2 text-lg">{site.location}</dd>
          </div>
        </dl>
      </aside>

      <div className="md:col-span-6 md:col-start-7">
        {done ? (
          <div role="status" className="border-t border-acid pt-10">
            <h2 className="font-display display-md">{status === "sent" ? "Mensagem recebida." : "Formulário validado."}</h2>
            <p className="body-lg mt-6 text-bone/80">
              {status === "sent"
                ? "Obrigado. Respondemos em até dois dias úteis."
                : "Modo demonstração: nenhum e-mail foi enviado porque o endpoint de contato ainda não está configurado (VITE_CONTACT_ENDPOINT)."}
            </p>
            <button type="button" onClick={() => setStatus("idle")} className="link-underline mt-10 text-acid">
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-10" aria-describedby={status === "error" ? "form-error" : undefined}>
            <div>
              <label htmlFor="field-name" className="label">Nome</label>
              <input id="field-name" name="name" autoComplete="name" value={values.name} onChange={onChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "err-name" : undefined} className={field} placeholder="Seu nome completo" />
              {errors.name && <p id="err-name" className="mt-2 text-sm text-[#FF7A59]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="field-email" className="label">E-mail</label>
              <input id="field-email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "err-email" : undefined} className={field} placeholder="nome@empresa.com" />
              {errors.email && <p id="err-email" className="mt-2 text-sm text-[#FF7A59]">{errors.email}</p>}
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <label htmlFor="field-company" className="label">Empresa (opcional)</label>
                <input id="field-company" name="company" autoComplete="organization" value={values.company} onChange={onChange} className={field} />
              </div>
              <div>
                <label htmlFor="field-budget" className="label">Investimento estimado</label>
                <select id="field-budget" name="budget" value={values.budget} onChange={onChange} className={`${field} bg-noir`}>
                  <option value="">Escolha uma faixa</option>
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="field-message" className="label">Mensagem</label>
              <textarea id="field-message" name="message" rows={5} value={values.message} onChange={onChange} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "err-message" : undefined} className={`${field} resize-y`} placeholder="Qual é o desafio, o prazo e o que já existe?" />
              {errors.message && <p id="err-message" className="mt-2 text-sm text-[#FF7A59]">{errors.message}</p>}
            </div>

            {/* Honeypot: invisível para pessoas, preenchido por bots */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Site
                <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={onChange} />
              </label>
            </div>

            {status === "error" && (
              <p id="form-error" role="alert" className="text-sm text-[#FF7A59]">
                Não foi possível enviar agora. {errorMsg} Tente novamente ou escreva para {site.email}.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-3 rounded-full bg-acid px-8 py-5 text-noir transition-opacity disabled:opacity-60"
            >
              {status === "sending" ? "Enviando…" : "Enviar mensagem"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
