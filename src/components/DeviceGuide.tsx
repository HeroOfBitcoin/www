import React, { useState } from 'react';
import { AlertTriangle, HardDrive, FolderOpen, ShoppingCart, Zap, Gamepad2, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import PixelCard from './ui/PixelCard';
import { Shortcut } from '../types';

/*
  =============================================================================
  COPIARO PRODUCT LINKS - R36S DEVICE
  =============================================================================
  Update this URL when the individual R36S product page becomes available.

  LINK_R36S_DEVICE: R36S handheld console with Hero of Bitcoin pre-installed
  =============================================================================
*/
const LINK_R36S_DEVICE = 'https://copiaro.com/brand/hob'; // TODO: Update to R36S product page when available

const shortcuts: Shortcut[] = [
  { action: 'Hotkey Modifier', buttons: ['SELECT'] },
  { action: 'Exit Game', buttons: ['SELECT', 'START'] },
  { action: 'Save State', buttons: ['SELECT', 'R1'] },
  { action: 'Load State', buttons: ['SELECT', 'L1'] },
  { action: 'Fast Forward', buttons: ['SELECT', 'R2'] },
  { action: 'Screenshot', buttons: ['SELECT', 'Y'] },
];

const DeviceGuide: React.FC = () => {
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-pixel text-2xl md:text-3xl text-black mb-4 uppercase">R36S Console</h2>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/*
          =========================================================================
          IMAGE #14: R36S DEVICE PHOTO
          =========================================================================
          Location: public/assets/device/r36s-custom.png
          Size: 400x400px or 800x800px recommended (displayed as square)
          Description: Photo of your customized R36S handheld device
                       showing the Hero of Bitcoin game or branding
          Currently showing: Placeholder box
          =========================================================================
        */}
        <div className="bg-gray-100 border-4 border-black aspect-square relative flex items-center justify-center pixel-shadow group">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)] bg-[length:20px_20px] opacity-50"></div>
            <Gamepad2 size={80} className="text-gray-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <div className="absolute bottom-4 left-0 right-0 text-center font-pixel text-xs text-gray-400">
                R36S DEVICE IMAGE
            </div>

            {/* Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 border-2 border-black p-3 rounded-full pixel-shadow-sm rotate-12 z-10">
                <div className="text-center font-bold text-xs leading-none">
                    READY<br/>TO PLAY
                </div>
            </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
            <h3 className="font-bold text-2xl font-sans">Pre-Configured R36S Handheld</h3>
            <p className="font-serif italic text-gray-600 border-l-4 border-yellow-400 pl-4">
                "Hero of Bitcoin pre-installed. Power on and play instantly."
            </p>

            <ul className="space-y-3 font-mono text-sm">
                <li className="flex items-center gap-3">
                    <Zap className="text-green-600" size={20} />
                    <span>ArkOS Pre-Installed</span>
                </li>
                <li className="flex items-center gap-3">
                    <Gamepad2 className="text-yellow-600" size={20} />
                    <span>Hero of Bitcoin Ready</span>
                </li>
                <li className="flex items-center gap-3">
                    <HardDrive className="text-blue-600" size={20} />
                    <span>microSD Card Included</span>
                </li>
            </ul>

            {/*
              =========================================================================
              PRODUCT LINK: R36S Console
              =========================================================================
              Links to: Copiaro R36S product page
              Update LINK_R36S_DEVICE constant at top of file when URL changes
              =========================================================================
            */}
            <a
                href={LINK_R36S_DEVICE}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white font-pixel py-4 px-6 border-2 border-black hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow flex items-center justify-center gap-3"
            >
                <ShoppingCart size={18} />
                <span>BUY NOW</span>
            </a>
        </div>
      </div>

      {/* Controls Cheat-Sheet */}
      <div className="mt-12">
        <h4 className="font-pixel text-sm mb-6 border-b-2 border-gray-200 pb-2">Controls</h4>
        <div className="border-2 border-black p-4 bg-gray-50 pixel-shadow-sm">
            <table className="w-full font-mono text-xs">
                <tbody>
                    {shortcuts.map((s, i) => (
                        <tr key={i} className="border-b border-gray-300 last:border-0">
                            <td className="py-2 pr-2">{s.action}</td>
                            <td className="py-2 pl-2 text-right font-bold">{s.buttons.join(' + ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Critical Warning */}
      <PixelCard variant="alert" className="mt-8">
        <div className="flex gap-4">
            <AlertTriangle className="text-red-600 shrink-0" size={24} />
            <div className="text-xs font-mono">
                <strong className="block mb-2 uppercase text-red-600">Safe Shutdown</strong>
                <p className="mb-2">Never pull the card or power-cycle while saving. Wait until screen is fully off.</p>
                <div className="grid md:grid-cols-2 gap-2 text-[10px]">
                    <div><strong>Menu:</strong> START → Quit → Shutdown</div>
                    <div><strong>In-Game:</strong> SELECT+START (twice) → Shutdown</div>
                </div>
            </div>
        </div>
      </PixelCard>

      {/* Technical Details - Collapsible */}
      <div className="mt-8 border-2 border-gray-300">
        <button
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors text-left"
        >
            <span className="font-pixel text-sm flex items-center gap-2">
                <HelpCircle size={16} />
                Technical Details & Troubleshooting
            </span>
            {showTechDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showTechDetails && (
            <div className="p-4 space-y-6 bg-white">
                {/* Power & Charging */}
                <section>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <Zap size={16} className="text-yellow-600" />
                        Power & Charging
                    </h4>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-gray-700">
                        <li>Use <span className="font-bold bg-yellow-200 px-1">USB-A to USB-C</span> cables only</li>
                        <li>Use 5V (1-2A) charger. Avoid fast chargers</li>
                        <li>Charge fully before first use</li>
                        <li>Shut down properly before plugging in</li>
                    </ul>
                </section>

                {/* microSD Handling */}
                <section>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <HardDrive size={16} className="text-blue-600" />
                        microSD Handling
                    </h4>
                    <p className="text-xs font-sans mb-2 text-gray-600">
                        Drive Name: <strong className="font-mono bg-blue-100 px-1 border border-blue-200">EASYROMS</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-gray-700">
                        <li>Do NOT reformat the card</li>
                        <li>Work ONLY on the EASYROMS partition</li>
                        <li>Always EJECT safely</li>
                    </ul>
                </section>

                {/* Adding Games */}
                <section>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <FolderOpen size={16} className="text-yellow-600" />
                        Adding Games
                    </h4>
                    <p className="text-xs font-sans mb-2 text-gray-600">
                        Path: <span className="font-mono bg-gray-100 px-1">EASYROMS/roms/</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-gray-700">
                        <li>Match game to folder (nes → /nes)</li>
                        <li>Bios files are included</li>
                        <li>Avoid special characters in filenames</li>
                    </ul>
                </section>

                {/* Troubleshooting */}
                <section>
                    <h4 className="font-bold text-sm mb-3">Troubleshooting</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="border border-gray-200 p-3 bg-gray-50">
                            <strong className="block text-xs uppercase mb-1">Device Won't Boot</strong>
                            <p className="text-[10px] leading-tight font-mono text-gray-600">Hold POWER + A for 15 seconds. Release, then press Power once.</p>
                        </div>
                        <div className="border border-gray-200 p-3 bg-gray-50">
                            <strong className="block text-xs uppercase mb-1">Games Don't Show</strong>
                            <p className="text-[10px] leading-tight font-mono text-gray-600">Check extensions, unzip files, and rescan ROMs in Options.</p>
                        </div>
                        <div className="border border-gray-200 p-3 bg-gray-50">
                            <strong className="block text-xs uppercase mb-1">Charging Issues</strong>
                            <p className="text-[10px] leading-tight font-mono text-gray-600">Try a different 5V brick. Avoid laptop ports that sleep.</p>
                        </div>
                    </div>
                </section>
            </div>
        )}
      </div>

      {/* Compatibility Note */}
      <PixelCard variant="info" className="mt-8">
        <div className="text-xs font-mono">
            <strong className="block mb-2 uppercase">System Info</strong>
            Running ArkOS v1.1. Supports Game Boy, GBC, GBA, NES, SNES, Genesis, PS1, and more.
        </div>
      </PixelCard>
    </div>
  );
};

export default DeviceGuide;
