import { Link } from "react-router-dom";
import { projects, site } from "../config/site";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import Artwork from "../components/Artwork";

/** Ritmo assimétrico: colunas alternadas em desktop para quebrar a grade. */
const layout = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5 md:mt-10", "md:col-span-7 md:mt-24"];

export default function Projects() {
  return (
    <section className="px-5 pb-32 pt-36 md:px-10">
      <SEO title="Projetos" path="/projetos" description="Seis projetos fictícios de demonstração: branding, websites, motion e direção criativa." />

      <header className="mb-24 grid gap-8 md:grid-cols-12">
        <h1 className="font-display display-lg md:col-span-9">Projetos</h1>
        <p className="body-lg text-ash md:col-span-3 md:self-end">
          Seis casos de demonstração. Clientes e números são fictícios.
        </p>
      </header>

      <ul className="grid gap-x-8 gap-y-24 md:grid-cols-12">
        {projects.map((p, i) => (
          <li key={p.slug} className={`${layout[i % layout.length]}`}>
            <Reveal>
              <Link to={`/projetos/${p.slug}`} className="group block" aria-label={`Ver projeto ${p.client}`}>
                <div className="reveal-frame aspect-[4/5] overflow-hidden bg-graphite md:aspect-[5/4]">
                  <Artwork variant={p.art} label={`Imagem do projeto ${p.client}`} />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-4xl transition-colors group-hover:text-acid md:text-5xl">{p.client}</h2>
                  <span className="shrink-0 text-sm text-ash">{p.year}</span>
                </div>
                <p className="mt-2 text-ash">{p.sector} — {p.summary}</p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-32 text-center text-sm text-ash">{site.name} · projetos de demonstração</p>
    </section>
  );
}
