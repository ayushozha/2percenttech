'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTACT, LOGOS, LUMA_PROFILE } from '@/lib/data';
import { createHostRequest } from '@/lib/store';
import {
  AGENT_OPENERS,
  AGENT_REPLY,
  ASIDE_ACTIONS,
  ASIDE_KEYWORDS,
  DISTRIBUTION_COPY,
  FOOTER_BLURB,
  FOOTER_COLUMNS,
  FORMATS,
  GLOBAL_COPY,
  JOIN_CARDS,
  MARQUEE_IDS,
  NAV_LINKS,
  REGIONS,
  TAKEAWAYS,
  UPCOMING_CARDS,
} from '@/lib/v4-content';

/* The v4 landing page.

   Ported from the Claude Design project "2pct Landing v4.dc.html". Deliberate
   differences from the prototype, all for the same reason the rest of the site
   already differs from its own prototypes (see README, "Design notes"):

   - No DCLogic. `support.js` and the `x-dc` runtime are replaced with ordinary
     React state — one `fmt`, one `modal`, one `agent`, same as the original.
   - Fonts are self-hosted through next/font rather than linked from Google.
   - The intake form posts to the API. The prototype wrote to localStorage
     under `2pct-host-requests`, a key this repo abandoned when the database
     landed; a request that only ever reached the sender's own browser is the
     one failure mode this form must not have.
   - The contact address is CONTACT.email, not the personal gmail the
     prototype carried.
   - Marquee art comes from the repo's own logo pipeline. */

const INK = '#111';
const PAPER = '#fffdf4';
const POP = '#ffd400';

const mono = 'var(--font-space-mono), ui-monospace, monospace';
const display = 'var(--font-anton), ui-sans-serif, sans-serif';

const wrap: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 24px' };
const band: React.CSSProperties = { borderBottom: `3px solid ${INK}` };

const kicker: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.22em',
  margin: 0,
};

const h2: React.CSSProperties = {
  fontFamily: display,
  fontWeight: 400,
  textTransform: 'uppercase',
  lineHeight: 1,
  margin: 0,
};

/** Offset-shadow block, the page's one structural motif. */
const block = (shadow = INK, size = 8): React.CSSProperties => ({
  border: `3px solid ${INK}`,
  boxShadow: `${size}px ${size}px 0 ${shadow}`,
});

const tag = (hot?: boolean): React.CSSProperties => ({
  border: `2px solid ${INK}`,
  padding: '3px 10px',
  fontFamily: mono,
  fontSize: 11,
  fontWeight: 700,
  background: hot ? POP : 'transparent',
});

type ChatMsg = { who: '2%' | 'YOU'; text: string };

