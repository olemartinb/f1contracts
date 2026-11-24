import { data, gridDrivers, type Driver } from '../data';

const START = data.nextSeason;
const LAST = Math.max(...gridDrivers.map((d) => d.contractEnd));
export const YEARS = Array.from({ length: LAST - START + 1 }, (_, i) => START + i);

export type Cell = 'signed' | 'option' | 'pending' | 'empty';

/** One cell per season from next season to the longest deal, plus a "+" cell. */
export function cellsFor(d: Driver): Cell[] {
  const years: Cell[] = YEARS.map((y) =>
    y <= d.contractEnd ? (d.status === 'unsigned' ? 'pending' : 'signed') : d.optionYear && y <= d.optionYear ? 'option' : 'empty',
  );
  return [...years, d.optionBeyond ? 'option' : 'empty'];
}

