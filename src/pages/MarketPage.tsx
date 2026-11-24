import { data, getTeam, gridDrivers, teamPath } from '../data';
import { DriverCard } from '../components/DriverCard';
import { Flag } from '../components/Grid';
import { Eyebrow, H2, Page } from '../components/Shell';
import { marketFaq, marketYear, outAfterNext, signedBeyond, teamsFullyOpen } from '../seo';
import { Faq } from './DriverPage';

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="border-l-[3px] border-paint pl-3">
      <dd className="font-cond text-4xl font-black italic leading-none tabular-nums sm:text-5xl">{value}</dd>
      <dt className="mt-1.5 text-sm leading-snug text-muted">{label}</dt>
    </div>
  );
}

export default function MarketPage() {
  const next = data.nextSeason;
  const teamsWithOpen = data.teams.filter((t) => outAfterNext.some((d) => d.team === t.id));
  const watch = gridDrivers.filter((d) => d.status === 'unsigned' || (d.optionYear && d.contractEnd === next));

  return (
    <Page
      crumbs={[
        { name: 'Home', href: '/' },
        { name: `${marketYear} driver market`, href: '/driver-market' },
      ]}
    >
      <Eyebrow>Next silly season</Eyebrow>
      <h1 className="font-cond text-5xl font-black uppercase italic leading-[0.88] tracking-tight sm:text-7xl">
        {marketYear} driver market
        <span className="outline-text block">who&rsquo;s out of contract</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        Every driver whose deal ends with the {next} season, team by team, and who is already locked in for {marketYear}. Updated
        whenever a contract changes.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
        <Stat value={<>{outAfterNext.length}<span className="text-muted">/{gridDrivers.length}</span></>} label={`Out of contract after ${next}`} />
        <Stat value={signedBeyond.length} label={`Signed for ${marketYear} or later`} />
        <Stat value={teamsFullyOpen.length} label="Teams with both drivers out of contract" />
      </dl>

      {watch.length > 0 && (
        <>
          <H2>Ones to watch</H2>
          <ul className="space-y-3">
            {watch.map((d) => (
              <li key={d.id} className="border-2 border-line bg-tar2 p-4">
                <p className="flex flex-wrap items-center gap-2 font-cond text-xl font-extrabold uppercase">
                  <a href={`/drivers/${d.id}`} className="hover:text-flag">
                    {d.name}
                  </a>
                  <span className="font-body text-sm font-normal normal-case text-muted">{getTeam(d.team).name}</span>
                  {d.status === 'unsigned' ? <Flag>Not yet signed</Flag> : <Flag>Option {d.optionYear}</Flag>}
                </p>
                <p className="mt-1 leading-relaxed text-muted">{d.note}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <H2>Out of contract after {next}</H2>
      <div className="space-y-8">
        {teamsWithOpen.map((t) => (
          <section key={t.id}>
            <h3 className="mb-3 flex items-center gap-3 font-cond text-2xl font-black uppercase italic">
              <span className="h-5 w-1.5" style={{ background: t.color }} aria-hidden />
              <a href={teamPath(t)} className="hover:text-flag">
                {t.name}
              </a>
              {teamsFullyOpen.includes(t) && <Flag>Both seats</Flag>}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {outAfterNext
                .filter((d) => d.team === t.id)
                .map((d) => (
                  <DriverCard key={d.id} driver={d} showTeam={false} />
                ))}
            </div>
          </section>
        ))}
      </div>

      <H2>Already signed for {marketYear}</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[...signedBeyond]
          .sort((a, b) => b.contractEnd - a.contractEnd)
          .map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
      </div>

      <H2>Questions</H2>
      <Faq items={marketFaq()} />
    </Page>
  );
}
