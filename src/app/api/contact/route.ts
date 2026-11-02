import { NextResponse } from 'next/server';

const ROLES = ['Parent', 'Student', 'Mentor', 'Educational Institution'];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Service role key keeps the contact_messages table closed to public reads.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return { url, key };
}

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const message = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 30),
    role: ROLES.includes(body.role as string) ? (body.role as string) : '',
    message: clean(body.message, 4000),
    page: clean(body.page, 100),
    submittedAt: new Date().toISOString(),
  };

  if (!message.name || !message.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email)) {
    return NextResponse.json({ error: 'Name, a valid email and a message are required.' }, { status: 400 });
  }

  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    console.warn('Contact message not saved: Supabase is not configured.', message);
    return NextResponse.json({ error: 'Contact form is not configured yet.' }, { status: 503 });
  }

  const res = await fetch(`${url}/rest/v1/contact_messages`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ id: crypto.randomUUID(), payload: message }),
  });

  if (!res.ok) {
    console.error('Supabase contact insert failed:', res.status, await res.text());
    return NextResponse.json({ error: 'Could not save your message.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
