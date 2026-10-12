import { digitalTranslations } from './i18n/digital-translations';
import { claimTranslations } from './i18n/claim-translations';
import type { Language } from './i18n/locales';
import './styles/claim.css';
export type ClaimStatus = 'available' | 'expired' | 'exhausted' | 'not_started' | 'invalid';
const states: ClaimStatus[] = ['available', 'expired', 'exhausted', 'not_started', 'invalid'];
export async function checkClaim(api: string, code: string): Promise<ClaimStatus> {
  const response = await fetch(`${api}/api/claim-status`, {
    method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'},
    body:JSON.stringify({code}), cache:'no-store', signal:AbortSignal.timeout(15000),
  });
  const payload = await response.json();
  if (!response.ok || !states.includes(payload.status)) throw new Error('Claim check unavailable');
  return payload.status;
}
export function createClaimControls(api: string, language: () => Language) {
  const input = document.querySelector<HTMLInputElement>('[data-discount-code]');
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-checkout]')];
  let status: ClaimStatus | null = null;
  let checkedCode = '';
  let generation = 0;
  let pending = false;
  let failed = false;
  const panels = buttons.map(button => {
    const panel = document.createElement('div'); panel.className = 'claim-info'; panel.hidden = true;
    const message = document.createElement('p'); message.setAttribute('role','status');
    const link = document.createElement('a'); link.className = 'offer-link';
    panel.append(message, link); button.before(panel); return {panel, message, link};
  });
  function render() {
    const copy = claimTranslations[language()];
    const code = input?.value.trim().toUpperCase() ?? '';
    const directClaim = new URL(location.href).searchParams.has('claim') && Boolean(code);
    const known = checkedCode === code && status !== null && status !== 'invalid';
    const mode = known || directClaim;
    document.documentElement.dataset.claim = String(mode);
    for (const node of document.querySelectorAll<HTMLElement>('[data-btc-price], .offer__reference, .offer__rate-note, .lugano-price, .lugano-buy > .lugano-fine')) {
      node.hidden = mode;
    }
    for (const {panel,message,link} of panels) {
      panel.hidden = !mode;
      message.textContent = failed ? digitalTranslations[language()].checkoutUnavailable : pending ? copy.checking : known && status === 'available' ? copy.free : status ? copy[status === 'available' ? 'free' : status] : copy.checking;
      link.hidden = pending || !status || status === 'available';
      link.href = `/?lang=${language()}#support`; link.textContent = copy.support;
    }
    for (const button of buttons) {
      button.disabled = button.getAttribute('aria-busy') === 'true' || pending || (mode && !failed && status !== 'available');
      if (mode && button.getAttribute('aria-busy') !== 'true') {
        const label = button.querySelector<HTMLElement>('[data-i18n]') ?? button;
        label.textContent = copy.redeem;
      }
    }
    for (const label of document.querySelectorAll<HTMLElement>('[data-i18n="buyWithBitcoin"]')) {
      if (mode && label.closest('button')?.getAttribute('aria-busy') !== 'true') label.textContent = copy.redeem;
    }
    for (const note of document.querySelectorAll<HTMLElement>('[data-i18n="receiptNote"]')) {
      if (mode) { note.hidden = false; note.textContent = copy.note; }
    }
  }
  async function refresh(): Promise<boolean> {
    const code = input?.value.trim().toUpperCase() ?? '';
    const attempt = ++generation;
    failed = false;
    // Short ordinary discount codes stay on the existing paid path.
    if (!/^[A-Z0-9]{12,64}$/.test(code)) { status=null; checkedCode=code; pending=false; render(); return true; }
    pending=true; checkedCode=code; status=null; render();
    try { const value = await checkClaim(api,code); if (attempt !== generation) return false; status=value; }
    catch { if (attempt !== generation) return false; pending=false; failed=true; render(); return false; }
    pending=false; render();
    return status === 'available' || (status === 'invalid' && !new URL(location.href).searchParams.has('claim'));
  }
  return {refresh, render};
}
