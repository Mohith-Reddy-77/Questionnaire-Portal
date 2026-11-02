"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ContactSection } from '@/components/site/contact-section';
import { COMMUNITY_PHOTOS, JOURNEY_FORM_URL } from '@/lib/site-content';

// Add the founder's photo at public/founder.jpg; until then a placeholder is shown.
const FOUNDER = { name: 'Pranathi Reddy', title: 'Founder, READY', photo: '/founder.jpg' };

const photo = (index: number) => encodeURI(COMMUNITY_PHOTOS[index % COMMUNITY_PHOTOS.length]);

const NUMBERS = [
  { value: '20+', label: 'Psychologists', text: 'designing our assessments and curriculum' },
  { value: '200+', label: 'Educational mentors', text: 'from various fields and industries' },
  { value: '100+', label: 'Enthusiasts', text: 'students, volunteers and young professionals' },
  { value: '8–12', label: 'Grades we guide', text: 'when the biggest academic choices are made' },
];

const AUDIENCES = [
  {
    tab: 'For students',
    title: 'Explore careers before you choose one.',
    text: 'Talk to real professionals, take on hands-on projects and find out what genuinely excites you.',
    cta: { label: 'See our programmes', href: '/what-we-offer' },
    image: photo(0),
    focus: 'center',
  },
  {
    tab: 'For parents',
    title: 'Be part of the decision, with real information.',
    text: 'Understand your child’s interests and options, and get clear feedback on the next steps.',
    cta: { label: 'Read the FAQs', href: '/#faqs' },
    image: photo(2),
    focus: 'center 40%',
  },
  {
    tab: 'For partners',
    title: 'Open doors for the next generation.',
    text: 'Schools, mentors and industries partner with READY to give students real-world exposure.',
    cta: { label: 'Partner with us', href: '/partner-with-us' },
    image: photo(6),
    focus: 'center',
  },
];

const WHY_POINTS = [
  'Real professionals, not just search results — students hear what a career is actually like from people who do it.',
  'Real-world exposure — projects, industry visits and hands-on learning before any big decision.',
  'Structured, personal guidance — built by psychologists, shaped around each student’s interests, goals and background.',
];

const JOURNEY = [
  { step: 'Discover', title: 'Understand yourself', text: 'A psychometric assessment maps interests, strengths and learning style.' },
  { step: 'Learn & Explore', title: 'Research real paths', text: 'Structured projects and self-exploration across multiple careers.' },
  { step: '1:1 Mentoring', title: 'Ask the people who know', text: 'Conversations with industry professionals and personalised guidance.' },
  { step: 'Experience', title: 'See it for yourself', text: 'Industry visits and workplace exposure show how careers really work.' },
  { step: 'Validate & Decide', title: 'Choose with confidence', text: 'Real-world challenges, mentor feedback and a clear next-step roadmap.' },
];

const GOALS = [
  { stat: '73%', problem: 'of students in India are unsure about their career choices.', goal: 'Help every student discover their interests and explore real career options early.', note: 1 },
  { stat: '76%', problem: 'feel their education does not prepare them for real-world jobs.', goal: 'Bridge the gap between classroom learning and real-world skills through hands-on experiences.', note: 2 },
  { stat: '60%', problem: 'lack access to mentors or industry guidance.', goal: 'Connect students with real professionals, mentors and role models from diverse industries.', note: 3 },
  { stat: '67%', problem: 'experience high levels of anxiety about their future.', goal: 'Provide expert guidance, psychological support and a safe space to explore without pressure.', note: 4 },
  { stat: 'Only 23%', problem: 'feel confident and well-informed about future careers.', goal: 'Empower every student with clarity, confidence and the tools to build a future they’re excited about.', note: 5 },
];

const SOURCES = [
  'KPMG India Youth Survey 2023',
  'UNESCO, 2022',
  'LinkedIn Future of Work Report, 2023',
  'NCERT, National Achievement Survey 2021',
  'Deloitte Global Gen Z Survey 2023',
];

const MISSION_PILLARS = [
  { title: 'Real information', text: 'Honest, first-hand insight into what different careers involve — beyond what students see online.' },
  { title: 'Real experiential learning', text: 'Projects, industry visits and mentoring that let students try before they decide.' },
  { title: 'Real support', text: 'Students choose confidently, with their parents and teachers alongside them.' },
];

