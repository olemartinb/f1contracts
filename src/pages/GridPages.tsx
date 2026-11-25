import { data, driverPath, getTeam, gridDrivers, leavingDrivers, teamPath } from '../data';
import { href, t } from '../i18n';
import { DriverCard } from '../components/DriverCard';
import { Flag } from '../components/Grid';
import { Eyebrow, H2, Page, PageTitle } from '../components/Shell';
import { endingAfter, gridFaq, oocFaq } from '../seo';
import { Faq } from './DriverPage';
import { YearLinks } from './MarketPage';
import { textColor } from '../color';

/** /grid: the confirmed line-up for next season as a table. */
export function GridPage() {
  const tr = t();
  const g = tr.gridPage;
  const y = data.nextSeason;
  const rookies = gridDrivers.filter((d) => d.rookie);
  return (
    <Page
      crumbs={[
        { name: tr.crumbs.home, href: '/' },
        { name: tr.crumbs.grid(y), href: '/grid' },
      ]}
    >
      <Eyebrow>{g.eyebrow}</Eyebrow>
      <PageTitle main={g.h1(y)} outline={g.h1b} />
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{g.lede(y)}</p>

      <table className="mt-10 w-full border-collapse border-2 border-line text-left">
        <thead>
          <tr className="border-b-2 border-line text-xs font-semibold uppercase tracking-widest text-muted">
            <th scope="col" className="px-4 py-3">{g.colDriver}</th>
            <th scope="col" className="px-4 py-3 text-right">{g.colUntil}</th>
          </tr>
        </thead>
        {data.teams.map((team) => (
          <tbody key={team.id} className="border-b border-line">
            <tr>
              <th scope="colgroup" colSpan={2} className="border-l-4 px-4 pb-1 pt-4" style={{ borderLeftColor: team.color }}>
                <a href={href(teamPath(team))} className="font-cond text-xl font-black uppercase italic hover:text-flag">
                  {team.name}
                </a>
              </th>
            </tr>
            {gridDrivers
              .filter((d) => d.team === team.id)
              .map((d) => (
                <tr key={d.id}>
                  <td className="border-l-4 px-4 py-2" style={{ borderLeftColor: team.color }}>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="w-7 text-right font-cond text-xl font-black italic tabular-nums" style={{ color: textColor(team.color) }}>
                        {d.number ?? '?'}
                      </span>
                      <a href={href(driverPath(d))} className="font-semibold hover:text-flag">
                        {d.name}
                      </a>
                      {d.rookie && <Flag>{tr.rookie}</Flag>}
                      {d.status === 'unsigned' && <Flag>{tr.unsigned}</Flag>}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right align-top font-cond text-xl font-black italic tabular-nums">
                    {d.contractEnd}
                    {(d.optionYear || d.optionBeyond) && <span className="text-flag">+</span>}
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>

      <H2>{g.newTitle(y)}</H2>
      {rookies.length || leavingDrivers.length ? (
        <ul className="space-y-2 text-lg leading-relaxed">
          {rookies.map((d) => (
            <li key={d.id}>
              <a href={href(driverPath(d))} className="font-semibold hover:text-flag">
                {g.joins(d.name, getTeam(d.team).name)}
              </a>
            </li>
          ))}
          {leavingDrivers.map((d) => (
            <li key={d.id}>
              <a href={href(driverPath(d))} className="font-semibold hover:text-flag">
                {g.leavesTeam(d.name, getTeam(d.team).name)}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">{g.noChanges}</p>
      )}

      <H2>{tr.driver.questions}</H2>
      <Faq items={gridFaq()} />
    </Page>
  );
}

/** /out-of-contract/<year>: drivers whose deals end after that season. */
export function OutOfContractPage({ year }: { year: number }) {
  const tr = t();
  const o = tr.ooc;
  const drivers = endingAfter(year);
  return (
    <Page
      crumbs={[
        { name: tr.crumbs.home, href: '/' },
        { name: tr.crumbs.outOfContract(year), href: `/out-of-contract/${year}` },
      ]}
    >
      <Eyebrow>{o.eyebrow}</Eyebrow>
      <PageTitle main={o.h1} outline={o.h1b(year)} />
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{drivers.length ? o.lede(drivers.length, year) : o.none(year)}</p>

      {drivers.length > 0 && (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {drivers.map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
        </div>
      )}

      <H2>{o.otherYears}</H2>
      <YearLinks current={year} />

      <H2>{tr.driver.questions}</H2>
      <Faq items={oocFaq(year)} />
    </Page>
  );
}
