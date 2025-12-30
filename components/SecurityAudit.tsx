
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Radio, Mail, Smartphone, Globe, AlertCircle, Loader2, CheckCircle, ExternalLink } from 'lucide-react';

const SecurityAudit: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleStartAudit = async () => {
    setIsScanning(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 4000));
    setResults([
      { 
        vector: 'Communication (SMS/MMS)', 
        risk: 'High', 
        description: 'Unpatched vulnerability in messaging service allows for remote buffer overflow via crafted media packets.', 
        source: 'CVE-2024-8812',
        target: 'Phone Number Endpoint'
      },
      { 
        vector: 'Identity (Email)', 
        risk: 'Medium', 
        description: 'Associated email account lacks 2FA. Potential for credential harvesting through phishing injection.', 
        source: 'Security Policy P-102',
        target: 'Operator Email'
      },
      { 
        vector: 'Network Stack', 
        risk: 'Critical', 
        description: 'Legacy SSL protocols detected on carrier APN. Susceptible to MITM traffic injection.', 
        source: 'Deep Packet Inspection',
        target: 'Duplex Link'
      },
      { 
        vector: 'OS Kernel', 
        risk: 'Low', 
        description: 'Non-critical memory leak discovered in sandbox environment.', 
        source: 'Heuristic Engine',
        target: 'System Partition'
      }
    ]);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attack Surface Analysis</h2>
          <p className="text-slate-400 text-sm">Identifying remote entry points and hardening device defense protocols</p>
        </div>
        <button 
          onClick={handleStartAudit}
          disabled={isScanning}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
        >
          {isScanning ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
          {isScanning ? 'Interrogating Endpoints...' : 'Initialize Full Audit'}
        </button>
      </div>

      {!results && !isScanning && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-600">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Active Audit Data</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Run a security audit to map potential vulnerabilities across phone number, email, and network protocols.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
              <Mail className="text-indigo-400" size={20} />
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Phishing Filter</span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
              <Radio className="text-rose-400" size={20} />
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Protocol Scrutiny</span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
              <Smartphone className="text-emerald-400" size={20} />
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Sanity Check</span>
            </div>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-emerald-600/10 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="text-emerald-500 animate-pulse" size={40} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Scanning Threat Vectors</h3>
            <p className="text-slate-500 font-mono text-[10px] tracking-[0.2em] mt-2">TESTING REMOTE ENDPOINT INTEGRITY...</p>
          </div>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          {results.map((res, i) => (
            <div key={i} className={`p-6 bg-slate-900 border rounded-3xl transition-all relative overflow-hidden group ${
              res.risk === 'Critical' ? 'border-rose-500/30' : 
              res.risk === 'High' ? 'border-orange-500/30' : 
              res.risk === 'Medium' ? 'border-amber-500/30' : 'border-slate-800'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    res.risk === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                    res.risk === 'High' ? 'bg-orange-500/10 text-orange-500' :
                    res.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{res.vector}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Vector: {res.target}</p>
                  </div>
                </div>
                <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  res.risk === 'Critical' ? 'bg-rose-600 text-white' :
                  res.risk === 'High' ? 'bg-orange-600 text-white' :
                  res.risk === 'Medium' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {res.risk} Risk
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {res.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-600">{res.source}</span>
                <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
                  Remediation Guide <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
          
          <div className="lg:col-span-2 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-400 text-lg">System Hardening Recommendations</h4>
              <p className="text-sm text-slate-400 mt-1">Based on the audit, we recommend enabling Lockdown Mode and updating the baseband firmware to mitigate remote radio-frequency injection vectors.</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap">
              Auto-Harden Device
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAudit;
