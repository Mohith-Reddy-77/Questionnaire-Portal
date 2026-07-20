import { NextResponse } from 'next/server';
import { QuestionnaireQuestion } from '@/lib/types';
import { questionnaireQuestions } from '@/lib/mock-data';

let serverQuestionsStore: QuestionnaireQuestion[] = [...questionnaireQuestions];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

export async function GET() {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/questions?select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          serverQuestionsStore = cloudData.map(item => item.payload || item);
        }
      }
    } catch (e) {
      console.warn('Supabase fetch questions notice:', e);
    }
  }
  return NextResponse.json({ questions: serverQuestionsStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, questionId, questions } = body;
    const { url, key } = getSupabaseConfig();

    if (action === 'delete' && questionId) {
      serverQuestionsStore = serverQuestionsStore.filter(q => q.id !== questionId);

      if (url && key) {
        try {
          await fetch(`${url}/rest/v1/questions?id=eq.${questionId}`, {
            method: 'DELETE',
            headers: { apikey: key, Authorization: `Bearer ${key}` },
          });
        } catch (e) {
          console.warn('Supabase delete question notice:', e);
        }
      }
    } else if (Array.isArray(questions)) {
      serverQuestionsStore = questions;

      if (url && key) {
        try {
          // Fetch existing IDs to remove deleted ones
          const existingRes = await fetch(`${url}/rest/v1/questions?select=id`, {
            headers: { apikey: key, Authorization: `Bearer ${key}` },
          });
          if (existingRes.ok) {
            const existingRows: { id: string }[] = await existingRes.json();
            const newIds = new Set(questions.map((q: any) => q.id));
            const toDelete = existingRows.filter(r => !newIds.has(r.id));

            for (const row of toDelete) {
              await fetch(`${url}/rest/v1/questions?id=eq.${row.id}`, {
                method: 'DELETE',
                headers: { apikey: key, Authorization: `Bearer ${key}` },
              });
            }
          }

          // Upsert current questions
          if (questions.length > 0) {
            await fetch(`${url}/rest/v1/questions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: key,
                Authorization: `Bearer ${key}`,
                Prefer: 'resolution=merge-duplicates',
              },
              body: JSON.stringify(questions.map((q: any) => ({ id: q.id, payload: q }))),
            });
          }
        } catch (e) {
          console.warn('Supabase push questions notice:', e);
        }
      }
    }
    return NextResponse.json({ success: true, questions: serverQuestionsStore });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save questions', details: String(err) }, { status: 500 });
  }
}
