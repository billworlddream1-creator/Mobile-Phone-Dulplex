import React, { useState } from 'react';
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
  HardDrive
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DeviceDashboardProps {
  device: DeviceInfo;
  onAnalyze?: () => void;
}

const DeviceDashboard: React.FC<DeviceDashboardProps> = ({ device, onAnalyze }) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const storageUsedPercent = Math.round((device.storageUsed / device.storageTotal) * 100);
  
  const storageData = [
    { name: 'Used', value: device.storageUsed },
    { name: 'Free', value: device.storageTotal - device.storageUsed },
  ];

  const getStorageColor = (percent: number) => {
    if (percent < 50) return '#10b981'; // Emerald-500
    if (percent < 75) return '#f59e0b'; // Amber-500
    if (percent < 90) return '#f97316'; // Orange-500
    return '#f43f5e'; // Rose-500
  };

  const getStorageTailwindColor = (percent: number) => {
    if (percent < 50) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (percent < 75) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (percent < 90) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const statusColor = getStorageColor(storageUsedPercent);
  const COLORS = [statusColor, '#1e293b'];

  const InfoCard = ({ icon: Icon, label, value, colorClass, extra }: any) => (
    <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-2xl hover:border-slate-500 transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${colorClass}`}>
            <Icon size={18} />
          </div>
          <span className="text-slate-400 text-sm font-medium">{label}</span>
        </div>
        {extra}
      </div>
      <p className="text-xl font-bold tracking-tight text-white">{value}</p>
    </div>
  );

  const maskString = (str: string) => showSensitive ? str : str.replace(/.(?=.{4})/g, '*');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-600/5 border border-indigo-500/10 p-6 rounded-[2rem] mb-2">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Zap className="text-indigo-400" size={24} />
            Device Overview
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">Handshake verified with {device.brand} secure kernel</p>
        </div>
        <button 
          onClick={onAnalyze}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
        >
          <Search size={20} className="group-hover:scale-110 transition-transform" />
          Initialize Deep AI Analysis
          <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <InfoCard 
          icon={Smartphone} 
          label="Model String" 
          value={device.model} 
          colorClass="bg-blue-500/10 text-blue-500" 
        />
        <InfoCard 
          icon={ShieldCheck} 
          label="Build Version" 
          value={device.osVersion} 
          colorClass="bg-green-500/10 text-green-500" 
        />
        <InfoCard 
          icon={Battery} 
          label="Cell Status" 
          value={`${device.batteryHealth}%`} 
          colorClass="bg-yellow-500/10 text-yellow-500" 
        />
        <InfoCard 
          icon={Radio} 
          label="Signal Strength" 
          value={`${device.signalStrength} dBm`} 
          colorClass="bg-teal-500/10 text-teal-500" 
        />
        <InfoCard 
          icon={Database} 
          label="NAND Storage" 
          value={`${device.storageTotal} GB`} 
          colorClass="bg-purple-500/10 text-purple-500"
          extra={
            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStorageTailwindColor(storageUsedPercent)}`}>
              {storageUsedPercent}% Full
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Network Topology Detection Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Network size={120} />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Radio size={20} className="text-indigo-400" />
                Network Intelligence Prober
              </h3>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <Zap size={10} className="animate-pulse" /> Live Detection
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Detected Type</p>
                <p className="text-xl font-black text-indigo-400">{device.networkType}</p>
                <div className="mt-4 flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Carrier ID</p>
                <p className="text-xl font-black text-white">{device.carrierName}</p>
                <p className="text-[10px] text-slate-600 font-mono mt-2">MCC: 310 | MNC: 120</p>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Signal Floor</p>
                <p className="text-xl font-black text-white">{device.signalStrength} <span className="text-xs font-normal text-slate-500">dBm</span></p>
                <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase">Excellent Quality</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
              <Wifi size={16} className="text-indigo-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-300">Secondary Interface: Wi-Fi 7 (802.11be)</p>
                <p className="text-[10px] text-slate-500">Connected to DUPLEX-HQ-SECURE (6GHz Band)</p>
              </div>
            </div>
          </div>

          {/* Identity and Accounts Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Fingerprint size={20} className="text-blue-400" />
                Identity & Access Rights
              </h3>
              <button 
                onClick={() => setShowSensitive(!showSensitive)}
                className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
              >
                {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
                {showSensitive ? 'Mask Privacy' : 'Reveal Data'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={14} className="text-blue-400" />
                  <span className="text-xs text-slate-500 uppercase font-bold">Active SIM Line</span>
                </div>
                <p 
                  className={`font-mono text-blue-300 cursor-help ${!showSensitive ? 'border-b border-dashed border-blue-300/30' : ''}`}
                  title={!showSensitive ? "This information is masked for privacy. Click 'Reveal Data' to view." : undefined}
                >
                  {maskString(device.phoneNumber)}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-purple-400" />
                  <span className="text-xs text-slate-500 uppercase font-bold">Primary Account</span>
                </div>
                <p 
                  className={`font-mono text-purple-300 cursor-help ${!showSensitive ? 'border-b border-dashed border-purple-300/30' : ''}`}
                  title={!showSensitive ? "This information is masked for privacy. Click 'Reveal Data' to view." : undefined}
                >
                  {maskString(device.associatedEmail)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <h3 className="text-lg font-black mb-4 self-start flex items-center gap-2">
            <HardDrive size={18} className="text-slate-500" />
            NAND Architecture
          </h3>
          
          <div className="w-full h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
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
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-4xl font-black text-white leading-none">{storageUsedPercent}%</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Sectors</p>
            </div>
          </div>

          {/* Storage Health Indicator Bar */}
          <div className="w-full mt-6 px-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Storage Status</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${getStorageTailwindColor(storageUsedPercent).split(' ')[0]}`}>
                {storageUsedPercent < 50 ? 'Healthy' : storageUsedPercent < 75 ? 'Optimal' : storageUsedPercent < 90 ? 'Critical' : 'Near Capacity'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${storageUsedPercent}%`,
                  backgroundColor: statusColor,
                  boxShadow: `0 0 10px ${statusColor}44`
                }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 w-full">
            <div className="text-left border-l-2 pl-3 transition-colors" style={{ borderColor: statusColor }}>
              <p className="text-[10px] text-slate-500 uppercase font-black">Mapped</p>
              <p className="text-xl font-black text-white">{device.storageUsed} GB</p>
            </div>
            <div className="text-left border-l-2 border-slate-700 pl-3">
              <p className="text-[10px] text-slate-500 uppercase font-black">Available</p>
              <p className="text-xl font-black text-white">{device.storageTotal - device.storageUsed} GB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDashboard;