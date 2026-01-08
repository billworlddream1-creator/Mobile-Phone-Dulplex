import React, { useState } from 'react';
import { DeviceInfo, DeviceBug } from '../types';
import { 
  Wrench, 
  ShieldCheck, 
  RefreshCw, 
  Bug, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpCircle,
  Loader2,
  Zap
} from 'lucide-react';

interface MaintenanceCenterProps {
  device: DeviceInfo;
  onUpdate: () => void;
}

const MaintenanceCenter: React.FC<MaintenanceCenterProps> = ({ device, onUpdate }) => {
  const [scanning, setScanning] = useState(false);
  const [fixing, setFixing] = useState<string | null>(null);
  const [fixedBugs, setFixedBugs] = useState<string[]>([]);
  const [bugs, setBugs] = useState<DeviceBug[]>(device.bugs || []);

  const runScan = async () => {
    setScanning(true);
    // Simulated bug discovery
    await new Promise(r => setTimeout(r, 2500));
    setBugs([
      { id: '1', component: 'System UI', description: 'Ghost touch detected in navbar area', severity: 'high' },
      { id: '2', component: 'Kernel', description: 'Potential memory leak in background services', severity: 'medium' },
      { id: '3', component: 'Battery', description: 'Inaccurate charge percentage reporting', severity: 'low' },
      { id: '4', component: 'Connectivity', description: 'WiFi handoff delay (>200ms)', severity: 'medium' },
    ]);
    setScanning(false);
  };

  const fixBug = async (id: string) => {
    setFixing(id);
    await new Promise(r => setTimeout(r, 2000));
    setFixedBugs(prev => [...prev, id]);
    setFixing(null);
  };

  const installUpdate = async () => {
    setFixing('global-update');
    await new Promise(r => setTimeout(r, 5000));
    onUpdate();
    setFixing(null);
  };

  const isProcessRunning = fixing !== null || scanning;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-xl">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
            device.updateAvailable ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'
          }`}>
            <ArrowUpCircle size={40} className={device.updateAvailable && !isProcessRunning ? 'animate-bounce' : ''} />
          </div>
          <h2 className="text-2xl font-black mb-2">System Upgrade</h2>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">
            {device.updateAvailable 
              ? `Strategic firmware detected for ${device.brand} architecture. Optimization highly recommended.` 
              : 'Target environment is operating on the latest verified kernel branch.'}
          </p>
          
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Revision</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded">{device.osVersion}</span>
            </div>
            {device.updateAvailable && (
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Available Patch</span>
                <span className="text-xs font-mono font-bold text-indigo-400">14.2.0-STABLE</span>
              </div>
            )}
          </div>

          <button 
            disabled={!device.updateAvailable || isProcessRunning}
            onClick={installUpdate}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
              device.updateAvailable && !isProcessRunning
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-[0.98]' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {fixing === 'global-update' ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Deploying Remote Payload...
              </>
            ) : (
              <>
                <Zap size={18} className={device.updateAvailable ? 'group-hover:scale-125 transition-transform' : ''} />
                {device.updateAvailable ? 'Trigger System Update' : 'Up to Date'}
              </>
            )}
            
            {fixing === 'global-update' && (
              <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                <div className="h-full bg-white animate-loading-bar" />
              </div>
            )}
          </button>
        </div>

        {/* Bug Fixing Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <Bug className="text-rose-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Kernel Patching</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Bug Remediation</p>
              </div>
            </div>
            <button 
              onClick={runScan}
              disabled={isProcessRunning}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl transition-all text-slate-400 hover:text-white"
            >
              {scanning ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            </button>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {bugs.length === 0 && !scanning && (
              <div className="text-center py-12 bg-slate-950/50 rounded-3xl border border-dashed border-slate-800">
                <ShieldCheck className="mx-auto text-emerald-500/20 mb-3" size={48} />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Zero Exploits Detected</p>
              </div>
            )}
            
            {bugs.map((bug) => {
              const isFixed = fixedBugs.includes(bug.id);
              return (
                <div key={bug.id} className={`p-4 rounded-2xl border transition-all ${
                  isFixed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        bug.severity === 'high' ? 'bg-rose-500' : bug.severity === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                      <p className="text-xs font-black uppercase tracking-tight text-white">{bug.component}</p>
                    </div>
                    {isFixed ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                        bug.severity === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-700 text-slate-400'
                      }`}>{bug.severity}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 leading-tight">{bug.description}</p>
                  {!isFixed && (
                    <button 
                      onClick={() => fixBug(bug.id)}
                      disabled={isProcessRunning}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-indigo-400 border border-white/5"
                    >
                      {fixing === bug.id ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Deploy Hotfix'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="font-black text-amber-500 text-sm uppercase tracking-widest">Operations Warning</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Executing firmware modifications requires sustained voltage above 3.8V. Duplex Link maintains a slow-trickle charge, but ensuring the device battery is >50% before deployment is recommended to prevent NAND corruption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCenter;
