
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
  MessageSquare,
  Bookmark,
  FolderTree,
  Package,
  Terminal,
  ShieldCheck,
  Zap,
  Key,
  Shield,
  Users,
  BarChart3,
  Settings,
  Cloud,
  Loader2,
  Usb,
  CreditCard
} from 'lucide-react';
import { DeviceStatus } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: DeviceStatus;
  isAdmin: boolean;
  syncStatus: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, status, isAdmin, syncStatus }) => {
  const isConnected = status === DeviceStatus.CONNECTED;
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Smartphone },
    { id: 'subscriptions', label: 'Licensing', icon: CreditCard },
    { id: 'profiles', label: 'GMT Vault', icon: Bookmark },
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
    { id: 'settings', label: 'System Prefs', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 shadow-2xl z-40">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Smartphone className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-black text-lg tracking-tight leading-none text-white">GMT PHONE</h1>
          <h1 className="font-bold text-lg tracking-tight leading-none text-indigo-400">DUPLEX</h1>
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

      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">GMT Link Status</span>
            <div className={`w-2 h-2 rounded-full ${status === DeviceStatus.CONNECTED ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : status === DeviceStatus.CONNECTING ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`}></div>
          </div>
          <p className="text-xs font-semibold text-slate-200">{status === DeviceStatus.CONNECTED ? 'Secure Handshake OK' : 'Waiting for USB...'}</p>
        </div>

        <div className="bg-indigo-950/20 rounded-xl p-3 border border-indigo-500/10 flex items-center gap-3">
           <Cloud size={16} className={`text-indigo-400 ${syncStatus === 'syncing' ? 'animate-bounce' : ''}`} />
           <div className="flex-1 min-w-0">
             <p className="text-[10px] font-bold text-indigo-300 uppercase truncate">Cloud Persist</p>
             <p className="text-[9px] text-slate-500 truncate">{syncStatus === 'syncing' ? 'Uploading...' : 'Synchronized'}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
