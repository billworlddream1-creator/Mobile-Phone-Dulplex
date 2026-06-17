
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Zap, ShieldCheck, Crown, Clock, Calendar, Star, Lock, AlertCircle, Loader2, X, CreditCard as CardIcon, ChevronRight, ArrowDownLeft } from 'lucide-react';
import { User, SubscriptionPlan, Transaction } from '../types';

interface SubscriptionCenterProps {
  user: User;
  plans: SubscriptionPlan[];
  transactions: Transaction[];
  onSubscribe: (planId: string) => void;
}

const SubscriptionCenter: React.FC<SubscriptionCenterProps> = ({ user, plans, transactions, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const currentPlan = plans.find(p => p.id === user.subscription?.planId);
  const isActive = user.subscription?.status === 'active';

  useEffect(() => {
    if (isActive && user.subscription?.expiryDate) {
      const expiry = new Date(user.subscription.expiryDate);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, diffDays));
    } else {
      setDaysRemaining(null);
    }
  }, [isActive, user.subscription]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Stripe payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Complete subscription after 1.5s of showing success
      setTimeout(() => {
        if (selectedPlan) {
          onSubscribe(selectedPlan.id);
          setSelectedPlan(null);
          setPaymentSuccess(false);
        }
      }, 1500);
    }, 2500);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white tracking-tight">Duplex Licensing Node</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">
          Elevate your forensic capabilities. Unlock advanced memory mapping, AI-driven diagnostics, and high-speed data sanitization tiers via secure Stripe billing.
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
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Clock size={14} className="text-indigo-400" />
                  Expires: {new Date(user.subscription.expiryDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Zap size={14} className="text-amber-500" />
                  ID: #{user.subscription.planId.toUpperCase()}-LINK
                </div>
                {daysRemaining !== null && (
                  <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${daysRemaining < 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                    <Calendar size={14} />
                    {daysRemaining} Days Remaining
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-auto">
            <div className="bg-slate-950 border border-white/5 p-6 rounded-[2rem] text-center min-w-[140px]">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Session Integrity</p>
              <p className="text-2xl font-black text-white">{isActive ? '99.9%' : '75.0%'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pricing Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onClick={() => setSelectedPlan(plan)}
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

        {/* Transaction History & Tracking */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-hidden h-fit sticky top-28">
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                 <ArrowDownLeft size={20} />
               </div>
               <h3 className="font-bold text-white uppercase tracking-tight">Billing History</h3>
             </div>
             <span className="text-[10px] text-slate-500 font-black uppercase">{transactions.length} Records</span>
           </div>

           <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
             {transactions.length === 0 ? (
               <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                 <p className="text-xs text-slate-600 font-bold uppercase">No transactional data discovered</p>
               </div>
             ) : (
               transactions.map((tx) => (
                 <div key={tx.id} className="p-4 bg-slate-950 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all cursor-default group">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] text-indigo-400 font-mono font-bold">{tx.planId.toUpperCase()} Tier</span>
                     <span className="text-xs font-black text-white">${tx.amount.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-end">
                     <div>
                       <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{new Date(tx.timestamp).toLocaleString()}</p>
                       <p className="text-[8px] text-slate-700 font-mono mt-0.5 truncate max-w-[120px]">TXID: {tx.id.slice(0, 8)}</p>
                     </div>
                     <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                       tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                     }`}>
                       {tx.status}
                     </span>
                   </div>
                 </div>
               ))
             )}
           </div>

           <div className="mt-8 p-4 bg-indigo-600/5 rounded-2xl border border-indigo-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={12} className="text-indigo-400" />
                <span className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Audit Policy</span>
              </div>
              <p className="text-[9px] text-slate-500 leading-tight">Billing cycles are synchronized with the GMT Secure Enclave. Automatic renewal is active for all forensic licenses.</p>
           </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-indigo-600/10 text-indigo-400 rounded-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Secure Licensing Handshake</h4>
            <p className="text-sm text-slate-500">All transactions are processed through end-to-end encrypted forensic gateways via Stripe.</p>
          </div>
        </div>
        <div className="flex gap-4">
           {['STRIPE', 'VISA', 'MASTERCARD', 'APPLE PAY'].map(p => (
             <span key={p} className="text-[10px] font-black text-slate-700 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">{p}</span>
           ))}
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1a1f2c] border border-white/5 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            
            {/* Payment Header */}
            <div className="bg-[#635bff] p-8 text-white relative">
              <button 
                onClick={() => setSelectedPlan(null)} 
                disabled={isProcessing}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-black">Secure Checkout</h2>
              </div>
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Activating Tier</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{selectedPlan.name}</span>
                  <span className="text-white/60 font-bold">${selectedPlan.price} / {selectedPlan.duration}</span>
                </div>
              </div>
            </div>

            {/* Payment Body */}
            <div className="p-10 space-y-8">
              {!paymentSuccess ? (
                <form onSubmit={handleCheckout} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Card Information</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#635bff] transition-colors">
                        <CardIcon size={20} />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                        maxLength={19}
                        className="w-full bg-[#0f172a] border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#635bff] transition-all font-mono text-slate-200 placeholder:text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <input 
                        type="text" 
                        required
                        placeholder="MM / YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                        className="bg-[#0f172a] border border-white/5 rounded-xl py-4 px-4 focus:outline-none focus:border-[#635bff] transition-all font-mono text-slate-200 placeholder:text-slate-800"
                      />
                      <input 
                        type="text" 
                        required
                        placeholder="CVC"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                        maxLength={4}
                        className="bg-[#0f172a] border border-white/5 rounded-xl py-4 px-4 focus:outline-none focus:border-[#635bff] transition-all font-mono text-slate-200 placeholder:text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Name on Card */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={cardData.name}
                      onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      className="w-full bg-[#0f172a] border border-white/5 rounded-xl py-4 px-4 focus:outline-none focus:border-[#635bff] transition-all font-bold text-slate-200 placeholder:text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                    <Lock size={16} className="text-[#635bff]" />
                    <p className="text-[10px] text-slate-400 font-medium">Your payment is secured with bank-grade encryption via Stripe's decentralized network.</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-5 bg-[#635bff] hover:bg-[#5a51e8] disabled:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#635bff]/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    {isProcessing ? 'Validating Token...' : `Pay $${selectedPlan.price} and Activate`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={48} className="animate-in fade-in zoom-in duration-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Payment Confirmed</h3>
                    <p className="text-slate-400 mt-2">Stripe token synchronized. Your licensing node is now active.</p>
                  </div>
                  <div className="pt-4">
                    <p className="text-[10px] text-slate-600 font-mono tracking-widest animate-pulse uppercase">Redirecting to GMT Console...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-950 p-6 flex justify-center gap-8 border-t border-white/5 grayscale opacity-30">
              <img src="https://stripe.com/img/v3/home/twitter.png" alt="" className="h-4 hidden" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TLS 1.3 Secure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCenter;
