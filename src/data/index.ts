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
