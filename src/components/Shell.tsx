import { ChevronRight } from 'lucide-react';
import { data, teamPath } from '../data';
import { formatDate, href, LANGS, lang, pagePath, t } from '../i18n';
import { YEARS_OUT } from './cells';

export function Logo() {
  return (
    <a href={href('/')} className="font-cond text-xl font-black uppercase italic tracking-tight sm:text-2xl">
      F1<span className="px-0.5 text-flag">/</span>Contracts
    </a>
  );
}

export function SiteHeader() {
  const n = t().nav;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-tar/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex gap-3.5 text-sm font-semibold text-muted sm:gap-6">
          <a className="hover:text-paint" href={href('/grid')}>
            {n.grid}
          </a>
          <a className="hover:text-paint" href={href('/driver-market')}>
            {n.market}
          </a>
          <a className="hidden hover:text-paint min-[400px]:inline" href={href('/teams')}>
            {n.teams}
          </a>
          <a className="hover:text-paint" href={href('/changes')}>
            {n.changes}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function LanguageSwitcher() {
  const here = pagePath();
  return (
    <nav aria-label={t().footer.language}>
      <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-paint">{t().footer.language}</p>
      <ul className="flex flex-wrap gap-2">
        {LANGS.map((l) => (
          <li key={l.code}>
            <a
              href={href(here, l.code)}
              hrefLang={l.code}
              lang={l.code}
              aria-current={l.code === lang() ? 'true' : undefined}
              className={`inline-block border-2 px-2.5 py-1 text-sm font-semibold ${
                l.code === lang() ? 'border-paint text-paint' : 'border-line hover:border-paint hover:text-paint'
              }`}
            >
              {l.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const f = t().footer;
  return (
    <footer className="start-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-muted sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-md leading-relaxed">{f.disclaimer(formatDate(data.updated))}</p>
          </div>
          <LanguageSwitcher />
        </div>
        <nav aria-label={f.teams}>
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-paint">{f.teams}</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-1">
            {data.teams.map((team) => (
              <li key={team.id}>
                <a className="hover:text-paint" href={href(teamPath(team))}>
                  {team.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={f.site}>
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-paint">{f.site}</p>
          <ul className="space-y-1.5">
            <li><a className="hover:text-paint" href={href('/grid')}>{f.grid(data.nextSeason)}</a></li>
            <li><a className="hover:text-paint" href={href('/driver-market')}>{f.market(data.nextSeason + 1)}</a></li>
            <li>
              {f.outOfContract}:{' '}
              {YEARS_OUT.map((y, i) => (
                <span key={y}>
                  {i > 0 && ' · '}
                  <a className="hover:text-paint" href={href(`/out-of-contract/${y}`)}>{y}</a>
                </span>
              ))}
            </li>
            <li><a className="hover:text-paint" href={href('/drivers')}>{f.allDrivers}</a></li>
            <li><a className="hover:text-paint" href={href('/teams')}>{f.allTeams}</a></li>
            <li><a className="hover:text-paint" href={href('/changes')}>{f.changes}</a></li>
            <li><a className="hover:text-paint" href="/changes.xml">{f.rss}</a></li>
            <li><a className="hover:text-paint" href={href('/#faq')}>{f.faq}</a></li>
            <li><a className="hover:text-paint" href="/privacy">{f.privacy}</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {i < items.length - 1 ? (
              <a className="hover:text-paint" href={href(c.href)}>
                {c.name}
              </a>
            ) : (
              <span aria-current="page" className="text-paint">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Layout for every page except the home page. Crumb hrefs are English paths; they get the language prefix here. */
export function Page({ crumbs, children }: { crumbs?: Crumb[]; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-tar text-paint antialiased">
      <SiteHeader />
      <main className="tarmac">
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
          {crumbs && <Breadcrumbs items={crumbs} />}
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-flag">{children}</p>;
}

export function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-4 mt-14 font-cond text-3xl font-black uppercase italic leading-none sm:text-4xl">
      {children}
    </h2>
  );
}

export function PageTitle({ main, outline }: { main: React.ReactNode; outline: React.ReactNode }) {
  return (
    <h1 className="text-balance break-words font-cond text-5xl font-black uppercase italic leading-[0.88] tracking-tight sm:text-7xl">
      {main}
      <span className="outline-text block">{outline}</span>
    </h1>
  );
}
