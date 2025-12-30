
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  History, 
  Globe, 
  LocateFixed, 
  ShieldAlert, 
  Loader2, 
  ExternalLink,
  Map as MapIcon,
  Zap,
  Radio,
  User,
  Smartphone
} from 'lucide-react';
import { findNearbySupport } from '../services/geminiService';

interface LocationTrackerProps {
  brand?: string;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ brand = 'Samsung' }) => {
  const [history] = useState([
    { time: '10:45 AM', loc: '34.0522° N, 118.2437° W', label: 'Primary Node' },
    { time: '11:30 AM', loc: '34.0736° N, 118.4004° W', label: 'Gateway 7' },
    { time: '12:15 PM', loc: '34.0195° N, 118.4912° W', label: 'Mobile Mesh' },
  ]);

  const [isFindingSupport, setIsFindingSupport] = useState(false);
  const [supportResults, setSupportResults] = useState<{text: string, sources: any[]} | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'target' | 'operator'>('target');
  const [operatorCoords, setOperatorCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Attempt to get browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setOperatorCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }
  }, []);

  const handleFindSupport = async () => {
    setIsFindingSupport(true);
    setSupportResults(null);
    
    const coords = operatorCoords || { lat: 34.0522, lng: -118.2437 };
    const result = await findNearbySupport(coords.lat, coords.lng, brand);
    setSupportResults(result);
    setIsFindingSupport(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="text-rose-500" /> Duplex Location Matrix
          </h2>
          <p className="text-sm text-slate-500">Tracking spatial nodes for target and active operator</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex">
            <button
              onClick={() => setTrackingMode('target')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                trackingMode === 'target' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
            >
              <Smartphone size={12} /> Target
            </button>
            <button
              onClick={() => setTrackingMode('operator')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                trackingMode === 'operator' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
            >
              <User size={12} /> Operator
            </button>
          </div>
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${
              showHeatmap 
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30' 
              : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Zap size={12} /> Heatmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] h-[500px] overflow-hidden relative shadow-2xl flex items-center justify-center group">
            {/* Map UI */}
            <div className="absolute inset-0 bg-slate-950">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
              
              {/* Grid Lines */}
              <div className="grid grid-cols-12 grid-rows-12 h-full w-full opacity-20">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-indigo-500/10" />
                ))}
              </div>

              {/* Heatmap Layer */}
              {showHeatmap && (
                <div className="absolute inset-0 animate-in fade-in duration-1000">
                  <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse" />
                  <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
                </div>
              )}
            </div>
            
            {/* Pulsing Target / Operator Pin */}
            <div className="relative z-10">
              <div className={`absolute -inset-12 ${trackingMode === 'target' ? 'bg-rose-500/20' : 'bg-indigo-500/20'} rounded-full animate-ping duration-[3000ms]`} />
              <div className={`bg-${trackingMode === 'target' ? 'rose-500' : 'indigo-600'} p-5 rounded-full shadow-[0_0_50px_rgba(99,102,241,0.8)] border-4 border-white/20 relative cursor-pointer hover:scale-110 transition-transform active:scale-95 group`}>
                {trackingMode === 'target' ? <Navigation className="text-white fill-current" size={32} /> : <User className="text-white" size={32} />}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-indigo-500/50 px-4 py-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
                  <p className="text-xs font-bold uppercase">{trackingMode} POSITION VERIFIED</p>
                  <p className="text-[10px] text-indigo-400 font-mono">
                    {trackingMode === 'target' ? 'LAT: 34.0522 LNG: -118.2437' : `LAT: ${operatorCoords?.lat.toFixed(4) || '??'} LNG: ${operatorCoords?.lng.toFixed(4) || '??'}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Right HUD */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <LocateFixed size={14} className="text-indigo-400" />
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase font-black">Operator Lock</p>
                    <p className="text-[10px] font-mono font-bold text-white">{operatorCoords ? 'GPS SYNCHRONIZED' : 'POLLING SATELLITES...'}</p>
                  </div>
                </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-4">
              <div className="flex-1 bg-slate-950/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Geographic Context</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-lg font-bold text-white leading-none truncate">
                      {trackingMode === 'operator' ? 'Local Operator Node' : 'Linked Target Terminal'}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-mono mt-1">Status: Active Interface</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">Verified</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Integrity</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleFindSupport}
                disabled={isFindingSupport}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
              >
                {isFindingSupport ? <Loader2 size={20} className="animate-spin" /> : <MapIcon size={20} />}
                <span className="whitespace-nowrap">Nearby Repair</span>
              </button>
            </div>
          </div>

          {/* Support Results from Grounding */}
          {supportResults && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 animate-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="text-indigo-400" /> Authorized Local Support
              </h3>
              <div className="prose prose-invert max-w-none text-slate-400 text-sm mb-8 leading-relaxed">
                {supportResults.text}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportResults.sources.map((chunk: any, i: number) => {
                  const source = chunk.web || chunk.maps;
                  if (!source) return null;
                  
                  return (
                    <a 
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-slate-800 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center">
                          <MapPin size={20} />
                        </div>
                        <div className="max-w-[150px] md:max-w-xs overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{source.title || "Support Location"}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">View Source Details</p>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History className="text-indigo-400" size={18} /> Path History
            </h3>
            <div className="space-y-4 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800" />
              {history.map((item, i) => (
                <div key={i} className="relative pl-10 group">
                  <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-slate-700 group-hover:bg-indigo-500 transition-colors z-10" />
                  <p className="text-xs font-bold text-indigo-400">{item.time}</p>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] font-mono text-slate-500">{item.loc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-indigo-400">
              <Radio size={16} /> Triangulation Matrix
            </h4>
            <div className="space-y-3">
               <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black">Operator Sat-Lock</p>
                <p className="text-sm font-bold text-white">{operatorCoords ? 'LOCKED (12 SATS)' : 'ACQUIRING...'}</p>
               </div>
               <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black">Target Beacon</p>
                <p className="text-sm font-bold text-rose-500">ACTIVE - ENCRYPTED</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;
