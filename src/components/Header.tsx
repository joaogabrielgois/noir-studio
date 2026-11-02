import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../config/site";
import MenuOverlay from "./MenuOverlay";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-5 transition-[background-color,border-color,padding] duration-500 md:px-10 ${
          scrolled && !open ? "border-bone/10 bg-noir/80 py-3 backdrop-blur-md" : "border-transparent py-5"
        }`}
      >
        <Link to="/" className="flex items-baseline gap-2" aria-label="NOIR STUDIO, página inicial" onClick={close}>
          <span className="font-display text-2xl leading-none tracking-tight text-bone">NOIR</span>
          <span className="text-[10px] tracking-[0.3em] text-ash">STUDIO</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `link-underline text-sm tracking-wide ${isActive ? "text-acid" : "text-bone/80 hover:text-bone"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-overlay"
          data-cursor
          className="relative z-[60] flex items-center gap-3 rounded-full border border-bone/20 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:border-acid hover:text-acid"
        >
          <span className="relative block h-3 w-5" aria-hidden="true">
            <span className={`absolute left-0 right-0 top-0 h-px bg-current transition-transform duration-500 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 right-0 h-px bg-current transition-transform duration-500 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </span>
          <span>{open ? "Fechar" : "Menu"}</span>
        </button>
      </header>
      <MenuOverlay open={open} onClose={close} />
    </>
  );
}
