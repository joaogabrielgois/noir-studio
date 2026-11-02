import { site } from "../config/site";

type SEOInput = { title: string; description?: string; path?: string; image?: string };

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Atualiza título, descrição, canonical e Open Graph para a rota atual. */
export function setSEO({ title, description = site.description, path = "/", image = "/og.svg" }: SEOInput) {
  const fullTitle = title === site.name ? `${site.name} — Estúdio criativo` : `${title} · ${site.name}`;
  const base = site.url.replace(/\/$/, "");
  const url = `${base}${path}`;

  document.title = fullTitle;
  setMeta('meta[name="description"]', "name", "description", description);
  setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
  setMeta('meta[property="og:description"]', "property", "og:description", description);
  setMeta('meta[property="og:url"]', "property", "og:url", url);
  setMeta('meta[property="og:image"]', "property", "og:image", `${base}${image}`);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}
