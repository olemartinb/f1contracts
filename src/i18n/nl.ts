import type { Driver } from '../data';
import type { Dict } from './en';

const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} en ${items[items.length - 1]}`;

const nl: Dict = {
  locale: 'nl-NL',
  list,

  contractPhrase: (d: Driver) => {
    if (d.status === 'leaving') return `vertrekt na ${d.contractEnd}`;
    const base = `tot ${d.optionBeyond ? 'minstens ' : ''}het einde van het seizoen ${d.contractEnd}`;
    if (d.optionYear) return `${base}, met een optie voor ${d.optionYear}`;
    if (d.optionBeyond) return `${base}, met een optie om te verlengen`;
    return base;
  },
  contractShort: (d: Driver) => {
    if (d.status === 'leaving') return `vertrekt na ${d.contractEnd}`;
    if (d.status === 'unsigned') return `contract ${d.contractEnd} nog niet getekend`;
    if (d.optionYear) return `tot ${d.contractEnd} (optie ${d.optionYear})`;
    if (d.optionBeyond) return `tot ${d.contractEnd}+`;
    return `tot ${d.contractEnd}`;
  },
  contractSummary: (d: Driver) => {
    const parts = [`Contract loopt af na ${d.contractEnd}`];
    if (d.optionYear) parts.push(`optie voor ${d.optionYear}`);
    if (d.optionBeyond) parts.push('optie om te verlengen');
    if (d.status === 'unsigned') parts.push('bevestigd door het team, maar nog niet getekend');
    if (d.basis === 'reported') parts.push('looptijd volgens de media, niet officieel');
    return parts.join(', ');
  },
  endLabel: (d: Driver) =>
    d.status === 'leaving' ? 'Vertrekt' : d.status === 'unsigned' ? 'Open' : d.basis === 'reported' ? 'Volgens media' : 'Contract tot',
  endLabelLong: (d: Driver) =>
    d.status === 'leaving'
      ? 'Contract loopt af'
      : d.status === 'unsigned'
        ? 'Bevestigd voor'
        : d.basis === 'reported'
          ? 'Volgens media tot'
          : 'Contract tot',

  rookie: 'Rookie',
  unsigned: 'Niet getekend',
  notYetSigned: 'Nog niet getekend',
  leaving: 'Vertrekt',
  tbc: 'Open',
  withOption: 'met optie',
  option: (y: number) => `Optie ${y}`,
  source: 'Bron',
  details: 'Details',
  closeDetails: (name: string) => `Details van ${name} sluiten`,
  fullPage: 'Volledige contractpagina →',
  updatedOn: (date: string) => `Bijgewerkt op ${date}`,
  advertisement: 'Advertentie',

  nav: { grid: 'Grid', market: 'Rijdersmarkt', teams: 'Teams', changes: 'Nieuws', faq: 'FAQ' },
  crumbs: {
    home: 'Home',
    drivers: 'Coureurs',
    teams: 'Teams',
    changes: 'Nieuws',
    market: (y: number) => `Rijdersmarkt ${y}`,
    grid: (y: number) => `Grid ${y}`,
    outOfContract: (y: number) => `Contract loopt af na ${y}`,
  },
  footer: {
    disclaimer: (date: string) =>
      `Onofficiële fansite, niet verbonden aan de Formule 1, de FIA of een team. Contracten veranderen; elk gegeven linkt naar de bron. Laatst gecontroleerd op ${date}.`,
    teams: 'Teams',
    site: 'Site',
    grid: (y: number) => `De grid van ${y}`,
    allDrivers: 'Alle coureurs',
    allTeams: 'Alle teams',
    market: (y: number) => `Rijdersmarkt ${y}`,
    outOfContract: 'Aflopende contracten per jaar',
    changes: 'Laatste wijzigingen',
    rss: 'RSS-feed',
    faq: 'FAQ',
    privacy: 'Privacy (Engels)',
    language: 'Taal',
  },

  gridUi: {
    viewLabel: 'Weergave',
    viewGrid: 'Grid',
    viewList: 'Lijst',
    listHeading: (y: number) => `Contract tot ${y}`,
    driversCount: (n: number) => `${n} coureur${n === 1 ? '' : 's'}`,
    order: 'Grid sorteren',
    byContract: 'Op contractduur',
    byTeam: 'Op team',
    filterTeam: 'Filter op team',
    allTeams: 'Alle teams',
    search: 'Coureurs zoeken',
    searchPlaceholder: 'Zoek coureur of team',
    listLabel: 'Coureurs op de grid',
    noMatch: (q: string) => `Geen coureurs gevonden voor ‘${q}’.`,
    legendContracted: 'Seizoenen onder contract',
    legendOption: 'Optiejaar',
    legendUnsigned: 'Nog niet getekend',
    legendReportedTag: 'Volgens media',
    legendReported: 'Looptijd uit mediaberichten',
  },

  home: {
    skip: 'Naar de grid',
    updated: 'Bijgewerkt',
    h1: 'Contracten van F1-coureurs',
    h1b: (y: number) => `${y} en verder`,
    lede: 'De hele Formule 1-grid, opgesteld naar de looptijd van elk contract. Het langste contract staat op pole. Tik op een coureur voor de details en de bron.',
    statSigned: (y: number) => `Zitjes voor ${y} vergeven`,
    statOut: (y: number) => `Contract loopt af na ${y}`,
    statLongest: (names: string) => `Langste contracten: ${names}`,
    statOfficial: 'Einddata officieel bevestigd',
    gridEyebrow: 'De grid',
    gridTitle: (y: number) => `De grid van ${y}, op contract`,
    gridLede: (y: number) =>
      `Elk vak toont de seizoenen waarvoor een coureur vanaf ${y} onder contract staat. Teams houden de looptijd vaak geheim; ‘Volgens media’ betekent dat het eindjaar uit mediaberichten komt.`,
    marketEyebrow: 'De volgende rijdersmarkt',
    marketTitle: (n: number, y: number) => `${n} coureurs zonder contract na ${y}`,
    marketLede: (y: number) => `Deze contracten lopen af na het seizoen ${y}, waardoor de rijdersmarkt van ${y + 1} een van de grootste in jaren wordt.`,
    marketLink: (y: number) => `Bekijk de hele rijdersmarkt van ${y} →`,
    leavingAfter: (y: number) => `Vertrekken na ${y}`,
    latestEyebrow: 'Contractnieuws',
    latestTitle: 'Laatste wijzigingen',
    allChanges: 'Alle wijzigingen →',
    lineupsEyebrow: (y: number) => `Line-ups ${y}`,
    lineupsTitle: 'Team voor team',
    lineupsLede: (n: number) => `Alle ${n} teams en hun coureurs voor volgend seizoen, met het jaar waarin elk contract afloopt.`,
    numbersNote: (y: number) => `Startnummers uit het seizoen ${y}. Een ‘+’ betekent dat het contract een optie bevat.`,
    faqEyebrow: 'FAQ',
    faqTitle: 'Vragen over contracten',
  },

  faq: {
    outAfterQ: (y: number) => `Welke F1-coureurs hebben na ${y} geen contract meer?`,
    outAfterA: (n: number, y: number, names: string) =>
      `Bij ${n} coureurs loopt het contract af na het seizoen ${y}: ${names}. Sommige contracten bevatten opties voor het team of de coureur.`,
    completeQ: (y: number) => `Is de F1-grid van ${y} compleet?`,
    completeUnsigned: (y: number, names: string, count: number) =>
      `Elk zitje voor ${y} heeft een coureur. ${names} ${count === 1 ? 'is' : 'zijn'} bevestigd door het team, maar ${count === 1 ? 'heeft' : 'hebben'} nog niet getekend.`,
    completeYes: (n: number, y: number) => `Ja. Alle ${n} zitjes voor ${y} zijn vergeven.`,
    leavingQ: (y: number) => `Wie verlaat de Formule 1 na het seizoen ${y}?`,
    rookiesJoin: (names: string, count: number) => `${names} ${count === 1 ? 'komt als rookie op de grid' : 'komen als rookies op de grid'}.`,
    noLeaving: (y: number) => `Geen enkele coureur heeft een vertrek na het seizoen ${y} bevestigd.`,
    whenEndsQ: (name: string) => `Wanneer loopt het contract van ${name} af?`,
    whenEndsA: (name: string, team: string, phrase: string) => `${name} staat onder contract bij ${team} ${phrase}.`,
    reportedNote: 'De exacte looptijd is niet officieel bevestigd en is gebaseerd op mediaberichten.',
    longestQ: 'Wie heeft het langste contract in de F1?',
    longestA: (names: string, count: number, y: number) =>
      `${names} ${count === 1 ? 'staat' : 'staan'} onder contract tot het einde van ${y}, de langste contracten op de grid.`,
    sourceQ: 'Waar komt deze informatie vandaan?',
    sourceA:
      'Elk gegeven linkt naar de bron: aankondigingen van teams waar die er zijn, anders berichten van grote F1-media. Teams maken de looptijd vaak niet bekend, dus gegevens met ‘volgens media’ zijn de beste openbare informatie, geen bevestigde feiten. Deze site is niet verbonden aan de Formule 1 of een team.',
    isLeavingQ: (name: string, team: string) => `Vertrekt ${name} bij ${team}?`,
    yes: 'Ja.',
    officialQ: (name: string) => `Is de looptijd van het contract van ${name} officieel?`,
    officialYes: (team: string, last: string) => `Ja. Het eindjaar is bevestigd door ${team} of door ${last} zelf.`,
    officialNo: (team: string, src: string) => `Nee. ${team} heeft de looptijd niet bekendgemaakt, dus het eindjaar komt uit mediaberichten (${src}).`,
    teammateQ: (name: string, y: number) => `Wie is in ${y} de teamgenoot van ${name}?`,
    contractIn: (name: string, short: string) => `${name} (contract ${short})`,
    numberQ: (name: string) => `Met welk nummer rijdt ${name}?`,
    numberA: (name: string, n: number, y: number) => `${name} reed in ${y} met nummer ${n}.`,
    whoDrivesQ: (team: string, y: number) => `Wie rijdt er in ${y} voor ${team}?`,
    teamEndsQ: (name: string, team: string) => `Wanneer loopt het contract van ${name} bij ${team} af?`,
    teamEndsA: (name: string, phrase: string, reported: boolean) =>
      `${name} staat onder contract ${phrase}. ${reported ? 'De looptijd komt uit mediaberichten.' : 'Het eindjaar is officieel.'}`,
    seatsQ: (y: number) => `Hoeveel F1-zitjes zijn er nog open voor ${y}?`,
    seatsA: (signed: number, total: number, y: number, open: number) =>
      `${signed} van de ${total} coureurs hebben al een contract voor ${y} of later, dus tot ${open} zitjes kunnen nog wisselen. Sommige contracten hebben opties die het team of de coureur kan lichten.`,
    bothQ: (y: number) => `Bij welke teams lopen na ${y} beide contracten af?`,
    bothA: (names: string, y: number) => `${names}. Bij beide huidige coureurs loopt het contract af na het seizoen ${y}.`,
    bothNone: (y: number) => `Bij geen enkel team. Elk team heeft minstens één coureur met een contract na ${y}.`,
    signedForQ: (y: number) => `Wie heeft al een contract voor ${y}?`,
    gridTeamsQ: (y: number) => `Hoeveel teams en coureurs staan er op de F1-grid van ${y}?`,
    gridTeamsA: (teams: number, drivers: number, y: number) => `${teams} teams en ${drivers} coureurs zijn bevestigd voor het seizoen ${y}.`,
    gridRookiesQ: (y: number) => `Wie zijn de rookies op de F1-grid van ${y}?`,
    gridRookiesNone: (y: number) => `Er is nog geen rookie bevestigd voor ${y}.`,
  },

  driver: {
    contract: 'contract',
    leaves: (name: string, team: string, y: number) => `${name} verlaat ${team} na het seizoen ${y}.`,
    underContract: (name: string, team: string, phrase: string) => `${name} staat onder contract bij ${team} ${phrase}.`,
    factTeam: 'Team',
    factNumber: (y: number) => `Nummer (${y})`,
    factOption: 'Optie',
    factLength: 'Looptijd',
    factUpdated: 'Bijgewerkt',
    optionNone: 'Niet bekend',
    optionYes: 'Ja',
    official: 'Officieel',
    reported: 'Volgens media',
    tba: 'Nog niet bekend',
    detailsTitle: 'De details',
    newsTitle: 'Contractnieuws',
    teammates: (n: number, y: number) => `${n > 1 ? 'Teamgenoten' : 'Teamgenoot'} in ${y}`,
    teamDrivers: (team: string, y: number) => `Coureurs van ${team} in ${y}`,
    alsoOut: (y: number) => `Ook zonder contract na ${y}`,
    questions: 'Vragen',
    seeGrid: (y: number) => `Bekijk de hele grid van ${y}`,
  },
  team: {
    h1b: (y: number) => `coureurs ${y}`,
    lede: (team: string, y: number) => `De coureurs van ${team} voor ${y} en wanneer elk contract afloopt. Tik op een coureur voor alle details en de bron.`,
    others: 'Andere teams',
  },
  teamsIndex: {
    eyebrow: (n: number) => `${n} teams`,
    h1: 'F1-teams',
    h1b: (y: number) => `line-ups ${y}`,
    lede: (y: number) => `Elk team op de grid van ${y}, de coureurs en het jaar waarin elk contract afloopt.`,
  },
  driversIndex: {
    eyebrow: (n: number) => `${n} coureurs`,
    h1: 'Alle coureurs',
    h1b: 'van A tot Z',
    lede: (y: number) => `Elke coureur op de grid van ${y} op achternaam, met het jaar waarin het contract afloopt. Gesorteerd op contractduur zie je ze op`,
    ledeLink: 'de grid',
  },
  changesPage: {
    eyebrow: 'Contractnieuws',
    h1: 'Laatste',
    h1b: 'wijzigingen',
    lede: 'Elke contractwijziging die we volgen, de nieuwste eerst: transfers, verlengingen, opties en vertrekken. Elke wijziging linkt naar de bron. Volg mee via de',
    rss: 'RSS-feed',
    driverContract: (name: string) => `${name}: contract`,
  },
  market: {
    eyebrow: 'De volgende rijdersmarkt',
    h1: (y: number) => `Rijdersmarkt ${y}`,
    h1b: 'wie wordt vrij',
    lede: (y: number, y2: number) =>
      `Elke coureur van wie het contract afloopt na het seizoen ${y}, team voor team, en wie al vastligt voor ${y2}. Bijgewerkt bij elke contractwijziging.`,
    statOut: (y: number) => `Zonder contract na ${y}`,
    statSigned: (y: number) => `Onder contract voor ${y} of later`,
    statBoth: 'Teams met twee aflopende contracten',
    watch: 'Om in de gaten te houden',
    outTitle: (y: number) => `Zonder contract na ${y}`,
    both: 'Beide zitjes',
    signedTitle: (y: number) => `Al vast voor ${y}`,
    laterYears: 'Contracten die later aflopen',
  },
  gridPage: {
    eyebrow: 'Bevestigde line-ups',
    h1: (y: number) => `F1-grid ${y}`,
    h1b: 'alle teams en coureurs',
    lede: (y: number) => `Alle teams en coureurs die bevestigd zijn voor het Formule 1-seizoen ${y}, met startnummers en de einddatum van elk contract.`,
    colTeam: 'Team',
    colDriver: 'Coureur',
    colUntil: 'Contract',
    newTitle: (y: number) => `Wat is nieuw in ${y}`,
    joins: (name: string, team: string) => `${name} komt als rookie bij ${team}.`,
    leavesTeam: (name: string, team: string) => `${name} verlaat ${team}.`,
    noChanges: 'Er zijn geen wijzigingen in de line-ups aangekondigd.',
  },
  ooc: {
    eyebrow: 'Contracten per jaar',
    h1: 'Contract loopt af',
    h1b: (y: number) => `na ${y}`,
    lede: (n: number, y: number) =>
      n === 1
        ? `Eén Formule 1-coureur heeft nu een contract dat afloopt na het seizoen ${y}.`
        : `${n} Formule 1-coureurs hebben nu een contract dat afloopt na het seizoen ${y}.`,
    none: (y: number) => `Er is geen contract bekend dat afloopt na het seizoen ${y}.`,
    otherYears: 'Andere jaren',
    q: (y: number) => `Welke F1-coureurs hebben na ${y} geen contract meer?`,
  },

  meta: {
    brand: 'F1 Contracts',
    homeTitle: (y: number) => `F1-coureurscontracten ${y}: wanneer elk contract afloopt`,
    homeDesc: (y: number) =>
      `Alle F1-coureurscontracten voor ${y} en verder: Verstappen, Hamilton, Norris, Leclerc, Antonelli en de hele grid. Wie vrij komt, opties en bronnen.`,
    driverTitle: (d: Driver, team: string) =>
      d.status === 'leaving'
        ? `Contract ${d.name}: vertrekt bij ${team} na ${d.contractEnd}`
        : `Contract ${d.name}: ${team} ${nl.contractShort(d)}`,
    driverDesc: (d: Driver, team: string, note: string) =>
      d.status === 'leaving'
        ? `${d.name} verlaat ${team} na het seizoen ${d.contractEnd}. ${note}`
        : `Het contract van ${d.name} bij ${team} loopt ${nl.contractPhrase(d)}. ${note}`,
    teamTitle: (team: string, y: number, names: string) => `${team} coureurs ${y}: contracten van ${names}`,
    teamDesc: (team: string, y: number, parts: string) => `De line-up van ${team} voor ${y}: ${parts}. Met bronnen voor elk contract.`,
    changesTitle: 'F1-contractnieuws: transfers, verlengingen en vertrekken',
    changesDesc: (items: string) => `Elke wijziging in F1-coureurscontracten, de nieuwste eerst: ${items}.`,
    driversTitle: (y: number) => `Alle F1-coureurs en hun contracten (${y})`,
    driversDesc: (n: number, y: number) => `Einde contract van alle ${n} coureurs op de F1-grid van ${y}, van A tot Z, met opties en bronnen.`,
    teamsTitle: (y: number) => `F1-teams ${y}: line-ups en contracten`,
    teamsDesc: (n: number, y: number) => `Alle ${n} Formule 1-teams in ${y}, hun coureurs en wanneer elk contract afloopt.`,
    marketTitle: (y2: number, y: number) => `F1-rijdersmarkt ${y2}: alle coureurs zonder contract na ${y}`,
    marketDesc: (n: number, y: number, names: string, y2: number) =>
      `${n} F1-coureurs hebben na ${y} geen contract, onder wie ${names}. Wie vrij komt, wie al getekend heeft voor ${y2} en welke opties open staan.`,
    gridTitle: (y: number) => `F1-grid ${y}: alle bevestigde teams en coureurs`,
    gridDesc: (y: number, n: number) => `De volledige Formule 1-grid van ${y}: alle ${n} coureurs per team, startnummers, rookies en het einde van elk contract.`,
    oocTitle: (y: number) => `F1-coureurs zonder contract na ${y}`,
    oocDesc: (n: number, y: number, names: string) => `${n} F1-coureur${n === 1 ? '' : 's'} met een contract tot ${y}: ${names}. Met opties en bronnen.`,
  },
};

export default nl;
