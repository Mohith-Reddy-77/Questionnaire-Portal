"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Users,
  FileText,
  BarChart3,
  Briefcase,
  Coins,
  GraduationCap,
  User,
  Split,
  Building2,
  Search,
  Target,
  HelpCircle,
  Lightbulb,
  MessagesSquare,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowDown,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SectionLabel, Spark } from '@/components/site/section-label';
import { BookButton } from '@/components/site/book-button';
import { MentorsStrip } from '@/components/site/mentors-strip';
import { ContactSection } from '@/components/site/contact-section';
import { OFFERINGS } from '@/lib/site-content';
import { RevealSection, Reveal } from '@/components/site/reveal';

const HERO_LINES: { text: string; accent?: boolean; underline?: string }[] = [
  { text: 'The wrong career choice' },
  { text: 'can cost years of time,', accent: true },
  { text: 'money and happiness.', accent: true, underline: 'happiness.' },
];

type SessionPoint = { icon: React.ElementType; title: string; text: string };

const SESSIONS: {
  offering: (typeof OFFERINGS)[keyof typeof OFFERINGS];
  titleParts: [string, string, string];
  tagline: string;
  heading: React.ReactNode;
  intro: string;
  points: SessionPoint[];
  twoColumn?: boolean;
}[] = [
  {
    offering: OFFERINGS.discovery,
    titleParts: ['Career', 'Discovery', 'Call'],
    tagline: 'Understand.\nExplore.\nFind what excites you.',
    heading: <>Get clarity on your interests, strengths and possible career paths.</>,
    intro: 'A personalised one-on-one session to help students explore their interests, understand different career options and take the first step towards a brighter future.',
    points: [
      { icon: Compass, title: 'What careers are right for me?', text: 'Take a scientifically designed psychometric assessment before the session to understand your interests, strengths, personality and learning style.' },
      { icon: Users, title: 'What do I actually enjoy and what doesn’t suit me?', text: 'In a one-on-one call (with you and your parents), we will discuss your results, explore different career options, and understand what excites you and what doesn’t.' },
      { icon: FileText, title: 'What should my next steps be?', text: 'You will receive a detailed, personalised report with career recommendations, subject suggestions, skill areas to focus on and actionable next steps.' },
      { icon: BarChart3, title: 'Is this recommendation realistic for my background and goals?', text: 'Our guidance takes into account your academic background, interests, life goals, location and financial considerations — so it’s practical, realistic and personalised, not generic.' },
    ],
  },
  {
    offering: OFFERINGS.mentor,
    titleParts: ['Talk to a', 'Professional', 'Mentor Call'],
    tagline: 'Get real insights from industry professionals. Ask, learn, and explore without hesitation.',
    heading: <>Curious about a particular career?<br />Talk to someone who actually does it.</>,
    intro: 'A one-on-one session with our in-house industry professionals to get real-world insights, ask your questions, and understand what the career is really like.',
    points: [
      { icon: Briefcase, title: 'What does a typical day look like in this career?', text: 'Understand the real work, responsibilities and lifestyle — beyond what you see online.' },
      { icon: Coins, title: 'What is the salary, career growth and job opportunities?', text: 'Get clarity on earnings, growth potential, and future scope in this industry.' },
      { icon: GraduationCap, title: 'What education, skills or certifications are needed?', text: 'Learn about the academic path, skills to build and resources to prepare.' },
      { icon: BarChart3, title: 'What are the challenges and realities of this career?', text: 'Understand the difficult parts, common mistakes and what to watch out for.' },
      { icon: User, title: 'Get personalised guidance from an experienced professional.', text: 'Ask anything, learn from their journey, understand new advancements in the field, and get guidance on how to prepare from now.' },
    ],
  },
  {
    offering: OFFERINGS.roadmap,
    titleParts: ['Educational', 'Roadmap', 'Call'],
    tagline: 'Get a clear, step-by-step education plan to reach your chosen career.',
    heading: <>How do I get from where I am today to my dream career?</>,
    intro: 'A personalised session to help you understand the education path, entrance exams, colleges and preparation strategy for your chosen career.',
    twoColumn: true,
    points: [
      { icon: Split, title: 'Which stream should I choose?', text: 'Get clarity on Science, Commerce, Arts or any other path based on your interests and career goals.' },
      { icon: Building2, title: 'What are the best colleges for this path?', text: 'Understand top colleges in India and abroad, cutoff marks, eligibility criteria and the admission process.' },
      { icon: FileText, title: 'What entrance exams do I need to prepare for?', text: 'Learn about NEET, JEE, CUET and other relevant exams — exam pattern, question papers, timelines and preparation tips.' },
      { icon: BarChart3, title: 'What does the career growth look like?', text: 'Understand the educational progression, job opportunities, salary range and future scope in this field.' },
      { icon: Lightbulb, title: 'Which resources and mentors can help me?', text: 'Get recommendations on the best books, online resources, coaching options and mentors to guide you.' },
      { icon: User, title: 'A personalised roadmap for you', text: 'You’ll fill a short Google Form with your specific questions, and we’ll discuss everything on a one-on-one call to give you a clear, actionable roadmap.' },
    ],
  },
];

