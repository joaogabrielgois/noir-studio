import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { site } from "../config/site";
import { usePrefersReducedMotion } from "../hooks/useMotion";

type Props = { open: boolean; onClose: () => void };

const links = [{ label: "Início", to: "/" }, ...site.nav];

export default function MenuOverlay({ open, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      timeline.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .fromTo(
          el,
          { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0.01 : 0.9 },
        )
        .fromTo(
          el.querySelectorAll("[data-menu-item]"),
          { yPercent: 110 },
          { yPercent: 0, stagger: reduced ? 0 : 0.07, duration: reduced ? 0.01 : 0.8 },
          "-=0.5",
        );
    },
    { scope: root, dependencies: [reduced] },
  );

  // Abre/fecha a animação, trava o scroll e devolve o foco ao botão do menu ao fechar.
  useEffect(() => {
    const t = timeline.current;
    if (!t) return;
    if (open) {
      wasOpen.current = true;
      t.play(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>("a")?.focus());
    } else if (wasOpen.current) {
      wasOpen.current = false;
      t.reverse();
      document.body.style.overflow = "";
      document.querySelector<HTMLButtonElement>('[aria-controls="menu-overlay"]')?.focus({ preventScroll: true });
    }
  }, [open]);

  // Esc fecha; Tab fica preso dentro do diálogo enquanto estiver aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !root.current) return;
      const items: HTMLElement[] = Array.from(root.current.querySelectorAll<HTMLElement>("a[href], button"));
      if (items.length === 0) return;
      const first: HTMLElement = items[0];
      const last: HTMLElement = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      aria-hidden={!open}
      className="fixed inset-0 z-[45] flex flex-col justify-between bg-noir px-6 pb-10 pt-28 md:px-12"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <nav aria-label="Menu principal" className="flex flex-col">
        {links.map((l) => (
          <div key={l.to} className="overflow-hidden">
            <div data-menu-item>
              <Link
                to={l.to}
                onClick={onClose}
                className="font-display block py-1 text-[clamp(3.2rem,12vw,8rem)] leading-[0.95] tracking-[-0.04em] text-bone transition-colors hover:text-acid focus-visible:text-acid"
              >
                {l.label}
              </Link>
            </div>
          </div>
        ))}
      </nav>
      <div className="overflow-hidden">
        <div data-menu-item className="flex flex-col gap-2 text-sm text-ash">
          <a href={`mailto:${site.email}`} className="link-underline w-fit text-bone">
            {site.email}
          </a>
          <span>{site.location}</span>
        </div>
      </div>
    </div>
  );
}
