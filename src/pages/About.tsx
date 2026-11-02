import { manifesto, processSteps, team } from "../config/site";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";

export default function About() {
  return (
    <div className="px-5 pb-32 pt-36 md:px-10">
      <SEO title="Sobre" path="/sobre" description="Manifesto, equipe e processo do NOIR STUDIO." />

      <h1 className="font-display display-lg">Sobre</h1>

      <section className="mt-32 space-y-10" aria-labelledby="manifesto">
        <h2 id="manifesto" className="label">Manifesto</h2>
        {manifesto.map((line) => (
          <Reveal key={line}>
            <p className="font-display text-[clamp(2rem,4.5vw,4.4rem)] leading-[1.04] tracking-[-0.025em] text-bone">{line}</p>
          </Reveal>
        ))}
      </section>

      <section className="mt-40" aria-labelledby="equipe">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="equipe" className="label">Equipe</h2>
          <p className="text-xs text-ash">Pessoas fictícias, apenas para demonstração deste site.</p>
        </div>
        <ul className="grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => {
            const initials = m.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("");
            return (
              <li key={m.name} className="bg-noir p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-acid/60 font-display text-3xl text-acid" aria-hidden="true">
                  {initials}
                </div>
                <h3 className="font-display mt-8 text-3xl">{m.name}</h3>
                <p className="mt-2 text-sm text-ash">{m.role}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-40" aria-labelledby="processo-sobre">
        <h2 id="processo-sobre" className="label mb-10">Processo</h2>
        <ol className="border-t border-bone/10">
          {processSteps.map((step, i) => (
            <li key={step.title} className="border-b border-bone/10">
              <Reveal className="grid gap-4 py-10 md:grid-cols-12">
                <span className="text-xs text-acid md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display display-md md:col-span-4">{step.title}</h3>
                <p className="text-ash md:col-span-6">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
