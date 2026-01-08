
import React, { useState, useEffect } from 'react';
import { Cpu, Database, Activity, RefreshCw, Zap, Gauge } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const PerformanceAnalyzer: React.FC = () => {
  const [cpuData, setCpuData] = useState<any[]>([]);
  const [ramData, setRamData] = useState<any[]>([]);
  const [freqData, setFreqData] = useState<any[]>([]);
  const [cores, setCores] = useState<any[]>([]);

  useEffect(() => {
    // Initial core setup
    const initialCores = [
      { id: 0, arch: 'Cortex-X4', type: 'Prime', clock: 3.39, load: 0 },
      { id: 1, arch: 'Cortex-A720', type: 'Gold', clock: 3.10, load: 0 },
      { id: 2, arch: 'Cortex-A720', type: 'Gold', clock: 3.10, load: 0 },
      { id: 3, arch: 'Cortex-A720', type: 'Gold', clock: 3.10, load: 0 },
      { id: 4, arch: 'Cortex-A520', type: 'Silver', clock: 2.20, load: 0 },
      { id: 5, arch: 'Cortex-A520', type: 'Silver', clock: 2.20, load: 0 },
      { id: 6, arch: 'Cortex-A520', type: 'Silver', clock: 2.20, load: 0 },
      { id: 7, arch: 'Cortex-A520', type: 'Silver', clock: 2.20, load: 0 },
    ];
    setCores(initialCores);

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const newCpu = Math.floor(Math.random() * 40) + 10;
      const newRam = Math.floor(Math.random() * 15) + 65;
      
      // Prime core frequency variation for the meter
      const primeVar = (3.39 - Math.random() * 0.8).toFixed(2);

      setCpuData(prev => [...prev.slice(-15), { time: now, value: newCpu }]);
      setRamData(prev => [...prev.slice(-15), { time: now, value: newRam }]);
      setFreqData(prev => [...prev.slice(-20), { time: now, value: parseFloat(primeVar) }]);
      
      setCores(prevCores => prevCores.map(core => ({
        ...core,
        load: Math.floor(Math.random() * 100),
        // Significant variation for Prime core, slight for others to simulate real DVFS
        clock: core.type === 'Prime' ? primeVar : 
               core.type === 'Gold' ? (3.10 - Math.random() * 0.4).toFixed(2) : 
               (2.20 - Math.random() * 0.2).toFixed(2)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPrimeFreq = cores[0]?.clock || '0.00';

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Activity className="text-indigo-400" /> Duplex Performance Lab
        </h2>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-4 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Live Frequency</span>
              <span className="text-sm font-mono font-bold text-indigo-400 animate-pulse">{currentPrimeFreq} GHz</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Memory Bus</span>
              <span className="text-sm font-mono font-bold text-emerald-400">LPDDR5X (Quad)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Real-time Frequency Meter Card */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group flex flex-col items-center justify-center">
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <Gauge className="text-indigo-400" size={16} />
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Clock Oscillator</span>
          </div>
          
          <div className="relative w-40 h-40 mt-4">
             <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - ( (parseFloat(currentPrimeFreq) / 3.39) * 440 )}
                className="text-indigo-500 transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-white">{currentPrimeFreq}</p>
              <p className="text-[8px] text-slate-500 uppercase font-black">GHz</p>
            </div>
          </div>
          
          <div className="mt-6 w-full h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={freqData}>
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 tracking-widest italic">Node 0: Prime Core Pulse</p>
        </div>

        {/* Per-Core Analysis Section */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Zap className="text-indigo-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Multi-Core Interrogation</h3>
                <p className="text-xs text-slate-500">Individual node telemetry for Octa-core cluster</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cores.map((core) => (
              <div key={core.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 transition-all hover:border-indigo-500/30 group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${
                    core.type === 'Prime' ? 'bg-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 
                    core.type === 'Gold' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'
                  }`}>
                    CORE {core.id}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold mb-1 truncate">{core.arch}</p>
                <div className="h-1 bg-slate-700 rounded-full mb-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      core.load > 80 ? 'bg-rose-500' : core.load > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${core.load}%` }}
                  />
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[9px] text-slate-400 font-mono font-bold tracking-tighter">{core.clock} GHz</span>
                  <span className="text-xs font-mono font-bold text-white">{core.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Cpu className="text-indigo-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">CPU Load Analysis</h3>
                <p className="text-xs text-slate-500">Real-time aggregate core oscillation</p>
              </div>
            </div>
            <span className="text-2xl font-mono font-black text-indigo-500 drop-shadow-sm">
              {cpuData[cpuData.length - 1]?.value || 0}%
            </span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RAM Analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Database className="text-emerald-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">RAM Memory Pool</h3>
                <p className="text-xs text-slate-500">Dynamic allocation tracking</p>
              </div>
            </div>
            <span className="text-2xl font-mono font-black text-emerald-500 drop-shadow-sm">
              {ramData[ramData.length - 1]?.value || 0}%
            </span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="stepAfter" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center gap-4 hover:border-indigo-500/20 transition-all">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 shadow-inner">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Process Count</p>
            <p className="text-xl font-bold text-white">412 Running</p>
          </div>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center gap-4 hover:border-emerald-500/20 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shadow-inner">
            <Database size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Swap File</p>
            <p className="text-xl font-bold text-white">8.0 GB Active</p>
          </div>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center gap-4 hover:border-rose-500/20 transition-all">
          <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 shadow-inner">
            <RefreshCw size={24} className="animate-spin-slow" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Thermal State</p>
            <p className="text-xl font-bold text-rose-400">38.4°C (Safe)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;
