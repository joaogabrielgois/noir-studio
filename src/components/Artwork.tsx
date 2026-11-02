import { imageSlugs, type Project } from "../config/site";

const BASE = "/images/projects";
const WIDTHS = [800, 1200, 1600] as const;

type Props = {
  variant: Project["art"];
  label: string;
  /** true para imagens acima da dobra (carregamento imediato). Padrão: lazy. */
  priority?: boolean;
  sizes?: string;
};

/**
 * Imagem de projeto otimizada: AVIF, depois WebP, em três larguras.
 * Arquivos em public/images/projects/<slug>-<largura>.<formato>.
 */
export default function Artwork({
  variant,
  label,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: Props) {
  const slug = imageSlugs[variant];
  const srcSet = (ext: "avif" | "webp") =>
    WIDTHS.map((w) => `${BASE}/${slug}-${w}.${ext} ${w}w`).join(", ");

  return (
    <picture className="block h-full w-full">
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`${BASE}/${slug}-1200.webp`}
        alt={label}
        width={1600}
        height={1200}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className="h-full w-full object-cover"
      />
    </picture>
  );
}
