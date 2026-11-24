import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import Privacy from './Privacy';
import DriverPage from './pages/DriverPage';
import { ChangesPage, DriversIndex, TeamPage, TeamsIndex } from './pages/OtherPages';
import { adsense } from './config';
import { data } from './data';
import {
  changesMeta,
  driverMeta,
  driversIndexMeta,
  homeMeta,
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
    { ...changesMeta(site), html: html(<ChangesPage />), hydrate: false },
    { ...privacyMeta(), html: html(<Privacy />), hydrate: false },
  ];
}
