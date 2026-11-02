"use client";

import React from 'react';
import { motion } from 'framer-motion';

export type RoadmapStep = { icon: React.ElementType; title: string; text: string };

const EASE = [0.22, 1, 0.36, 1] as const;
const LINE_DURATION = 1.4;

// A single thin orange line that draws across, lighting up each milestone as it passes.
export const BenefitRoadmap = ({ steps }: { steps: RoadmapStep[] }) => {
  const nodeDelay = (index: number) => ((index + 0.5) / steps.length) * LINE_DURATION;
  // The line runs from the first milestone's centre to the last one's.
  const inset = { left: `${50 / steps.length}%`, right: `${50 / steps.length}%` };

  return (
    <div className="relative">
      {/* Desktop: horizontal line */}
      <div className="relative hidden md:block">
        <div style={inset} className="absolute top-7 h-px bg-orange-200" />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: LINE_DURATION, ease: 'easeInOut' }}
          style={inset}
          className="absolute top-7 h-0.5 -mt-px origin-left bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600"
        />

        <ol className="relative grid gap-8" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex flex-col items-center text-center">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE, delay: nodeDelay(index) }}
                className="relative w-14 h-14 rounded-full bg-[#FFFBF6] ring-1 ring-orange-200 flex items-center justify-center"
              >
                <span className="absolute inset-1.5 rounded-full bg-orange-500 shadow-[0_8px_20px_-6px_rgba(234,88,12,0.6)]" />
                <Icon className="relative w-5 h-5 text-white" />
              </motion.span>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: EASE, delay: nodeDelay(index) + 0.15 }}
                className="mt-6 max-w-[15rem]"
              >
                <p className="font-fraunces text-sm text-orange-500">{String(index + 1).padStart(2, '0')}</p>
                <p className="font-bold text-slate-950 mt-1 leading-snug">{title}</p>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{text}</p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical line */}
      <ol className="md:hidden relative space-y-8 text-left pl-16 before:absolute before:left-7 before:top-2 before:bottom-2 before:w-0.5 before:-ml-px before:bg-gradient-to-b before:from-orange-300 before:via-orange-500 before:to-orange-600">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="relative">
            <span className="absolute -left-16 top-0 w-14 h-14 rounded-full bg-[#FFFBF6] ring-1 ring-orange-200 flex items-center justify-center">
              <span className="absolute inset-1.5 rounded-full bg-orange-500" />
              <Icon className="relative w-5 h-5 text-white" />
            </span>
            <p className="font-fraunces text-sm text-orange-500 pt-1">{String(index + 1).padStart(2, '0')}</p>
            <p className="font-bold text-slate-950 leading-snug">{title}</p>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};
