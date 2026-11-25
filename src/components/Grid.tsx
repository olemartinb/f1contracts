import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { data, driverPath, getTeam, gridDrivers, lastName, type Driver } from '../data';
import { href, noteOf, t } from '../i18n';
import { cellsFor, YEARS, type Cell } from './cells';
import { textColor } from '../color';

type SortMode = 'contract' | 'team';


const teamOrder = new Map(data.teams.map((t, i) => [t.id, i]));

function sortDrivers(list: Driver[], mode: SortMode) {
  return [...list].sort((a, b) => {
    if (mode === 'team') {
      return teamOrder.get(a.team)! - teamOrder.get(b.team)! || b.contractEnd - a.contractEnd;
    }
    return (
      b.contractEnd - a.contractEnd ||
      Number(!!b.optionBeyond) - Number(!!a.optionBeyond) ||
      Number(!!b.optionYear) - Number(!!a.optionYear) ||
      Number(a.basis === 'reported') - Number(b.basis === 'reported') ||
      teamOrder.get(a.team)! - teamOrder.get(b.team)! ||
      lastName(a.name).localeCompare(lastName(b.name))
    );
  });
}

/** Segmented bar: one cell per season from next season to the longest deal, plus a "+" cell. */
export function Meter({ cells, color, labels = true }: { cells: Cell[]; color: string; labels?: boolean }) {
  return (
    <div>
      <div className="flex gap-[3px]" aria-hidden>
        {cells.map((c, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 -skew-x-[20deg] rounded-[1px] ${c === 'option' ? 'hatch' : ''}`}
            style={{
              ['--hatch' as string]: color,
              background: c === 'signed' ? color : c === 'empty' ? 'rgba(244,244,240,.09)' : undefined,
              border: c === 'pending' ? `1.5px dashed ${color}` : undefined,
            }}
          />
        ))}
      </div>
      {labels && (
        <div className="mt-1 flex gap-[3px] font-cond text-[10px] font-semibold tabular-nums text-muted" aria-hidden>
          {YEARS.map((y) => (
            <span key={y} className="flex-1">
              {String(y).slice(2)}
            </span>
          ))}
          <span className="flex-1">+</span>
        </div>
      )}
    </div>
  );
}

export function Flag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-flag px-1.5 py-px align-middle font-body text-[10px] font-bold uppercase not-italic leading-tight tracking-wider text-tar">
      {children}
    </span>
  );
}

function Slot({
  driver,
  position,
  showPosition,
  open,
  onToggle,
}: {
  driver: Driver;
  position: number;
  showPosition: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const team = getTeam(driver.team);
  const panelId = `slot-${driver.id}`;
  const tr = t();
  const endLabel = tr.endLabel(driver);
  const endYear = (
    <>
      {driver.contractEnd}
      {(driver.optionYear || driver.optionBeyond) && <span className="text-flag">+</span>}
    </>
  );
  const flags = (
    <>
      {driver.rookie && <Flag>{tr.rookie}</Flag>}
      {driver.status === 'unsigned' && <Flag>{tr.unsigned}</Flag>}
    </>
  );
  return (
    <li className={`slot ${open ? 'z-30' : 'z-0'}`} data-slot={driver.id}>
      <details open={open}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          aria-controls={panelId}
          className="box block cursor-pointer select-none"
        >
          <span className="absolute inset-x-0 top-0 h-1" style={{ background: team.color }} aria-hidden />
          {showPosition && (
            <span className="absolute -left-[3px] -top-[3px] bg-paint px-1.5 py-0.5 font-cond text-xs font-extrabold text-tar">
              P{position}
            </span>
          )}

          <span className="flex items-center gap-2 pt-4 sm:gap-3">
            <span
              className="min-w-[2.1ch] text-right font-cond text-[26px] font-black italic leading-none tabular-nums sm:text-4xl"
              style={{ color: textColor(team.color) }}
            >
              {driver.number ?? '?'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-cond text-[15px] font-extrabold uppercase leading-tight sm:text-xl">
                <span className="hidden sm:inline">{driver.name.split(' ').slice(0, -1).join(' ')} </span>
                {lastName(driver.name)}
              </span>
              <span className="block truncate text-xs text-muted sm:text-sm">{team.name}</span>
            </span>
            <span className="hidden shrink-0 text-right sm:block">
              <span className="block font-body text-[10px] font-semibold uppercase tracking-widest text-muted">{endLabel}</span>
              <span className="block font-cond text-3xl font-black italic leading-none tabular-nums">{endYear}</span>
            </span>
          </span>

          <span className="mt-3 block">
            <Meter cells={cellsFor(driver)} color={team.color} />
          </span>

          <span className="mt-2 flex items-end justify-between gap-2">
            {/* Phones: end year sits here so the name gets the full width above. */}
            <span className="min-w-0 sm:hidden">
              <span className="block font-body text-[9px] font-semibold uppercase tracking-widest text-muted">{endLabel}</span>
              <span className="block font-cond text-xl font-black italic leading-none tabular-nums">{endYear}</span>
            </span>
            <span className="flex flex-wrap gap-1 max-sm:hidden">{flags}</span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <span className="hidden sm:inline">{tr.details}</span>
              <ChevronDown className={`h-4 w-4 transition sm:h-3.5 sm:w-3.5 ${open ? 'rotate-180' : ''}`} aria-hidden />
            </span>
          </span>
          {(driver.rookie || driver.status === 'unsigned') && <span className="mt-2 flex flex-wrap gap-1 sm:hidden">{flags}</span>}
          <span className="sr-only">{tr.contractSummary(driver)}</span>
        </summary>

        <div id={panelId} className="pop">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-cond text-2xl font-black uppercase italic leading-none">{driver.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {team.name}
                {driver.number ? ` · #${driver.number}` : ''} · {tr.contractSummary(driver)}.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="-mr-1 -mt-1 shrink-0 p-1 text-muted hover:text-paint"
              aria-label={tr.closeDetails(driver.name)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 leading-relaxed">{noteOf(driver)}</p>
          <a
            href={driver.source.url}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-flag underline-offset-4 hover:underline"
          >
            {tr.source}: {driver.source.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={href(driverPath(driver))}
            className="mt-3 ml-4 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
          >
            {tr.fullPage}
          </a>
        </div>
      </details>
    </li>
  );
}

export function Grid() {
  const [mode, setMode] = useState<SortMode>('contract');
  const [team, setTeam] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const g = t().gridUi;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortDrivers(
      gridDrivers.filter(
        (d) =>
          (team === 'all' || d.team === team) &&
          (!q || d.name.toLowerCase().includes(q) || getTeam(d.team).name.toLowerCase().includes(q)),
      ),
      mode,
    );
  }, [mode, team, query]);

  // Close the open slot on Escape or a tap outside it.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null);
    const onDown = (e: PointerEvent) => {
      const slot = (e.target as Element).closest?.('[data-slot]');
      if (!slot || slot.getAttribute('data-slot') !== openId) setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [openId]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex self-start border-2 border-line p-1" role="group" aria-label={g.order}>
          {(['contract', 'team'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-3 py-1.5 font-cond text-base font-extrabold uppercase italic tracking-wide transition ${
                mode === m ? 'bg-paint text-tar' : 'text-muted hover:text-paint'
              }`}
            >
              {m === 'contract' ? g.byContract : g.byTeam}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block">
            <span className="sr-only">{g.filterTeam}</span>
            <select
              id="team-filter"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full appearance-none border-2 border-line bg-tar2 py-2 pl-3 pr-9 text-sm text-paint focus:border-flag focus:outline-none sm:w-48"
            >
              <option value="all">{g.allTeams}</option>
              {data.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          </label>
          <label className="relative block">
            <span className="sr-only">{g.search}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id="driver-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={g.searchPlaceholder}
              className="w-full border-2 border-line bg-tar2 py-2 pl-9 pr-3 text-sm text-paint placeholder:text-muted focus:border-flag focus:outline-none sm:w-60"
            />
          </label>
        </div>
      </div>

      <Legend />

      <div className="start-line mt-8 pt-10">
        <ol className="grid-slots" aria-label={g.listLabel}>
          {rows.map((d, i) => (
            <Slot
              key={d.id}
              driver={d}
              position={i + 1}
              showPosition={mode === 'contract' && team === 'all' && !query}
              open={openId === d.id}
              onToggle={() => setOpenId((cur) => (cur === d.id ? null : d.id))}
            />
          ))}
        </ol>
        {rows.length === 0 && <p className="py-10 text-center text-muted">{g.noMatch(query)}</p>}
      </div>
    </div>
  );
}

function Legend() {
  const c = '#F4F4F0';
  const g = t().gridUi;
  return (
    <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-muted sm:flex sm:flex-wrap">
      <li className="flex items-center gap-2">
        <span className="w-12">
          <Meter cells={['signed', 'signed', 'empty']} color={c} labels={false} />
        </span>
        {g.legendContracted}
      </li>
      <li className="flex items-center gap-2">
        <span className="w-12">
          <Meter cells={['signed', 'option', 'empty']} color={c} labels={false} />
        </span>
        {g.legendOption}
      </li>
      <li className="flex items-center gap-2">
        <span className="w-12">
          <Meter cells={['pending', 'empty', 'empty']} color={c} labels={false} />
        </span>
        {g.legendUnsigned}
      </li>
      <li className="flex items-center gap-2">
        <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-paint">{g.legendReportedTag}</span>
        {g.legendReported}
      </li>
    </ul>
  );
}
