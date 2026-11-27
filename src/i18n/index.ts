// Language handling. Pages render one language at a time (pre-rendering is synchronous), so the
// current language is a module-level setting rather than React context.
import type { Change, Driver } from '../data';
import en, { type Dict } from './en';
import es from './es';
import pt from './pt';
import de from './de';
import nl from './nl';
import esContent from './content/es.json';
import ptContent from './content/pt.json';
import deContent from './content/de.json';
import nlContent from './content/nl.json';

export type Lang = 'en' | 'es' | 'pt' | 'de' | 'nl';

export const LANGS: { code: Lang; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'nl', name: 'Nederlands' },
];

const DICTS: Record<Lang, Dict> = { en, es, pt, de, nl };

interface Content {
  notes: Record<string, string>;
  changes: Record<string, string>;
}
const CONTENT: Partial<Record<Lang, Content>> = { es: esContent, pt: ptContent, de: deContent, nl: nlContent };

let current: Lang = 'en';

export const isLang = (s: string | null | undefined): s is Lang => LANGS.some((l) => l.code === s);
export function setLang(lang: Lang) {
  current = lang;
}
export const lang = () => current;
export const t = () => DICTS[current];

/** Prefix a site path with the current language: "/drivers/x" -> "/es/drivers/x", "/#grid" -> "/es#grid". */
export function href(path: string, to: Lang = current) {
  if (to === 'en') return path;
  const [p, hash] = path.split('#');
  const base = p === '/' || p === '' ? `/${to}` : `/${to}${p}`;
  return hash ? `${base}#${hash}` : base;
}

/** The same page in another language. `path` is the English (unprefixed) path. */
export const altHref = (path: string, to: Lang) => href(path, to);

export const changeKey = (c: Change) => `${c.date}|${c.driver ?? c.team ?? ''}`;

export const noteOf = (d: Driver) => CONTENT[current]?.notes[d.id] ?? d.note;
export const changeText = (c: Change) => CONTENT[current]?.changes[changeKey(c)] ?? c.text;

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(t().locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(t().locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatChangeDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d ?? 1, 12));
  return dt.toLocaleDateString(t().locale, {
    ...(d ? { day: 'numeric' } : {}),
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Translations missing for a language, so the build can flag them. */
export function missingTranslations(drivers: Driver[], changes: Change[]) {
  const missing: string[] = [];
  for (const l of LANGS) {
    const c = CONTENT[l.code];
    if (!c) continue;
    for (const d of drivers) if (!c.notes[d.id]) missing.push(`${l.code}: note for ${d.id}`);
    for (const ch of changes) if (!c.changes[changeKey(ch)]) missing.push(`${l.code}: change ${changeKey(ch)}`);
  }
  return missing;
}

let currentPath = '/';
/** The English (unprefixed) path of the page being rendered, for the language switcher and hreflang. */
export function setPath(path: string) {
  currentPath = path;
}
export const pagePath = () => currentPath;
