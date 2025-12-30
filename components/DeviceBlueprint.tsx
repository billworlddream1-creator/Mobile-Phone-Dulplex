
import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../types';
import { generateDeviceBlueprint } from '../services/geminiService';
import { Loader2, Zap, Info, Maximize2 } from 'lucide-react';

interface DeviceBlueprintProps {
  device: DeviceInfo;
}

const DeviceBlueprint: React.FC<DeviceBlueprintProps> = ({ device }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlueprint = async () => {
      setLoading(true);
      const url = await generateDeviceBlueprint(device);
      setImgUrl(url);
      setLoading(false);
    };
    fetchBlueprint();
  }, [device]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Structural Design Layout</h2>
          <p className="text-slate-400">AI-generated internal hardware schematic for {device.brand} {device.model}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">X-RAY VIEW</span>
          <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">VERIFIED INTERNALS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Component Mapping</h3>
            <div className="space-y-4">
              {[
                { name: 'SoC Module', pos: 'Top Center', health: '98%' },
                { name: 'Lithium Ion Cell', pos: 'Mid Chassis', health: device.batteryHealth + '%' },
                { name: 'Optic Cluster', pos: 'Rear Top Left', health: '100%' },
                { name: 'Sub-G Antenna', pos: 'Perimeter Rails', health: 'Optimal' },
                { name: 'Haptic Engine', pos: 'Bottom Right', health: 'Verified' },
              ].map((comp, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-default">
                  <div>
                    <p className="text-sm font-bold text-slate-200">{comp.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{comp.pos}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-blue-400">{comp.health}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3 text-blue-400">
              <Zap size={20} />
              <h3 className="font-bold">Hardware Insight</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The internal layout uses a "Sandwich" motherboard design to maximize thermal dissipation for the {device.cpu}. 
              Thermal pads are positioned directly beneath the OLED panel.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative min-h-[600px] flex items-center justify-center group">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-slate-500 font-mono text-sm animate-pulse">GENERATING TECHNICAL SCHEMATIC...</p>
              </div>
            ) : imgUrl ? (
              <>
                <img src={imgUrl} alt="Device Blueprint" className="w-full h-full object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Structural ID</p>
                    <p className="text-lg font-mono font-bold">{device.serialNumber}</p>
                  </div>
                  <button className="bg-blue-600 p-3 rounded-full shadow-xl pointer-events-auto hover:scale-110 transition-transform">
                    <Maximize2 size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <Info size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500">Failed to generate visual schematic. Try reconnecting the device.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceBlueprint;
