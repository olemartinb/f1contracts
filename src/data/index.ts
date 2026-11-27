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
  /** Date this entry was last changed or re-checked (YYYY-MM-DD). */
  updated?: string;
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



export interface Change {
  date: string; // YYYY-MM-DD, or YYYY-MM when only the month is known
  driver?: string;
  team?: string;
  text: string;
  source: { label: string; url: string };
}

export const changes = [...(changesRaw.entries as Change[])].sort((a, b) => b.date.localeCompare(a.date));


export const changesFor = (driverId: string) =>
  changes.filter((c) => c.driver === driverId || (c.team && c.team === driverById.get(driverId)?.team && c.text.includes(lastName(driverById.get(driverId)!.name))));

/** When a driver's entry was last updated, falling back to the data file's date. */
export const driverUpdated = (d: Driver) => d.updated ?? data.updated;
