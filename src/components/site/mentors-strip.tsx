"use client";

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MENTORS } from '@/lib/site-content';
import { SectionLabel } from './section-label';
import { RevealSection } from './reveal';

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

export const MentorsStrip = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) =>
    scroller.current?.scrollBy({ left: direction * scroller.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <RevealSection id="mentors" className="w-full px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <SectionLabel>Our Mentors & Partners</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            They had the <span className="text-orange-500">same doubts.</span>
          </h2>
          <p className="text-slate-600">Learn from their experiences and get real guidance, so you don&apos;t make the same mistakes.</p>
        </div>

        <div className="relative">
          <button onClick={() => scroll(-1)} aria-label="Previous mentors" className="hidden sm:flex absolute -left-3 top-12 z-10 w-9 h-9 rounded-full bg-orange-100 text-slate-800 items-center justify-center hover:bg-orange-200">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div ref={scroller} className="flex gap-4 overflow-x-auto snap-x scroll-smooth px-1 sm:px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MENTORS.map((mentor) => (
              <div key={mentor.name} className="snap-start shrink-0 w-[118px] text-center">
                {mentor.photo ? (
                  <img src={mentor.photo} alt={mentor.name} className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow" />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-200 to-orange-400 border-4 border-white shadow flex items-center justify-center text-2xl font-fraunces text-white">
                    {initials(mentor.name)}
                  </div>
                )}
                <p className="text-xs font-bold text-slate-950 mt-3">{mentor.name}</p>
                <p className="text-[11px] text-slate-500">{mentor.role}</p>
                <p className="text-[11px] text-slate-500">{mentor.experience}</p>
                <span className="block w-5 h-px bg-slate-300 mx-auto my-2" />
                <p className="text-xs font-semibold text-slate-700">{mentor.company}</p>
              </div>
            ))}
          </div>

          <button onClick={() => scroll(1)} aria-label="More mentors" className="hidden sm:flex absolute -right-3 top-12 z-10 w-9 h-9 rounded-full bg-orange-100 text-slate-800 items-center justify-center hover:bg-orange-200">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </RevealSection>
  );
};
