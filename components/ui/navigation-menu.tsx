"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Nossos produtos", href: "#colecao" },
  { name: "A Cat Phone", href: "#experiencia" },
  { name: "Nossa loja", href: "#visite" },
];
const EXPAND_SCROLL_THRESHOLD = 80;
const containerVariants: Variants = {
  expanded: {
    y: 0, opacity: 1, width: "auto",
    transition: { type: "spring", damping: 20, stiffness: 300, staggerChildren: .07, delayChildren: .12 },
  },
  collapsed: {
    y: 0, opacity: 1, width: "3rem",
    transition: { type: "spring", damping: 20, stiffness: 300, when: "afterChildren", staggerChildren: .05, staggerDirection: -1 },
  },
};
const logoVariants: Variants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: .2 } },
};
const itemVariants: Variants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: .95, transition: { duration: .15 } },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState("");
  const navRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const linksRef = React.useRef<HTMLDivElement>(null);
  const lastScrollY = React.useRef(0);
  const upwardTravel = React.useRef(0);
  const reducedMotion = useReducedMotion();
  const linksId = React.useId();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", latest => {
    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;
    if (latest < 60) { upwardTravel.current = 0; setExpanded(true); return; }
    if (delta > 0) {
      upwardTravel.current = 0;
      if (isExpanded && latest > 150 && !navRef.current?.contains(document.activeElement)) setExpanded(false);
    } else if (delta < 0) {
      upwardTravel.current -= delta;
      if (!isExpanded && upwardTravel.current > EXPAND_SCROLL_THRESHOLD) setExpanded(true);
    }
  });

  React.useEffect(() => {
    const sections = navItems.map(item => document.querySelector(item.href)).filter((section): section is HTMLElement => section instanceof HTMLElement);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection("#" + visible.target.id);
    }, { rootMargin: "-10% 0px -55% 0px", threshold: [0, .15, .5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => { setExpanded(false); triggerRef.current?.focus(); };

  return (
    <div className={cn("animated-nav-shell", !isExpanded && "is-collapsed")}>
      <motion.nav
        ref={navRef}
        aria-label="Navegação principal"
        initial={reducedMotion ? false : { y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={reducedMotion ? { expanded: { width: "auto", opacity: 1, y: 0 }, collapsed: { width: "3rem", opacity: 1, y: 0 } } : containerVariants}
        transition={reducedMotion ? { duration: 0 } : undefined}
        className={cn("animated-nav", !isExpanded && "is-collapsed")}
        onKeyDown={event => { if (event.key === "Escape" && isExpanded) { event.preventDefault(); closeMenu(); } }}
      >
        <motion.div className="animated-nav-brand" aria-hidden="true" variants={reducedMotion ? undefined : logoVariants} style={reducedMotion ? { opacity: isExpanded ? 1 : 0 } : undefined}>
          <img src="assets/catphone-logo.png" alt="" width="28" height="28" />
        </motion.div>
        <div className="animated-nav-links" id={linksId} ref={linksRef} aria-hidden={!isExpanded} inert={!isExpanded}>
          {navItems.map(item => (
            <motion.a
              key={item.href}
              href={item.href}
              variants={reducedMotion ? undefined : itemVariants}
              tabIndex={isExpanded ? 0 : -1}
              aria-current={activeSection === item.href ? "location" : undefined}
              onClick={() => setActiveSection(item.href)}
            >{item.name}</motion.a>
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
            setExpanded(true);
            requestAnimationFrame(() => linksRef.current?.querySelector("a")?.focus());
          }}
        >{isExpanded ? <X size={15} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
      </motion.nav>
    </div>
  );
}
