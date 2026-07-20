import { NextResponse } from 'next/server';
import { CareerProfile } from '@/lib/types';
import { careerCatalog } from '@/lib/mock-data';

let serverCareersStore: CareerProfile[] = [...careerCatalog];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

export async function GET() {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/careers?select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          serverCareersStore = cloudData.map(item => item.payload || item);
        }
      }
    } catch (e) {
      console.warn('Supabase fetch careers notice:', e);
    }
  }
  return NextResponse.json({ careers: serverCareersStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, careerId, careers } = body;
    const { url, key } = getSupabaseConfig();

    if (action === 'delete' && careerId) {
      serverCareersStore = serverCareersStore.filter(c => c.id !== careerId);

      if (url && key) {
        try {
          await fetch(`${url}/rest/v1/careers?id=eq.${careerId}`, {
            method: 'DELETE',
            headers: { apikey: key, Authorization: `Bearer ${key}` },
          });
        } catch (e) {
          console.warn('Supabase delete career notice:', e);
        }
      }
    } else if (Array.isArray(careers)) {
      serverCareersStore = careers;

      if (url && key) {
        try {
          // Fetch existing IDs to remove deleted ones
          const existingRes = await fetch(`${url}/rest/v1/careers?select=id`, {
            headers: { apikey: key, Authorization: `Bearer ${key}` },
          });
          if (existingRes.ok) {
            const existingRows: { id: string }[] = await existingRes.json();
            const newIds = new Set(careers.map((c: any) => c.id));
            const toDelete = existingRows.filter(r => !newIds.has(r.id));

            for (const row of toDelete) {
              await fetch(`${url}/rest/v1/careers?id=eq.${row.id}`, {
                method: 'DELETE',
                headers: { apikey: key, Authorization: `Bearer ${key}` },
              });
            }
          }

          // Upsert current careers
          if (careers.length > 0) {
            await fetch(`${url}/rest/v1/careers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify(careers.map((c: any) => ({ id: c.id, payload: c }))),
            });
          }
        } catch (e) {
          console.warn('Supabase push careers notice:', e);
        }
      }
    }
    return NextResponse.json({ success: true, careers: serverCareersStore });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save career options', details: String(err) }, { status: 500 });
  }
}
