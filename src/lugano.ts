// Use the same server prices, checkout controller and translated purchase copy as /digital/.
import './digital';
import './styles/lugano.css';
import { isLanguage } from './i18n/locales';
import { luganoTranslations, type LuganoTranslation } from './i18n/lugano-translations';

function applyEventCopy(): void {
  const value = document.documentElement.lang;
  const language = isLanguage(value) ? value : 'en';
  const copy = luganoTranslations[language];
  document.title = 'Hero of Bitcoin | Plan ₿ Forum Lugano 2026';
  document.querySelectorAll<HTMLElement>('[data-lugano]').forEach((node) => {
    const key = node.dataset.lugano as keyof LuganoTranslation;
    if (key in copy) node.textContent = copy[key];
  });
  document.querySelectorAll<HTMLImageElement>('[data-lugano-alt]').forEach((node) => {
    const key = node.dataset.luganoAlt as keyof LuganoTranslation;
    if (key in copy) node.alt = copy[key];
  });
  document.querySelectorAll<HTMLElement>('[data-lugano-aria]').forEach((node) => {
    const key = node.dataset.luganoAria as keyof LuganoTranslation;
    if (key in copy) node.setAttribute('aria-label', copy[key]);
  });
  const date = copy.eventDate;
  const dateNode = document.querySelector('[data-event-date]');
  if (dateNode) dateNode.textContent = date;
  const description = `Hero of Bitcoin · Plan ₿ Forum · Lugano · ${date}. ${copy.intro}`;
  document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach((node) => node.setAttribute('content', description));
  document.querySelectorAll<HTMLAnchorElement>('[data-language-link]').forEach((node) => {
    const url = new URL(node.href);
    url.searchParams.set('lang', language);
    node.href = `${url.pathname}${url.search}${url.hash}`;
  });
}

applyEventCopy();
document.querySelector('[data-language-picker]')?.addEventListener('change', applyEventCopy);
