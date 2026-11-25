import type { Driver } from '../data';
import type { Dict } from './en';

const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

const es: Dict = {
  locale: 'es-ES',
  list,

  contractPhrase: (d: Driver) => {
    if (d.status === 'leaving') return `se marcha tras ${d.contractEnd}`;
    const base = `hasta ${d.optionBeyond ? 'al menos ' : ''}el final de la temporada ${d.contractEnd}`;
    if (d.optionYear) return `${base}, con opción para ${d.optionYear}`;
    if (d.optionBeyond) return `${base}, con opción de ampliarlo`;
    return base;
  },
  contractShort: (d: Driver) => {
    if (d.status === 'leaving') return `se marcha tras ${d.contractEnd}`;
    if (d.status === 'unsigned') return `contrato ${d.contractEnd} aún sin firmar`;
    if (d.optionYear) return `hasta ${d.contractEnd} (opción ${d.optionYear})`;
    if (d.optionBeyond) return `hasta ${d.contractEnd}+`;
    return `hasta ${d.contractEnd}`;
  },
  contractSummary: (d: Driver) => {
    const parts = [`El contrato termina tras ${d.contractEnd}`];
    if (d.optionYear) parts.push(`opción para ${d.optionYear}`);
    if (d.optionBeyond) parts.push('opción de ampliarlo');
    if (d.status === 'unsigned') parts.push('confirmado por el equipo pero aún sin firmar');
    if (d.basis === 'reported') parts.push('duración según la prensa, no oficial');
    return parts.join(', ');
  },
  endLabel: (d: Driver) =>
    d.status === 'leaving' ? 'Se marcha' : d.status === 'unsigned' ? 'Pendiente' : d.basis === 'reported' ? 'Según prensa' : 'Firmado hasta',
  endLabelLong: (d: Driver) =>
    d.status === 'leaving'
      ? 'Fin del contrato'
      : d.status === 'unsigned'
        ? 'Confirmado para'
        : d.basis === 'reported'
          ? 'Hasta (según prensa)'
          : 'Firmado hasta',

  rookie: 'Novato',
  unsigned: 'Sin firmar',
  notYetSigned: 'Aún sin firmar',
  leaving: 'Se marcha',
  tbc: 'Por confirmar',
  withOption: 'con opción',
  option: (y: number) => `Opción ${y}`,
  source: 'Fuente',
  details: 'Detalles',
  closeDetails: (name: string) => `Cerrar detalles de ${name}`,
  fullPage: 'Ficha completa del contrato →',
  advertisement: 'Publicidad',

  nav: { grid: 'Parrilla', market: 'Mercado', teams: 'Equipos', changes: 'Novedades', faq: 'Preguntas' },
  crumbs: {
    home: 'Inicio',
    drivers: 'Pilotos',
    teams: 'Equipos',
    changes: 'Novedades',
    market: (y: number) => `Mercado de pilotos ${y}`,
    grid: (y: number) => `Parrilla ${y}`,
    outOfContract: (y: number) => `Sin contrato tras ${y}`,
  },
  footer: {
    disclaimer: (date: string) =>
      `Web no oficial, sin relación con la Fórmula 1, la FIA ni ningún equipo. Los contratos cambian; cada dato enlaza a su fuente. Última revisión: ${date}.`,
    teams: 'Equipos',
    site: 'Web',
    grid: (y: number) => `La parrilla ${y}`,
    allDrivers: 'Todos los pilotos',
    allTeams: 'Todos los equipos',
    market: (y: number) => `Mercado de pilotos ${y}`,
    outOfContract: 'Sin contrato por año',
    changes: 'Últimas novedades',
    rss: 'Canal RSS',
    faq: 'Preguntas frecuentes',
    privacy: 'Privacidad (en inglés)',
    language: 'Idioma',
  },

  gridUi: {
    order: 'Ordenar la parrilla',
    byContract: 'Por duración',
    byTeam: 'Por equipo',
    filterTeam: 'Filtrar por equipo',
    allTeams: 'Todos los equipos',
    search: 'Buscar pilotos',
    searchPlaceholder: 'Buscar piloto o equipo',
    listLabel: 'Pilotos ordenados en la parrilla',
    noMatch: (q: string) => `Ningún piloto coincide con «${q}».`,
    legendContracted: 'Temporadas con contrato',
    legendOption: 'Año de opción',
    legendUnsigned: 'Aún sin firmar',
    legendReportedTag: 'Según prensa',
    legendReported: 'Duración publicada por la prensa',
  },

  home: {
    skip: 'Ir a la parrilla',
    updated: 'Actualizado',
    h1: 'Contratos de pilotos de F1',
    h1b: (y: number) => `${y} y más allá`,
    lede: 'Toda la parrilla de Fórmula 1, ordenada según la duración del contrato de cada piloto. El contrato más largo sale en la pole. Toca un piloto para ver los detalles y la fuente.',
    statSigned: (y: number) => `Asientos firmados para ${y}`,
    statOut: (y: number) => `Sin contrato tras ${y}`,
    statLongest: (names: string) => `Contratos más largos: ${names}`,
    statOfficial: 'Fechas confirmadas oficialmente',
    gridEyebrow: 'La parrilla',
    gridTitle: (y: number) => `La parrilla ${y}, por contrato`,
    gridLede: (y: number) =>
      `Cada casilla muestra las temporadas que un piloto tiene firmadas desde ${y}. Los equipos no suelen publicar la duración, así que «Según prensa» indica que el año final procede de los medios.`,
    marketEyebrow: 'El próximo mercado',
    marketTitle: (n: number, y: number) => `${n} pilotos sin contrato tras ${y}`,
    marketLede: (y: number) => `Estos contratos terminan con la temporada ${y}, lo que convierte el mercado de ${y + 1} en uno de los más grandes en años.`,
    marketLink: (y: number) => `Ver todo el mercado de ${y} →`,
    leavingAfter: (y: number) => `Se marchan tras ${y}`,
    latestEyebrow: 'Noticias de contratos',
    latestTitle: 'Últimas novedades',
    allChanges: 'Todas las novedades →',
    lineupsEyebrow: (y: number) => `Alineaciones ${y}`,
    lineupsTitle: 'Equipo por equipo',
    lineupsLede: (n: number) => `Los ${n} equipos y sus pilotos para la próxima temporada, con el año en que termina cada contrato.`,
    numbersNote: (y: number) => `Los dorsales son los de la temporada ${y}. Un «+» indica que el contrato incluye una opción.`,
    faqEyebrow: 'Preguntas',
    faqTitle: 'Preguntas sobre contratos',
  },

  faq: {
    outAfterQ: (y: number) => `¿Qué pilotos de F1 se quedan sin contrato tras ${y}?`,
    outAfterA: (n: number, y: number, names: string) =>
      `${n} pilotos tienen contratos que terminan tras la temporada ${y}: ${names}. Algunos incluyen opciones del equipo o del piloto.`,
    completeQ: (y: number) => `¿Está completa la parrilla de F1 ${y}?`,
    completeUnsigned: (y: number, names: string, count: number) =>
      `Todos los asientos de ${y} tienen piloto. ${names} ${count === 1 ? 'ha sido confirmado' : 'han sido confirmados'} por el equipo, pero aún sin firmar.`,
    completeYes: (n: number, y: number) => `Sí. Los ${n} asientos de ${y} están firmados.`,
    leavingQ: (y: number) => `¿Quién deja la F1 tras la temporada ${y}?`,
    rookiesJoin: (names: string, count: number) => `${names} ${count === 1 ? 'llega a la parrilla como novato' : 'llegan a la parrilla como novatos'}.`,
    noLeaving: (y: number) => `Ningún piloto ha confirmado su salida tras la temporada ${y}.`,
    whenEndsQ: (name: string) => `¿Cuándo termina el contrato de ${name}?`,
    whenEndsA: (name: string, team: string, phrase: string) => `${name} tiene contrato con ${team} ${phrase}.`,
    reportedNote: 'La duración exacta no se ha confirmado oficialmente, así que se basa en informaciones de prensa.',
    longestQ: '¿Quién tiene el contrato más largo de la F1?',
    longestA: (names: string, count: number, y: number) =>
      `${names} ${count === 1 ? 'tiene contrato' : 'tienen contrato'} hasta el final de ${y}, los más largos de la parrilla.`,
    sourceQ: '¿De dónde sale esta información?',
    sourceA:
      'Cada dato enlaza a su fuente: comunicados de los equipos cuando existen y, si no, informaciones de los principales medios de F1. Los equipos no suelen publicar la duración, así que lo marcado «según prensa» es la mejor información pública, no un dato confirmado. Esta web no tiene relación con la Fórmula 1 ni con ningún equipo.',
    isLeavingQ: (name: string, team: string) => `¿Deja ${name} el equipo ${team}?`,
    yes: 'Sí.',
    officialQ: (name: string) => `¿Es oficial la duración del contrato de ${name}?`,
    officialYes: (team: string, last: string) => `Sí. El año final lo han confirmado ${team} o el propio ${last}.`,
    officialNo: (team: string, src: string) => `No. ${team} no ha publicado la duración, así que el año final procede de la prensa (${src}).`,
    teammateQ: (name: string, y: number) => `¿Quién es el compañero de ${name} en ${y}?`,
    contractIn: (name: string, short: string) => `${name} (contrato ${short})`,
    numberQ: (name: string) => `¿Qué dorsal lleva ${name}?`,
    numberA: (name: string, n: number, y: number) => `${name} corrió con el número ${n} en ${y}.`,
    whoDrivesQ: (team: string, y: number) => `¿Quién corre con ${team} en ${y}?`,
    teamEndsQ: (name: string, team: string) => `¿Cuándo termina el contrato de ${name} con ${team}?`,
    teamEndsA: (name: string, phrase: string, reported: boolean) =>
      `${name} tiene contrato ${phrase}. ${reported ? 'La duración procede de la prensa.' : 'El año final es oficial.'}`,
    seatsQ: (y: number) => `¿Cuántos asientos de F1 quedan libres para ${y}?`,
    seatsA: (signed: number, total: number, y: number, open: number) =>
      `${signed} de ${total} pilotos ya tienen contrato para ${y} o más allá, así que hasta ${open} asientos podrían cambiar. Algunos contratos tienen opciones que el equipo o el piloto pueden activar.`,
    bothQ: (y: number) => `¿Qué equipos tienen a sus dos pilotos sin contrato tras ${y}?`,
    bothA: (names: string, y: number) => `${names}. Sus dos pilotos actuales tienen contratos que terminan con la temporada ${y}.`,
    bothNone: (y: number) => `Ninguno. Todos los equipos tienen al menos un piloto con contrato más allá de ${y}.`,
    signedForQ: (y: number) => `¿Quién tiene ya contrato para ${y}?`,
    gridTeamsQ: (y: number) => `¿Cuántos equipos y pilotos hay en la parrilla de F1 ${y}?`,
    gridTeamsA: (teams: number, drivers: number, y: number) => `${teams} equipos y ${drivers} pilotos están confirmados para la temporada ${y}.`,
    gridRookiesQ: (y: number) => `¿Quiénes son los novatos de la parrilla de F1 ${y}?`,
    gridRookiesNone: (y: number) => `Aún no se ha confirmado ningún novato para ${y}.`,
  },

  driver: {
    contract: 'contrato',
    leaves: (name: string, team: string, y: number) => `${name} deja ${team} tras la temporada ${y}.`,
    underContract: (name: string, team: string, phrase: string) => `${name} tiene contrato con ${team} ${phrase}.`,
    factTeam: 'Equipo',
    factNumber: (y: number) => `Dorsal (${y})`,
    factOption: 'Opción',
    factLength: 'Duración',
    optionNone: 'No consta',
    optionYes: 'Sí',
    official: 'Oficial',
    reported: 'Según prensa',
    tba: 'Por anunciar',
    detailsTitle: 'Los detalles',
    newsTitle: 'Noticias del contrato',
    teammates: (n: number, y: number) => `${n > 1 ? 'Compañeros' : 'Compañero'} en ${y}`,
    teamDrivers: (team: string, y: number) => `Pilotos de ${team} en ${y}`,
    alsoOut: (y: number) => `También sin contrato tras ${y}`,
    questions: 'Preguntas',
    seeGrid: (y: number) => `Ver toda la parrilla ${y}`,
  },
  team: {
    h1b: (y: number) => `pilotos ${y}`,
    lede: (team: string, y: number) => `La alineación de ${team} para ${y} y cuándo termina el contrato de cada piloto. Toca un piloto para ver todos los detalles y la fuente.`,
    others: 'Otros equipos',
  },
  teamsIndex: {
    eyebrow: (n: number) => `${n} equipos`,
    h1: 'Equipos de F1',
    h1b: (y: number) => `alineaciones ${y}`,
    lede: (y: number) => `Todos los equipos de la parrilla ${y}, sus pilotos y el año en que termina cada contrato.`,
  },
  driversIndex: {
    eyebrow: (n: number) => `${n} pilotos`,
    h1: 'Todos los pilotos',
    h1b: 'de la A a la Z',
    lede: (y: number) => `Todos los pilotos de la parrilla ${y} por apellido, con el año en que termina su contrato. Para verlos por duración, consulta`,
    ledeLink: 'la parrilla',
  },
  changesPage: {
    eyebrow: 'Noticias de contratos',
    h1: 'Últimas',
    h1b: 'novedades',
    lede: 'Todos los cambios de contratos que seguimos, del más reciente al más antiguo: fichajes, renovaciones, opciones y salidas. Cada uno enlaza a su fuente. Síguelos con el',
    rss: 'canal RSS',
    driverContract: (name: string) => `${name}: contrato`,
  },
  market: {
    eyebrow: 'El próximo mercado',
    h1: (y: number) => `Mercado de pilotos ${y}`,
    h1b: 'quién queda libre',
    lede: (y: number, y2: number) =>
      `Todos los pilotos cuyo contrato termina con la temporada ${y}, equipo por equipo, y quién tiene ya asiento para ${y2}. Se actualiza con cada cambio de contrato.`,
    statOut: (y: number) => `Sin contrato tras ${y}`,
    statSigned: (y: number) => `Con contrato para ${y} o más`,
    statBoth: 'Equipos con sus dos pilotos sin contrato',
    watch: 'A seguir de cerca',
    outTitle: (y: number) => `Sin contrato tras ${y}`,
    both: 'Ambos asientos',
    signedTitle: (y: number) => `Ya firmados para ${y}`,
    laterYears: 'Contratos que terminan más tarde',
  },
  gridPage: {
    eyebrow: 'Alineaciones confirmadas',
    h1: (y: number) => `Parrilla F1 ${y}`,
    h1b: 'todos los equipos y pilotos',
    lede: (y: number) => `Todos los equipos y pilotos confirmados para la temporada ${y} de Fórmula 1, con dorsales y el fin de cada contrato.`,
    colTeam: 'Equipo',
    colDriver: 'Piloto',
    colUntil: 'Contrato',
    newTitle: (y: number) => `Novedades para ${y}`,
    joins: (name: string, team: string) => `${name} llega a ${team} como novato.`,
    leavesTeam: (name: string, team: string) => `${name} deja ${team}.`,
    noChanges: 'No se han anunciado cambios en las alineaciones.',
  },
  ooc: {
    eyebrow: 'Contratos por año',
    h1: 'Sin contrato',
    h1b: (y: number) => `tras ${y}`,
    lede: (n: number, y: number) =>
      n === 1
        ? `Un piloto de Fórmula 1 tiene ahora un contrato que termina con la temporada ${y}.`
        : `${n} pilotos de Fórmula 1 tienen ahora contratos que terminan con la temporada ${y}.`,
    none: (y: number) => `No se conoce ningún contrato que termine con la temporada ${y}.`,
    otherYears: 'Otros años',
    q: (y: number) => `¿Qué pilotos de F1 se quedan sin contrato tras ${y}?`,
  },

  meta: {
    brand: 'F1 Contracts',
    homeTitle: (y: number) => `Contratos de pilotos de F1 ${y}: cuándo termina cada contrato`,
    homeDesc: (y: number) =>
      `Todos los contratos de pilotos de F1 para ${y} y más allá: Verstappen, Hamilton, Norris, Leclerc, Antonelli y toda la parrilla. Quién queda libre, opciones y fuentes.`,
    driverTitle: (d: Driver, team: string) =>
      d.status === 'leaving'
        ? `Contrato de ${d.name}: deja ${team} tras ${d.contractEnd}`
        : `Contrato de ${d.name}: ${team} ${es.contractShort(d)}`,
    driverDesc: (d: Driver, team: string, note: string) =>
      d.status === 'leaving'
        ? `${d.name} deja ${team} tras la temporada ${d.contractEnd}. ${note}`
        : `El contrato de ${d.name} con ${team} dura ${es.contractPhrase(d)}. ${note}`,
    teamTitle: (team: string, y: number, names: string) => `Pilotos de ${team} ${y}: contratos de ${names}`,
    teamDesc: (team: string, y: number, parts: string) => `Alineación de ${team} para ${y}: ${parts}. Con fuentes para cada contrato.`,
    changesTitle: 'Noticias de contratos de F1: fichajes, renovaciones y salidas',
    changesDesc: (items: string) => `Todos los cambios de contratos de pilotos de F1, del más reciente: ${items}.`,
    driversTitle: (y: number) => `Todos los pilotos de F1 y sus contratos (${y})`,
    driversDesc: (n: number, y: number) => `Fin de contrato de los ${n} pilotos de la parrilla de F1 ${y}, de la A a la Z, con opciones y fuentes.`,
    teamsTitle: (y: number) => `Equipos de F1 ${y}: alineaciones y contratos`,
    teamsDesc: (n: number, y: number) => `Los ${n} equipos de Fórmula 1 de ${y}, sus pilotos y cuándo termina cada contrato.`,
    marketTitle: (y2: number, y: number) => `Mercado de pilotos de F1 ${y2}: todos los pilotos sin contrato tras ${y}`,
    marketDesc: (n: number, y: number, names: string, y2: number) =>
      `${n} pilotos de F1 se quedan sin contrato tras ${y}, entre ellos ${names}. Quién queda libre, quién ya firmó para ${y2} y las opciones a seguir.`,
    gridTitle: (y: number) => `Parrilla de F1 ${y}: todos los equipos y pilotos confirmados`,
    gridDesc: (y: number, n: number) => `La parrilla completa de Fórmula 1 ${y}: los ${n} pilotos por equipo, dorsales, novatos y el fin de cada contrato.`,
    oocTitle: (y: number) => `Pilotos de F1 sin contrato tras ${y}`,
    oocDesc: (n: number, y: number, names: string) => `${n} piloto${n === 1 ? '' : 's'} de F1 con contrato hasta ${y}: ${names}. Con opciones y fuentes.`,
  },
};

export default es;
