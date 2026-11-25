import { data, driverPath, getTeam, gridDrivers, teamPath } from '../data';
import { href, noteOf, t } from '../i18n';
import { DriverCard } from '../components/DriverCard';
import { Flag } from '../components/Grid';
import { Eyebrow, H2, Page, PageTitle } from '../components/Shell';
import { endingAfter, marketFaq, marketYear, outAfterNext, signedBeyond, teamsFullyOpen, YEARS_OUT } from '../seo';
import { Faq } from './DriverPage';

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="border-l-[3px] border-paint pl-3">
      <dd className="font-cond text-4xl font-black italic leading-none tabular-nums sm:text-5xl">{value}</dd>
      <dt className="mt-1.5 text-sm leading-snug text-muted">{label}</dt>
    </div>
  );
}

/** Links to the "out of contract after <year>" pages. */
export function YearLinks({ current }: { current?: number }) {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <a
          href={href('/driver-market')}
          className="inline-block border-2 border-line px-3 py-1.5 font-cond text-lg font-extrabold italic hover:border-paint"
        >
          {data.nextSeason}
        </a>
      </li>
      {YEARS_OUT.map((y) => (
        <li key={y}>
          <a
            href={href(`/out-of-contract/${y}`)}
            aria-current={y === current ? 'page' : undefined}
            className={`inline-block border-2 px-3 py-1.5 font-cond text-lg font-extrabold italic ${
              y === current ? 'border-paint bg-paint text-tar' : 'border-line hover:border-paint'
            }`}
          >
            {y} <span className="font-body text-xs font-semibold not-italic">({endingAfter(y).length})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function MarketPage() {
  const tr = t();
  const m = tr.market;
  const next = data.nextSeason;
  const teamsWithOpen = data.teams.filter((x) => outAfterNext.some((d) => d.team === x.id));
  const watch = gridDrivers.filter((d) => d.status === 'unsigned' || (d.optionYear && d.contractEnd === next));

  return (
    <Page
      crumbs={[
        { name: tr.crumbs.home, href: '/' },
        { name: tr.crumbs.market(marketYear), href: '/driver-market' },
      ]}
    >
      <Eyebrow>{m.eyebrow}</Eyebrow>
      <PageTitle main={m.h1(marketYear)} outline={m.h1b} />
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{m.lede(next, marketYear)}</p>

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
        <Stat value={<>{outAfterNext.length}<span className="text-muted">/{gridDrivers.length}</span></>} label={m.statOut(next)} />
        <Stat value={signedBeyond.length} label={m.statSigned(marketYear)} />
        <Stat value={teamsFullyOpen.length} label={m.statBoth} />
      </dl>

      {watch.length > 0 && (
        <>
          <H2>{m.watch}</H2>
          <ul className="space-y-3">
            {watch.map((d) => (
              <li key={d.id} className="border-2 border-line bg-tar2 p-4">
                <p className="flex flex-wrap items-center gap-2 font-cond text-xl font-extrabold uppercase">
                  <a href={href(driverPath(d))} className="hover:text-flag">
                    {d.name}
                  </a>
                  <span className="font-body text-sm font-normal normal-case text-muted">{getTeam(d.team).name}</span>
                  {d.status === 'unsigned' ? <Flag>{tr.notYetSigned}</Flag> : <Flag>{tr.option(d.optionYear!)}</Flag>}
                </p>
                <p className="mt-1 leading-relaxed text-muted">{noteOf(d)}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <H2>{m.outTitle(next)}</H2>
      <div className="space-y-8">
        {teamsWithOpen.map((x) => (
          <section key={x.id}>
            <h3 className="mb-3 flex items-center gap-3 font-cond text-2xl font-black uppercase italic">
              <span className="h-5 w-1.5" style={{ background: x.color }} aria-hidden />
              <a href={href(teamPath(x))} className="hover:text-flag">
                {x.name}
              </a>
              {teamsFullyOpen.includes(x) && <Flag>{m.both}</Flag>}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {outAfterNext
                .filter((d) => d.team === x.id)
                .map((d) => (
                  <DriverCard key={d.id} driver={d} showTeam={false} />
                ))}
            </div>
          </section>
        ))}
      </div>

      <H2>{m.signedTitle(marketYear)}</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[...signedBeyond]
          .sort((a, b) => b.contractEnd - a.contractEnd)
          .map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
      </div>

      <H2>{m.laterYears}</H2>
      <YearLinks />

      <H2>{tr.driver.questions}</H2>
      <Faq items={marketFaq()} />
    </Page>
  );
}
