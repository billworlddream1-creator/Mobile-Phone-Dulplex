
import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Shield, Clock, History, Search, Mail, Filter, CheckCircle, MoreVertical, DollarSign, Save, Edit3, X } from 'lucide-react';
import { Operator, LoginLog, SubscriptionPlan } from '../types';

interface UserManagementProps {
  operators: Operator[];
  loginLogs: LoginLog[];
  plans: SubscriptionPlan[];
  onAddOperator: (name: string, email: string, role: 'Admin' | 'Operator') => void;
  onRemoveOperator: (id: string) => void;
  onUpdatePlans: (plans: SubscriptionPlan[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ operators, loginLogs, plans, onAddOperator, onRemoveOperator, onUpdatePlans }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingPlans, setIsEditingPlans] = useState(false);
  const [editablePlans, setEditablePlans] = useState<SubscriptionPlan[]>([...plans]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Operator'>('Operator');
  const [searchQuery, setSearchQuery] = useState('');

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newEmail) {
      onAddOperator(newName, newEmail, newRole);
      setNewName('');
      setNewEmail('');
      setIsAdding(false);
    }
  };

  const handlePriceChange = (id: string, price: string) => {
    const numericPrice = parseFloat(price) || 0;
    setEditablePlans(prev => prev.map(p => p.id === id ? { ...p, price: numericPrice } : p));
  };

  const savePricing = () => {
    onUpdatePlans(editablePlans);
    setIsEditingPlans(false);
  };

  const filteredOperators = operators.filter(op => 
    op.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    op.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operator Control Center</h2>
          <p className="text-slate-400 text-sm">Managing system credentials and monitoring forensic session activity</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditingPlans(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-slate-700"
          >
            <DollarSign size={18} /> Edit Pricing
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <UserPlus size={18} /> Provision Operator
          </button>
        </div>
      </div>

      {/* Pricing Manager Modal/Section */}
      {isEditingPlans && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                  <DollarSign size={24} />
                </div>
                <h2 className="text-2xl font-black">Global Pricing Matrix</h2>
              </div>
              <button onClick={() => setIsEditingPlans(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-8">
              Update the costs for all Licensing Node tiers. Changes take effect immediately for all active Duplex endpoints.
            </p>

            <div className="space-y-4 mb-10">
              {editablePlans.map(plan => (
                <div key={plan.id} className="flex items-center justify-between p-5 bg-slate-950 border border-white/5 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-white">{plan.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Billing cycle: {plan.duration}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-bold">$</span>
                    <input 
                      type="number" 
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 w-32 focus:outline-none focus:border-indigo-500 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsEditingPlans(false)}
                className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-800 rounded-2xl transition-all"
              >
                Abort Changes
              </button>
              <button 
                onClick={savePricing}
                className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> Deploy New Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[65vh]">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search registered operators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
              />
            </div>
            <div className="bg-slate-950 border border-slate-700 p-2 rounded-xl text-slate-400">
              <Filter size={18} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Operator</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">License</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredOperators.map((op) => (
                  <tr key={op.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center font-bold">
                          {op.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">{op.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{op.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        op.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-500 border-transparent'
                      }`}>
                        {op.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${op.subscription?.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {op.subscription?.status === 'active' ? (plans.find(p => p.id === op.subscription?.planId)?.name || 'Pro') : 'None'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {op.email !== 'admin@duplex.nexus' && (
                        <button 
                          onClick={() => onRemoveOperator(op.id)}
                          className="p-2 text-slate-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Revoke Access"
                        >
                          <UserMinus size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Login Log Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col h-[65vh]">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <History className="text-indigo-400" size={18} /> Authentication Feed
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {loginLogs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <Clock size={12} />
                </div>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">{log.timestamp}</p>
                <h4 className="text-sm font-bold text-slate-200 truncate">{log.userName}</h4>
                <p className="text-[10px] text-slate-500 font-mono mb-2">{log.userEmail}</p>
                <div className="flex items-center gap-2 text-[8px] text-slate-600 font-black uppercase">
                   <Shield size={8} /> IP: {log.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Provision Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                <UserPlus size={24} />
              </div>
              <h2 className="text-2xl font-black">Provision Operator</h2>
            </div>

            <form onSubmit={handleProvision} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Full Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="e.g. Marcus Thorne"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Email Endpoint</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Access Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Operator', 'Admin'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewRole(role)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                        newRole === role 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-transparent text-slate-400 hover:border-white/10'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-800 rounded-2xl transition-all"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:brightness-110"
                >
                  Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
