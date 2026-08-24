"use client";

import React from 'react';
import { Users, Target, Globe2, Lightbulb, HeartHandshake } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlassCard } from '@/components/ui/glass-card';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1ea] text-slate-900">
      <Navbar />

      <main className="flex-1">
        <section className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-4 text-center">
              <span className="inline-flex rounded-full border border-orange-300 bg-orange-50 px-4 py-1 text-[11px] font-black uppercase tracking-[0.15em] text-orange-600">
                About READY
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
                Building Career Clarity
                <span className="block text-orange-500">For Every Student.</span>
              </h1>
              <p className="mx-auto max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
                READY helps students discover the right career direction through meaningful assessment, real-world exposure,
                and guided mentorship. We bridge the gap between school learning and future pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <GlassCard className="p-6 border-slate-200 dark:border-slate-800">
                <div className="mb-4 inline-flex rounded-2xl bg-orange-500/10 p-3 text-orange-600">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Our Mission</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Enable every student to make informed, confident career choices based on strengths, interests, and opportunity.
                </p>
              </GlassCard>

              <GlassCard className="p-6 border-slate-200 dark:border-slate-800">
                <div className="mb-4 inline-flex rounded-2xl bg-orange-500/10 p-3 text-orange-600">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Our Approach</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  We combine structured diagnostics, mentor insights, and experiential learning to shape a practical career roadmap.
                </p>
              </GlassCard>

              <GlassCard className="p-6 border-slate-200 dark:border-slate-800">
                <div className="mb-4 inline-flex rounded-2xl bg-orange-500/10 p-3 text-orange-600">
                  <Globe2 className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Our Impact</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Schools, families, and students gain clarity faster, reduce decision stress, and align learning with future goals.
                </p>
              </GlassCard>
            </div>

            <div className="rounded-[32px] border border-orange-200 bg-[#fffaf6] p-3 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-4">
              <div className="grid grid-cols-12 gap-3 sm:gap-4">
                <div className="col-span-12 md:col-span-7 overflow-hidden rounded-[28px] ring-1 ring-orange-100 bg-slate-100">
                  <img
                    src="/WhatsApp Image 2026-08-24 at 9.49.24 PM.jpeg"
                    alt="READY students and mentors working together"
                    className="h-[270px] w-full object-cover sm:h-[330px] md:h-[430px]"
                  />
                </div>

                <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="col-span-1 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                    <img
                      src="/WhatsApp Image 2026-08-24 at 9.49.25 PM (1).jpeg"
                      alt="Students engaging in career guidance"
                      className="h-[150px] w-full object-cover sm:h-[180px]"
                    />
                  </div>

                  <div className="col-span-1 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                    <img
                      src="/WhatsApp Image 2026-08-24 at 9.49.25 PM (2).jpeg"
                      alt="Learning and mentoring moments"
                      className="h-[150px] w-full object-cover sm:h-[180px]"
                    />
                  </div>

                  <div className="col-span-1 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                    <img
                      src="/WhatsApp Image 2026-08-24 at 9.49.24 PM (1).jpeg"
                      alt="Students with READY mentors"
                      className="h-[150px] w-full object-cover sm:h-[180px]"
                    />
                  </div>

                  <div className="col-span-1 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                    <img
                      src="/WhatsApp Image 2026-08-24 at 9.49.25 PM.jpeg"
                      alt="Career guidance session"
                      className="h-[150px] w-full object-cover sm:h-[180px]"
                    />
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-4 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                  <img
                    src="/WhatsApp Image 2026-08-24 at 9.49.26 PM.jpeg"
                    alt="READY community support"
                    className="h-[130px] w-full object-cover sm:h-[170px]"
                  />
                </div>

                <div className="col-span-12 sm:col-span-4 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                  <img
                    src="/WhatsApp Image 2026-08-24 at 9.49.25 PM (3).jpeg"
                    alt="READY community and student support"
                    className="h-[130px] w-full object-cover sm:h-[170px]"
                  />
                </div>

                <div className="col-span-12 sm:col-span-4 overflow-hidden rounded-[24px] ring-1 ring-orange-100 bg-slate-100">
                  <img
                    src="/WhatsApp Image 2026-08-24 at 9.49.26 PM (1).jpeg"
                    alt="Students building future goals"
                    className="h-[130px] w-full object-cover sm:h-[170px]"
                  />
                </div>

                <div className="col-span-12 md:col-span-7 overflow-hidden rounded-[26px] ring-1 ring-orange-100 bg-slate-100">
                  <img
                    src="/WhatsApp Image 2026-08-24 at 9.49.26 PM (2).jpeg"
                    alt="READY guidance and motivation"
                    className="h-[160px] w-full object-cover sm:h-[200px]"
                  />
                </div>

                <div className="col-span-12 md:col-span-5 overflow-hidden rounded-[26px] ring-1 ring-orange-100 bg-slate-100">
                  <img
                    src="/WhatsApp Image 2026-08-24 at 9.49.25 PM (1).jpeg"
                    alt="READY mentorship and confidence"
                    className="h-[160px] w-full object-cover sm:h-[200px]"
                  />
                </div>
              </div>
            </div>



            <GlassCard className="p-7 sm:p-9 border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-orange-500" />
                    Who We Work With
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>Students from middle and high school</li>
                    <li>Schools and academic institutions</li>
                    <li>Mentors, counselors, and industry professionals</li>
                    <li>Parents supporting career planning at home</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <HeartHandshake className="w-6 h-6 text-orange-500" />
                    Why READY
                  </h3>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    Career choices should not be guesswork. READY provides a structured, student-friendly experience that helps
                    learners identify what fits, why it fits, and how to start moving toward it.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
