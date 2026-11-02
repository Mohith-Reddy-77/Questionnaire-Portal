"use client";

import React from 'react';
import {
  Users,
  Sprout,
  BarChart3,
  Handshake,
  GraduationCap,
  Lightbulb,
  Network,
  ClipboardList,
  Sparkles,
  Database,
  PartyPopper,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SectionLabel, Spark } from '@/components/site/section-label';
import { BookButton, FormLinkButton } from '@/components/site/book-button';
import { BenefitRoadmap } from '@/components/site/benefit-roadmap';
import { CardDeck } from '@/components/site/card-deck';
import { ContactSection } from '@/components/site/contact-section';
import { COMMUNITY_PHOTOS, PARTNER_FORM_URL } from '@/lib/site-content';
import { RevealSection, Reveal } from '@/components/site/reveal';

type Point = { icon: React.ElementType; title: string; text: string };

const WHY_PARTNER: Point[] = [
  { icon: Users, title: 'Empower Young Minds', text: 'Give students access to real-world exposure and career opportunities.' },
  { icon: Sprout, title: 'Give Back to Society', text: 'Contribute to meaningful education and skill development.' },
  { icon: BarChart3, title: 'Build a Future-Ready India', text: 'Help create a skilled, confident and employable generation.' },
  { icon: Handshake, title: 'Create Shared Value', text: 'Achieve your CSR goals while making a lasting social impact.' },
];

const MENTOR_POINTS: Point[] = [
  { icon: Users, title: 'Inspire the Next Generation', text: 'Guide students and help them explore real career opportunities.' },
  { icon: GraduationCap, title: 'Share Real-World Experience', text: 'Give insights into your industry, work culture and career journey.' },
  { icon: Sprout, title: 'Give Back to Society', text: 'Contribute to meaningful education and skill development.' },
  { icon: Lightbulb, title: 'Build Future Talent', text: 'Help identify and nurture young talent for your industry.' },
  { icon: Network, title: 'Expand Your Network', text: 'Connect with schools, educators and like-minded professionals.' },
];

const INSTITUTION_POINTS: Point[] = [
  { icon: GraduationCap, title: 'Real-World Exposure', text: 'Give students access to diverse career fields, industries and workplace environments.' },
  { icon: Users, title: 'Skill & Career Clarity', text: 'Help students discover their interests, strengths and future pathways.' },
  { icon: ClipboardList, title: 'Curriculum-Integrated', text: 'Age-appropriate workshops and experiences aligned with your academic goals (Grades 6–12).' },
  { icon: Lightbulb, title: 'Engaging & Experiential', text: 'Interactive sessions with industry professionals, site visits and hands-on learning.' },
  { icon: BarChart3, title: 'Value for Your Institution', text: 'Enhance your school’s career counselling and holistic education offerings.' },
  { icon: Handshake, title: 'Ongoing Support', text: 'We handle planning, coordination and execution, with detailed reports and student feedback.' },
];

const INDUSTRY_POINTS: Point[] = [
  { icon: Users, title: 'Showcase Your Industry', text: 'Introduce students to your workplace, processes and innovations.' },
  { icon: Sprout, title: 'Contribute to Society', text: 'Support career awareness and skill development through CSR initiatives.' },
  { icon: GraduationCap, title: 'Build Future Talent', text: 'Create a pipeline of curious, skilled and industry-ready young minds.' },
  { icon: Lightbulb, title: 'Enhance Brand Impact', text: 'Strengthen your brand’s reputation as an organisation that invests in education and the community.' },
  { icon: Network, title: 'Flexible Collaboration', text: 'Partner for industry tours, expert talks, workshops or long-term CSR programs.' },
  { icon: BarChart3, title: 'Measurable Impact', text: 'Help us track and showcase the positive impact created together.' },
];

