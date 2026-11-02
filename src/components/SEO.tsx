import { useEffect } from "react";
import { setSEO } from "../lib/seo";

type Props = { title: string; description?: string; path?: string; image?: string };

/** Declarativo: define metadados da página quando ela monta. */
export default function SEO(props: Props) {
  const { title, description, path, image } = props;
  useEffect(() => {
    setSEO({ title, description, path, image });
  }, [title, description, path, image]);
  return null;
}
