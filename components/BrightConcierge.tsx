'use client';

import { useState } from 'react';
import B from './B';
import { useLang } from './LangProvider';
import { conciergeChat } from '@/lib/store';

type Msg = { role: 'assistant' | 'user'; text: string; options?: string[] };

const QUICK_PICKS: { zh: string; en: string }[] = [
  { zh: '黑客松', en: 'Hackathon' },
  { zh: '工作坊', en: 'Workshop' },
  { zh: '圆桌论坛', en: 'Panel' },
  { zh: '主题演讲 / 新品发布', en: 'Keynote / launch' },
  { zh: '私享晚宴', en: 'Private dinner' },
  { zh: '观赛派对 / 社交', en: 'Watch party / social' },
];

/** Floating "event concierge" widget from the Bright Landing design.

    Talks to POST /api/concierge/chat on the app API, which proxies to an
    internal AI microservice — see agent/README.md. That's a deliberate extra
    hop: the OpenAI key lives only in that internal service's environment,
    never in this browser bundle and never in the app API either.

    The backend call can fail for perfectly ordinary reasons — the concierge
    microservice isn't deployed yet, it's rate-limited, the network drops —
    and none of those should look like a broken page. Every failure path
    falls back to the same deflection copy the original design used for its
    own catch block: point the visitor at email or the form above. */
export default function BrightConcierge() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const fallback = () =>
    zh
      ? '抱歉，我这边暂时连不上。可以直接发邮件到 team@2percenttech.com，或用页面顶部的表单提交。'
      : "Sorry, I can't connect right now. Email team@2percenttech.com or use the form at the top of the page instead.";

  function toggle() {
    const opening = !open;
    setOpen(opening);
    if (opening && !msgs.length) {
      setMsgs([
        {
          role: 'assistant',
          text: zh
            ? '你好！我是 2%Tech 的活动助手。你想在硅谷办什么活动？'
            : "Hi! I'm the 2%Tech event concierge. What would you like to host in Silicon Valley?",
          options: QUICK_PICKS.map((o) => (zh ? o.zh : o.en)),
        },
      ]);
    }
  }

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;

    const next: Msg[] = [...msgs, { role: 'user', text: t }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    try {
      const reply = await conciergeChat(
        lang,
        next.map((m) => ({ role: m.role, content: m.text })),
      );
      setMsgs((m) => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: fallback() }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="concierge">
      {open && (
        <div className="concierge-panel">
          <div className="concierge-head">
            <img src="/mark.svg" alt="2%Tech" style={{ height: 32, width: 32, borderRadius: 7 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5, letterSpacing: '-.01em' }}>
                <B zh="2%Tech 活动助手" en="2%Tech event concierge" />
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent-ink)' }}>
                <B zh="告诉我们你想办什么" en="Tell us what you want to host" />
              </p>
            </div>
            <button type="button" className="concierge-close" aria-label={zh ? '关闭对话' : 'Close chat'} onClick={toggle}>
              ✕
            </button>
          </div>

          <div className="concierge-body">
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`concierge-bubble${m.role === 'user' ? ' user' : ''}`}>{m.text}</div>
                {m.options && i === msgs.length - 1 && !busy && (
                  <div className="concierge-opts">
                    {m.options.map((o) => (
                      <button key={o} type="button" className="concierge-opt" onClick={() => send(o)}>
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div className="concierge-bubble" aria-live="polite">
                  …
                </div>
              </div>
            )}
          </div>

          <div className="concierge-input-row">
            <input
              className="concierge-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input);
              }}
              placeholder={zh ? '输入你的回答…' : 'Type your answer…'}
              aria-label={zh ? '消息' : 'Message'}
              disabled={busy}
            />
            <button type="button" className="concierge-send" aria-label={zh ? '发送' : 'Send'} onClick={() => send(input)} disabled={busy}>
              →
            </button>
          </div>
        </div>
      )}

      <button type="button" className="concierge-fab" onClick={toggle} aria-label={open ? (zh ? '关闭对话' : 'Close chat') : zh ? '打开对话' : 'Open chat'}>
        <span aria-hidden="true" style={{ fontSize: 17 }}>
          {open ? '↓' : '✦'}
        </span>
        <B zh="聊聊你的活动" en="Plan my event" />
      </button>
    </div>
  );
}
