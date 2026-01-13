
import React, { useState } from 'react';
import { Smartphone, LogIn, UserPlus, Eye, EyeOff, ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft, Key, CheckCircle, Smartphone as PhoneIcon } from 'lucide-react';
import { Operator } from '../types';

interface AuthProps {
  onLogin: (email: string, name: string, role: 'Admin' | 'Operator', rememberMe: boolean) => void;
  validOperators: Operator[];
}

type AuthView = 'login' | 'signup' | 'forgot' | 'reset-code' | 'new-password' | 'success';

const Auth: React.FC<AuthProps> = ({ onLogin, validOperators }) => {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const operator = validOperators.find(op => op.email === email);
      if (operator && operator.status === 'active') {
        onLogin(operator.email, operator.name, operator.role as any, rememberMe);
      } else {
        setError("Endpoint unauthorized. GMT security bypass required.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not synchronize.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email, name || 'New Operator', 'Operator', rememberMe);
      setIsLoading(false);
    }, 1500);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      console.log(`[GMT SECURITY] Reset Token for ${email}: ${code}`);
      setView('reset-code');
      setIsLoading(false);
    }, 2000);
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode === generatedCode) {
      setView('new-password');
      setError('');
    } else {
      setError("Invalid recovery token. Access denied.");
    }
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("New security keys do not match.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setView('success');
      setIsLoading(false);
    }, 1500);
  };

  const renderContent = () => {
    switch(view) {
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-6">
            <InputField label="Operator Email" type="email" value={email} onChange={setEmail} icon={<Mail size={18}/>} placeholder="name@gmt-duplex.io" />
            <div className="space-y-2">
              <InputField label="Security Key" type={showPassword ? "text" : "password"} value={password} onChange={setPassword} icon={<Lock size={18}/>} placeholder="••••••••" 
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700 bg-slate-950'}`}>
                    {rememberMe && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-300">Remember Me</span>
                </label>
                <button type="button" onClick={() => setView('forgot')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest">Forgot Key?</button>
              </div>
            </div>
            <AuthButton icon={<LogIn size={20} />} text="Initialize Session" isLoading={isLoading} />
            <SocialSection onGoogle={() => onLogin('g.user@gmt.io', 'Google Op', 'Operator', false)} isLoading={isLoading} />
            <div className="text-center"><button type="button" onClick={() => setView('signup')} className="text-xs font-bold text-slate-500 hover:text-indigo-400">New operator? Provision account</button></div>
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleSignup} className="space-y-5">
            <InputField label="Operator Name" type="text" value={name} onChange={setName} icon={<Smartphone size={18}/>} placeholder="Tactical ID" />
            <InputField label="Secure Email" type="email" value={email} onChange={setEmail} icon={<Mail size={18}/>} placeholder="name@gmt-duplex.io" />
            <InputField label="Establish Security Key" type="password" value={password} onChange={setPassword} icon={<Lock size={18}/>} placeholder="••••••••" />
            <InputField label="Synchronize Key" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={<ShieldCheck size={18}/>} placeholder="••••••••" />
            <AuthButton icon={<UserPlus size={20} />} text="Provision Access" isLoading={isLoading} />
            <div className="text-center"><button type="button" onClick={() => setView('login')} className="text-xs font-bold text-slate-500 hover:text-indigo-400">Return to standard login</button></div>
          </form>
        );

      case 'forgot':
        return (
          <form onSubmit={handleForgot} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Key Recovery</h3>
              <p className="text-slate-500 text-sm">Enter your endpoint email to receive a temporary recovery token.</p>
            </div>
            <InputField label="Target Email" type="email" value={email} onChange={setEmail} icon={<Mail size={18}/>} placeholder="name@gmt-duplex.io" />
            <AuthButton icon={<Key size={20} />} text="Generate Token" isLoading={isLoading} />
            <button type="button" onClick={() => setView('login')} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"><ArrowLeft size={14}/> Abort recovery</button>
          </form>
        );

      case 'reset-code':
        return (
          <form onSubmit={handleValidateCode} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Validate Token</h3>
              <p className="text-slate-500 text-sm">A 6-digit forensic token has been dispatched to {email}.</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-2 uppercase tracking-tighter">(Check console for simulated code)</p>
            </div>
            <InputField label="6-Digit Forensic Token" type="text" value={resetCode} onChange={setResetCode} icon={<Key size={18}/>} placeholder="000000" />
            <AuthButton icon={<CheckCircle size={20} />} text="Validate Identity" isLoading={isLoading} />
            <button type="button" onClick={() => setView('forgot')} className="w-full text-xs font-bold text-slate-500 hover:text-white">Resend token</button>
          </form>
        );

      case 'new-password':
        return (
          <form onSubmit={handleSetNewPassword} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Set New Security Key</h3>
              <p className="text-slate-500 text-sm">Identity verified. Establish a new tactical security key.</p>
            </div>
            <InputField label="New Security Key" type="password" value={password} onChange={setPassword} icon={<Lock size={18}/>} placeholder="••••••••" />
            <InputField label="Confirm Key" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={<ShieldCheck size={18}/>} placeholder="••••••••" />
            <AuthButton icon={<Smartphone size={20} />} text="Overwrite Key" isLoading={isLoading} />
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
              <CheckCircle size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Security Restored</h3>
              <p className="text-slate-400 mt-2">New security parameters have been pushed to the vault. You may now re-initialize your session.</p>
            </div>
            <button onClick={() => setView('login')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20">Return to Portal</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-6">
              <PhoneIcon className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">GMT PHONE <span className="text-indigo-400">DUPLEX</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Enterprise Forensic Gateway</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {renderContent()}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-600">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">GMT Secure Protocol v2.5</span>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, type, value, onChange, icon, placeholder, rightElement }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200 placeholder:text-slate-700"
        placeholder={placeholder}
      />
      {rightElement}
    </div>
  </div>
);

const AuthButton = ({ icon, text, isLoading }: any) => (
  <button 
    type="submit" 
    disabled={isLoading}
    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95"
  >
    {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : icon}
    {text}
  </button>
);

const SocialSection = ({ onGoogle, isLoading }: any) => (
  <>
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-slate-800"></div>
      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Global Link</span>
      <div className="flex-1 h-px bg-slate-800"></div>
    </div>
    <button 
      type="button"
      onClick={onGoogle}
      disabled={isLoading}
      className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 active:scale-95"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.72l3.41-3.41C17.9 1.19 15.17 0 12 0 7.31 0 3.25 2.67 1.21 6.6l3.85 2.99c.92-2.73 3.47-4.55 6.94-4.55z"/>
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.85 3c2.26-2.09 3.57-5.17 3.57-8.82z"/>
        <path fill="#34A853" d="M5.06 14.59c-.25-.73-.39-1.5-.39-2.32 0-.82.14-1.59.39-2.32L1.21 6.91C.44 8.44 0 10.17 0 12s.44 3.56 1.21 5.09l3.85-3.5z"/>
        <path fill="#FBBC05" d="M12 24c3.24 0 5.97-1.09 7.96-2.96l-3.85-3c-1.11.75-2.53 1.21-4.11 1.21-3.47 0-6.02-2.18-6.94-4.91l-3.85 2.99C3.25 21.33 7.31 24 12 24z"/>
      </svg>
      Interoperate with Google
    </button>
  </>
);

export default Auth;
