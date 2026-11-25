import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import Privacy from './Privacy';
import DriverPage from './pages/DriverPage';
import { ChangesPage, DriversIndex, TeamPage, TeamsIndex } from './pages/OtherPages';
import MarketPage from './pages/MarketPage';
import { GridPage, OutOfContractPage } from './pages/GridPages';
import { adsense } from './config';
import { changes, data, driverById, driverPath, teamById, teamPath } from './data';
import { href, LANGS, missingTranslations, setLang, setPath, t, type Lang } from './i18n';
import {
  changesMeta,
  driverMeta,
  driversIndexMeta,
  gridMeta,
  homeMeta,
  marketMeta,
  oocMeta,
  privacyMeta,
  teamMeta,
  teamsIndexMeta,
  YEARS_OUT,
  type PageMeta,
} from './seo';

export { adsense, LANGS };

export interface RenderedPage extends PageMeta {
  lang: Lang;
  /** Final URL path including the language prefix. */
  url: string;
  html: string;
  /** Only the home page is interactive; the rest ship as plain HTML. */
  hydrate: boolean;
  /** English paths of translated versions (all languages), or none for English-only pages. */
  translated: boolean;
}

const html = (node: React.ReactNode) => renderToString(<StrictMode>{node}</StrictMode>);

type PageDef = { meta: (site: string) => PageMeta; node: () => React.ReactNode; hydrate?: boolean };

function pageDefs(): PageDef[] {
  return [
    { meta: homeMeta, node: () => <App />, hydrate: true },
    ...data.drivers.map((d) => ({ meta: (s: string) => driverMeta(s, d), node: () => <DriverPage driver={d} /> })),
    ...data.teams.map((tm) => ({ meta: (s: string) => teamMeta(s, tm), node: () => <TeamPage team={tm} /> })),
    { meta: driversIndexMeta, node: () => <DriversIndex /> },
    { meta: teamsIndexMeta, node: () => <TeamsIndex /> },
    { meta: marketMeta, node: () => <MarketPage /> },
    { meta: gridMeta, node: () => <GridPage /> },
    ...YEARS_OUT.map((y) => ({ meta: (s: string) => oocMeta(s, y), node: () => <OutOfContractPage year={y} /> })),
    { meta: changesMeta, node: () => <ChangesPage /> },
  ];
}

function renderIn(lang: Lang, def: PageDef, site: string, translated: boolean): RenderedPage {
  setLang(lang);
  const meta = def.meta(site);
  // The language switcher links to this page in each language; English-only pages link to each language's home page.
  setPath(translated ? meta.path : '/');
  return { ...meta, lang, url: href(meta.path), html: html(def.node()), hydrate: !!def.hydrate, translated };
}

export function pages(site: string): RenderedPage[] {
  const out: RenderedPage[] = [];
  for (const l of LANGS) for (const def of pageDefs()) out.push(renderIn(l.code, def, site, true));
  out.push(renderIn('en', { meta: () => privacyMeta(), node: () => <Privacy /> }, site, false));
  setLang('en');
  return out;
}

export const htmlLang = (lang: Lang) => {
  setLang(lang);
  const locale = t().locale;
  setLang('en');
  return locale;
};

export const missing = () => missingTranslations(data.drivers, changes);

/** Items for the /changes.xml RSS feed (English), newest first. */
export function feedItems(site: string) {
  return changes.slice(0, 50).map((c) => {
    const driver = c.driver ? driverById.get(c.driver) : undefined;
    const team = c.team ? teamById.get(c.team) : undefined;
    const path = driver ? driverPath(driver) : team ? teamPath(team) : '/changes';
    const [y, m, d] = c.date.split('-').map(Number);
    return {
      title: c.text,
      link: `${site}${path}`,
      guid: `${site}/changes#${c.date}-${c.driver ?? c.team ?? 'news'}`,
      pubDate: new Date(Date.UTC(y, m - 1, d ?? 1, 12)).toUTCString(),
      description: `${c.text} Source: ${c.source.label} (${c.source.url})`,
    };
  });
}
