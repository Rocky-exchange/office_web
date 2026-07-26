import { NextResponse } from 'next/server';

import { validateOgApplication } from '@/lib/og-application-schema';
import { saveOgApplication } from '@/lib/og-application-store';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const validation = validateOgApplication(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Please review the highlighted fields.',
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  try {
    const application = await saveOgApplication(validation.data);
    return NextResponse.json({
      ok: true,
      applicationId: application.id,
      submittedAt: application.submittedAt,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to save the application. Please try again.',
      },
      { status: 500 },
    );
  }
}
