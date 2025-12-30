
import React, { useState } from 'react';
import { Smartphone, LogIn, UserPlus, Eye, EyeOff, ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { Operator } from '../types';

interface AuthProps {
  onLogin: (email: string, name: string, role: 'Admin' | 'Operator') => void;
  validOperators: Operator[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, validOperators }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate auth delay
    setTimeout(() => {
      // For demo purposes, we accept any password but check if email exists in provisioned list
      // In a real app, you would check password hash.
      const operator = validOperators.find(op => op.email === email);
      
      if (operator && operator.status === 'active') {
        onLogin(operator.email, operator.name, operator.role as any);
      } else if (!operator && isLogin) {
        setError("Endpoint unauthorized. Provisioning required.");
      } else if (!isLogin) {
        // Simple registration simulation for first admin
        onLogin(email, 'New Operator', 'Operator');
      } else {
        setError("Credential verification failed.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('google.user@gmail.com', 'Google Operator', 'Operator');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-6">
              <Smartphone className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Mobile Phone <span className="text-indigo-400">Duplex</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Enterprise Device Management Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Security Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                isLogin ? <LogIn size={20} /> : <UserPlus size={20} />
              )}
              {isLogin ? 'Initialize Session' : 'Register Operator'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Global Auth Bridge</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.72l3.41-3.41C17.9 1.19 15.17 0 12 0 7.31 0 3.25 2.67 1.21 6.6l3.85 2.99c.92-2.73 3.47-4.55 6.94-4.55z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.85 3c2.26-2.09 3.57-5.17 3.57-8.82z"/>
              <path fill="#34A853" d="M5.06 14.59c-.25-.73-.39-1.5-.39-2.32 0-.82.14-1.59.39-2.32L1.21 6.91C.44 8.44 0 10.17 0 12s.44 3.56 1.21 5.09l3.85-3.5z"/>
              <path fill="#FBBC05" d="M12 24c3.24 0 5.97-1.09 7.96-2.96l-3.85-3c-1.11.75-2.53 1.21-4.11 1.21-3.47 0-6.02-2.18-6.94-4.91l-3.85 2.99C3.25 21.33 7.31 24 12 24z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Need a new operator account?" : "Existing operator login"}
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-600">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted Handshake</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
