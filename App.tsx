
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Usb, Loader2, Info, Activity, Terminal, CheckCircle, AlertCircle, Radio, LogIn, Smartphone, Zap } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DeviceDashboard from './components/DeviceDashboard';
import ActionCenter from './components/ActionCenter';
import DeviceBlueprint from './components/DeviceBlueprint';
import MaintenanceCenter from './components/MaintenanceCenter';
import PerformanceAnalyzer from './components/PerformanceAnalyzer';
import AdvancedAnalyzers from './components/AdvancedAnalyzers';
import LocationTracker from './components/LocationTracker';
import DeviceFinder from './components/DeviceFinder';
import ProfileManager from './components/ProfileManager';
import FileExplorer from './components/FileExplorer';
import AppManager from './components/AppManager';
import AdvancedAccess from './components/AdvancedAccess';
import SecurityAudit from './components/SecurityAudit';
import CommsCenter from './components/CommsCenter';
import IdentityManager from './components/IdentityManager';
import AntivirusSuite from './components/AntivirusSuite';
import UserManagement from './components/UserManagement';
import Auth from './components/Auth';
import { DeviceInfo, OSType, LogEntry, DeviceProfile, User, Operator, LoginLog } from './types';
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
  networkType: '5G UW (mmWave)',
  signalStrength: -84,
  carrierName: 'Verizon Wireless',
  updateAvailable: true,
  bugs: []
};

