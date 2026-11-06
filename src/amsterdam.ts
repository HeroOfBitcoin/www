// Share the digital checkout and Lugano's conference layout without its event copy.
import './digital';
import './styles/lugano.css';
import './styles/amsterdam.css';
import { amsterdamPromoCopy, amsterdamPromoCountdown, AMSTERDAM_PROMO_CODE, AMSTERDAM_PROMO_END } from './amsterdam-promo';
import { isLanguage } from './i18n/locales';

function localizeLinks(): void {
  document.title = 'Hero of Bitcoin Digital | Amsterdam';
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('[data-amsterdam-language-link]')) {
    const url = new URL(anchor.href);
    url.searchParams.set('lang', document.documentElement.lang);
    anchor.href = url.href;
  }
}

localizeLinks();
document.querySelector('[data-language-picker]')?.addEventListener('change', localizeLinks);

const promo = document.querySelector<HTMLElement>('[data-amsterdam-promo]');
const savings = promo?.querySelector('[data-promo-savings]');
const code = promo?.querySelector('[data-promo-code]');
const ends = promo?.querySelector('[data-promo-ends]');
const countdown = promo?.querySelector<HTMLElement>('[data-promo-countdown]');
const apply = promo?.querySelector<HTMLButtonElement>('[data-promo-apply]');
const codeInput = document.querySelector<HTMLInputElement>('[data-discount-code]');
const codeDetails = codeInput?.closest<HTMLDetailsElement>('[data-discount]');

// Leave QR visitors in the dedicated claim flow, without a competing offer.
if (promo && savings && code && ends && countdown && apply && codeInput && codeDetails
    && !new URLSearchParams(location.search).has('claim') && Date.now() < AMSTERDAM_PROMO_END) {
  const getLanguage = () => {
    const language = document.documentElement.lang;
    return isLanguage(language) ? language : 'en';
  };

  const renderPromo = (): boolean => {
    const remaining = amsterdamPromoCountdown(Date.now(), getLanguage());
    promo.hidden = remaining === null;
    if (remaining === null) return false;
    countdown.textContent = remaining;
    return true;
  };

  const localizePromo = (): void => {
    const copy = amsterdamPromoCopy[getLanguage()];
    savings.textContent = copy.savings;
    ends.textContent = copy.ends;
    apply.textContent = copy.apply;
    renderPromo();
  };

  code.textContent = AMSTERDAM_PROMO_CODE;
  localizePromo();
  const interval = window.setInterval(() => {
    if (!renderPromo()) window.clearInterval(interval);
  }, 1_000);
  document.addEventListener('visibilitychange', renderPromo);
  window.addEventListener('pageshow', renderPromo);
  document.querySelector('[data-language-picker]')?.addEventListener('change', localizePromo);

  apply.addEventListener('click', () => {
    if (!renderPromo() || codeInput.disabled) return;
    codeInput.value = AMSTERDAM_PROMO_CODE;
    codeDetails.open = true;
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));
    codeInput.dispatchEvent(new Event('change', { bubbles: true }));
    codeInput.focus();
  });
}
