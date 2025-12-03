import React, { useState, useEffect } from 'react';
import PixelCard from './ui/PixelCard';
import { useLanguage } from '../i18n';
import { Star, ShieldCheck, ShoppingCart, Sticker, Gamepad2, Zap, HardDrive, ChevronDown, ChevronUp, HelpCircle, AlertTriangle, FolderOpen, Disc, Link, BookOpen, Image, Award, Shield } from 'lucide-react';

/*
  =============================================================================
  COPIARO PRODUCT LINKS
  =============================================================================
  Update these URLs when individual product pages become available.

  LINK_PHYSICAL_CARTRIDGE: Physical Game Boy cartridge collector's edition
  LINK_R36S_DEVICE: R36S handheld console with Hero of Bitcoin pre-installed
  LINK_MICROSD_CARTRIDGE: Cartridge-shaped collectible with microSD card
  =============================================================================
*/
const LINK_PHYSICAL_CARTRIDGE = 'https://copiaro.com/brand/hob'; // TODO: Update to cartridge product page
const LINK_R36S_DEVICE = 'https://copiaro.com/brand/hob'; // TODO: Update to R36S product page
const LINK_MICROSD_CARTRIDGE = 'https://copiaro.com/brand/hob'; // TODO: Update to microSD cartridge page

/*
  =============================================================================
  STACKCHAIN MAGAZINE LINK
  =============================================================================
  Stackchain Magazine with Hero of Bitcoin fine art print
  =============================================================================
*/
const LINK_STACKCHAIN_MAGAZINE = 'https://copiaro.com/brand/hob'; // TODO: Update to magazine product page

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
  buyLink: string;
  badgeText: string;
  imageIcon?: React.ReactNode;
  imagePlaceholderText?: string;
  images?: string[];
  galleryCount?: number;
  compatibility?: string;
  children?: React.ReactNode;
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
  galleryCount = 3,
  compatibility,
  children
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const hasImages = images && images.length > 0;

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id={id} className="border-4 border-black bg-white p-6 pixel-shadow scroll-mt-24">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Product Image with Gallery */}
        <div className="relative">
          {/* Badge - positioned outside overflow container */}
          <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-1 rounded-full pixel-shadow-sm rotate-12 z-20">
            <div className="text-center font-bold text-[10px] leading-tight whitespace-nowrap">
              {badgeText}
            </div>
          </div>

          {/* Main Image */}
          <div className="bg-gray-100 border-2 border-black aspect-square relative flex items-center justify-center group overflow-hidden">
            {hasImages ? (
              <img
                src={images[selectedImageIndex]}
                alt={`${title} - View ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
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
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-xl font-sans">{title}</h3>
              <p className="text-xs text-gray-500 font-mono">{subtitle}</p>
            </div>
            <button
              onClick={copyLink}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors shrink-0"
              title="Copy link to this product"
            >
              {copied ? (
                <span className="text-green-600 text-xs font-mono">Copied!</span>
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
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white font-pixel py-3 px-4 border-2 border-black hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart size={16} />
            <span>BUY NOW</span>
          </a>

          {compatibility && (
            <p className="text-[10px] text-gray-500 font-mono text-center">
              {compatibility}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  const { t } = useLanguage();
  const [showR36STechDetails, setShowR36STechDetails] = useState(false);

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

  return (
    <div className="space-y-12">
      {/* Header */}
      <div id="products" className="text-center mb-8 scroll-mt-24">
        <h2 className="font-pixel text-2xl md:text-3xl text-black mb-4 uppercase">{t.products.title}</h2>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      {/* Product 1: Collector's Edition */}
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
        badgeText={t.products.badges.ltdEdition}
        images={[
          '/assets/product/cartridge/1.webp',
          '/assets/product/cartridge/2.webp',
          '/assets/product/cartridge/3.webp'
        ]}
        galleryCount={3}
        compatibility={t.products.collectors.compatibility}
      />

      {/* Product 2: Digital Edition */}
      {/*
        =========================================================================
        PRODUCT: Digital Edition - Collectible with microSD
        =========================================================================
        Images location: public/assets/product/microsd/
        Budget-friendly option for emulator users
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
        badgeText={t.products.badges.budgetPick}
        images={[
          '/assets/product/microsd/1.jpg',
          '/assets/product/microsd/2.png',
          '/assets/product/microsd/3.png'
        ]}
        galleryCount={3}
        compatibility={t.products.digital.compatibility}
      >
        <div className="bg-purple-50 border border-purple-200 p-2 rounded text-xs">
          <strong className="text-purple-700">Note:</strong> {t.products.digital.note}
        </div>
      </ProductCard>

      {/* Product 3: Hero Handheld */}
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
        badgeText={t.products.badges.readyToPlay}
        images={[
          '/assets/product/r36s/1.jpg',
          '/assets/product/r36s/2.jpg',
          '/assets/product/r36s/3.jpg'
        ]}
        galleryCount={3}
        compatibility={t.products.handheld.compatibility}
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

      {/* Product 4: Stackchain Magazine */}
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
          { icon: <Star className="text-blue-600" size={18} />, text: t.products.magazine.feature4 },
        ]}
        buyLink={LINK_STACKCHAIN_MAGAZINE}
        badgeText={t.products.badges.printEdition}
        images={[
          '/assets/product/magazine/1.png',
          '/assets/product/magazine/2.png',
          '/assets/product/magazine/3.png'
        ]}
        galleryCount={3}
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
