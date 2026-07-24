import { NextResponse } from 'next/server';
import { FastTrackSubmission } from '@/lib/types';

// Server-side cache for fast-track leads
let serverFastTrackStore: FastTrackSubmission[] = [];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key for privileged operations like DELETE; fallback to anon/publishable key for read/write.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

async function syncWithExternalCloud() {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/fasttrack_submissions?select=*`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData)) {
          serverFastTrackStore = cloudData.map(item => item.payload || item);
        }
      }
    } catch (err) {
      console.warn('Supabase fast-track fetch notice:', err);
    }
  }
}

export async function GET() {
  await syncWithExternalCloud();
  return NextResponse.json({
    submissions: serverFastTrackStore.filter(s => !s.deletedAt),
    recycleBin: serverFastTrackStore.filter(s => !!s.deletedAt),
  });
}

export async function POST(req: Request) {
  try {
    await syncWithExternalCloud();
    const body = await req.json();
    const { action, submission, id } = body;
    const { url, key } = getSupabaseConfig();

    if (action === 'save' && submission) {
      const idx = serverFastTrackStore.findIndex(s => s.id === submission.id);
      if (idx >= 0) {
        serverFastTrackStore[idx] = submission;
      } else {
        serverFastTrackStore.unshift(submission);
      }

      if (url && key) {
        try {
          await fetch(`${url}/rest/v1/fasttrack_submissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: key,
              Authorization: `Bearer ${key}`,
              Prefer: 'resolution=merge-duplicates',
            },
            body: JSON.stringify({ id: submission.id, payload: submission }),
          });
        } catch (err) {
          console.warn('Supabase fast-track sync push error:', err);
        }
      }
    } else if (action === 'move_to_bin' && id) {
      const target = serverFastTrackStore.find(s => s.id === id);
      if (target) {
        target.deletedAt = new Date().toISOString();
        if (url && key) {
          try {
            await fetch(`${url}/rest/v1/fasttrack_submissions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ id: target.id, payload: target }),
            });
          } catch (err) {
            console.warn(err);
          }
        }
      }
    } else if (action === 'restore_from_bin' && id) {
      const target = serverFastTrackStore.find(s => s.id === id);
      if (target) {
        delete target.deletedAt;
        if (url && key) {
          try {
            await fetch(`${url}/rest/v1/fasttrack_submissions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ id: target.id, payload: target }),
            });
          } catch (err) {
            console.warn(err);
          }
        }
      }
    } else if (action === 'permanent_delete' && id) {
      serverFastTrackStore = serverFastTrackStore.filter(s => s.id !== id);
      if (url && key) {
        try {
          if (!key) {
            console.warn('Supabase key not available for permanent delete');
          } else {
            try {
              const delRes = await fetch(`${url}/rest/v1/fasttrack_submissions?id=eq.${id}`, {
                method: 'DELETE',
                headers: { apikey: key, Authorization: `Bearer ${key}` },
              });
              if (!delRes.ok) {
                console.warn('Supabase delete failed', delRes.status, delRes.statusText);
              }
            } catch (e) {
              console.warn('Error during Supabase delete', e);
            }
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } else if (action === 'empty_bin') {
      const deletedItems = serverFastTrackStore.filter(s => !!s.deletedAt);
      const idsToDelete = deletedItems.map(s => s.id);
      serverFastTrackStore = serverFastTrackStore.filter(s => !s.deletedAt);

      if (url && key && idsToDelete.length > 0) {
        try {
          for (const deleteId of idsToDelete) {
            await fetch(`${url}/rest/v1/fasttrack_submissions?id=eq.${deleteId}`, {
              method: 'DELETE',
              headers: { apikey: key, Authorization: `Bearer ${key}` },
            });
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      submissions: serverFastTrackStore.filter(s => !s.deletedAt),
      recycleBin: serverFastTrackStore.filter(s => !!s.deletedAt),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request', details: String(err) }, { status: 500 });
  }
}
