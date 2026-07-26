import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { readOgContributionUpdates } from '@/lib/og-contribution-store';
import { readOgApplications } from '@/lib/og-application-store';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'OG Applications | Rocky Admin',
  robots: { index: false, follow: false },
};

type AdminPageProps = {
  searchParams: Promise<{ key?: string | string[] }>;
};

export default async function OgApplicationsAdminPage({
  searchParams,
}: AdminPageProps) {
  const params = await searchParams;
  const requestedKey = Array.isArray(params.key) ? params.key[0] : params.key;
  const adminToken = process.env.OG_ADMIN_TOKEN;
  const authorized = adminToken
    ? requestedKey === adminToken
    : process.env.NODE_ENV !== 'production';

  if (!authorized) {
    return (
      <main className={styles.lockedPage}>
        <p>[ ROCKY ADMIN ]</p>
        <h1>Access Restricted</h1>
        <span>This dashboard requires an administrator key.</span>
      </main>
    );
  }

  const applications = (await readOgApplications()).sort((first, second) =>
    second.submittedAt.localeCompare(first.submittedAt),
  );
  const contributionUpdates = await readOgContributionUpdates();
  const updatesByApplication = new Map(
    contributionUpdates.map((update) => [update.applicationId, update]),
  );
  const exportHref = adminToken
    ? `/api/og-applications/export?key=${encodeURIComponent(adminToken)}`
    : '/api/og-applications/export';
  const contributionExportHref = adminToken
    ? `/api/og-contributions/export?key=${encodeURIComponent(adminToken)}`
    : '/api/og-contributions/export';

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Rocky home">
          <Image src="/brand/footer-logo.svg" alt="" width={34} height={34} />
          <Image
            src="/brand/rocky-wordmark.svg"
            alt="ROCKY"
            width={96}
            height={19}
          />
        </Link>
        <span>OG ACCESS / ADMIN</span>
      </header>

      <div className={styles.content}>
        <div className={styles.topbar}>
          <div>
            <p>[ APPLICATION DATABASE ]</p>
            <h1>Rocky OG Applications</h1>
          </div>
          <div className={styles.exportActions}>
            <a className={styles.exportButton} href={exportHref}>
              APPLICATIONS CSV <span aria-hidden="true">↓</span>
            </a>
            <a className={styles.exportButton} href={contributionExportHref}>
              UPDATES CSV <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <section className={styles.stats} aria-label="Application statistics">
          <div>
            <span>TOTAL</span>
            <strong>{applications.length.toString().padStart(3, '0')}</strong>
          </div>
          <div>
            <span>PENDING</span>
            <strong>
              {applications
                .filter((application) => application.status === 'pending')
                .length.toString()
                .padStart(3, '0')}
            </strong>
          </div>
          <div>
            <span>CAPACITY</span>
            <strong>500</strong>
          </div>
          <div>
            <span>UPDATES</span>
            <strong>
              {contributionUpdates.length.toString().padStart(3, '0')}
            </strong>
          </div>
        </section>

        <section className={styles.tableShell}>
          {applications.length === 0 ? (
            <div className={styles.empty}>
              <span>NO APPLICATIONS RECORDED</span>
              <p>Submit the OG form to see the first record here.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>REFERENCE</th>
                  <th>APPLICANT</th>
                  <th>X POST</th>
                  <th>PARTY ID</th>
                  <th>PLANNED INVITES</th>
                  <th>CONTRIBUTION</th>
                  <th>EXPERIENCE</th>
                  <th>STATUS</th>
                  <th>SUBMITTED</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => {
                  const update = updatesByApplication.get(application.id);
                  const contributionLinks = update
                    ? [
                        ['AP1', update.applicantPost1],
                        ['AP2', update.applicantPost2],
                        ['I1-1', update.invitee1Post1],
                        ['I1-2', update.invitee1Post2],
                        ['I2-1', update.invitee2Post1],
                        ['I2-2', update.invitee2Post2],
                      ].filter((entry) => entry[1])
                    : [];
                  const contributionWindowOpen =
                    Date.now() <=
                    new Date(application.submittedAt).getTime() +
                      96 * 60 * 60 * 1000;

                  return <tr key={application.id}>
                    <td className={styles.reference}>{application.id}</td>
                    <td>
                      <strong>{application.xHandle}</strong>
                      <small>{application.email}</small>
                    </td>
                    <td>
                      {application.xPostUrl ? (
                        <a
                          href={application.xPostUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          VIEW PUBLIC POST ↗
                        </a>
                      ) : (
                        <small>Legacy record</small>
                      )}
                    </td>
                    <td className={styles.partyId}>
                      {application.walletPartyId || '—'}
                    </td>
                    <td className={styles.invitees}>
                      {application.plannedInvitee1Handle ? (
                        <>
                          <strong>{application.plannedInvitee1Handle}</strong>
                          <small>{application.plannedInvitee1Type}</small>
                          {application.plannedInvitee2Handle && (
                            <>
                              <strong>{application.plannedInvitee2Handle}</strong>
                              <small>{application.plannedInvitee2Type}</small>
                            </>
                          )}
                        </>
                      ) : (
                        <small>Legacy record</small>
                      )}
                    </td>
                    <td>
                      {update ? (
                        <div className={styles.contributionLinks}>
                          <span className={styles.updateReceived}>RECEIVED</span>
                          {contributionLinks.map(([label, href]) => (
                            <a
                              key={label}
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {label} ↗
                            </a>
                          ))}
                        </div>
                      ) : (
                        <small>
                          {contributionWindowOpen ? 'Window open' : 'No update'}
                        </small>
                      )}
                    </td>
                    <td className={styles.experience}>
                      {application.experience}
                    </td>
                    <td>
                      <span className={styles.status}>{application.status}</span>
                    </td>
                    <td>
                      <time dateTime={application.submittedAt}>
                        {new Intl.DateTimeFormat('en', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'UTC',
                        }).format(new Date(application.submittedAt))}
                      </time>
                      <small>UTC</small>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          )}
        </section>

        {!adminToken && (
          <p className={styles.localNotice}>
            Local preview mode. Set <code>OG_ADMIN_TOKEN</code> before deploying
            to protect this dashboard and CSV export.
          </p>
        )}
      </div>
    </main>
  );
}
