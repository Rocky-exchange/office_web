'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import {
  OgAccessApiError,
  resolveOgApplication,
  submitOgContribution,
} from '@/lib/og-access-api';
import type { OgContributionInput } from '@/types/og-access';
import styles from './og-access.module.css';

const steps = [
  { number: '01', label: 'Application' },
  { number: '02', label: 'Public Posts' },
] as const;

const postGroups = [
  {
    title: 'APPLICANT POSTS',
    description: 'Post #1 is required. A second thoughtful post is optional.',
    fields: [
      { key: 'applicantPost1', label: 'APPLICANT POST #1', required: true },
      { key: 'applicantPost2', label: 'APPLICANT POST #2', required: false },
    ],
  },
  {
    title: 'INVITEE #1 POSTS',
    description: 'Optional evidence from your first planned invitee.',
    fields: [
      { key: 'invitee1Post1', label: 'INVITEE #1 POST #1', required: false },
      { key: 'invitee1Post2', label: 'INVITEE #1 POST #2', required: false },
    ],
  },
  {
    title: 'INVITEE #2 POSTS',
    description: 'Optional evidence from your second planned invitee.',
    fields: [
      { key: 'invitee2Post1', label: 'INVITEE #2 POST #1', required: false },
      { key: 'invitee2Post2', label: 'INVITEE #2 POST #2', required: false },
    ],
  },
] as const;

type FieldErrors = Record<string, string>;
type PostField =
  | 'applicantPost1'
  | 'applicantPost2'
  | 'invitee1Post1'
  | 'invitee1Post2'
  | 'invitee2Post1'
  | 'invitee2Post2';

function isXPostUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    return (
      url.protocol === 'https:' &&
      (hostname === 'x.com' || hostname === 'twitter.com') &&
      url.pathname.split('/').filter(Boolean).length >= 3
    );
  } catch {
    return false;
  }
}

function validateStep(step: number, form: OgContributionInput) {
  const errors: FieldErrors = {};

  if (step === 0) {
    const applicationId = form.applicationId.trim().toUpperCase();
    const email = form.email.trim();

    if (!applicationId && !email) {
      errors.applicationId = 'Enter your OG application reference or email.';
      errors.email = 'Enter your OG application reference or email.';
    } else if (
      applicationId &&
      !/^OG-APP-[A-Z0-9]{8}$/.test(applicationId)
    ) {
      errors.applicationId = 'Enter a valid OG application reference.';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter the email used in your OG application.';
    }
  }

  if (step === 1) {
    if (!isXPostUrl(form.applicantPost1.trim())) {
      errors.applicantPost1 = 'Enter a direct link to your public X post.';
    }

    const optionalFields: PostField[] = [
      'applicantPost2',
      'invitee1Post1',
      'invitee1Post2',
      'invitee2Post1',
      'invitee2Post2',
    ];
    optionalFields.forEach((field) => {
      if (form[field].trim() && !isXPostUrl(form[field].trim())) {
        errors[field] = 'Enter a direct public X post link or leave this blank.';
      }
    });

    if (!form.consent) {
      errors.consent = 'Confirm that the submitted posts are public and authentic.';
    }
  }

  return errors;
}

type OgContributionFormProps = {
  initialApplicationId?: string;
};

