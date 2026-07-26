'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import {
  OgAccessApiError,
  submitOgApplication,
} from '@/lib/og-access-api';
import type { OgApplicationInput } from '@/types/og-access';
import styles from './og-access.module.css';

const steps = [
  { number: '01', label: 'Identity' },
  { number: '02', label: 'Verification' },
  { number: '03', label: 'Network' },
  { number: '04', label: 'Experience' },
] as const;

const inviteeTypes = [
  'Individual',
  'Project',
  'Institution',
  'Community',
  'Market Maker',
  'Other',
] as const;

const initialForm: OgApplicationInput = {
  xHandle: '',
  email: '',
  xPostUrl: '',
  walletPartyId: '',
  plannedInvitee1Handle: '',
  plannedInvitee1Type: '',
  plannedInvitee2Handle: '',
  plannedInvitee2Type: '',
  experience: '',
  consent: false,
  website: '',
  source: 'rocky-website',
};

type FieldErrors = Record<string, string>;

function isXPostUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    return (
      url.protocol === 'https:' &&
      (hostname === 'x.com' || hostname === 'twitter.com') &&
      url.pathname.split('/').filter(Boolean).length >= 1
    );
  } catch {
    return false;
  }
}

function validateStep(step: number, form: OgApplicationInput) {
  const errors: FieldErrors = {};

  if (step === 0) {
    if (!/^@?[A-Za-z0-9_]{1,15}$/.test(form.xHandle.trim())) {
      errors.xHandle = 'Enter a valid X handle.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
  }

  if (step === 1) {
    if (!isXPostUrl(form.xPostUrl.trim())) {
      errors.xPostUrl = 'Enter a direct link to your public X reply or quote post.';
    }
  }

  if (step === 2) {
    if (!/^@?[A-Za-z0-9_]{1,15}$/.test(form.plannedInvitee1Handle.trim())) {
      errors.plannedInvitee1Handle = 'Enter a valid X handle for Invitee #1.';
    }
    if (!form.plannedInvitee1Type) {
      errors.plannedInvitee1Type = 'Select a type for Invitee #1.';
    }
    if (
      form.plannedInvitee2Handle.trim() &&
      !/^@?[A-Za-z0-9_]{1,15}$/.test(form.plannedInvitee2Handle.trim())
    ) {
      errors.plannedInvitee2Handle = 'Enter a valid X handle for Invitee #2.';
    }
    if (form.plannedInvitee2Handle.trim() && !form.plannedInvitee2Type) {
      errors.plannedInvitee2Type = 'Select a type for Invitee #2.';
    }
    if (!form.plannedInvitee2Handle.trim() && form.plannedInvitee2Type) {
      errors.plannedInvitee2Handle = 'Enter the X handle for Invitee #2.';
    }
  }

  if (step === 3) {
    if (!form.experience.trim()) {
      errors.experience = 'Tell us about your Canton or trading experience.';
    }
    if (!form.consent) {
      errors.consent = 'Consent is required to submit the application.';
    }
  }

  return errors;
}

export function OgApplicationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');

  function updateField<Key extends keyof OgApplicationInput>(
    key: Key,
    value: OgApplicationInput[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function goForward() {
    const nextErrors = validateStep(step, form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < steps.length - 1) {
      goForward();
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
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source') || 'rocky-website';
      if (form.website) {
        setSubmitError('Unable to submit this application.');
        return;
      }

      const result = await submitOgApplication({ ...form, source });
      setApplicationId(result.applicationId);
      setSubmittedAt(result.submittedAt);
    } catch (error) {
      setSubmitError(
        error instanceof OgAccessApiError
          ? error.message
          : 'The application service is temporarily unavailable. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  const contributionDeadline = submittedAt
    ? new Date(new Date(submittedAt).getTime() + 96 * 60 * 60 * 1000)
    : null;
  const contributionDeadlineLabel = contributionDeadline?.toLocaleString(
    'en',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    },
  );

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
          OG ACCESS PROTOCOL
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
          <p className={styles.eyebrow}>[ LIMITED EARLY ACCESS ]</p>
          <h1>
            Enter The First
            <span>500 Rocky OGs.</span>
          </h1>
          <p className={styles.introCopy}>
            Apply for early product access, help shape the trading experience,
            and earn a place in Rocky&apos;s founding cohort.
          </p>
          <dl className={styles.accessFacts}>
            <div>
              <dt>COHORT</dt>
              <dd>001—500</dd>
            </div>
            <div>
              <dt>STATUS</dt>
              <dd>APPLICATIONS OPEN</dd>
            </div>
          </dl>
        </section>

        <section className={styles.formPanel}>
          {applicationId ? (
            <div className={styles.success} aria-live="polite">
              <div className={styles.successMark}>✓</div>
              <p className={styles.eyebrow}>[ APPLICATION RECEIVED ]</p>
              <h2>You&apos;re In The Review Queue.</h2>
              <p>
                Your application has been recorded. Keep this reference number
                to add information during the review period.
              </p>
              <div className={styles.applicationId}>{applicationId}</div>
              <div className={styles.contributionGuide}>
                <div className={styles.contributionGuideHeader}>
                  <p>[ STAND OUT DURING REVIEW ]</p>
                  <h3>Create With Your Network.</h3>
                </div>
                <p>
                  During your 96-hour review window, you can create thoughtful
                  Rocky content together with your planned invitees. Public
                  contributions help our team notice your application and may
                  improve your chances of becoming a Rocky OG.
                </p>
                <ol>
                  <li>
                    <span>01</span>
                    <strong>CREATE</strong>
                    <small>Publish 1–2 thoughtful posts about Rocky.</small>
                  </li>
                  <li>
                    <span>02</span>
                    <strong>COLLABORATE</strong>
                    <small>
                      Invite your planned friends or institutions to contribute.
                    </small>
                  </li>
                  <li>
                    <span>03</span>
                    <strong>SUBMIT</strong>
                    <small>Add the public X post links before the deadline.</small>
                  </li>
                </ol>
                <p className={styles.contributionGuideNote}>
                  Invitee participation is optional. Contribution evidence can
                  strengthen an application but does not guarantee selection.
                </p>
              </div>
              {contributionDeadlineLabel && (
                <p className={styles.deadline}>
                  CONTRIBUTION WINDOW CLOSES {contributionDeadlineLabel}
                </p>
              )}
              <div className={styles.successActions}>
                <Link
                  href={`/og-access/update?applicationId=${encodeURIComponent(applicationId)}`}
                  className={styles.primaryAction}
                >
                  SUBMIT CONTRIBUTION UPDATE{' '}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/" className={styles.secondaryAction}>
                  RETURN TO ROCKY
                </Link>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <Link
                  href="/og-access/update"
                  className={styles.returningApplicant}
                >
                  <span>[ ALREADY APPLIED? ]</span>
                  <strong>SUBMIT X CONTRIBUTION UPDATE</strong>
                  <span aria-hidden="true">→</span>
                </Link>
              )}
              <div className={styles.progressHeader}>
                <div>
                  <p className={styles.panelKicker}>OG APPLICATION</p>
                  <h2>{steps[step].label}</h2>
                </div>
                <p className={styles.stepCount}>
                  {steps[step].number} / 04
                </p>
              </div>

              <ol className={styles.progress} aria-label="Application progress">
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
                      <div className={styles.field}>
                        <label htmlFor="xHandle">X HANDLE</label>
                        <input
                          id="xHandle"
                          name="xHandle"
                          value={form.xHandle}
                          onChange={(event) =>
                            updateField('xHandle', event.target.value)
                          }
                          placeholder="@yourhandle"
                          autoComplete="off"
                          aria-invalid={Boolean(errors.xHandle)}
                        />
                        {errors.xHandle && (
                          <p className={styles.fieldError}>{errors.xHandle}</p>
                        )}
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="email">EMAIL</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            updateField('email', event.target.value)
                          }
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                          <p className={styles.fieldError}>{errors.email}</p>
                        )}
                      </div>

                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div className={styles.qualificationNote}>
                        <p>[ SEASON 0 REQUIREMENTS ]</p>
                        <ol>
                          <li>
                            Follow{' '}
                            <a
                              href="https://x.com/Rocky_exchange"
                              target="_blank"
                              rel="noreferrer"
                            >
                              @Rocky_exchange
                            </a>{' '}
                            on X.
                          </li>
                          <li>
                            Reply to or quote the official Season 0 announcement.
                          </li>
                          <li>
                            Optionally create a Rocky Wallet and provide your
                            public Party ID below.
                          </li>
                          <li>
                            Keep your X account and qualifying post public until
                            selection is complete.
                          </li>
                        </ol>
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="xPostUrl">LINK TO YOUR X POST</label>
                        <p className={styles.fieldHelp}>
                          Submit the direct link to your public reply or quote
                          post interacting with the designated Rocky announcement.
                        </p>
                        <input
                          id="xPostUrl"
                          name="xPostUrl"
                          type="url"
                          value={form.xPostUrl}
                          onChange={(event) =>
                            updateField('xPostUrl', event.target.value)
                          }
                          placeholder="https://x.com/yourhandle/status/..."
                          autoComplete="url"
                          aria-invalid={Boolean(errors.xPostUrl)}
                        />
                        {errors.xPostUrl && (
                          <p className={styles.fieldError}>{errors.xPostUrl}</p>
                        )}
                      </div>

                      <div className={styles.walletCard}>
                        <div>
                          <p>[ OPTIONAL ROCKY WALLET ]</p>
                          <h3>Create Your Rocky Wallet</h3>
                          <span>
                            Open Rocky Wallet and create your account, then copy
                            your public Party ID into the field below.
                          </span>
                        </div>
                        <a
                          href="https://extension.rocky.exchange/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          CREATE ROCKY WALLET <span aria-hidden="true">↗</span>
                        </a>
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="walletPartyId">
                          ROCKY WALLET PARTY ID (OPTIONAL)
                        </label>
                        <p className={styles.fieldHelp}>
                          Enter your public Rocky Wallet Party ID only.
                        </p>
                        <input
                          id="walletPartyId"
                          name="walletPartyId"
                          value={form.walletPartyId}
                          onChange={(event) =>
                            updateField('walletPartyId', event.target.value)
                          }
                          placeholder="Paste your public Party ID"
                          autoComplete="off"
                          aria-describedby="walletPartyIdSafety"
                        />
                        <p
                          id="walletPartyIdSafety"
                          className={styles.securityNote}
                        >
                          Never submit your seed phrase, private key, password,
                          or recovery phrase.
                        </p>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className={styles.networkIntro}>
                        <p>[ PLANNED INVITATIONS ]</p>
                        <h3>Who Would You Bring To Rocky?</h3>
                        <span>
                          Selected OGs may receive invitation access. Nominate
                          up to two high-quality people, projects, communities,
                          or institutions. Quality matters more than reach.
                        </span>
                      </div>

                      <div className={styles.inviteeGrid}>
                        <section className={styles.inviteeCard}>
                          <div className={styles.inviteeHeader}>
                            <strong>INVITEE #1</strong>
                            <span>REQUIRED</span>
                          </div>
                          <div className={styles.field}>
                            <label htmlFor="plannedInvitee1Handle">
                              INVITEE #1 X HANDLE
                            </label>
                            <input
                              id="plannedInvitee1Handle"
                              name="plannedInvitee1Handle"
                              value={form.plannedInvitee1Handle}
                              onChange={(event) =>
                                updateField(
                                  'plannedInvitee1Handle',
                                  event.target.value,
                                )
                              }
                              placeholder="@handle"
                              autoComplete="off"
                              aria-invalid={Boolean(
                                errors.plannedInvitee1Handle,
                              )}
                            />
                            {errors.plannedInvitee1Handle && (
                              <p className={styles.fieldError}>
                                {errors.plannedInvitee1Handle}
                              </p>
                            )}
                          </div>
                          <div className={styles.field}>
                            <label htmlFor="plannedInvitee1Type">
                              INVITEE #1 TYPE
                            </label>
                            <select
                              id="plannedInvitee1Type"
                              name="plannedInvitee1Type"
                              value={form.plannedInvitee1Type}
                              onChange={(event) =>
                                updateField(
                                  'plannedInvitee1Type',
                                  event.target.value,
                                )
                              }
                              aria-invalid={Boolean(
                                errors.plannedInvitee1Type,
                              )}
                            >
                              <option value="">Select type</option>
                              {inviteeTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.plannedInvitee1Type && (
                              <p className={styles.fieldError}>
                                {errors.plannedInvitee1Type}
                              </p>
                            )}
                          </div>
                        </section>

                        <section className={styles.inviteeCard}>
                          <div className={styles.inviteeHeader}>
                            <strong>INVITEE #2</strong>
                            <span>OPTIONAL</span>
                          </div>
                          <div className={styles.field}>
                            <label htmlFor="plannedInvitee2Handle">
                              INVITEE #2 X HANDLE
                            </label>
                            <input
                              id="plannedInvitee2Handle"
                              name="plannedInvitee2Handle"
                              value={form.plannedInvitee2Handle}
                              onChange={(event) =>
                                updateField(
                                  'plannedInvitee2Handle',
                                  event.target.value,
                                )
                              }
                              placeholder="@handle"
                              autoComplete="off"
                              aria-invalid={Boolean(
                                errors.plannedInvitee2Handle,
                              )}
                            />
                            {errors.plannedInvitee2Handle && (
                              <p className={styles.fieldError}>
                                {errors.plannedInvitee2Handle}
                              </p>
                            )}
                          </div>
                          <div className={styles.field}>
                            <label htmlFor="plannedInvitee2Type">
                              INVITEE #2 TYPE
                            </label>
                            <select
                              id="plannedInvitee2Type"
                              name="plannedInvitee2Type"
                              value={form.plannedInvitee2Type}
                              onChange={(event) =>
                                updateField(
                                  'plannedInvitee2Type',
                                  event.target.value,
                                )
                              }
                              aria-invalid={Boolean(
                                errors.plannedInvitee2Type,
                              )}
                            >
                              <option value="">Select type</option>
                              {inviteeTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.plannedInvitee2Type && (
                              <p className={styles.fieldError}>
                                {errors.plannedInvitee2Type}
                              </p>
                            )}
                          </div>
                        </section>
                      </div>

                      <p className={styles.networkPrivacy}>
                        Only submit public X handles. A nomination does not
                        automatically notify or enroll the nominated party.
                      </p>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className={styles.field}>
                        <label htmlFor="experience">
                          TELL US ABOUT YOUR EXPERIENCE WITH CANTON OR TRADING
                        </label>
                        <p className={styles.fieldHelp}>
                          Share your understanding of the Canton ecosystem, a
                          project or trend you are interested in, or your
                          experience trading spot or perpetual markets.
                        </p>
                        <textarea
                          id="experience"
                          name="experience"
                          value={form.experience}
                          onChange={(event) =>
                            updateField('experience', event.target.value)
                          }
                          placeholder="There is no right answer—we simply want to learn more about you."
                          rows={8}
                          maxLength={1200}
                          aria-invalid={Boolean(errors.experience)}
                        />
                        <div className={styles.fieldMeta}>
                          {errors.experience ? (
                            <p className={styles.fieldError}>
                              {errors.experience}
                            </p>
                          ) : (
                            <span>REQUIRED</span>
                          )}
                          <span>{form.experience.length} / 1200</span>
                        </div>
                      </div>

                      <label className={styles.consent}>
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(event) =>
                            updateField('consent', event.target.checked)
                          }
                        />
                        <span>
                          I agree that Rocky may use this information to review
                          my early-access application and contact me about its
                          status.
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
                        setStep((current) => Math.max(current - 1, 0));
                      }}
                    >
                      ← BACK
                    </button>
                  ) : (
                    <Link href="/" className={styles.secondaryAction}>
                      ← EXIT
                    </Link>
                  )}
                  <button
                    type="submit"
                    className={styles.primaryAction}
                    disabled={submitting}
                  >
                    {step === steps.length - 1
                      ? submitting
                        ? 'RECORDING...'
                        : 'SUBMIT APPLICATION'
                      : 'CONTINUE'}
                    {!submitting && <span aria-hidden="true">→</span>}
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
