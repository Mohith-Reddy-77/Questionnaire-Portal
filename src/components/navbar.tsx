"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/storage';
import { NAV_LINKS } from '@/lib/nav-links';
import { JOURNEY_FORM_URL } from '@/lib/site-content';

export const Navbar = () => {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // The site is light-only; clear any dark mode saved by the old theme toggle.
    document.documentElement.classList.remove('dark');
    setIsAdmin(isAdminAuthenticated());
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => !href.includes('#') && pathname === href;

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-[#FFFBF6]/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? 'border-orange-100 shadow-[0_6px_24px_-12px_rgba(234,88,12,0.25)]' : 'border-orange-100/70'
      }`}
    >
      {/* Reading progress */}
      <motion.div style={{ scaleX: progress }} className="absolute left-0 right-0 bottom-0 h-0.5 bg-orange-500 origin-left" />

      <div className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 transition-[padding] duration-300 ${scrolled ? 'py-2.5' : 'py-3.5'}`}>

        {/* Brand */}
        <Link href="/" className="shrink-0 leading-none">
          <span className="block text-2xl font-extrabold tracking-tight text-slate-950">
            READY<span className="text-orange-500">↗</span>
          </span>
          <span className="block text-[8px] font-semibold tracking-[0.2em] text-slate-500 mt-0.5">
            EXPLORE · EXPERIENCE · EXPRESS
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-slate-700">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-1 transition-colors hover:text-orange-500 ${
                isActive(link.href)
                  ? 'text-slate-950 font-bold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-orange-500'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Team Mode</span>
            </div>
          )}

          <a
            href={JOURNEY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white text-[13px] font-semibold shadow-orange-glow hover:bg-orange-600 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="xl:hidden flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="xl:hidden border-t border-orange-100/70 px-4 sm:px-6 py-3 flex flex-col text-sm font-medium text-slate-700">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`py-2.5 border-b border-slate-100 last:border-0 hover:text-orange-500 ${
                isActive(link.href) ? 'text-orange-500 font-bold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={JOURNEY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="sm:hidden mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white font-semibold"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </a>
        </nav>
      )}
    </header>
  );
};
