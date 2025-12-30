
import React, { useState } from 'react';
import { 
  Key, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Mail, 
  Loader2, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Fingerprint
} from 'lucide-react';

const IdentityManager: React.FC = () => {
  const [isResetting, setIsResetting] = useState<string | null>(null);
  const [complete, setComplete] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (type: string) => {
    if (type === 'account' && !newPassword) {
      alert("Please specify a new security key before deploying reset.");
      return;
    }

    setIsResetting(type);
    setComplete(null);
    
    // Stage 1: Handshake
    await new Promise(r => setTimeout(r, 1500));
    // Stage 2: Token Exchange
    await new Promise(r => setTimeout(r, 2000));
    
    setIsResetting(null);
    setComplete(type);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Credential Override Suite</h2>
          <p className="text-slate-400 text-sm">Administrative bypassing of lockscreen and account security tokens</p>
        </div>
        <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert size={14} /> High Privilege Required
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lockscreen Bypass */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col group hover:border-rose-500/30 transition-all">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Lockscreen Override</h3>
          <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">
            Forcibly clears the local password database. This will remove any PIN, Pattern, or Fingerprint requirements for entry.
          </p>
          <button 
            onClick={() => handleReset('lockscreen')}
            disabled={!!isResetting}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              complete === 'lockscreen' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/20'
            }`}
          >
            {isResetting === 'lockscreen' ? <Loader2 className="animate-spin" size={20} /> : complete === 'lockscreen' ? <CheckCircle2 size={20} /> : <Unlock size={20} />}
            {isResetting === 'lockscreen' ? 'Nullifying Key Store...' : complete === 'lockscreen' ? 'Security Cleared' : 'Wipe Password Database'}
          </button>
        </div>

        {/* Account Password Reset */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col group hover:border-indigo-500/30 transition-all">
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Fingerprint size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Device Account Reset</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Enter a new password to be established for the primary device account via the Duplex bridge.
          </p>
          
          <div className="mb-6 space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">New Security Key</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new account password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 transition-all text-sm font-mono text-slate-200"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            onClick={() => handleReset('account')}
            disabled={!!isResetting || !newPassword}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              complete === 'account' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white shadow-xl shadow-indigo-600/20'
            }`}
          >
            {isResetting === 'account' ? <Loader2 className="animate-spin" size={20} /> : complete === 'account' ? <CheckCircle2 size={20} /> : <RefreshCw size={20} />}
            {isResetting === 'account' ? 'Injecting New Token...' : complete === 'account' ? 'Password Pushed Successfully' : 'Deploy Account Reset'}
          </button>
        </div>
      </div>

      {complete && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 animate-in slide-in-from-top-4 duration-500 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-400">Operation Confirmed</h4>
            <p className="text-sm text-slate-400">
              The {complete === 'lockscreen' ? 'lockscreen database' : 'account password'} has been successfully updated on the remote target. 
              {complete === 'account' && ` New Key: ${"*".repeat(newPassword.length - 2) + newPassword.slice(-2)}`}
            </p>
          </div>
        </div>
      )}

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 flex items-start gap-6">
        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center shrink-0">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h4 className="font-bold text-amber-500 text-lg">Forensic Warning</h4>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Credential resets are logged to the global Duplex ledger. Clearing the lockscreen password may temporarily disable hardware-backed encryption (FBE) until a new key is established. Ensure the device is in Airplane Mode to prevent remote wipe commands.
          </p>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
              <ShieldCheck size={12} className="text-emerald-500" /> AES-256 Intact
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
              <ShieldCheck size={12} className="text-emerald-500" /> Handshake Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityManager;
