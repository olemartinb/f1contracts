// Page titles, descriptions, FAQs and structured data for every pre-rendered page.
import {
  changes,
  contractPhrase,
  contractShort,
  data,
  driverPath,
  getTeam,
  gridDrivers,
  lastName,
  teamDrivers,
  teamPath,
  type Driver,
  type Team,
} from './data';
import { faq as homeFaq, type FaqItem } from './faq';

export const SITE_NAME = 'F1 Contracts';

const clip = (s: string, max = 158) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

const list = (names: string[]) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

export function teammatesOf(d: Driver) {
  return gridDrivers.filter((x) => x.team === d.team && x.id !== d.id);
}

export function driverFaq(d: Driver): FaqItem[] {
  const team = getTeam(d.team).name;
  const mates = teammatesOf(d);
  const items: FaqItem[] = [];
  if (d.status === 'leaving') {
    items.push({
      q: `Is ${d.name} leaving ${team}?`,
      a: `Yes. ${d.note}`,
    });
  } else {
    items.push({
      q: `When does ${d.name}'s contract end?`,
      a: `${d.name} is under contract with ${team} ${contractPhrase(d)}. ${d.note}`,
    });
    items.push({
      q: `Is ${d.name}'s contract length official?`,
      a:
        d.basis === 'official'
          ? `Yes. The end year has been confirmed by ${team} or by ${lastName(d.name)}.`
          : `No. ${team} has not published the length, so the end year comes from media reporting (${d.source.label}).`,
    });
  }
  if (mates.length && d.status !== 'leaving') {
    items.push({
      q: `Who is ${d.name}'s teammate in ${data.nextSeason}?`,
      a: `${list(mates.map((m) => `${m.name} (contract ${contractShort(m)})`))}.`,
    });
  }
  if (d.number && d.status !== 'leaving') {
    items.push({
      q: `What is ${d.name}'s race number?`,
      a: `${d.name} raced with number ${d.number} in ${data.currentSeason}.`,
    });
  }
  return items;
}

export function teamFaq(t: Team): FaqItem[] {
  const drivers = gridDrivers.filter((d) => d.team === t.id);
  return [
    {
      q: `Who drives for ${t.name} in ${data.nextSeason}?`,
      a: `${list(drivers.map((d) => d.name))}.`,
    },
    ...drivers.map((d) => ({
      q: `When does ${d.name}'s ${t.name} contract end?`,
      a: `${d.name} is signed ${contractPhrase(d)}. ${d.basis === 'reported' ? 'The length comes from media reports.' : 'The end year is official.'}`,
    })),
  ];
}

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  jsonLd: object[];
  lastmod: string;
  priority: string;
  /** Social preview image path; defaults to /og.png. */
  image?: string;
}

const faqLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

