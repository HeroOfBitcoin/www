function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname.endsWith('.nip.io')
    || hostname.endsWith('.localtest.me')
    || hostname.endsWith('.lvh.me')
  );
}

export function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  if (isLocalHostname(window.location.hostname)) {
    return 'http://localhost:3000';
  }

  return 'https://hero-of-bitcoin-digital.fly.dev';
}
