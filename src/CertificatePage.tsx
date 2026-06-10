import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ExternalLink, RefreshCcw, ShieldCheck } from 'lucide-react';

import PixelCard from './components/ui/PixelCard';
import { getApiBaseUrl } from './lib/api';

type CertificateStatus = 'active' | 'revoked';

interface AuthenticityCertificateResponse {
  certificate_id: string;
  status: CertificateStatus;
  title: string;
  grade: string;
  cgc_serial: string;
  cgc_url: string;
  release_name: string;
  release_variant: string;
  release_year: number;
  authenticated_by: string;
  authenticated_at: string;
  front_image_sha256: string;
  back_image_sha256: string;
  payload_signature: string;
  updated_at: string;
  population?: {
    source: string;
    total: number;
    grade_count: number;
    updated_at: string | null;
    grades: Array<{
      grade: string;
      count: number;
    }>;
  };
  front_image_url?: string;
  back_image_url?: string;
  image_url_expires_in_seconds?: number;
}

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

const SCAN_CODE_PATTERN = /^[A-Za-z0-9_-]{22}$/;

function getScanCode(): string | null {
  return new URLSearchParams(window.location.search).get('s')?.trim() || null;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date);
}

function shortHash(value: string): string {
  return `${value.slice(0, 12)}...${value.slice(-8)}`;
}

function copyLabel(count: number): string {
  return count === 1 ? 'copy' : 'copies';
}