const VOLUNTEER_GAINS = [
  { icon: Sparkles, title: 'Create real impact', text: 'Give students the career exposure, guidance and opportunities you may have wished for when you were younger. Use your knowledge and experience to make a meaningful difference in their lives.' },
  { icon: Users, title: 'Network with like-minded professionals', text: 'Connect with a diverse community of professionals, educators, creators and industry leaders who share the same passion for education and impact.' },
  { icon: Database, title: 'Access our career database', text: 'Get insights into emerging careers, industry trends and curated resources from our ever-growing database to stay informed and explore new perspectives.' },
  { icon: PartyPopper, title: 'Fun community events and networking opportunities', text: 'Be part of exclusive industry visits, community meetups, panel discussions and knowledge sharing sessions with professionals from different fields.' },
  { icon: Handshake, title: 'Business collaborations and valuable soft skills', text: 'Connect with the community for potential collaborations, partnerships or business opportunities. Also strengthen your own communication, mentoring, leadership and collaboration skills.' },
  { icon: Compass, title: 'Discover new perspectives and give back', text: 'Explore different industries, roles and ideas through interactions with our community, while experiencing the joy and fulfilment of giving back and being part of something bigger than yourself.' },
];

// Which community photos to show, and the point to keep in frame so no faces are cut.
const COMMUNITY_GRID = [
  { index: 0, focus: 'center' },
  { index: 3, focus: 'center 30%' },
  { index: 1, focus: 'center 40%' },
  { index: 4, focus: 'center 30%' },
  { index: 8, focus: 'center' },
  { index: 2, focus: 'center 40%' },
  { index: 5, focus: 'center' },
  { index: 6, focus: 'center' },
];

