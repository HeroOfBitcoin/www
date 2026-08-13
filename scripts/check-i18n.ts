import { SUPPORTED_LANGUAGES, type Language } from '../src/i18n/locales';
import { certificateTranslations } from '../src/i18n/certificate-translations';
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

const certificateCatalogs = certificateTranslations as unknown as Record<Language, TranslationNode>;
const certificateLanguages = Object.keys(certificateCatalogs).sort();
if (certificateLanguages.join('|') !== supportedLanguages.join('|')) {
  fail(`certificate catalog languages differ: expected ${supportedLanguages.join(', ')}, received ${certificateLanguages.join(', ')}`);
}

for (const language of SUPPORTED_LANGUAGES) {
  compareNode(`certificate.${language}`, certificateCatalogs.en, certificateCatalogs[language]);
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

const japaneseCatalog = JSON.stringify(catalogs.ja);
if (!/[ぁ-んァ-ヶ一-龯]/.test(japaneseCatalog)) {
  fail('Japanese catalog contains no Japanese characters');
}

if (!/[ぁ-んァ-ヶ一-龯]/.test(JSON.stringify(podcastTranslations.ja))) {
  fail('Japanese podcast catalog contains no Japanese characters');
}

if (!/[ぁ-んァ-ヶ一-龯]/.test(JSON.stringify(certificateTranslations.ja))) {
  fail('Japanese certificate catalog contains no Japanese characters');
}

for (const language of ['it', 'nl', 'fi'] as const) {
  if (JSON.stringify(catalogs[language]) === JSON.stringify(catalogs.en)) {
    fail(`${language} catalog must not duplicate English`);
  }
  if (JSON.stringify(podcastTranslations[language]) === JSON.stringify(podcastTranslations.en)) {
    fail(`podcast.${language} catalog must not duplicate English`);
  }
}

console.log(`✓ ${SUPPORTED_LANGUAGES.length} site, podcast, and certificate locale catalogs have matching keys, arrays, and placeholders`);
