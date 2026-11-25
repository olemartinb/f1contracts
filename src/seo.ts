// Page titles, descriptions, FAQs and structured data for every pre-rendered page, in the current language.
import { changes, data, driverPath, getTeam, gridDrivers, lastName, leavingDrivers, teamDrivers, teamPath, type Driver, type Team } from './data';
import { changeText, href, noteOf, t } from './i18n';
import { homeFaq, whenEnds, type FaqItem } from './faq';
import { YEARS_OUT } from './components/cells';

const clip = (s: string, max = 158) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);
const titled = (s: string) => `${s} | ${t().meta.brand}`;

export interface PageMeta {
  /** English (unprefixed) path; the language prefix is added when writing the page. */
  path: string;
  title: string;
  description: string;
  jsonLd: object[];
  lastmod: string;
  priority: string;
  /** Social preview image path; defaults to /og.png. */
  image?: string;
}

export const marketYear = data.nextSeason + 1;
export const outAfterNext = gridDrivers.filter((d) => d.contractEnd === data.nextSeason && !d.optionBeyond);
export const signedBeyond = gridDrivers.filter((d) => d.contractEnd > data.nextSeason || d.optionBeyond);
export const teamsFullyOpen = data.teams.filter((tm) => {
  const ds = gridDrivers.filter((d) => d.team === tm.id);
  return ds.length > 0 && ds.every((d) => outAfterNext.includes(d));
});
export const endingAfter = (y: number) => gridDrivers.filter((d) => d.contractEnd === y);

export function teammatesOf(d: Driver) {
  return gridDrivers.filter((x) => x.team === d.team && x.id !== d.id);
}

// ---------- FAQs ----------

export function driverFaq(d: Driver): FaqItem[] {
  const tr = t();
  const f = tr.faq;
  const team = getTeam(d.team).name;
  const mates = teammatesOf(d);
  const items: FaqItem[] = [];
  if (d.status === 'leaving') {
    items.push({ q: f.isLeavingQ(d.name, team), a: `${f.yes} ${noteOf(d)}` });
  } else {
    items.push(whenEnds(d));
    items.push({
      q: f.officialQ(d.name),
      a: d.basis === 'official' ? f.officialYes(team, lastName(d.name)) : f.officialNo(team, d.source.label),
    });
    if (mates.length) {
      items.push({ q: f.teammateQ(d.name, data.nextSeason), a: `${tr.list(mates.map((m) => f.contractIn(m.name, tr.contractShort(m))))}.` });
    }
    if (d.number) items.push({ q: f.numberQ(d.name), a: f.numberA(d.name, d.number, data.currentSeason) });
  }
  return items;
}

export function teamFaq(tm: Team): FaqItem[] {
  const tr = t();
  const drivers = gridDrivers.filter((d) => d.team === tm.id);
  return [
    { q: tr.faq.whoDrivesQ(tm.name, data.nextSeason), a: `${tr.list(drivers.map((d) => d.name))}.` },
    ...drivers.map((d) => ({
      q: tr.faq.teamEndsQ(d.name, tm.name),
      a: tr.faq.teamEndsA(d.name, tr.contractPhrase(d), d.basis === 'reported'),
    })),
  ];
}

export function marketFaq(): FaqItem[] {
  const tr = t();
  const f = tr.faq;
  const next = data.nextSeason;
  return [
    { q: f.outAfterQ(next), a: f.outAfterA(outAfterNext.length, next, tr.list(outAfterNext.map((d) => `${d.name} (${getTeam(d.team).name})`))) },
    { q: f.seatsQ(marketYear), a: f.seatsA(signedBeyond.length, gridDrivers.length, marketYear, outAfterNext.length) },
    {
      q: f.bothQ(next),
      a: teamsFullyOpen.length ? f.bothA(tr.list(teamsFullyOpen.map((x) => x.name)), next) : f.bothNone(next),
    },
    {
      q: f.signedForQ(marketYear),
      a: `${tr.list(signedBeyond.map((d) => `${d.name} (${getTeam(d.team).name}, ${tr.contractShort(d)})`))}.`,
    },
  ];
}

