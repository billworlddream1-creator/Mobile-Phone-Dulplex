
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
  EyeOff
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DeviceDashboardProps {
  device: DeviceInfo;
}

const DeviceDashboard: React.FC<DeviceDashboardProps> = ({ device }) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const storageData = [
    { name: 'Used', value: device.storageUsed },
    { name: 'Free', value: device.storageTotal - device.storageUsed },
  ];
  const COLORS = ['#3b82f6', '#1e293b'];

  const InfoCard = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-2xl hover:border-slate-500 transition-all group">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${colorClass}`}>
          <Icon size={18} />
        </div>
        <span className="text-slate-400 text-sm font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold tracking-tight text-white">{value}</p>
    </div>
  );

  const maskString = (str: string) => showSensitive ? str : str.replace(/.(?=.{4})/g, '*');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          icon={Database} 
          label="NAND Storage" 
          value={`${device.storageTotal} GB`} 
          colorClass="bg-purple-500/10 text-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                <p className="font-mono text-blue-300">{maskString(device.phoneNumber)}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-purple-400" />
                  <span className="text-xs text-slate-500 uppercase font-bold">Primary Account</span>
                </div>
                <p className="font-mono text-purple-300">{maskString(device.associatedEmail)}</p>
              </div>
            </div>
          </div>

          {/* Detailed OS Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity size={20} className="text-green-400" />
              OS Subsystem & Hardware ID
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Full OS Build Signature</span>
                <span className="font-mono text-xs text-blue-400 bg-blue-500/5 px-2 py-1 rounded">{device.osBuild}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Hardware Serial</span>
                <span className="font-mono text-sm text-slate-200">{device.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">IMEI Baseband</span>
                <span className="font-mono text-sm text-slate-200">{maskString(device.imei)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Kernel Architecture</span>
                <span className="font-mono text-sm text-slate-200">{device.cpu}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-400 text-sm">Memory Subsystem</span>
                <span className="font-mono text-sm text-slate-200">{device.ram}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
          <h3 className="text-lg font-semibold mb-4 self-start">Disk Architecture</h3>
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
              <p className="text-3xl font-bold text-white">{Math.round((device.storageUsed / device.storageTotal) * 100)}%</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Encrypted</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 w-full">
            <div className="text-left border-l-2 border-blue-500 pl-3">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Occupied</p>
              <p className="text-xl font-bold text-white">{device.storageUsed} GB</p>
            </div>
            <div className="text-left border-l-2 border-slate-700 pl-3">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Unmapped</p>
              <p className="text-xl font-bold text-white">{device.storageTotal - device.storageUsed} GB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDashboard;
