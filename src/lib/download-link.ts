import type { Language } from '../i18n/locales';
import qrcode from 'qrcode-generator';

// Keep the order page, not a short-lived API token or storage download URL.
export function createPersonalDownloadLink(pageUrl: string, orderId: string, language: Language): string {
  const link = new URL('/success.html', pageUrl);
  link.searchParams.set('order_id', orderId);
  link.searchParams.set('lang', language);
  return link.href;
}

export function createDownloadLinkQr(link: string): string {
  const code = qrcode(0, 'Q');
  code.addData(link, 'Byte');
  code.make();
  // Four clear modules around the code; no request to an external QR service.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(code.createSvgTag({ cellSize: 6, margin: 24, scalable: true }))}`;
}
