import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import Privacy from './Privacy';
import { adsense } from './config';
import { data, getTeam, gridDrivers } from './data';
import { faq } from './faq';

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export function renderPrivacy() {
  return renderToString(
    <StrictMode>
      <Privacy />
    </StrictMode>,
  );
}

export { adsense };

export function structuredData(siteUrl: string | undefined) {
  const url = siteUrl ? `${siteUrl}/` : undefined;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `F1 Driver Contracts ${data.nextSeason}`,
      description: `When every Formula 1 driver's contract expires, for the ${data.nextSeason} season and beyond.`,
      ...(url && { url }),
      dateModified: data.updated,
      inLanguage: 'en',
      mainEntity: {
        '@type': 'ItemList',
        name: `F1 driver contracts for ${data.nextSeason}`,
        numberOfItems: gridDrivers.length,
        itemListElement: gridDrivers.map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Person',
            name: d.name,
            jobTitle: 'Formula 1 driver',
            memberOf: { '@type': 'SportsTeam', name: getTeam(d.team).name, sport: 'Formula 1' },
            description: `Contract ends after the ${d.contractEnd} season.`,
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}

export const meta = {
  updated: data.updated,
  nextSeason: data.nextSeason,
};
