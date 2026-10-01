// Use the same server prices, checkout controller and translated purchase copy as /digital/.
import './digital';
import './styles/lugano.css';

function setEventTitle(): void { document.title = 'Hero of Bitcoin | Lugano 2026'; }
setEventTitle();
document.querySelector('[data-language-picker]')?.addEventListener('change', setEventTitle);
