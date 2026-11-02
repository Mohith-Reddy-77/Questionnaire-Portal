"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Hand } from 'lucide-react';

export type DeckCard = { icon: React.ElementType; title: string; text: string };

const VISIBLE = 3; // cards shown in the stack at once
const SWIPE_THRESHOLD = 100;
const AUTOPLAY_MS = 3500;

// A stack of cards: the top card can be swiped or stepped through with the arrows,
// and it moves to the back of the deck so the next benefit pops forward.
export const CardDeck = ({ cards }: { cards: DeckCard[] }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = cards.length;

  // Autoplay once the deck scrolls into view; pause while the visitor hovers or drags.
  const deckRef = useRef<HTMLDivElement>(null);
  const inView = useInView(deckRef, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduceMotion) return;
    // Depends on `current`, so a manual step restarts the countdown.
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [inView, paused, reduceMotion, current, total]);

  const go = (step: 1 | -1) => {
    setDirection(step);
    setCurrent((c) => (c + step + total) % total);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setPaused(false);
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) go(-1);
  };

  const stack = Array.from({ length: Math.min(VISIBLE, total) }, (_, depth) => ({
    depth,
    index: (current + depth) % total,
  }));

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        ref={deckRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative h-[340px] sm:h-[320px]"
      >
        <AnimatePresence initial={false} custom={direction}>
          {stack
            .slice()
            .reverse()
            .map(({ depth, index }) => {
              const { icon: Icon, title, text } = cards[index];
              const isTop = depth === 0;
              return (
                <motion.article
                  key={title}
                  custom={direction}
                  initial={direction === 1 ? { opacity: 0, scale: 0.85, y: 40 } : { opacity: 0, x: -320, rotate: -12 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: depth * 16,
                    scale: 1 - depth * 0.05,
                    rotate: depth === 0 ? 0 : depth % 2 ? 3 : -3,
                    zIndex: VISIBLE - depth,
                  }}
                  variants={{
                    // Next: the top card flies off to the left. Previous: the back card fades away.
                    exit: (dir: 1 | -1) =>
                      dir === 1 ? { x: -360, rotate: -14, opacity: 0, transition: { duration: 0.35 } } : { opacity: 0, scale: 0.85, y: 40 },
                  }}
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={isTop ? () => setPaused(true) : undefined}
                  onDragEnd={isTop ? onDragEnd : undefined}
                  whileDrag={{ rotate: -4, scale: 1.02 }}
                  aria-hidden={!isTop}
                  className={`absolute inset-x-0 top-0 h-[300px] sm:h-[280px] ${isTop ? 'bg-white' : 'bg-[#FFEBDD]'} rounded-3xl p-7 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] flex flex-col ${
                    isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-fraunces text-5xl text-orange-500 leading-none">{String(index + 1).padStart(2, '0')}</span>
                    <span className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </span>
                  </div>
                  <h3 className="font-fraunces text-2xl text-slate-950 leading-snug mt-5">{title}</h3>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{text}</p>
                </motion.article>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between text-white">
        <button
          onClick={() => go(-1)}
          aria-label="Previous benefit"
          className="w-11 h-11 rounded-full border-2 border-white/70 flex items-center justify-center hover:bg-white hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-2" aria-live="polite">
          <div className="flex gap-1.5">
            {cards.map((card, index) => (
              <span
                key={card.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
          <p className="text-xs text-white/80">
            {current + 1} of {total} · <Hand className="inline w-3.5 h-3.5 -mt-0.5" /> swipe or tap the arrows
          </p>
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next benefit"
          className="w-11 h-11 rounded-full bg-white text-orange-600 flex items-center justify-center hover:bg-orange-50 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
