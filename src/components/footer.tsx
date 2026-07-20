import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-10 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
            <img src="/logo.png" alt="READY Logo" className="w-6 h-6 object-contain" />
          </div>
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
