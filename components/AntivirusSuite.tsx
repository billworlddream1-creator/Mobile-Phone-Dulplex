
import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Loader2, Bug, Trash2, Zap, AlertTriangle, CheckCircle2, Search, Activity } from 'lucide-react';

const AntivirusSuite: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [foundIssues, setFoundIssues] = useState<any[]>([]);
  const [cleanComplete, setCleanComplete] = useState(false);

  const scanStages = [
    "Interrogating System Partitions...",
    "Scanning Memory Resident Processes...",
    "Checking App Signature Integrity...",
    "Verifying Root Binary States...",
    "Analyzing Heuristic Patterns...",
    "Querying Threat Database..."
  ];

  const handleStartScan = async () => {
    setIsScanning(true);
    setFoundIssues([]);
    setCleanComplete(false);
    
    for (let i = 0; i < scanStages.length; i++) {
      setScanStep(i);
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    }
    
    setFoundIssues([
      { id: 1, name: 'Malicious Overlay', type: 'Trojan', severity: 'Critical', path: '/system/bin/hw_svc_v1' },
      { id: 2, name: 'Adware.Track.Pop', type: 'Adware', severity: 'Medium', path: 'com.dev.game' },
      { id: 3, name: 'Suspicious SU Binary', type: 'RiskTool', severity: 'High', path: '/sbin/su' },
    ]);
    setIsScanning(false);
  };

  const handleClean = async () => {
    setIsCleaning(true);
    await new Promise(r => setTimeout(r, 3000));
    setFoundIssues([]);
    setIsCleaning(false);
    setCleanComplete(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Antivirus & Cleanup Suite</h2>
          <p className="text-slate-400 text-sm">Real-time threat mitigation and system sanitization</p>
        </div>
        {!isScanning && !foundIssues.length && !cleanComplete && (
          <button 
            onClick={handleStartScan}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Shield size={18} /> Initialize Deep Scan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Status Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden shadow-2xl">
            {isScanning ? (
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="text-indigo-500 animate-pulse" size={40} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Scanning Target FileSystem</h3>
                  <p className="text-indigo-400 font-mono text-xs tracking-widest mt-2">{scanStages[scanStep]}</p>
                </div>
              </div>
            ) : foundIssues.length > 0 ? (
              <div className="w-full space-y-6 animate-in zoom-in-95">
                <div className="flex items-center gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <ShieldAlert className="text-rose-500" size={32} />
                  <div>
                    <h3 className="text-lg font-bold text-rose-500">{foundIssues.length} Threat Vectors Found</h3>
                    <p className="text-sm text-slate-400">The device security state is currently COMPROMISED.</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {foundIssues.map(issue => (
                    <div key={issue.id} className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${issue.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                          <Bug size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-white">{issue.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">{issue.type} • {issue.path}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        issue.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleClean}
                  disabled={isCleaning}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {isCleaning ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                  {isCleaning ? 'Sanitizing Partitions...' : 'Clean Device & Purge Threats'}
                </button>
              </div>
            ) : cleanComplete ? (
              <div className="text-center space-y-6 animate-in zoom-in-95">
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <ShieldCheck size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">System Sanitized</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">All identified threats have been purged. System integrity has been verified at the kernel level.</p>
                </div>
                <button 
                   onClick={() => setCleanComplete(false)}
                   className="text-xs font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                >
                  Run Baseline Scan
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-600 border border-white/5">
                  <Shield size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Security Integrity Unknown</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Device has not been scanned during this session. Initialize to probe internal partitions.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Info Area */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Zap className="text-amber-500" size={18} /> Optimization Log
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Last Clean</p>
                <p className="text-sm font-bold text-white">{cleanComplete ? 'JUST NOW' : 'NOT PERFORMED'}</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Database Ver.</p>
                <p className="text-sm font-bold text-white">X-CORE 2024.5.21</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Engine Engine</p>
                <p className="text-sm font-bold text-emerald-400">PROTECTED (AI-V3)</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-6">
            <h4 className="font-bold text-indigo-400 flex items-center gap-2 mb-2">
              <Activity size={16} /> Real-time Prober
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our AI engine continuously monitors memory spikes that indicate cryptojacking or overlay injection.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-500/10 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Heuristics</span>
              <span className="text-[10px] text-emerald-500 font-black uppercase">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntivirusSuite;
