import changesRaw from './changes.json';
import raw from './f1data.json';

export type Basis = 'official' | 'reported';
export type Status = 'signed' | 'unsigned' | 'leaving';

export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Driver {
  id: string;
  name: string;
  number: number | null;
  nationality: string;
  team: string;
  contractEnd: number;
  optionYear?: number;
  optionBeyond?: boolean;
  basis: Basis;
  status: Status;
  rookie?: boolean;
  note: string;
  source: { label: string; url: string };
}

export interface Data {
  updated: string;
  currentSeason: number;
  nextSeason: number;
  teams: Team[];
  drivers: Driver[];
}

export const data = raw as Data;

export const teamById = new Map(data.teams.map((t) => [t.id, t]));

export const getTeam = (id: string): Team => {
  const team = teamById.get(id);
  if (!team) throw new Error(`Unknown team "${id}" in f1data.json`);
  return team;
};

/** Drivers racing in the upcoming season (excludes those leaving). */
export const gridDrivers = data.drivers.filter((d) => d.status !== 'leaving');
export const leavingDrivers = data.drivers.filter((d) => d.status === 'leaving');

export const formatUpdated = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const lastName = (name: string) => name.split(' ').slice(-1)[0];

export const driverById = new Map(data.drivers.map((d) => [d.id, d]));

export const getDriver = (id: string): Driver => {
  const driver = driverById.get(id);
  if (!driver) throw new Error(`Unknown driver "${id}"`);
  return driver;
};

/** Next-season drivers of a team, followed by anyone leaving it. */
export const teamDrivers = (teamId: string) => [
  ...gridDrivers.filter((d) => d.team === teamId),
  ...leavingDrivers.filter((d) => d.team === teamId),
];

export const driverPath = (d: Driver) => `/drivers/${d.id}`;
export const teamPath = (t: Team) => `/teams/${t.id}`;

/** "until the end of the 2027 season", optionally followed by ", with an option for 2028". */
export function contractPhrase(d: Driver) {
  if (d.status === 'leaving') return `leaving after ${d.contractEnd}`;
  const base = `until ${d.optionBeyond ? 'at least ' : ''}the end of the ${d.contractEnd} season`;
  if (d.optionYear) return `${base}, with an option for ${d.optionYear}`;
  if (d.optionBeyond) return `${base}, with an option to extend`;
  return base;
}

/** Short form for titles: "until 2027 (2028 option)". */
export function contractShort(d: Driver) {
  if (d.status === 'leaving') return `leaving after ${d.contractEnd}`;
  if (d.status === 'unsigned') return `${d.contractEnd} deal not yet signed`;
  if (d.optionYear) return `until ${d.contractEnd} (${d.optionYear} option)`;
  if (d.optionBeyond) return `until ${d.contractEnd}+`;
  return `until ${d.contractEnd}`;
}


export interface Change {
  date: string; // YYYY-MM-DD, or YYYY-MM when only the month is known
  driver?: string;
  team?: string;
  text: string;
  source: { label: string; url: string };
}

export const changes = [...(changesRaw.entries as Change[])].sort((a, b) => b.date.localeCompare(a.date));

export function formatChangeDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d ?? 1, 12));
  return dt.toLocaleDateString('en-GB', { ...(d ? { day: 'numeric' } : {}), month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export const changesFor = (driverId: string) =>
  changes.filter((c) => c.driver === driverId || (c.team && c.team === driverById.get(driverId)?.team && c.text.includes(lastName(driverById.get(driverId)!.name))));
