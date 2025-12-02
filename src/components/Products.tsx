import React, { useState } from 'react';
import PixelCard from './ui/PixelCard';
import { Star, ShieldCheck, ShoppingCart, Sticker, Gamepad2, Zap, HardDrive, ChevronDown, ChevronUp, HelpCircle, AlertTriangle, FolderOpen, Disc } from 'lucide-react';

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
  const hasImages = images && images.length > 0;

  return (
    <div className="border-4 border-black bg-white p-6 pixel-shadow">
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
          <div>
            <h3 className="font-bold text-xl font-sans">{title}</h3>
            <p className="text-xs text-gray-500 font-mono">{subtitle}</p>
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
  const [showR36STechDetails, setShowR36STechDetails] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-pixel text-2xl md:text-3xl text-black mb-4 uppercase">Products</h2>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      {/* Product 1: Physical Cartridge */}
      {/*
        =========================================================================
        PRODUCT: Physical Game Boy Cartridge
        =========================================================================
        Images location: public/assets/product/cartridge/
        - main.png (400x400px) - Main product image
        - gallery-1.png, gallery-2.png, gallery-3.png (200x200px) - Gallery thumbs
        =========================================================================
      */}
      <ProductCard
        title="Physical Cartridge"
        subtitle="COLLECTOR'S EDITION"
        quote="A tangible piece of Bitcoin history, playable on original hardware."
        features={[
          { icon: <ShieldCheck className="text-green-600" size={18} />, text: "Premium Box & Manual" },
          { icon: <Star className="text-yellow-600" size={18} />, text: "Transparent Orange Cartridge" },
          { icon: <Sticker className="text-blue-600" size={18} />, text: "Includes Sticker" },
        ]}
        buyLink={LINK_PHYSICAL_CARTRIDGE}
        badgeText="LTD EDITION"
        images={[
          '/assets/product/cartridge/1.webp',
          '/assets/product/cartridge/2.webp',
          '/assets/product/cartridge/3.webp'
        ]}
        galleryCount={3}
        compatibility="Compatible with Game Boy, GBC, GBA, Analogue Pocket. Region free."
      />

      {/* Product 2: microSD Cartridge */}
      {/*
        =========================================================================
        PRODUCT: microSD Cartridge Collectible
        =========================================================================
        Images location: public/assets/product/microsd/
        - main.png (400x400px) - Main product image
        - gallery-1.png, gallery-2.png, gallery-3.png (200x200px) - Gallery thumbs
        =========================================================================
      */}
      <ProductCard
        title="microSD Cartridge"
        subtitle="DIGITAL COLLECTIBLE"
        quote="Collector's cartridge with the game ROM ready to play on any emulator."
        features={[
          { icon: <ShieldCheck className="text-green-600" size={18} />, text: "Premium Box & Manual" },
          { icon: <Disc className="text-purple-600" size={18} />, text: "microSD with Game ROM" },
          { icon: <Sticker className="text-blue-600" size={18} />, text: "Includes Sticker" },
        ]}
        buyLink={LINK_MICROSD_CARTRIDGE}
        badgeText="NEW"
        images={[
          '/assets/product/microsd/1.jpg',
          '/assets/product/microsd/2.jpg',
          '/assets/product/microsd/3.jpg'
        ]}
        galleryCount={3}
        compatibility="microSD works with R36S, Miyoo Mini, Analogue Pocket, and any emulator."
      >
        <div className="bg-purple-50 border border-purple-200 p-2 rounded text-xs">
          <strong className="text-purple-700">Note:</strong> This is a decorative cartridge-shaped collectible, not a playable Game Boy cartridge. The game is on the included microSD card.
        </div>
      </ProductCard>

      {/* Product 3: R36S Console */}
      {/*
        =========================================================================
        PRODUCT: R36S Handheld Console
        =========================================================================
        Images location: public/assets/product/r36s/
        - main.png (400x400px) - Main product image
        - gallery-1.png, gallery-2.png, gallery-3.png (200x200px) - Gallery thumbs
        =========================================================================
      */}
      <ProductCard
        title="R36S Console"
        subtitle="PRE-CONFIGURED HANDHELD"
        quote="Hero of Bitcoin pre-installed. Power on and play instantly."
        features={[
          { icon: <Zap className="text-green-600" size={18} />, text: "ArkOS Pre-Installed" },
          { icon: <Gamepad2 className="text-yellow-600" size={18} />, text: "Hero of Bitcoin Ready" },
          { icon: <HardDrive className="text-blue-600" size={18} />, text: "microSD Card Included" },
        ]}
        buyLink={LINK_R36S_DEVICE}
        badgeText="READY TO PLAY"
        images={[
          '/assets/product/r36s/1.jpg',
          '/assets/product/r36s/2.jpg',
          '/assets/product/r36s/3.jpg'
        ]}
        galleryCount={3}
        compatibility="Supports GB, GBC, GBA, NES, SNES, Genesis, PS1, and more."
      >
        {/* Controls */}
        <div className="border border-gray-200 p-3 bg-gray-50">
          <h4 className="font-bold text-xs mb-2">Quick Controls</h4>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
            <div>Exit: SELECT+START</div>
            <div>Save: SELECT+R1</div>
            <div>Load: SELECT+L1</div>
            <div>Fast Fwd: SELECT+R2</div>
          </div>
        </div>
      </ProductCard>

      {/* R36S Technical Details - Collapsible */}
      <div className="border-2 border-gray-300 -mt-6">
        <button
          onClick={() => setShowR36STechDetails(!showR36STechDetails)}
          className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors text-left"
        >
          <span className="font-pixel text-sm flex items-center gap-2">
            <HelpCircle size={16} />
            R36S Technical Details & Troubleshooting
          </span>
          {showR36STechDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showR36STechDetails && (
          <div className="p-4 space-y-6 bg-white">
            {/* Critical Warning */}
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200">
              <AlertTriangle className="text-red-600 shrink-0" size={20} />
              <div className="text-xs font-mono">
                <strong className="text-red-600">Safe Shutdown:</strong> Never pull card while saving. Use START → Quit → Shutdown or SELECT+START twice.
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              {/* Power */}
              <section>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  <Zap size={14} className="text-yellow-600" />
                  Power & Charging
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-gray-600">
                  <li>USB-A to USB-C only</li>
                  <li>5V (1-2A) charger</li>
                  <li>Avoid fast chargers</li>
                </ul>
              </section>

              {/* microSD */}
              <section>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  <HardDrive size={14} className="text-blue-600" />
                  microSD Handling
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-gray-600">
                  <li>Don't reformat card</li>
                  <li>Use EASYROMS partition</li>
                  <li>Always eject safely</li>
                </ul>
              </section>

              {/* Adding Games */}
              <section>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  <FolderOpen size={14} className="text-yellow-600" />
                  Adding Games
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-gray-600">
                  <li>Path: EASYROMS/roms/</li>
                  <li>Match folder (nes → /nes)</li>
                  <li>Bios files included</li>
                </ul>
              </section>
            </div>

            {/* Troubleshooting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="border border-gray-200 p-2 bg-gray-50 text-[10px]">
                <strong className="block uppercase mb-1">Won't Boot</strong>
                <span className="font-mono text-gray-600">Hold POWER+A 15s, release, press Power</span>
              </div>
              <div className="border border-gray-200 p-2 bg-gray-50 text-[10px]">
                <strong className="block uppercase mb-1">Games Missing</strong>
                <span className="font-mono text-gray-600">Check extensions, unzip, rescan in Options</span>
              </div>
              <div className="border border-gray-200 p-2 bg-gray-50 text-[10px]">
                <strong className="block uppercase mb-1">Charging Issues</strong>
                <span className="font-mono text-gray-600">Try different 5V brick, avoid sleeping ports</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Note */}
      <PixelCard variant="info" className="mt-8">
        <div className="text-xs font-mono">
          <strong className="block mb-2 uppercase">Shipping Info</strong>
          All products ship worldwide. Customs and import duties may apply depending on your country.
        </div>
      </PixelCard>
    </div>
  );
};

export default Products;