export function gridFaq(): FaqItem[] {
  const tr = t();
  const f = tr.faq;
  const y = data.nextSeason;
  const rookies = gridDrivers.filter((d) => d.rookie);
  return [
    { q: f.gridTeamsQ(y), a: f.gridTeamsA(data.teams.length, gridDrivers.length, y) },
    {
      q: f.gridRookiesQ(y),
      a: rookies.length ? `${tr.list(rookies.map((d) => `${d.name} (${getTeam(d.team).name})`))}.` : f.gridRookiesNone(y),
    },
    {
      q: f.leavingQ(data.currentSeason),
      a: leavingDrivers.length ? leavingDrivers.map((d) => `${d.name}: ${noteOf(d)}`).join(' ') : f.noLeaving(data.currentSeason),
    },
  ];
}

export function oocFaq(y: number): FaqItem[] {
  const tr = t();
  const ds = endingAfter(y);
  return [
    {
      q: tr.ooc.q(y),
      a: ds.length ? `${tr.list(ds.map((d) => `${d.name} (${getTeam(d.team).name}, ${tr.contractShort(d)})`))}.` : tr.ooc.none(y),
    },
  ];
}

// ---------- Structured data ----------

const faqLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

const crumbsLd = (site: string, crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${site}${href(c.path)}` })),
});

const latestChangeFor = (pred: (c: (typeof changes)[number]) => boolean) => {
  const c = changes.find(pred);
  return c && c.date.length === 10 && c.date > data.updated ? c.date : data.updated;
};

// ---------- Page metadata ----------

export function homeMeta(site: string): PageMeta {
  const m = t().meta;
  return {
    path: '/',
    title: m.homeTitle(data.nextSeason),
    description: clip(m.homeDesc(data.nextSeason)),
    lastmod: data.updated,
    priority: '1.0',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: m.brand, url: `${site}${href('/')}` },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: m.homeTitle(data.nextSeason),
        url: `${site}${href('/')}`,
        dateModified: data.updated,
        inLanguage: t().locale,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: gridDrivers.length,
          itemListElement: gridDrivers.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${site}${href(driverPath(d))}`,
            name: `${d.name}: ${getTeam(d.team).name}, ${t().contractShort(d)}`,
          })),
        },
      },
      faqLd(homeFaq()),
    ],
  };
}

export function driverMeta(site: string, d: Driver): PageMeta {
  const tr = t();
  const team = getTeam(d.team);
  return {
    path: driverPath(d),
    title: titled(tr.meta.driverTitle(d, team.name)),
    description: clip(tr.meta.driverDesc(d, team.name, noteOf(d))),
    lastmod: latestChangeFor((c) => c.driver === d.id || c.team === d.team),
    priority: d.status === 'leaving' ? '0.5' : '0.8',
    image: `/og/drivers/${d.id}.jpg`,
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.drivers, path: '/drivers' },
        { name: d.name, path: driverPath(d) },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: d.name,
        jobTitle: 'Formula 1 driver',
        url: `${site}${href(driverPath(d))}`,
        memberOf: { '@type': 'SportsTeam', name: team.name, sport: 'Formula 1', url: `${site}${href(teamPath(team))}` },
      },
      faqLd(driverFaq(d)),
    ],
  };
}

