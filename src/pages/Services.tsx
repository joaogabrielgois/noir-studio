import { services, processSteps } from "../config/site";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <div className="px-5 pb-32 pt-36 md:px-10">
      <SEO title="Serviços" path="/servicos" description="Branding, websites, motion e direção criativa." />

      <h1 className="font-display display-lg">Serviços</h1>
      <p className="body-lg mt-8 max-w-2xl text-bone/75">
        Quatro frentes que se conversam. Você pode contratar uma ou todas, sempre com a mesma direção.
      </p>

      <ul className="mt-24 border-t border-bone/10">
        {services.map((s) => (
          <li key={s.id} className="grid gap-8 border-b border-bone/10 py-16 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <h2 className="font-display display-md">{s.title}</h2>
            </Reveal>
            <Reveal className="md:col-span-4 md:col-start-7">
              <p className="text-bone/80">{s.summary}</p>
            </Reveal>
            <Reveal className="md:col-span-3">
              <ul className="space-y-2 text-sm text-ash">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ul>

      <section className="mt-40" aria-labelledby="processo">
        <h2 id="processo" className="label mb-10">Como trabalhamos</h2>
        <ol className="grid gap-px bg-bone/10 md:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.title} className="bg-noir p-8">
              <span className="text-xs text-acid">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display mt-6 text-4xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ash">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-40">
        <Magnetic>
          <Link to="/contato" className="inline-flex rounded-full bg-acid px-8 py-5 text-noir">
            Pedir um orçamento
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
