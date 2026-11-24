import { ArrowUpRight, ChevronRight } from 'lucide-react';
import {
  changes,
  data,
  driverById,
  driverPath,
  formatChangeDate,
  gridDrivers,
  lastName,
  leavingDrivers,
  teamById,
  teamDrivers,
  teamPath,
  type Team,
} from '../data';
import { DriverCard } from '../components/DriverCard';
import { Eyebrow, H2, Page } from '../components/Shell';
import { teamFaq } from '../seo';
import { Faq } from './DriverPage';

const h1 = 'font-cond text-5xl font-black uppercase italic leading-[0.88] tracking-tight sm:text-7xl';
const lede = 'mt-6 max-w-2xl text-lg leading-relaxed text-muted';

export function TeamPage({ team }: { team: Team }) {
  const drivers = teamDrivers(team.id);
  const others = data.teams.filter((t) => t.id !== team.id);
  const news = changes.filter((c) => c.team === team.id || drivers.some((d) => d.id === c.driver));
  return (
    <Page
      crumbs={[
        { name: 'Home', href: '/' },
        { name: 'Teams', href: '/teams' },
        { name: team.name, href: teamPath(team) },
      ]}
    >
      <div className="mb-4 h-1.5 w-24" style={{ background: team.color }} aria-hidden />
      <h1 className={h1}>
        {team.name}
        <span className="outline-text block">drivers {data.nextSeason}</span>
      </h1>
      <p className={lede}>
        {team.name}&rsquo;s line-up for {data.nextSeason} and when each driver&rsquo;s contract ends. Tap a driver for the full
        details and source.
      </p>

      <div className="mt-10 grid gap-3">
        {drivers.map((d) => (
          <DriverCard key={d.id} driver={d} showTeam={false} />
        ))}
      </div>

      {news.length > 0 && (
        <>
          <H2>Contract news</H2>
          <ol className="space-y-4 border-l-2 border-line pl-5">
            {news.map((c) => (
              <li key={c.date + c.text}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{formatChangeDate(c.date)}</p>
                <p className="mt-1 leading-relaxed">
                  {c.text}{' '}
                  <a href={c.source.url} target="_blank" rel="noopener" className="text-sm font-semibold text-flag hover:underline">
                    {c.source.label}
                  </a>
                </p>
              </li>
            ))}
          </ol>
        </>
      )}

      <H2>Questions</H2>
      <Faq items={teamFaq(team)} />

      <H2>Other teams</H2>
      <ul className="flex flex-wrap gap-2">
        {others.map((t) => (
          <li key={t.id}>
            <a href={teamPath(t)} className="inline-flex items-center gap-2 border-2 border-line px-3 py-1.5 text-sm font-semibold hover:border-paint">
              <span className="h-2.5 w-2.5" style={{ background: t.color }} aria-hidden />
              {t.name}
            </a>
          </li>
        ))}
      </ul>
    </Page>
  );
}

export function TeamsIndex() {
  return (
    <Page crumbs={[{ name: 'Home', href: '/' }, { name: 'Teams', href: '/teams' }]}>
      <Eyebrow>{data.teams.length} teams</Eyebrow>
      <h1 className={h1}>
        F1 teams
        <span className="outline-text block">{data.nextSeason} line-ups</span>
      </h1>
      <p className={lede}>Every team on the {data.nextSeason} grid, its drivers and the year each contract ends.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {data.teams.map((t) => (
          <a key={t.id} href={teamPath(t)} className="group block border-2 border-line bg-tar2 hover:border-paint">
            <span className="block h-1.5" style={{ background: t.color }} aria-hidden />
            <span className="block p-5">
              <span className="flex items-center justify-between">
                <span className="font-cond text-2xl font-black uppercase italic leading-none">{t.name}</span>
                <ChevronRight className="h-5 w-5 text-muted group-hover:text-paint" aria-hidden />
              </span>
              <span className="mt-3 block space-y-1">
                {gridDrivers
                  .filter((d) => d.team === t.id)
                  .map((d) => (
                    <span key={d.id} className="flex justify-between text-sm">
                      <span>{d.name}</span>
                      <span className="font-cond text-lg font-black italic tabular-nums">
                        {d.status === 'unsigned' ? <span className="text-flag">TBC</span> : d.contractEnd}
                        {(d.optionYear || d.optionBeyond) && <span className="text-flag">+</span>}
                      </span>
                    </span>
                  ))}
              </span>
            </span>
          </a>
        ))}
      </div>
    </Page>
  );
}

export function DriversIndex() {
  const sorted = [...gridDrivers].sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)));
  return (
    <Page crumbs={[{ name: 'Home', href: '/' }, { name: 'Drivers', href: '/drivers' }]}>
      <Eyebrow>{gridDrivers.length} drivers</Eyebrow>
      <h1 className={h1}>
        All drivers
        <span className="outline-text block">A to Z</span>
      </h1>
      <p className={lede}>
        Every driver on the {data.nextSeason} grid by surname, with the year their contract ends. For the order by contract
        length, see <a className="font-semibold text-paint underline underline-offset-4" href="/#grid">the grid</a>.
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {sorted.map((d) => (
          <DriverCard key={d.id} driver={d} />
        ))}
      </div>
      {leavingDrivers.length > 0 && (
        <>
          <H2>Leaving after {data.currentSeason}</H2>
          <div className="grid gap-3 sm:grid-cols-2">
            {leavingDrivers.map((d) => (
              <DriverCard key={d.id} driver={d} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}

export function ChangesPage() {
  return (
    <Page crumbs={[{ name: 'Home', href: '/' }, { name: 'Changes', href: '/changes' }]}>
      <Eyebrow>Contract news</Eyebrow>
      <h1 className={h1}>
        Latest
        <span className="outline-text block">changes</span>
      </h1>
      <p className={lede}>
        Every contract change we track, newest first: signings, extensions, options and exits. Each one links to its source.
        Follow along with the{' '}
        <a href="/changes.xml" className="font-semibold text-paint underline underline-offset-4">
          RSS feed
        </a>
        .
      </p>
      <ol className="mt-10 space-y-3">
        {changes.map((c) => {
          const driver = c.driver ? driverById.get(c.driver) : undefined;
          const team = teamById.get(c.team ?? driver?.team ?? '');
          return (
            <li key={c.date + c.text} className="relative border-2 border-line bg-tar2 p-4 pl-5 sm:p-5 sm:pl-6">
              <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: team?.color }} aria-hidden />
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-muted">
                <time dateTime={c.date}>{formatChangeDate(c.date)}</time>
                {team && (
                  <a href={teamPath(team)} className="hover:text-paint">
                    {team.name}
                  </a>
                )}
              </p>
              <p className="mt-2 text-lg leading-relaxed">{c.text}</p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                {driver && (
                  <a href={driverPath(driver)} className="text-paint underline-offset-4 hover:underline">
                    {driver.name}&rsquo;s contract
                  </a>
                )}
                <a href={c.source.url} target="_blank" rel="noopener" className="inline-flex items-center gap-0.5 text-flag hover:underline">
                  {c.source.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </p>
            </li>
          );
        })}
      </ol>
    </Page>
  );
}

