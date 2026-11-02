import React from 'react';

// Small orange eyebrow label with an underline, used above section headings.
export const SectionLabel = ({
  children,
  align = 'center',
  className = '',
}: {
  children: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) => (
  <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500">{children}</span>
    <span className={`block w-8 h-0.5 bg-orange-400 mt-2 ${align === 'center' ? 'mx-auto' : ''}`} />
  </div>
);

// Hand-drawn "spark" accent placed after headings.
export const Spark = ({ className = '' }: { className?: string }) => (
  <svg className={`inline-block w-7 h-7 text-orange-500 ${className}`} viewBox="0 0 28 28" aria-hidden="true">
    <path d="M6 14 L12 3 M13 17 L25 10 M14 22 L24 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
