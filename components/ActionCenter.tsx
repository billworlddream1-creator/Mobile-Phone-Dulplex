
import React, { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle, ShieldX, CheckCircle, Loader2, HardDrive } from 'lucide-react';

interface ActionCenterProps {
  onAction: (actionName: string) => void;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{id: string, name: string, description: string, warning: string, color: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const actions = [
    { 
      id: 'format-full', 
      name: 'Full Factory Format', 
      description: 'Total partition wipe including system, user data, and cache regions. Resets ROM to base state.', 
      icon: RefreshCw,
      color: 'bg-rose-600',
      warning: 'This is the ultimate reset. All system settings, cryptographic keys, and user data will be destroyed.'
    },
    { 
      id: 'format-user', 
      name: 'User Data Format', 
      description: 'Wipe /data and /sdcard partitions while keeping the current OS environment intact.', 
      icon: HardDrive,
      color: 'bg-amber-600',
      warning: 'Personal files will be lost, but OS settings and carrier configurations may persist.'
    },
    { 
      id: 'wipe', 
      name: 'DoD Secure Wipe', 
      description: 'Advanced 7-pass overwrite sanitization to prevent all forms of physical hardware recovery.', 
      icon: ShieldX,
      color: 'bg-indigo-600',
      warning: 'Process takes longer due to multiple data overwrite passes.'
    },
    { 
      id: 'cache', 
      name: 'Cache Partition Clean', 
      description: 'Safe removal of OTA temp files, ART compiler cache, and transient system buffers.', 
      icon: Trash2,
      color: 'bg-emerald-600',
      warning: 'Safe operation. No persistent data loss expected.'
    }
  ];

  const handleStartAction = (action: any) => {
    setCurrentAction(action);
    setIsModalOpen(true);
  };

  const executeAction = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    for(let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 400));
    }
    
    setIsProcessing(false);
    setIsModalOpen(false);
    if (currentAction) {
      onAction(currentAction.name);
    }
    setCurrentAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl flex items-start space-x-4">
        <AlertTriangle className="text-rose-500 shrink-0" size={28} />
        <div>
          <h4 className="text-rose-500 font-bold text-lg">Duplex Critical Operations</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Formatting or wiping a device via the Duplex interface bypasses local OS safety prompts. 
            Ensure the device is powered via a stable 5V/2A+ source. Disconnection during partition table formatting can result in a hard-brick state.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action) => (
          <div key={action.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col h-full hover:border-slate-600 transition-all group">
            <div className={`w-14 h-14 rounded-2xl ${action.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <action.icon className={action.color.replace('bg-', 'text-')} size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">{action.name}</h3>
            <p className="text-sm text-slate-500 mb-8 flex-1 leading-normal">{action.description}</p>
            <button 
              onClick={() => handleStartAction(action)}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${action.color} hover:brightness-110 active:scale-[0.98] shadow-xl shadow-${action.color.split('-')[1]}-500/20 text-white`}
            >
              Execute {action.name.split(' ').pop()}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && currentAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            {!isProcessing ? (
              <>
                <div className="flex items-center justify-center w-20 h-20 bg-rose-500/10 rounded-full mx-auto mb-8">
                  <AlertTriangle className="text-rose-500" size={40} />
                </div>
                <h2 className="text-3xl font-black text-center mb-4">Authorization Required</h2>
                <p className="text-center text-slate-400 mb-8 leading-relaxed">
                  You are about to initialize <span className="text-white font-bold">"{currentAction.name}"</span>. 
                  This will modify the internal partition structure of the linked device.
                </p>
                <div className="bg-slate-950 border border-white/5 rounded-2xl p-5 mb-10">
                  <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-2">Operation Risk Assessment</p>
                  <p className="text-sm text-slate-300 italic">"{currentAction.warning}"</p>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-700 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={executeAction}
                    className="flex-1 py-4 bg-rose-600 rounded-2xl font-bold text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
                  >
                    Confirm & Start
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto text-indigo-500 mb-8" size={64} />
                <h2 className="text-3xl font-black mb-4 tracking-tight">Format In Progress</h2>
                <p className="text-slate-400 mb-10">Rewriting NAND storage sectors. DO NOT INTERRUPT THE DUPLEX LINK.</p>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-4 border border-white/5">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-lg font-mono font-bold text-indigo-400 tracking-tighter">{progress}% SECTORS MAPPED</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionCenter;
