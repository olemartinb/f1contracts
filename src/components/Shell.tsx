import { ChevronRight } from 'lucide-react';
import { data, formatUpdated, teamPath } from '../data';

export function Logo() {
  return (
    <a href="/" className="font-cond text-xl font-black uppercase italic tracking-tight sm:text-2xl">
      F1<span className="px-0.5 text-flag">/</span>Contracts
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-tar/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex gap-4 text-sm font-semibold text-muted sm:gap-6">
          <a className="hover:text-paint" href="/#grid">
            Grid
          </a>
          <a className="hover:text-paint" href="/driver-market">
            Market
          </a>
          <a className="hover:text-paint" href="/teams">
            Teams
          </a>
          <a className="hover:text-paint" href="/changes">
            Changes
          </a>
          <a className="hidden hover:text-paint sm:inline" href="/#faq">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="start-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-muted sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-md leading-relaxed">
            Unofficial fan site, not affiliated with Formula&nbsp;1, the FIA or any team. Contract details change; every entry
            links to its source. Last checked {formatUpdated(data.updated)}.
          </p>
        </div>
        <nav aria-label="Teams">
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-paint">Teams</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-1">
            {data.teams.map((t) => (
              <li key={t.id}>
                <a className="hover:text-paint" href={teamPath(t)}>
                  {t.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Site">
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-paint">Site</p>
          <ul className="space-y-1.5">
            <li><a className="hover:text-paint" href="/#grid">The {data.nextSeason} grid</a></li>
            <li><a className="hover:text-paint" href="/drivers">All drivers</a></li>
            <li><a className="hover:text-paint" href="/teams">All teams</a></li>
            <li><a className="hover:text-paint" href="/driver-market">{data.nextSeason + 1} driver market</a></li>
            <li><a className="hover:text-paint" href="/changes">Latest changes</a></li>
            <li><a className="hover:text-paint" href="/changes.xml">RSS feed</a></li>
            <li><a className="hover:text-paint" href="/#faq">FAQ</a></li>
            <li><a className="hover:text-paint" href="/privacy">Privacy</a></li>
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
              <a className="hover:text-paint" href={c.href}>
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

/** Layout for every page except the home page. */
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
