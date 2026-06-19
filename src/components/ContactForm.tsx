import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

import { useLanguage } from '../i18n';
import { getApiBaseUrl } from '../lib/api';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_POW_SOLUTION = 10_000_000;
const HASH_CHUNK_SIZE = 1500;

interface ContactChallenge {
  challenge_id: string;
  issued_at: number;
  expires_at: number;
  difficulty: number;
  signature: string;
  algorithm: 'sha256-leading-zero-bits-v1';
}

interface ContactProof {
  challenge: ContactChallenge;
  solution: number;
}

interface MinerVariant {
  id: string;
  spritesheetPath: string;
  stillPath: string;
  nonceOverlay: {
    x: number;
    y: number;
    width: number;
    height: number;
    textColorHex: string;
  };
}

const MINER_FRAME_WIDTH = 160;
const MINER_FRAME_HEIGHT = 144;
const MINER_FRAME_COUNT = 9;
const MINER_HASHING_FRAMES = [0, 1, 2, 3, 4, 5];

const MINER_VARIANTS: MinerVariant[] = [
  {
    id: 'a',
    spritesheetPath: '/assets/contact-proof/sprites/miner-variant-a-spritesheet.png',
    stillPath: '/assets/contact-proof/stills/miner-variant-a-still.png',
    nonceOverlay: { x: 104, y: 75, width: 23, height: 7, textColorHex: '#F2B33E' },
  },
  {
    id: 'b',
    spritesheetPath: '/assets/contact-proof/sprites/miner-variant-b-spritesheet.png',
    stillPath: '/assets/contact-proof/stills/miner-variant-b-still.png',
    nonceOverlay: { x: 33, y: 75, width: 23, height: 7, textColorHex: '#F2B84A' },
  },
  {
    id: 'c',
    spritesheetPath: '/assets/contact-proof/sprites/miner-variant-c-spritesheet.png',
    stillPath: '/assets/contact-proof/stills/miner-variant-c-still.png',
    nonceOverlay: { x: 104, y: 75, width: 23, height: 7, textColorHex: '#F1B947' },
  },
  {
    id: 'd',
    spritesheetPath: '/assets/contact-proof/sprites/miner-variant-d-spritesheet.png',
    stillPath: '/assets/contact-proof/stills/miner-variant-d-still.png',
    nonceOverlay: { x: 33, y: 75, width: 23, height: 7, textColorHex: '#E9AC39' },
  },
  {
    id: 'e',
    spritesheetPath: '/assets/contact-proof/sprites/miner-variant-e-spritesheet.png',
    stillPath: '/assets/contact-proof/stills/miner-variant-e-still.png',
    nonceOverlay: { x: 104, y: 75, width: 23, height: 7, textColorHex: '#E8AD42' },
  },
  {
    id: 'f',
    spritesheetPath: '/assets/contact-proof/sprites/miner-variant-f-spritesheet.png',
    stillPath: '/assets/contact-proof/stills/miner-variant-f-still.png',
    nonceOverlay: { x: 33, y: 75, width: 23, height: 7, textColorHex: '#E6A13A' },
  },
];

const DIGIT_GLYPHS: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
};

const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotateRight(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

function sha256Hex(input: string): string {
  const bytes = Array.from(new TextEncoder().encode(input));
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }
  for (let shift = 56; shift >= 0; shift -= 8) {
    bytes.push(Math.floor(bitLength / 2 ** shift) & 0xff);
  }

  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const words = new Array<number>(64);

  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const byteOffset = offset + index * 4;
      words[index] = (
        (bytes[byteOffset] << 24) |
        (bytes[byteOffset + 1] << 16) |
        (bytes[byteOffset + 2] << 8) |
        bytes[byteOffset + 3]
      ) >>> 0;
    }

    for (let index = 16; index < 64; index += 1) {
      const s0 = rotateRight(words[index - 15], 7) ^ rotateRight(words[index - 15], 18) ^ (words[index - 15] >>> 3);
      const s1 = rotateRight(words[index - 2], 17) ^ rotateRight(words[index - 2], 19) ^ (words[index - 2] >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + SHA256_K[index] + words[index]) >>> 0;
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map((value) => value.toString(16).padStart(8, '0')).join('');
}

