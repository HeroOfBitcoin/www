import React, { useState, useEffect } from 'react';
import PixelCard from './ui/PixelCard';
import { type Language, useLanguage } from '../i18n';
import { getApiBaseUrl } from '../lib/api';
import { Star, ShieldCheck, ShoppingCart, Sticker, Gamepad2, Zap, HardDrive, ChevronDown, ChevronUp, HelpCircle, AlertTriangle, FolderOpen, Disc, Link, BookOpen, Image, Award, Shield, Truck } from 'lucide-react';

/*
  =============================================================================
  COPIARO PRODUCT LINKS
  =============================================================================
  Direct links to product pages on Copiaro store.
  LINK_PHYSICAL_CARTRIDGE: Physical Game Boy cartridge collector's edition
  LINK_R36S_DEVICE: R36S handheld console with Hero of Bitcoin pre-installed
  =============================================================================
*/
const LINK_PHYSICAL_CARTRIDGE = 'https://copiaro.com/hero-of-bitcoin-the-game-boxed-gameboy-version-batch2-en';
const LINK_MICROSD_CARTRIDGE = 'https://copiaro.com/en/hero-of-bitcoin-digital-version-v2';
const LINK_R36S_DEVICE = 'https://copiaro.com/en/hero-of-bitcoin-handheld-version-v2';

type ShippingRegion = 'de_eu' | 'world';

interface PricePreview {
  sats: number | null;
  btc: string | null;
  is_estimate: boolean;
  is_informational: boolean;
  stock_total?: number;
  stock_remaining?: number;
  launch_discount_percent?: number;
  launch_discount_remaining?: number;
  launch_discount_limit?: number;
}

interface PricePreviewResponse {
  products?: Array<PricePreview & { id: string }>;
}

/*
  =============================================================================
  PRODUCT GALLERY COMPONENT
  =============================================================================
  Displays thumbnail images - either actual images or placeholders
*/
const ProductGallery: React.FC<{
  images?: string[];
  placeholderCount?: number;
  onSelect: (index: number) => void;
  selectedIndex: number;
}> = ({ images, placeholderCount = 3, onSelect, selectedIndex }) => {
  if (images && images.length > 0) {
    if (images.length === 1) {
      return null;
    }

    return (
      <div className="flex gap-2 mt-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`flex-1 aspect-square border-2 overflow-hidden transition-all ${
              selectedIndex === i ? 'border-yellow-500 scale-105' : 'border-black hover:border-yellow-400'
            }`}
          >
            <img src={src} alt={`Product view ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-3">
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <div
          key={i}
          className="flex-1 aspect-square bg-gray-200 border border-black flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
        >
          <span className="font-pixel text-[8px] text-gray-400">{i + 1}</span>
        </div>
      ))}
    </div>
  );
};

const PaymentMark: React.FC<{ compact?: boolean; tone?: 'light' | 'dark'; className?: string }> = ({
  compact = false,
  tone = 'dark',
  className = '',
}) => (
  <span className={`inline-flex items-center gap-1 ${className}`} aria-label="Bitcoin and Lightning">
    <span
      className={`${compact ? 'text-base' : 'text-2xl'} font-sans font-bold ${
        tone === 'dark' ? 'text-[#F7931A]' : 'text-[#B45309]'
      }`}
    >
      ₿
    </span>
    <span
      className={`${compact ? 'text-base' : 'text-2xl'} font-sans ${
        tone === 'dark' ? 'text-yellow-300' : 'text-[#92400E]'
      }`}
    >
      ⚡
    </span>
  </span>
);

