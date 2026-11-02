import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { usePrefersReducedMotion } from "../hooks/useMotion";

export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity,visibility" },
      );
    },
    { scope: ref, dependencies: [reduced] },
  );

  return <div ref={ref}>{children}</div>;
}
