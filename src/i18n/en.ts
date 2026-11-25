import type { Driver } from '../data';

const list = (items: string[], and = 'and') =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;

const en = {
  locale: 'en-GB',
  list: (items: string[]) => list(items),

  // How a contract is described.
  contractPhrase: (d: Driver) => {
    if (d.status === 'leaving') return `leaving after ${d.contractEnd}`;
    const base = `until ${d.optionBeyond ? 'at least ' : ''}the end of the ${d.contractEnd} season`;
    if (d.optionYear) return `${base}, with an option for ${d.optionYear}`;
    if (d.optionBeyond) return `${base}, with an option to extend`;
    return base;
  },
  contractShort: (d: Driver) => {
    if (d.status === 'leaving') return `leaving after ${d.contractEnd}`;
    if (d.status === 'unsigned') return `${d.contractEnd} deal not yet signed`;
    if (d.optionYear) return `until ${d.contractEnd} (${d.optionYear} option)`;
    if (d.optionBeyond) return `until ${d.contractEnd}+`;
    return `until ${d.contractEnd}`;
  },
  contractSummary: (d: Driver) => {
    const parts = [`Contract ends after ${d.contractEnd}`];
    if (d.optionYear) parts.push(`option for ${d.optionYear}`);
    if (d.optionBeyond) parts.push('option to extend');
    if (d.status === 'unsigned') parts.push('confirmed by the team but not yet signed');
    if (d.basis === 'reported') parts.push('length reported, not official');
    return parts.join(', ');
  },
  endLabel: (d: Driver): string =>
    d.status === 'leaving' ? 'Leaving' : d.status === 'unsigned' ? 'Pending' : d.basis === 'reported' ? 'Reported' : 'Signed to',
  endLabelLong: (d: Driver): string =>
    d.status === 'leaving'
      ? 'Contract ends'
      : d.status === 'unsigned'
        ? 'Confirmed for'
        : d.basis === 'reported'
          ? 'Reported until'
          : 'Signed until',

  rookie: 'Rookie',
  unsigned: 'Unsigned',
  notYetSigned: 'Not yet signed',
  leaving: 'Leaving',
  tbc: 'TBC',
  withOption: 'with option',
  option: (y: number) => `Option ${y}`,
  source: 'Source',
  details: 'Details',
  closeDetails: (name: string) => `Close details for ${name}`,
  fullPage: 'Full contract page →',
  advertisement: 'Advertisement',

  nav: { grid: 'Grid', market: 'Market', teams: 'Teams', changes: 'Changes', faq: 'FAQ' },
  crumbs: {
    home: 'Home',
    drivers: 'Drivers',
    teams: 'Teams',
    changes: 'Changes',
    market: (y: number) => `${y} driver market`,
    grid: (y: number) => `${y} grid`,
    outOfContract: (y: number) => `Out of contract after ${y}`,
  },
  footer: {
    disclaimer: (date: string) =>
      `Unofficial fan site, not affiliated with Formula 1, the FIA or any team. Contract details change; every entry links to its source. Last checked ${date}.`,
    teams: 'Teams',
    site: 'Site',
    grid: (y: number) => `The ${y} grid`,
    allDrivers: 'All drivers',
    allTeams: 'All teams',
    market: (y: number) => `${y} driver market`,
    outOfContract: 'Out of contract by year',
    changes: 'Latest changes',
    rss: 'RSS feed',
    faq: 'FAQ',
    privacy: 'Privacy',
    language: 'Language',
  },

  gridUi: {
    order: 'Order the grid',
    byContract: 'By contract length',
    byTeam: 'By team',
    filterTeam: 'Filter by team',
    allTeams: 'All teams',
    search: 'Search drivers',
    searchPlaceholder: 'Search driver or team',
    listLabel: 'Drivers ordered on the grid',
    noMatch: (q: string) => `No drivers match “${q}”.`,
    legendContracted: 'Contracted seasons',
    legendOption: 'Option year',
    legendUnsigned: 'Not yet signed',
    legendReportedTag: 'Reported',
    legendReported: 'Length from media reports',
  },

  home: {
    skip: 'Skip to the grid',
    updated: 'Updated',
    h1: 'F1 driver contracts',
    h1b: (y: number) => `${y} and beyond`,
    lede: 'The whole Formula 1 grid, lined up by how long each driver is signed for. Longest deal on pole. Tap a driver for the details and the source.',
    statSigned: (y: number) => `${y} seats signed`,
    statOut: (y: number) => `Out of contract after ${y}`,
    statLongest: (names: string) => `Longest deals: ${names}`,
    statOfficial: 'End dates officially confirmed',
    gridEyebrow: 'The grid',
    gridTitle: (y: number) => `The ${y} grid, by contract`,
    gridLede: (y: number) =>
      `Each box shows the seasons a driver is signed for, from ${y} on. Teams often keep contract length private, so “Reported” means the end year comes from media reports.`,
    marketEyebrow: 'Next silly season',
    marketTitle: (n: number, y: number) => `${n} drivers out of contract after ${y}`,
    marketLede: (y: number) => `These deals end with the ${y} season, which makes the ${y + 1} driver market one of the biggest in years.`,
    marketLink: (y: number) => `See the full ${y} driver market →`,
    leavingAfter: (y: number) => `Leaving after ${y}`,
    latestEyebrow: 'Contract news',
    latestTitle: 'Latest changes',
    allChanges: 'All contract changes →',
    lineupsEyebrow: (y: number) => `${y} line-ups`,
    lineupsTitle: 'Team by team',
    lineupsLede: (n: number) => `All ${n} teams and their drivers for next season, with the year each contract ends.`,
    numbersNote: (y: number) => `Race numbers are from the ${y} season. A “+” means the deal includes an option.`,
    faqEyebrow: 'FAQ',
    faqTitle: 'Contract questions',
  },

  faq: {
    outAfterQ: (y: number) => `Which F1 drivers are out of contract after ${y}?`,
    outAfterA: (n: number, y: number, names: string) =>
      `${n} drivers have deals that end after the ${y} season: ${names}. Some of these deals include options held by the team or the driver.`,
    completeQ: (y: number) => `Is the ${y} F1 grid complete?`,
    completeUnsigned: (y: number, names: string, count: number) =>
      `Every ${y} seat has a named driver. ${names} ${count === 1 ? 'has' : 'have'} been confirmed by the team but not yet signed.`,
    completeYes: (n: number, y: number) => `Yes. All ${n} seats for ${y} are signed.`,
    leavingQ: (y: number) => `Who is leaving F1 after the ${y} season?`,
    rookiesJoin: (names: string, count: number) => `${names} ${count === 1 ? 'joins' : 'join'} the grid as ${count === 1 ? 'a rookie' : 'rookies'}.`,
    noLeaving: (y: number) => `No driver has confirmed an exit after the ${y} season.`,
    whenEndsQ: (name: string) => `When does ${name}'s contract end?`,
    whenEndsA: (name: string, team: string, phrase: string) => `${name} is under contract with ${team} ${phrase}.`,
    reportedNote: 'The exact length has not been officially confirmed, so this is based on media reports.',
    longestQ: 'Who has the longest contract in F1?',
    longestA: (names: string, count: number, y: number) =>
      `${names} ${count === 1 ? 'is' : 'are'} signed until the end of ${y}, the longest deals on the grid.`,
    sourceQ: 'Where does this contract information come from?',
    sourceA:
      'Each entry links to its source: team announcements where they exist, otherwise reporting from major F1 outlets. Teams often do not publish contract lengths, so entries marked "reported" are the best public information, not confirmed terms. This site is not affiliated with Formula 1 or any team.',
    isLeavingQ: (name: string, team: string) => `Is ${name} leaving ${team}?`,
    yes: 'Yes.',
    officialQ: (name: string) => `Is ${name}'s contract length official?`,
    officialYes: (team: string, last: string) => `Yes. The end year has been confirmed by ${team} or by ${last}.`,
    officialNo: (team: string, src: string) =>
      `No. ${team} has not published the length, so the end year comes from media reporting (${src}).`,
    teammateQ: (name: string, y: number) => `Who is ${name}'s teammate in ${y}?`,
    contractIn: (name: string, short: string) => `${name} (contract ${short})`,
    numberQ: (name: string) => `What is ${name}'s race number?`,
    numberA: (name: string, n: number, y: number) => `${name} raced with number ${n} in ${y}.`,
    whoDrivesQ: (team: string, y: number) => `Who drives for ${team} in ${y}?`,
    teamEndsQ: (name: string, team: string) => `When does ${name}'s ${team} contract end?`,
    teamEndsA: (name: string, phrase: string, reported: boolean) =>
      `${name} is signed ${phrase}. ${reported ? 'The length comes from media reports.' : 'The end year is official.'}`,
    seatsQ: (y: number) => `How many F1 seats are open for ${y}?`,
    seatsA: (signed: number, total: number, y: number, open: number) =>
      `${signed} of ${total} drivers are already signed for ${y} or later, so up to ${open} seats could change. Some of those deals have options that a team or driver can take up.`,
    bothQ: (y: number) => `Which teams have both drivers out of contract after ${y}?`,
    bothA: (names: string, y: number) => `${names}. Both of their current drivers have deals that end with the ${y} season.`,
    bothNone: (y: number) => `None. Every team has at least one driver signed beyond ${y}.`,
    signedForQ: (y: number) => `Who is already signed for ${y}?`,
    gridTeamsQ: (y: number) => `How many teams and drivers are on the ${y} F1 grid?`,
    gridTeamsA: (teams: number, drivers: number, y: number) => `${teams} teams and ${drivers} drivers are confirmed for the ${y} season.`,
    gridRookiesQ: (y: number) => `Who are the rookies on the ${y} F1 grid?`,
    gridRookiesNone: (y: number) => `No rookie has been confirmed for ${y} yet.`,
  },

  driver: {
    contract: 'contract',
    leaves: (name: string, team: string, y: number) => `${name} leaves ${team} after the ${y} season.`,
    underContract: (name: string, team: string, phrase: string) => `${name} is under contract with ${team} ${phrase}.`,
    factTeam: 'Team',
    factNumber: (y: number) => `Number (${y})`,
    factOption: 'Option',
    factLength: 'Length',
    optionNone: 'None known',
    optionYes: 'Yes',
    official: 'Official',
    reported: 'Reported',
    tba: 'TBA',
    detailsTitle: 'The details',
    newsTitle: 'Contract news',
    teammates: (n: number, y: number) => `Teammate${n > 1 ? 's' : ''} in ${y}`,
    teamDrivers: (team: string, y: number) => `${team}'s ${y} drivers`,
    alsoOut: (y: number) => `Also out of contract after ${y}`,
    questions: 'Questions',
    seeGrid: (y: number) => `See the whole ${y} grid`,
  },
  team: {
    h1b: (y: number) => `drivers ${y}`,
    lede: (team: string, y: number) => `${team}'s line-up for ${y} and when each driver's contract ends. Tap a driver for the full details and source.`,
    others: 'Other teams',
  },
  teamsIndex: {
    eyebrow: (n: number) => `${n} teams`,
    h1: 'F1 teams',
    h1b: (y: number) => `${y} line-ups`,
    lede: (y: number) => `Every team on the ${y} grid, its drivers and the year each contract ends.`,
  },
  driversIndex: {
    eyebrow: (n: number) => `${n} drivers`,
    h1: 'All drivers',
    h1b: 'A to Z',
    lede: (y: number) => `Every driver on the ${y} grid by surname, with the year their contract ends. For the order by contract length, see`,
    ledeLink: 'the grid',
  },
  changesPage: {
    eyebrow: 'Contract news',
    h1: 'Latest',
    h1b: 'changes',
    lede: 'Every contract change we track, newest first: signings, extensions, options and exits. Each one links to its source. Follow along with the',
    rss: 'RSS feed',
    driverContract: (name: string) => `${name}: contract`,
  },
  market: {
    eyebrow: 'Next silly season',
    h1: (y: number) => `${y} driver market`,
    h1b: 'who’s out of contract',
    lede: (y: number, y2: number) =>
      `Every driver whose deal ends with the ${y} season, team by team, and who is already locked in for ${y2}. Updated whenever a contract changes.`,
    statOut: (y: number) => `Out of contract after ${y}`,
    statSigned: (y: number) => `Signed for ${y} or later`,
    statBoth: 'Teams with both drivers out of contract',
    watch: 'Ones to watch',
    outTitle: (y: number) => `Out of contract after ${y}`,
    both: 'Both seats',
    signedTitle: (y: number) => `Already signed for ${y}`,
    laterYears: 'Contracts ending later',
  },
  gridPage: {
    eyebrow: 'Confirmed line-ups',
    h1: (y: number) => `F1 ${y} grid`,
    h1b: 'all teams and drivers',
    lede: (y: number) => `Every team and driver confirmed for the ${y} Formula 1 season, with race numbers and when each contract ends.`,
    colTeam: 'Team',
    colDriver: 'Driver',
    colUntil: 'Contract',
    newTitle: (y: number) => `What's new for ${y}`,
    joins: (name: string, team: string) => `${name} joins ${team} as a rookie.`,
    leavesTeam: (name: string, team: string) => `${name} leaves ${team}.`,
    noChanges: 'No changes to the line-ups have been announced.',
  },
  ooc: {
    eyebrow: 'Contracts by year',
    h1: 'Out of contract',
    h1b: (y: number) => `after ${y}`,
    lede: (n: number, y: number) =>
      n === 1
        ? `One Formula 1 driver currently has a contract that ends with the ${y} season.`
        : `${n} Formula 1 drivers currently have contracts that end with the ${y} season.`,
    none: (y: number) => `No current contract is known to end with the ${y} season.`,
    otherYears: 'Other years',
    q: (y: number) => `Which F1 drivers are out of contract after ${y}?`,
  },

  meta: {
    brand: 'F1 Contracts',
    homeTitle: (y: number) => `F1 Driver Contracts ${y}: When Every Formula 1 Contract Expires`,
    homeDesc: (y: number) =>
      `Every F1 driver contract for ${y} and beyond: Verstappen, Hamilton, Norris, Leclerc, Antonelli and the full grid. Who is out of contract, option years and sources.`,
    driverTitle: (d: Driver, team: string) =>
      d.status === 'leaving'
        ? `${d.name} Contract: Leaving ${team} After ${d.contractEnd}`
        : `${d.name} Contract: ${team} ${en.contractShort(d).replace(/^until/, 'Until')}`,
    driverDesc: (d: Driver, team: string, note: string) =>
      d.status === 'leaving'
        ? `${d.name} leaves ${team} after the ${d.contractEnd} season. ${note}`
        : `${d.name}'s ${team} contract runs ${en.contractPhrase(d)}. ${note}`,
    teamTitle: (team: string, y: number, names: string) => `${team} Drivers ${y}: ${names} Contracts`,
    teamDesc: (team: string, y: number, parts: string) => `${team}'s ${y} line-up: ${parts}. Sources for every deal.`,
    changesTitle: 'F1 Contract News: Latest Signings, Extensions and Exits',
    changesDesc: (items: string) => `Every F1 driver contract change we track, newest first: ${items}.`,
    driversTitle: (y: number) => `All F1 Drivers and Their Contracts (${y})`,
    driversDesc: (n: number, y: number) => `Contract end dates for all ${n} Formula 1 drivers on the ${y} grid, A to Z, with options and sources.`,
    teamsTitle: (y: number) => `F1 Teams ${y}: Driver Line-ups and Contracts`,
    teamsDesc: (n: number, y: number) => `All ${n} Formula 1 teams for ${y}, their drivers and when each contract ends.`,
    marketTitle: (y2: number, y: number) => `F1 ${y2} Driver Market: Every Driver Out of Contract After ${y}`,
    marketDesc: (n: number, y: number, names: string, y2: number) =>
      `${n} F1 drivers are out of contract after ${y}, including ${names}. Who is free, who is signed for ${y2}, and the options to watch.`,
    gridTitle: (y: number) => `F1 ${y} Grid: All Confirmed Teams and Drivers`,
    gridDesc: (y: number, n: number) => `The full ${y} Formula 1 grid: all ${n} drivers by team, race numbers, rookies and when every contract ends.`,
    oocTitle: (y: number) => `F1 Drivers Out of Contract After ${y}`,
    oocDesc: (n: number, y: number, names: string) => `${n} F1 driver${n === 1 ? '' : 's'} with contracts ending after ${y}: ${names}. Options and sources included.`,
  },
};

export default en;
export type Dict = typeof en;
