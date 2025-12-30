
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu, Lock, Unlock, Zap, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AdvancedAccess: React.FC = () => {
  const [isElevated, setIsElevated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    "Initializing Duplex Elevation Protocol...",
    "Bypassing locked bootloader verification...",
    "Injecting temporary SU binary to /sbin...",
    "Patching kernel image with dm-verity disabled...",
    "Remounting /system as read-write...",
    "Updating secure enclave permissions...",
    "Finalizing root shell access..."
  ];

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleElevate = async () => {
    setIsProcessing(true);
    setLogs([]);
    setStep(0);
    
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      addLog(steps[i]);
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    }
    
    setIsElevated(true);
    setIsProcessing(false);
    addLog("SUCCESS: SYSTEM PRIVILEGES ELEVATED TO ROOT.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Elevation Lab</h2>
          <p className="text-slate-400 text-sm">System-level privilege escalation and kernel interrogation</p>
        </div>
        <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border transition-all ${
          isElevated ? 'bg-rose-500/10 border-rose-500 text-rose-500' : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}>
          {isElevated ? <Unlock size={18} /> : <Lock size={18} />}
          <span className="text-sm font-bold uppercase tracking-widest">{isElevated ? 'Privileged Access Active' : 'Restricted Mode'}</span>
        </div>
      </div>

      {!isElevated && !isProcessing && (
        <div className="bg-rose-600/10 border border-rose-500/20 rounded-[2.5rem] p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <AlertTriangle size={40} />
          </div>
          <h3 className="text-3xl font-black mb-4">Initialize Root Access?</h3>
          <p className="text-slate-400 max-w-lg mb-10 leading-relaxed">
            Rooting bypasses standard OS security controls. This allows for total device customization but increases the risk of malware and permanent hardware failure. Warranty may be voided instantly.
          </p>
          <div className="flex gap-4 w-full max-w-md">
            <button 
              onClick={handleElevate}
              className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-3"
            >
              <Zap size={20} /> Deploy SU Binary
            </button>
          </div>
        </div>
      )}

      {(isProcessing || logs.length > 0) && (
        <div className="bg-black border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center px-8">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-indigo-400" /> Duplex Elevated Shell
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[8px] text-slate-600 font-bold uppercase">Kernel Patching in Progress</span>
            </div>
          </div>
          <div className="p-8 font-mono text-sm h-[400px] overflow-y-auto space-y-2 bg-black/80 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-4 ${log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-indigo-300'}`}>
                <span className="text-slate-700 shrink-0">#</span>
                <span>{log}</span>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-4 text-indigo-300">
                <span className="text-slate-700 shrink-0">#</span>
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> {steps[step]}
                </span>
              </div>
            )}
            <div ref={logEndRef} />
          </div>
          {isElevated && (
            <div className="bg-emerald-500/10 p-6 border-t border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 size={24} />
                <div>
                  <p className="font-bold">Device Elevation Complete</p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-60">System running in insecure debug mode</p>
                </div>
              </div>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all">
                Open Root Explorer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAccess;
