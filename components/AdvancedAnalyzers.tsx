
import React, { useState, useEffect } from 'react';
import { Network, Zap, ShieldAlert, BarChart3, Radio, Database, Activity, Lock, Unlock, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AdvancedAnalyzers: React.FC = () => {
  const [spectrumData, setSpectrumData] = useState<any[]>([]);
  const [entropy, setEntropy] = useState(0.42);
  const [packets, setPackets] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Spectrum Generator
      const bands = ['700MHz', '1.8GHz', '2.1GHz', '3.5GHz', '5.2GHz', '26GHz', '28GHz'];
      setSpectrumData(bands.map(name => ({
        name,
        load: Math.floor(Math.random() * 80) + 10,
        snr: (Math.random() * 30 + 10).toFixed(1)
      })));

      // Entropy Generator
      setEntropy(0.3 + Math.random() * 0.6);

      // Packet Interrogator
      const protocols = ['TLS v1.3', 'HTTP/3', 'SS7-AUTH', 'IMSI-SYNC', 'GTP-U', 'S1-AP'];
      const actions = ['Encrypted Data Burst', 'Handshake Initiation', 'Node Re-authentication', 'Tunnel Establishment'];
      const newPacket = {
        id: Date.now(),
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date().toLocaleTimeString(),
        entropy: (Math.random() * 0.9).toFixed(2)
      };
      setPackets(prev => [newPacket, ...prev].slice(0, 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Diagnostic Analyzers</h2>
          <p className="text-slate-400 text-sm">Radio frequency interrogations and packet-level entropy monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/20">
          <Network size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Protocol Engine: v4.22</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Spectrum Analyzer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Radio className="text-indigo-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Radio Frequency Spectrum</h3>
                <p className="text-xs text-slate-500">Signal load across localized carrier bands</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-black">SNR Delta</p>
                  <p className="text-sm font-bold text-emerald-400">+12.4 dB</p>
               </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spectrumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="load" radius={[6, 6, 0, 0]}>
                  {spectrumData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.load > 70 ? '#f43f5e' : '#6366f1'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Entropy Analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 relative mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={276}
                strokeDashoffset={276 - (entropy * 276)}
                className="text-indigo-500 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-white">{(entropy * 10).toFixed(1)}</p>
              <p className="text-[8px] text-slate-500 uppercase font-bold">Entropy H</p>
            </div>
          </div>
          <h3 className="font-bold mb-2">Data Entropy Monitor</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Measuring bit-level randomness. High values indicate strong encryption (AES-256).
          </p>
          <div className="w-full p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Lock size={14} className="text-indigo-400" />
               <span className="text-[10px] font-bold text-slate-300">SECURE ENCLAVE</span>
            </div>
            <span className="text-[10px] font-black text-emerald-500">VERIFIED</span>
          </div>
        </div>

        {/* Packet Interrogator Feed */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[400px]">
          <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <Activity className="text-indigo-400" size={18} />
              <h3 className="font-bold">Packet Interrogator Stream</h3>
            </div>
            <div className="flex gap-4">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Buffer: 4096 Packets/s</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3 font-mono">
            {packets.map((packet) => (
              <div key={packet.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all animate-in slide-in-from-left-4">
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-600">[{packet.timestamp}]</span>
                  <span className="text-xs font-bold text-indigo-400 w-24">{packet.protocol}</span>
                  <span className="text-xs text-slate-300">{packet.action}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600">ENTROPY</span>
                    <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${parseFloat(packet.entropy) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">PASSED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyzers;
