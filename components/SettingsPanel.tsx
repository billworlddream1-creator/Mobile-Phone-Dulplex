
import React from 'react';
import { Settings, Cloud, Shield, Bell, Database, Trash2, Save, RefreshCw } from 'lucide-react';
import { AppSettings, CloudSyncStatus } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  syncStatus: CloudSyncStatus;
  lastSynced: string;
  onManualSync: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  updateSettings, 
  syncStatus, 
  lastSynced, 
  onManualSync 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">System Preferences</h2>
          <p className="text-slate-400">Configure global duplex environment and cloud synchronization parameters</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <div className={`w-3 h-3 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Cloud Engine Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cloud Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 rounded-2xl flex items-center justify-center">
              <Cloud size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Cloud Synchronization</h3>
              <p className="text-xs text-slate-500">Auto-persist profiles and lab settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-white/5">
              <span className="text-sm font-medium text-slate-200">Continuous Auto-Sync</span>
              <button 
                onClick={() => updateSettings({ autoSync: !settings.autoSync })}
                className={`w-12 h-6 rounded-full transition-all relative ${settings.autoSync ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoSync ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Last Secure Backup</p>
              <p className="text-sm font-mono text-indigo-400">{lastSynced || 'Never Synced'}</p>
            </div>

            <button 
              onClick={onManualSync}
              disabled={syncStatus === 'syncing'}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
            >
              {syncStatus === 'syncing' ? <RefreshCw className="animate-spin" size={20} /> : <Cloud size={20} />}
              {syncStatus === 'syncing' ? 'Encrypting & Uploading...' : 'Sync Vault Now'}
            </button>
          </div>
        </div>

        {/* Security Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Lab Security Level</h3>
              <p className="text-xs text-slate-500">Forensic data handling strictness</p>
            </div>
          </div>

          <div className="space-y-4">
            {(['Standard', 'Strict', 'Paranoid'] as const).map((level) => (
              <button
                key={level}
                onClick={() => updateSettings({ securityLevel: level })}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  settings.securityLevel === level 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                  : 'bg-slate-800/40 border-transparent text-slate-400 hover:border-white/10'
                }`}
              >
                <span className="font-bold">{level}</span>
                {settings.securityLevel === level && <Shield size={16} />}
              </button>
            ))}
            <p className="text-[10px] text-slate-600 italic px-2">
              * Paranoid level enables zero-knowledge encryption for all cloud blobs.
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl md:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
              <Database size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Local Cache & Integrity</h3>
              <p className="text-xs text-slate-500">Manage disk usage and system logs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Log Retention (Days)</label>
              <input 
                type="number" 
                value={settings.logRetentionDays}
                onChange={(e) => updateSettings({ logRetentionDays: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <button className="py-3.5 px-6 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} /> Clear Session Logs
              </button>
            </div>

            <div className="flex flex-col justify-end">
              <button className="py-3.5 px-6 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} /> Factory Reset App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
