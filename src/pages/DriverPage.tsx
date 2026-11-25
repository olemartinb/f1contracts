import { ArrowUpRight, Plus } from 'lucide-react';
import { changesFor, data, driverPath, getTeam, gridDrivers, teamPath, type Change, type Driver } from '../data';
import { changeText, formatChangeDate, href, noteOf, t } from '../i18n';
import { Flag, Meter } from '../components/Grid';
import { cellsFor } from '../components/cells';
import { DriverCard } from '../components/DriverCard';
import { Eyebrow, H2, Page, PageTitle } from '../components/Shell';
import { driverFaq, teammatesOf } from '../seo';

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            <h3 className="text-base sm:text-lg">{item.q}</h3>
            <Plus className="h-5 w-5 shrink-0 text-flag transition group-open:rotate-45" aria-hidden />
          </summary>
          <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function NewsList({ items }: { items: Change[] }) {
  return (
    <ol className="space-y-4 border-l-2 border-line pl-5">
      {items.map((c) => (
        <li key={c.date + c.text}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">{formatChangeDate(c.date)}</p>
          <p className="mt-1 leading-relaxed">
            {changeText(c)}{' '}
            <a href={c.source.url} target="_blank" rel="noopener" className="text-sm font-semibold text-flag hover:underline">
              {c.source.label}
            </a>
          </p>
        </li>
      ))}
    </ol>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-l-[3px] border-line pl-3">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</dt>
      <dd className="mt-1 font-cond text-xl font-extrabold uppercase italic leading-tight">{children}</dd>
    </div>
  );
}

export default function DriverPage({ driver: d }: { driver: Driver }) {
  const tr = t();
  const dr = tr.driver;
  const team = getTeam(d.team);
  const mates = teammatesOf(d);
  const sameEnd = gridDrivers.filter((x) => x.contractEnd === d.contractEnd && x.id !== d.id && !x.optionBeyond);
  const history = changesFor(d.id);
  const leaving = d.status === 'leaving';

  return (
    <Page
      crumbs={[
        { name: tr.crumbs.home, href: '/' },
        { name: tr.crumbs.drivers, href: '/drivers' },
        { name: d.name, href: driverPath(d) },
      ]}
    >
      <Eyebrow>
        <a href={href(teamPath(team))} className="hover:underline">
          {team.name}
        </a>
        {d.number ? ` · #${d.number}` : ''}
      </Eyebrow>
      <PageTitle main={d.name} outline={dr.contract} />

      <section className="box mt-10 bg-tar2" aria-label={tr.details}>
        <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: team.color }} aria-hidden />
        <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">{tr.endLabelLong(d)}</p>
            <p className="font-cond text-6xl font-black italic leading-none tabular-nums sm:text-7xl">
              {d.contractEnd}
              {(d.optionYear || d.optionBeyond) && <span className="text-flag">+</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {d.rookie && <Flag>{tr.rookie}</Flag>}
            {d.status === 'unsigned' && <Flag>{tr.notYetSigned}</Flag>}
            {leaving && <Flag>{tr.leaving}</Flag>}
          </div>
        </div>
        <p className="mt-4 text-lg leading-relaxed">
          {leaving ? dr.leaves(d.name, team.name, d.contractEnd) : dr.underContract(d.name, team.name, tr.contractPhrase(d))}
        </p>
        {!leaving && (
          <div className="mt-5">
            <Meter cells={cellsFor(d)} color={team.color} />
          </div>
        )}
      </section>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Fact label={dr.factTeam}>{team.name}</Fact>
        <Fact label={dr.factNumber(data.currentSeason)}>{d.number ?? dr.tba}</Fact>
        <Fact label={dr.factOption}>{d.optionYear ? d.optionYear : d.optionBeyond ? dr.optionYes : dr.optionNone}</Fact>
        <Fact label={dr.factLength}>{d.basis === 'official' ? dr.official : dr.reported}</Fact>
      </dl>

      <H2>{dr.detailsTitle}</H2>
      <p className="max-w-2xl text-lg leading-relaxed text-muted">{noteOf(d)}</p>
      <a
        href={d.source.url}
        target="_blank"
        rel="noopener"
        className="mt-3 inline-flex items-center gap-1 font-semibold text-flag underline-offset-4 hover:underline"
      >
        {tr.source}: {d.source.label}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>

      {history.length > 0 && (
        <>
          <H2>{dr.newsTitle}</H2>
          <NewsList items={history} />
        </>
      )}

      {mates.length > 0 && (
        <>
          <H2>{leaving ? dr.teamDrivers(team.name, data.nextSeason) : dr.teammates(mates.length, data.nextSeason)}</H2>
          <div className="grid gap-3">
            {mates.map((m) => (
              <DriverCard key={m.id} driver={m} />
            ))}
          </div>
        </>
      )}

      {!leaving && sameEnd.length > 0 && (
        <>
          <H2>{dr.alsoOut(d.contractEnd)}</H2>
          <div className="grid gap-3 sm:grid-cols-2">
            {sameEnd.map((m) => (
              <DriverCard key={m.id} driver={m} />
            ))}
          </div>
        </>
      )}

      <H2>{dr.questions}</H2>
      <Faq items={driverFaq(d)} />

      <p className="mt-12">
        <a
          href={href('/#grid')}
          className="inline-flex items-center gap-1 border-2 border-paint px-4 py-2 font-cond text-lg font-extrabold uppercase italic hover:bg-paint hover:text-tar"
        >
          {dr.seeGrid(data.nextSeason)}
        </a>
      </p>
    </Page>
  );
}