function hasLeadingZeroBits(hexDigest: string, difficulty: number): boolean {
  let remaining = difficulty;
  for (const char of hexDigest) {
    const value = Number.parseInt(char, 16);
    const zeroBits = value === 0 ? 4 : Math.clz32(value) - 28;
    if (zeroBits >= remaining) {
      return true;
    }
    if (zeroBits < 4) {
      return false;
    }
    remaining -= 4;
  }
  return remaining <= 0;
}

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function selectMinerVariant(challengeId: string): MinerVariant {
  let hash = 0;
  for (let index = 0; index < challengeId.length; index += 1) {
    hash = (hash * 31 + challengeId.charCodeAt(index)) >>> 0;
  }
  return MINER_VARIANTS[hash % MINER_VARIANTS.length];
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    const handleChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

function MinerNonceDigits({
  digits,
  variant,
}: {
  digits: string;
  variant: MinerVariant;
}) {
  const slot = variant.nonceOverlay;
  const normalizedDigits = digits.padStart(4, '0').slice(-4);
  const glyphWidth = 5;
  const glyphHeight = 7;
  const spacing = 1;
  const totalWidth = normalizedDigits.length * glyphWidth + (normalizedDigits.length - 1) * spacing;
  const startX = slot.x + Math.max(0, Math.floor((slot.width - totalWidth) / 2));
  const startY = slot.y + Math.max(0, Math.floor((slot.height - glyphHeight) / 2));

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${MINER_FRAME_WIDTH} ${MINER_FRAME_HEIGHT}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {normalizedDigits.split('').flatMap((digit, digitIndex) => (
        (DIGIT_GLYPHS[digit] ?? DIGIT_GLYPHS['0']).flatMap((row, rowIndex) => (
          row.split('').map((pixel, columnIndex) => {
            if (pixel !== '1') {
              return null;
            }
            return (
              <rect
                key={`${digitIndex}-${rowIndex}-${columnIndex}`}
                x={startX + digitIndex * (glyphWidth + spacing) + columnIndex}
                y={startY + rowIndex}
                width="1"
                height="1"
                fill={slot.textColorHex}
              />
            );
          })
        ))
      ))}
    </svg>
  );
}

function PixelMiningScene({
  frameIndex,
  nonceDigits,
  variant,
  reducedMotion,
}: {
  frameIndex: number;
  nonceDigits: string;
  variant: MinerVariant;
  reducedMotion: boolean;
}) {
  const imagePath = reducedMotion ? variant.stillPath : variant.spritesheetPath;
  const transform = reducedMotion ? 'translateX(0)' : `translateX(-${frameIndex * (100 / MINER_FRAME_COUNT)}%)`;

  return (
    <div
      className="relative mx-auto w-full max-w-[480px] overflow-hidden border-2 border-black bg-black"
      style={{ aspectRatio: `${MINER_FRAME_WIDTH} / ${MINER_FRAME_HEIGHT}` }}
      aria-hidden="true"
    >
      <img
        src={imagePath}
        alt=""
        className="absolute left-0 top-0 h-full max-w-none select-none"
        draggable={false}
        style={{
          width: reducedMotion ? '100%' : `${MINER_FRAME_COUNT * 100}%`,
          imageRendering: 'pixelated',
          transform,
        }}
      />
      <MinerNonceDigits digits={nonceDigits} variant={variant} />
    </div>
  );
}