const crumbsLd = (site: string, crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${site}${c.path}` })),
});

const latestChangeFor = (pred: (c: (typeof changes)[number]) => boolean) => {
  const c = changes.find(pred);
  return c && c.date.length === 10 && c.date > data.updated ? c.date : data.updated;
};

export function homeMeta(site: string): PageMeta {
  return {
    path: '/',
    title: `F1 Driver Contracts ${data.nextSeason}: When Every Formula 1 Contract Expires`,
    description: `Every F1 driver contract for ${data.nextSeason} and beyond: Verstappen, Hamilton, Norris, Leclerc, Antonelli and the full grid. Who is out of contract, option years and sources.`,
    lastmod: data.updated,
    priority: '1.0',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${site}/`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `F1 Driver Contracts ${data.nextSeason}`,
        url: `${site}/`,
        dateModified: data.updated,
        inLanguage: 'en',
        mainEntity: {
          '@type': 'ItemList',
          name: `F1 driver contracts for ${data.nextSeason}`,
          numberOfItems: gridDrivers.length,
          itemListElement: gridDrivers.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${site}${driverPath(d)}`,
            name: `${d.name}: ${getTeam(d.team).name}, contract ${contractShort(d)}`,
          })),
        },
      },
      faqLd(homeFaq),
    ],
  };
}

export function driverMeta(site: string, d: Driver): PageMeta {
  const team = getTeam(d.team);
  const title =
    d.status === 'leaving'
      ? `${d.name} Contract: Leaving ${team.name} After ${d.contractEnd}`
      : `${d.name} Contract: ${team.name} ${contractShort(d).replace(/^until/, 'Until')}`;
  const description =
    d.status === 'leaving'
      ? clip(`${d.name} leaves ${team.name} after the ${d.contractEnd} season. ${d.note}`)
      : clip(`${d.name}'s ${team.name} contract runs ${contractPhrase(d)}. ${d.note}`);
  return {
    path: driverPath(d),
    title: `${title} | ${SITE_NAME}`,
    description,
    lastmod: latestChangeFor((c) => c.driver === d.id || c.team === d.team),
    priority: d.status === 'leaving' ? '0.5' : '0.8',
    image: `/og/drivers/${d.id}.jpg`,
    jsonLd: [
      crumbsLd(site, [
        { name: 'Home', path: '/' },
        { name: 'Drivers', path: '/drivers' },
        { name: d.name, path: driverPath(d) },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: d.name,
        jobTitle: 'Formula 1 driver',
        url: `${site}${driverPath(d)}`,
        memberOf: { '@type': 'SportsTeam', name: team.name, sport: 'Formula 1', url: `${site}${teamPath(team)}` },
      },
      faqLd(driverFaq(d)),
    ],
  };
}

export function teamMeta(site: string, t: Team): PageMeta {
  const drivers = gridDrivers.filter((d) => d.team === t.id);
  return {
    path: teamPath(t),
    title: `${t.name} Drivers ${data.nextSeason}: ${list(drivers.map((d) => lastName(d.name)))} Contracts | ${SITE_NAME}`,
    description: clip(
      `${t.name}'s ${data.nextSeason} line-up: ${drivers.map((d) => `${d.name} (${contractShort(d)})`).join(', ')}. Sources for every deal.`,
    ),
    lastmod: latestChangeFor((c) => c.team === t.id || teamDrivers(t.id).some((d) => d.id === c.driver)),
    priority: '0.7',
    jsonLd: [
      crumbsLd(site, [
        { name: 'Home', path: '/' },
        { name: 'Teams', path: '/teams' },
        { name: t.name, path: teamPath(t) },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'SportsTeam',
        name: t.name,
        sport: 'Formula 1',
        url: `${site}${teamPath(t)}`,
        athlete: drivers.map((d) => ({ '@type': 'Person', name: d.name, url: `${site}${driverPath(d)}` })),
      },
      faqLd(teamFaq(t)),
    ],
  };
}

export function changesMeta(site: string): PageMeta {
  return {
    path: '/changes',
    title: `F1 Contract News: Latest Signings, Extensions and Exits | ${SITE_NAME}`,
    description: clip(
      `Every F1 driver contract change we track, newest first: ${changes
        .slice(0, 3)
        .map((c) => c.text.replace(/\.$/, ''))
        .join('; ')}.`,
    ),
    lastmod: changes[0]?.date.length === 10 && changes[0].date > data.updated ? changes[0].date : data.updated,
    priority: '0.7',
    jsonLd: [
      crumbsLd(site, [
        { name: 'Home', path: '/' },
        { name: 'Changes', path: '/changes' },
      ]),
    ],
  };
}

export function driversIndexMeta(site: string): PageMeta {
  return {
    path: '/drivers',
    title: `All F1 Drivers and Their Contracts (${data.nextSeason}) | ${SITE_NAME}`,
    description: clip(`Contract end dates for all ${gridDrivers.length} Formula 1 drivers on the ${data.nextSeason} grid, A to Z, with options and sources.`),
    lastmod: data.updated,
    priority: '0.6',
    jsonLd: [crumbsLd(site, [{ name: 'Home', path: '/' }, { name: 'Drivers', path: '/drivers' }])],
  };
}

export function teamsIndexMeta(site: string): PageMeta {
  return {
    path: '/teams',
    title: `F1 Teams ${data.nextSeason}: Driver Line-ups and Contracts | ${SITE_NAME}`,
    description: clip(`All ${data.teams.length} Formula 1 teams for ${data.nextSeason}, their drivers and when each contract ends.`),
    lastmod: data.updated,
    priority: '0.6',
    jsonLd: [crumbsLd(site, [{ name: 'Home', path: '/' }, { name: 'Teams', path: '/teams' }])],
  };
}

export function privacyMeta(): PageMeta {
  return {
    path: '/privacy',
    title: `Privacy | ${SITE_NAME}`,
    description: 'How F1 Contracts handles analytics, ads and cookies.',
    lastmod: data.updated,
    priority: '0.2',
    jsonLd: [],
  };
}

export const marketYear = data.nextSeason + 1;
export const outAfterNext = gridDrivers.filter((d) => d.contractEnd === data.nextSeason && !d.optionBeyond);
export const signedBeyond = gridDrivers.filter((d) => d.contractEnd > data.nextSeason || d.optionBeyond);
export const teamsFullyOpen = data.teams.filter((t) => {
  const ds = gridDrivers.filter((d) => d.team === t.id);
  return ds.length > 0 && ds.every((d) => outAfterNext.includes(d));
});

export function marketFaq(): FaqItem[] {
  const next = data.nextSeason;
  return [
    {
      q: `Which F1 drivers are out of contract after ${next}?`,
      a: `${outAfterNext.length} drivers: ${list(outAfterNext.map((d) => `${d.name} (${getTeam(d.team).name})`))}.`,
    },
    {
      q: `How many F1 seats are open for ${marketYear}?`,
      a: `${signedBeyond.length} of ${gridDrivers.length} drivers are already signed for ${marketYear} or later, so up to ${outAfterNext.length} seats could change. Some of those deals have options that a team or driver can take up.`,
    },
    {
      q: `Which teams have both drivers out of contract after ${next}?`,
      a: teamsFullyOpen.length
        ? `${list(teamsFullyOpen.map((t) => t.name))}. Both of their current drivers have deals that end with the ${next} season.`
        : `None. Every team has at least one driver signed beyond ${next}.`,
    },
    {
      q: `Who is already signed for ${marketYear}?`,
      a: `${list(signedBeyond.map((d) => `${d.name} (${getTeam(d.team).name}, ${contractShort(d)})`))}.`,
    },
  ];
}

export function marketMeta(site: string): PageMeta {
  return {
    path: '/driver-market',
    title: `F1 ${marketYear} Driver Market: Every Driver Out of Contract After ${data.nextSeason} | ${SITE_NAME}`,
    description: clip(
      `${outAfterNext.length} F1 drivers are out of contract after ${data.nextSeason}, including ${list(outAfterNext.slice(0, 4).map((d) => d.name))}. Who is free, who is signed for ${marketYear}, and the options to watch.`,
    ),
    lastmod: data.updated,
    priority: '0.9',
    image: '/og/driver-market.jpg',
    jsonLd: [
      crumbsLd(site, [
        { name: 'Home', path: '/' },
        { name: `${marketYear} driver market`, path: '/driver-market' },
      ]),
      faqLd(marketFaq()),
    ],
  };
}
