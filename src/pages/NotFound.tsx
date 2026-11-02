import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    robots.id = "robots-404";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <section className="flex min-h-dvh flex-col justify-center px-5 pb-20 pt-32 md:px-10">
      <SEO title="Página não encontrada" path="/404" />
      <p className="label">Erro 404</p>
      <h1 className="font-display display-xl mt-6">Perdido</h1>
      <p className="body-lg mt-10 max-w-md text-bone/75">
        Esta página não existe ou foi movida. Você pode voltar ao início ou ver os projetos.
      </p>
      <div className="mt-12 flex flex-wrap gap-8 text-lg">
        <Link to="/" className="link-underline text-acid">Voltar ao início</Link>
        <Link to="/projetos" className="link-underline">Ver projetos</Link>
      </div>
    </section>
  );
}
