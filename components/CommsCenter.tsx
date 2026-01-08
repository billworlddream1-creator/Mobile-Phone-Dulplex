
import React, { useState } from 'react';
import { Phone, MessageSquare, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, Filter, Clock, User, MessageCircle, Download, Loader2 } from 'lucide-react';

const CommsCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calls' | 'sms'>('calls');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const callLogs = [
    { id: 1, contact: 'Alice Cooper', number: '+1 (555) 902-1234', type: 'incoming', time: '10:45 AM', duration: '12m 45s' },
    { id: 2, contact: 'Unknown Number', number: '+1 (555) 234-5678', type: 'missed', time: '09:12 AM', duration: '0s' },
    { id: 3, contact: 'Bob Tech Support', number: '+1 (555) 345-6789', type: 'outgoing', time: 'Yesterday', duration: '2m 10s' },
    { id: 4, contact: 'Mom', number: '+1 (555) 555-0199', type: 'incoming', time: 'Yesterday', duration: '45m 20s' },
    { id: 5, contact: 'Work Office', number: '+1 (555) 888-2222', type: 'outgoing', time: '2 days ago', duration: '1h 05m' },
  ];

  const smsLogs = [
    { id: 1, contact: 'Alice Cooper', lastMsg: 'See you at the conference tomorrow!', time: '10:50 AM', unread: true },
    { id: 2, contact: 'Mom', lastMsg: 'Did you get the groceries yet?', time: '09:30 AM', unread: false },
    { id: 3, contact: 'Verizon', lastMsg: 'Your monthly bill is ready for review.', time: 'Yesterday', unread: false },
    { id: 4, contact: 'Bob Tech Support', lastMsg: 'The server migration is complete.', time: '2 days ago', unread: false },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate data aggregation and file generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    alert('Communication log manifest exported to PC as duplex_comms_dump.csv');
  };

  const filteredCalls = callLogs.filter(log => 
    log.contact.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.number.includes(searchQuery)
  );

  const filteredSms = smsLogs.filter(log => 
    log.contact.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Communication Interceptor</h2>
          <p className="text-slate-400 text-sm">Real-time interrogation of call telemetry and messaging databases</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/5"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? 'Aggregating...' : 'Export Logs to PC'}
          </button>
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex">
            <button
              onClick={() => setActiveSubTab('calls')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeSubTab === 'calls' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Phone size={14} /> Call Logs
            </button>
            <button
              onClick={() => setActiveSubTab('sms')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeSubTab === 'sms' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare size={14} /> SMS Archive
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[65vh]">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeSubTab === 'calls' ? 'calls' : 'messages'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
            />
          </div>
          <button className="p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeSubTab === 'calls' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Number</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Time</th>
                  <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      {call.type === 'incoming' && <PhoneIncoming size={18} className="text-emerald-400" />}
                      {call.type === 'outgoing' && <PhoneOutgoing size={18} className="text-indigo-400" />}
                      {call.type === 'missed' && <PhoneMissed size={18} className="text-rose-500" />}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200">{call.contact}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{call.number}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 text-right">{call.time}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 text-right font-mono">{call.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredSms.map((sms) => (
                <div key={sms.id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <User size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-200">{sms.contact}</h4>
                        {sms.unread && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-1">{sms.lastMsg}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold mb-1">{sms.time}</p>
                    <button className="text-[10px] text-indigo-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Thread
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommsCenter;
