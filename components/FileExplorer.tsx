
import React, { useState } from 'react';
import { Folder, File, ChevronRight, Search, HardDrive, Shield, MoreVertical, Download, Trash2, FileText, Image, Video, Share2, Loader2 } from 'lucide-react';

const FileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(['/', 'storage', 'emulated', '0']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const files = [
    { name: 'DCIM', type: 'folder', size: '2.4 GB', date: '2024-05-20' },
    { name: 'Documents', type: 'folder', size: '142 MB', date: '2024-05-18' },
    { name: 'Download', type: 'folder', size: '8.1 GB', date: '2024-05-21' },
    { name: 'Android', type: 'folder', size: '1.2 GB', date: '2024-05-15', protected: true },
    { name: 'system_dump.log', type: 'file', size: '2.4 MB', date: '2024-05-21', ext: 'log' },
    { name: 'device_key.pub', type: 'file', size: '1 KB', date: '2024-05-10', ext: 'key' },
    { name: 'vacation_photo.jpg', type: 'file', size: '4.2 MB', date: '2024-04-12', ext: 'jpg' },
    { name: 'contract_v2.pdf', type: 'file', size: '1.1 MB', date: '2024-05-01', ext: 'pdf' },
  ];

  const handleExportManifest = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    alert('Filesystem manifest for ' + currentPath.join('/') + ' exported to PC successfully.');
  };

  const getFileIcon = (file: any) => {
    if (file.type === 'folder') return <Folder size={20} className="text-indigo-400 fill-indigo-400/10" />;
    switch (file.ext) {
      case 'jpg': return <Image size={20} className="text-emerald-400" />;
      case 'log': return <FileText size={20} className="text-slate-400" />;
      case 'pdf': return <FileText size={20} className="text-rose-400" />;
      default: return <File size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Filesystem Interrogator</h2>
          <p className="text-slate-400 text-sm">Navigating internal storage via high-speed duplex bridge</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportManifest}
            disabled={isExporting}
            className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/5"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
            {isExporting ? 'Mapping...' : 'Export Directory Manifest'}
          </button>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-4">
            <HardDrive size={18} className="text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black">Mount Point</span>
              <span className="text-sm font-mono font-bold">/storage/emulated/0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar whitespace-nowrap px-2">
            {currentPath.map((folder, i) => (
              <React.Fragment key={i}>
                <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">{folder}</button>
                {i < currentPath.length - 1 && <ChevronRight size={14} className="text-slate-600" />}
              </React.Fragment>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500 transition-all w-48"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Size</th>
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">Last Modified</th>
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((file, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-indigo-500/5 transition-colors group cursor-default">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file)}
                      <div>
                        <span className="text-sm font-bold text-slate-200">{file.name}</span>
                        {file.protected && (
                          <div className="flex items-center gap-1 text-[8px] text-amber-500 font-black uppercase tracking-tighter mt-0.5">
                            <Shield size={8} /> Restricted Access
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">{file.size}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{file.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Download">
                        <Download size={14} />
                      </button>
                      {!file.protected && (
                        <button className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