const INITIAL_OPERATORS: Operator[] = [
  { id: '1', name: 'System Administrator', email: 'admin@duplex.nexus', role: 'Admin', status: 'active', joinedDate: new Date().toISOString() }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('duplex_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [operators, setOperators] = useState<Operator[]>(() => {
    const saved = localStorage.getItem('duplex_operators');
    return saved ? JSON.parse(saved) : INITIAL_OPERATORS;
  });

  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(() => {
    const saved = localStorage.getItem('duplex_login_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnostic, setDiagnostic] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [profiles, setProfiles] = useState<DeviceProfile[]>(() => {
    const saved = localStorage.getItem('duplex_profiles');
    return saved ? JSON.parse(saved) : [];
  });
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('duplex_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('duplex_operators', JSON.stringify(operators));
  }, [operators]);

  useEffect(() => {
    localStorage.setItem('duplex_login_logs', JSON.stringify(loginLogs));
  }, [loginLogs]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('duplex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('duplex_user');
    }
  }, [user]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const handleLogin = (email: string, name: string, role: 'Admin' | 'Operator' = 'Operator') => {
    const newUser: User = { email, name, role };
    setUser(newUser);
    
    const newLog: LoginLog = {
      id: crypto.randomUUID(),
      userName: name,
      userEmail: email,
      timestamp: new Date().toLocaleString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`
    };
    setLoginLogs(prev => [newLog, ...prev].slice(0, 50));
    
    addLog(`Operator session started for ${name}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    handleDisconnect();
  };

  const addOperator = (name: string, email: string, role: 'Admin' | 'Operator') => {
    const newOp: Operator = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      status: 'active',
      joinedDate: new Date().toISOString()
    };
    setOperators(prev => [...prev, newOp]);
    addLog(`New operator provisioned: ${name}`, 'success');
  };

  const removeOperator = (id: string) => {
    const op = operators.find(o => o.id === id);
    if (op && op.email === user?.email) {
      alert("Cannot revoke self-access.");
      return;
    }
    setOperators(prev => prev.filter(o => o.id !== id));
    addLog(`Operator access revoked for ${op?.name}`, 'warning');
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    addLog('Initiating USB duplex handshake...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnecting(false);
    setShowLoadingOverlay(true);
    
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    setIsConnected(true);
    setShowLoadingOverlay(false);
    setDeviceInfo(MOCK_DEVICE);
    addLog('Secure data bridge established', 'success');
    
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
    addLog('Device disconnected from Duplex Link', 'warning');
  };

  const saveProfile = (name: string, category: DeviceProfile['category']) => {
    if (!deviceInfo) return;
    const newProfile: DeviceProfile = {
      id: crypto.randomUUID(),
      profileName: name,
      category,
      timestamp: new Date().toISOString(),
      deviceInfo: { ...deviceInfo }
    };
    setProfiles(prev => [newProfile, ...prev]);
    addLog(`Configuration saved: ${name}`, 'success');
  };

  const loadProfile = (profile: DeviceProfile) => {
    setDeviceInfo(profile.deviceInfo);
    setIsConnected(true);
    setActiveTab('dashboard');
    addLog(`Recalled configuration: ${profile.profileName}`, 'info');
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    addLog('Profile purged from Vault', 'warning');
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
      setDiagnostic("Error: Analysis core failed to respond.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} validOperators={operators} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-indigo-500/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isConnected={isConnected} 
        isAdmin={user.role === 'Admin'} 
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium text-xs">Operator:</span>
              <span className="text-white font-bold text-xs">{user.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium text-xs">Role:</span>
              <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <button 
                onClick={handleDisconnect}
                className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Usb size={16} /> Terminate Duplex
              </button>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Usb size={16} />}
                {isConnecting ? 'Linking Interface...' : 'Duplex Scan'}
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
              title="Logout Operator"
            >
              <LogIn size={18} className="rotate-180" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {showLoadingOverlay && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
              <div className="relative mb-12">
                <div className="w-40 h-40 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="text-white animate-pulse" size={48} />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Initializing Duplex Link</h2>
                <div className="flex items-center justify-center gap-4 text-indigo-400 font-mono text-xs tracking-[0.3em] uppercase">
                   <Zap size={14} className="animate-pulse" /> Interrogating Kernels <Zap size={14} className="animate-pulse" />
                </div>
                <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden mt-8">
                  <div className="h-full bg-indigo-500 animate-loading-bar shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-4">NAND Secure Token Exchange Active</p>
              </div>
            </div>
          )}

          {!isConnected && !isConnecting && !showLoadingOverlay && !['finder', 'profiles', 'user-mgmt'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-2xl">
                <Usb size={48} className="text-indigo-500 animate-pulse" />
              </div>
              <h2 className="text-4xl font-black mb-4 text-white tracking-tight">Duplex Interface Idle</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
                Mobile Phone Duplex is ready. Connect a device via high-speed USB-C or Lightning to initiate the professional suite.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left hover:border-indigo-500/30 transition-all group cursor-default">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                  </div>
                  <h4 className="font-bold mb-1 text-base">Real-time Analysis</h4>
                  <p className="text-xs text-slate-500 leading-normal">Deep CPU & Memory interrogation across all mobile architectures.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left hover:border-emerald-500/30 transition-all group cursor-default">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle size={20} />
                  </div>
                  <h4 className="font-bold mb-1 text-base">Verified Sanitization</h4>
                  <p className="text-xs text-slate-500 leading-normal">Enterprise-grade data format and secure wiping protocols.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left hover:border-rose-500/30 transition-all group cursor-default">
                  <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Info size={20} />
                  </div>
                  <h4 className="font-bold mb-1 text-base">Global Finder</h4>
                  <p className="text-xs text-slate-500 leading-normal">Locate devices via duplex network routing (independent of link).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finder' && <DeviceFinder />}
          {activeTab === 'profiles' && (
            <ProfileManager 
              profiles={profiles} 
              onLoad={loadProfile} 
              onDelete={deleteProfile} 
              onSave={saveProfile} 
              isConnected={isConnected}
              currentDevice={deviceInfo}
            />
          )}
          {activeTab === 'user-mgmt' && (
            <UserManagement 
              operators={operators} 
              loginLogs={loginLogs} 
              onAddOperator={addOperator} 
              onRemoveOperator={removeOperator} 
            />
          )}

          {isConnected && deviceInfo && (
            <div className="space-y-8 pb-20">
              {activeTab === 'dashboard' && <DeviceDashboard device={deviceInfo} />}
              {activeTab === 'comms' && <CommsCenter />}
              {activeTab === 'files' && <FileExplorer />}
              {activeTab === 'apps' && <AppManager />}
              {activeTab === 'antivirus' && <AntivirusSuite />}
              {activeTab === 'advanced' && <AdvancedAccess />}
              {activeTab === 'identity' && <IdentityManager />}
              {activeTab === 'audit' && <SecurityAudit />}
              {activeTab === 'location' && <LocationTracker brand={deviceInfo.brand} />}
              {activeTab === 'analyzer' && <PerformanceAnalyzer />}
              {activeTab === 'advanced-analyzers' && <AdvancedAnalyzers />}
              {activeTab === 'blueprint' && <DeviceBlueprint device={deviceInfo} />}
              {activeTab === 'maintenance' && <MaintenanceCenter device={deviceInfo} onUpdate={() => {}} />}
              
              {activeTab === 'diagnostics' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Activity className="text-indigo-500" /> AI Hardware Context
                    </h2>
                    <button 
                      onClick={runDiagnostic}
                      disabled={isAnalyzing}
                      className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                      Refresh Analysis
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative min-h-[400px]">
                    {isAnalyzing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                        <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">Querying Duplex Core...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-300">
                          {diagnostic || "No analysis current cached."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-4 animate-in fade-in">
                   <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Terminal className="text-emerald-500" /> Duplex System Logs
                    </h2>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 font-mono text-sm h-[60vh] overflow-y-auto space-y-2 bg-black/40 flex flex-col-reverse custom-scrollbar">
                      <div ref={logEndRef} />
                      {logs.length === 0 ? (
                        <div className="flex items-center justify-center h-full opacity-30 italic text-slate-500">
                          Waiting for initial duplex packets...
                        </div>
                      ) : (
                        logs.map((log, i) => (
                          <div key={i} className={`flex gap-4 p-1.5 rounded-lg transition-all animate-in slide-in-from-left-2 duration-300 ${
                            log.type === 'success' ? 'text-emerald-400' : 
                            log.type === 'error' ? 'text-rose-400 font-bold' : 
                            log.type === 'warning' ? 'text-amber-400' : 'text-indigo-300'
                          }`}>
                            <span className="text-slate-600 shrink-0 text-xs">[{log.timestamp}]</span>
                            <span className="flex-1"># {log.message}</span>
                          </div>
                        ))
                      )}
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
