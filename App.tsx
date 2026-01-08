
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Usb, Loader2, Info, Activity, Terminal, CheckCircle, AlertCircle, Radio, LogIn, Smartphone, Zap, Menu, X, Cloud, ShieldAlert, CreditCard, Clock as ClockIcon, Users } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DeviceDashboard from './components/DeviceDashboard';
import ActionCenter from './components/ActionCenter';
import DeviceBlueprint from './components/DeviceBlueprint';
import MaintenanceCenter from './components/MaintenanceCenter';
import PerformanceAnalyzer from './components/PerformanceAnalyzer';
import AdvancedAnalyzers from './components/AdvancedAnalyzers';
import LocationTracker from './components/LocationTracker';
import ProfileManager from './components/ProfileManager';
import FileExplorer from './components/FileExplorer';
import AppManager from './components/AppManager';
import AdvancedAccess from './components/AdvancedAccess';
import SecurityAudit from './components/SecurityAudit';
import CommsCenter from './components/CommsCenter';
import IdentityManager from './components/IdentityManager';
import AntivirusSuite from './components/AntivirusSuite';
import UserManagement from './components/UserManagement';
import SettingsPanel from './components/SettingsPanel';
import SubscriptionCenter from './components/SubscriptionCenter';
import Auth from './components/Auth';
import { DeviceInfo, OSType, LogEntry, DeviceProfile, User, Operator, LoginLog, AppSettings, CloudSyncStatus, DeviceStatus, SubscriptionPlan } from './types';
import { getDeviceDiagnostic } from './services/geminiService';
import { logStream } from './services/logStreamService';
import { cloudSyncService } from './services/cloudSyncService';

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

const INITIAL_PLANS: SubscriptionPlan[] = [
  { id: 'daily', name: 'Tactical Daily', price: 2, duration: 'day', features: ['Full Diagnostics', 'Cloud Sync', 'AI Interrogation'] },
  { id: 'weekly', name: 'Operational Weekly', price: 5, duration: 'week', features: ['Daily Features', 'Batch Operations', 'Priority Support'] },
  { id: 'monthly', name: 'Elite Monthly', price: 17, duration: 'month', features: ['All Features', 'Forensic Deep Scan', 'White-label Reports'] },
  { id: 'yearly', name: 'Enterprise Yearly', price: 65, duration: 'year', features: ['Elite Features', 'Unlimited Profiles', 'Advanced API Access'] },
];

const INITIAL_OPERATORS: Operator[] = [
  { id: '1', name: 'System Administrator', email: 'admin@gmt-duplex.io', role: 'Admin', status: 'active', joinedDate: new Date().toISOString(), subscription: { planId: 'yearly', status: 'active', expiryDate: '2026-01-01' } }
];

