import { ArrowUpRight, Plus } from 'lucide-react';
import { data, formatUpdated, getTeam, gridDrivers, leavingDrivers, lastName } from './data';
import { Badge, Timeline } from './components/Timeline';
import { faq } from './faq';

const next = data.nextSeason;
const signed = gridDrivers.filter((d) => d.status === 'signed').length;
const expiringNext = gridDrivers.filter((d) => d.contractEnd === next && !d.optionBeyond);
const longest = Math.max(...gridDrivers.map((d) => d.contractEnd));
const longestNames = gridDrivers.filter((d) => d.contractEnd === longest).map((d) => lastName(d.name));
const officialCount = gridDrivers.filter((d) => d.basis === 'official').length;

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight [font-stretch:125%]">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#FF1E00" />
        <path d="M7 22 L15 10 H25 L23 13 H17 L15.7 15 H21.5 L19.6 18 H13.7 L11 22 Z" fill="#fff" />
      </svg>
      <span>
        F1&nbsp;Contracts
      </span>
    </a>
  );
}

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 id={id} className="scroll-mt-24 font-display text-3xl font-extrabold leading-[1.05] tracking-tight [font-stretch:115%] sm:text-4xl">
        {title}
      </h2>
      {children && <div className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{children}</div>}
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="border-l border-line pl-4">
      <dd className="font-display text-3xl font-extrabold tracking-tight [font-stretch:115%] sm:text-4xl">{value}</dd>
      <dt className="mt-1 text-sm text-muted">{label}</dt>
    </div>
  );
}

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-ink text-white antialiased">
      <a href="#contracts" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink">
        Skip to contracts
      </a>

      <header className="sticky top-0 z-20 h-14 border-b border-line bg-ink/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav aria-label="Sections" className="hidden gap-6 text-sm text-muted sm:flex">
            <a className="hover:text-white" href="#contracts">Contracts</a>
            <a className="hover:text-white" href="#market">{next + 1} market</a>
            <a className="hover:text-white" href="#teams">Line-ups</a>
            <a className="hover:text-white" href="#faq">FAQ</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-24">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-xs text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
              Updated <time dateTime={data.updated}>{formatUpdated(data.updated)}</time>
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.95] tracking-tight [font-stretch:125%] sm:text-7xl lg:text-8xl">
              F1 driver contracts<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              When every Formula&nbsp;1 driver’s deal runs out, for the {next} season and beyond. Fact-checked against team
              announcements, with a source for every contract.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              <Stat value={<>{signed}<span className="text-muted">/{gridDrivers.length}</span></>} label={`${next} seats signed`} />
              <Stat value={expiringNext.length} label={`Deals ending after ${next}`} />
              <Stat value={longest} label={`Longest deals: ${longestNames.join(' & ')}`} />
              <Stat value={officialCount} label="End dates officially confirmed" />
            </dl>
          </div>
        </section>

        {/* Timeline */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="contracts">
          <SectionHeading id="contracts" eyebrow="Contract timeline" title={`Who is signed until when`}>
            Each bar runs from the {next} season to the last year of the driver’s current deal. Teams often keep the length
            private, so bars marked “reported” use the best public reporting.
          </SectionHeading>
          <Timeline />
        </section>

        {/* Market */}
        <section className="border-y border-line bg-surface/40" aria-labelledby="market">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <SectionHeading id="market" eyebrow="Next silly season" title={`${expiringNext.length} drivers out of contract after ${next}`}>
              These deals end with the {next} season, which makes the {next + 1} driver market one of the biggest in years.
            </SectionHeading>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {expiringNext.map((d) => {
                const team = getTeam(d.team);
                return (
                  <li key={d.id} className="flex items-center gap-3 rounded-xl border border-line bg-ink p-4">
                    <span className="h-10 w-1 rounded-full" style={{ background: team.color }} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{d.name}</p>
                      <p className="text-sm text-muted">{team.name}</p>
                    </div>
                    {d.optionYear ? (
                      <span className="whitespace-nowrap font-mono text-xs text-soft">Option {d.optionYear}</span>
                    ) : d.status === 'unsigned' ? (
                      <Badge tone="warn">Unsigned</Badge>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {leavingDrivers.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-4 font-display text-lg font-bold">Leaving after {data.currentSeason}</h3>
                <ul className="space-y-3">
                  {leavingDrivers.map((d) => (
                    <li key={d.id} className="flex flex-col gap-1 rounded-xl border border-dashed border-line p-4 sm:flex-row sm:items-center sm:gap-4">
                      <p className="font-semibold">
                        {d.name} <span className="font-normal text-muted">· {getTeam(d.team).name}</span>
                      </p>
                      <p className="text-sm text-muted sm:flex-1">{d.note}</p>
                      <a href={d.source.url} target="_blank" rel="noopener" className="inline-flex items-center gap-0.5 text-sm text-soft hover:text-white">
                        {d.source.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Line-ups */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="teams">
          <SectionHeading id="teams" eyebrow={`${next} grid`} title={`${next} F1 driver line-ups`}>
            All {data.teams.length} teams and their drivers for next season, with the year each contract ends.
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.teams.map((team) => {
              const drivers = gridDrivers.filter((d) => d.team === team.id);
              return (
                <article key={team.id} className="overflow-hidden rounded-xl border border-line bg-surface">
                  <div className="h-1" style={{ background: team.color }} aria-hidden />
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold [font-stretch:110%]">{team.name}</h3>
                    <ul className="mt-4 space-y-3">
                      {drivers.map((d) => (
                        <li key={d.id} className="flex items-baseline justify-between gap-3">
                          <span className="flex min-w-0 items-baseline gap-2.5">
                            <span className="w-6 shrink-0 text-right font-mono text-xs text-muted tabular-nums">{d.number ?? '—'}</span>
                            <span className="truncate">{d.name}</span>
                            {d.rookie && <Badge tone="new">Rookie</Badge>}
                          </span>
                          <span className="flex items-center gap-0.5 font-mono text-sm tabular-nums text-soft">
                            {d.status === 'unsigned' ? <span className="text-amber-300">TBC</span> : d.contractEnd}
                            {(d.optionYear || d.optionBeyond) && <Plus className="h-3 w-3 text-muted" aria-label="with option" />}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">Race numbers are from the {data.currentSeason} season. A “+” means the deal includes an option.</p>
        </section>

        {/* FAQ */}
        <section className="border-t border-line" aria-labelledby="faq">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <SectionHeading id="faq" eyebrow="FAQ" title="F1 contract questions" />
            <div className="divide-y divide-line border-y border-line">
              {faq.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    <h3>{item.q}</h3>
                    <Plus className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <p className="max-w-xl">
            Unofficial fan site, not affiliated with Formula&nbsp;1, the FIA or any team. Contract details change; every entry
            links to its source. Last checked {formatUpdated(data.updated)}.
          </p>
        </div>
      </footer>
    </div>
  );
}
