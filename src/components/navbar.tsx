"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  Compass,
  ShieldCheck
} from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/storage';

export const Navbar = () => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Sync theme
    const storedTheme = localStorage.getItem('ready_theme') as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Sync admin auth status
    setIsAdmin(isAdminAuthenticated());
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('ready_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-[#FDFBF7]/85 dark:bg-[#0b0f19]/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 flex-wrap gap-3">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-1.5 rounded-xl bg-white border border-slate-200 group-hover:scale-105 transition-transform duration-300 shadow-sm flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="READY Logo" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bebas tracking-[0.18em] text-slate-950 dark:text-white uppercase leading-none">READY</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-gradient-to-r from-orange-500 to-rose-500 text-white">
                Assessment
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-none mt-1">
              Student Career Assessment Portal
            </p>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-2 text-xs font-semibold">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all duration-200 ${
              pathname === '/'
                ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-orange-500" />
            <span>Home</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Team Mode</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-950 transition duration-300 shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
