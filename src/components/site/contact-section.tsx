"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  Mail,
  User,
  GraduationCap,
  Users,
  School,
  Instagram,
  Phone,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { CONTACT, INSTAGRAM_HANDLES, type ContactRole } from '@/lib/site-content';
import { PREFILL_EVENT, type ContactPrefill } from './book-button';
import { SectionLabel } from './section-label';
import { RevealSection } from './reveal';

const ROLES: { role: ContactRole; icon: React.ElementType }[] = [
  { role: 'Parent', icon: User },
  { role: 'Student', icon: GraduationCap },
  { role: 'Mentor', icon: Users },
  { role: 'Educational Institution', icon: School },
];

// Shown at the bottom of the "Reach out to us" panel.
const CONTACT_ITEMS: { icon: React.ElementType; label: string; value: string; href?: string; external?: boolean }[] = [
  { icon: Phone, label: 'Call Us', value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
  { icon: Mail, label: 'Email Us', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ...INSTAGRAM_HANDLES.map((handle) => ({
    icon: Instagram,
    label: 'Instagram',
    value: `@${handle}`,
    href: `https://www.instagram.com/${handle}/`,
    external: true,
  })),
  { icon: MapPin, label: 'Our Location', value: CONTACT.location },
];

const inputClass =
  'w-full rounded-md bg-white/95 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-white';

export const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' as ContactRole | '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Book / Partner buttons elsewhere on the page pre-fill the form.
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const { message, role } = (event as CustomEvent<ContactPrefill>).detail;
      setForm((f) => ({ ...f, message: message ?? f.message, role: role ?? f.role }));
      setStatus('idle');
      setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 600);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', role: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <RevealSection id="contact" className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-[#FFF8F0] rounded-3xl overflow-hidden border border-orange-100 shadow-sm">

        {/* Left: Intro & details */}
        <div className="p-8 sm:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-6">
            <SectionLabel align="left">Reach Out To Us</SectionLabel>
            <h2 className="font-fraunces text-4xl sm:text-5xl leading-[1.08] text-slate-950">
              Let&apos;s build a <span className="text-orange-500">brighter future</span> together.
            </h2>
            <p className="text-slate-600 max-w-sm">
              Have questions, want to know more about our programs, or explore a collaboration? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Contact footer */}
          <div className="flex flex-col gap-4 pt-6 border-t border-orange-100 text-sm">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, external }) => (
              <div key={value} className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="font-fraunces text-slate-900 hover:text-orange-500 break-all"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-fraunces text-slate-900">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#E2652A] to-[#D45A22] p-8 sm:p-10 space-y-5 text-white">
          <SectionLabel align="left" className="[&>span]:text-white [&>span:last-child]:bg-white/80">Get In Touch</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Your name" value={form.name} onChange={update('name')} className={inputClass} aria-label="Your name" />
            <input required type="email" placeholder="Your email" value={form.email} onChange={update('email')} className={inputClass} aria-label="Your email" />
          </div>
          <input type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={update('phone')} className={inputClass} aria-label="Phone number" />

          <fieldset>
            <legend className="text-[10px] uppercase tracking-[0.2em] text-white/90 mb-2">I am reaching out as a</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map(({ role, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role }))}
                  aria-pressed={form.role === role}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-md border px-2 py-3 text-[11px] leading-tight text-center transition-colors ${
                    form.role === role ? 'bg-white text-orange-600 border-white' : 'border-white/50 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {role}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/90 mb-2">How can we help you?</span>
            <textarea ref={messageRef} required rows={4} placeholder="Your message" value={form.message} onChange={update('message')} className={`${inputClass} resize-y`} />
          </label>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-slate-950 py-3 text-sm font-semibold hover:bg-slate-800 disabled:opacity-70 transition-colors"
          >
            {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {status === 'sending' ? 'Sending…' : 'Send Message'}
            {status !== 'sending' && <ArrowRight className="w-4 h-4" />}
          </button>

          {status === 'sent' && (
            <p className="flex items-center gap-2 text-sm bg-white/15 rounded-md px-3 py-2" role="status">
              <CheckCircle2 className="w-4 h-4" /> Thank you! We&apos;ll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm bg-slate-950/30 rounded-md px-3 py-2" role="alert">
              Something went wrong. Please email us at {CONTACT.email}.
            </p>
          )}
        </form>
      </div>
    </RevealSection>
  );
};
