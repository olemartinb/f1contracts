import { ArrowUpRight, Plus } from 'lucide-react';
import { data, formatUpdated, getTeam, gridDrivers, leavingDrivers, lastName } from './data';
import { Flag, Grid } from './components/Grid';
import { faq } from './faq';

const next = data.nextSeason;
const signed = gridDrivers.filter((d) => d.status === 'signed').length;
const expiringNext = gridDrivers.filter((d) => d.contractEnd === next && !d.optionBeyond);
const longest = Math.max(...gridDrivers.map((d) => d.contractEnd));
const longestNames = gridDrivers.filter((d) => d.contractEnd === longest).map((d) => lastName(d.name));
const officialCount = gridDrivers.filter((d) => d.basis === 'official').length;

function Logo() {
  return (
    <a href="#top" className="font-cond text-xl font-black uppercase italic tracking-tight sm:text-2xl">
      F1<span className="px-0.5 text-flag">/</span>Contracts
    </a>
  );
}

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
  return (
    <div id="top" className="min-h-screen bg-tar text-paint antialiased">
      <a
        href="#grid"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-flag focus:px-3 focus:py-2 focus:text-tar"
      >
        Skip to the grid
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-tar/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav aria-label="Sections" className="hidden gap-6 text-sm font-semibold text-muted sm:flex">
            <a className="hover:text-paint" href="#grid">The grid</a>
            <a className="hover:text-paint" href="#market">{next + 1} market</a>
            <a className="hover:text-paint" href="#teams">Line-ups</a>
            <a className="hover:text-paint" href="#faq">FAQ</a>
          </nav>
          <span className="text-xs text-muted sm:hidden">
            Updated <time dateTime={data.updated}>{formatUpdated(data.updated)}</time>
          </span>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="tarmac">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
            <p className="mb-5 hidden font-body text-sm text-muted sm:block">
              Updated <time dateTime={data.updated}>{formatUpdated(data.updated)}</time>
            </p>
            <h1 className="font-cond text-[13vw] font-black uppercase italic leading-[0.85] tracking-tight sm:text-8xl lg:text-[124px]">
              F1 driver contracts
              <span className="outline-text block">{next} and beyond</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              The whole Formula&nbsp;1 grid, lined up by how long each driver is signed for. Longest deal on pole. Tap a
              driver for the details and the source.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              <Stat value={<>{signed}<span className="text-muted">/{gridDrivers.length}</span></>} label={`${next} seats signed`} />
              <Stat value={expiringNext.length} label={`Out of contract after ${next}`} />
              <Stat value={longest} label={`Longest deals: ${longestNames.join(' & ')}`} />
              <Stat value={officialCount} label="End dates officially confirmed" />
            </dl>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 sm:pb-28" aria-labelledby="grid">
          <SectionHeading id="grid" eyebrow="The grid" title={`The ${next} grid, by contract`}>
            Each box shows the seasons a driver is signed for, from {next} on. Teams often keep contract length private, so
            “Reported” means the end year comes from media reports.
          </SectionHeading>
          <Grid />
        </section>

        {/* Market */}
        <section className="border-y border-line bg-tar2" aria-labelledby="market">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <SectionHeading id="market" eyebrow="Next silly season" title={`${expiringNext.length} drivers out of contract after ${next}`}>
              These deals end with the {next} season, which makes the {next + 1} driver market one of the biggest in years.
            </SectionHeading>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {expiringNext.map((d) => {
                const team = getTeam(d.team);
                return (
                  <li key={d.id} className="flex items-center gap-3 border-b border-line py-3">
                    <span className="w-8 text-right font-cond text-2xl font-black italic tabular-nums" style={{ color: team.color }}>
                      {d.number ?? '?'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-cond text-lg font-extrabold uppercase leading-tight">{d.name}</p>
                      <p className="text-sm text-muted">{team.name}</p>
                    </div>
                    {d.optionYear ? (
                      <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted">
                        Option {d.optionYear}
                      </span>
                    ) : d.status === 'unsigned' ? (
                      <Flag>Unsigned</Flag>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {leavingDrivers.length > 0 && (
              <div className="mt-14">
                <h3 className="mb-4 font-cond text-2xl font-black uppercase italic">Leaving after {data.currentSeason}</h3>
                <ul className="space-y-3">
                  {leavingDrivers.map((d) => (
                    <li key={d.id} className="flex flex-col gap-1 border-2 border-dashed border-line p-4 sm:flex-row sm:items-center sm:gap-4">
                      <p className="font-cond text-lg font-extrabold uppercase">
                        {d.name} <span className="font-body text-sm font-normal normal-case text-muted">· {getTeam(d.team).name}</span>
                      </p>
                      <p className="text-sm text-muted sm:flex-1">{d.note}</p>
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

        {/* Line-ups */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="teams">
          <SectionHeading id="teams" eyebrow={`${next} line-ups`} title="Team by team">
            All {data.teams.length} teams and their drivers for next season, with the year each contract ends.
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.teams.map((team) => {
              const drivers = gridDrivers.filter((d) => d.team === team.id);
              return (
                <article key={team.id} className="border-2 border-line bg-tar2">
                  <div className="h-1.5" style={{ background: team.color }} aria-hidden />
                  <div className="p-5">
                    <h3 className="font-cond text-2xl font-black uppercase italic leading-none">{team.name}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {drivers.map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span className="w-7 shrink-0 text-right font-cond text-lg font-black italic tabular-nums" style={{ color: team.color }}>
                              {d.number ?? '?'}
                            </span>
                            <span className="truncate">{d.name}</span>
                            {d.rookie && <Flag>Rookie</Flag>}
                          </span>
                          <span className="flex items-center gap-0.5 font-cond text-xl font-black italic tabular-nums">
                            {d.status === 'unsigned' ? <span className="text-flag">TBC</span> : d.contractEnd}
                            {(d.optionYear || d.optionBeyond) && <Plus className="h-3.5 w-3.5 text-flag" aria-label="with option" />}
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
            <SectionHeading id="faq" eyebrow="FAQ" title="Contract questions" />
            <div className="divide-y divide-line border-y border-line">
              {faq.map((item) => (
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
      </main>

      <footer className="start-line">
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
