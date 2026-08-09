'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSiteChrome } from '@/components/landing/SiteChrome';
import { ApiError } from '@/lib/api';
import { createHostRequest } from '@/lib/store';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

type Errored = 'name' | 'email' | null;

export default function IntakeModal() {
  const { modal, closeModal, formatName } = useSiteChrome();
  const open = modal !== null;

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [errored, setErrored] = useState<Errored>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  // Where focus came from, so closing returns the reader to their place.
  const restoreRef = useRef<HTMLElement | null>(null);

  // Reset to a clean form each time the modal opens, and remember the trigger.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    setSubmitted(false);
    setError('');
    setErrored(null);
    nameRef.current?.focus();
  }, [open]);

  // Restore focus after the modal unmounts its content.
  useEffect(() => {
    if (open) return;
    const el = restoreRef.current;
    if (el?.isConnected) el.focus();
  }, [open]);

  // Lock background scrolling while the overlay covers the page.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (submitted) doneRef.current?.focus();
  }, [submitted]);

  if (!open) return null;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;

    // Keep Tab inside the dialog for as long as it is open.
    const nodes = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((n) => n.offsetParent !== null);
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const org = String(form.get('org') ?? '').trim();
    const message = String(form.get('msg') ?? '').trim();

    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email.');
      setErrored('email');
      emailRef.current?.focus();
      return;
    }
    if (!name) {
      setError('Please enter your name.');
      setErrored('name');
      nameRef.current?.focus();
      return;
    }

    setError('');
    setErrored(null);
    setSending(true);
    try {
      // The lead schema has no field for which button opened the modal, so the
      // trigger rides along inside the message where the team reads it anyway.
      await createHostRequest({
        email: email.toLowerCase(),
        contact: name,
        company: org,
        picks: [formatName],
        message: message ? `${message}\n\n(via “${modal}”)` : `(via “${modal}”)`,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      return;
    } finally {
      setSending(false);
    }

    setSubmitted(true);
  }

  return (
    <div className="modal" onKeyDown={onKeyDown}>
      <div className="modal__backdrop" onClick={closeModal} />
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
      >
        {!submitted ? (
          <form className="modal__form" onSubmit={onSubmit} noValidate>
            <p className="eyebrow">2% Tech intake</p>
            <h2 className="modal__title" id="modal-title">
              {modal}
            </h2>
            <p className="modal__desc">
              Share a few details. The 2% Tech agent will organize your request and prepare
              the next step.
            </p>

            <div className="field-stack">
              <label className="sr-only" htmlFor="f-name">
                Your name
              </label>
              <input
                className="field"
                id="f-name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={errored === 'name' || undefined}
                ref={nameRef}
              />

              <label className="sr-only" htmlFor="f-email">
                Work email
              </label>
              <input
                className="field"
                id="f-email"
                name="email"
                type="email"
                placeholder="Work email"
                autoComplete="email"
                aria-invalid={errored === 'email' || undefined}
                ref={emailRef}
              />

              <label className="sr-only" htmlFor="f-org">
                Company / community
              </label>
              <input
                className="field"
                id="f-org"
                name="org"
                placeholder="Company / community"
                autoComplete="organization"
              />

              <label className="sr-only" htmlFor="f-msg">
                What do you want to accomplish?
              </label>
              <textarea
                className="field field--area"
                id="f-msg"
                name="msg"
                rows={4}
                placeholder="What do you want to accomplish?"
              />

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn--yellow btn--lg btn--block"
                disabled={sending}
              >
                {sending ? 'Sending…' : 'Send to the 2% Tech team ↗'}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal__done">
            <p className="eyebrow">Request received</p>
            <h2 className="modal__title" id="modal-title">
              You&rsquo;re in the queue.
            </h2>
            <p className="modal__desc">
              Your request is logged with the 2% Tech team. The agent will organize it, ask
              any missing questions, and route it for human follow-up.
            </p>
            <button type="button" className="btn btn--dark" onClick={closeModal} ref={doneRef}>
              Done
            </button>
          </div>
        )}

        <button type="button" className="modal__close" onClick={closeModal}>
          <span aria-hidden="true">✕</span>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}
