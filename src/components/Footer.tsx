import { Link } from "react-router-dom";
import { site } from "../config/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-bone/10 px-5 pb-10 pt-20 md:px-10">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display display-md text-bone">Vamos construir algo<br className="hidden md:block" /> que ninguém esqueça?</p>
          <a href={`mailto:${site.email}`} className="link-underline mt-6 inline-block text-lg text-acid">
            {site.email}
          </a>
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-3 text-sm text-ash md:col-span-3 md:col-start-8">
          <span className="label mb-2">Páginas</span>
          {site.nav.map((i) => (
            <Link key={i.to} to={i.to} className="link-underline w-fit hover:text-bone">
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 text-sm text-ash md:col-span-2">
          <span className="label mb-2">Estúdio</span>
          <span>{site.location}</span>
          <span>© {year} {site.name}</span>
        </div>
      </div>
    </footer>
  );
}
