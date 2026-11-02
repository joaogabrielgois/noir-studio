import { Link, useParams } from "react-router-dom";
import { projects } from "../config/site";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import Artwork from "../components/Artwork";
import Magnetic from "../components/Magnetic";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <NotFound />;

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pb-32 pt-36">
      <SEO
        title={project.client}
        path={`/projetos/${project.slug}`}
        description={project.summary}
      />

      <header className="px-5 md:px-10">
        <Link to="/projetos" className="link-underline label inline-block hover:text-bone">← Projetos</Link>
        <h1 className="font-display display-lg mt-10 max-w-[14ch]">{project.client}</h1>
        <p className="body-lg mt-8 max-w-xl text-bone/80">{project.headline}</p>
      </header>

      <dl className="mt-20 grid gap-8 border-y border-bone/10 px-5 py-8 text-sm sm:grid-cols-4 md:px-10">
        <div><dt className="label">Setor</dt><dd className="mt-2">{project.sector}</dd></div>
        <div><dt className="label">Ano</dt><dd className="mt-2">{project.year}</dd></div>
        <div className="sm:col-span-2"><dt className="label">Serviços</dt><dd className="mt-2">{project.services.join(" · ")}</dd></div>
      </dl>

      <div className="mt-16 px-5 md:px-10">
        <div className="reveal-frame aspect-[16/10] overflow-hidden bg-graphite">
          <Artwork variant={project.art} label={`Imagem do projeto ${project.client}`} priority sizes="100vw" />
        </div>
        <p className="label mt-3">Render 3D original criado para demonstração</p>
      </div>

      <div className="mt-32 grid gap-16 px-5 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-4"><h2 className="label">Desafio</h2></Reveal>
        <Reveal className="md:col-span-7">
          <p className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.15] tracking-[-0.01em]">{project.challenge}</p>
        </Reveal>
      </div>

      <div className="mt-24 grid gap-16 px-5 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-4"><h2 className="label">Abordagem</h2></Reveal>
        <Reveal className="md:col-span-7">
          <ul className="divide-y divide-bone/10 border-y border-bone/10">
            {project.approach.map((step) => (
              <li key={step} className="body-lg py-6 text-bone/85">{step}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-24 grid gap-16 px-5 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-4"><h2 className="label">Resultado</h2></Reveal>
        <Reveal className="md:col-span-7">
          <p className="body-lg text-bone/85">{project.outcome}</p>
        </Reveal>
      </div>

      <section className="mt-24 px-5 md:px-10" aria-labelledby="metricas">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="metricas" className="label">Resultados demonstrativos</h2>
          <p className="text-xs text-ash">Números ilustrativos de um cliente fictício.</p>
        </div>
        <div className="grid gap-px bg-bone/10 sm:grid-cols-2">
          {project.metrics.map((m) => (
            <Reveal key={m.label} className="bg-noir p-10">
              <p className="font-display text-6xl tracking-[-0.03em] text-acid md:text-7xl">{m.value}</p>
              <p className="mt-4 text-sm text-ash">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-40 px-5 md:px-10" aria-label="Próximo projeto">
        <p className="label mb-6">Próximo projeto</p>
        <Magnetic>
          <Link to={`/projetos/${next.slug}`} className="font-display display-lg block transition-colors hover:text-acid">
            {next.client} →
          </Link>
        </Magnetic>
      </section>
    </article>
  );
}
