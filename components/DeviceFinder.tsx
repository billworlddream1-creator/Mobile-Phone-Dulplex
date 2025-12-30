
import React, { useState } from 'react';
// Added LocateFixed to imports
import { Search, Mail, Phone, Loader2, Globe, ShieldCheck, MapPin, LocateFixed } from 'lucide-react';

const DeviceFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setSearching(true);
    setResult(null);
    
    // Simulated deep-web / network lookup
    await new Promise(r => setTimeout(r, 3000));
    
    setResult({
      status: 'Active',
      model: 'iPhone 15 Pro',
      lastSeen: '2 minutes ago',
      location: 'New York, USA',
      carrier: 'Verizon Wireless',
      networkState: '5G UW',
      signalStrength: '-85 dBm'
    });
    setSearching(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-4">Device Global Finder</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Query the global network nodes to locate a device via its registered number or primary duplex email address.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
            {query.includes('@') ? <Mail size={24} /> : <Phone size={24} />}
          </div>
          <input 
            type="text" 
            placeholder="Enter Phone Number or Email Address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 pl-16 pr-32 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-lg"
          />
          <button 
            type="submit"
            disabled={searching}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-white"
          >
            {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {searching ? 'Tracing...' : 'Trace Device'}
          </button>
        </form>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['IMSI Lookup', 'SS7 Tunnel', 'STUN Server', 'Carrier DB'].map((label) => (
            <div key={label} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800/50 px-3 py-2 rounded-lg border border-white/5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {searching && (
        <div className="flex flex-col items-center py-12 animate-in fade-in">
          <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm text-indigo-400 tracking-widest animate-pulse">INTERCEPTING GLOBAL ROUTING TABLES...</p>
        </div>
      )}

      {result && (
        <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-[2rem] p-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <Globe className="text-white" size={40} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold">{result.model}</h3>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-500/20 uppercase">Online</span>
                </div>
                <p className="text-slate-400 font-medium">Trace target found on {result.carrier}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black">Last Intercept</p>
              <p className="text-xl font-mono font-bold text-indigo-400">{result.lastSeen}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-rose-400">
                <MapPin size={16} />
                <span className="text-xs font-bold uppercase">Estimated Location</span>
              </div>
              <p className="text-lg font-bold">{result.location}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Globe size={16} />
                <span className="text-xs font-bold uppercase">Radio State</span>
              </div>
              <p className="text-lg font-bold">{result.networkState} ({result.signalStrength})</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase">Identity Verified</span>
              </div>
              <p className="text-lg font-bold">Encrypted Handshake OK</p>
            </div>
          </div>

          <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
            <LocateFixed size={20} /> Remote Ping & Signal Burst
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceFinder;
