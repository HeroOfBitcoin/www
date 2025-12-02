import React from 'react';
import { AlertTriangle, HardDrive, FolderOpen } from 'lucide-react';
import { Shortcut } from '../types';

const shortcuts: Shortcut[] = [
  { action: 'Hotkey Modifier', buttons: ['SELECT'] },
  { action: 'Exit Game', buttons: ['SELECT', 'START'] },
  { action: 'Save State', buttons: ['SELECT', 'R1'] },
  { action: 'Load State', buttons: ['SELECT', 'L1'] },
  { action: 'Fast Forward', buttons: ['SELECT', 'R2'] },
  { action: 'Screenshot', buttons: ['SELECT', 'Y'] },
];

const DeviceGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn text-black bg-white">
      
      {/* Header Block - Looks like printed doc header */}
      <div className="border-b-4 border-black pb-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
                <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-tighter">R36S Quick-Start</h2>
                <p className="font-sans text-sm font-bold mt-1">UNOFFICIAL COMPANION GUIDE</p>
                <div className="text-right md:hidden mt-2">
                    <div className="font-mono text-xs border border-black px-2 py-1 inline-block">ArkOS v1.1</div>
                </div>
            </div>

            {/*
              =========================================================================
              IMAGE #14: R36S DEVICE PHOTO
              =========================================================================
              Location: public/assets/device/r36s-custom.png
              Size: 300x200px or 600x400px recommended
              Description: Photo of your customized R36S handheld device
                           showing the Hero of Bitcoin game or branding
              Currently showing: Placeholder box
              =========================================================================
            */}
            <div className="w-full md:w-48 h-32 bg-gray-100 border-2 border-black flex items-center justify-center pixel-shadow-sm shrink-0">
                <span className="font-pixel text-[10px] text-gray-400 text-center px-2">R36S DEVICE<br/>IMAGE</span>
            </div>

            <div className="text-right hidden md:block">
                <div className="font-mono text-xs border border-black px-2 py-1 inline-block">ArkOS v1.1</div>
                <div className="font-mono text-xs mt-1">20251014</div>
            </div>
        </div>
      </div>

      {/* 1. CRITICAL WARNING (Red Ink style) */}
      <div className="border-2 border-red-600 bg-red-50 p-6 pixel-shadow-sm">
        <div className="flex gap-4">
            <AlertTriangle className="text-red-600 shrink-0" size={32} />
            <div>
                <h3 className="text-lg font-bold text-red-600 font-mono uppercase mb-2">2) SAFE SHUTDOWN (CRITICAL!)</h3>
                <p className="font-sans text-sm mb-4 leading-relaxed font-semibold">
                    Never pull the card or power-cycle while a game is saving. Wait until the screen is fully off.
                </p>
                <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="bg-white border border-red-200 p-2">
                        <span className="block font-bold underline mb-1">SYSTEM MENU:</span>
                        START → Quit → Shutdown System
                    </div>
                    <div className="bg-white border border-red-200 p-2">
                        <span className="block font-bold underline mb-1">IN-GAME:</span>
                        SELECT + START (twice) → Shutdown
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Power */}
        <section>
            <h3 className="font-pixel text-sm bg-black text-white px-2 py-1 inline-block mb-4">1) Power & Charging</h3>
            <ul className="list-disc list-inside space-y-2 font-mono text-xs md:text-sm">
                <li>Use <span className="font-bold bg-yellow-200">USB-A to USB-C</span> cables only.</li>
                <li>Use 5V (1-2A) charger. Avoid fast chargers.</li>
                <li>Charge fully before first use.</li>
                <li>Shut down properly before plugging in.</li>
            </ul>
        </section>

        {/* Shortcuts */}
        <section>
            <h3 className="font-pixel text-sm bg-black text-white px-2 py-1 inline-block mb-4">3) Controls Cheat-Sheet</h3>
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
        </section>
      </div>

      <hr className="border-t-2 border-dashed border-gray-400 my-8" />

      {/* ROMS & SD Card */}
      <div className="grid md:grid-cols-2 gap-8">
         <section className="bg-blue-50 border-2 border-blue-900 p-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                <HardDrive size={18}/> 
                4) microSD Handling
            </h3>
            <p className="text-xs font-sans mb-2">Drive Name: <strong className="font-mono bg-white px-1 border border-blue-200">EASYROMS</strong></p>
            <ul className="text-xs list-square ml-4 space-y-1 text-blue-900">
                <li>Do NOT reformat the card.</li>
                <li>Work ONLY on the EASYROMS partition.</li>
                <li>Always EJECT safely.</li>
            </ul>
         </section>

         <section className="bg-yellow-50 border-2 border-yellow-600 p-4">
            <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-3">
                <FolderOpen size={18}/> 
                6) Adding Games
            </h3>
            <p className="text-xs font-sans mb-2">Path: <span className="font-mono">EASYROMS/roms/</span></p>
            <ul className="text-xs list-square ml-4 space-y-1 text-yellow-900">
                <li>Match game to folder (nes &rarr; /nes).</li>
                <li>Bios files are included.</li>
                <li>Avoid special characters in filenames.</li>
            </ul>
         </section>
      </div>

      {/* Troubleshooting */}
      <section className="mt-8">
         <h3 className="font-pixel text-sm bg-black text-white px-2 py-1 inline-block mb-4 w-full md:w-auto text-center md:text-left">
            8) Quick Troubleshooting
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="border border-black p-3 hover:bg-black hover:text-white transition-colors cursor-default group">
                 <strong className="block text-xs uppercase mb-2 group-hover:text-yellow-400">Device Won't Boot</strong>
                 <p className="text-[10px] leading-tight font-mono">Hold POWER + A (or B) for 15 seconds. Release, then press Power once.</p>
             </div>
             <div className="border border-black p-3 hover:bg-black hover:text-white transition-colors cursor-default group">
                 <strong className="block text-xs uppercase mb-2 group-hover:text-yellow-400">Games Don't Show</strong>
                 <p className="text-[10px] leading-tight font-mono">Check extensions, unzip files, and rescan ROMs in Options.</p>
             </div>
             <div className="border border-black p-3 hover:bg-black hover:text-white transition-colors cursor-default group">
                 <strong className="block text-xs uppercase mb-2 group-hover:text-yellow-400">Charging Issues</strong>
                 <p className="text-[10px] leading-tight font-mono">Try a different 5V brick. Do not use laptop ports that sleep.</p>
             </div>
         </div>
      </section>

    </div>
  );
};

export default DeviceGuide;