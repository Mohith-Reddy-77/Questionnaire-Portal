import React from 'react';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
};

export const GlassCard = ({ children, className = '', hoverEffect = false, onClick }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-xl hover:border-orange-500/30 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const SectionSurface = ({ children, className = '', onClick }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`section-surface rounded-3xl p-8 relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
