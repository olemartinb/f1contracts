import { data, getTeam, gridDrivers, leavingDrivers, lastName } from './data';

export interface FaqItem {
  q: string;
  a: string;
}

const byId = (id: string) => {
  const d = data.drivers.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown driver ${id}`);
  return d;
};

const list = (names: string[]) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

const driverQuestion = (id: string): FaqItem => {
  const d = byId(id);
  const team = getTeam(d.team).name;
  const option = d.optionYear ? ` There is a reported option for ${d.optionYear}.` : '';
  const beyond = d.optionBeyond ? ' The deal includes an option to extend beyond that.' : '';
  const basis = d.basis === 'reported' ? ' The exact length has not been officially confirmed, so this is based on media reports.' : '';
  return {
    q: `When does ${d.name}'s contract end?`,
    a: `${d.name} is under contract with ${team} until the end of the ${d.contractEnd} season.${option}${beyond}${basis} ${d.note}`,
  };
};

const ending = (year: number) =>
  gridDrivers.filter((d) => d.contractEnd === year && !d.optionBeyond).map((d) => d.name);

const unsigned = gridDrivers.filter((d) => d.status === 'unsigned');
const rookies = gridDrivers.filter((d) => d.rookie);

export const faq: FaqItem[] = [
  {
    q: `Which F1 drivers are out of contract after ${data.nextSeason}?`,
    a: `${ending(data.nextSeason).length} drivers have deals that end after the ${data.nextSeason} season: ${list(ending(data.nextSeason))}. Some of these deals include options held by the team or the driver.`,
  },
  {
    q: `Is the ${data.nextSeason} F1 grid complete?`,
    a: unsigned.length
      ? `Every ${data.nextSeason} seat has a named driver. ${list(unsigned.map((d) => `${d.name} (${getTeam(d.team).name})`))} ${unsigned.length === 1 ? 'has' : 'have'} been confirmed by the team but not yet signed.`
      : `Yes. All ${gridDrivers.length} seats for ${data.nextSeason} are signed.`,
  },
  {
    q: `Who is leaving F1 after the ${data.currentSeason} season?`,
    a: leavingDrivers.length
      ? `${list(leavingDrivers.map((d) => `${d.name} (${getTeam(d.team).name})`))}. ${leavingDrivers.map((d) => d.note).join(' ')}${rookies.length ? ` ${list(rookies.map((d) => d.name))} joins the grid as a rookie.` : ''}`
      : `No driver has confirmed an exit after the ${data.currentSeason} season.`,
  },
  driverQuestion('max-verstappen'),
  driverQuestion('lewis-hamilton'),
  driverQuestion('lando-norris'),
  driverQuestion('charles-leclerc'),
  driverQuestion('kimi-antonelli'),
  driverQuestion('george-russell'),
  driverQuestion('fernando-alonso'),
  driverQuestion('oscar-piastri'),
  {
    q: 'Who has the longest contract in F1?',
    a: (() => {
      const max = Math.max(...gridDrivers.map((d) => d.contractEnd));
      const names = gridDrivers.filter((d) => d.contractEnd === max).map((d) => `${lastName(d.name)} (${getTeam(d.team).name})`);
      return `${list(names)} ${names.length === 1 ? 'is' : 'are'} signed until the end of ${max}, the longest deals on the grid.`;
    })(),
  },
  {
    q: 'Where does this contract information come from?',
    a: 'Each entry links to its source: team announcements where they exist, otherwise reporting from major F1 outlets. Teams often do not publish contract lengths, so entries marked "reported" are the best public information, not confirmed terms. This site is not affiliated with Formula 1 or any team.',
  },
];