const EXPLORE_LINKS = [
  { title: 'Our programmes', text: 'Calls, mentoring and the 12-week program.', href: '/what-we-offer' },
  { title: 'Partner with us', text: 'For schools, mentors and industries.', href: '/partner-with-us' },
  { title: 'Student stories', text: 'Hear from our community.', href: '/#stories' },
  { title: 'Start your journey', text: 'Take the first step today.', href: JOURNEY_FORM_URL, external: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: EASE },
};

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${light ? 'text-orange-400' : 'text-orange-500'}`}>{children}</p>
);

function FounderPhoto() {
  // Probe on the client: an <img> that 404s before hydration never fires React's onError.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setLoaded(true);
    probe.src = FOUNDER.photo;
  }, []);

  return loaded ? (
    <img src={FOUNDER.photo} alt={`${FOUNDER.name}, ${FOUNDER.title}`} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center font-fraunces text-7xl text-white">PR</div>
  );
}

function AudienceTabs() {
  const [active, setActive] = useState(0);
  const audience = AUDIENCES[active];

  return (
    <div className="space-y-6">
      <div role="tablist" className="flex flex-wrap gap-2">
        {AUDIENCES.map((a, index) => (
          <button
            key={a.tab}
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              active === index ? 'bg-slate-950 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-950'
            }`}
          >
            {a.tab}
          </button>
        ))}
      </div>

      <div className="relative h-[440px] sm:h-auto sm:aspect-video rounded-3xl overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={audience.tab}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0"
          >
            <img src={audience.image} alt="" style={{ objectPosition: audience.focus }} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 max-w-2xl text-white">
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">{audience.title}</h3>
              <p className="text-white/85 mt-3">{audience.text}</p>
              <Link href={audience.cta.href} className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors group">
                {audience.cta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-950 font-sans">
      <Navbar />

      {/* 1. HERO: photo strip + big headline */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end">
            {[4, 1, 3].map((photoIndex, index) => (
              <motion.img
                key={photoIndex}
                src={photo(photoIndex)}
                alt="READY students and mentors in a session"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
                className={`w-full object-cover rounded-2xl sm:rounded-3xl ${index === 1 ? 'aspect-[4/5]' : 'aspect-[4/4.2]'}`}
              />
            ))}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            className="mt-12 sm:mt-16 text-5xl sm:text-7xl lg:text-[6.5rem] font-black tracking-tight leading-[0.95] max-w-5xl"
          >
            We&apos;re here to take students from career confusion to <span className="text-orange-500">career clarity.</span>
          </motion.h1>
        </div>
      </section>

      {/* 2. BY THE NUMBERS */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#FFF7EF]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div {...fadeUp} className="lg:col-span-5 space-y-6">
            <Eyebrow>READY by the numbers</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02]">A growing community of changemakers.</h2>
            <p className="text-slate-600 text-lg">Psychologists, educators, industry professionals and young enthusiasts — all believing every student deserves clarity.</p>
            <div className="aspect-square max-w-xs rounded-3xl bg-orange-500 flex items-end p-8">
              <p className="text-white text-5xl font-black tracking-tight leading-none">
                READY<span className="text-slate-950">↗</span>
              </p>
            </div>
          </motion.div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 rounded-3xl overflow-hidden">
            {NUMBERS.map(({ value, label, text }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 sm:p-10"
              >
                <p className="text-6xl sm:text-7xl font-black tracking-tight text-orange-500 leading-none">{value}</p>
                <p className="text-lg font-bold mt-4">{label}</p>
                <p className="text-sm text-slate-500 mt-1">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AUDIENCE TABS */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <motion.div {...fadeUp} className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight max-w-3xl leading-[1.02]">Built for everyone in a student&apos;s corner.</h2>
          <AudienceTabs />
        </motion.div>
      </section>

      {/* 4. WHY WE EXIST */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div {...fadeUp} className="space-y-6">
            <Eyebrow light>Why we exist</Eyebrow>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1]">
              Beyond what AI, online research and YouTube <span className="text-orange-500">can tell you.</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="space-y-8 lg:pt-12">
            <p className="text-lg text-white/80">
              Online resources can explain what a career is. They can&apos;t give the personal guidance and first-hand perspective students need to choose one. That&apos;s why READY exists.
            </p>
            <ul className="space-y-5">
              {WHY_POINTS.map((point) => (
                <li key={point} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="text-white/90">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 5. OUR APPROACH (numbered journey) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto space-y-14">
          <motion.div {...fadeUp} className="max-w-3xl space-y-5">
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02]">Five steps from “I don’t know” to “I’m sure.”</h2>
          </motion.div>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 border-t-2 border-slate-950">
            {JOURNEY.map(({ step, title, text }, index) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
                className="pt-6 relative"
              >
                <span className="absolute -top-[7px] left-0 w-3 h-3 rounded-full bg-orange-500" />
                <p className="text-sm font-black text-orange-500">{String(index + 1).padStart(2, '0')} · {step}</p>
                <h3 className="text-xl font-bold mt-3 leading-snug">{title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. PULL QUOTE (the READY vision, alongside the founder) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div {...fadeUp} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-orange-500 text-white">
          <div className="lg:col-span-4 relative">
            <FounderPhoto />
            <p className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/70 to-transparent px-6 pb-5 pt-12 text-sm">
              <span className="font-bold block">{FOUNDER.name}</span>
              <span className="text-white/80">{FOUNDER.title}</span>
            </p>
          </div>
          <div className="lg:col-span-8 p-10 sm:p-16 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-950">Our vision</p>
            <blockquote className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-[1.08]">
              “Help every child go from career confusion to career clarity.”
            </blockquote>
          </div>
        </motion.div>
      </section>

      {/* 7. GOALS (numbered cards) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-[#FFF7EF]">
        <div className="max-w-7xl mx-auto space-y-14">
          <motion.div {...fadeUp} className="max-w-3xl space-y-5">
            <Eyebrow>Our goals</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02]">
              From real problems to <span className="text-orange-500">real progress.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GOALS.map(({ stat, problem, goal, note }, index) => (
              <motion.article
                key={stat}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE, delay: (index % 3) * 0.1 }}
                className="bg-white rounded-3xl p-8 flex flex-col border border-orange-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <p className="text-sm font-black text-slate-400">{String(index + 1).padStart(2, '0')}</p>
                <p className="text-5xl font-black tracking-tight text-orange-500 mt-4">
                  {stat}
                  <sup className="text-xs text-slate-400 font-semibold ml-1 align-super">{note}</sup>
                </p>
                <p className="text-slate-600 mt-2">{problem}</p>
                <div className="mt-auto pt-6">
                  <div className="border-t border-slate-200 pt-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-950">Our goal</p>
                    <p className="font-semibold mt-1 leading-snug">{goal}</p>
                  </div>
                </div>
              </motion.article>
            ))}
            <motion.div {...fadeUp} className="rounded-3xl bg-slate-950 text-white p-8 flex flex-col justify-between">
              <p className="text-2xl font-black leading-tight">Ready to take the first step?</p>
              <a href={JOURNEY_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 self-start px-6 py-3 rounded-full bg-orange-500 text-sm font-semibold hover:bg-orange-600 transition-colors group">
                Start your journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. MISSION PILLARS + photo band */}
      <section className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto space-y-14">
            <motion.div {...fadeUp} className="max-w-3xl space-y-5">
              <Eyebrow>Our mission</Eyebrow>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02]">Everything a student needs to choose confidently.</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {MISSION_PILLARS.map(({ title, text }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
                  className="border-t-4 border-orange-500 pt-6"
                >
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="text-slate-600 mt-3 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="aspect-[16/9] sm:aspect-[21/9] bg-cover"
          style={{ backgroundImage: `url('${photo(8)}')`, backgroundPosition: 'center 40%' }}
          role="img"
          aria-label="READY career session with students"
        />
      </section>

      {/* 9. MORE TO EXPLORE */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40" style={{ backgroundImage: `url('${photo(5)}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-orange-50/80" />
        <div className="relative max-w-7xl mx-auto space-y-10">
          <motion.h2 {...fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight">There&apos;s more to explore.</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPLORE_LINKS.map(({ title, text, href, external }, index) => {
              const content = (
                <>
                  <div>
                    <h3 className="text-xl font-black">{title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{text}</p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </>
              );
              const className = 'group h-full min-h-[180px] bg-white rounded-3xl p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300';
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
                >
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
                  ) : (
                    <Link href={href} className={className}>{content}</Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FOOTNOTES */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <ol className="max-w-7xl mx-auto border-t border-slate-200 pt-6 text-xs text-slate-400 space-y-1 list-decimal list-inside">
          {SOURCES.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ol>
      </section>

      <ContactSection />
    </div>
  );
}
