
import React from 'react';
import { 
  Smartphone, 
  ShieldAlert, 
  History, 
  Cpu,
  Activity,
  Layers,
  Wrench,
  MapPin,
  Search,
  Zap,
  Bookmark,
  FolderTree,
  Package,
  Terminal,
  ShieldCheck,
  MessageSquare,
  Key,
  Shield,
  Users,
  BarChart3,
  Network
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isConnected, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Smartphone },
    { id: 'profiles', label: 'Profile Vault', icon: Bookmark },
    { id: 'comms', label: 'Comms Center', icon: MessageSquare, disabled: !isConnected },
    { id: 'files', label: 'Filesystem', icon: FolderTree, disabled: !isConnected },
    { id: 'apps', label: 'App Manager', icon: Package, disabled: !isConnected },
    { id: 'antivirus', label: 'Antivirus Suite', icon: Shield, disabled: !isConnected },
    { id: 'location', label: 'Location Matrix', icon: MapPin, disabled: !isConnected },
    { id: 'analyzer', label: 'Performance Lab', icon: Activity, disabled: !isConnected },
    { id: 'advanced-analyzers', label: 'Advanced Analyzers', icon: BarChart3, disabled: !isConnected },
    { id: 'blueprint', label: 'Device Blueprint', icon: Layers, disabled: !isConnected },
    { id: 'maintenance', label: 'Repair & Update', icon: Wrench, disabled: !isConnected },
    { id: 'advanced', label: 'Elevation Lab', icon: Terminal, disabled: !isConnected },
    { id: 'identity', label: 'Identity Reset', icon: Key, disabled: !isConnected },
    { id: 'audit', label: 'Security Audit', icon: ShieldCheck, disabled: !isConnected },
    { id: 'diagnostics', label: 'AI Diagnostics', icon: Zap, disabled: !isConnected },
    { id: 'hardware', label: 'Hardware Info', icon: Cpu, disabled: !isConnected },
    { id: 'actions', label: 'Data Sanitizer', icon: ShieldAlert, disabled: !isConnected },
    { id: 'user-mgmt', label: 'Operator Control', icon: Users, hidden: !isAdmin },
    { id: 'logs', label: 'Operation Logs', icon: History },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Smartphone className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none text-white">Mobile Phone</h1>
          <h1 className="font-bold text-lg tracking-tight leading-none text-indigo-400">Duplex</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.filter(item => !item.hidden).map((item) => (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
            } ${item.disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
          >
            <item.icon size={18} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interface Status</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
          </div>
          <p className="text-sm font-semibold text-slate-200">{isConnected ? 'Duplex Link Active' : 'Waiting for USB...'}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
