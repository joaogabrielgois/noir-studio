export type ContactForm = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  /** Campo honeypot: deve permanecer vazio. Bots costumam preenchê-lo. */
  website: string;
};

export type ContactErrors = Partial<Record<keyof ContactForm, string>>;

export const emptyContact: ContactForm = {
  name: "",
  email: "",
  company: "",
  budget: "",
  message: "",
  website: "",
};

export const budgetOptions = [
  "Ainda não sei",
  "Até R$ 20 mil",
  "R$ 20 a 60 mil",
  "Acima de R$ 60 mil",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2) errors.name = "Informe seu nome completo.";
  if (!EMAIL.test(values.email.trim())) errors.email = "Use um e-mail válido, por exemplo nome@empresa.com.";
  if (values.message.trim().length < 20) errors.message = "Conte um pouco mais — pelo menos 20 caracteres.";
  if (values.message.length > 2000) errors.message = "Mensagem muito longa. Limite de 2000 caracteres.";
  return errors;
}
