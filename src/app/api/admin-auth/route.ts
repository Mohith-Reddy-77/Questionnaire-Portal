import { NextResponse } from 'next/server';

let serverAdminPasswordStore = '1234';

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

export async function GET() {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/settings?id=eq.admin_password&select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData) && cloudData.length > 0 && cloudData[0].value) {
          serverAdminPasswordStore = cloudData[0].value;
        }
      }
    } catch (e) {
      console.warn('Supabase fetch admin password notice:', e);
    }
  }
  return NextResponse.json({ password: serverAdminPasswordStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, password, inputPassword } = body;

    if (action === 'verify') {
      const { url, key } = getSupabaseConfig();
      if (url && key) {
        try {
          const res = await fetch(`${url}/rest/v1/settings?id=eq.admin_password&select=*`, {
            headers: { apikey: key, Authorization: `Bearer ${key}` },
          });
          if (res.ok) {
            const cloudData = await res.json();
            if (Array.isArray(cloudData) && cloudData.length > 0 && cloudData[0].value) {
              serverAdminPasswordStore = cloudData[0].value;
            }
          }
        } catch (e) {
          console.warn(e);
        }
      }

      const clean = (inputPassword || '').trim();
      // Strict DB password verification - ONLY matches exact database password
      const isValid = clean === serverAdminPasswordStore;
      return NextResponse.json({ isValid });
    }

    if (action === 'update' && password) {
      const cleanPass = String(password).trim();
      serverAdminPasswordStore = cleanPass;

      const { url, key } = getSupabaseConfig();
      if (url && key) {
        try {
          await fetch(`${url}/rest/v1/settings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: key,
              Authorization: `Bearer ${key}`,
              Prefer: 'resolution=merge-duplicates',
            },
            body: JSON.stringify({ id: 'admin_password', value: cleanPass }),
          });
        } catch (e) {
          console.warn('Supabase push admin password notice:', e);
        }
      }
      return NextResponse.json({ success: true, password: serverAdminPasswordStore });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process password request', details: String(err) }, { status: 500 });
  }
}