export function teamMeta(site: string, tm: Team): PageMeta {
  const tr = t();
  const drivers = gridDrivers.filter((d) => d.team === tm.id);
  return {
    path: teamPath(tm),
    title: titled(tr.meta.teamTitle(tm.name, data.nextSeason, tr.list(drivers.map((d) => lastName(d.name))))),
    description: clip(tr.meta.teamDesc(tm.name, data.nextSeason, drivers.map((d) => `${d.name} (${tr.contractShort(d)})`).join(', '))),
    lastmod: latestChangeFor((c) => c.team === tm.id || teamDrivers(tm.id).some((d) => d.id === c.driver)),
    priority: '0.7',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.teams, path: '/teams' },
        { name: tm.name, path: teamPath(tm) },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'SportsTeam',
        name: tm.name,
        sport: 'Formula 1',
        url: `${site}${href(teamPath(tm))}`,
        athlete: drivers.map((d) => ({ '@type': 'Person', name: d.name, url: `${site}${href(driverPath(d))}` })),
      },
      faqLd(teamFaq(tm)),
    ],
  };
}

export function changesMeta(site: string): PageMeta {
  const tr = t();
  return {
    path: '/changes',
    title: titled(tr.meta.changesTitle),
    description: clip(
      tr.meta.changesDesc(
        changes
          .slice(0, 3)
          .map((c) => changeText(c).replace(/\.$/, ''))
          .join('; '),
      ),
    ),
    lastmod: changes[0]?.date.length === 10 && changes[0].date > data.updated ? changes[0].date : data.updated,
    priority: '0.7',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.changes, path: '/changes' },
      ]),
    ],
  };
}

export function driversIndexMeta(site: string): PageMeta {
  const tr = t();
  return {
    path: '/drivers',
    title: titled(tr.meta.driversTitle(data.nextSeason)),
    description: clip(tr.meta.driversDesc(gridDrivers.length, data.nextSeason)),
    lastmod: data.updated,
    priority: '0.6',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.drivers, path: '/drivers' },
      ]),
    ],
  };
}

export function teamsIndexMeta(site: string): PageMeta {
  const tr = t();
  return {
    path: '/teams',
    title: titled(tr.meta.teamsTitle(data.nextSeason)),
    description: clip(tr.meta.teamsDesc(data.teams.length, data.nextSeason)),
    lastmod: data.updated,
    priority: '0.6',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.teams, path: '/teams' },
      ]),
    ],
  };
}

export function marketMeta(site: string): PageMeta {
  const tr = t();
  return {
    path: '/driver-market',
    title: titled(tr.meta.marketTitle(marketYear, data.nextSeason)),
    description: clip(tr.meta.marketDesc(outAfterNext.length, data.nextSeason, tr.list(outAfterNext.slice(0, 4).map((d) => d.name)), marketYear)),
    lastmod: data.updated,
    priority: '0.9',
    image: '/og/driver-market.jpg',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.market(marketYear), path: '/driver-market' },
      ]),
      faqLd(marketFaq()),
    ],
  };
}

export function gridMeta(site: string): PageMeta {
  const tr = t();
  return {
    path: '/grid',
    title: titled(tr.meta.gridTitle(data.nextSeason)),
    description: clip(tr.meta.gridDesc(data.nextSeason, gridDrivers.length)),
    lastmod: data.updated,
    priority: '0.9',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.grid(data.nextSeason), path: '/grid' },
      ]),
      faqLd(gridFaq()),
    ],
  };
}

export function oocMeta(site: string, y: number): PageMeta {
  const tr = t();
  const ds = endingAfter(y);
  return {
    path: `/out-of-contract/${y}`,
    title: titled(tr.meta.oocTitle(y)),
    description: clip(tr.meta.oocDesc(ds.length, y, tr.list(ds.map((d) => d.name)))),
    lastmod: data.updated,
    priority: '0.6',
    jsonLd: [
      crumbsLd(site, [
        { name: tr.crumbs.home, path: '/' },
        { name: tr.crumbs.outOfContract(y), path: `/out-of-contract/${y}` },
      ]),
      faqLd(oocFaq(y)),
    ],
  };
}

export function privacyMeta(): PageMeta {
  return {
    path: '/privacy',
    title: 'Privacy | F1 Contracts',
    description: 'How F1 Contracts handles analytics, ads and cookies.',
    lastmod: data.updated,
    priority: '0.2',
    jsonLd: [],
  };
}

export { YEARS_OUT };
