import { NextResponse } from 'next/server';

const DEFAULT_BUCKET = 'career-pdfs';

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucket = process.env.SUPABASE_CAREER_PDF_BUCKET || DEFAULT_BUCKET;

  return {
    url,
    key: serviceRoleKey || publishableKey,
    bucket,
  };
};

const sanitizeFileName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');

const isPdfFile = (file: File) => {
  const normalizedName = (file.name || '').toLowerCase();
  const hasPdfExtension = normalizedName.endsWith('.pdf');
  const mimeType = file.type || '';

  return mimeType === 'application/pdf' || mimeType === 'application/octet-stream' || hasPdfExtension;
};

export async function POST(req: Request) {
  const { url, key, bucket } = getSupabaseConfig();

  if (!url) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL in your deployment environment. Add it in Vercel/hosting settings.' },
      { status: 500 }
    );
  }

  if (!key) {
    return NextResponse.json(
      {
        error:
          'Missing Supabase upload credentials. Add SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in your deployment environment.',
      },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const careerId = String(formData.get('careerId') || '').trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 });
    }

    if (!careerId) {
      return NextResponse.json({ error: 'careerId is required.' }, { status: 400 });
    }

    if (!isPdfFile(file)) {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name || 'career-guide.pdf') || 'career-guide.pdf';
    const objectPath = `career-guides/${careerId}/${Date.now()}-${safeName}`;
    const arrayBuffer = await file.arrayBuffer();
    const contentType = file.type && file.type.trim() ? file.type : 'application/pdf';

    const uploadRes = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      body: Buffer.from(arrayBuffer),
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return NextResponse.json(
        {
          error: 'Failed to upload PDF to Supabase Storage. Check that the bucket exists and is writable from your deployed environment.',
          details: errText,
        },
        { status: 500 }
      );
    }

    const publicUrl = `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
    return NextResponse.json({ success: true, pdfUrl: publicUrl, storagePath: objectPath, bucket });
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected upload error.', details: String(err) },
      { status: 500 }
    );
  }
}