const RANDOM_NAMES = ["Agent_94", "Forensic_User", "Secure_Node_7", "Nexus_Operator", "Global_Linker", "Silent_Probe", "Data_Interceptor"];
const RANDOM_PLANS = ["Tactical Daily", "Elite Monthly", "Enterprise Yearly", "Operational Weekly"];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('duplex_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [operators, setOperators] = useState<Operator[]>(() => {
    const saved = localStorage.getItem('duplex_operators');
    return saved ? JSON.parse(saved) : INITIAL_OPERATORS;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('duplex_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [recentSubscriber, setRecentSubscriber] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const subTimer = setInterval(() => {
      const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const plan = RANDOM_PLANS[Math.floor(Math.random() * RANDOM_PLANS.length)];
      setRecentSubscriber(`${name} just activated ${plan} license`);
      setTimeout(() => setRecentSubscriber(""), 4500);
    }, 7000);
    return () => clearInterval(subTimer);
  }, []);

  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(() => {
    const saved = localStorage.getItem('duplex_login_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<DeviceStatus>(DeviceStatus.DISCONNECTED);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnostic, setDiagnostic] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [profiles, setProfiles] = useState<DeviceProfile[]>(() => {
    const saved = localStorage.getItem('duplex_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('duplex_settings');
    return saved ? JSON.parse(saved) : { autoSync: true, theme: 'dark', logRetentionDays: 30, securityLevel: 'Standard', enableBetaFeatures: false };
  });

  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<string>(() => localStorage.getItem('duplex_last_synced') || '');
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('duplex_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('duplex_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('duplex_operators', JSON.stringify(operators));
  }, [operators]);

  useEffect(() => {
    localStorage.setItem('duplex_plans', JSON.stringify(plans));
  }, [plans]);

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

  const triggerCloudSync = async () => {
    if (cloudStatus === 'syncing') return;
    setCloudStatus('syncing');
    try {
      const result = await cloudSyncService.sync(profiles, settings);
      setCloudStatus('success');
      setLastSynced(result.lastSynced);
      localStorage.setItem('duplex_last_synced', result.lastSynced);
      setTimeout(() => setCloudStatus('idle'), 3000);
    } catch (e) {
      setCloudStatus('error');
      setTimeout(() => setCloudStatus('idle'), 5000);
    }
  };

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = { timestamp: new Date().toLocaleTimeString(), message, type };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const handleLogin = (email: string, name: string, role: 'Admin' | 'Operator' = 'Operator') => {
    const existingOp = operators.find(o => o.email === email);
    const newUser: User = { 
      email, 
      name, 
      role, 
      subscription: existingOp?.subscription || { planId: '', status: 'none' }
    };
    setUser(newUser);
    setLoginLogs(prev => [{ id: crypto.randomUUID(), userName: name, userEmail: email, timestamp: new Date().toLocaleString(), ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}` }, ...prev].slice(0, 50));
    addLog(`Operator session started for ${name}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    handleDisconnect();
  };

  const handleConnect = async () => {
    setConnectionStatus(DeviceStatus.CONNECTING);
    addLog('Initiating GMT Duplex handshake...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowLoadingOverlay(true);
    await new Promise(resolve => setTimeout(resolve, 3500));
    setConnectionStatus(DeviceStatus.CONNECTED);
    setShowLoadingOverlay(false);
    setDeviceInfo(MOCK_DEVICE);
    addLog('GMT Secure data bridge established', 'success');
    logStream.connect((entry) => setLogs(prev => [entry, ...prev].slice(0, 100)));
  };

  const handleDisconnect = () => {
    logStream.disconnect();
    setConnectionStatus(DeviceStatus.DISCONNECTED);
    setDeviceInfo(null);
    setDiagnostic('');
    setActiveTab('dashboard');
    addLog('GMT Device disconnected from Duplex Link', 'warning');
  };

  const isConnected = connectionStatus === DeviceStatus.CONNECTED;

  const renderContent = () => {
    if (!isConnected && !['dashboard', 'profiles', 'settings', 'logs', 'user-mgmt', 'subscriptions'].includes(activeTab)) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-700 shadow-2xl">
            <Usb size={40} className={connectionStatus === DeviceStatus.CONNECTING ? "animate-spin text-indigo-500" : "animate-pulse"} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">No Duplex Target</h2>
          <p className="text-slate-500 max-w-sm mb-10">GMT Interface requires an active Duplex Link. Attach hardware via USB to begin interrogation.</p>
          <button onClick={handleConnect} disabled={connectionStatus === DeviceStatus.CONNECTING} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3">
            {connectionStatus === DeviceStatus.CONNECTING ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
            {connectionStatus === DeviceStatus.CONNECTING ? 'Establishing GMT Link...' : 'Attempt Manual Connect'}
          </button>
        </div>
      );
    }
    switch (activeTab) {
      case 'dashboard': return deviceInfo ? <DeviceDashboard device={deviceInfo} onAnalyze={() => { setIsAnalyzing(true); setActiveTab('diagnostics'); }} /> : <div className="h-full flex flex-col items-center justify-center p-20 text-center"><div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center mb-8 text-slate-700"><Usb size={40} className={connectionStatus === DeviceStatus.CONNECTING ? "animate-spin text-indigo-500" : ""} /></div><h2 className="text-2xl font-bold mb-4">Awaiting GMT Link</h2><button onClick={handleConnect} disabled={connectionStatus === DeviceStatus.CONNECTING} className="bg-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2">{connectionStatus === DeviceStatus.CONNECTING && <Loader2 size={18} className="animate-spin" />}{connectionStatus === DeviceStatus.CONNECTING ? 'Connecting...' : 'Connect Device'}</button></div>;
      case 'subscriptions': return <SubscriptionCenter user={user!} plans={plans} onSubscribe={(id) => { const p = plans.find(x => x.id === id); if(p && user) { const expiry = new Date(); if(p.duration === 'day') expiry.setDate(expiry.getDate()+1); else if(p.duration === 'week') expiry.setDate(expiry.getDate()+7); else if(p.duration === 'month') expiry.setMonth(expiry.getMonth()+1); else expiry.setFullYear(expiry.getFullYear()+1); const sub = { planId: id, status: 'active' as const, expiryDate: expiry.toISOString() }; setUser({...user, subscription: sub}); setOperators(prev => prev.map(op => op.email === user.email ? {...op, subscription: sub} : op)); addLog(`License activated: ${p.name}`, 'success'); }}} />;
      case 'diagnostics': return deviceInfo ? <div className="space-y-6"><div className="flex items-center justify-between mb-2"><h2 className="text-2xl font-bold flex items-center gap-2"><Zap className="text-indigo-400" /> GMT AI Diagnostic</h2><button onClick={async () => { setIsAnalyzing(true); setDiagnostic(await getDeviceDiagnostic(deviceInfo)); setIsAnalyzing(false); }} disabled={isAnalyzing} className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold uppercase text-indigo-400 hover:bg-slate-800">{isAnalyzing ? 'Re-analyzing...' : 'Run New Scan'}</button></div><div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[400px] relative">{isAnalyzing && <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-3xl z-10"><Loader2 className="animate-spin text-indigo-500 mb-4" size={48} /><p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse">INTERROGATING GMT KERNEL...</p></div>}<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">{diagnostic || "Awaiting scan trigger..."}</div></div></div> : null;
      case 'actions': return <ActionCenter onAction={(name) => addLog(`Executed: ${name}`, 'warning')} />;
      case 'blueprint': return deviceInfo ? <DeviceBlueprint device={deviceInfo} /> : null;
      case 'maintenance': return deviceInfo ? <MaintenanceCenter device={deviceInfo} onUpdate={() => { setDeviceInfo(prev => prev ? {...prev, osVersion: '14.2 (GMT Optimized)', updateAvailable: false} : null); addLog('GMT Optimized Patch Applied', 'success'); }} /> : null;
      case 'analyzer': return <PerformanceAnalyzer />;
      case 'advanced-analyzers': return <AdvancedAnalyzers />;
      case 'location': return <LocationTracker brand={deviceInfo?.brand} />;
      case 'profiles': return <ProfileManager profiles={profiles} onLoad={(p) => { setDeviceInfo(p.deviceInfo); setConnectionStatus(DeviceStatus.CONNECTED); setActiveTab('dashboard'); addLog(`Restored GMT Profile: ${p.profileName}`, 'info'); }} onDelete={(id) => setProfiles(prev => prev.filter(p => p.id !== id))} onSave={(name, cat) => { if(deviceInfo) { setProfiles(prev => [{id: crypto.randomUUID(), profileName: name, category: cat, timestamp: new Date().toISOString(), deviceInfo: {...deviceInfo}, cloudSynced: false}, ...prev]); addLog(`GMT Snapshot saved: ${name}`, 'success'); } }} isConnected={isConnected} currentDevice={deviceInfo} />;
      case 'files': return <FileExplorer />;
      case 'apps': return <AppManager />;
      case 'advanced': return <AdvancedAccess />;
      case 'audit': return <SecurityAudit />;
      case 'comms': return <CommsCenter />;
      case 'identity': return <IdentityManager />;
      case 'antivirus': return <AntivirusSuite />;
      case 'user-mgmt': return <UserManagement operators={operators} loginLogs={loginLogs} plans={plans} onAddOperator={(n, e, r) => { setOperators(prev => [{id: crypto.randomUUID(), name: n, email: e, role: r, status: 'active', joinedDate: new Date().toISOString(), subscription: {planId: '', status: 'none'}}, ...prev]); addLog(`Provisioned: ${n}`, 'success'); }} onRemoveOperator={(id) => setOperators(prev => prev.filter(o => o.id !== id))} onUpdatePlans={(p) => setPlans(p)} />;
      case 'settings': return <SettingsPanel settings={settings} updateSettings={(s) => setSettings(prev => ({...prev, ...s}))} syncStatus={cloudStatus} lastSynced={lastSynced} onManualSync={triggerCloudSync} />;
      case 'logs': return <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 h-[75vh] flex flex-col shadow-2xl"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><Terminal className="text-indigo-400" /> GMT System Log</h3><button onClick={() => setLogs([])} className="text-[10px] font-bold uppercase text-slate-500 hover:text-white">Purge Buffer</button></div><div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">{logs.map((log, i) => (<div key={i} className="flex gap-4 border-b border-white/5 pb-2"><span className="text-slate-600 shrink-0">[{log.timestamp}]</span><span className={`${log.type === 'error' ? 'text-rose-500' : log.type === 'warning' ? 'text-amber-500' : log.type === 'success' ? 'text-emerald-500' : 'text-indigo-300'}`}>{log.message}</span></div>))}<div ref={logEndRef} /></div></div>;
      default: return null;
    }
  };

  if (!user) return <Auth onLogin={handleLogin} validOperators={operators} />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} status={connectionStatus} isAdmin={user.role === 'Admin'} syncStatus={cloudStatus} />
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"><Menu size={20} /></button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operator: {user.name}</p>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${isConnected ? 'text-emerald-500' : 'text-slate-500'}`}>{connectionStatus}</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 px-8 hidden xl:block">
            {recentSubscriber && (
              <div className="flex items-center justify-center animate-feed">
                <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 rounded-full flex items-center gap-3">
                  <Users size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide">{recentSubscriber}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end mr-4">
               <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2"><ClockIcon size={10} /> Live GMT</p>
               <span className="text-sm font-mono font-black text-white tracking-tighter">{currentTime}</span>
             </div>
             <button onClick={handleLogout} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all" title="Terminate Session"><LogIn className="rotate-180" size={18} /></button>
          </div>
        </header>

        <div className="p-8 pb-20">{renderContent()}</div>

        <footer className="fixed bottom-0 right-0 left-64 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800 px-6 py-2.5 flex items-center justify-between text-[10px] z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} /><span className="font-bold uppercase text-slate-500">GMT INTERFACE {connectionStatus}</span></div>
            {deviceInfo && <><div className="h-3 w-px bg-slate-800" /><span className="text-slate-400 font-medium">TARGET: {deviceInfo.brand} {deviceInfo.model}</span></>}
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-bold tracking-widest uppercase"><span>© 2024 GMT PHONE DUPLEX</span><div className="h-3 w-px bg-slate-800" /><span>v2.5.0-GMT</span></div>
        </footer>

        {showLoadingOverlay && (
          <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] mb-8"><Usb className="text-white animate-bounce" size={40} /></div>
            <h2 className="text-2xl font-black text-white mb-2">Finalizing GMT Handshake</h2>
            <p className="text-slate-500 font-mono text-xs tracking-[0.3em] animate-pulse uppercase">Syncing memory map registers...</p>
            <div className="mt-12 w-48 h-1 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 animate-loading-bar" /></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
