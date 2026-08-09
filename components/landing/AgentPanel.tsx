'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSiteChrome } from '@/components/landing/SiteChrome';
import { AGENT_GREETING, AGENT_REPLY } from '@/lib/landing-data';

type Message = { who: '2%' | 'YOU'; text: string };

const GREETING: Message[] = AGENT_GREETING.map((text) => ({ who: '2%', text }));

export default function AgentPanel() {
  const { agentOpen, closeAgent } = useSiteChrome();
  const [chat, setChat] = useState<Message[]>(GREETING);
  const [draft, setDraft] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (agentOpen) inputRef.current?.focus();
  }, [agentOpen]);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [chat]);

  // A pending reply must not fire into an unmounted panel.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!agentOpen) return null;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setChat((prev) => [...prev, { who: 'YOU', text }]);
    setDraft('');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setChat((prev) => [...prev, { who: '2%', text: AGENT_REPLY }]);
    }, 700);
  }

  return (
    <div
      className="agent-panel"
      role="dialog"
      aria-label="2% Tech Agent"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeAgent();
        }
      }}
    >
      <div className="agent-panel__head">
        <span className="agent-panel__avatar" aria-hidden="true">
          2%
        </span>
        <strong>2% Tech Agent</strong>
        <button type="button" className="agent-panel__close" onClick={closeAgent}>
          <span aria-hidden="true">✕</span>
          <span className="sr-only">Close agent</span>
        </button>
      </div>

      <div className="agent-panel__log" role="log" aria-live="polite" ref={logRef}>
        {chat.map((m, i) => (
          <div
            className={`chat-row${m.who === 'YOU' ? ' chat-row--you' : ''}`}
            key={`${m.who}-${i}`}
          >
            <span className="chat-row__who">{m.who}</span>
            <p className="chat-row__text">{m.text}</p>
          </div>
        ))}
      </div>

      <form className="agent-panel__composer" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="agent-input">
          Message the 2% Tech Agent
        </label>
        <input
          className="field"
          id="agent-input"
          placeholder="Tell me what you want to accomplish…"
          autoComplete="off"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          ref={inputRef}
        />
        <button type="submit" className="btn btn--yellow">
          Send
        </button>
      </form>
    </div>
  );
}
