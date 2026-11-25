import { ArrowUpRight, Plus } from 'lucide-react';
import { changes, data, driverById, driverPath, getTeam, gridDrivers, lastName, leavingDrivers, teamById, teamPath } from './data';
import { changeText, formatChangeDate, formatDate, href, noteOf, t } from './i18n';
import { SiteFooter, SiteHeader } from './components/Shell';
import { Flag, Grid } from './components/Grid';
import { homeFaq } from './faq';
import { AdSlot } from './components/AdSlot';
import { textColor } from './color';

const next = data.nextSeason;
const signed = gridDrivers.filter((d) => d.status === 'signed').length;
const expiringNext = gridDrivers.filter((d) => d.contractEnd === next && !d.optionBeyond);
const longest = Math.max(...gridDrivers.map((d) => d.contractEnd));
const longestNames = gridDrivers.filter((d) => d.contractEnd === longest).map((d) => lastName(d.name));
const officialCount = gridDrivers.filter((d) => d.basis === 'official').length;

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-flag">{eyebrow}</p>
      <h2 id={id} className="scroll-mt-24 text-balance font-cond text-4xl font-black uppercase italic leading-[0.9] sm:text-6xl">
        {title}
      </h2>
      {children && <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{children}</div>}
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="border-l-[3px] border-paint pl-3">
      <dd className="font-cond text-4xl font-black italic leading-none tabular-nums sm:text-5xl">{value}</dd>
      <dt className="mt-1.5 text-sm leading-snug text-muted">{label}</dt>
    </div>
  );
}

