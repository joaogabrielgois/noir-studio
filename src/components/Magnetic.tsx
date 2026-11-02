import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "../lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "../hooks/useMotion";

type Props = { children: ReactNode; strength?: number; className?: string };

/** Efeito magnético: o elemento acompanha levemente o cursor quando ele se aproxima. */
export default function Magnetic({ children, strength = 0.28, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  function onMove(e: MouseEvent<HTMLSpanElement>) {
    if (!enabled || !ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const x = e.clientX - (b.left + b.width / 2);
    const y = e.clientY - (b.top + b.height / 2);
    gsap.to(ref.current, { x: x * strength, y: y * strength, duration: 0.45, ease: "power3.out" });
  }

  function onLeave() {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  }

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  );
}
