
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
  Loader2
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

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <ArrowUpCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">System Update</h2>
          <p className="text-slate-400 mb-8">
            {device.updateAvailable 
              ? `A new version of ${device.os} is available for your ${device.model}.` 
              : 'Your system is currently up to date.'}
          </p>
          
          <div className="w-full bg-slate-800 rounded-xl p-4 mb-8 text-left border border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase font-bold">Current Version</span>
              <span className="text-sm font-mono">{device.osVersion}</span>
            </div>
            {device.updateAvailable && (
              <div className="flex justify-between">
                <span className="text-xs text-blue-400 uppercase font-bold">New Version</span>
                <span className="text-sm font-mono text-blue-400">14.2 (Stable)</span>
              </div>
            )}
          </div>

          <button 
            disabled={!device.updateAvailable || fixing !== null}
            onClick={installUpdate}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              device.updateAvailable 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {fixing === 'global-update' ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
            {fixing === 'global-update' ? 'Updating Firmware...' : 'Apply System Update'}
          </button>
        </div>

        {/* Bug Fixing Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bug className="text-red-500" size={24} />
              <h2 className="text-xl font-bold">Smart Fix Engine</h2>
            </div>
            <button 
              onClick={runScan}
              disabled={scanning}
              className="text-xs font-bold uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {scanning ? <Loader2 size={12} className="animate-spin" /> : <Wrench size={12} />}
              {scanning ? 'Scanning...' : 'Rescan Logs'}
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {bugs.length === 0 && !scanning && (
              <div className="text-center py-12">
                <ShieldCheck className="mx-auto text-green-500 mb-2 opacity-20" size={48} />
                <p className="text-slate-500 italic">No critical bugs found. Run a deep scan.</p>
              </div>
            )}
            
            {bugs.map((bug) => {
              const isFixed = fixedBugs.includes(bug.id);
              return (
                <div key={bug.id} className={`p-4 rounded-xl border transition-all ${
                  isFixed ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        bug.severity === 'high' ? 'bg-red-500' : bug.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <p className="text-sm font-bold">{bug.component}</p>
                    </div>
                    {isFixed ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded uppercase font-bold">{bug.severity}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{bug.description}</p>
                  {!isFixed && (
                    <button 
                      onClick={() => fixBug(bug.id)}
                      disabled={fixing !== null}
                      className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold uppercase transition-colors"
                    >
                      {fixing === bug.id ? <Loader2 className="animate-spin mx-auto" size={12} /> : 'Patch Bug'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="text-orange-500 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-orange-500">Stability Advisory</h4>
          <p className="text-sm text-slate-400">
            Applying patches while the device is under heavy load may cause temporary UI stutters. 
            All system-level fixes are signed by NexusLink Secure Cloud to ensure kernel integrity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCenter;
