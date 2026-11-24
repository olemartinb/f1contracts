import { ArrowUpRight, Plus } from 'lucide-react';
import {
  changesFor,
  contractPhrase,
  data,
  formatChangeDate,
  getTeam,
  gridDrivers,
  teamPath,
  type Driver,
} from '../data';
import { Flag, Meter } from '../components/Grid';
import { cellsFor } from '../components/cells';
import { DriverCard } from '../components/DriverCard';
import { Eyebrow, H2, Page } from '../components/Shell';
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

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-l-[3px] border-line pl-3">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</dt>
      <dd className="mt-1 font-cond text-xl font-extrabold uppercase italic leading-tight">{children}</dd>
    </div>
  );
}

export default function DriverPage({ driver: d }: { driver: Driver }) {
  const team = getTeam(d.team);
  const mates = teammatesOf(d);
  const sameEnd = gridDrivers.filter((x) => x.contractEnd === d.contractEnd && x.id !== d.id && !x.optionBeyond);
  const history = changesFor(d.id);
  const leaving = d.status === 'leaving';

  return (
    <Page
      crumbs={[
        { name: 'Home', href: '/' },
        { name: 'Drivers', href: '/drivers' },
        { name: d.name, href: `/drivers/${d.id}` },
      ]}
    >
      <Eyebrow>
        <a href={teamPath(team)} className="hover:underline">
          {team.name}
        </a>
        {d.number ? ` · #${d.number}` : ''}
      </Eyebrow>
      <h1 className="font-cond text-5xl font-black uppercase italic leading-[0.88] tracking-tight sm:text-7xl">
        {d.name}
        <span className="outline-text block">contract</span>
      </h1>

      <section className="box mt-10 bg-tar2" aria-label="Contract summary">
        <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: team.color }} aria-hidden />
        <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">
              {leaving ? 'Contract ends' : d.status === 'unsigned' ? 'Confirmed for' : d.basis === 'reported' ? 'Reported until' : 'Signed until'}
            </p>
            <p className="font-cond text-6xl font-black italic leading-none tabular-nums sm:text-7xl">
              {d.contractEnd}
              {(d.optionYear || d.optionBeyond) && <span className="text-flag">+</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {d.rookie && <Flag>Rookie</Flag>}
            {d.status === 'unsigned' && <Flag>Not yet signed</Flag>}
            {leaving && <Flag>Leaving</Flag>}
          </div>
        </div>
        <p className="mt-4 text-lg leading-relaxed">
          {leaving ? `${d.name} leaves ${team.name} after the ${d.contractEnd} season.` : `${d.name} is under contract with ${team.name} ${contractPhrase(d)}.`}
        </p>
        {!leaving && (
          <div className="mt-5">
            <Meter cells={cellsFor(d)} color={team.color} />
          </div>
        )}
      </section>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Fact label="Team">{team.name}</Fact>
        <Fact label={`Number (${data.currentSeason})`}>{d.number ?? 'TBA'}</Fact>
        <Fact label="Option">{d.optionYear ? d.optionYear : d.optionBeyond ? 'Yes' : 'None known'}</Fact>
        <Fact label="Length">{d.basis === 'official' ? 'Official' : 'Reported'}</Fact>
      </dl>

      <H2>The details</H2>
      <p className="max-w-2xl text-lg leading-relaxed text-muted">{d.note}</p>
      <a
        href={d.source.url}
        target="_blank"
        rel="noopener"
        className="mt-3 inline-flex items-center gap-1 font-semibold text-flag underline-offset-4 hover:underline"
      >
        Source: {d.source.label}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>

      {history.length > 0 && (
        <>
          <H2>Contract news</H2>
          <ol className="space-y-4 border-l-2 border-line pl-5">
            {history.map((c) => (
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

      {mates.length > 0 && (
        <>
          <H2>{leaving ? `${team.name}'s ${data.nextSeason} drivers` : `Teammate${mates.length > 1 ? 's' : ''} in ${data.nextSeason}`}</H2>
          <div className="grid gap-3">
            {mates.map((m) => (
              <DriverCard key={m.id} driver={m} />
            ))}
          </div>
        </>
      )}

      {!leaving && sameEnd.length > 0 && (
        <>
          <H2>Also out of contract after {d.contractEnd}</H2>
          <div className="grid gap-3 sm:grid-cols-2">
            {sameEnd.map((m) => (
              <DriverCard key={m.id} driver={m} />
            ))}
          </div>
        </>
      )}

      <H2>Questions</H2>
      <Faq items={driverFaq(d)} />

      <p className="mt-12">
        <a href="/#grid" className="inline-flex items-center gap-1 border-2 border-paint px-4 py-2 font-cond text-lg font-extrabold uppercase italic hover:bg-paint hover:text-tar">
          See the whole {data.nextSeason} grid
        </a>
      </p>
    </Page>
  );
}
