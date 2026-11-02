"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ContactRole } from '@/lib/site-content';

export const PREFILL_EVENT = 'ready:prefill-contact';

export type ContactPrefill = { message?: string; role?: ContactRole };

// Scrolls to the page's contact section and pre-fills the form, so every
// "Book" / "Partner" button leads to a message the team receives.
export const BookButton = ({
  children,
  prefill,
  className = '',
  variant = 'solid',
}: {
  children: React.ReactNode;
  prefill: ContactPrefill;
  className?: string;
  variant?: 'solid' | 'light';
}) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent<ContactPrefill>(PREFILL_EVENT, { detail: prefill }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const styles =
    variant === 'solid'
      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-glow'
      : 'bg-white text-orange-600 hover:bg-orange-50';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-colors group ${styles} ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

// Same look as BookButton, but opens an external form in a new tab.
export const FormLinkButton = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-colors group bg-orange-500 text-white hover:bg-orange-600 shadow-orange-glow ${className}`}
  >
    {children}
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </a>
);
