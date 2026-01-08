
import React from 'react';
import { CreditCard, CheckCircle2, Zap, ShieldCheck, Crown, Clock, Calendar, Star } from 'lucide-react';
import { User, SubscriptionPlan } from '../types';

interface SubscriptionCenterProps {
  user: User;
  plans: SubscriptionPlan[];
  onSubscribe: (planId: string) => void;
}

const SubscriptionCenter: React.FC<SubscriptionCenterProps> = ({ user, plans, onSubscribe }) => {
  const currentPlan = plans.find(p => p.id === user.subscription?.planId);
  const isActive = user.subscription?.status === 'active';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white tracking-tight">Duplex Licensing Node</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">
          Elevate your forensic capabilities. Unlock advanced memory mapping, AI-driven diagnostics, and high-speed data sanitization tiers.
        </p>
      </div>

      {/* Current License Status */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/30 shrink-0">
            {isActive ? <Crown size={64} className="text-white" /> : <ShieldCheck size={64} className="text-white opacity-40" />}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
              <h3 className="text-3xl font-black text-white">
                {isActive ? currentPlan?.name : 'Standard Access'}
              </h3>
              {isActive && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">Active License</span>
              )}
            </div>
            <p className="text-slate-400 font-medium mb-6">
              {isActive 
                ? `You are currently authorized for ${currentPlan?.name} forensic operations.` 
                : 'Limited interface access. Purchase a license to unlock full Duplex capabilities.'}
            </p>
            
            {isActive && user.subscription?.expiryDate && (
              <div className="flex items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Clock size={14} className="text-indigo-400" />
                  Expires: {new Date(user.subscription.expiryDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Zap size={14} className="text-amber-500" />
                  ID: #{user.subscription.planId.toUpperCase()}-LINK
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-auto">
            <div className="bg-slate-950 border border-white/5 p-6 rounded-[2rem] text-center">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Session Integrity</p>
              <p className="text-2xl font-black text-white">{isActive ? '99.9%' : '75.0%'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isSelected = user.subscription?.planId === plan.id;
          return (
            <div 
              key={plan.id} 
              className={`bg-slate-900 border rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] relative group ${
                isSelected ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-xl">
                  Current Tier
                </div>
              )}
              
              <div className="mb-8">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-500 text-sm font-bold uppercase">/ {plan.duration}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-400 font-medium">
                    <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onSubscribe(plan.id)}
                disabled={isSelected}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  isSelected 
                    ? 'bg-slate-800 text-slate-500 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95'
                }`}
              >
                {isSelected ? 'Tier Authorized' : `Select ${plan.duration} Plan`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust Banner */}
      <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-indigo-600/10 text-indigo-400 rounded-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Secure Licensing Handshake</h4>
            <p className="text-sm text-slate-500">All transactions are processed through end-to-end encrypted forensic gateways.</p>
          </div>
        </div>
        <div className="flex gap-4">
           {['VISA', 'STRIPE', 'BTC', 'ETH'].map(p => (
             <span key={p} className="text-[10px] font-black text-slate-700 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">{p}</span>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCenter;
