
import React, { useState } from 'react';
import { Package, Search, Trash2, Download, ExternalLink, Settings, Info, ShieldCheck, Filter, Loader2, Plus } from 'lucide-react';

const AppManager: React.FC = () => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [filter, setFilter] = useState<'all' | 'user' | 'system'>('all');

  const apps = [
    { name: 'System Launcher', package: 'com.android.launcher3', version: '14.1', type: 'system', status: 'Running', size: '42 MB' },
    { name: 'Settings', package: 'com.android.settings', version: '14.0', type: 'system', status: 'Sleeping', size: '12 MB' },
    { name: 'Duplex Agent', package: 'io.duplex.bridge', version: '2.1.4', type: 'user', status: 'Running', size: '8 MB', verified: true },
    { name: 'Social Media', package: 'com.app.social', version: '54.2.1', type: 'user', status: 'Running', size: '184 MB' },
    { name: 'Finance Pro', package: 'com.bank.secure', version: '1.9.0', type: 'user', status: 'Sleeping', size: '62 MB', verified: true },
    { name: 'Mobile Gaming', package: 'com.dev.game', version: '2.0.1', type: 'user', status: 'Stopped', size: '1.4 GB' },
  ];

  const handleInstall = () => {
    setIsInstalling(true);
    setTimeout(() => setIsInstalling(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Process & Package Suite</h2>
          <p className="text-slate-400 text-sm">Complete control over application life-cycles and runtime states</p>
        </div>
        <button 
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          {isInstalling ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          {isInstalling ? 'Pushing Package...' : 'Sideload APK/IPA'}
        </button>
      </div>

      <div className="flex gap-4">
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex">
          {(['all', 'user', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                filter === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search packages..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.filter(app => filter === 'all' || app.type === filter).map((app, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {app.name}
                    {app.verified && <ShieldCheck size={14} className="text-emerald-500" />}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">{app.package}</p>
                </div>
              </div>
              <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                app.status === 'Running' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-transparent'
              }`}>
                {app.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-slate-800/40 p-2 rounded-xl text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black">Version</p>
                <p className="text-xs font-bold">{app.version}</p>
              </div>
              <div className="bg-slate-800/40 p-2 rounded-xl text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black">Memory Usage</p>
                <p className="text-xs font-bold">{app.size}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 border border-transparent hover:border-indigo-500/30">
                <Settings size={12} /> Config
              </button>
              {app.type === 'user' && (
                <button className="flex-1 py-2 bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 border border-transparent hover:border-rose-500/30">
                  <Trash2 size={12} /> Uninstall
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppManager;
