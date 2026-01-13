
import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../types';
import { 
  Battery, 
  Database, 
  Smartphone, 
  ShieldCheck, 
  Activity,
  Phone,
  Mail,
  Fingerprint,
  Eye,
  EyeOff,
  Radio,
  Wifi,
  Zap,
  Network,
  Search,
  ChevronRight,
  HardDrive,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Loader2,
  Layers,
  Maximize2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateDeviceBlueprint } from '../services/geminiService';

interface DeviceDashboardProps {
  device: DeviceInfo;
  onAnalyze?: () => void;
  onQuickAction?: (action: string) => void;
}

const DeviceDashboard: React.FC<DeviceDashboardProps> = ({ device, onAnalyze, onQuickAction }) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  
  const storageUsedPercent = Math.round((device.storageUsed / device.storageTotal) * 100);
  
  const storageData = [
    { name: 'Used', value: device.storageUsed },
    { name: 'Free', value: device.storageTotal - device.storageUsed },
  ];

  const COLORS = ['#6366f1', '#1e293b'];

  useEffect(() => {
    const fetchBlueprint = async () => {
      setLoadingBlueprint(true);
      const url = await generateDeviceBlueprint(device);
      setBlueprintUrl(url);
      setLoadingBlueprint(false);
    };
    fetchBlueprint();
  }, [device]);

  const InfoCard = ({ icon: Icon, label, value, colorClass, extra }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${colorClass}`}>
            <Icon size={18} />
          </div>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {extra}
      </div>
      <p className="text-xl font-black tracking-tight text-white">{value}</p>
    </div>
  );

  const maskString = (str: string) => showSensitive ? str : str.replace(/.(?=.{4})/g, '*');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-600/5 border border-indigo-500/10 p-8 rounded-[3rem] mb-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Zap className="text-indigo-400" size={32} />
            GMT COMMAND HUB
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">Interface active: Target device {device.brand} {device.model} connected.</p>
        </div>
        <button 
          onClick={onAnalyze}
          className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 group active:scale-95"
        >
          <Search size={20} className="group-hover:scale-110 transition-transform" />
          Initialize Deep AI Analysis
          <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <InfoCard 
          icon={Smartphone} 
          label="Target Model" 
          value={device.model} 
          colorClass="bg-blue-500/10 text-blue-500" 
        />
        <InfoCard 
          icon={ShieldCheck} 
          label="Kernel Branch" 
          value={device.osVersion} 
          colorClass="bg-emerald-500/10 text-emerald-400" 
        />
        <InfoCard 
          icon={Battery} 
          label="Battery State" 
          value={`${device.batteryHealth}%`} 
          colorClass="bg-amber-500/10 text-amber-500" 
        />
        <InfoCard 
          icon={Radio} 
          label="Signal Strength" 
          value={`${device.signalStrength} dBm`} 
          colorClass="bg-rose-500/10 text-rose-500" 
        />
        <InfoCard 
          icon={Database} 
          label="Physical NAND" 
          value={`${device.storageTotal} GB`} 
          colorClass="bg-indigo-500/10 text-indigo-400"
          extra={
            <div className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase border bg-slate-800 border-white/5 text-slate-400`}>
              {storageUsedPercent}% ALLOCATED
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network & Identity (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Network size={24} className="text-indigo-400" />
                SECURE OPERATIONS HUB
              </h3>
              <div className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                <ShieldAlert size={12} className="animate-pulse" /> Live Action Center
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => onQuickAction?.('wipe')}
                className="flex items-center gap-4 p-5 bg-slate-950 border border-slate-800 rounded-3xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group text-left"
              >
                <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase text-xs tracking-wider">DoD Secure Wipe</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">7-Pass NAND Sanitization</p>
                </div>
              </button>

              <button 
                onClick={() => onQuickAction?.('format')}
                className="flex items-center gap-4 p-5 bg-slate-950 border border-slate-800 rounded-3xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group text-left"
              >
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase text-xs tracking-wider">Partition Reset</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Full Factory Reconstruction</p>
                </div>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between p-6 bg-slate-950 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-600">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Interface integrity</p>
                  <p className="text-sm font-black text-emerald-400">NOMINAL OPERATION • 99.9% SYNC</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className={`h-4 w-1 rounded-full ${i < 7 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'}`} style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Fingerprint size={24} className="text-indigo-400" />
                IDENTITY MAPPING
              </h3>
              <button 
                onClick={() => setShowSensitive(!showSensitive)}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors bg-slate-950 px-4 py-2 rounded-xl border border-slate-800"
              >
                {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
                {showSensitive ? 'Obfuscate' : 'Reveal Data'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={14} className="text-indigo-400" />
                  <span className="text-[10px] text-slate-600 uppercase font-black">Endpoint Phone</span>
                </div>
                <p className="font-mono text-white text-lg font-bold tracking-tighter">
                  {maskString(device.phoneNumber)}
                </p>
              </div>
              <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={14} className="text-emerald-400" />
                  <span className="text-[10px] text-slate-600 uppercase font-black">Linked Duplex Account</span>
                </div>
                <p className="font-mono text-white text-lg font-bold tracking-tighter">
                  {maskString(device.associatedEmail)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint & Storage (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black flex items-center gap-3">
                <Layers size={20} className="text-indigo-400" />
                LIVE SCHEMATIC
              </h3>
              <div className="p-2 bg-slate-950 rounded-xl text-slate-500 group-hover:text-indigo-400 transition-colors">
                <Maximize2 size={16} />
              </div>
            </div>
            
            <div className="flex-1 bg-slate-950 rounded-[2rem] border border-white/5 relative overflow-hidden flex items-center justify-center p-4">
              {loadingBlueprint ? (
                <div className="text-center flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest animate-pulse">Mapping Components...</p>
                </div>
              ) : blueprintUrl ? (
                <img src={blueprintUrl} alt="Schematic" className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="text-center">
                   <ShieldAlert size={32} className="mx-auto text-slate-800 mb-2" />
                   <p className="text-[10px] text-slate-600 font-bold uppercase">Schematic Failure</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-indigo-600/5 rounded-2xl border border-indigo-500/10">
               <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Architecture detection</p>
               <p className="text-xs font-bold text-indigo-300">Snapdragon Gen 3 Intercepted</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between mb-8">
              <h3 className="text-lg font-black flex items-center gap-3 uppercase tracking-tight">
                <HardDrive size={20} className="text-slate-500" />
                NAND POOL
              </h3>
              <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{storageUsedPercent}%</span>
            </div>
            
            <div className="w-full h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                    itemStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-black text-white">{storageUsedPercent}%</p>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Utilized</p>
              </div>
            </div>

            <div className="w-full mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Allocated</p>
                <p className="text-sm font-black text-white">{device.storageUsed} GB</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Available</p>
                <p className="text-sm font-black text-white">{device.storageTotal - device.storageUsed} GB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDashboard;