async function fetchContactChallenge(apiBaseUrl: string): Promise<ContactChallenge> {
  const response = await fetch(`${apiBaseUrl}/api/contact/challenge`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  const payload = (await response.json().catch(() => null)) as ContactChallenge | null;
  if (!response.ok || !payload) {
    throw new Error('Could not prepare contact proof');
  }
  return payload;
}

async function solveContactChallenge(
  challenge: ContactChallenge,
  onAttempt: (attempt: number) => void,
): Promise<number> {
  for (let solution = 0; solution <= MAX_POW_SOLUTION; solution += 1) {
    const digest = sha256Hex(`${challenge.challenge_id}:${solution}`);
    if (hasLeadingZeroBits(digest, challenge.difficulty)) {
      onAttempt(solution);
      return solution;
    }

    if (solution % HASH_CHUNK_SIZE === 0) {
      onAttempt(solution);
      await waitForFrame();
    }
  }

  throw new Error('Could not prepare contact proof');
}

async function sendContactMessage(
  apiBaseUrl: string,
  email: string,
  message: string,
  contactStartedAt: number,
  website: string,
  proof: ContactProof,
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
      contact_challenge_id: proof.challenge.challenge_id,
      contact_challenge_issued_at: proof.challenge.issued_at,
      contact_challenge_difficulty: proof.challenge.difficulty,
      contact_challenge_signature: proof.challenge.signature,
      contact_challenge_solution: proof.solution,
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const contactStartedAtRef = useRef(Date.now());
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMiningProof, setIsMiningProof] = useState(false);
  const [proofAttempt, setProofAttempt] = useState(0);
  const [proofFrameIndex, setProofFrameIndex] = useState(0);
  const [proofVariant, setProofVariant] = useState<MinerVariant>(MINER_VARIANTS[0]);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_MESSAGE_LENGTH - message.length;
  const proofNonceDigits = String(proofAttempt % 10000).padStart(4, '0');

  useEffect(() => {
    if (!isMiningProof || prefersReducedMotion) {
      setProofFrameIndex(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProofFrameIndex((currentFrame) => (
        MINER_HASHING_FRAMES[(currentFrame + 1) % MINER_HASHING_FRAMES.length]
      ));
    }, 140);

    return () => window.clearInterval(interval);
  }, [isMiningProof, prefersReducedMotion]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsMiningProof(true);
    setProofAttempt(0);
    setProofFrameIndex(0);
    setStatus('idle');
    setError(null);

    try {
      const challenge = await fetchContactChallenge(apiBaseUrl);
      setProofVariant(selectMinerVariant(challenge.challenge_id));
      const solution = await solveContactChallenge(challenge, setProofAttempt);
      setIsMiningProof(false);
      await sendContactMessage(
        apiBaseUrl,
        email.trim(),
        message.trim(),
        contactStartedAtRef.current,
        website,
        { challenge, solution },
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
      setIsMiningProof(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto mb-4 max-w-xl border-2 border-black bg-white p-4 text-left"
    >
      {isMiningProof && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center border-2 border-black bg-white/95 p-4"
          role="status"
          aria-live="polite"
          aria-label={t.contact.mining}
        >
          <div className="w-full max-w-[520px] border-2 border-black bg-[#ffc400] p-3">
            <PixelMiningScene
              frameIndex={proofFrameIndex}
              nonceDigits={proofNonceDigits}
              variant={proofVariant}
              reducedMotion={prefersReducedMotion}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-pixel text-[9px] uppercase text-black">{t.contact.proofTitle}</span>
              <span className="font-mono text-[10px] text-black">{proofNonceDigits}</span>
            </div>
            <p className="mt-2 font-mono text-[10px] leading-relaxed text-black">
              {t.contact.proofBody}
            </p>
          </div>
        </div>
      )}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-pixel text-[10px] uppercase text-black">{t.contact.title}</h2>
        <span className="font-mono text-[10px] text-gray-500">{remaining}</span>
      </div>
      <p className="mb-3 font-mono text-[11px] leading-relaxed text-gray-700">
        {t.contact.body}
      </p>
      <div className="hidden" aria-hidden="true">
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
        <span>{isMiningProof ? t.contact.mining : isSubmitting ? t.contact.sending : t.contact.submit}</span>
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
