import React from 'react';
import { SectionLabel } from './section-label';
import { RevealSection } from './reveal';

export const VisionMission = () => (
  <RevealSection id="vision" className="w-full px-4 sm:px-6 lg:px-8 py-14">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-orange-100">
      <div className="bg-gradient-to-br from-[#E2652A] to-[#D45A22] p-10 sm:p-14 flex flex-col justify-center gap-6">
        <SectionLabel align="left" className="[&>span]:text-white [&>span:last-child]:bg-white/80">Our Vision</SectionLabel>
        <h2 className="font-fraunces text-4xl sm:text-5xl leading-[1.12] text-white">
          Help every child go from career confusion to <span className="text-slate-950">career clarity.</span>
        </h2>
      </div>
      <div className="bg-[#FFF8F0] p-10 sm:p-14 flex flex-col justify-center gap-6">
        <SectionLabel align="left">Our Mission</SectionLabel>
        <p className="text-lg sm:text-xl leading-relaxed text-slate-800">
          To become a platform that gives students the{' '}
          <span className="text-orange-500 font-medium">real information and real experiential learning</span> required to
          explore different careers and take an informed choice, with the support of their parents, teachers and
          themselves — confidently.
        </p>
      </div>
    </div>
  </RevealSection>
);
