import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "../hooks/useMotion";

/** Cursor personalizado: ativo apenas em desktop com ponteiro preciso e sem reduced motion. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      gsap.to([d, r], { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const hit = target?.closest("a, button, [data-cursor]");
      r.classList.toggle("is-hover", Boolean(hit));
    };
    const leave = () => gsap.to([d, r], { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    root.addEventListener("mouseleave", leave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      root.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" style={{ opacity: 0 }} />
      <div ref={dot} className="cursor-dot" aria-hidden="true" style={{ opacity: 0 }} />
    </>
  );
}