export function OgContributionForm({
  initialApplicationId = '',
}: OgContributionFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OgContributionInput>({
    applicationId: initialApplicationId.toUpperCase(),
    email: '',
    applicantPost1: '',
    applicantPost2: '',
    invitee1Post1: '',
    invitee1Post2: '',
    invitee2Post1: '',
    invitee2Post2: '',
    consent: false,
    website: '',
    source: 'rocky-website',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resolutionMessage, setResolutionMessage] = useState('');
  const [updateId, setUpdateId] = useState('');

  function updateField<Key extends keyof OgContributionInput>(
    key: Key,
    value: OgContributionInput[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === 'applicationId' || key === 'email') {
      setResolutionMessage('');
      setSubmitError('');
    }
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function resolveApplication(
    values: { applicationId?: string; email?: string } = {},
    showError = true,
  ) {
    const applicationId =
      values.applicationId ?? form.applicationId.trim().toUpperCase();
    const email = values.email ?? form.email.trim().toLowerCase();
    const hasValidReference = /^OG-APP-[A-Z0-9]{8}$/.test(applicationId);
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!hasValidReference && !hasValidEmail) {
      return null;
    }

    setResolving(true);
    if (showError) {
      setSubmitError('');
    }

    try {
      const resolution = await resolveOgApplication({
        applicationId: hasValidReference ? applicationId : undefined,
        email: hasValidEmail ? email : undefined,
      });
      setForm((current) => ({
        ...current,
        applicationId: resolution.applicationId,
        email: resolution.email,
      }));
      setErrors({});
      setResolutionMessage(
        resolution.windowOpen
          ? 'Application matched. Reference and email are linked.'
          : '',
      );

      if (!resolution.windowOpen) {
        setSubmitError('The 96-hour contribution window has closed.');
        return null;
      }

      return resolution;
    } catch (error) {
      if (showError) {
        setSubmitError(
          error instanceof OgAccessApiError
            ? error.message
            : 'Unable to find the OG application. Please try again.',
        );
      }
      return null;
    } finally {
      setResolving(false);
    }
  }

  async function goForward() {
    const nextErrors = validateStep(step, form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const resolution = await resolveApplication();
    if (resolution) {
      setErrors({});
      setStep(1);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 0) {
      await goForward();
      return;
    }

    const nextErrors = validateStep(step, form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      if (form.website) {
        setSubmitError('Unable to submit this contribution update.');
        return;
      }

      const result = await submitOgContribution(form);
      setUpdateId(result.updateId);
    } catch (error) {
      setSubmitError(
        error instanceof OgAccessApiError
          ? error.message
          : 'The contribution service is temporarily unavailable. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true">
        <video
          className={styles.backgroundVideo}
          src="/hero-background.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.backgroundOverlay} />
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Rocky home">
          <Image src="/brand/footer-logo.svg" alt="" width={38} height={38} />
          <Image
            src="/brand/rocky-wordmark.svg"
            alt="ROCKY"
            width={104}
            height={20}
          />
        </Link>
        <div className={styles.headerStatus}>
          <span className={styles.liveDot} />
          CONTRIBUTION WINDOW
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.introPanel}>
          <div className={styles.badge} aria-hidden="true">
            <div className={styles.badgeCore}>
              <Image
                src="/brand/rocky-mark.svg"
                alt=""
                width={54}
                height={54}
              />
            </div>
          </div>
          <p className={styles.eyebrow}>[ OPTIONAL CONTRIBUTION UPDATE ]</p>
          <h1>
            Add Signal To
            <span>Your Application.</span>
          </h1>
          <p className={styles.introCopy}>
            Within 96 hours of applying, submit thoughtful public posts from
            yourself and, optionally, your planned invitees. Quality and
            originality matter more than post volume.
          </p>
          <dl className={styles.accessFacts}>
            <div>
              <dt>WINDOW</dt>
              <dd>96 HOURS</dd>
            </div>
            <div>
              <dt>STATUS</dt>
              <dd>OPTIONAL SIGNAL</dd>
            </div>
          </dl>
        </section>

        <section className={styles.formPanel}>
          {updateId ? (
            <div className={styles.success} aria-live="polite">
              <div className={styles.successMark}>✓</div>
              <p className={styles.eyebrow}>[ UPDATE RECEIVED ]</p>
              <h2>Contribution Recorded.</h2>
              <p>
                Your public post links have been connected to your OG
                application. This may strengthen your application but does not
                guarantee selection.
              </p>
              <div className={styles.applicationId}>{updateId}</div>
              <Link href="/" className={styles.primaryAction}>
                RETURN TO ROCKY <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.progressHeader}>
                <div>
                  <p className={styles.panelKicker}>CONTRIBUTION UPDATE</p>
                  <h2>{steps[step].label}</h2>
                </div>
                <p className={styles.stepCount}>{steps[step].number} / 02</p>
              </div>

              <ol
                className={`${styles.progress} ${styles.progressTwo}`}
                aria-label="Contribution update progress"
              >
                {steps.map((item, index) => (
                  <li
                    key={item.number}
                    className={index <= step ? styles.progressActive : undefined}
                  >
                    <span>{item.number}</span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ol>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <input
                  className={styles.honeypot}
                  name="website"
                  value={form.website}
                  onChange={(event) => updateField('website', event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div key={step} className={styles.stepPanel}>
                  {step === 0 && (
                    <>
                      <div className={styles.windowNote}>
                        <p>[ 96-HOUR WINDOW ]</p>
                        <span>
                          Use the reference shown after your OG application.
                          Your email must match the original application.
                        </span>
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="applicationId">
                          OG APPLICATION REFERENCE
                        </label>
                        <input
                          id="applicationId"
                          name="applicationId"
                          value={form.applicationId}
                          onChange={(event) =>
                            updateField(
                              'applicationId',
                              event.target.value.toUpperCase(),
                            )
                          }
                          onBlur={(event) => {
                            const applicationId =
                              event.target.value.trim().toUpperCase();
                            if (
                              /^OG-APP-[A-Z0-9]{8}$/.test(applicationId) &&
                              !form.email.trim()
                            ) {
                              void resolveApplication({ applicationId });
                            }
                          }}
                          placeholder="OG-APP-XXXXXXXX"
                          autoComplete="off"
                          aria-invalid={Boolean(errors.applicationId)}
                        />
                        {errors.applicationId && (
                          <p className={styles.fieldError}>
                            {errors.applicationId}
                          </p>
                        )}
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="contributionEmail">
                          APPLICATION EMAIL
                        </label>
                        <input
                          id="contributionEmail"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            updateField('email', event.target.value)
                          }
                          onBlur={(event) => {
                            const email = event.target.value.trim().toLowerCase();
                            if (
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                              !form.applicationId.trim()
                            ) {
                              void resolveApplication({ email });
                            }
                          }}
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                          <p className={styles.fieldError}>{errors.email}</p>
                        )}
                      </div>
                      {resolutionMessage && (
                        <p
                          className={styles.resolutionMessage}
                          role="status"
                          aria-live="polite"
                        >
                          ✓ {resolutionMessage}
                        </p>
                      )}
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div className={styles.windowNote}>
                        <p>[ QUALITY OVER VOLUME ]</p>
                        <span>
                          Applicant Post #1 is required. Every other post is
                          optional and can provide additional context for review.
                        </span>
                      </div>

                      {postGroups.map((group) => (
                        <section key={group.title} className={styles.postSection}>
                          <div className={styles.postSectionHeader}>
                            <strong>{group.title}</strong>
                            <span>{group.description}</span>
                          </div>
                          <div className={styles.postGrid}>
                            {group.fields.map((field) => (
                              <div key={field.key} className={styles.field}>
                                <label htmlFor={field.key}>
                                  {field.label}{' '}
                                  {!field.required && '(OPTIONAL)'}
                                </label>
                                <input
                                  id={field.key}
                                  name={field.key}
                                  type="url"
                                  value={form[field.key]}
                                  onChange={(event) =>
                                    updateField(
                                      field.key as PostField,
                                      event.target.value,
                                    )
                                  }
                                  placeholder="https://x.com/handle/status/..."
                                  autoComplete="url"
                                  aria-invalid={Boolean(errors[field.key])}
                                />
                                {errors[field.key] && (
                                  <p className={styles.fieldError}>
                                    {errors[field.key]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </section>
                      ))}

                      <label className={styles.consent}>
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(event) =>
                            updateField('consent', event.target.checked)
                          }
                        />
                        <span>
                          I confirm these are authentic public posts and will
                          remain available during the selection process.
                        </span>
                      </label>
                      {errors.consent && (
                        <p className={styles.fieldError}>{errors.consent}</p>
                      )}
                    </>
                  )}
                </div>

                {submitError && (
                  <div className={styles.submitError} role="alert">
                    {submitError}
                  </div>
                )}

                <div className={styles.actions}>
                  {step > 0 ? (
                    <button
                      type="button"
                      className={styles.secondaryAction}
                      onClick={() => {
                        setErrors({});
                        setStep(0);
                      }}
                    >
                      ← BACK
                    </button>
                  ) : (
                    <Link href="/og-access" className={styles.secondaryAction}>
                      ← OG APPLICATION
                    </Link>
                  )}
                  <button
                    type="submit"
                    className={styles.primaryAction}
                    disabled={submitting || resolving}
                  >
                    {step === 1
                      ? submitting
                        ? 'RECORDING...'
                        : 'SUBMIT UPDATE'
                      : resolving
                        ? 'LOOKING UP...'
                        : 'CONTINUE'}
                    {!submitting && !resolving && (
                      <span aria-hidden="true">→</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