const PROGRAM_STEPS = [
  { icon: Search, title: 'Discover', items: ['Psychometric assessment', 'Understand your interests & strengths', 'Explore multiple career options'] },
  { icon: FileText, title: 'Learn & Explore', items: ['Structured projects and activities', 'Research and self-exploration', 'Understanding real career paths'] },
  { icon: Users, title: '1:1 Mentoring', items: ['Talk to industry professionals', 'Ask real questions', 'Get personalised guidance'] },
  { icon: Building2, title: 'Experience', items: ['Industry visits and workplace exposure', 'See how industries actually work', 'Hands-on learning'] },
  { icon: Target, title: 'Validate & Decide', items: ['Try mock tests / real-world challenges', 'Get feedback from mentors', 'A clear next step roadmap'] },
];

const PROGRAM_OUTCOMES = [
  { icon: BookOpen, title: 'Expert-designed curriculum', text: 'Built by 20+ psychologists and career experts' },
  { icon: User, title: 'Personalised guidance', text: 'Based on your interests, strengths and goals' },
  { icon: MessagesSquare, title: '1:1 mentoring with industry experts', text: 'Learn from professionals in your chosen fields' },
  { icon: Award, title: 'Real-world projects and exposure', text: 'Hands-on experience to understand how careers actually work' },
];

const IDEAL_FOR = [
  { icon: HelpCircle, text: 'Are unsure about their career path' },
  { icon: Compass, text: 'Want to explore multiple options' },
  { icon: Users, text: 'Want real-world exposure before deciding' },
  { icon: GraduationCap, text: 'Want a clear, step-by-step plan for their future' },
];

const bookMessage = (title: string, price: string) => `Hi, I'd like to book the ${title} (${price}). Please share the next steps.`;