export default function LandingV4() {
  const [fmt, setFmt] = useState(0);

  const [modal, setModal] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [agentOpen, setAgentOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [chat, setChat] = useState<ChatMsg[]>(AGENT_OPENERS.map((text) => ({ who: '2%', text })));

  const opener = useRef<HTMLElement | null>(null);
  const chatEnd = useRef<HTMLDivElement | null>(null);

  const open = useCallback((title: string, from?: HTMLElement) => {
    opener.current = from ?? null;
    setModal(title);
    setSubmitted(false);
    setError('');
    setAgentOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setSubmitted(false);
    setError('');
    opener.current?.focus();
    opener.current = null;
  }, []);

  /* Escape closes whichever layer is on top, and the modal locks the page
     behind it. The prototype did neither — it never had to survive a keyboard. */
  useEffect(() => {
    if (!modal && !agentOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (modal) closeModal();
      else setAgentOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal, agentOpen, closeModal]);

  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modal]);

  useEffect(() => {
    if (agentOpen) chatEnd.current?.scrollIntoView({ block: 'end' });
  }, [chat, agentOpen]);

  async function submit() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError('Please enter a valid email.');
    if (!name.trim()) return setError('Please enter your name.');

    setBusy(true);
    try {
      /* Every intake context funnels into the one leads inbox the dashboard
         already reads. The context rides in the message because `Lead` has no
         field for it and inventing one would mean a migration for a label. */
      await createHostRequest({
        email: email.trim(),
        picks: [FORMATS[fmt].id],
        contact: name.trim(),
        company: org.trim(),
        message: [`[${modal}]`, msg.trim()].filter(Boolean).join(' '),
      });
      setSubmitted(true);
      setError('');
    } catch {
      setError("That didn't go through. Please try again, or email us directly.");
    } finally {
      setBusy(false);
    }
  }

  function send() {
    const t = draft.trim();
    if (!t) return;
    setChat((c) => [...c, { who: 'YOU', text: t }]);
    setDraft('');
    window.setTimeout(() => setChat((c) => [...c, { who: '2%', text: AGENT_REPLY }]), 700);
  }

  const openAgent = () => {
    setAgentOpen(true);
    setModal(null);
  };

  return (
    <div className="v4">
      {/* ---- header ---- */}
      <header style={{ ...band, position: 'sticky', top: 0, zIndex: 60, background: PAPER }}>
        <div style={{ ...wrap, height: 70, display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                ...block(INK, 4),
                display: 'inline-block',
                background: POP,
                padding: '4px 10px',
                fontFamily: display,
                fontSize: 19,
                letterSpacing: '.02em',
              }}
            >
              2%TECH
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="v4-nav-links"
            style={{ display: 'flex', gap: 22, fontWeight: 700, fontSize: 14, marginLeft: 8 }}
          >
            {NAV_LINKS.map((l) => (
              <a key={l.href + l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              type="button"
              onClick={openAgent}
              style={{
                background: 'none',
                border: 'none',
                font: `700 14px ${'var(--font-grotesk)'}`,
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationThickness: 3,
                textDecorationColor: POP,
                padding: '8px 4px',
              }}
            >
              Talk to Agent
            </button>
            <button
              type="button"
              className="v4-press"
              onClick={(e) => open('Host an Event', e.currentTarget)}
              style={{
                ...block(POP, 4),
                background: INK,
                color: '#fff',
                font: `700 14px ${'var(--font-grotesk)'}`,
                padding: '10px 18px',
                cursor: 'pointer',
              }}
            >
              Start an Event
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ---- hero ---- */}
        <section id="host" style={{ ...band, position: 'relative', overflow: 'hidden' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(17,17,17,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,.07) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'linear-gradient(#000 55%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(#000 55%, transparent 100%)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -180,
              right: -120,
              width: 560,
              height: 560,
              background: 'radial-gradient(circle, rgba(255,212,0,.55), transparent 65%)',
              filter: 'blur(10px)',
            }}
          />

          <div style={{ ...wrap, position: 'relative', padding: '72px 24px 64px' }}>
            <div
              style={{
                ...block(INK, 4),
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: mono,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.18em',
                border: `2px solid ${INK}`,
                background: '#fff',
                padding: '8px 14px',
              }}
            >
              <span style={{ width: 10, height: 10, background: POP, border: `2px solid ${INK}`, display: 'inline-block' }} />
              THE OPERATING PLATFORM FOR THE AI ECOSYSTEM
            </div>

            <h1
              style={{
                ...h2,
                fontSize: 'clamp(46px, 8.2vw, 118px)',
                lineHeight: 0.96,
                letterSpacing: '.005em',
                margin: '26px 0 0',
                maxWidth: 1050,
              }}
            >
              Host an event in{' '}
              <span style={{ background: POP, boxShadow: `8px 8px 0 ${INK}`, padding: '0 14px', display: 'inline-block' }}>
                Silicon Valley
              </span>
            </h1>

            <p style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.5, maxWidth: 620, margin: '26px 0 0', textWrap: 'pretty' }}>
              Where AI companies, builders, investors, experts, and communities connect through high-impact events.
            </p>

            {/* The format picker doubles as the page's primary navigation: the
                thing you came to compare is the thing you click. */}
            <div
              className="v4-hero-formats"
              role="radiogroup"
              aria-label="Choose an event format"
              style={{
                ...block(INK, 10),
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0,1fr))',
                background: INK,
                gap: 3,
                marginTop: 38,
              }}
            >
              {FORMATS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={fmt === i}
                  onClick={() => setFmt(i)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    textAlign: 'left',
                    padding: '22px 16px 16px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: fmt === i ? POP : '#fff',
                    minHeight: 230,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>
                    {f.glyph}
                  </span>
                  <strong style={{ ...h2, fontSize: 24, letterSpacing: '.01em' }}>{f.name}</strong>
                  <small style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.45, color: '#333' }}>{f.blurb}</small>
                  <span
                    style={{
                      marginTop: 'auto',
                      borderTop: `2px solid ${INK}`,
                      paddingTop: 10,
                      fontFamily: mono,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '.06em',
                    }}
                  >
                    {f.cta} ↗
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginTop: 34 }}>
              <button
                type="button"
                className="v4-press"
                onClick={(e) => open(`Host a ${FORMATS[fmt].name}`, e.currentTarget)}
                style={{ ...block(INK, 8), background: POP, font: `700 17px var(--font-grotesk)`, padding: '16px 28px', cursor: 'pointer' }}
              >
                Start your {FORMATS[fmt].name} ↗
              </button>

              <button
                type="button"
                className="v4-press"
                onClick={openAgent}
                style={{
                  ...block(INK, 8),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#fff',
                  padding: '10px 18px 10px 10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', background: INK, color: POP, fontFamily: display, fontSize: 15 }}>
                  2%
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: 14 }}>Talk to the 2% Tech Agent</strong>
                  <span style={{ fontFamily: mono, fontSize: 11, color: '#444' }}>Not sure which format? Ask.</span>
                </span>
              </button>

              <p style={{ ...kicker, fontSize: 12, letterSpacing: '.14em' }}>BUILT IN SILICON VALLEY. DISTRIBUTED GLOBALLY.</p>
            </div>
          </div>
        </section>

        {/* ---- marquee ---- */}
        <section style={{ ...band, background: INK, color: PAPER, padding: '18px 0', overflow: 'hidden' }}>
          <div style={{ ...wrap, margin: '0 auto 12px' }}>
            <p style={{ ...kicker, fontSize: 11, color: POP }}>RECENT COLLABORATORS &amp; SPEAKERS</p>
          </div>
          <div aria-label="Selected partner and ecosystem logos" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div className="v4-marquee-track">
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 76, paddingRight: 76 }}
                >
                  {MARQUEE_IDS.map((id) => {
                    const logo = LOGOS[id];
                    if (!logo?.mq) return null;
                    return <img key={id} src={logo.mq} alt={copy === 0 ? id : ''} style={{ height: 27 }} />;
                  })}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---- join the network ---- */}
        <section id="network" style={band}>
          <div style={{ ...wrap, padding: '76px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
              <div>
                <p style={{ ...kicker, marginBottom: 10 }}>JOIN THE GLOBAL BUILDER NETWORK</p>
                <h2 style={{ ...h2, fontSize: 'clamp(34px,4.6vw,62px)' }}>Choose how to join.</h2>
              </div>
              <p style={{ fontSize: 16, fontWeight: 500, maxWidth: 360, margin: 0, textWrap: 'pretty' }}>
                Speaker, judge, investor, sponsor, technology partner, or community partner.
              </p>
            </div>

            <div
              className="v4-join-grid"
              style={{ ...block(INK, 10), display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 3, background: INK }}
            >
              {JOIN_CARDS.map((c) => (
                <button
                  key={c.n}
                  type="button"
                  className="v4-join-card"
                  onClick={(e) => open(c.title, e.currentTarget)}
                  style={{
                    background: c.feature ? POP : '#fff',
                    border: 'none',
                    textAlign: 'left',
                    padding: '26px 22px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    minHeight: 200,
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700 }}>{c.n}</span>
                  <h3 style={{ ...h2, fontSize: 26 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#333', margin: 0, lineHeight: 1.5 }}>{c.blurb}</p>
                  <span style={{ marginTop: 'auto', fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: '.06em' }}>
                    {c.cta} ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---- upcoming ---- */}
        <section id="upcoming" style={{ ...band, background: '#fff' }}>
          <div style={{ ...wrap, padding: '76px 24px' }}>
            <div style={{ marginBottom: 36 }}>
              <p style={{ ...kicker, marginBottom: 10 }}>UPCOMING EVENTS</p>
              <h2 style={{ ...h2, fontSize: 'clamp(30px,4vw,54px)', lineHeight: 1.02, maxWidth: 760 }}>
                Join the next event or partner with one already in motion.
              </h2>
            </div>

            <div className="v4-upcoming-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 28, alignItems: 'start' }}>
              <div aria-label="Upcoming events list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {UPCOMING_CARDS.map((e) => (
                  <article key={e.title} style={{ ...block(INK, 8), background: PAPER, padding: '22px 24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        flexWrap: 'wrap',
                        fontFamily: mono,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '.08em',
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ background: e.live ? POP : 'transparent', border: `2px solid ${INK}`, padding: '2px 8px' }}>{e.badge}</span>
                      <span>{e.kicker}</span>
                    </div>

                    <h3 style={{ ...h2, fontSize: 27, lineHeight: 1.05, margin: '0 0 8px' }}>{e.title}</h3>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#333', lineHeight: 1.5, margin: '0 0 12px' }}>{e.blurb}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: e.url ? 14 : 0 }}>
                      {e.tags.map((t) => (
                        <span key={t.label} style={tag(t.hot)}>
                          {t.label}
                        </span>
                      ))}
                    </div>

                    {e.url && (
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ ...block(POP, 4), background: INK, color: '#fff', font: '700 13px var(--font-grotesk)', padding: '9px 16px', display: 'inline-block' }}
                        >
                          View Event ↗
                        </a>
                        {e.partnerCta && (
                          <button
                            type="button"
                            onClick={(ev) => open(`Partner with ${e.title}`, ev.currentTarget)}
                            style={{
                              background: 'none',
                              border: 'none',
                              font: '700 13px var(--font-grotesk)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              textDecorationThickness: 3,
                              textDecorationColor: POP,
                              padding: '6px 2px',
                            }}
                          >
                            {e.partnerCta}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <aside style={{ ...block(INK, 10), position: 'sticky', top: 96, background: POP, padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={kicker}>JOIN OR PARTNER</p>
                <h3 style={{ ...h2, fontSize: 30 }}>Want to join the next event?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                  {ASIDE_ACTIONS.map((a, i) => (
                    <button
                      key={a}
                      type="button"
                      onClick={(e) => open(a, e.currentTarget)}
                      style={{
                        background: i === 0 ? INK : PAPER,
                        color: i === 0 ? '#fff' : INK,
                        border: `3px solid ${INK}`,
                        boxShadow: i === 0 ? '4px 4px 0 #fff' : undefined,
                        font: '700 14px var(--font-grotesk)',
                        padding: '12px 16px',
                        cursor: 'pointer',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 12, fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>
                  <strong style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.06em' }}>SUGGESTED EVENT KEYWORDS:</strong>{' '}
                  <span>{ASIDE_KEYWORDS}</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ---- global scale ---- */}
        <section id="global" style={{ ...band, background: INK, color: PAPER }}>
          <div className="v4-global-grid" style={{ ...wrap, padding: '80px 24px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 48, alignItems: 'center' }}>
            <div>
              <p style={{ ...kicker, color: POP, marginBottom: 12 }}>BUILT IN SILICON VALLEY. DISTRIBUTED GLOBALLY.</p>
              <h2 style={{ ...h2, fontSize: 'clamp(36px,5vw,70px)', lineHeight: 0.98, marginBottom: 18 }}>
                Scale beyond <span style={{ color: POP }}>the room.</span>
              </h2>
              <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, color: '#d8d5c8', maxWidth: 520, margin: '0 0 26px', textWrap: 'pretty' }}>
                {GLOBAL_COPY}
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="v4-press"
                  onClick={(e) => open('Become a Global Community Partner', e.currentTarget)}
                  style={{ background: POP, border: `3px solid ${POP}`, boxShadow: `6px 6px 0 ${PAPER}`, font: '700 15px var(--font-grotesk)', padding: '14px 22px', cursor: 'pointer' }}
                >
                  Become a Global Partner ↗
                </button>
                <button
                  type="button"
                  onClick={(e) => open('Host a Satellite Event', e.currentTarget)}
                  style={{ background: 'none', color: PAPER, border: `3px solid ${PAPER}`, font: '700 15px var(--font-grotesk)', padding: '14px 22px', cursor: 'pointer' }}
                >
                  Host a Satellite Event
                </button>
              </div>
            </div>

            <div aria-hidden="true" style={{ position: 'relative', aspectRatio: '1', maxWidth: 480, justifySelf: 'center', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '6%', border: '2px dashed #444', borderRadius: '50%' }} />
              <div className="v4-ring-spin" style={{ position: 'absolute', inset: '20%', border: '2px dashed #666', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: '34%', border: `2px solid ${POP}`, borderRadius: '50%' }} />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  background: POP,
                  color: INK,
                  border: `3px solid ${INK}`,
                  boxShadow: `6px 6px 0 ${PAPER}`,
                  padding: '14px 18px',
                  textAlign: 'center',
                  zIndex: 2,
                }}
              >
                <strong style={{ fontFamily: display, fontSize: 30, display: 'block', lineHeight: 1 }}>2%</strong>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '.14em' }}>SILICON VALLEY</span>
              </div>

              {REGIONS.map((r) => (
                <span
                  key={r.label}
                  style={{
                    position: 'absolute',
                    top: r.top,
                    left: r.left,
                    right: r.right,
                    bottom: r.bottom,
                    background: r.accent ? POP : INK,
                    color: r.accent ? INK : PAPER,
                    border: `2px solid ${r.accent ? INK : PAPER}`,
                    padding: '4px 10px',
                    fontFamily: mono,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---- distribution ---- */}
        <section id="distribution" style={band}>
          <div style={{ ...wrap, padding: '76px 24px' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ ...kicker, marginBottom: 10 }}>LIVESTREAM, CLIPS AND SEARCHABLE CONTENT</p>
              <h2 style={{ ...h2, fontSize: 'clamp(30px,4.4vw,58px)', maxWidth: 820 }}>
                Every event should keep working after it ends.
              </h2>
            </div>
            <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, color: '#333', maxWidth: 680, margin: '0 0 36px', textWrap: 'pretty' }}>
              {DISTRIBUTION_COPY}
            </p>

            <div className="v4-dist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 20 }}>
              <article style={{ ...block(INK, 8), background: POP, padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 220 }}>
                <strong style={{ fontFamily: display, fontSize: 64, lineHeight: 1, display: 'block' }}>100%</strong>
                <span style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>livestream-first event approach</span>
              </article>

              <article style={{ ...block(INK, 8), background: '#fff', padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 220 }}>
                <strong style={{ fontFamily: display, fontSize: 64, lineHeight: 1, display: 'block' }}>150K+</strong>
                <span style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>reachable founder, builder and ecosystem network</span>
              </article>

              <article style={{ ...block(INK, 8), background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', borderBottom: `3px solid ${INK}`, aspectRatio: '16/10', overflow: 'hidden' }}>
                  {/* The repo's own photo 02, already emitted as webp by
                      prepare-assets — the prototype pointed at the jpg. */}
                  <img
                    src="/photos/02.webp"
                    alt="Live broadcast at a 2% Tech event"
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)' }}
                  />
                  <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 52, height: 52, display: 'grid', placeItems: 'center', background: POP, border: `3px solid ${INK}`, fontSize: 18 }}>
                    ▶
                  </span>
                  <span style={{ position: 'absolute', left: 10, bottom: 10, background: INK, color: POP, fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '.14em', padding: '3px 8px' }}>
                    FULL LIVESTREAM
                  </span>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ ...h2, fontSize: 22, margin: '0 0 6px' }}>Live Broadcast</h3>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#333', lineHeight: 1.5, margin: 0 }}>
                    Multi-channel livestreaming expands beyond the venue and creates durable assets.
                  </p>
                </div>
              </article>

              <article style={{ ...block(INK, 8), background: '#fff', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Short Clips', 'Recap', 'Takeaways'].map((t) => (
                    <span key={t} style={{ background: '#fff2a8', border: `2px solid ${INK}`, padding: '5px 12px', fontFamily: mono, fontSize: 11, fontWeight: 700 }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h3 style={{ ...h2, fontSize: 22, margin: '6px 0 0' }}>Post-Event Content</h3>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#333', lineHeight: 1.5, margin: 0 }}>
                  Short clips, plain-language summaries and transcripts make the event reusable and searchable.
                </p>
              </article>

              <article
                className="v4-takeaway-head"
                style={{ ...block(INK, 8), gridColumn: '1 / -1', background: PAPER, padding: '26px 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}
              >
                <h3 style={{ ...h2, fontSize: 28, lineHeight: 1.05 }}>Latest Event Takeaways</h3>
                <ol className="v4-takeaways" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '14px 28px' }}>
                  {TAKEAWAYS.map((t, i) => (
                    <li key={t} style={{ display: 'flex', gap: 12, fontSize: 14, fontWeight: 500, lineHeight: 1.5, border: `2px solid ${INK}`, background: '#fff', padding: '12px 14px' }}>
                      <span style={{ fontFamily: display, fontSize: 20, background: POP, border: `2px solid ${INK}`, width: 32, height: 32, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </div>
        </section>

        {/* ---- agent band ---- */}
        <section style={{ ...band, background: '#fff' }}>
          <div style={{ ...wrap, padding: '64px 24px' }}>
            <div style={{ ...block(INK, 10), background: POP, padding: '34px 30px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              <span style={{ width: 76, height: 76, display: 'grid', placeItems: 'center', background: INK, color: POP, fontFamily: display, fontSize: 30, flexShrink: 0 }}>
                2%
              </span>
              <div style={{ flex: 1, minWidth: 260 }}>
                <p style={{ ...kicker, marginBottom: 6 }}>2% TECH AGENT</p>
                <h2 style={{ ...h2, fontSize: 'clamp(24px,3vw,40px)', lineHeight: 1.02, marginBottom: 8 }}>
                  Need help choosing the right format?
                </h2>
                <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.55, margin: 0, maxWidth: 640 }}>
                  The agent guides event creation, answers application questions, and routes high-value requests to a human when needed.
                </p>
              </div>
              <button
                type="button"
                className="v4-press"
                onClick={openAgent}
                style={{ background: INK, color: '#fff', border: `3px solid ${INK}`, boxShadow: `5px 5px 0 ${PAPER}`, font: '700 16px var(--font-grotesk)', padding: '16px 26px', cursor: 'pointer' }}
              >
                Start a Conversation ↗
              </button>
            </div>
          </div>
        </section>

        {/* ---- final CTA ---- */}
        <section style={band}>
          <div style={{ ...wrap, padding: '88px 24px', textAlign: 'center' }}>
            <p style={{ ...kicker, marginBottom: 14 }}>READY TO BUILD WITHIN THE SILICON VALLEY AI ECOSYSTEM?</p>
            <h2 style={{ ...h2, fontSize: 'clamp(32px,5vw,72px)', margin: '0 auto 30px', maxWidth: 960 }}>
              Bring your company, event or community into a{' '}
              <span style={{ background: POP, boxShadow: `6px 6px 0 ${INK}`, padding: '0 12px', display: 'inline-block' }}>higher-signal</span> network.
            </h2>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="v4-press"
                onClick={(e) => open('Host an Event', e.currentTarget)}
                style={{ ...block(POP, 6), background: INK, color: '#fff', font: '700 16px var(--font-grotesk)', padding: '16px 28px', cursor: 'pointer' }}
              >
                Host an Event ↗
              </button>
              <button
                type="button"
                className="v4-press"
                onClick={(e) => open('Become a Community Partner', e.currentTarget)}
                style={{ ...block(INK, 6), background: PAPER, font: '700 16px var(--font-grotesk)', padding: '16px 28px', cursor: 'pointer' }}
              >
                Become a Community Partner
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ---- footer ---- */}
      <footer style={{ background: INK, color: PAPER }}>
        <div style={{ ...wrap, padding: '56px 24px 30px' }}>
          {/* The prototype set a wordmark PNG here. Anton is the wordmark's own
              face, so it is set as live text: sharper, responsive, and one
              fewer 200 KB raster on the heaviest page of the site. */}
          <div style={{ border: `3px solid ${POP}`, background: '#000', marginBottom: 44, padding: '18px 24px', textAlign: 'center', overflow: 'hidden' }}>
            <span style={{ fontFamily: display, fontSize: 'clamp(52px,16vw,190px)', lineHeight: 0.9, letterSpacing: '.01em', color: PAPER, display: 'block' }}>
              2%TECH
            </span>
          </div>

          <div className="v4-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 36 }}>
            <div>
              <strong style={{ fontFamily: display, fontSize: 22, letterSpacing: '.02em' }}>2% TECH</strong>
              <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, color: '#c9c6ba', margin: '10px 0 0', maxWidth: 340 }}>{FOOTER_BLURB}</p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <strong style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.18em', color: POP }}>{col.heading}</strong>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} style={{ color: PAPER, fontSize: 14, fontWeight: 500 }}>
                    {l.label}
                  </a>
                ))}
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <strong style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.18em', color: POP }}>CONTACT</strong>
              <a href={`mailto:${CONTACT.email}`} style={{ color: PAPER, fontSize: 14, fontWeight: 500 }}>
                {CONTACT.email}
              </a>
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer" style={{ color: PAPER, fontSize: 14, fontWeight: 500 }}>
                Luma ↗
              </a>
              <Link href="/sponsor" style={{ color: PAPER, fontSize: 14, fontWeight: 500 }}>
                Sponsor a hackathon
              </Link>
              <span style={{ fontSize: 13, color: '#c9c6ba' }}>San Francisco Bay Area</span>
            </div>
          </div>

          <div
            style={{
              borderTop: '2px solid #333',
              marginTop: 40,
              paddingTop: 18,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              fontFamily: mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.1em',
              color: '#8b887c',
            }}
          >
            <span>© 2026 2% TECH</span>
            <span>BUILT IN SILICON VALLEY. DISTRIBUTED GLOBALLY.</span>
          </div>
        </div>
      </footer>

      {/* ---- floating agent launcher ---- */}
      {!agentOpen && !modal && (
        <button
          type="button"
          className="v4-press"
          onClick={openAgent}
          style={{ ...block(INK, 6), position: 'fixed', right: 22, bottom: 22, zIndex: 70, display: 'flex', alignItems: 'center', gap: 10, background: POP, padding: '10px 16px 10px 10px', cursor: 'pointer' }}
        >
          <span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: INK, color: POP, fontFamily: display, fontSize: 14 }}>2%</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Talk to the 2% Tech Agent</span>
        </button>
      )}

      {/* ---- intake modal ---- */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modal}
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(17,17,17,.62)', display: 'grid', placeItems: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(560px, 100%)', background: PAPER, border: `3px solid ${INK}`, boxShadow: `12px 12px 0 ${POP}`, padding: '30px 28px', maxHeight: '88vh', overflow: 'auto' }}
          >
            {!submitted ? (
              <>
                <p style={{ ...kicker, fontSize: 11, marginBottom: 6 }}>2% TECH INTAKE</p>
                <h3 style={{ ...h2, fontSize: 30, lineHeight: 1.02, margin: '0 0 10px' }}>{modal}</h3>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#333', lineHeight: 1.5, margin: '0 0 20px' }}>
                  Share a few details. The 2% Tech agent will organize your request and prepare the next step.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { v: name, set: setName, ph: 'Your name', type: 'text', ac: 'name' },
                    { v: email, set: setEmail, ph: 'Work email', type: 'email', ac: 'email' },
                    { v: org, set: setOrg, ph: 'Company / community', type: 'text', ac: 'organization' },
                  ].map((f) => (
                    <input
                      key={f.ph}
                      value={f.v}
                      onChange={(e) => {
                        f.set(e.target.value);
                        setError('');
                      }}
                      placeholder={f.ph}
                      aria-label={f.ph}
                      type={f.type}
                      autoComplete={f.ac}
                      style={{ border: `3px solid ${INK}`, background: '#fff', padding: '12px 14px', font: '500 15px var(--font-grotesk)' }}
                    />
                  ))}

                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="What do you want to accomplish?"
                    aria-label="What do you want to accomplish?"
                    rows={4}
                    style={{ border: `3px solid ${INK}`, background: '#fff', padding: '12px 14px', font: '500 15px var(--font-grotesk)', resize: 'vertical' }}
                  />

                  {error && (
                    <p role="alert" style={{ margin: 0, font: '700 13px var(--font-grotesk)', color: '#b3261e' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    className="v4-press"
                    onClick={submit}
                    disabled={busy}
                    style={{ ...block(INK, 6), background: POP, font: '700 16px var(--font-grotesk)', padding: '14px 20px', cursor: busy ? 'progress' : 'pointer', opacity: busy ? 0.7 : 1 }}
                  >
                    {busy ? 'Sending…' : 'Send to the 2% Tech team ↗'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ ...kicker, fontSize: 11, marginBottom: 6 }}>REQUEST RECEIVED</p>
                <h3 style={{ ...h2, fontSize: 30, lineHeight: 1.02, margin: '0 0 10px' }}>You&rsquo;re in the queue.</h3>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#333', lineHeight: 1.55, margin: '0 0 20px' }}>
                  Your request is logged with the 2% Tech team. We reply within two working days.
                </p>
                <button
                  type="button"
                  className="v4-press"
                  onClick={closeModal}
                  style={{ ...block(POP, 6), background: INK, color: '#fff', font: '700 15px var(--font-grotesk)', padding: '12px 20px', cursor: 'pointer' }}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- agent panel ---- */}
      {agentOpen && (
        <div
          role="dialog"
          aria-label="2% Tech Agent"
          style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 95, width: 'min(380px, calc(100vw - 40px))', background: PAPER, border: `3px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, display: 'flex', flexDirection: 'column', maxHeight: 560 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: INK, color: PAPER, padding: '12px 14px' }}>
            <span style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: POP, color: INK, fontFamily: display, fontSize: 13 }}>2%</span>
            <strong style={{ fontSize: 14, flex: 1 }}>2% Tech Agent</strong>
            <button type="button" onClick={() => setAgentOpen(false)} aria-label="Close agent" style={{ background: 'none', border: 'none', color: PAPER, font: '700 18px var(--font-grotesk)', cursor: 'pointer', padding: '2px 6px' }}>
              ✕
            </button>
          </div>

          <div aria-live="polite" style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chat.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, minWidth: 34, height: 24, display: 'grid', placeItems: 'center', background: m.who === '2%' ? INK : POP, color: m.who === '2%' ? POP : INK, border: `2px solid ${INK}`, fontFamily: mono, fontSize: 10, fontWeight: 700, padding: '0 4px' }}>
                  {m.who}
                </span>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, lineHeight: 1.5, background: '#fff', border: `2px solid ${INK}`, padding: '8px 10px', flex: 1 }}>{m.text}</p>
              </div>
            ))}
            <div ref={chatEnd} />
          </div>

          {/* The prototype's canned reply, kept as-is. It is a scripted demo,
              not a model: it says what it would do, then hands to a human. */}
          <div style={{ display: 'flex', gap: 8, borderTop: `3px solid ${INK}`, padding: 10 }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="Tell me what you want to accomplish…"
              aria-label="Message the 2% Tech agent"
              style={{ flex: 1, minWidth: 0, border: `3px solid ${INK}`, background: '#fff', padding: '10px 12px', font: '500 14px var(--font-grotesk)' }}
            />
            <button type="button" onClick={send} style={{ background: POP, border: `3px solid ${INK}`, font: '700 14px var(--font-grotesk)', padding: '10px 16px', cursor: 'pointer' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
