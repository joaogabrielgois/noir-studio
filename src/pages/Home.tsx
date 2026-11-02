import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { hero, projects, services, site } from "../config/site";
import SEO from "../components/SEO";
import HeroOrb from "../components/HeroOrb";
import Magnetic from "../components/Magnetic";
import Reveal from "../components/Reveal";
import Artwork from "../components/Artwork";
import { usePrefersReducedMotion } from "../hooks/useMotion";

const featured = projects.slice(0, 4);

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!scope.current || reduced) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo("[data-line]", { yPercent: 110 }, { yPercent: 0, duration: 1.5, stagger: 0.12 })
        .fromTo("[data-fade]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, "-=1.1");
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div ref={scope}>
      <SEO title={site.name} path="/" />

      <section className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-5 pb-10 pt-32 md:px-10">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-[2vw] md:pr-[6vw]">
          <div className="w-[min(92vw,640px)] opacity-90">
            <HeroOrb />
          </div>
        </div>

        <div className="relative z-10">
          <p data-fade className="label mb-8">{hero.eyebrow}</p>
          <h1 className="font-display text-[clamp(3.4rem,12.5vw,12.5rem)] leading-[0.86] tracking-[-0.05em] text-bone">
            {hero.lines.map((line, i) => (
              <span key={line} className={`block overflow-hidden pb-[0.04em] ${i === 1 ? "md:pl-[18%]" : ""}`}>
                <span data-line className="block">{line}</span>
              </span>
            ))}
          </h1>

          <div className="mt-12 grid gap-8 md:grid-cols-12 md:items-end">
            <p data-fade className="body-lg max-w-md text-bone/75 md:col-span-4 md:col-start-9">
              {hero.intro}
            </p>
            <div data-fade className="flex flex-wrap gap-4 md:col-span-4 md:col-start-9 md:row-start-2">
              <Magnetic>
                <Link to={hero.cta.to} className="inline-flex items-center gap-3 rounded-full bg-acid px-7 py-4 text-noir transition-transform hover:scale-[1.03]">
                  {hero.cta.label}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to={hero.secondary.to} className="link-underline inline-flex items-center px-2 py-4 text-bone">
                  {hero.secondary.label}
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-bone/10 py-6" aria-hidden="true">
        <div className="marquee-track gap-12 whitespace-nowrap font-display text-4xl text-bone/70 md:text-6xl">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-12 pr-12">
              {projects.map((p) => (
                <span key={`${copy}-${p.slug}`} className="flex items-center gap-12">
                  {p.client}
                  <span className="h-2 w-2 rounded-full bg-acid" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="px-5 py-32 md:px-10 md:py-48">
        <Reveal className="max-w-[18ch] md:ml-[8vw]">
          <p className="font-display text-[clamp(2.2rem,5vw,5.2rem)] leading-[1.02] tracking-[-0.03em] text-bone">
            Não entregamos peças isoladas. Entregamos sistemas que sobrevivem à próxima campanha e ao próximo produto.
          </p>
        </Reveal>
      </section>

      <section className="px-5 pb-32 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-bone/10 pb-6">
          <h2 className="font-display display-md">Projetos selecionados</h2>
          <Link to="/projetos" className="link-underline text-sm text-ash hover:text-bone">Ver todos</Link>
        </div>

        <ul>
          {featured.map((p) => (
            <li key={p.slug} className="border-b border-bone/10">
              <Link to={`/projetos/${p.slug}`} className="group relative flex items-center justify-between gap-6 py-8 md:py-12">
                <span className="font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-3">
                  {p.client}
                </span>
                <span className="hidden shrink-0 text-right text-sm text-ash md:block">
                  {p.sector}<br />{p.year}
                </span>
                <span className="block h-20 w-28 shrink-0 overflow-hidden md:hidden">
                  <Artwork variant={p.art} label={`Imagem do projeto ${p.client}`} />
                </span>
                <span className="hover-preview pointer-events-none absolute right-0 top-1/2 hidden h-[220px] w-[320px] -translate-y-1/2 overflow-hidden md:block">
                  <Artwork variant={p.art} label={`Imagem do projeto ${p.client}`} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-32 md:px-10">
        <ul className="grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li key={s.id} className="bg-noir p-8">
              <h3 className="font-display text-3xl">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ash">{s.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-40 md:px-10">
        <Reveal>
          <Magnetic>
            <Link to="/contato" className="font-display block text-[clamp(3.5rem,13vw,13rem)] leading-[0.85] tracking-[-0.05em] text-bone transition-colors hover:text-acid">
              Vamos conversar?
            </Link>
          </Magnetic>
        </Reveal>
      </section>
    </div>
  );
}