function SessionBlock({ session }: { session: (typeof SESSIONS)[number] }) {
  const { offering, titleParts, tagline, heading, intro, points, twoColumn } = session;
  return (
    <RevealSection id={offering.id} className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto bg-[#FFF8F0] rounded-3xl border border-orange-100 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-center gap-5 lg:border-r border-orange-100">
          <SectionLabel align="left">One-On-One Session</SectionLabel>
          <h2 className="font-fraunces text-5xl leading-[1.02] text-slate-950">
            {titleParts[0]}
            <br />
            <span className="text-orange-500">{titleParts[1]}</span>
            <br />
            {titleParts[2]}
          </h2>
          <p className="text-slate-500 whitespace-pre-line leading-relaxed">{tagline}</p>
        </div>

        <div className="lg:col-span-8 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h3 className="font-fraunces text-2xl sm:text-3xl leading-tight text-slate-950">{heading}</h3>
            <p className="text-sm text-slate-500">{intro}</p>
          </div>

          <ul className={`grid gap-4 ${twoColumn ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
            {points.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" index={i} key={title} className={`flex gap-4 ${twoColumn ? 'bg-white/70 rounded-2xl p-4' : ''}`}>
                <span className="w-11 h-11 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 bg-orange-100/60 rounded-2xl px-6 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500">Investment</p>
              <p className="text-3xl font-semibold text-orange-500">{offering.price}</p>
            </div>
            <span className="hidden sm:block w-px h-12 bg-orange-200" />
            <BookButton prefill={{ message: bookMessage(offering.title, offering.price) }} className="sm:flex-1">
              Book the Call
            </BookButton>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

export default function WhatWeOfferPage() {
  const program = OFFERINGS.program;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF6] text-slate-900 font-sans">
      <Navbar />

      {/* HERO */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF4E8] via-[#FBE7D3] to-[#F6D3B4] px-6 sm:px-14 py-16 sm:py-24">
          {/* Soft window-light shapes */}
          <div className="absolute -top-20 right-24 w-40 h-[140%] bg-white/40 rotate-12 blur-xl pointer-events-none" />
          <div className="absolute -top-20 right-64 w-16 h-[140%] bg-white/30 rotate-12 blur-lg pointer-events-none" />
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-orange-400/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-8 right-8 hidden lg:block space-y-1 rotate-[-3deg]">
            <div className="w-48 h-10 rounded bg-[#F6EFE6] shadow-md text-[10px] tracking-widest text-slate-600 flex items-center px-3">A BRIGHTER TOMORROW</div>
            <div className="w-52 h-10 rounded bg-orange-500 shadow-md text-[10px] tracking-widest text-white flex items-center px-3">BEGINS TODAY</div>
          </div>

          <div className="relative max-w-4xl space-y-7">
            <SectionLabel align="left">What We Offer</SectionLabel>

            <h1 className="text-[2.6rem] sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-slate-950">
              {HERO_LINES.map((line, index) => (
                <motion.span
                  key={line.text}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.05 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${line.accent ? 'text-orange-500' : ''}`}
                >
                  {line.underline ? (
                    <>
                    {line.text.slice(0, line.text.indexOf(line.underline))}
                    <span className="relative inline-block">
                      {line.underline}
                      <svg className="absolute left-0 -bottom-2 sm:-bottom-3 w-full h-3 sm:h-4 text-orange-500" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                        <motion.path
                          d="M3 9 Q 60 1 120 6 T 197 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.7, delay: 0.55 }}
                        />
                      </svg>
                    </span>
                    </>
                  ) : (
                    line.text
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-700 max-w-xl"
            >
              A little guidance today can help your child explore the right paths, make informed choices, and build a{' '}
              <strong className="text-slate-950">brighter future tomorrow.</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href={`#${OFFERINGS.discovery.id}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-950 text-white font-semibold text-sm hover:bg-slate-800 transition-colors group"
              >
                Explore Programmes
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>
              <BookButton prefill={{ message: "Hi, I'd like to book a free call to know more about READY's programs." }}>
                Book a Free Call
              </BookButton>
            </motion.div>

            {/* Quick links to each programme */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {Object.values(OFFERINGS).map((offering) => (
                <a
                  key={offering.id}
                  href={`#${offering.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-orange-200 px-4 py-2 text-xs font-semibold text-slate-800 hover:border-orange-500 hover:text-orange-600 transition-colors"
                >
                  {offering.title}
                  <span className="text-orange-500">{offering.price}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="py-8">
        <SessionBlock session={SESSIONS[0]} />
        <SessionBlock session={SESSIONS[1]} />
      </div>

      <MentorsStrip />

      <div className="pt-4 pb-8">
        <SessionBlock session={SESSIONS[2]} />
      </div>

      {/* 12-WEEK PROGRAM */}
      <RevealSection id={program.id} className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-[#E8682B] to-[#D9581F] text-white p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 flex flex-col justify-center gap-5">
            <span className="self-start text-[10px] font-semibold uppercase tracking-[0.2em] bg-white/90 text-orange-600 rounded-full px-4 py-1.5">
              12-Week Program
            </span>
            <h2 className="font-fraunces text-5xl leading-[1.02]">Personalised Career Discovery Program</h2>
            <p className="text-xl">Explore. Experience. Decide.</p>
            <p className="text-sm text-white/85">A 12-week journey with expert guidance, real-world exposure and a clear roadmap for your future.</p>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row xl:items-center gap-4 bg-white rounded-2xl p-4">
              <div className="px-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Investment</p>
                <p className="text-3xl font-semibold text-slate-950">{program.price}</p>
              </div>
              <BookButton prefill={{ message: bookMessage(program.title, program.price) }} className="flex-1 px-5">
                Book Your Spot
              </BookButton>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <h3 className="font-fraunces text-2xl">What&apos;s included? <Spark className="text-white w-5 h-5" /></h3>
              <ol className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PROGRAM_STEPS.map(({ icon: Icon, title, items }, index) => (
                  <Reveal as="li" index={index} key={title} className="relative bg-white text-slate-900 rounded-xl p-4">
                    <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">{index + 1}</span>
                    <span className="w-11 h-11 mx-auto rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><Icon className="w-5 h-5" /></span>
                    <p className="text-sm font-semibold text-center mt-2">{title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="flex gap-1.5 text-[11px] text-slate-600 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-px" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-fraunces text-2xl">Key Outcomes <Spark className="text-white w-5 h-5" /></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PROGRAM_OUTCOMES.map(({ icon: Icon, title, text }, i) => (
                  <Reveal index={i} key={title} className="bg-white text-slate-900 rounded-xl p-4">
                    <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><Icon className="w-4 h-4" /></span>
                    <p className="text-sm font-semibold mt-2 leading-snug">{title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{text}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-fraunces text-2xl">Ideal for students who… <Spark className="text-white w-5 h-5" /></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {IDEAL_FOR.map(({ icon: Icon, text }, i) => (
                  <Reveal index={i} key={text} className="bg-white text-slate-700 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                    <p className="text-[11px] leading-snug">{text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* MORE DOUBTS */}
      <RevealSection className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto rounded-3xl border border-orange-200 bg-[#FFF8F0] px-8 py-6 flex flex-col md:flex-row md:items-center gap-6">
          <span className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
            <MessagesSquare className="w-8 h-8" />
          </span>
          <div className="flex-1">
            <h2 className="font-fraunces text-3xl text-slate-950">
              Have any <span className="text-orange-500">more doubts?</span>
            </h2>
            <p className="text-slate-600">Book a free call with us to know more.</p>
          </div>
          <BookButton prefill={{ message: "Hi, I'd like to book a free call to know more about READY's programs." }}>
            Book a Free Call
          </BookButton>
        </div>
      </RevealSection>

      <ContactSection />

    </div>
  );
}
