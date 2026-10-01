import { useId, useMemo, useRef, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { LOCALE_BY_LANGUAGE, type Language } from '../i18n/locales';
import { downloadLinkTranslations } from '../i18n/download-link-translations';
import { createPersonalDownloadLink, createDownloadLinkQr } from '../lib/download-link';

export default function DownloadLinkActions({ orderId, language, expiresAt }: { orderId: string; language: Language; expiresAt?: string }) {
  const copy = downloadLinkTranslations[language];
  const link = useMemo(() => createPersonalDownloadLink(window.location.href, orderId, language), [orderId, language]);
  const qr = useMemo(() => createDownloadLinkQr(link), [link]);
  const deadline = expiresAt && Number.isFinite(Date.parse(expiresAt))
    ? new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], { dateStyle: 'medium', timeStyle: 'long' }).format(new Date(expiresAt))
    : null;
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<'copied' | 'manualCopy' | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const shareData = { title: 'Hero of Bitcoin', url: link };
  const canShare = typeof navigator.share === 'function'
    && (typeof navigator.canShare !== 'function' || navigator.canShare(shareData));

  const selectLink = () => {
    input.current?.focus();
    input.current?.select();
    setFeedback('manualCopy');
  };

  const copyLink = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setFeedback(null);
    try {
      await navigator.clipboard.writeText(link);
      setFeedback('copied');
    } catch {
      selectLink();
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  const shareLink = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setFeedback(null);
    try {
      await navigator.share(shareData);
    } catch (error) {
      // Closing the native share sheet is not a failed purchase or download.
      if (!(error instanceof DOMException && error.name === 'AbortError')) selectLink();
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <section className="min-w-0 border-t-2 border-black/20 pt-4 mt-4 font-mono text-sm" aria-labelledby={`${inputId}-title`}>
      <h2 id={`${inputId}-title`} className="font-bold text-base mb-2">{copy.title}</h2>
      <p className="mb-3 text-green-950">{copy.body}</p>
      {deadline && <p className="mb-3 font-bold">{copy.validUntil}: <time dateTime={expiresAt}>{deadline}</time></p>}
      <label htmlFor={inputId} className="sr-only">{copy.label}</label>
      <input
        ref={input}
        id={inputId}
        type="url"
        readOnly
        value={link}
        spellCheck={false}
        autoCapitalize="none"
        onFocus={(event) => event.currentTarget.select()}
        onClick={(event) => event.currentTarget.select()}
        className="w-full min-w-0 border-2 border-black bg-white px-3 py-3 text-base text-black focus:outline-2 focus:outline-offset-2 focus:outline-black"
      />
      <div className="flex flex-wrap gap-3 mt-3">
        <button type="button" onClick={() => void copyLink()} disabled={busy}
          className="min-h-11 flex-1 inline-flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-3 font-bold text-black hover:bg-yellow-100 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          {feedback === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          <span>{copy.copy}</span>
        </button>
        {canShare && (
          <button type="button" onClick={() => void shareLink()} disabled={busy}
            className="min-h-11 flex-1 inline-flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-3 font-bold text-black hover:bg-yellow-100 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
            <Share2 size={18} aria-hidden="true" /><span>{copy.share}</span>
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="mt-2 text-green-950">{feedback ? copy[feedback] : ''}</p>
      <p className="text-xs leading-relaxed mt-3 text-green-950">{copy.access}</p>
      <p className="text-xs leading-relaxed mt-2 text-green-950">{copy.private}</p>
      <details className="mt-4">
        <summary className="min-h-11 cursor-pointer py-3 font-bold focus-visible:outline-2 focus-visible:outline-black">{copy.qrLabel}</summary>
        <figure className="mt-2 border-2 border-black bg-white p-3 text-center text-black">
          <img src={qr} alt={copy.label} className="mx-auto w-full max-w-64" data-download-qr />
          <figcaption className="text-xs leading-relaxed mt-2">
            <p>{copy.qrHint}</p>
            {deadline && <p className="font-bold mt-2">{copy.validUntil}: <time dateTime={expiresAt}>{deadline}</time></p>}
          </figcaption>
        </figure>
      </details>
    </section>
  );
}
