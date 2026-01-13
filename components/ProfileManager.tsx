
import React, { useState } from 'react';
import { DeviceProfile, DeviceInfo } from '../types';
import { 
  Bookmark, 
  Trash2, 
  Download, 
  Plus, 
  Calendar, 
  Smartphone, 
  Shield, 
  Search,
  CheckCircle2,
  Clock,
  Filter,
  Cloud,
  ChevronDown
} from 'lucide-react';

interface ProfileManagerProps {
  profiles: DeviceProfile[];
  onLoad: (profile: DeviceProfile) => void;
  onDelete: (id: string) => void;
  onSave: (name: string, category: DeviceProfile['category']) => void;
  isConnected: boolean;
  currentDevice: DeviceInfo | null;
}

const CATEGORIES: (DeviceProfile['category'] | 'All')[] = ['All', 'Diagnostic', 'Audit', 'Forensic', 'Custom'];

const ProfileManager: React.FC<ProfileManagerProps> = ({ 
  profiles, 
  onLoad, 
  onDelete, 
  onSave, 
  isConnected,
  currentDevice 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileCategory, setNewProfileCategory] = useState<DeviceProfile['category']>('Diagnostic');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DeviceProfile['category'] | 'All'>('All');

  const handleSave = () => {
    if (newProfileName.trim()) {
      onSave(newProfileName, newProfileCategory);
      setNewProfileName('');
      setIsSaving(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.deviceInfo.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'All' || p.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="text-indigo-400" /> Duplex Profile Vault
          </h2>
          <p className="text-slate-400 text-sm">Manage persistent diagnostic configurations and hardware snapshots.</p>
        </div>
        
        <button 
          onClick={() => setIsSaving(true)}
          disabled={!isConnected}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Snapshot Current Link
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search vault by name or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
          />
        </div>

        {/* Category Filters */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === cat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              {profile.cloudSynced && (
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg" title="Cloud Synced">
                   <Cloud size={14} />
                </div>
              )}
              <button 
                onClick={() => onDelete(profile.id)}
                className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                profile.category === 'Forensic' ? 'bg-rose-500/10 text-rose-500' :
                profile.category === 'Audit' ? 'bg-amber-500/10 text-amber-500' :
                'bg-indigo-500/10 text-indigo-500'
              }`}>
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">{profile.profileName}</h3>
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{profile.category}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-slate-600" />
                  <span>{profile.deviceInfo.model}</span>
                </div>
                {profile.cloudSynced && <span className="text-[10px] text-indigo-400 font-bold">Cloud Verified</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar size={14} className="text-slate-600" />
                <span>Saved: {new Date(profile.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => onLoad(profile)}
              className="w-full py-3 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-auto"
            >
              <Download size={16} /> Restore Configuration
            </button>
          </div>
        ))}
        
        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-30">
              <Filter size={32} />
            </div>
            <h3 className="text-slate-500 font-bold">No snapshots found for this category.</h3>
            <p className="text-slate-600 text-sm">Refine your search parameters or adjust the classification filter.</p>
          </div>
        )}
      </div>

      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                <Bookmark size={24} />
              </div>
              <h2 className="text-2xl font-black">Vault Snapshot</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 block">Profile Alias</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. S24 Ultra - Standard Audit"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 block">Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Diagnostic', 'Audit', 'Forensic', 'Custom'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewProfileCategory(cat as any)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                        newProfileCategory === cat 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-transparent text-slate-400 hover:border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setIsSaving(false)}
                  className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-800 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:brightness-110"
                >
                  Encrypt & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
