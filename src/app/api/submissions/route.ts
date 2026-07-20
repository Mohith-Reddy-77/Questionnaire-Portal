import { NextResponse } from 'next/server';
import { StudentSubmissionDetail } from '@/lib/types';

// Server-side cache for online persistence
let serverSubmissionsStore: StudentSubmissionDetail[] = [];
let serverRecycleBinStore: StudentSubmissionDetail[] = [];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

// Supabase REST fetch helper
async function syncWithExternalCloud() {
  const { url, key } = getSupabaseConfig();

  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/submissions?select=*`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData)) {
          const allItems: StudentSubmissionDetail[] = cloudData.map(item => item.payload || item);
          serverSubmissionsStore = allItems.filter(s => !s.deletedAt);
          serverRecycleBinStore = allItems.filter(s => !!s.deletedAt);
        }
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    }
  }
}

export async function GET() {
  await syncWithExternalCloud();
  return NextResponse.json({
    submissions: serverSubmissionsStore,
    recycleBin: serverRecycleBinStore,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, detail, studentId, notes, status, submissions } = body;
    const { url, key } = getSupabaseConfig();

    if (action === 'save_submission' && detail) {
      const idx = serverSubmissionsStore.findIndex(s => s.profile.id === detail.profile.id || s.profile.email === detail.profile.email);
      if (idx >= 0) {
        serverSubmissionsStore[idx] = detail;
      } else {
        serverSubmissionsStore.unshift(detail);
      }

      if (url && key) {
        try {
          await fetch(`${url}/rest/v1/submissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: key,
              Authorization: `Bearer ${key}`,
              Prefer: 'resolution=merge-duplicates',
            },
            body: JSON.stringify({ id: detail.profile.id, payload: detail }),
          });
        } catch (err) {
          console.warn('Cloud sync push notice:', err);
        }
      }
    } else if (action === 'update_notes' && studentId) {
      const idx = serverSubmissionsStore.findIndex(s => s.profile.id === studentId || s.assessment.studentId === studentId);
      if (idx >= 0) {
        serverSubmissionsStore[idx].report.adminNotes = notes;
        if (status) {
          serverSubmissionsStore[idx].report.status = status;
        }
        const updatedItem = serverSubmissionsStore[idx];
        if (url && key) {
          try {
            await fetch(`${url}/rest/v1/submissions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ id: updatedItem.profile.id, payload: updatedItem }),
            });
          } catch (err) {
            console.warn(err);
          }
        }
      }
    } else if (action === 'move_to_bin' && studentId) {
      const foundInStore = serverSubmissionsStore.find(s => s.profile.id === studentId || s.assessment.studentId === studentId);
      const targetItem = detail || foundInStore;

      if (targetItem) {
        const binItem: StudentSubmissionDetail = { ...targetItem, deletedAt: new Date().toISOString() };
        serverSubmissionsStore = serverSubmissionsStore.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
        serverRecycleBinStore = serverRecycleBinStore.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
        serverRecycleBinStore.unshift(binItem);

        if (url && key) {
          try {
            await fetch(`${url}/rest/v1/submissions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ id: binItem.profile.id, payload: binItem }),
            });
          } catch (e) {
            console.warn('Supabase move_to_bin push notice:', e);
          }
        }
      }
    } else if (action === 'restore_from_bin' && studentId) {
      const foundInBin = serverRecycleBinStore.find(s => s.profile.id === studentId || s.assessment.studentId === studentId);
      const targetItem = detail || foundInBin;

      if (targetItem) {
        const restoredItem: StudentSubmissionDetail = { ...targetItem };
        delete restoredItem.deletedAt;

        serverRecycleBinStore = serverRecycleBinStore.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
        serverSubmissionsStore = serverSubmissionsStore.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
        serverSubmissionsStore.unshift(restoredItem);

        if (url && key) {
          try {
            await fetch(`${url}/rest/v1/submissions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ id: restoredItem.profile.id, payload: restoredItem }),
            });
          } catch (e) {
            console.warn('Supabase restore_from_bin push notice:', e);
          }
        }
      }
    } else if (action === 'permanent_delete' && studentId) {
      serverSubmissionsStore = serverSubmissionsStore.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
      serverRecycleBinStore = serverRecycleBinStore.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);

      if (url && key) {
        try {
          await fetch(`${url}/rest/v1/submissions?id=eq.${studentId}`, {
            method: 'DELETE',
            headers: { apikey: key, Authorization: `Bearer ${key}` },
          });
        } catch (e) {
          console.warn('Supabase permanent_delete error:', e);
        }
      }
    } else if (action === 'empty_bin') {
      const idsToDelete = serverRecycleBinStore.map(s => s.profile.id);
      serverRecycleBinStore = [];
      if (url && key && idsToDelete.length > 0) {
        try {
          for (const id of idsToDelete) {
            await fetch(`${url}/rest/v1/submissions?id=eq.${id}`, {
              method: 'DELETE',
              headers: { apikey: key, Authorization: `Bearer ${key}` },
            });
          }
        } catch (e) {
          console.warn(e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      submissions: serverSubmissionsStore,
      recycleBin: serverRecycleBinStore,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request', details: String(err) }, { status: 500 });
  }
}
