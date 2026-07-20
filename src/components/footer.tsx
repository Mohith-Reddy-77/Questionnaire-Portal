import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-10 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 64 64" className="w-6 h-6 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 16v32h28v-12h8" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 30l6 6-6 6" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M44 48V16H16v12H8" stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 22l-6 6 6 6" stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="font-bebas text-sm text-slate-900 dark:text-slate-200 tracking-wider">READY PLATFORM</p>
            <p className="text-[11px]">Empowering student career alignment & aptitude diagnostics.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-orange-500 transition">Home</Link>
        </div>

        <p className="text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} READY Academic Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
