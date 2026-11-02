"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Users,
  Lightbulb,
  Compass,
  Play,
  Plus,
  Quote,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SectionLabel } from '@/components/site/section-label';
import { MentorsStrip } from '@/components/site/mentors-strip';
import { VisionMission } from '@/components/site/vision-mission';
import { ContactSection } from '@/components/site/contact-section';
import { FAQS, JOURNEY_FORM_URL, TESTIMONIALS } from '@/lib/site-content';
import { RevealSection, Reveal } from '@/components/site/reveal';

// Paste a YouTube/Drive link here to make the hero "Watch Video" button play it.
// While empty, the button scrolls to the flagship program section instead.
const WATCH_VIDEO_URL = '';

const HERO_FEATURES = [
  { icon: BookOpen, label: 'Explore Options', tint: 'bg-orange-100 text-orange-600' },
  { icon: Users, label: 'Learn from Real Professionals', tint: 'bg-amber-100 text-amber-600' },
  { icon: Lightbulb, label: 'Gain Real-World Insights', tint: 'bg-rose-100 text-rose-500' },
  { icon: Compass, label: 'Choose with Confidence', tint: 'bg-emerald-100 text-emerald-600' },
];

const OFFERINGS = [
  {
    number: '01',
    title: 'Career Discovery Call',
    href: '/what-we-offer#career-discovery',
    quote: "I'm very confused about what career to choose.",
    image: '/images/card-discovery.jpg',
    featured: false,
  },
  {
    number: '02',
    title: 'Talk to a Professional Mentor',
    href: '/what-we-offer#mentor-call',
    quote: 'I want to know what a specific career is really like.',
    image: '/images/card-mentor.jpg',
    featured: true,
  },
  {
    number: '03',
    title: 'Educational Roadmap Call',
    href: '/what-we-offer#roadmap-call',
    quote: "I'm interested in a few options and need guidance on what to do next.",
    image: '/images/card-roadmap.jpg',
    featured: false,
  },
];

const PROGRAM_FEATURES = [
  { title: 'Designed by 25+ Psychologists', text: 'A structured curriculum created by a team of career psychologists and education experts.' },
  { title: 'Real-World Communities', text: 'Connect with industry professionals, communities and networks.' },
  { title: 'Hands-on Learning', text: 'Work on real projects and activities.' },
  { title: 'Discover What Interests You', text: 'Explore different careers in a structured and guided way.' },
  { title: 'Industry Exposure', text: 'Get access to industry visits and see real workplaces.' },
  { title: 'Guidance & Feedback', text: 'Talk to professionals, get a dedicated mentor and receive regular feedback for parents.' },
];


