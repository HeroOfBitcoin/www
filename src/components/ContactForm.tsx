import React, { useRef, useState } from 'react';
import { Send } from 'lucide-react';

import { useLanguage } from '../i18n';
import { getApiBaseUrl } from '../lib/api';

const MAX_MESSAGE_LENGTH = 2000;

async function sendContactMessage(
  apiBaseUrl: string,
  email: string,
  message: string,
  contactStartedAt: number,
  website: string,
) {
  const response = await fetch(`${apiBaseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      message,
      website,
      contact_started_at: contactStartedAt,
    }),
  });

  const payload = (await response.json().catch(() => null)) as { error?: unknown } | null;
  if (!response.ok) {
    throw new Error(typeof payload?.error === 'string' ? payload.error : 'Could not send message');
  }
}

const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const apiBaseUrl = getApiBaseUrl();
  const contactStartedAtRef = useRef(Date.now());
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_MESSAGE_LENGTH - message.length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setError(null);

    try {
      await sendContactMessage(
        apiBaseUrl,
        email.trim(),
        message.trim(),
        contactStartedAtRef.current,
        website,
      );
      setEmail('');
      setMessage('');
      setWebsite('');
      contactStartedAtRef.current = Date.now();
      setStatus('sent');
    } catch (submitError) {
      setStatus('error');
      setError(submitError instanceof Error ? submitError.message : t.contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-4 max-w-xl border-2 border-black bg-white p-4 text-left"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-pixel text-[10px] uppercase text-black">{t.contact.title}</h2>
        <span className="font-mono text-[10px] text-gray-500">{remaining}</span>
      </div>
      <p className="mb-3 font-mono text-[11px] leading-relaxed text-gray-700">
        {t.contact.body}
      </p>
      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <label className="mb-3 block">
        <span className="mb-1 block font-pixel text-[9px] uppercase text-gray-800">
          {t.contact.emailLabel}
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t.contact.emailPlaceholder}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none"
          autoComplete="email"
          required
        />
      </label>
      <label className="mb-3 block">
        <span className="mb-1 block font-pixel text-[9px] uppercase text-gray-800">
          {t.contact.messageLabel}
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t.contact.messagePlaceholder}
          className="min-h-[132px] w-full resize-y border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none"
          maxLength={MAX_MESSAGE_LENGTH}
          required
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting || remaining < 0}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 py-2 font-pixel text-[10px] uppercase text-white transition-colors hover:bg-neutral-800 disabled:cursor-wait disabled:bg-neutral-700"
      >
        <Send size={14} />
        <span>{isSubmitting ? t.contact.sending : t.contact.submit}</span>
      </button>
      {status === 'sent' && (
        <p className="mt-3 border border-green-200 bg-green-50 px-3 py-2 font-mono text-[11px] text-green-700">
          {t.contact.success}
        </p>
      )}
      {status === 'error' && (
        <p className="mt-3 border border-red-200 bg-red-50 px-3 py-2 font-mono text-[11px] text-red-700">
          {error ?? t.contact.error}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
