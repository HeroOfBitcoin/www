import React from 'react';
import { useLanguage } from '../i18n';
import { ExternalLink } from 'lucide-react';

/*
  =============================================================================
  PARTNER LINKS
  =============================================================================
  Links to official partner storefronts (English versions)
  =============================================================================
*/
const LINK_COPIARO = 'https://copiaro.com';
const LINK_PLEBSTYLE = 'https://plebstyle.com';

/*
  =============================================================================
  PARTNER LOGOS
  =============================================================================
  Location: public/assets/partners/
  =============================================================================
*/

interface PartnerCardProps {
  name: string;
  description: string;
  logoSrc: string;
  storeLink: string;
  visitText: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({
  name,
  description,
  logoSrc,
  storeLink,
  visitText,
}) => {
  return (
    <div className="bg-white border-4 border-black p-6 pixel-shadow-sm">
      {/* Logo */}
      <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border-2 border-black">
        <img
          src={logoSrc}
          alt={`${name} logo`}
          className="max-h-24 max-w-[80%] object-contain"
        />
      </div>

      {/* Partner Name */}
      <h3 className="font-bold text-xl font-sans text-black mb-2">{name}</h3>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed font-sans">{description}</p>

      {/* Visit Store Button */}
      <a
        href={storeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-pixel border-2 border-black hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
      >
        <ExternalLink size={16} />
        <span>{visitText}</span>
      </a>
    </div>
  );
};

const Partners: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="font-pixel text-2xl md:text-3xl text-black mb-4 uppercase">{t.partners.title}</h2>
        <p className="text-gray-600 text-sm md:text-base font-sans">{t.partners.subtitle}</p>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Copiaro */}
        <PartnerCard
          name={t.partners.copiaro.name}
          description={t.partners.copiaro.description}
          logoSrc="/assets/partners/copiaro.jpeg"
          storeLink={LINK_COPIARO}
          visitText={t.partners.visitStore}
        />

        {/* Plebstyle */}
        <PartnerCard
          name={t.partners.plebstyle.name}
          description={t.partners.plebstyle.description}
          logoSrc="/assets/partners/plebstyle.jpeg"
          storeLink={LINK_PLEBSTYLE}
          visitText={t.partners.visitStore}
        />
      </div>
    </div>
  );
};

export default Partners;
