import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import Privacy from './Privacy';
import DriverPage from './pages/DriverPage';
import { ChangesPage, DriversIndex, TeamPage, TeamsIndex } from './pages/OtherPages';
import MarketPage from './pages/MarketPage';
import { adsense } from './config';
import { changes, data, driverById, driverPath, teamById, teamPath } from './data';
import {
  changesMeta,
  driverMeta,
  driversIndexMeta,
  homeMeta,
  marketMeta,
  privacyMeta,
  teamMeta,
  teamsIndexMeta,
  type PageMeta,
} from './seo';

export { adsense };

export interface RenderedPage extends PageMeta {
  html: string;
  /** Only the home page is interactive; the rest ship as plain HTML. */
  hydrate: boolean;
}

const html = (node: React.ReactNode) => renderToString(<StrictMode>{node}</StrictMode>);

export function pages(site: string): RenderedPage[] {
  return [
    { ...homeMeta(site), html: html(<App />), hydrate: true },
    ...data.drivers.map((d) => ({ ...driverMeta(site, d), html: html(<DriverPage driver={d} />), hydrate: false })),
    ...data.teams.map((t) => ({ ...teamMeta(site, t), html: html(<TeamPage team={t} />), hydrate: false })),
    { ...driversIndexMeta(site), html: html(<DriversIndex />), hydrate: false },
    { ...teamsIndexMeta(site), html: html(<TeamsIndex />), hydrate: false },
    { ...marketMeta(site), html: html(<MarketPage />), hydrate: false },
    { ...changesMeta(site), html: html(<ChangesPage />), hydrate: false },
    { ...privacyMeta(), html: html(<Privacy />), hydrate: false },
  ];
}

/** Items for the /changes.xml RSS feed, newest first. */
export function feedItems(site: string) {
  return changes.slice(0, 50).map((c) => {
    const driver = c.driver ? driverById.get(c.driver) : undefined;
    const team = c.team ? teamById.get(c.team) : undefined;
    const path = driver ? driverPath(driver) : team ? teamPath(team) : '/changes';
    const [y, m, d] = c.date.split('-').map(Number);
    return {
      title: c.text,
      link: `${site}${path}`,
      guid: `${site}/changes#${c.date}-${(c.driver ?? c.team ?? 'news')}`,
      pubDate: new Date(Date.UTC(y, m - 1, d ?? 1, 12)).toUTCString(),
      description: `${c.text} Source: ${c.source.label} (${c.source.url})`,
    };
  });
}
