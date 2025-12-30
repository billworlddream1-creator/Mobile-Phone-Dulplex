
import React, { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle, ShieldX, CheckCircle, Loader2 } from 'lucide-react';

interface ActionCenterProps {
  onAction: (actionName: string) => void;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{id: string, name: string, description: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const actions = [
    { 
      id: 'format', 
      name: 'Factory Format', 
      description: 'Complete wipes all user data and resets the device firmware to factory defaults.', 
      icon: RefreshCw,
      color: 'bg-red-500',
      warning: 'This action is irreversible. All photos, messages, and accounts will be lost.'
    },
    { 
      id: 'wipe', 
      name: 'Secure Wipe', 
      description: 'Overwrites existing user data with random patterns to prevent forensic recovery.', 
      icon: ShieldX,
      color: 'bg-orange-500',
      warning: 'Sanitization process meets DoD 5220.22-M standards.'
    },
    { 
      id: 'cache', 
      name: 'Clear Cache', 
      description: 'Removes temporary system files and application cache to free up storage.', 
      icon: Trash2,
      color: 'bg-blue-500',
      warning: 'Safe operation. No user files will be affected.'
    }
  ];

  const handleStartAction = (action: typeof actions[0]) => {
    setCurrentAction(action);
    setIsModalOpen(true);
  };

  const executeAction = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate long-running process
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
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start space-x-3">
        <AlertTriangle className="text-red-500 shrink-0" size={24} />
        <div>
          <h4 className="text-red-500 font-bold">Danger Zone</h4>
          <p className="text-sm text-slate-400">The following operations interact directly with the device filesystem. Ensure the device has at least 50% battery and a stable USB connection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <div key={action.id} className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl flex flex-col h-full">
            <div className={`w-12 h-12 rounded-xl ${action.color}/10 flex items-center justify-center mb-4`}>
              <action.icon className={action.color.replace('bg-', 'text-')} size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">{action.name}</h3>
            <p className="text-sm text-slate-400 mb-6 flex-1">{action.description}</p>
            <button 
              onClick={() => handleStartAction(action)}
              className={`w-full py-3 rounded-xl font-bold transition-all ${action.color} hover:brightness-110 active:scale-[0.98] shadow-lg shadow-${action.color}/20`}
            >
              Initialize {action.id === 'format' ? 'Factory' : action.id === 'wipe' ? 'Sanitization' : 'Cleaning'}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && currentAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            {!isProcessing ? (
              <>
                <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mx-auto mb-6">
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Confirm Action</h2>
                <p className="text-center text-slate-400 mb-6">
                  Are you sure you want to perform <span className="text-white font-semibold">"{currentAction.name}"</span> on the connected device?
                </p>
                <div className="bg-slate-800 rounded-xl p-4 mb-8">
                  <p className="text-xs text-orange-400 uppercase font-bold tracking-widest mb-2">Notice</p>
                  <p className="text-sm text-slate-300 italic">"{currentAction.warning}"</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-slate-700 rounded-xl font-bold text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeAction}
                    className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white hover:bg-red-700"
                  >
                    Confirm & Proceed
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto text-blue-500 mb-6" size={48} />
                <h2 className="text-2xl font-bold mb-2">Operation in Progress</h2>
                <p className="text-slate-400 mb-8">Please do not disconnect the USB cable or close the application...</p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm font-mono text-blue-400">{progress}% Complete</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionCenter;
