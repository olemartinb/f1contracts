import type { Driver } from '../data';
import type { Dict } from './en';

const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;

const pt: Dict = {
  locale: 'pt-BR',
  list,

  contractPhrase: (d: Driver) => {
    if (d.status === 'leaving') return `sai após ${d.contractEnd}`;
    const base = `até ${d.optionBeyond ? 'pelo menos ' : ''}o fim da temporada ${d.contractEnd}`;
    if (d.optionYear) return `${base}, com opção para ${d.optionYear}`;
    if (d.optionBeyond) return `${base}, com opção de renovação`;
    return base;
  },
  contractShort: (d: Driver) => {
    if (d.status === 'leaving') return `sai após ${d.contractEnd}`;
    if (d.status === 'unsigned') return `contrato de ${d.contractEnd} ainda não assinado`;
    if (d.optionYear) return `até ${d.contractEnd} (opção ${d.optionYear})`;
    if (d.optionBeyond) return `até ${d.contractEnd}+`;
    return `até ${d.contractEnd}`;
  },
  contractSummary: (d: Driver) => {
    const parts = [`O contrato termina após ${d.contractEnd}`];
    if (d.optionYear) parts.push(`opção para ${d.optionYear}`);
    if (d.optionBeyond) parts.push('opção de renovação');
    if (d.status === 'unsigned') parts.push('confirmado pela equipe, mas ainda não assinado');
    if (d.basis === 'reported') parts.push('duração segundo a imprensa, não oficial');
    return parts.join(', ');
  },
  endLabel: (d: Driver) =>
    d.status === 'leaving' ? 'Sai' : d.status === 'unsigned' ? 'Pendente' : d.basis === 'reported' ? 'Imprensa' : 'Assinado até',
  endLabelLong: (d: Driver) =>
    d.status === 'leaving'
      ? 'Fim do contrato'
      : d.status === 'unsigned'
        ? 'Confirmado para'
        : d.basis === 'reported'
          ? 'Até (segundo a imprensa)'
          : 'Assinado até',

  rookie: 'Estreante',
  unsigned: 'Não assinado',
  notYetSigned: 'Ainda não assinado',
  leaving: 'De saída',
  tbc: 'A confirmar',
  withOption: 'com opção',
  option: (y: number) => `Opção ${y}`,
  source: 'Fonte',
  details: 'Detalhes',
  closeDetails: (name: string) => `Fechar detalhes de ${name}`,
  fullPage: 'Página completa do contrato →',
  advertisement: 'Publicidade',

  nav: { grid: 'Grid', market: 'Mercado', teams: 'Equipes', changes: 'Novidades', faq: 'Perguntas' },
  crumbs: {
    home: 'Início',
    drivers: 'Pilotos',
    teams: 'Equipes',
    changes: 'Novidades',
    market: (y: number) => `Mercado de pilotos ${y}`,
    grid: (y: number) => `Grid ${y}`,
    outOfContract: (y: number) => `Sem contrato após ${y}`,
  },
  footer: {
    disclaimer: (date: string) =>
      `Site não oficial, sem ligação com a Fórmula 1, a FIA ou qualquer equipe. Contratos mudam; cada informação tem link para a fonte. Última verificação: ${date}.`,
    teams: 'Equipes',
    site: 'Site',
    grid: (y: number) => `O grid de ${y}`,
    allDrivers: 'Todos os pilotos',
    allTeams: 'Todas as equipes',
    market: (y: number) => `Mercado de pilotos ${y}`,
    outOfContract: 'Sem contrato por ano',
    changes: 'Últimas novidades',
    rss: 'Feed RSS',
    faq: 'Perguntas frequentes',
    privacy: 'Privacidade (em inglês)',
    language: 'Idioma',
  },

  gridUi: {
    order: 'Ordenar o grid',
    byContract: 'Por duração',
    byTeam: 'Por equipe',
    filterTeam: 'Filtrar por equipe',
    allTeams: 'Todas as equipes',
    search: 'Buscar pilotos',
    searchPlaceholder: 'Buscar piloto ou equipe',
    listLabel: 'Pilotos ordenados no grid',
    noMatch: (q: string) => `Nenhum piloto corresponde a “${q}”.`,
    legendContracted: 'Temporadas com contrato',
    legendOption: 'Ano de opção',
    legendUnsigned: 'Ainda não assinado',
    legendReportedTag: 'Imprensa',
    legendReported: 'Duração divulgada pela imprensa',
  },

  home: {
    skip: 'Ir para o grid',
    updated: 'Atualizado',
    h1: 'Contratos dos pilotos de F1',
    h1b: (y: number) => `${y} e além`,
    lede: 'Todo o grid da Fórmula 1, ordenado pelo tempo de contrato de cada piloto. O contrato mais longo larga na pole. Toque em um piloto para ver os detalhes e a fonte.',
    statSigned: (y: number) => `Vagas assinadas para ${y}`,
    statOut: (y: number) => `Sem contrato após ${y}`,
    statLongest: (names: string) => `Contratos mais longos: ${names}`,
    statOfficial: 'Datas confirmadas oficialmente',
    gridEyebrow: 'O grid',
    gridTitle: (y: number) => `O grid de ${y}, por contrato`,
    gridLede: (y: number) =>
      `Cada quadro mostra as temporadas assinadas de cada piloto a partir de ${y}. As equipes costumam não divulgar a duração, então “Segundo a imprensa” indica que o ano final vem da mídia.`,
    marketEyebrow: 'O próximo mercado',
    marketTitle: (n: number, y: number) => `${n} pilotos sem contrato após ${y}`,
    marketLede: (y: number) => `Esses contratos terminam com a temporada ${y}, o que faz do mercado de ${y + 1} um dos maiores em anos.`,
    marketLink: (y: number) => `Ver o mercado de ${y} completo →`,
    leavingAfter: (y: number) => `Saem após ${y}`,
    latestEyebrow: 'Notícias de contratos',
    latestTitle: 'Últimas novidades',
    allChanges: 'Todas as novidades →',
    lineupsEyebrow: (y: number) => `Duplas de ${y}`,
    lineupsTitle: 'Equipe por equipe',
    lineupsLede: (n: number) => `As ${n} equipes e seus pilotos para a próxima temporada, com o ano em que cada contrato termina.`,
    numbersNote: (y: number) => `Os números são da temporada ${y}. Um “+” indica que o contrato inclui uma opção.`,
    faqEyebrow: 'Perguntas',
    faqTitle: 'Perguntas sobre contratos',
  },

  faq: {
    outAfterQ: (y: number) => `Quais pilotos de F1 ficam sem contrato após ${y}?`,
    outAfterA: (n: number, y: number, names: string) =>
      `${n} pilotos têm contratos que terminam após a temporada ${y}: ${names}. Alguns incluem opções da equipe ou do piloto.`,
    completeQ: (y: number) => `O grid da F1 de ${y} está completo?`,
    completeUnsigned: (y: number, names: string, count: number) =>
      `Todas as vagas de ${y} têm piloto. ${names} ${count === 1 ? 'foi confirmado' : 'foram confirmados'} pela equipe, mas ainda sem contrato assinado.`,
    completeYes: (n: number, y: number) => `Sim. As ${n} vagas de ${y} estão assinadas.`,
    leavingQ: (y: number) => `Quem deixa a F1 após a temporada ${y}?`,
    rookiesJoin: (names: string, count: number) => `${names} ${count === 1 ? 'chega ao grid como estreante' : 'chegam ao grid como estreantes'}.`,
    noLeaving: (y: number) => `Nenhum piloto confirmou saída após a temporada ${y}.`,
    whenEndsQ: (name: string) => `Quando termina o contrato de ${name}?`,
    whenEndsA: (name: string, team: string, phrase: string) => `${name} tem contrato com a ${team} ${phrase}.`,
    reportedNote: 'A duração exata não foi confirmada oficialmente, então a informação vem da imprensa.',
    longestQ: 'Quem tem o contrato mais longo da F1?',
    longestA: (names: string, count: number, y: number) =>
      `${names} ${count === 1 ? 'tem contrato' : 'têm contrato'} até o fim de ${y}, os mais longos do grid.`,
    sourceQ: 'De onde vêm essas informações?',
    sourceA:
      'Cada informação tem link para a fonte: anúncios das equipes quando existem e, se não, reportagens dos principais veículos de F1. As equipes muitas vezes não divulgam a duração, então o que está marcado “segundo a imprensa” é a melhor informação pública, não um dado confirmado. Este site não tem ligação com a Fórmula 1 nem com nenhuma equipe.',
    isLeavingQ: (name: string, team: string) => `${name} vai deixar a ${team}?`,
    yes: 'Sim.',
    officialQ: (name: string) => `A duração do contrato de ${name} é oficial?`,
    officialYes: (team: string, last: string) => `Sim. O ano final foi confirmado pela ${team} ou pelo próprio ${last}.`,
    officialNo: (team: string, src: string) => `Não. A ${team} não divulgou a duração, então o ano final vem da imprensa (${src}).`,
    teammateQ: (name: string, y: number) => `Quem é o companheiro de equipe de ${name} em ${y}?`,
    contractIn: (name: string, short: string) => `${name} (contrato ${short})`,
    numberQ: (name: string) => `Qual é o número de ${name}?`,
    numberA: (name: string, n: number, y: number) => `${name} correu com o número ${n} em ${y}.`,
    whoDrivesQ: (team: string, y: number) => `Quem corre pela ${team} em ${y}?`,
    teamEndsQ: (name: string, team: string) => `Quando termina o contrato de ${name} com a ${team}?`,
    teamEndsA: (name: string, phrase: string, reported: boolean) =>
      `${name} tem contrato ${phrase}. ${reported ? 'A duração vem da imprensa.' : 'O ano final é oficial.'}`,
    seatsQ: (y: number) => `Quantas vagas na F1 estão abertas para ${y}?`,
    seatsA: (signed: number, total: number, y: number, open: number) =>
      `${signed} de ${total} pilotos já têm contrato para ${y} ou depois, então até ${open} vagas podem mudar. Alguns contratos têm opções que a equipe ou o piloto podem exercer.`,
    bothQ: (y: number) => `Quais equipes têm os dois pilotos sem contrato após ${y}?`,
    bothA: (names: string, y: number) => `${names}. Os dois pilotos atuais têm contratos que terminam com a temporada ${y}.`,
    bothNone: (y: number) => `Nenhuma. Todas as equipes têm pelo menos um piloto com contrato além de ${y}.`,
    signedForQ: (y: number) => `Quem já tem contrato para ${y}?`,
    gridTeamsQ: (y: number) => `Quantas equipes e pilotos há no grid da F1 de ${y}?`,
    gridTeamsA: (teams: number, drivers: number, y: number) => `${teams} equipes e ${drivers} pilotos estão confirmados para a temporada ${y}.`,
    gridRookiesQ: (y: number) => `Quem são os estreantes do grid da F1 de ${y}?`,
    gridRookiesNone: (y: number) => `Nenhum estreante foi confirmado para ${y} ainda.`,
  },

  driver: {
    contract: 'contrato',
    leaves: (name: string, team: string, y: number) => `${name} deixa a ${team} após a temporada ${y}.`,
    underContract: (name: string, team: string, phrase: string) => `${name} tem contrato com a ${team} ${phrase}.`,
    factTeam: 'Equipe',
    factNumber: (y: number) => `Número (${y})`,
    factOption: 'Opção',
    factLength: 'Duração',
    optionNone: 'Nenhuma conhecida',
    optionYes: 'Sim',
    official: 'Oficial',
    reported: 'Imprensa',
    tba: 'A anunciar',
    detailsTitle: 'Os detalhes',
    newsTitle: 'Notícias do contrato',
    teammates: (n: number, y: number) => `${n > 1 ? 'Companheiros' : 'Companheiro'} em ${y}`,
    teamDrivers: (team: string, y: number) => `Pilotos da ${team} em ${y}`,
    alsoOut: (y: number) => `Também sem contrato após ${y}`,
    questions: 'Perguntas',
    seeGrid: (y: number) => `Ver todo o grid de ${y}`,
  },
  team: {
    h1b: (y: number) => `pilotos ${y}`,
    lede: (team: string, y: number) => `A dupla da ${team} para ${y} e quando termina o contrato de cada piloto. Toque em um piloto para ver todos os detalhes e a fonte.`,
    others: 'Outras equipes',
  },
  teamsIndex: {
    eyebrow: (n: number) => `${n} equipes`,
    h1: 'Equipes da F1',
    h1b: (y: number) => `duplas de ${y}`,
    lede: (y: number) => `Todas as equipes do grid de ${y}, seus pilotos e o ano em que cada contrato termina.`,
  },
  driversIndex: {
    eyebrow: (n: number) => `${n} pilotos`,
    h1: 'Todos os pilotos',
    h1b: 'de A a Z',
    lede: (y: number) => `Todos os pilotos do grid de ${y} por sobrenome, com o ano em que o contrato termina. Para ver por duração, confira`,
    ledeLink: 'o grid',
  },
  changesPage: {
    eyebrow: 'Notícias de contratos',
    h1: 'Últimas',
    h1b: 'novidades',
    lede: 'Todas as mudanças de contrato que acompanhamos, das mais recentes às mais antigas: contratações, renovações, opções e saídas. Cada uma tem link para a fonte. Acompanhe pelo',
    rss: 'feed RSS',
    driverContract: (name: string) => `${name}: contrato`,
  },
  market: {
    eyebrow: 'O próximo mercado',
    h1: (y: number) => `Mercado de pilotos ${y}`,
    h1b: 'quem fica livre',
    lede: (y: number, y2: number) =>
      `Todos os pilotos cujo contrato termina com a temporada ${y}, equipe por equipe, e quem já tem vaga garantida para ${y2}. Atualizado a cada mudança de contrato.`,
    statOut: (y: number) => `Sem contrato após ${y}`,
    statSigned: (y: number) => `Com contrato para ${y} ou depois`,
    statBoth: 'Equipes com os dois pilotos sem contrato',
    watch: 'Para ficar de olho',
    outTitle: (y: number) => `Sem contrato após ${y}`,
    both: 'As duas vagas',
    signedTitle: (y: number) => `Já assinados para ${y}`,
    laterYears: 'Contratos que terminam depois',
  },
  gridPage: {
    eyebrow: 'Duplas confirmadas',
    h1: (y: number) => `Grid da F1 ${y}`,
    h1b: 'todas as equipes e pilotos',
    lede: (y: number) => `Todas as equipes e pilotos confirmados para a temporada ${y} da Fórmula 1, com números e o fim de cada contrato.`,
    colTeam: 'Equipe',
    colDriver: 'Piloto',
    colUntil: 'Contrato',
    newTitle: (y: number) => `O que muda em ${y}`,
    joins: (name: string, team: string) => `${name} chega à ${team} como estreante.`,
    leavesTeam: (name: string, team: string) => `${name} deixa a ${team}.`,
    noChanges: 'Nenhuma mudança nas duplas foi anunciada.',
  },
  ooc: {
    eyebrow: 'Contratos por ano',
    h1: 'Sem contrato',
    h1b: (y: number) => `após ${y}`,
    lede: (n: number, y: number) =>
      n === 1
        ? `Um piloto da Fórmula 1 tem hoje um contrato que termina com a temporada ${y}.`
        : `${n} pilotos da Fórmula 1 têm hoje contratos que terminam com a temporada ${y}.`,
    none: (y: number) => `Não há contrato conhecido que termine com a temporada ${y}.`,
    otherYears: 'Outros anos',
    q: (y: number) => `Quais pilotos de F1 ficam sem contrato após ${y}?`,
  },

  meta: {
    brand: 'F1 Contracts',
    homeTitle: (y: number) => `Contratos dos pilotos de F1 ${y}: quando termina cada contrato`,
    homeDesc: (y: number) =>
      `Todos os contratos dos pilotos de F1 para ${y} e além: Verstappen, Hamilton, Norris, Leclerc, Antonelli e todo o grid. Quem fica sem contrato, opções e fontes.`,
    driverTitle: (d: Driver, team: string) =>
      d.status === 'leaving'
        ? `Contrato de ${d.name}: sai da ${team} após ${d.contractEnd}`
        : `Contrato de ${d.name}: ${team} ${pt.contractShort(d)}`,
    driverDesc: (d: Driver, team: string, note: string) =>
      d.status === 'leaving'
        ? `${d.name} deixa a ${team} após a temporada ${d.contractEnd}. ${note}`
        : `O contrato de ${d.name} com a ${team} vai ${pt.contractPhrase(d)}. ${note}`,
    teamTitle: (team: string, y: number, names: string) => `Pilotos da ${team} ${y}: contratos de ${names}`,
    teamDesc: (team: string, y: number, parts: string) => `Dupla da ${team} para ${y}: ${parts}. Com fontes para cada contrato.`,
    changesTitle: 'Notícias de contratos da F1: contratações, renovações e saídas',
    changesDesc: (items: string) => `Todas as mudanças de contratos de pilotos de F1, das mais recentes: ${items}.`,
    driversTitle: (y: number) => `Todos os pilotos de F1 e seus contratos (${y})`,
    driversDesc: (n: number, y: number) => `Fim de contrato dos ${n} pilotos do grid da F1 de ${y}, de A a Z, com opções e fontes.`,
    teamsTitle: (y: number) => `Equipes da F1 ${y}: duplas e contratos`,
    teamsDesc: (n: number, y: number) => `As ${n} equipes da Fórmula 1 em ${y}, seus pilotos e quando termina cada contrato.`,
    marketTitle: (y2: number, y: number) => `Mercado de pilotos da F1 ${y2}: todos sem contrato após ${y}`,
    marketDesc: (n: number, y: number, names: string, y2: number) =>
      `${n} pilotos de F1 ficam sem contrato após ${y}, entre eles ${names}. Quem fica livre, quem já assinou para ${y2} e as opções a acompanhar.`,
    gridTitle: (y: number) => `Grid da F1 ${y}: todas as equipes e pilotos confirmados`,
    gridDesc: (y: number, n: number) => `O grid completo da Fórmula 1 em ${y}: os ${n} pilotos por equipe, números, estreantes e o fim de cada contrato.`,
    oocTitle: (y: number) => `Pilotos de F1 sem contrato após ${y}`,
    oocDesc: (n: number, y: number, names: string) => `${n} piloto${n === 1 ? '' : 's'} de F1 com contrato até ${y}: ${names}. Com opções e fontes.`,
  },
};

export default pt;