export default function App() {
  const tr = t();
  const h = tr.home;
  return (
    <div id="top" className="min-h-screen bg-tar text-paint antialiased">
      <a
        href="#grid"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-flag focus:px-3 focus:py-2 focus:text-tar"
      >
        {h.skip}
      </a>

      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="tarmac">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
            <p className="mb-5 font-body text-sm text-muted">
              {h.updated} <time dateTime={data.updated}>{formatDate(data.updated)}</time>
            </p>
            <h1 className="text-balance break-words font-cond text-[12vw] font-black uppercase italic leading-[0.85] tracking-tight sm:text-8xl lg:text-[124px]">
              {h.h1}
              <span className="outline-text block">{h.h1b(next)}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{h.lede}</p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              <Stat value={<>{signed}<span className="text-muted">/{gridDrivers.length}</span></>} label={h.statSigned(next)} />
              <Stat value={expiringNext.length} label={h.statOut(next)} />
              <Stat value={longest} label={h.statLongest(longestNames.join(' & '))} />
              <Stat value={officialCount} label={h.statOfficial} />
            </dl>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 sm:pb-28" aria-labelledby="grid">
          <SectionHeading id="grid" eyebrow={h.gridEyebrow} title={h.gridTitle(next)}>
            {h.gridLede(next)}
          </SectionHeading>
          <Grid />
        </section>

        <AdSlot placement="afterGrid" />

        {/* Market */}
        <section className="border-y border-line bg-tar2" aria-labelledby="market">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <SectionHeading id="market" eyebrow={h.marketEyebrow} title={h.marketTitle(expiringNext.length, next)}>
              {h.marketLede(next)}{' '}
              <a href={href('/driver-market')} className="font-semibold text-flag underline-offset-4 hover:underline">
                {h.marketLink(next + 1)}
              </a>
            </SectionHeading>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {expiringNext.map((d) => {
                const team = getTeam(d.team);
                return (
                  <li key={d.id} className="flex items-center gap-3 border-b border-line py-3">
                    <span className="w-8 text-right font-cond text-2xl font-black italic tabular-nums" style={{ color: textColor(team.color) }}>
                      {d.number ?? '?'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <a href={href(driverPath(d))} className="block truncate font-cond text-lg font-extrabold uppercase leading-tight hover:text-flag">
                        {d.name}
                      </a>
                      <p className="text-sm text-muted">{team.name}</p>
                    </div>
                    {d.optionYear ? (
                      <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted">{tr.option(d.optionYear)}</span>
                    ) : d.status === 'unsigned' ? (
                      <Flag>{tr.unsigned}</Flag>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {leavingDrivers.length > 0 && (
              <div className="mt-14">
                <h3 className="mb-4 font-cond text-2xl font-black uppercase italic">{h.leavingAfter(data.currentSeason)}</h3>
                <ul className="space-y-3">
                  {leavingDrivers.map((d) => (
                    <li key={d.id} className="flex flex-col gap-1 border-2 border-dashed border-line p-4 sm:flex-row sm:items-center sm:gap-4">
                      <p className="font-cond text-lg font-extrabold uppercase">
                        <a href={href(driverPath(d))} className="hover:text-flag">
                          {d.name}
                        </a>{' '}
                        <span className="font-body text-sm font-normal normal-case text-muted">· {getTeam(d.team).name}</span>
                      </p>
                      <p className="text-sm text-muted sm:flex-1">{noteOf(d)}</p>
                      <a href={d.source.url} target="_blank" rel="noopener" className="inline-flex items-center gap-0.5 text-sm font-semibold text-flag hover:underline">
                        {d.source.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Latest changes */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="latest">
          <SectionHeading id="latest" eyebrow={h.latestEyebrow} title={h.latestTitle} />
          <ol className="grid gap-3 sm:grid-cols-2">
            {changes.slice(0, 4).map((c) => {
              const driver = c.driver ? driverById.get(c.driver) : undefined;
              const team = teamById.get(c.team ?? driver?.team ?? '');
              const text = changeText(c);
              return (
                <li key={c.date + c.text} className="relative border-2 border-line bg-tar2 p-4 pl-5">
                  <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: team?.color }} aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    <time dateTime={c.date}>{formatChangeDate(c.date)}</time>
                  </p>
                  <p className="mt-1.5 leading-relaxed">
                    {driver ? (
                      <a href={href(driverPath(driver))} className="hover:text-flag">
                        {text}
                      </a>
                    ) : team ? (
                      <a href={href(teamPath(team))} className="hover:text-flag">
                        {text}
                      </a>
                    ) : (
                      text
                    )}
                  </p>
                </li>
              );
            })}
          </ol>
          <p className="mt-6">
            <a href={href('/changes')} className="font-semibold text-flag underline-offset-4 hover:underline">
              {h.allChanges}
            </a>
          </p>
        </section>

        <AdSlot placement="afterMarket" />

        {/* Line-ups */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="teams">
          <SectionHeading id="teams" eyebrow={h.lineupsEyebrow(next)} title={h.lineupsTitle}>
            {h.lineupsLede(data.teams.length)}
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.teams.map((team) => {
              const drivers = gridDrivers.filter((d) => d.team === team.id);
              return (
                <article key={team.id} className="border-2 border-line bg-tar2">
                  <div className="h-1.5" style={{ background: team.color }} aria-hidden />
                  <div className="p-5">
                    <h3 className="font-cond text-2xl font-black uppercase italic leading-none">
                      <a href={href(teamPath(team))} className="hover:text-flag">
                        {team.name}
                      </a>
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {drivers.map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span className="w-7 shrink-0 text-right font-cond text-xl font-black italic tabular-nums" style={{ color: textColor(team.color) }}>
                              {d.number ?? '?'}
                            </span>
                            <a href={href(driverPath(d))} className="truncate hover:text-flag">
                              {d.name}
                            </a>
                            {d.rookie && <Flag>{tr.rookie}</Flag>}
                          </span>
                          <span className="flex items-center gap-0.5 font-cond text-xl font-black italic tabular-nums">
                            {d.status === 'unsigned' ? <span className="text-flag">{tr.tbc}</span> : d.contractEnd}
                            {(d.optionYear || d.optionBeyond) && <Plus className="h-3.5 w-3.5 text-flag" aria-label={tr.withOption} />}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">{h.numbersNote(data.currentSeason)}</p>
        </section>

        {/* FAQ */}
        <section className="border-t border-line" aria-labelledby="faq">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <SectionHeading id="faq" eyebrow={h.faqEyebrow} title={h.faqTitle} />
            <div className="divide-y divide-line border-y border-line">
              {homeFaq().map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    <h3 className="text-lg">{item.q}</h3>
                    <Plus className="h-5 w-5 shrink-0 text-flag transition group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <AdSlot placement="afterFaq" />
      </main>

      <SiteFooter />
    </div>
  );
}