/*
  =============================================================================
  PRODUCT CARD COMPONENT
  =============================================================================
  Reusable card for each product with image, details, features, and gallery
*/
interface ProductCardProps {
  id: string;
  title: string;
  subtitle: string;
  quote: string;
  features: { icon: React.ReactNode; text: string }[];
  buyLink?: string;
  badgeText: string;
  imageIcon?: React.ReactNode;
  imagePlaceholderText?: string;
  images?: string[];
  imageFit?: 'cover' | 'contain';
  imageFrameClassName?: string;
  imageClassName?: string;
  gridClassName?: string;
  badgeClassName?: string;
  detailsClassName?: string;
  galleryCount?: number;
  compatibility?: string;
  buyLabel?: string;
  buyContent?: React.ReactNode;
  children?: React.ReactNode;
  cardClassName?: string;
  pricePreview?: PricePreview | null;
  pricePreviewText?: {
    label: string;
    unavailable: string;
    estimate: string;
    informational: string;
    stockRemaining: string;
    physicalShipping: string;
    launchDiscount: string;
  };
  imageOverlay?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  subtitle,
  quote,
  features,
  buyLink,
  badgeText,
  imageIcon,
  imagePlaceholderText,
  images,
  imageFit = 'cover',
  imageFrameClassName,
  imageClassName,
  gridClassName,
  badgeClassName,
  detailsClassName,
  galleryCount = 3,
  compatibility,
  buyLabel,
  buyContent,
  children,
  cardClassName,
  pricePreview,
  pricePreviewText,
  imageOverlay,
}) => {
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const hasImages = images && images.length > 0;

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id={id} className={`border-4 border-black bg-white p-6 pixel-shadow scroll-mt-24 ${cardClassName ?? ''}`}>
      <div className={`grid gap-6 items-start md:grid-cols-2 ${gridClassName ?? ''}`}>
        {/* Product Image with Gallery */}
        <div className="relative">
          {/* Badge - positioned outside overflow container */}
          <div className={`absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-1 rounded-full pixel-shadow-sm rotate-12 z-20 ${badgeClassName ?? ''}`}>
            <div className="text-center font-bold text-[10px] leading-tight whitespace-nowrap">
              {badgeText}
            </div>
          </div>

          {/* Main Image */}
          <div className={`bg-gray-100 border-2 border-black aspect-square relative flex items-center justify-center group overflow-hidden ${imageFrameClassName ?? ''}`}>
            {hasImages ? (
              <img
                src={images[selectedImageIndex]}
                alt={`${title} - View ${selectedImageIndex + 1}`}
                className={`${
                  imageFit === 'contain'
                    ? 'max-w-full max-h-full object-contain p-6 md:p-8'
                    : 'w-full h-full object-cover'
                } ${imageClassName ?? ''}`}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)] bg-[length:16px_16px] opacity-50"></div>
                {imageIcon}
                <div className="absolute bottom-2 left-0 right-0 text-center font-pixel text-[10px] text-gray-400">
                  {imagePlaceholderText}
                </div>
              </>
            )}
            {imageOverlay}
          </div>

          {/* Gallery thumbnails */}
          <ProductGallery
            images={images}
            placeholderCount={galleryCount}
            onSelect={setSelectedImageIndex}
            selectedIndex={selectedImageIndex}
          />
        </div>

        {/* Details */}
        <div className={`space-y-4 ${detailsClassName ?? ''}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-xl font-sans">{title}</h3>
              <p className="text-xs text-gray-500 font-mono">{subtitle}</p>
              {pricePreviewText && (
                <div className="mt-2 space-y-1 font-mono text-[11px] text-amber-900">
                  <p>
                    <span className="font-bold">{pricePreviewText.label}: </span>
                    {pricePreview?.sats
                      ? `${pricePreview.sats.toLocaleString()} sats (${pricePreview.btc} BTC)`
                      : pricePreviewText.unavailable}
                    {pricePreview?.sats && pricePreview?.is_estimate ? ` ${pricePreviewText.estimate}` : ''}
                    {pricePreview?.is_informational ? ` ${pricePreviewText.informational}` : ''}
                  </p>
                  {typeof pricePreview?.stock_remaining === 'number' && typeof pricePreview.stock_total === 'number' && (
                    <p className="font-bold text-red-700">
                      {pricePreviewText.stockRemaining
                        .replace('{remaining}', String(pricePreview.stock_remaining))
                        .replace('{total}', String(pricePreview.stock_total))}
                    </p>
                  )}
                  {id === 'stackchain-magazine'
                    && typeof pricePreview?.launch_discount_percent === 'number'
                    && typeof pricePreview.launch_discount_remaining === 'number'
                    && pricePreview.launch_discount_remaining > 0 && (
                    <p className="font-bold text-green-800">
                      {pricePreviewText.launchDiscount
                        .replace('{percent}', String(pricePreview.launch_discount_percent))
                        .replace('{remaining}', String(pricePreview.launch_discount_remaining))}
                    </p>
                  )}
                  {id !== 'instant-download' && (
                    <p className="text-[10px] leading-relaxed text-amber-800">
                      {pricePreviewText.physicalShipping}
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={copyLink}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors shrink-0"
              title={t.products.copyLink}
              aria-label={t.products.copyLink}
            >
              {copied ? (
                <span className="text-green-600 text-xs font-mono">{t.products.copied}</span>
              ) : (
                <Link size={16} />
              )}
            </button>
          </div>

          <p className="font-serif italic text-gray-600 border-l-4 border-yellow-400 pl-3 text-sm">
            "{quote}"
          </p>

          <ul className="space-y-2 font-mono text-sm">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                {f.icon}
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Product-specific content */}
          {children}

          {/*
            =========================================================================
            PRODUCT BUY LINK
            =========================================================================
            Update the corresponding LINK_* constant at top of file when URL changes
            =========================================================================
          */}
          {buyContent ?? (
            <a
              href={buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white font-pixel py-3 px-4 border-2 border-black hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart size={16} />
              <span>{buyLabel ?? t.products.buyNow}</span>
            </a>
          )}

          {compatibility && (
            <p className="text-[10px] text-gray-700 font-mono text-center">
              {compatibility}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

async function createInstantCheckout(
  apiBaseUrl: string,
  email: string,
  couponCode: string,
  language: Language,
): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/api/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim() || undefined,
      coupon_code: couponCode.trim() || undefined,
      lang: language,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    checkout_url?: unknown;
    error?: unknown;
  } | null;

  if (!response.ok || typeof payload?.checkout_url !== 'string') {
    const message = typeof payload?.error === 'string' ? payload.error : 'Could not create checkout';
    throw new Error(message);
  }

  return payload.checkout_url;
}

async function createPhysicalCheckout(
  apiBaseUrl: string,
  productId: string,
  shippingRegion: ShippingRegion,
  couponCode: string,
  language: Language,
): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/api/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      shipping_region: shippingRegion,
      coupon_code: couponCode.trim() || undefined,
      lang: language,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    checkout_url?: unknown;
    error?: unknown;
  } | null;

  if (!response.ok || typeof payload?.checkout_url !== 'string') {
    const message = typeof payload?.error === 'string' ? payload.error : 'Could not create checkout';
    throw new Error(message);
  }

  return payload.checkout_url;
}

const Products: React.FC = () => {
  const { t, language } = useLanguage();
  const [showR36STechDetails, setShowR36STechDetails] = useState(false);
  const [instantEmail, setInstantEmail] = useState('');
  const [instantCouponCode, setInstantCouponCode] = useState('');
  const [instantCheckoutLoading, setInstantCheckoutLoading] = useState(false);
  const [instantCheckoutError, setInstantCheckoutError] = useState<string | null>(null);
  const [stackchainShippingRegion, setStackchainShippingRegion] = useState<ShippingRegion>('de_eu');
  const [stackchainCouponCode, setStackchainCouponCode] = useState('');
  const [stackchainCheckoutLoading, setStackchainCheckoutLoading] = useState(false);
  const [stackchainCheckoutError, setStackchainCheckoutError] = useState<string | null>(null);
  const [gradedShippingRegion, setGradedShippingRegion] = useState<ShippingRegion>('de_eu');
  const [gradedCheckoutLoading, setGradedCheckoutLoading] = useState(false);
  const [gradedCheckoutError, setGradedCheckoutError] = useState<string | null>(null);
  const [pricePreviews, setPricePreviews] = useState<Record<string, PricePreview>>({});
  const apiBaseUrl = getApiBaseUrl();

  // Handle hash navigation on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPricePreviews = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/products/prices`);
        const payload = (await response.json().catch(() => null)) as PricePreviewResponse | null;
        if (!response.ok || !Array.isArray(payload?.products)) {
          return;
        }

        if (!isMounted) {
          return;
        }

        setPricePreviews(Object.fromEntries(
          payload.products.map((product) => [product.id, product]),
        ));
      } catch {
        if (isMounted) {
          setPricePreviews({});
        }
      }
    };

    void loadPricePreviews();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const jumpToProduct = (productId: string) => {
    const nextHash = `#${productId}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = productId;
      return;
    }

    const element = document.getElementById(productId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInstantCheckout = async () => {
    setInstantCheckoutLoading(true);
    setInstantCheckoutError(null);

    try {
      const checkoutUrl = await createInstantCheckout(apiBaseUrl, instantEmail, instantCouponCode, language);
      window.location.assign(checkoutUrl);
    } catch (error) {
      setInstantCheckoutLoading(false);
      setInstantCheckoutError(error instanceof Error ? error.message : t.products.instant.checkoutError);
    }
  };

  const handleStackchainCheckout = async () => {
    setStackchainCheckoutLoading(true);
    setStackchainCheckoutError(null);

    try {
      const checkoutUrl = await createPhysicalCheckout(
        apiBaseUrl,
        'stackchain-magazine',
        stackchainShippingRegion,
        stackchainCouponCode,
        language,
      );
      window.location.assign(checkoutUrl);
    } catch (error) {
      setStackchainCheckoutLoading(false);
      setStackchainCheckoutError(
        error instanceof Error ? error.message : t.products.magazine.checkoutError,
      );
    }
  };

  const handleGradedCheckout = async () => {
    setGradedCheckoutLoading(true);
    setGradedCheckoutError(null);

    try {
      const checkoutUrl = await createPhysicalCheckout(
        apiBaseUrl,
        'graded-copy',
        gradedShippingRegion,
        '',
        language,
      );
      window.location.assign(checkoutUrl);
    } catch (error) {
      setGradedCheckoutLoading(false);
      setGradedCheckoutError(
        error instanceof Error ? error.message : t.products.graded.checkoutError,
      );
    }
  };

  const pricePreviewText = t.products.pricePreview;
  const gradedCopySoldOut = pricePreviews['graded-copy']?.stock_remaining === 0;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div id="products" className="text-center mb-8 scroll-mt-24">
        <h2 className="font-pixel text-2xl md:text-3xl text-black mb-4 uppercase">{t.products.title}</h2>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      <div className="border-4 border-black bg-black text-white pixel-shadow overflow-hidden">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] items-stretch">
          <div className="p-6 md:p-7">
            <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-yellow-300 mb-4">
              {t.products.chooseFormatTitle}
            </p>
            <div className="inline-flex items-center gap-3 border-2 border-white/15 bg-white/5 px-3 py-2 mb-5">
              <PaymentMark />
              <p className="max-w-[16rem] font-mono text-[13px] leading-snug text-neutral-100">{t.products.instant.compatibility}</p>
            </div>
            <p className="max-w-[30rem] font-mono text-[15px] leading-relaxed text-neutral-100 mb-4">
              {t.products.chooseFormatBody}
            </p>
            <div className="mb-6 flex max-w-[32rem] items-start gap-2 border-l-4 border-yellow-300 bg-white/10 px-3 py-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-yellow-300" />
              <p className="font-mono text-[11px] leading-relaxed text-neutral-100">
                {t.products.gameLanguageNotice}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 max-w-[32rem]">
              <button
                type="button"
                onClick={() => jumpToProduct('instant-download')}
                className="inline-flex min-h-[76px] items-center justify-center gap-3 border-2 border-yellow-300 bg-yellow-300 px-4 py-3 font-pixel text-[10px] uppercase text-black transition-all hover:translate-x-[2px] hover:-translate-y-[2px]"
              >
                <PaymentMark compact tone="light" className="justify-center" />
                <span>{t.products.chooseFormatPrimary}</span>
              </button>
              <button
                type="button"
                onClick={() => jumpToProduct('collectors-edition')}
                className="inline-flex min-h-[76px] items-center justify-center gap-3 border-2 border-white bg-transparent px-4 py-3 font-pixel text-[10px] uppercase text-white transition-all hover:bg-white hover:text-black"
              >
                <ShoppingCart size={14} />
                <span>{t.products.chooseFormatSecondary}</span>
              </button>
            </div>
          </div>

          <div className="border-t-4 border-black bg-yellow-100 p-6 md:border-l-4 md:border-t-0 md:p-7">
            <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-[#7a4d00] mb-4">
              {t.products.collectors.title}
            </p>
            <p className="max-w-[18rem] font-mono text-[15px] leading-relaxed text-[#3c2a00] mb-4">
              {t.products.collectors.quote}
            </p>
            <p className="max-w-[18rem] font-mono text-xs leading-relaxed text-[#6b4a00] mb-5">
              {t.products.digital.note}
            </p>
            <div className="space-y-3 font-mono text-[13px] leading-relaxed text-[#4a3300]">
              <p>{t.products.collectors.feature1}</p>
              <p>{t.products.collectors.feature2}</p>
              <p>{t.products.digital.feature2}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product 1: Instant Download */}
      {/*
        =========================================================================
        PRODUCT: Instant Download - Hosted BTC/LN checkout
        =========================================================================
        Primary site-owned checkout for ROM + PDF delivery
        =========================================================================
      */}
      <ProductCard
        id="instant-download"
        title={t.products.instant.title}
        subtitle={t.products.instant.subtitle}
        quote={t.products.instant.quote}
        features={[
          { icon: <ShieldCheck className="text-green-600" size={18} />, text: t.products.instant.feature1 },
          { icon: <PaymentMark compact tone="light" className="min-w-[28px] justify-center" />, text: t.products.instant.feature2 },
          { icon: <BookOpen className="text-yellow-600" size={18} />, text: t.products.instant.feature3 },
          { icon: <Zap className="text-amber-600" size={18} />, text: t.products.instant.feature4 },
        ]}
        badgeText={t.products.badges.instantAccess}
        images={['/assets/images/HoB_Logo_Avatar.png']}
        imageFit="contain"
        imageFrameClassName="aspect-[0.95] bg-[#f2dc6c]"
        imageClassName="rendering-pixelated scale-[0.8]"
        gridClassName="md:grid-cols-[0.88fr_1.12fr] md:gap-5"
        badgeClassName="left-4 right-auto top-4 rotate-[-8deg]"
        detailsClassName="pt-1"
        cardClassName="bg-[#e9cf57]"
        galleryCount={3}
        compatibility={t.products.instant.compatibility}
        pricePreview={pricePreviews['instant-download'] ?? null}
        pricePreviewText={pricePreviewText}
        buyContent={(
          <div className="space-y-3">
            <div className="border-2 border-black bg-[#fff8e6] p-4">
              <div className="flex items-center gap-2 mb-3">
                <PaymentMark compact tone="light" />
                <p className="font-pixel text-[10px] uppercase text-amber-900">
                  {t.products.instant.checkoutTitle}
                </p>
              </div>
              <p className="text-xs leading-relaxed font-mono text-[#8a5b12] mb-4">
                {t.products.instant.checkoutBody}
              </p>
              <label className="block mb-2">
                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                  {t.products.instant.emailLabel}
                </span>
                <input
                  type="email"
                  value={instantEmail}
                  onChange={(event) => setInstantEmail(event.target.value)}
                  placeholder={t.products.instant.emailPlaceholder}
                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
              <p className="text-[10px] leading-relaxed font-mono text-gray-700">
                {t.products.instant.emailHint}
              </p>
              <label className="block mt-4 mb-2">
                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                  {t.products.instant.couponLabel}
                </span>
                <input
                  type="text"
                  value={instantCouponCode}
                  onChange={(event) => setInstantCouponCode(event.target.value)}
                  placeholder={t.products.instant.couponPlaceholder}
                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm uppercase text-black placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  autoComplete="off"
                  inputMode="text"
                />
              </label>
              <p className="text-[10px] leading-relaxed font-mono text-gray-700">
                {t.products.instant.couponHint}
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstantCheckout}
              disabled={instantCheckoutLoading}
              className="w-full min-h-[72px] bg-black text-white font-pixel py-3 px-4 border-2 border-black hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow-sm flex items-center justify-center gap-2 text-sm disabled:cursor-wait disabled:hover:scale-100 disabled:bg-neutral-800"
            >
              <PaymentMark compact className="justify-center" />
              <span>
                {instantCheckoutLoading ? t.products.instant.redirecting : t.products.instant.buyWithBitcoin}
              </span>
            </button>

            {instantCheckoutError && (
              <p className="text-[11px] font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                {instantCheckoutError}
              </p>
            )}
          </div>
        )}
      >
        <div className="border-l-4 border-yellow-300 bg-[#fff9dd] px-3 py-2 text-[11px] leading-relaxed text-[#6f581e]">
          <strong className="text-[#8a6610]">{t.products.noteLabel}</strong> {t.products.instant.note}
        </div>
      </ProductCard>

      {/* Product 2: Collector's Edition */}
      {/*
        =========================================================================
        PRODUCT: Collector's Edition - Physical Game Boy Cartridge
        =========================================================================
        Images location: public/assets/product/cartridge/
        Limited to ~450 units worldwide
        =========================================================================
      */}
      <ProductCard
        id="collectors-edition"
        title={t.products.collectors.title}
        subtitle={t.products.collectors.subtitle}
        quote={t.products.collectors.quote}
        features={[
          { icon: <ShieldCheck className="text-green-600" size={18} />, text: t.products.collectors.feature1 },
          { icon: <Star className="text-yellow-600" size={18} />, text: t.products.collectors.feature2 },
          { icon: <Disc className="text-purple-600" size={18} />, text: t.products.collectors.feature3 },
          { icon: <Sticker className="text-blue-600" size={18} />, text: t.products.collectors.feature4 },
          { icon: <Shield className="text-gray-600" size={18} />, text: t.products.collectors.feature5 },
        ]}
        buyLink={LINK_PHYSICAL_CARTRIDGE}
        buyLabel={t.products.collectors.buyAtCopiaro}
        badgeText={t.products.badges.ltdEdition}
        images={[
          '/assets/product/cartridge/1.webp',
          '/assets/product/cartridge/2.webp',
          '/assets/product/cartridge/3.webp'
        ]}
        galleryCount={3}
        compatibility={t.products.collectors.compatibility}
        pricePreview={pricePreviews['collectors-edition'] ?? null}
        pricePreviewText={pricePreviewText}
      />

      {/* Product 3: Graded Copy */}
      {/*
        =========================================================================
        PRODUCT: Graded Copy - Site-owned physical checkout
        =========================================================================
        Images location: public/assets/product/graded/
        Verification: https://heroofbitcoin.xyz/c/?s=y91OtC9UyO60xr7DvzTdTw
        =========================================================================
      */}
      <ProductCard
        id="graded-copy"
        title={t.products.graded.title}
        subtitle={t.products.graded.subtitle}
        quote={t.products.graded.quote}
        features={[
          { icon: <Award className="text-yellow-600" size={18} />, text: t.products.graded.feature1 },
          { icon: <ShieldCheck className="text-green-600" size={18} />, text: t.products.graded.feature2 },
          { icon: <Zap className="text-amber-600" size={18} />, text: t.products.graded.feature3 },
          { icon: <Truck className="text-blue-600" size={18} />, text: t.products.graded.feature4 },
        ]}
        badgeText={t.products.badges.gradedCopy}
        images={[
          '/assets/product/graded/99-1020219002-front.jpeg',
          '/assets/product/graded/99-1020219002-back.jpeg',
        ]}
        imageFrameClassName="bg-neutral-200"
        galleryCount={2}
        compatibility={t.products.graded.compatibility}
        pricePreview={pricePreviews['graded-copy'] ?? null}
        pricePreviewText={pricePreviewText}
        buyContent={(
          <div className="space-y-3">
            <div className="border-2 border-black bg-[#fff8e6] p-4">
              <div className="flex items-center gap-2 mb-3">
                <PaymentMark compact tone="light" />
                <p className="font-pixel text-[10px] uppercase text-amber-900">
                  {t.products.graded.checkoutTitle}
                </p>
              </div>
              <p className="text-xs leading-relaxed font-mono text-[#8a5b12] mb-4">
                {t.products.graded.checkoutBody}
              </p>
              <a
                href="https://heroofbitcoin.xyz/c/?s=y91OtC9UyO60xr7DvzTdTw"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-pixel text-[9px] uppercase text-black transition-colors hover:bg-yellow-100"
              >
                <ShieldCheck size={14} />
                <span>{t.products.graded.verifyLink}</span>
              </a>
              <div className="grid gap-2">
                <label className="flex items-start gap-3 border-2 border-black bg-white p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="graded-shipping"
                    checked={gradedShippingRegion === 'de_eu'}
                    onChange={() => setGradedShippingRegion('de_eu')}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-bold text-sm">{t.products.graded.shippingEu}</span>
                    <span className="block font-mono text-[11px] text-gray-700">{t.products.graded.shippingEuHint}</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 border-2 border-black bg-white p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="graded-shipping"
                    checked={gradedShippingRegion === 'world'}
                    onChange={() => setGradedShippingRegion('world')}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-bold text-sm">{t.products.graded.shippingWorld}</span>
                    <span className="block font-mono text-[11px] text-gray-700">{t.products.graded.shippingWorldHint}</span>
                  </span>
                </label>
              </div>
              <div className="mt-4 flex gap-2 border-l-4 border-yellow-400 bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-700">
                <Truck size={16} className="mt-0.5 shrink-0 text-amber-700" />
                <p>{t.products.graded.privacyNotice}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGradedCheckout}
              disabled={gradedCheckoutLoading || gradedCopySoldOut}
              className="w-full min-h-[72px] bg-black text-white font-pixel py-3 px-4 border-2 border-black hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow-sm flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-neutral-700"
            >
              <PaymentMark compact className="justify-center" />
              <span>
                {gradedCopySoldOut
                  ? t.products.graded.soldOut
                  : gradedCheckoutLoading
                    ? t.products.graded.redirecting
                    : t.products.graded.buyWithBitcoin}
              </span>
            </button>

            {gradedCheckoutError && (
              <p className="text-[11px] font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                {gradedCheckoutError}
              </p>
            )}
          </div>
        )}
      >
        <p className="text-[10px] text-gray-500 font-mono">
          {t.products.graded.note}
        </p>
      </ProductCard>

      {/* Product 4: Digital Edition */}
      {/*
        =========================================================================
        PRODUCT: Digital Edition - Physical boxed microSD bundle
        =========================================================================
        Images location: public/assets/product/microsd/
        Emulator-friendly collectible with physical packaging
        =========================================================================
      */}
      <ProductCard
        id="digital-edition"
        title={t.products.digital.title}
        subtitle={t.products.digital.subtitle}
        quote={t.products.digital.quote}
        features={[
          { icon: <ShieldCheck className="text-green-600" size={18} />, text: t.products.digital.feature1 },
          { icon: <Disc className="text-purple-600" size={18} />, text: t.products.digital.feature2 },
          { icon: <Sticker className="text-blue-600" size={18} />, text: t.products.digital.feature3 },
          { icon: <Shield className="text-gray-600" size={18} />, text: t.products.digital.feature4 },
        ]}
        buyLink={LINK_MICROSD_CARTRIDGE}
        buyLabel={t.products.digital.buyAtCopiaro}
        badgeText={t.products.badges.boxedEdition}
        images={[
          '/assets/product/microsd/1.jpg',
          '/assets/product/microsd/2.png',
          '/assets/product/microsd/3.png'
        ]}
        galleryCount={3}
        compatibility={t.products.digital.compatibility}
        pricePreview={pricePreviews['digital-edition'] ?? null}
        pricePreviewText={pricePreviewText}
      >
        <div className="bg-purple-50 border border-purple-200 p-2 rounded text-xs">
          <strong className="text-purple-700">{t.products.noteLabel}</strong> {t.products.digital.note}
        </div>
      </ProductCard>

      {/* Product 5: Hero Handheld */}
      {/*
        =========================================================================
        PRODUCT: Hero Handheld - R36S with Hero of Bitcoin pre-installed
        =========================================================================
        Images location: public/assets/product/r36s/
        =========================================================================
      */}
      <ProductCard
        id="hero-handheld"
        title={t.products.handheld.title}
        subtitle={t.products.handheld.subtitle}
        quote={t.products.handheld.quote}
        features={[
          { icon: <Zap className="text-green-600" size={18} />, text: t.products.handheld.feature1 },
          { icon: <Gamepad2 className="text-yellow-600" size={18} />, text: t.products.handheld.feature2 },
          { icon: <HardDrive className="text-blue-600" size={18} />, text: t.products.handheld.feature3 },
          { icon: <Sticker className="text-blue-600" size={18} />, text: t.products.handheld.feature4 },
        ]}
        buyLink={LINK_R36S_DEVICE}
        buyLabel={t.products.handheld.buyAtCopiaro}
        badgeText={t.products.badges.readyToPlay}
        images={[
          '/assets/product/r36s/1.jpg',
          '/assets/product/r36s/2.jpg',
          '/assets/product/r36s/3.jpg'
        ]}
        galleryCount={3}
        compatibility={t.products.handheld.compatibility}
        pricePreview={pricePreviews['hero-handheld'] ?? null}
        pricePreviewText={pricePreviewText}
      >
        {/* Controls */}
        <div className="border border-gray-200 p-3 bg-gray-50">
          <h4 className="font-bold text-xs mb-2">{t.products.handheld.quickControls}</h4>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
            <div>{t.products.handheld.exit}: SELECT+START</div>
            <div>{t.products.handheld.save}: SELECT+R1</div>
            <div>{t.products.handheld.load}: SELECT+L1</div>
            <div>{t.products.handheld.fastFwd}: SELECT+R2</div>
          </div>
        </div>
        {/* Copyright disclaimer */}
        <p className="text-[9px] text-gray-400 font-mono mt-2">
          {t.products.handheld.copyright}
        </p>
      </ProductCard>

      {/* Hero Handheld Technical Details - Collapsible */}
      <div className="border-2 border-gray-300 -mt-6">
        <button
          onClick={() => setShowR36STechDetails(!showR36STechDetails)}
          className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors text-left"
        >
          <span className="font-pixel text-sm flex items-center gap-2">
            <HelpCircle size={16} />
            {t.products.techDetails.title}
          </span>
          {showR36STechDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showR36STechDetails && (
          <div className="p-4 space-y-6 bg-white">
            {/* Critical Warning */}
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200">
              <AlertTriangle className="text-red-600 shrink-0" size={20} />
              <div className="text-xs font-mono">
                <strong className="text-red-600">{t.products.techDetails.safeShutdown}</strong> {t.products.techDetails.safeShutdownDesc}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              {/* Power */}
              <section>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  <Zap size={14} className="text-yellow-600" />
                  {t.products.techDetails.power}
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-gray-600">
                  {t.products.techDetails.powerItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* microSD */}
              <section>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  <HardDrive size={14} className="text-blue-600" />
                  {t.products.techDetails.microsd}
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-gray-600">
                  {t.products.techDetails.microsdItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* Adding Games */}
              <section>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  <FolderOpen size={14} className="text-yellow-600" />
                  {t.products.techDetails.addingGames}
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-gray-600">
                  {t.products.techDetails.addingItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Troubleshooting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="border border-gray-200 p-2 bg-gray-50 text-[10px]">
                <strong className="block uppercase mb-1">{t.products.techDetails.wontBoot}</strong>
                <span className="font-mono text-gray-600">{t.products.techDetails.wontBootDesc}</span>
              </div>
              <div className="border border-gray-200 p-2 bg-gray-50 text-[10px]">
                <strong className="block uppercase mb-1">{t.products.techDetails.gamesMissing}</strong>
                <span className="font-mono text-gray-600">{t.products.techDetails.gamesMissingDesc}</span>
              </div>
              <div className="border border-gray-200 p-2 bg-gray-50 text-[10px]">
                <strong className="block uppercase mb-1">{t.products.techDetails.chargingIssues}</strong>
                <span className="font-mono text-gray-600">{t.products.techDetails.chargingIssuesDesc}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product 6: Stackchain Magazine */}
      {/*
        =========================================================================
        PRODUCT: Stackchain Magazine - Limited Edition Print with Fine Art
        =========================================================================
        Images location: public/assets/product/magazine/
        Includes: Magazine Round 5, Fine Art Print (Alt Cover), Protective Toploader
        =========================================================================
      */}
      <ProductCard
        id="stackchain-magazine"
        title={t.products.magazine.title}
        subtitle={t.products.magazine.subtitle}
        quote={t.products.magazine.quote}
        features={[
          { icon: <BookOpen className="text-orange-600" size={18} />, text: t.products.magazine.feature1 },
          { icon: <Image className="text-purple-600" size={18} />, text: t.products.magazine.feature2 },
          { icon: <Award className="text-yellow-600" size={18} />, text: t.products.magazine.feature3 },
          { icon: <Zap className="text-amber-600" size={18} />, text: t.products.magazine.feature4 },
        ]}
        badgeText={t.products.badges.printEdition}
        imageOverlay={(
          <div className="absolute bottom-3 left-3 right-3 border-2 border-black bg-yellow-300 px-3 py-2 text-center font-pixel text-[10px] leading-relaxed text-black shadow-[3px_3px_0_#000]">
            {t.products.magazine.imageOverlay}
          </div>
        )}
        images={[
          '/assets/product/magazine/1.png',
          '/assets/product/magazine/2.png',
          '/assets/product/magazine/3.png'
        ]}
        galleryCount={3}
        pricePreview={pricePreviews['stackchain-magazine'] ?? null}
        pricePreviewText={pricePreviewText}
        buyContent={(
          <div className="space-y-3">
            <div className="border-2 border-black bg-[#fff8e6] p-4">
              <div className="flex items-center gap-2 mb-3">
                <PaymentMark compact tone="light" />
                <p className="font-pixel text-[10px] uppercase text-amber-900">
                  {t.products.magazine.checkoutTitle}
                </p>
              </div>
              <p className="text-xs leading-relaxed font-mono text-[#8a5b12] mb-4">
                {t.products.magazine.checkoutBody}
              </p>
              <div className="grid gap-2">
                <label className="flex items-start gap-3 border-2 border-black bg-white p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="stackchain-shipping"
                    checked={stackchainShippingRegion === 'de_eu'}
                    onChange={() => setStackchainShippingRegion('de_eu')}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-bold text-sm">{t.products.magazine.shippingEu}</span>
                    <span className="block font-mono text-[11px] text-gray-700">{t.products.magazine.shippingEuHint}</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 border-2 border-black bg-white p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="stackchain-shipping"
                    checked={stackchainShippingRegion === 'world'}
                    onChange={() => setStackchainShippingRegion('world')}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-bold text-sm">{t.products.magazine.shippingWorld}</span>
                    <span className="block font-mono text-[11px] text-gray-700">{t.products.magazine.shippingWorldHint}</span>
                  </span>
                </label>
              </div>
              <label className="block mt-4 mb-2">
                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                  {t.products.magazine.couponLabel}
                </span>
                <input
                  type="text"
                  value={stackchainCouponCode}
                  onChange={(event) => setStackchainCouponCode(event.target.value)}
                  placeholder={t.products.magazine.couponPlaceholder}
                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm uppercase text-black placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  autoComplete="off"
                  inputMode="text"
                />
              </label>
              <p className="text-[10px] leading-relaxed font-mono text-gray-700">
                {t.products.magazine.couponHint}
              </p>
              <div className="mt-4 flex gap-2 border-l-4 border-yellow-400 bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-700">
                <Truck size={16} className="mt-0.5 shrink-0 text-amber-700" />
                <p>{t.products.magazine.privacyNotice}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStackchainCheckout}
              disabled={stackchainCheckoutLoading}
              className="w-full min-h-[72px] bg-black text-white font-pixel py-3 px-4 border-2 border-black hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow-sm flex items-center justify-center gap-2 text-sm disabled:cursor-wait disabled:hover:scale-100 disabled:bg-neutral-800"
            >
              <PaymentMark compact className="justify-center" />
              <span>
                {stackchainCheckoutLoading
                  ? t.products.magazine.redirecting
                  : t.products.magazine.buyWithBitcoin}
              </span>
            </button>

            {stackchainCheckoutError && (
              <p className="text-[11px] font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                {stackchainCheckoutError}
              </p>
            )}
          </div>
        )}
      >
        <p className="text-[10px] text-gray-500 font-mono">
          {t.products.magazine.note}
        </p>
      </ProductCard>

      {/* Info Note */}
      <PixelCard variant="info" className="mt-8">
        <div className="text-xs font-mono">
          <strong className="block mb-2 uppercase">{t.products.shippingTitle}</strong>
          {t.products.shippingText}
        </div>
      </PixelCard>
    </div>
  );
};

export default Products;
