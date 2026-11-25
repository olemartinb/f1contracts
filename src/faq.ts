import { data, getTeam, gridDrivers, lastName, leavingDrivers, type Driver } from './data';
import { noteOf, t } from './i18n';

export interface FaqItem {
  q: string;
  a: string;
}

const byId = (id: string) => {
  const d = data.drivers.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown driver ${id}`);
  return d;
};

/** "When does X's contract end?" with the reported caveat and the note. */
export function whenEnds(d: Driver): FaqItem {
  const tr = t();
  const a = [tr.faq.whenEndsA(d.name, getTeam(d.team).name, tr.contractPhrase(d))];
  if (d.basis === 'reported') a.push(tr.faq.reportedNote);
  a.push(noteOf(d));
  return { q: tr.faq.whenEndsQ(d.name), a: a.join(' ') };
}

/** Questions on the home page, in the current language. */
export function homeFaq(): FaqItem[] {
  const tr = t();
  const f = tr.faq;
  const next = data.nextSeason;
  const ending = gridDrivers.filter((d) => d.contractEnd === next && !d.optionBeyond).map((d) => d.name);
  const unsigned = gridDrivers.filter((d) => d.status === 'unsigned');
  const rookies = gridDrivers.filter((d) => d.rookie);
  const max = Math.max(...gridDrivers.map((d) => d.contractEnd));
  const longest = gridDrivers.filter((d) => d.contractEnd === max).map((d) => `${lastName(d.name)} (${getTeam(d.team).name})`);
  const withTeam = (ds: Driver[]) => tr.list(ds.map((d) => `${d.name} (${getTeam(d.team).name})`));

  return [
    { q: f.outAfterQ(next), a: f.outAfterA(ending.length, next, tr.list(ending)) },
    {
      q: f.completeQ(next),
      a: unsigned.length ? f.completeUnsigned(next, withTeam(unsigned), unsigned.length) : f.completeYes(gridDrivers.length, next),
    },
    {
      q: f.leavingQ(data.currentSeason),
      a: leavingDrivers.length
        ? [
            `${withTeam(leavingDrivers)}.`,
            ...leavingDrivers.map(noteOf),
            rookies.length ? f.rookiesJoin(tr.list(rookies.map((d) => d.name)), rookies.length) : '',
          ]
            .filter(Boolean)
            .join(' ')
        : f.noLeaving(data.currentSeason),
    },
    ...['max-verstappen', 'lewis-hamilton', 'lando-norris', 'charles-leclerc', 'kimi-antonelli', 'george-russell', 'fernando-alonso', 'oscar-piastri'].map(
      (id) => whenEnds(byId(id)),
    ),
    { q: f.longestQ, a: f.longestA(tr.list(longest), longest.length, max) },
    { q: f.sourceQ, a: f.sourceA },
  ];
}
