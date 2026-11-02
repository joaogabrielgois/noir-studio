import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { isLowPowerDevice, useFinePointer, usePrefersReducedMotion } from "../hooks/useMotion";

/**
 * Objeto abstrato em SVG animado com GSAP. Escolhido no lugar de WebGL:
 * mesmo impacto visual para um hero, sem custo de GPU, bundle ou bateria.
 * Em dispositivos fracos ou com reduced motion, fica estático.
 */
export default function HeroOrb() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const lowPower = useRef(isLowPowerDevice());

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el) return;
      gsap.fromTo(el, { autoAlpha: 0, scale: 0.86, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.8, ease: "expo.out", delay: 0.2 });
      if (reduced || lowPower.current) return;

      el.querySelectorAll<SVGGElement>("[data-ring]").forEach((ring, i) => {
        gsap.to(ring, {
          rotation: i % 2 ? -360 : 360,
          svgOrigin: "300 300",
          duration: 40 + i * 14,
          repeat: -1,
          ease: "none",
        });
      });
      const core = el.querySelector<SVGGElement>("[data-core]");
      if (core) gsap.to(core, { scale: 1.06, transformOrigin: "50% 50%", duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: wrap, dependencies: [reduced] },
  );

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced || lowPower.current || !fine) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 1.2, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 1.2, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      rx(-(e.clientY / window.innerHeight - 0.5) * 16);
      ry((e.clientX / window.innerWidth - 0.5) * 16);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, fine]);

  return (
    <div ref={wrap} className="aspect-square w-full max-w-[min(70vw,620px)]" style={{ perspective: 900, transformStyle: "preserve-3d" }} aria-hidden="true">
      <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="orb-core" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#EDEBE6" />
            <stop offset="28%" stopColor="#C8FF1A" />
            <stop offset="70%" stopColor="#1B1C20" />
            <stop offset="100%" stopColor="#0A0A0B" />
          </radialGradient>
        </defs>
        <g data-ring>
          <circle cx="300" cy="300" r="270" fill="none" stroke="#8E9199" strokeOpacity=".35" strokeDasharray="2 10" />
          <circle cx="570" cy="300" r="5" fill="#C8FF1A" />
        </g>
        <g data-ring>
          <circle cx="300" cy="300" r="230" fill="none" stroke="#EDEBE6" strokeOpacity=".18" strokeWidth="1.5" />
          <circle cx="300" cy="70" r="4" fill="#EDEBE6" />
        </g>
        <g data-ring>
          <ellipse cx="300" cy="300" rx="190" ry="70" fill="none" stroke="#C8FF1A" strokeOpacity=".7" strokeWidth="1.5" transform="rotate(-18 300 300)" />
        </g>
        <g data-core>
          <circle cx="300" cy="300" r="150" fill="url(#orb-core)" />
        </g>
      </svg>
    </div>
  );
}
