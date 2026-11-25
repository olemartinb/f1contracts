import { ArrowUpRight, ChevronRight } from 'lucide-react';
import {
  changes,
  data,
  driverById,
  driverPath,
  gridDrivers,
  lastName,
  leavingDrivers,
  teamById,
  teamDrivers,
  teamPath,
  type Team,
} from '../data';
import { changeText, formatChangeDate, href, t } from '../i18n';
import { DriverCard } from '../components/DriverCard';
import { Eyebrow, H2, Page, PageTitle } from '../components/Shell';
import { teamFaq } from '../seo';
import { Faq, NewsList } from './DriverPage';

const lede = 'mt-6 max-w-2xl text-lg leading-relaxed text-muted';

export function TeamPage({ team }: { team: Team }) {
  const tr = t();
  const drivers = teamDrivers(team.id);
  const others = data.teams.filter((x) => x.id !== team.id);
  const news = changes.filter((c) => c.team === team.id || drivers.some((d) => d.id === c.driver));
  return (
    <Page
      crumbs={[
        { name: tr.crumbs.home, href: '/' },
        { name: tr.crumbs.teams, href: '/teams' },
        { name: team.name, href: teamPath(team) },
      ]}
    >
      <div className="mb-4 h-1.5 w-24" style={{ background: team.color }} aria-hidden />
      <PageTitle main={team.name} outline={tr.team.h1b(data.nextSeason)} />
      <p className={lede}>{tr.team.lede(team.name, data.nextSeason)}</p>

      <div className="mt-10 grid gap-3">
        {drivers.map((d) => (
          <DriverCard key={d.id} driver={d} showTeam={false} />
        ))}
      </div>

      {news.length > 0 && (
        <>
          <H2>{tr.driver.newsTitle}</H2>
          <NewsList items={news} />
        </>
      )}

      <H2>{tr.driver.questions}</H2>
      <Faq items={teamFaq(team)} />

      <H2>{tr.team.others}</H2>
      <ul className="flex flex-wrap gap-2">
        {others.map((x) => (
          <li key={x.id}>
            <a href={href(teamPath(x))} className="inline-flex items-center gap-2 border-2 border-line px-3 py-1.5 text-sm font-semibold hover:border-paint">
              <span className="h-2.5 w-2.5" style={{ background: x.color }} aria-hidden />
              {x.name}
            </a>
          </li>
        ))}
      </ul>
    </Page>
  );
}

export function TeamsIndex() {
  const tr = t();
  return (
    <Page crumbs={[{ name: tr.crumbs.home, href: '/' }, { name: tr.crumbs.teams, href: '/teams' }]}>
      <Eyebrow>{tr.teamsIndex.eyebrow(data.teams.length)}</Eyebrow>
      <PageTitle main={tr.teamsIndex.h1} outline={tr.teamsIndex.h1b(data.nextSeason)} />
      <p className={lede}>{tr.teamsIndex.lede(data.nextSeason)}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {data.teams.map((x) => (
          <a key={x.id} href={href(teamPath(x))} className="group block border-2 border-line bg-tar2 hover:border-paint">
            <span className="block h-1.5" style={{ background: x.color }} aria-hidden />
            <span className="block p-5">
              <span className="flex items-center justify-between">
                <span className="font-cond text-2xl font-black uppercase italic leading-none">{x.name}</span>
                <ChevronRight className="h-5 w-5 text-muted group-hover:text-paint" aria-hidden />
              </span>
              <span className="mt-3 block space-y-1">
                {gridDrivers
                  .filter((d) => d.team === x.id)
                  .map((d) => (
                    <span key={d.id} className="flex justify-between text-sm">
                      <span>{d.name}</span>
                      <span className="font-cond text-lg font-black italic tabular-nums">
                        {d.status === 'unsigned' ? <span className="text-flag">{tr.tbc}</span> : d.contractEnd}
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
  const tr = t();
  const sorted = [...gridDrivers].sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)));
  return (
    <Page crumbs={[{ name: tr.crumbs.home, href: '/' }, { name: tr.crumbs.drivers, href: '/drivers' }]}>
      <Eyebrow>{tr.driversIndex.eyebrow(gridDrivers.length)}</Eyebrow>
      <PageTitle main={tr.driversIndex.h1} outline={tr.driversIndex.h1b} />
      <p className={lede}>
        {tr.driversIndex.lede(data.nextSeason)}{' '}
        <a className="font-semibold text-paint underline underline-offset-4" href={href('/#grid')}>
          {tr.driversIndex.ledeLink}
        </a>
        .
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {sorted.map((d) => (
          <DriverCard key={d.id} driver={d} />
        ))}
      </div>
      {leavingDrivers.length > 0 && (
        <>
          <H2>{tr.home.leavingAfter(data.currentSeason)}</H2>
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
  const tr = t();
  const cp = tr.changesPage;
  return (
    <Page crumbs={[{ name: tr.crumbs.home, href: '/' }, { name: tr.crumbs.changes, href: '/changes' }]}>
      <Eyebrow>{cp.eyebrow}</Eyebrow>
      <PageTitle main={cp.h1} outline={cp.h1b} />
      <p className={lede}>
        {cp.lede}{' '}
        <a href="/changes.xml" className="font-semibold text-paint underline underline-offset-4">
          {cp.rss}
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
                  <a href={href(teamPath(team))} className="hover:text-paint">
                    {team.name}
                  </a>
                )}
              </p>
              <p className="mt-2 text-lg leading-relaxed">{changeText(c)}</p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                {driver && (
                  <a href={href(driverPath(driver))} className="text-paint underline-offset-4 hover:underline">
                    {cp.driverContract(driver.name)}
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
