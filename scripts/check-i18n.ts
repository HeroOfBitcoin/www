import { SUPPORTED_LANGUAGES, type Language } from '../src/i18n/locales';
import { podcastTranslations } from '../src/i18n/podcast-translations';
import { translations } from '../src/i18n/translations';

type TranslationNode = string | readonly TranslationNode[] | { readonly [key: string]: TranslationNode };

function fail(message: string): never {
  throw new Error(`[i18n] ${message}`);
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{[^}]+\}/g)].map(([token]) => token).sort();
}

function compareNode(path: string, source: TranslationNode, candidate: TranslationNode): void {
  if (typeof source === 'string') {
    if (typeof candidate !== 'string') {
      fail(`${path} must be a string`);
    }
    if (!candidate.trim()) {
      fail(`${path} must not be empty`);
    }
    const sourceTokens = placeholders(source);
    const candidateTokens = placeholders(candidate);
    if (sourceTokens.join('|') !== candidateTokens.join('|')) {
      fail(`${path} placeholders differ: expected ${sourceTokens.join(', ') || 'none'}, received ${candidateTokens.join(', ') || 'none'}`);
    }
    return;
  }

  if (Array.isArray(source)) {
    if (!Array.isArray(candidate)) {
      fail(`${path} must be an array`);
    }
    if (source.length !== candidate.length) {
      fail(`${path} array length differs: expected ${source.length}, received ${candidate.length}`);
    }
    source.forEach((item, index) => compareNode(`${path}[${index}]`, item, candidate[index]));
    return;
  }

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    fail(`${path} must be an object`);
  }

  const sourceKeys = Object.keys(source).sort();
  const candidateKeys = Object.keys(candidate).sort();
  if (sourceKeys.join('|') !== candidateKeys.join('|')) {
    fail(`${path} keys differ: expected ${sourceKeys.join(', ')}, received ${candidateKeys.join(', ')}`);
  }
  sourceKeys.forEach((key) => compareNode(
    `${path}.${key}`,
    source[key],
    (candidate as { readonly [key: string]: TranslationNode })[key],
  ));
}

const catalogs = translations as unknown as Record<Language, TranslationNode>;
const catalogLanguages = Object.keys(catalogs).sort();
const supportedLanguages = [...SUPPORTED_LANGUAGES].sort();
if (catalogLanguages.join('|') !== supportedLanguages.join('|')) {
  fail(`catalog languages differ: expected ${supportedLanguages.join(', ')}, received ${catalogLanguages.join(', ')}`);
}

for (const language of SUPPORTED_LANGUAGES) {
  compareNode(language, catalogs.en, catalogs[language]);
}

const podcastCatalogs = podcastTranslations as unknown as Record<Language, TranslationNode>;
const podcastLanguages = Object.keys(podcastCatalogs).sort();
if (podcastLanguages.join('|') !== supportedLanguages.join('|')) {
  fail(`podcast catalog languages differ: expected ${supportedLanguages.join(', ')}, received ${podcastLanguages.join(', ')}`);
}

for (const language of SUPPORTED_LANGUAGES) {
  compareNode(`podcast.${language}`, podcastCatalogs.en, podcastCatalogs[language]);

  const entries = Object.entries(podcastTranslations[language]);
  for (const [key, value] of entries) {
    if (value.length > 260) {
      fail(`podcast.${language}.${key} is too long for the landing-page layout (${value.length} characters)`);
    }
    if (/[<>]/.test(value)) {
      fail(`podcast.${language}.${key} must contain text, not HTML`);
    }
  }
}

const koreanCatalog = JSON.stringify(catalogs.ko);
if (!/[가-힣]/.test(koreanCatalog)) {
  fail('Korean catalog contains no Hangul');
}

if (!/[가-힣]/.test(JSON.stringify(podcastTranslations.ko))) {
  fail('Korean podcast catalog contains no Hangul');
}

const frenchCatalog = JSON.stringify(catalogs.fr);
if (!/[àâçéèêëîïôùûüÿœ]/i.test(frenchCatalog)) {
  fail('French catalog contains no French-specific characters');
}

if (!/[àâçéèêëîïôùûüÿœ]/i.test(JSON.stringify(podcastTranslations.fr))) {
  fail('French podcast catalog contains no French-specific characters');
}

console.log(`✓ ${SUPPORTED_LANGUAGES.length} site and podcast locale catalogs have matching keys, arrays, and placeholders`);
