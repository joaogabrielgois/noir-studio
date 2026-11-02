import type { ContactForm } from "./validate";

export type SubmitResult = "sent" | "demo";

/**
 * Envia o formulário para VITE_CONTACT_ENDPOINT (POST JSON).
 * Sem endpoint configurado, roda em modo demonstração: nada é enviado.
 */
export async function submitContact(data: ContactForm): Promise<SubmitResult> {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return "demo";
  }

  const payload = {
    name: data.name,
    email: data.email,
    company: data.company,
    budget: data.budget,
    message: data.message,
    source: window.location.href,
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Falha no envio (HTTP ${res.status})`);
  return "sent";
}
