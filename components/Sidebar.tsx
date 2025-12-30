
import React from 'react';
import { 
  Smartphone, 
  ShieldAlert, 
  Settings, 
  History, 
  Cpu,
  Activity,
  Layers,
  Wrench
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isConnected }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Smartphone },
    { id: 'blueprint', label: 'Device Blueprint', icon: Layers, disabled: !isConnected },
    { id: 'maintenance', label: 'Repair & Update', icon: Wrench, disabled: !isConnected },
    { id: 'diagnostics', label: 'AI Diagnostics', icon: Activity, disabled: !isConnected },
    { id: 'hardware', label: 'Hardware Info', icon: Cpu, disabled: !isConnected },
    { id: 'actions', label: 'Data Sanitizer', icon: ShieldAlert, disabled: !isConnected },
    { id: 'logs', label: 'Operation Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Smartphone className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">NexusLink</h1>
          <p className="text-xs text-slate-400">Pro Mobile Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            } ${item.disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
          >
            <item.icon size={18} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <p className="text-sm font-semibold">{isConnected ? 'Link Active' : 'Waiting for USB...'}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
