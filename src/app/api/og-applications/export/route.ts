import { getApplicationsCsv } from '@/lib/og-application-store';

export async function GET(request: Request) {
  const adminToken = process.env.OG_ADMIN_TOKEN;
  const requestToken = new URL(request.url).searchParams.get('key');

  if (
    (adminToken && requestToken !== adminToken) ||
    (!adminToken && process.env.NODE_ENV === 'production')
  ) {
    return new Response('Not found', { status: 404 });
  }

  const csv = await getApplicationsCsv();
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="rocky-og-applications-${date}.csv"`,
      'Content-Type': 'text/csv; charset=utf-8',
    },
  });
}
