"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Nossos produtos", href: "#colecao" },
  { name: "A Cat Phone", href: "#experiencia" },
  { name: "Nossa loja", href: "#visite" },
];
const EXPAND_SCROLL_THRESHOLD = 80;

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(() => typeof window === "undefined" || !window.matchMedia("(max-width: 580px)").matches);
  const [activeSection, setActiveSection] = React.useState("");
  const navRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const linksRef = React.useRef<HTMLDivElement>(null);
  const expandedRef = React.useRef(isExpanded);
  const linksId = React.useId();

  const setOpen = React.useCallback((open: boolean) => {
    if (expandedRef.current === open) return;
    expandedRef.current = open;
    setExpanded(open);
  }, []);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    let upwardTravel = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const latest = window.scrollY;
      const delta = latest - lastScrollY;
      lastScrollY = latest;
      if (latest < 60) {
        upwardTravel = 0;
        if (!window.matchMedia("(max-width: 580px)").matches) setOpen(true);
        return;
      }
      if (delta > 0) {
        upwardTravel = 0;
        if (latest > 150 && !navRef.current?.contains(document.activeElement)) setOpen(false);
      } else if (delta < 0) {
        upwardTravel -= delta;
        if (upwardTravel > EXPAND_SCROLL_THRESHOLD) setOpen(true);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [setOpen]);

  React.useEffect(() => {
    const sections = navItems.map(item => document.querySelector(item.href)).filter((section): section is HTMLElement => section instanceof HTMLElement);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection("#" + visible.target.id);
    }, { rootMargin: "-10% 0px -55% 0px", threshold: [0, .15, .5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => { setOpen(false); triggerRef.current?.focus(); };

  return (
    <div className={cn("animated-nav-shell", !isExpanded && "is-collapsed")}>
      <nav
        ref={navRef}
        aria-label="Navegação principal"
        className={cn("animated-nav", !isExpanded && "is-collapsed")}
        onKeyDown={event => { if (event.key === "Escape" && isExpanded) { event.preventDefault(); closeMenu(); } }}
      >
        <a
          className="animated-nav-brand"
          href="#inicio"
          aria-label="Cat Phone — voltar ao início"
          aria-hidden={!isExpanded}
          tabIndex={isExpanded ? 0 : -1}
          onClick={() => setActiveSection("")}
        >
          <img src="assets/catphone-logo.png" alt="" width="28" height="28" />
        </a>
        <div className="animated-nav-links" id={linksId} ref={linksRef} aria-hidden={!isExpanded} inert={!isExpanded}>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={isExpanded ? 0 : -1}
              aria-current={activeSection === item.href ? "location" : undefined}
              onClick={() => setActiveSection(item.href)}
            >{item.name}</a>
          ))}
        </div>
        <button
          type="button"
          ref={triggerRef}
          className="animated-nav-toggle"
          aria-label={isExpanded ? "Recolher navegação" : "Abrir navegação"}
          aria-expanded={isExpanded}
          aria-controls={linksId}
          onClick={() => {
            if (isExpanded) { closeMenu(); return; }
            setOpen(true);
            requestAnimationFrame(() => linksRef.current?.querySelector("a")?.focus());
          }}
        >{isExpanded ? <X size={15} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
      </nav>
    </div>
  );
}
