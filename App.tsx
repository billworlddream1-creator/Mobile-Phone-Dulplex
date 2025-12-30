
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Usb, Loader2, Info, Activity, Terminal, CheckCircle, AlertCircle, Radio } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DeviceDashboard from './components/DeviceDashboard';
import ActionCenter from './components/ActionCenter';
import DeviceBlueprint from './components/DeviceBlueprint';
import MaintenanceCenter from './components/MaintenanceCenter';
import { DeviceInfo, OSType, LogEntry } from './types';
import { getDeviceDiagnostic } from './services/geminiService';
import { logStream } from './services/logStreamService';

const MOCK_DEVICE: DeviceInfo = {
  model: 'Galaxy S24 Ultra (SM-S928B)',
  brand: 'Samsung',
  os: OSType.ANDROID,
  osVersion: '14.0 (One UI 6.1)',
  osBuild: 'UP1A.231005.007.S928BXXU1AXCA',
  serialNumber: 'SN-X98273645-Z',
  imei: '358902834710293',
  phoneNumber: '+1 (555) 012-3456',
  associatedEmail: 'developer.nexus@proton.me',
  batteryHealth: 92,
  storageTotal: 512,
  storageUsed: 142,
  cpu: 'Snapdragon 8 Gen 3 (4nm)',
  ram: '12 GB LPDDR5X',
  updateAvailable: true,
  bugs: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnostic, setDiagnostic] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    addLog('Initiating USB handshake...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsConnecting(false);
    setDeviceInfo(MOCK_DEVICE);
    addLog('Secure data bridge established', 'success');
    addLog('Device linked: Galaxy S24 Ultra', 'info');
    
    // Connect to real-time log stream
    logStream.connect((entry) => {
      setLogs(prev => [entry, ...prev].slice(0, 100));
    });
  };

  const handleDisconnect = () => {
    logStream.disconnect();
    setIsConnected(false);
    setDeviceInfo(null);
    setDiagnostic('');
    setActiveTab('dashboard');
    addLog('Device disconnected from USB port', 'warning');
  };

  const runDiagnostic = async () => {
    if (!deviceInfo) return;
    setIsAnalyzing(true);
    addLog('Running AI Diagnostic Engine...', 'info');
    try {
      const result = await getDeviceDiagnostic(deviceInfo);
      setDiagnostic(result);
      addLog('Diagnostic analysis complete', 'success');
    } catch (err) {
      addLog('Diagnostic engine failure', 'error');
      setDiagnostic("Error: Analysis core failed to respond. Please check your network connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAction = (actionName: string) => {
    addLog(`Successfully completed: ${actionName}`, 'success');
  };

  const handleUpdateInstalled = () => {
    if (deviceInfo) {
      setDeviceInfo({
        ...deviceInfo,
        osVersion: '14.2 (One UI 6.5)',
        osBuild: 'UP1A.240315.001.S928BXXU2BXDB',
        updateAvailable: false
      });
      addLog('System update installed successfully', 'success');
    }
  };

  useEffect(() => {
    if (activeTab === 'diagnostics' && isConnected && !diagnostic && !isAnalyzing) {
      runDiagnostic();
    }
  }, [activeTab, isConnected]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isConnected={isConnected} />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Session:</span>
            <span className="text-blue-400 font-mono text-sm">#NS-88219-X</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <button 
                onClick={handleDisconnect}
                className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Usb size={16} /> Terminate Link
              </button>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Usb size={16} />}
                {isConnecting ? 'Establishing Link...' : 'Scan for Device'}
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {!isConnected && !isConnecting && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <Usb size={48} className="text-slate-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">No Link Detected</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Connect your mobile device via USB. Ensure high-speed data transfer is supported by your cable.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-blue-500/30 transition-colors group">
                  <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Info size={18} />
                  </div>
                  <h4 className="font-bold mb-1 text-sm">Android USB Debug</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Enable in Developer Options</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-purple-500/30 transition-colors group">
                  <div className="w-8 h-8 bg-purple-500/10 text-purple-500 rounded flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Info size={18} />
                  </div>
                  <h4 className="font-bold mb-1 text-sm">iOS RSA Trust</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Grant "Trust" on Handset</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-green-500/30 transition-colors group">
                  <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Info size={18} />
                  </div>
                  <h4 className="font-bold mb-1 text-sm">Data Interface</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Use USB 3.0+ for Best Results</p>
                </div>
              </div>
            </div>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Usb size={32} className="text-blue-500 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-8 mb-2">Polling USB Interface</h2>
              <p className="text-slate-500 font-mono text-sm tracking-widest">ESTABLISHING ENCRYPTED HANDSHAKE...</p>
            </div>
          )}

          {isConnected && deviceInfo && (
            <div className="space-y-8 pb-20">
              {activeTab === 'dashboard' && <DeviceDashboard device={deviceInfo} />}
              {activeTab === 'blueprint' && <DeviceBlueprint device={deviceInfo} />}
              {activeTab === 'maintenance' && <MaintenanceCenter device={deviceInfo} onUpdate={handleUpdateInstalled} />}
              
              {activeTab === 'diagnostics' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Activity className="text-blue-500" /> AI Hardware Context
                    </h2>
                    <button 
                      onClick={runDiagnostic}
                      disabled={isAnalyzing}
                      className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                      Refresh Analysis
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative min-h-[400px]">
                    {isAnalyzing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                        <p className="text-slate-400 font-mono text-xs tracking-widest">QUERYING GEMINI CORE...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-300">
                          {diagnostic || "No analysis current cached. Use refresh to query AI."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'actions' && <ActionCenter onAction={handleAction} />}

              {activeTab === 'logs' && (
                <div className="space-y-4 animate-in fade-in">
                   <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Terminal className="text-green-500" /> Operation Logs
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                        <Radio size={14} className="text-green-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">WebSocket Stream: Connected</span>
                      </div>
                      <button 
                        onClick={() => setLogs([])} 
                        className="text-[10px] text-slate-500 hover:text-red-400 font-bold uppercase tracking-widest transition-colors"
                      >
                        Purge Buffer
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        System Interface TTY
                      </span>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                      </div>
                    </div>
                    <div className="p-6 font-mono text-sm h-[60vh] overflow-y-auto space-y-2 bg-black/40 flex flex-col-reverse custom-scrollbar">
                      <div ref={logEndRef} />
                      {logs.length === 0 ? (
                        <div className="flex items-center justify-center h-full opacity-30 italic text-slate-500">
                          Polling hardware interface for initial packets...
                        </div>
                      ) : (
                        logs.map((log, i) => (
                          <div key={i} className="flex gap-4 group hover:bg-white/5 p-1.5 rounded-lg transition-all animate-in slide-in-from-left-2 duration-300">
                            <span className="text-slate-600 shrink-0 select-none text-xs">[{log.timestamp}]</span>
                            <span className={`
                              flex-1
                              ${log.type === 'success' ? 'text-green-400' : ''}
                              ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                              ${log.type === 'warning' ? 'text-yellow-400' : ''}
                              ${log.type === 'info' ? 'text-blue-300' : ''}
                            `}>
                              <span className="opacity-50 mr-2">$</span>
                              {log.message}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hardware' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/20 transition-all">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Physical Specs</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">Processor Node</span>
                        <span className="font-bold text-blue-300">{deviceInfo.cpu}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">LPDDR5 RAM</span>
                        <span className="font-bold text-blue-300">{deviceInfo.ram}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">Display Cluster</span>
                        <span className="font-bold text-blue-300">AMOLED 2X 120Hz</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500/20 transition-all">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Security Context</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">Encryption Status</span>
                        <span className="font-bold text-green-400">ACTIVE (AES-GCM)</span>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">TEE Environment</span>
                        <span className="font-bold text-green-400">SECURE ENCLAVE</span>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">Kernel Integrity</span>
                        <span className="font-bold text-green-400">VERIFIED BOOT</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
