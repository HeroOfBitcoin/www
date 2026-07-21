import { SUPPORTED_LANGUAGES, type Language } from '../src/i18n/locales';
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

const koreanCatalog = JSON.stringify(catalogs.ko);
if (!/[가-힣]/.test(koreanCatalog)) {
  fail('Korean catalog contains no Hangul');
}

console.log(`✓ ${SUPPORTED_LANGUAGES.length} locale catalogs have matching keys, arrays, and placeholders`);
