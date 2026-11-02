"use client";

import React from 'react';
import { motion, MotionConfig, type HTMLMotionProps } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// Turns every scroll animation off for visitors who prefer reduced motion.
export const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

// A <section> that fades up the first time it scrolls into view.
export const RevealSection = (props: HTMLMotionProps<'section'>) => (
  <motion.section
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.7, ease: EASE }}
    {...props}
  />
);

// Wraps a single card or item; pass `index` to stagger items in a row.
export const Reveal = ({
  index = 0,
  as = 'div',
  className,
  children,
}: {
  index?: number;
  as?: 'div' | 'li';
  className?: string;
  children: React.ReactNode;
}) => {
  const Component = as === 'li' ? motion.li : motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay: (index % 6) * 0.08 }}
      className={className}
    >
      {children}
    </Component>
  );
};