export default function MarketingLandingPage() {
  const videoLinkProps = WATCH_VIDEO_URL
    ? { href: WATCH_VIDEO_URL, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '#program' };

  // Hero image drifts up slightly slower than the page for a gentle parallax.
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], [0, -50]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF6] text-slate-900 font-sans selection:bg-orange-500/20 selection:text-orange-900">
      <Navbar />

      {/* SECTION 1: HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFF4E8] via-[#FFF8F0] to-[#FDEBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <p className="text-base sm:text-lg font-semibold text-orange-500">
                From career confusion to{' '}
                <span className="relative inline-block">
                  career clarity.
                  <svg className="absolute left-0 -bottom-1.5 w-full h-2 text-orange-400" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M1 6 Q 50 0 99 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </p>
              <p className="text-sm font-medium text-slate-700 mt-1">for Grade 8 to 12 students.</p>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-950 leading-[1.1] tracking-tight">
              Structured career mentoring
              <span className="block text-orange-500 mt-1">
                with real professional mentors and real-world{' '}
                <span className="relative inline-block">
                  insights.
                  <svg className="absolute left-0 -bottom-2 w-full h-3 text-orange-500" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 7 Q 30 1 60 5 T 98 3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="text-lg text-slate-700">
              Beyond what AI, online research and YouTube can tell you.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={JOURNEY_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full bg-orange-500 text-white font-semibold text-sm shadow-orange-glow hover:bg-orange-600 transition-colors flex items-center gap-2 group"
              >
                Start Your Career Discovery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                {...videoLinkProps}
                className="px-6 py-3.5 rounded-full border-2 border-orange-400 bg-white/70 text-slate-900 font-semibold text-sm hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-slate-900" />
                </span>
                Watch Video
              </a>
            </div>

            {/* Feature chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {HERO_FEATURES.map(({ icon: Icon, label, tint }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tint}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-medium text-slate-700 leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ y: heroImageY }}
            className="lg:col-span-6 relative"
          >
            <img
              src="/hero-collage.png"
              alt="Students exploring careers with real professionals"
              className="w-full h-auto rounded-[2rem] object-contain"
            />
            <div className="absolute -bottom-2 right-2 sm:right-6 font-caveat text-orange-500 text-2xl sm:text-3xl leading-7 text-center rotate-[-8deg] bg-[#FFF8F0]/90 rounded-2xl px-4 py-2 border-2 border-dashed border-orange-300">
              From Confusion<br />to Clarity.
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: WHAT WE OFFER */}
      <RevealSection id="what-we-offer" className="relative w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20 overflow-hidden">
        {/* Decorative swoosh */}
        <svg className="absolute left-0 top-40 w-40 h-24 text-orange-300 hidden md:block" viewBox="0 0 160 100" aria-hidden="true">
          <path d="M0 90 Q 70 70 150 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-500 border-b-2 border-orange-500 pb-1">
              Our Programmes
            </span>
            <h2 className="text-3xl sm:text-[2.6rem] font-extrabold text-slate-950 leading-tight">
              Choose the right <span className="text-orange-500">starting point</span>
              <br className="hidden sm:block" /> for your career journey.
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Three ways to explore, learn and gain clarity based on where you are in your career journey exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERINGS.map((item, i) => (
              <Reveal key={item.number} index={i}>
              <Link
                href={item.href}
                className="group relative h-full bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[2/1] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative p-6 flex-1 flex flex-col">
                  {/* Soft corner blob */}
                  <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-orange-100/60 pointer-events-none" />

                  <span className="text-sm font-semibold text-orange-500">{item.number}</span>
                  <span className="block w-6 h-0.5 bg-orange-400 mt-1 mb-3" />
                  <h3 className="text-xl font-bold text-slate-950 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-3 flex-1">“{item.quote}”</p>
                  <span
                    className={`relative mt-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      item.featured
                        ? 'bg-orange-500 text-white'
                        : 'border-2 border-slate-900 text-slate-900 group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* SECTION 3: FLAGSHIP PROGRAM (EXPLORATORY BUNDLE) */}
      <RevealSection id="program" className="w-full px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-[#E2652A] via-[#E06A2C] to-[#C9531F] text-white p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 shadow-xl">

          <div className="lg:pr-12 lg:border-r border-white/30 flex flex-col justify-center space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
              Our Flagship Program
            </span>
            <h2 className="font-fraunces text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-normal">
              <span className="text-slate-950">A 12-week</span>
              <br />
              career exploration program.
            </h2>
            <p className="text-white/90 max-w-md">
              A guided journey for students to explore real careers, gain hands-on exposure and take the next step with confidence.
            </p>
            <div>
              <Link
                href="/what-we-offer#program"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 font-semibold text-sm hover:bg-orange-50 transition-colors group"
              >
                Explore More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <ul className="lg:pl-12 divide-y divide-white/20">
            {PROGRAM_FEATURES.map((feature, i) => (
              <Reveal as="li" index={i} key={feature.title} className="flex gap-5 py-4 first:pt-0 last:pb-0">
                <span className="w-6 h-0.5 bg-white/80 mt-2.5 shrink-0" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-xs text-white/80 mt-1">{feature.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </RevealSection>


      <MentorsStrip />

      <StoriesSection />

      <VisionMission />

      {/* FAQS */}
      <RevealSection id="faqs" className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <SectionLabel>Frequently Asked Questions</SectionLabel>
            <h2 className="font-fraunces text-4xl sm:text-5xl leading-tight text-slate-950">
              Your <span className="text-orange-500">questions,</span>
              <br /> answered.
            </h2>
            <p className="text-slate-600">Everything you need to know about the READY program.</p>
          </div>

          <div className="divide-y divide-orange-100 border-y border-orange-100">
            {FAQS.map((faq, index) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex items-center gap-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-semibold text-orange-500 w-6 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-fraunces text-slate-900">{faq.q}</span>
                  <Plus className="w-4 h-4 text-orange-500 shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="text-sm text-slate-600 mt-3 ml-11 mr-9 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </RevealSection>

      <ContactSection />

    </div>
  );
}

// Repeat the testimonials so the strip is always wider than the screen,
// then render it twice so the scroll loops without a gap.
const STORY_LOOP = Array.from({ length: Math.max(1, Math.ceil(6 / TESTIMONIALS.length)) }, () => TESTIMONIALS).flat();

function StoriesSection() {
  return (
    <RevealSection id="stories" className="w-full py-14 bg-gradient-to-b from-[#FFFBF6] to-[#FFF4E8] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-10">
        <SectionLabel>Voices From Our Community</SectionLabel>
        <h2 className="font-fraunces text-4xl sm:text-5xl text-slate-950">
          Real stories. <span className="text-orange-500">Real impact.</span>
        </h2>
        <p className="text-slate-600">Hear from students, parents and teachers who have experienced the READY program.</p>
      </div>

      {/* Auto-scrolling feedback strip (left to right, pauses on hover) */}
      <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused]">
          {[...STORY_LOOP, ...STORY_LOOP].map((story, index) => (
            <article key={index} aria-hidden={index >= STORY_LOOP.length} className="w-[324px] sm:w-[364px] shrink-0 pr-6 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-200 via-orange-300 to-orange-500 flex items-center justify-center">
                {story.thumbnail ? (
                  <img src={story.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Quote className="w-14 h-14 text-white/80" />
                )}
                {story.videoUrl && (
                  <a href={story.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Play video" tabIndex={index >= STORY_LOOP.length ? -1 : undefined} className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-slate-900/60 border-2 border-white flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </span>
                  </a>
                )}
              </div>
              <p className="font-fraunces text-lg text-slate-900 leading-snug">“{story.quote}”</p>
              <span className="block w-8 h-0.5 bg-orange-400" />
              <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                {story.role} &nbsp;|&nbsp; {story.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
