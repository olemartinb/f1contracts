import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { data, getTeam, gridDrivers, lastName, type Driver } from '../data';
import { readableText } from '../color';

type SortMode = 'expiry' | 'team';

const START = data.nextSeason;
const LAST = Math.max(...gridDrivers.map((d) => d.contractEnd));
const YEARS = Array.from({ length: LAST - START + 1 }, (_, i) => START + i);
const COLS = YEARS.length + 1; // extra column for options beyond the last year

const teamOrder = new Map(data.teams.map((t, i) => [t.id, i]));

function sortDrivers(list: Driver[], mode: SortMode) {
  return [...list].sort((a, b) => {
    if (mode === 'team') {
      return (teamOrder.get(a.team)! - teamOrder.get(b.team)!) || b.contractEnd - a.contractEnd;
    }
    return (
      b.contractEnd - a.contractEnd ||
      Number(!!b.optionBeyond) - Number(!!a.optionBeyond) ||
      (teamOrder.get(a.team)! - teamOrder.get(b.team)!) ||
      lastName(a.name).localeCompare(lastName(b.name))
    );
  });
}

function Bar({ driver }: { driver: Driver }) {
  const team = getTeam(driver.team);
  const span = driver.contractEnd - START + 1;
  const width = (span / COLS) * 100;
  const optionWidth = driver.optionYear ? ((driver.optionYear - driver.contractEnd) / COLS) * 100 : 0;
  const fg = readableText(team.color);
  const unsigned = driver.status === 'unsigned';

  return (
    <div className="relative h-9 sm:h-10">
      <div
        className={[
          'absolute inset-y-0 left-0 flex items-center justify-end rounded-r-full pr-3 font-mono text-sm font-semibold tabular-nums',
          unsigned ? 'border-2 border-dashed bg-transparent' : '',
        ].join(' ')}
        style={{
          width: `${width}%`,
          borderColor: unsigned ? team.color : undefined,
          color: unsigned ? team.color : fg,
          background: unsigned
            ? undefined
            : driver.basis === 'reported'
              ? `linear-gradient(90deg, ${team.color} 0%, ${team.color} 78%, color-mix(in srgb, ${team.color} 55%, transparent) 100%)`
              : team.color,
        }}
      >
        {driver.contractEnd}
      </div>
      {driver.optionYear && (
        <div
          className="hatch absolute inset-y-1 rounded-r-full"
          style={{ left: `${width}%`, width: `${optionWidth}%`, ['--hatch' as string]: team.color }}
          title={`Option for ${driver.optionYear}`}
        >
          <span className="sr-only">Option for {driver.optionYear}</span>
        </div>
      )}
      {driver.optionBeyond && (
        <div
          className="absolute inset-y-2 rounded-r-full"
          style={{
            left: `${width}%`,
            width: `${(1 / COLS) * 100 * 0.8}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${team.color} 60%, transparent), transparent)`,
          }}
          title="Option to extend beyond"
        >
          <span className="sr-only">Option to extend beyond {driver.contractEnd}</span>
        </div>
      )}
    </div>
  );
}

function Row({ driver }: { driver: Driver }) {
  const team = getTeam(driver.team);
  return (
    <li className="group grid grid-cols-1 gap-x-6 gap-y-2 border-t border-line py-4 sm:grid-cols-[15rem_1fr] sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: team.color }} aria-hidden />
        <span className="w-8 shrink-0 text-right font-mono text-sm text-muted tabular-nums">
          {driver.number ?? '—'}
        </span>
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-x-2 truncate font-display text-base font-semibold leading-tight">
            {driver.name}
            {driver.rookie && <Badge tone="new">Rookie</Badge>}
            {driver.status === 'unsigned' && <Badge tone="warn">Unsigned</Badge>}
          </h3>
          <p className="text-sm text-muted">{team.name}</p>
        </div>
      </div>

      <div className="min-w-0">
        <Bar driver={driver} />
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {driver.basis === 'reported' && <span className="mr-1.5 text-soft">Reported.</span>}
          {driver.note}{' '}
          <a
            href={driver.source.url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-0.5 whitespace-nowrap text-soft underline decoration-line underline-offset-2 hover:text-white hover:decoration-accent"
          >
            {driver.source.label}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </p>
      </div>
    </li>
  );
}

export function Badge({ tone, children }: { tone: 'new' | 'warn'; children: React.ReactNode }) {
  const styles = tone === 'new' ? 'bg-sky-400/15 text-sky-300' : 'bg-amber-400/15 text-amber-300';
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}

export function Timeline() {
  const [mode, setMode] = useState<SortMode>('expiry');
  const [team, setTeam] = useState<string>('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = gridDrivers.filter(
      (d) =>
        (team === 'all' || d.team === team) &&
        (!q || d.name.toLowerCase().includes(q) || getTeam(d.team).name.toLowerCase().includes(q)),
    );
    return sortDrivers(filtered, mode);
  }, [mode, team, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex self-start rounded-lg border border-line bg-surface p-1" role="group" aria-label="Sort drivers">
          {(['expiry', 'team'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                mode === m ? 'bg-white text-ink' : 'text-muted hover:text-white'
              }`}
            >
              {m === 'expiry' ? 'By contract end' : 'By team'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block">
            <span className="sr-only">Filter by team</span>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full appearance-none rounded-lg border border-line bg-surface py-2 pl-3 pr-9 text-sm text-white focus:border-accent focus:outline-none sm:w-48"
            >
              <option value="all">All teams</option>
              {data.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
              ▾
            </span>
          </label>
          <label className="relative block">
            <span className="sr-only">Search drivers</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search driver or team"
              className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-8 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none sm:w-60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
        </div>
      </div>

      <Legend />

      <div className="mt-6">
        {/* Year header */}
        <div className="sticky top-14 z-10 grid grid-cols-1 bg-ink/90 py-2 backdrop-blur sm:grid-cols-[15rem_1fr] sm:gap-x-6">
          <div className="hidden text-xs font-medium uppercase tracking-wider text-muted sm:block">Driver</div>
          <div className="grid font-mono text-xs text-muted" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {YEARS.map((y) => (
              <div key={y} className="border-l border-line pl-1.5">
                {y}
              </div>
            ))}
            <div className="border-l border-line pl-1.5">{LAST + 1}+</div>
          </div>
        </div>

        <ul className="relative border-b border-line">
          {rows.map((d) => (
            <Row key={d.id} driver={d} />
          ))}
        </ul>
        {rows.length === 0 && <p className="py-10 text-center text-muted">No drivers match “{query}”.</p>}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
      <li className="flex items-center gap-2">
        <span className="h-3 w-8 rounded-r-full bg-soft" aria-hidden /> End date confirmed
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-8 rounded-r-full" style={{ background: 'linear-gradient(90deg, #C9C9D1 70%, rgba(201,201,209,.4))' }} aria-hidden />
        Length reported, not official
      </li>
      <li className="flex items-center gap-2">
        <span className="hatch h-3 w-8 rounded-r-full" style={{ ['--hatch' as string]: '#C9C9D1' }} aria-hidden /> Option year
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-8 rounded-r-full border-2 border-dashed border-soft" aria-hidden /> Confirmed by team, not yet signed
      </li>
    </ul>
  );
}
