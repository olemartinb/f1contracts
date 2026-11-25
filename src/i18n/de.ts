import type { Driver } from '../data';
import type { Dict } from './en';

const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;

const de: Dict = {
  locale: 'de-DE',
  list,

  contractPhrase: (d: Driver) => {
    if (d.status === 'leaving') return `verlässt das Team nach ${d.contractEnd}`;
    const base = `bis ${d.optionBeyond ? 'mindestens ' : ''}Ende der Saison ${d.contractEnd}`;
    if (d.optionYear) return `${base}, mit Option auf ${d.optionYear}`;
    if (d.optionBeyond) return `${base}, mit Verlängerungsoption`;
    return base;
  },
  contractShort: (d: Driver) => {
    if (d.status === 'leaving') return `geht nach ${d.contractEnd}`;
    if (d.status === 'unsigned') return `Vertrag für ${d.contractEnd} noch nicht unterschrieben`;
    if (d.optionYear) return `bis ${d.contractEnd} (Option ${d.optionYear})`;
    if (d.optionBeyond) return `bis ${d.contractEnd}+`;
    return `bis ${d.contractEnd}`;
  },
  contractSummary: (d: Driver) => {
    const parts = [`Vertrag endet nach ${d.contractEnd}`];
    if (d.optionYear) parts.push(`Option auf ${d.optionYear}`);
    if (d.optionBeyond) parts.push('Verlängerungsoption');
    if (d.status === 'unsigned') parts.push('vom Team bestätigt, aber noch nicht unterschrieben');
    if (d.basis === 'reported') parts.push('Laufzeit laut Medien, nicht offiziell');
    return parts.join(', ');
  },
  endLabel: (d: Driver) =>
    d.status === 'leaving' ? 'Geht' : d.status === 'unsigned' ? 'Offen' : d.basis === 'reported' ? 'Laut Medien' : 'Vertrag bis',
  endLabelLong: (d: Driver) =>
    d.status === 'leaving'
      ? 'Vertragsende'
      : d.status === 'unsigned'
        ? 'Bestätigt für'
        : d.basis === 'reported'
          ? 'Laut Medien bis'
          : 'Vertrag bis',

  rookie: 'Rookie',
  unsigned: 'Nicht unterschrieben',
  notYetSigned: 'Noch nicht unterschrieben',
  leaving: 'Geht',
  tbc: 'Offen',
  withOption: 'mit Option',
  option: (y: number) => `Option ${y}`,
  source: 'Quelle',
  details: 'Details',
  closeDetails: (name: string) => `Details zu ${name} schließen`,
  fullPage: 'Ganze Vertragsseite →',
  advertisement: 'Anzeige',

  nav: { grid: 'Startfeld', market: 'Fahrermarkt', teams: 'Teams', changes: 'News', faq: 'FAQ' },
  crumbs: {
    home: 'Start',
    drivers: 'Fahrer',
    teams: 'Teams',
    changes: 'News',
    market: (y: number) => `Fahrermarkt ${y}`,
    grid: (y: number) => `Startfeld ${y}`,
    outOfContract: (y: number) => `Vertragsende ${y}`,
  },
  footer: {
    disclaimer: (date: string) =>
      `Inoffizielle Fanseite, ohne Verbindung zur Formel 1, zur FIA oder zu einem Team. Verträge ändern sich; jeder Eintrag verlinkt seine Quelle. Zuletzt geprüft am ${date}.`,
    teams: 'Teams',
    site: 'Seite',
    grid: (y: number) => `Das Startfeld ${y}`,
    allDrivers: 'Alle Fahrer',
    allTeams: 'Alle Teams',
    market: (y: number) => `Fahrermarkt ${y}`,
    outOfContract: 'Vertragsende nach Jahr',
    changes: 'Neueste Änderungen',
    rss: 'RSS-Feed',
    faq: 'FAQ',
    privacy: 'Datenschutz (englisch)',
    language: 'Sprache',
  },

  gridUi: {
    order: 'Startfeld sortieren',
    byContract: 'Nach Vertragsdauer',
    byTeam: 'Nach Team',
    filterTeam: 'Nach Team filtern',
    allTeams: 'Alle Teams',
    search: 'Fahrer suchen',
    searchPlaceholder: 'Fahrer oder Team suchen',
    listLabel: 'Fahrer in der Startaufstellung',
    noMatch: (q: string) => `Kein Fahrer passt zu „${q}“.`,
    legendContracted: 'Saisons unter Vertrag',
    legendOption: 'Optionsjahr',
    legendUnsigned: 'Noch nicht unterschrieben',
    legendReportedTag: 'Laut Medien',
    legendReported: 'Laufzeit aus Medienberichten',
  },

  home: {
    skip: 'Zum Startfeld springen',
    updated: 'Aktualisiert',
    h1: 'F1-Fahrerverträge',
    h1b: (y: number) => `${y} und danach`,
    lede: 'Das ganze Formel-1-Feld, aufgestellt nach Vertragslaufzeit. Der längste Vertrag steht auf der Pole. Tippe auf einen Fahrer für Details und Quelle.',
    statSigned: (y: number) => `Cockpits für ${y} vergeben`,
    statOut: (y: number) => `Vertrag endet nach ${y}`,
    statLongest: (names: string) => `Längste Verträge: ${names}`,
    statOfficial: 'Offiziell bestätigte Laufzeiten',
    gridEyebrow: 'Das Startfeld',
    gridTitle: (y: number) => `Das Startfeld ${y} nach Vertrag`,
    gridLede: (y: number) =>
      `Jedes Feld zeigt die Saisons, für die ein Fahrer ab ${y} unter Vertrag steht. Teams halten die Laufzeit oft geheim; „Laut Medien“ heißt, dass das Endjahr aus Medienberichten stammt.`,
    marketEyebrow: 'Der nächste Fahrermarkt',
    marketTitle: (n: number, y: number) => `${n} Fahrer ohne Vertrag nach ${y}`,
    marketLede: (y: number) => `Diese Verträge enden mit der Saison ${y}. Damit wird der Fahrermarkt für ${y + 1} einer der größten seit Jahren.`,
    marketLink: (y: number) => `Zum ganzen Fahrermarkt ${y} →`,
    leavingAfter: (y: number) => `Gehen nach ${y}`,
    latestEyebrow: 'Vertrags-News',
    latestTitle: 'Neueste Änderungen',
    allChanges: 'Alle Änderungen →',
    lineupsEyebrow: (y: number) => `Fahrerpaarungen ${y}`,
    lineupsTitle: 'Team für Team',
    lineupsLede: (n: number) => `Alle ${n} Teams und ihre Fahrer für die nächste Saison, mit dem Jahr, in dem jeder Vertrag endet.`,
    numbersNote: (y: number) => `Startnummern aus der Saison ${y}. Ein „+“ heißt, dass der Vertrag eine Option enthält.`,
    faqEyebrow: 'FAQ',
    faqTitle: 'Fragen zu Verträgen',
  },

  faq: {
    outAfterQ: (y: number) => `Welche F1-Fahrer haben nach ${y} keinen Vertrag?`,
    outAfterA: (n: number, y: number, names: string) =>
      `Bei ${n} Fahrern endet der Vertrag nach der Saison ${y}: ${names}. Einige Verträge enthalten Optionen für Team oder Fahrer.`,
    completeQ: (y: number) => `Ist das F1-Startfeld ${y} komplett?`,
    completeUnsigned: (y: number, names: string, count: number) =>
      `Jedes Cockpit für ${y} ist besetzt. ${names} ${count === 1 ? 'wurde' : 'wurden'} vom Team bestätigt, aber noch nicht unter Vertrag genommen.`,
    completeYes: (n: number, y: number) => `Ja. Alle ${n} Cockpits für ${y} sind vergeben.`,
    leavingQ: (y: number) => `Wer verlässt die Formel 1 nach der Saison ${y}?`,
    rookiesJoin: (names: string, count: number) => `${names} ${count === 1 ? 'kommt als Rookie neu ins Feld' : 'kommen als Rookies neu ins Feld'}.`,
    noLeaving: (y: number) => `Kein Fahrer hat einen Abschied nach der Saison ${y} bestätigt.`,
    whenEndsQ: (name: string) => `Wann endet der Vertrag von ${name}?`,
    whenEndsA: (name: string, team: string, phrase: string) => `${name} steht bei ${team} unter Vertrag, ${phrase}.`,
    reportedNote: 'Die genaue Laufzeit ist nicht offiziell bestätigt, die Angabe stützt sich auf Medienberichte.',
    longestQ: 'Wer hat den längsten Vertrag in der Formel 1?',
    longestA: (names: string, count: number, y: number) =>
      `${names} ${count === 1 ? 'ist' : 'sind'} bis Ende ${y} unter Vertrag, die längsten Verträge im Feld.`,
    sourceQ: 'Woher stammen diese Informationen?',
    sourceA:
      'Jeder Eintrag verlinkt seine Quelle: Mitteilungen der Teams, wo es sie gibt, sonst Berichte großer F1-Medien. Teams veröffentlichen Laufzeiten oft nicht; mit „laut Medien“ markierte Einträge sind die beste öffentliche Information, keine bestätigten Fakten. Diese Seite hat keine Verbindung zur Formel 1 oder zu einem Team.',
    isLeavingQ: (name: string, team: string) => `Verlässt ${name} das Team ${team}?`,
    yes: 'Ja.',
    officialQ: (name: string) => `Ist die Vertragslaufzeit von ${name} offiziell?`,
    officialYes: (team: string, last: string) => `Ja. Das Endjahr wurde von ${team} oder von ${last} selbst bestätigt.`,
    officialNo: (team: string, src: string) => `Nein. ${team} hat die Laufzeit nicht veröffentlicht, das Endjahr stammt aus Medienberichten (${src}).`,
    teammateQ: (name: string, y: number) => `Wer ist ${y} der Teamkollege von ${name}?`,
    contractIn: (name: string, short: string) => `${name} (Vertrag ${short})`,
    numberQ: (name: string) => `Welche Startnummer hat ${name}?`,
    numberA: (name: string, n: number, y: number) => `${name} fuhr ${y} mit der Nummer ${n}.`,
    whoDrivesQ: (team: string, y: number) => `Wer fährt ${y} für ${team}?`,
    teamEndsQ: (name: string, team: string) => `Wann endet der Vertrag von ${name} bei ${team}?`,
    teamEndsA: (name: string, phrase: string, reported: boolean) =>
      `${name} ist unter Vertrag ${phrase}. ${reported ? 'Die Laufzeit stammt aus Medienberichten.' : 'Das Endjahr ist offiziell.'}`,
    seatsQ: (y: number) => `Wie viele F1-Cockpits sind für ${y} noch offen?`,
    seatsA: (signed: number, total: number, y: number, open: number) =>
      `${signed} von ${total} Fahrern haben bereits einen Vertrag für ${y} oder länger, bis zu ${open} Cockpits könnten also wechseln. Einige Verträge enthalten Optionen, die Team oder Fahrer ziehen können.`,
    bothQ: (y: number) => `Bei welchen Teams laufen nach ${y} beide Fahrerverträge aus?`,
    bothA: (names: string, y: number) => `${names}. Bei beiden aktuellen Fahrern endet der Vertrag mit der Saison ${y}.`,
    bothNone: (y: number) => `Bei keinem. Jedes Team hat mindestens einen Fahrer mit Vertrag über ${y} hinaus.`,
    signedForQ: (y: number) => `Wer hat bereits einen Vertrag für ${y}?`,
    gridTeamsQ: (y: number) => `Wie viele Teams und Fahrer stehen im F1-Startfeld ${y}?`,
    gridTeamsA: (teams: number, drivers: number, y: number) => `${teams} Teams und ${drivers} Fahrer sind für die Saison ${y} bestätigt.`,
    gridRookiesQ: (y: number) => `Wer sind die Rookies im F1-Startfeld ${y}?`,
    gridRookiesNone: (y: number) => `Für ${y} ist noch kein Rookie bestätigt.`,
  },

  driver: {
    contract: 'Vertrag',
    leaves: (name: string, team: string, y: number) => `${name} verlässt ${team} nach der Saison ${y}.`,
    underContract: (name: string, team: string, phrase: string) => `${name} steht bei ${team} unter Vertrag, ${phrase}.`,
    factTeam: 'Team',
    factNumber: (y: number) => `Nummer (${y})`,
    factOption: 'Option',
    factLength: 'Laufzeit',
    optionNone: 'Keine bekannt',
    optionYes: 'Ja',
    official: 'Offiziell',
    reported: 'Laut Medien',
    tba: 'Offen',
    detailsTitle: 'Die Details',
    newsTitle: 'Vertrags-News',
    teammates: (n: number, y: number) => `${n > 1 ? 'Teamkollegen' : 'Teamkollege'} ${y}`,
    teamDrivers: (team: string, y: number) => `Fahrer von ${team} ${y}`,
    alsoOut: (y: number) => `Ebenfalls ohne Vertrag nach ${y}`,
    questions: 'Fragen',
    seeGrid: (y: number) => `Das ganze Startfeld ${y}`,
  },
  team: {
    h1b: (y: number) => `Fahrer ${y}`,
    lede: (team: string, y: number) => `Die Fahrer von ${team} für ${y} und wann jeder Vertrag endet. Tippe auf einen Fahrer für alle Details und die Quelle.`,
    others: 'Andere Teams',
  },
  teamsIndex: {
    eyebrow: (n: number) => `${n} Teams`,
    h1: 'F1-Teams',
    h1b: (y: number) => `Fahrer ${y}`,
    lede: (y: number) => `Alle Teams im Startfeld ${y}, ihre Fahrer und das Jahr, in dem jeder Vertrag endet.`,
  },
  driversIndex: {
    eyebrow: (n: number) => `${n} Fahrer`,
    h1: 'Alle Fahrer',
    h1b: 'von A bis Z',
    lede: (y: number) => `Alle Fahrer im Startfeld ${y} nach Nachnamen, mit dem Jahr, in dem ihr Vertrag endet. Nach Vertragsdauer sortiert siehst du sie im`,
    ledeLink: 'Startfeld',
  },
  changesPage: {
    eyebrow: 'Vertrags-News',
    h1: 'Neueste',
    h1b: 'Änderungen',
    lede: 'Alle Vertragsänderungen, die wir verfolgen, die neuesten zuerst: Verpflichtungen, Verlängerungen, Optionen und Abschiede. Jede verlinkt ihre Quelle. Bleib auf dem Laufenden mit dem',
    rss: 'RSS-Feed',
    driverContract: (name: string) => `${name}: Vertrag`,
  },
  market: {
    eyebrow: 'Der nächste Fahrermarkt',
    h1: (y: number) => `Fahrermarkt ${y}`,
    h1b: 'wer frei wird',
    lede: (y: number, y2: number) =>
      `Alle Fahrer, deren Vertrag mit der Saison ${y} endet, Team für Team, und wer für ${y2} schon fest ist. Wird bei jeder Vertragsänderung aktualisiert.`,
    statOut: (y: number) => `Ohne Vertrag nach ${y}`,
    statSigned: (y: number) => `Unter Vertrag für ${y} oder länger`,
    statBoth: 'Teams mit zwei auslaufenden Verträgen',
    watch: 'Im Blick behalten',
    outTitle: (y: number) => `Ohne Vertrag nach ${y}`,
    both: 'Beide Cockpits',
    signedTitle: (y: number) => `Schon fest für ${y}`,
    laterYears: 'Verträge, die später enden',
  },
  gridPage: {
    eyebrow: 'Bestätigte Fahrer',
    h1: (y: number) => `F1-Startfeld ${y}`,
    h1b: 'alle Teams und Fahrer',
    lede: (y: number) => `Alle für die Formel-1-Saison ${y} bestätigten Teams und Fahrer, mit Startnummern und Vertragsende.`,
    colTeam: 'Team',
    colDriver: 'Fahrer',
    colUntil: 'Vertrag',
    newTitle: (y: number) => `Was ${y} neu ist`,
    joins: (name: string, team: string) => `${name} kommt als Rookie zu ${team}.`,
    leavesTeam: (name: string, team: string) => `${name} verlässt ${team}.`,
    noChanges: 'Es wurden keine Fahrerwechsel angekündigt.',
  },
  ooc: {
    eyebrow: 'Verträge nach Jahr',
    h1: 'Vertragsende',
    h1b: (y: number) => `nach ${y}`,
    lede: (n: number, y: number) =>
      n === 1
        ? `Bei einem Formel-1-Fahrer endet der aktuelle Vertrag mit der Saison ${y}.`
        : `Bei ${n} Formel-1-Fahrern endet der aktuelle Vertrag mit der Saison ${y}.`,
    none: (y: number) => `Es ist kein Vertrag bekannt, der mit der Saison ${y} endet.`,
    otherYears: 'Andere Jahre',
    q: (y: number) => `Welche F1-Fahrer haben nach ${y} keinen Vertrag?`,
  },

  meta: {
    brand: 'F1 Contracts',
    homeTitle: (y: number) => `F1-Fahrerverträge ${y}: Wann jeder Vertrag ausläuft`,
    homeDesc: (y: number) =>
      `Alle F1-Fahrerverträge für ${y} und danach: Verstappen, Hamilton, Norris, Leclerc, Antonelli und das ganze Feld. Wer frei wird, Optionen und Quellen.`,
    driverTitle: (d: Driver, team: string) =>
      d.status === 'leaving'
        ? `${d.name} Vertrag: verlässt ${team} nach ${d.contractEnd}`
        : `${d.name} Vertrag: ${team} ${de.contractShort(d)}`,
    driverDesc: (d: Driver, team: string, note: string) =>
      d.status === 'leaving'
        ? `${d.name} verlässt ${team} nach der Saison ${d.contractEnd}. ${note}`
        : `Der Vertrag von ${d.name} bei ${team} läuft ${de.contractPhrase(d)}. ${note}`,
    teamTitle: (team: string, y: number, names: string) => `${team} Fahrer ${y}: Verträge von ${names}`,
    teamDesc: (team: string, y: number, parts: string) => `Die Fahrer von ${team} für ${y}: ${parts}. Mit Quellen zu jedem Vertrag.`,
    changesTitle: 'F1-Vertrags-News: Verpflichtungen, Verlängerungen und Abschiede',
    changesDesc: (items: string) => `Alle Änderungen an F1-Fahrerverträgen, die neuesten zuerst: ${items}.`,
    driversTitle: (y: number) => `Alle F1-Fahrer und ihre Verträge (${y})`,
    driversDesc: (n: number, y: number) => `Vertragsende aller ${n} Fahrer im F1-Startfeld ${y}, von A bis Z, mit Optionen und Quellen.`,
    teamsTitle: (y: number) => `F1-Teams ${y}: Fahrer und Verträge`,
    teamsDesc: (n: number, y: number) => `Alle ${n} Formel-1-Teams ${y}, ihre Fahrer und wann jeder Vertrag endet.`,
    marketTitle: (y2: number, y: number) => `F1-Fahrermarkt ${y2}: alle Fahrer ohne Vertrag nach ${y}`,
    marketDesc: (n: number, y: number, names: string, y2: number) =>
      `${n} F1-Fahrer haben nach ${y} keinen Vertrag, darunter ${names}. Wer frei wird, wer für ${y2} unterschrieben hat und welche Optionen offen sind.`,
    gridTitle: (y: number) => `F1-Startfeld ${y}: alle bestätigten Teams und Fahrer`,
    gridDesc: (y: number, n: number) => `Das komplette Formel-1-Startfeld ${y}: alle ${n} Fahrer nach Team, Startnummern, Rookies und Vertragsende.`,
    oocTitle: (y: number) => `F1-Fahrer ohne Vertrag nach ${y}`,
    oocDesc: (n: number, y: number, names: string) => `${n} F1-Fahrer mit Vertragsende ${y}: ${names}. Mit Optionen und Quellen.`,
  },
};

export default de;
