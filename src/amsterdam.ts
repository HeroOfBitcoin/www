// Share the digital checkout and Lugano's conference layout without its event copy.
import './digital';
import './styles/lugano.css';
import './styles/amsterdam.css';

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
