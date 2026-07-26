import { NextResponse } from 'next/server';

import { validateOgContribution } from '@/lib/og-contribution-schema';
import { saveOgContributionUpdate } from '@/lib/og-contribution-store';
import { readOgApplications } from '@/lib/og-application-store';

const CONTRIBUTION_WINDOW_MS = 96 * 60 * 60 * 1000;

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

  const validation = validateOgContribution(body);

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
    const applications = await readOgApplications();
    const application = applications.find(
      (item) =>
        item.id === validation.data.applicationId &&
        item.email.toLowerCase() === validation.data.email,
    );

    if (!application) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Application reference and email do not match.',
          errors: {
            applicationId: 'Check your application reference and email.',
          },
        },
        { status: 404 },
      );
    }

    const deadline = new Date(application.submittedAt).getTime() +
      CONTRIBUTION_WINDOW_MS;

    if (Date.now() > deadline) {
      return NextResponse.json(
        {
          ok: false,
          message: 'The 96-hour contribution window has closed.',
        },
        { status: 410 },
      );
    }

    const update = await saveOgContributionUpdate(validation.data);
    return NextResponse.json({
      ok: true,
      updateId: update.id,
      submittedAt: update.submittedAt,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to save the contribution update. Please try again.',
      },
      { status: 500 },
    );
  }
}