const PointIcon = ({ icon: Icon, size = 'md' }: { icon: React.ElementType; size?: 'md' | 'lg' }) => (
  <span className={`${size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'} rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0`}>
    <Icon className={size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'} />
  </span>
);

function AudienceBlock({
  id,
  label,
  titleTop,
  titleAccent,
  description,
  rightLabel,
  points,
  prefillRole,
  prefillMessage,
  formUrl,
}: {
  id: string;
  label: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  rightLabel: string;
  points: Point[];
  prefillRole: 'Educational Institution' | 'Mentor';
  prefillMessage: string;
  formUrl?: string;
}) {
  return (
    <RevealSection id={id} className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-6xl mx-auto bg-[#FFF8F0] rounded-3xl border border-orange-100 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col justify-center gap-5">
          <SectionLabel align="left">{label}</SectionLabel>
          <h2 className="font-fraunces text-5xl leading-[1.02] text-slate-950">
            {titleTop}
            <br />
            <span className="text-orange-500">{titleAccent}</span> <Spark />
          </h2>
          <p className="text-slate-600">{description}</p>
          <div>
            {formUrl ? (
              <FormLinkButton href={formUrl}>Partner With Us</FormLinkButton>
            ) : (
              <BookButton prefill={{ role: prefillRole, message: prefillMessage }}>Partner With Us</BookButton>
            )}
          </div>
        </div>
        <div className="lg:col-span-7 lg:border-l border-orange-100 lg:pl-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500 mb-5">{rightLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {points.map(({ icon, title, text }, i) => (
              <Reveal index={i} key={title} className="flex gap-4">
                <PointIcon icon={icon} />
                <div>
                  <p className="font-fraunces font-medium text-slate-950">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

export default function PartnerWithUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF6] text-slate-900 font-sans">
      <Navbar />

      {/* HERO */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Partner With Us</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 leading-tight">
              Create Value. Give Back. <span className="text-orange-500">Shape the Next Generation.</span>
              <Spark className="-translate-y-4" />
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Partner with us to give students real opportunities, contribute to society and help build a brighter, future-ready India.
            </p>
          </div>

          <BenefitRoadmap steps={WHY_PARTNER} />

          <FormLinkButton href={PARTNER_FORM_URL}>Partner With Us</FormLinkButton>
        </div>
      </section>

      {/* BECOME A MENTOR */}
      <RevealSection id="become-a-mentor" className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto bg-[#FFF8F0] rounded-3xl border border-orange-100 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-[3rem_5rem_4rem_6rem] border-2 border-orange-300 bg-orange-100/60 p-10 sm:p-12 space-y-4">
            <p className="font-caveat text-3xl text-orange-500 -rotate-6 origin-left">Make a Difference.</p>
            <h2 className="font-fraunces text-5xl sm:text-6xl leading-[0.95] text-slate-950">
              Become a<br />
              <span className="text-orange-500">Mentor.</span>
            </h2>
            <p className="text-slate-700">
              Share your journey. Inspire young minds.
              <br />
              Help them explore brighter futures.
            </p>
            <FormLinkButton href={PARTNER_FORM_URL}>Become a Mentor</FormLinkButton>
          </div>

          <ul className="space-y-5 lg:border-l border-orange-100 lg:pl-10">
            {MENTOR_POINTS.map(({ icon, title, text }, i) => (
              <Reveal as="li" index={i} key={title} className="flex items-center gap-4">
                <PointIcon icon={icon} size="lg" />
                <div>
                  <p className="font-fraunces font-medium text-slate-950">{title}</p>
                  <p className="text-sm text-slate-500">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </RevealSection>

      <AudienceBlock
        id="institutions"
        label="For Education Institutions"
        titleTop="Education"
        titleAccent="Institutions"
        description="Partner with us to bring real-world career exploration to your students and help them make informed, confident decisions about their future."
        rightLabel="How We Help Your Institution"
        points={INSTITUTION_POINTS}
        prefillRole="Educational Institution"
        prefillMessage="Hi, we're an educational institution and would like to bring READY's career exploration programs to our students."
      />

      <AudienceBlock
        id="industry"
        label="If You Are An Industry"
        titleTop="If you are an"
        titleAccent="Industry"
        description="Open your doors, share your expertise and inspire the next generation of talent."
        rightLabel="How We Create Value Together"
        points={INDUSTRY_POINTS}
        prefillRole="Mentor"
        prefillMessage="Hi, we represent an organisation and would like to partner with READY (industry visits, expert talks or CSR)."
        formUrl={PARTNER_FORM_URL}
      />

      {/* COMMUNITY PHOTOS */}
      <RevealSection id="community" className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="font-fraunces text-4xl sm:text-5xl text-orange-500">Community Photos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMMUNITY_GRID.map(({ index, focus }, position) => (
              <img
                key={index}
                src={encodeURI(COMMUNITY_PHOTOS[index])}
                alt={`READY community session, photo ${position + 1}`}
                loading="lazy"
                style={{ objectPosition: focus }}
                className="w-full aspect-[4/3] object-cover rounded-xl hover:scale-[1.02] transition-transform"
              />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* PURPOSE MEETS PERSONAL GROWTH */}
      <RevealSection id="volunteer" className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#F26A1B] via-[#EA580C] to-[#C2410C] px-6 sm:px-12 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <svg className="absolute right-0 top-0 w-[480px] h-64 text-white/25 pointer-events-none" viewBox="0 0 480 260" aria-hidden="true">
            <path d="M20 10 C 120 160, 300 200, 470 150 M200 10 C 260 100, 380 120, 470 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative space-y-5 text-white">
            <h2 className="font-fraunces text-5xl sm:text-6xl leading-[1.02]">
              Purpose meets
              <br />
              <em className="text-slate-950">personal growth.</em>
            </h2>
            <p className="text-white/90 max-w-md">
              Be part of a community of professionals who come together to create real impact for students — while building meaningful connections, learning and growing in their own journeys.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white pt-4">
              What you gain as a READY volunteer ({VOLUNTEER_GAINS.length} benefits)
            </p>
            <FormLinkButton href={PARTNER_FORM_URL} className="!bg-white !text-orange-600 hover:!bg-orange-50 !shadow-none">
              Join as a Volunteer
            </FormLinkButton>
          </div>

          <div className="relative">
            <CardDeck cards={VOLUNTEER_GAINS} />
          </div>
        </div>
      </RevealSection>

      <ContactSection />

    </div>
  );
}
