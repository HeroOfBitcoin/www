import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Language } from '../i18n/locales';
import { orderReferenceTranslations } from '../i18n/order-reference-translations';

export default function CopyOrderReference({ reference, language }: { reference: string; language: Language }) {
  const text = orderReferenceTranslations[language];
  const referenceNode = useRef<HTMLSpanElement>(null);
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<'copied' | 'manualCopy' | null>(null);

  const copyReference = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setFeedback(null);
    try {
      await navigator.clipboard.writeText(reference);
      setFeedback('copied');
    } catch {
      const node = referenceNode.current;
      if (node) {
        node.focus({ preventScroll: true });
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setFeedback('manualCopy');
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <>
      <span ref={referenceNode} tabIndex={-1} className="block break-all select-all focus:outline-2 focus:outline-offset-2 focus:outline-black">{reference}</span>
      <button type="button" onClick={() => void copyReference()} disabled={busy}
        className="mt-2 min-h-11 inline-flex max-w-full items-center justify-center gap-2 border border-black bg-white px-3 py-2 text-left text-sm font-bold text-black hover:bg-yellow-100 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
        {feedback === 'copied' ? <Check size={16} className="shrink-0" aria-hidden="true" /> : <Copy size={16} className="shrink-0" aria-hidden="true" />}
        <span>{text.copy}</span>
      </button>
      <span role="status" aria-live="polite" className="block text-xs mt-1 text-gray-700">{feedback ? text[feedback] : ''}</span>
    </>
  );
}
