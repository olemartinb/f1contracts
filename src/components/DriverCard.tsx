import { ChevronRight } from 'lucide-react';
import { driverPath, getTeam, type Driver } from '../data';
import { href, t } from '../i18n';
import { Flag, Meter } from './Grid';
import { cellsFor } from './cells';
import { textColor } from '../color';

/** A linked row for one driver: number, name, team, season bar and contract end. */
export function DriverCard({ driver, showTeam = true }: { driver: Driver; showTeam?: boolean }) {
  const team = getTeam(driver.team);
  const tr = t();
  const label = tr.endLabel(driver);
  return (
    <a
      href={href(driverPath(driver))}
      className="group relative block border-2 border-line bg-tar2 p-4 transition hover:border-paint sm:p-5"
    >
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: team.color }} aria-hidden />
      <span className="flex items-center gap-3">
        <span
          className="w-10 shrink-0 text-right font-cond text-3xl font-black italic leading-none tabular-nums"
          style={{ color: textColor(team.color) }}
        >
          {driver.number ?? '?'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="break-words font-cond text-xl font-extrabold uppercase leading-tight">{driver.name}</span>
            {driver.rookie && <Flag>{tr.rookie}</Flag>}
            {driver.status === 'unsigned' && <Flag>{tr.unsigned}</Flag>}
          </span>
          {showTeam && <span className="block text-sm text-muted">{team.name}</span>}
        </span>
        <span className="shrink-0 text-right">
          <span className="block font-body text-[10px] font-semibold uppercase tracking-widest text-muted">{label}</span>
          <span className="block font-cond text-2xl font-black italic leading-none tabular-nums">
            {driver.contractEnd}
            {(driver.optionYear || driver.optionBeyond) && <span className="text-flag">+</span>}
          </span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-paint" aria-hidden />
      </span>
      {driver.status !== 'leaving' && (
        <span className="mt-3 block">
          <Meter cells={cellsFor(driver)} color={team.color} />
        </span>
      )}
    </a>
  );
}
