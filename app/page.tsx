import B from '@/components/B';
import Stats from '@/components/Stats';
import { COHOSTS, COMPANIES, LOGO_TILES, LUMA_PROFILE, PAST, SEATS, UPCOMING } from '@/lib/data';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Home() {
  return (
    <>
      <main id="top">
        <div className="wrap hero">
          <p className="eyebrow">
            <B zh="湾区 AI 社区 · 黑客松 · WORKSHOP" en="Bay Area AI community · Hackathons · Workshops" />
          </p>
          <div className="poster">
            <h1>
              <span>2%</span>
              <span>Tech</span>
            </h1>
            <div className="sub">
              <B zh="把湾区的 Builder 放进同一个房间" en="We put the Bay Area's builders in one room." />
            </div>
          </div>
          <dl className="metabar">
            <div>
              <dt><B zh="形式" en="Format" /></dt>
              <dd><B zh="黑客松 · Workshop · Demo Day" en="Hackathons · workshops · demo days" /></dd>
            </div>
            <div>
              <dt><B zh="主场" en="Home turf" /></dt>
              <dd>San Francisco Bay Area</dd>
            </div>
            <div>
              <dt><B zh="节奏" en="Cadence" /></dt>
              <dd><B zh="每月多场" en="Several a month" /></dd>
            </div>
            <div>
              <dt><B zh="下一场" en="Next up" /></dt>
              <dd>8/10 · Frontier Signals #01</dd>
            </div>
          </dl>
          <div className="cta-row">
            <a className="btn btn-a" href="/sponsor.built.html">
              <B zh="赞助斯坦福黑客松" en="Sponsor the Stanford hackathon" />
            </a>
            <a className="btn btn-b" href={LUMA_PROFILE} {...ext}>
              <B zh="Luma 主页" en="Follow on Luma" />
            </a>
          </div>
        </div>

        <section className="wrap">
          <span className="label"><B zh="数据" en="The numbers" /></span>
          <h2><B zh="我们一直在办活动" en="We run these constantly" /></h2>
          <p className="statcap"><B zh="自 2025 年 1 月以来" en="Since January 2025" /></p>
          <Stats />
          <p className="muted" style={{ fontSize: '.85rem' }}>
            <B
              zh={<>数据来自我们的公开 Luma 主页（2026 年 8 月导出），欢迎<a href={LUMA_PROFILE} {...ext}>点进去核验</a>。</>}
              en={<>Pulled from our public Luma profile, August 2026 — <a href={LUMA_PROFILE} {...ext}>click through and check</a>.</>}
            />
          </p>
        </section>

        <section className="wrap">
          <span className="label"><B zh="到场记录" en="The room" /></span>
          <h2><B zh="谁来过我们的活动" en="Who shows up" /></h2>
          <p className="lead prose">
            <B zh="往期 2% Tech 活动到场人员所属的公司（每场不同）：" en="Companies whose people have attended past 2% Tech events (varies by event):" />
          </p>

          <div className="lgs">
            {COMPANIES.map((c) => (
              <a key={c.id} className="lg" href={c.url} aria-label={c.name} style={{ background: LOGO_TILES[c.id] ?? '#fff' }} {...ext}>
                <img src={`/logos/${c.id}.webp`} alt={`${c.name} logo`} loading="lazy" />
              </a>
            ))}
          </div>

          <p className="muted fine">
            <B
              zh="以上为往期到场公司名录，不代表其对 2% Tech 或任何单场活动的赞助或背书。"
              en="Historical attendance roster — this does not imply sponsorship or endorsement of 2% Tech or any event."
            />
          </p>

          <p className="cohosts">
            <strong><B zh="共办社区与场地：" en="Co-host communities & venues:" /></strong> {COHOSTS}
          </p>
        </section>

        <section className="wrap">
          <span className="label"><B zh="虚位以待" en="Saved seats" /></span>
          <h2><B zh="我们想请进房间的下一批" en="Who we want in the room next" /></h2>
          <p className="lead prose">
            <B
              zh="斯坦福黑客松的评审席、独立赛道与冠名档，我们正在为下面这些团队留位置。在名单上看到自己？位子是你的。"
              en="Judge chairs, tracks and the title slot at the Stanford hackathon — we're saving seats for the teams below. See your logo? The seat's yours."
            />
          </p>

          <div className="seats">
            {SEATS.map((s, i) => (
              <div key={i} className="seat">
                <span className="hold">
                  <span className="tag"><B zh="预留" en="Reserved" /></span>
                  <span className="nm">{'name' in s ? s.name : <B zh={s.zh} en={s.en} />}</span>
                </span>
              </div>
            ))}
            <div className="seat you">
              <a className="hold" href="/sponsor.built.html">
                <span className="tag"><B zh="这一格是空的" en="This one's open" /></span>
                <span className="nm"><B zh="你的品牌" en="Your logo" /></span>
              </a>
            </div>
          </div>

          <p className="muted fine">
            <B
              zh="这是我们的目标名单，非已确认赞助方。名单上的公司与 2% Tech 尚无合作关系。"
              en="This is our target list, not confirmed sponsors. Companies named here have no existing relationship with 2% Tech."
            />
          </p>
        </section>

        <section className="wrap">
          <span className="label"><B zh="活动" en="Events" /></span>
          <h2><B zh="接下来 & 刚办完" en="Coming up & just wrapped" /></h2>

          <p className="statcap"><B zh="接下来" en="Upcoming" /></p>
          <ul className="tl">
            {UPCOMING.slice(0, 2).map((e) => (
              <li key={e.date}>
                <span className="d">{e.date}</span>
                <span>
                  <a href={e.url} {...ext}>{e.name}</a>
                  {e.note && <> <span className="n"><B zh={e.note.zh} en={e.note.en} /></span></>}
                </span>
              </li>
            ))}
            <li className="next">
              <span className="d">
                <span className="tbd"><B zh="8月底" en="Late Aug" /></span>
              </span>
              <span>
                <strong>Hackathon @ Stanford</strong>{' '}
                <span className="n">
                  <B
                    zh={<>· 赞助洽谈中 → <a href="/sponsor.built.html">赞助方案</a></>}
                    en={<>· sponsorship open → <a href="/sponsor.built.html">prospectus</a></>}
                  />
                </span>
              </span>
            </li>
            {UPCOMING.slice(2).map((e) => (
              <li key={e.date}>
                <span className="d">{e.date}</span>
                <span>
                  <a href={e.url} {...ext}>{e.name}</a>
                  {e.note && <> <span className="n"><B zh={e.note.zh} en={e.note.en} /></span></>}
                </span>
              </li>
            ))}
          </ul>

          <p className="statcap"><B zh="过往精选 · 2026 年（另有标注）" en="Recent highlights · 2026 unless noted" /></p>
          <ul className="tl">
            {PAST.map((e) => (
              <li key={`${e.date}-${e.name}`}>
                <span className="d">{e.date}</span>
                <span>
                  {e.name}{' '}
                  <span className="n">
                    <B zh={`· ${e.registered!.toLocaleString('en-US')} 人报名`} en={`· ${e.registered!.toLocaleString('en-US')} registered`} />
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="muted" style={{ fontSize: '.9rem' }}>
            <B
              zh={<>全部 24 场记录都在 <a href={LUMA_PROFILE} {...ext}>Luma 主页</a>。</>}
              en={<>All 24 events are on our <a href={LUMA_PROFILE} {...ext}>Luma profile</a>.</>}
            />
          </p>
        </section>
      </main>

      <div className="endcta" id="contact">
        <div className="wrap">
          <span className="label"><B zh="下一步" en="Next step" /></span>
          <h2><B zh="下一站斯坦福，冠名席还空着" en="Next stop: Stanford. The title seat is still open." /></h2>
          <p className="lead prose" style={{ opacity: 0.85 }}>
            <B
              zh="单日黑客松，8 月底。方案里有档位、当天流程，和你能拿回去的东西。"
              en="A one-day hackathon in late August. The prospectus covers the tiers, the day's funnel, and what you take home."
            />
          </p>
          <div className="cta-row">
            <a className="btn btn-b" href="/sponsor.built.html">
              <B zh="看赞助方案" en="Read the prospectus" />
            </a>
          </div>
          <dl className="contact">
            <div>
              <dt><B zh="邮箱" en="Email" /></dt>
              <dd className="tbd">sponsors@ —</dd>
            </div>
            <div>
              <dt><B zh="微信" en="WeChat" /></dt>
              <dd className="tbd"><B zh="待补" en="TBC" /></dd>
            </div>
            <div>
              <dt>Luma</dt>
              <dd><a href={LUMA_PROFILE} {...ext}>luma.com/user/usr-imLXdlHS1TlvX7X</a></dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="btm">
        <div className="wrap">
          <span>© 2026 2% Tech</span>
          <span><B zh="旧金山湾区" en="San Francisco Bay Area" /></span>
        </div>
      </footer>
    </>
  );
}