const CertificatePage: React.FC = () => {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const scanCode = useMemo(() => getScanCode(), []);
  const [certificate, setCertificate] = useState<AuthenticityCertificateResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Hero of Bitcoin - Authenticity Certificate';
  }, []);

  const loadCertificate = async () => {
    if (!scanCode || !SCAN_CODE_PATTERN.test(scanCode)) {
      setCertificate(null);
      setLoadState('not-found');
      setError(null);
      return;
    }

    setLoadState('loading');
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/authenticity/${encodeURIComponent(scanCode)}`);
      const payload = (await response.json().catch(() => null)) as
        | AuthenticityCertificateResponse
        | { error?: string }
        | null;

      if (response.status === 404 || response.status === 400) {
        setCertificate(null);
        setLoadState('not-found');
        return;
      }

      if (!response.ok || !payload || typeof (payload as AuthenticityCertificateResponse).status !== 'string') {
        throw new Error(
          payload && typeof (payload as { error?: string }).error === 'string'
            ? (payload as { error: string }).error
            : 'Could not load this certificate right now.',
        );
      }

      setCertificate(payload as AuthenticityCertificateResponse);
      setLoadState('ready');
    } catch (loadError) {
      setCertificate(null);
      setLoadState('error');
      setError(loadError instanceof Error ? loadError.message : 'Could not load this certificate right now.');
    }
  };

  useEffect(() => {
    void loadCertificate();
  }, [apiBaseUrl, scanCode]);

  const isRevoked = certificate?.status === 'revoked';
  const isActive = certificate?.status === 'active';

  return (
    <div className="min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-0 relative">
      <div className="w-full max-w-5xl bg-yellow-400 min-h-[80vh] pixel-shadow border-4 border-black relative overflow-hidden">
        <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <img
                src="/assets/images/HoB_Logo_only.png"
                alt="Hero of Bitcoin"
                className="h-12 md:h-14 w-auto mix-blend-multiply"
              />
              <div className="hidden md:block">
                <p className="font-pixel text-[10px] uppercase">Authenticity Certificate</p>
                <p className="text-xs font-mono text-yellow-900">Verified graded copy record</p>
              </div>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </a>
          </div>
        </header>

        <main className="p-4 md:p-8 bg-[#f8f9fa] min-h-[calc(80vh-92px)]">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="font-pixel text-[10px] uppercase tracking-widest text-yellow-700">NFC Scan Result</p>
                <h1 className="mt-2 font-pixel text-xl md:text-3xl leading-relaxed">
                  {isActive ? 'AUTHENTICATED COPY' : isRevoked ? 'CERTIFICATE REVOKED' : 'CERTIFICATE CHECK'}
                </h1>
              </div>
              <button
                type="button"
                onClick={loadCertificate}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
              >
                <RefreshCcw size={14} />
                <span>Refresh</span>
              </button>
            </div>

            {loadState === 'loading' && (
              <PixelCard variant="info" title="Checking">
                <p className="font-mono text-sm text-gray-700">
                  Checking the Hero of Bitcoin authenticity registry.
                </p>
              </PixelCard>
            )}

            {loadState === 'not-found' && (
              <PixelCard variant="alert" title="Certificate not found">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.95fr)] lg:items-center">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="shrink-0 text-red-600" size={40} />
                      <div className="space-y-3">
                        <p className="font-mono text-sm text-gray-700">
                          This NFC code does not match an active Hero of Bitcoin authenticity certificate.
                        </p>
                        <p className="font-mono text-sm text-gray-700">
                          Check that the URL came from the physical tag attached to the graded copy. If this page
                          still appears, treat the copy as unverified.
                        </p>
                      </div>
                    </div>
                    <div className="border-2 border-red-700 bg-red-50 p-3 font-mono text-sm text-red-800">
                      Do not rely on this NFC tag as proof of authenticity.
                    </div>
                  </div>

                  <div className="border-4 border-black bg-black p-2 pixel-shadow-sm">
                    <img
                      src="/assets/images/certificate-rejected.png"
                      alt="Signature rejected warning artwork"
                      className="w-full border-2 border-orange-900 bg-black"
                    />
                  </div>
                </div>
              </PixelCard>
            )}

            {loadState === 'error' && (
              <PixelCard variant="alert" title="Check failed">
                <p className="font-mono text-sm text-gray-700">
                  {error ?? 'Could not load this certificate right now.'}
                </p>
              </PixelCard>
            )}

            {certificate && loadState === 'ready' && (
              <div className="space-y-6">
                <PixelCard variant={isRevoked ? 'alert' : 'success'} title={isRevoked ? 'Revoked' : 'Authenticated'}>
                  <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {isRevoked ? (
                          <AlertTriangle className="shrink-0 text-red-600" size={42} />
                        ) : (
                          <ShieldCheck className="shrink-0 text-green-600" size={42} />
                        )}
                        <div>
                          <p className="font-pixel text-sm md:text-base leading-relaxed">{certificate.title}</p>
                          <p className="mt-2 font-mono text-sm text-gray-700">
                            {certificate.release_name} / {certificate.release_variant} / {certificate.release_year}
                          </p>
                        </div>
                      </div>

                      {isRevoked && (
                        <div className="border-2 border-red-600 bg-red-50 p-3 font-mono text-sm text-red-800">
                          This certificate was revoked by Hero of Bitcoin. Do not rely on this NFC tag for
                          authenticity.
                        </div>
                      )}

                      <dl className="grid sm:grid-cols-2 gap-3 text-sm font-mono text-gray-800">
                        <div className="border-2 border-black bg-white p-3">
                          <dt className="font-bold uppercase">Certificate ID</dt>
                          <dd className="mt-1 break-all">{certificate.certificate_id}</dd>
                        </div>
                        <div className="border-2 border-black bg-white p-3">
                          <dt className="font-bold uppercase">CGC Serial</dt>
                          <dd className="mt-1 break-all">{certificate.cgc_serial}</dd>
                        </div>
                        <div className="border-2 border-black bg-white p-3">
                          <dt className="font-bold uppercase">Grade</dt>
                          <dd className="mt-1">{certificate.grade}</dd>
                        </div>
                        <div className="border-2 border-black bg-white p-3">
                          <dt className="font-bold uppercase">Authenticated</dt>
                          <dd className="mt-1">
                            {formatDate(certificate.authenticated_at)} by {certificate.authenticated_by}
                          </dd>
                        </div>
                      </dl>

                      {isActive && certificate.population && certificate.population.total > 0 && (
                        <div className="border-2 border-black bg-black p-4 text-white">
                          <p className="font-pixel text-[10px] uppercase text-yellow-300">
                            Official graded population
                          </p>
                          <p className="mt-3 font-mono text-sm text-gray-100">
                            Hero of Bitcoin tracks this population from team grading records. CGC does not
                            currently publish this game-specific population report.
                          </p>
                          <p className="mt-3 font-mono text-sm text-gray-100">
                            Grade {certificate.grade}: {certificate.population.grade_count}{' '}
                            {copyLabel(certificate.population.grade_count)} out of {certificate.population.total}{' '}
                            official graded {copyLabel(certificate.population.total)}.
                          </p>
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {certificate.population.grades.map((entry) => (
                              <div key={entry.grade} className="border-2 border-yellow-300 bg-yellow-300 p-2 text-black">
                                <p className="font-pixel text-[9px]">Grade {entry.grade}</p>
                                <p className="mt-2 font-mono text-lg font-bold">
                                  {entry.count} {copyLabel(entry.count)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-2 border-black bg-yellow-100 p-4">
                      <p className="font-pixel text-[10px] uppercase mb-3">Compare before buying</p>
                      <ul className="space-y-2 font-mono text-sm text-yellow-950">
                        <li>Confirm the CGC serial and grade match the slab label.</li>
                        <li>Compare front and back photos with the exact copy in hand.</li>
                        <li>Check label alignment, slab condition, and visible marks.</li>
                        <li>Use the CGC link as an external serial reference.</li>
                      </ul>
                      <a
                        href={certificate.cgc_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-black bg-black text-white hover:bg-gray-800 transition-colors font-pixel text-[10px]"
                      >
                        <ExternalLink size={14} />
                        <span>Open CGC Record</span>
                      </a>
                    </div>
                  </div>
                </PixelCard>

                {isActive && certificate.front_image_url && certificate.back_image_url && (
                  <PixelCard title="Copy photos">
                    <div className="grid md:grid-cols-2 gap-4">
                      <figure className="border-2 border-black bg-white p-3">
                        <img
                          src={certificate.front_image_url}
                          alt={`${certificate.certificate_id} front`}
                          className="w-full h-auto border-2 border-black bg-gray-100"
                        />
                        <figcaption className="mt-3 font-mono text-xs text-gray-600">
                          Front photo hash: {shortHash(certificate.front_image_sha256)}
                        </figcaption>
                      </figure>
                      <figure className="border-2 border-black bg-white p-3">
                        <img
                          src={certificate.back_image_url}
                          alt={`${certificate.certificate_id} back`}
                          className="w-full h-auto border-2 border-black bg-gray-100"
                        />
                        <figcaption className="mt-3 font-mono text-xs text-gray-600">
                          Back photo hash: {shortHash(certificate.back_image_sha256)}
                        </figcaption>
                      </figure>
                    </div>
                    <p className="mt-4 font-mono text-xs text-gray-600">
                      Photo links are temporary. Refresh the certificate if the images expire.
                    </p>
                  </PixelCard>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-10">
        <div className="w-full h-full bg-neutral-900 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </div>
  );
};

export default CertificatePage;
