import React, { useState } from 'react';

const BackupManagement = () => {
  const [backups, setBackups] = useState([
    { id: 1, name: 'Full_System_Backup_2023_12_20.zip', size: '142.5 MB', date: '2023-12-20 00:00', type: 'System' },
    { id: 2, name: 'Database_Snapshot_Dec_15.sql', size: '12.1 MB', date: '2023-12-15 14:30', type: 'Database' },
    { id: 3, name: 'Media_Assets_Backup.tar.gz', size: '890.2 MB', date: '2023-12-10 02:15', type: 'Media' },
  ]);

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header & Main Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-text-dark tracking-tight mb-1">Backup & Recovery</h3>
          <p className="text-text-muted text-sm">Manage system snapshots and data restoration points.</p>
        </div>
        <button className="bg-primary text-white font-black py-4 px-8 rounded-[18px] shadow-[0_10px_20px_rgba(216,76,56,0.3)] hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95">
          <i className="fas fa-plus-circle"></i>
          Create New Backup
        </button>
      </div>

      {/* Storage Breakdown - Replicating the Visual Progress from HTML */}
      <div className="bg-background-light/20 border border-white p-6 rounded-[25px]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Server Storage Usage</span>
            <h4 className="text-2xl font-black text-text-dark">1.2 GB <span className="text-sm font-normal text-text-muted text-opacity-60">/ 5.0 GB</span></h4>
          </div>
          <span className="text-xs font-bold text-accent">24% Used</span>
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden flex">
          <div className="h-full bg-accent w-[15%] transition-all" title="System"></div>
          <div className="h-full bg-primary w-[7%] transition-all" title="Database"></div>
          <div className="h-full bg-text-dark/20 w-[2%] transition-all" title="Logs"></div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
            <span className="w-2 h-2 rounded-full bg-accent"></span> System
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Database
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span> Other
          </div>
        </div>
      </div>

      {/* Backup List - Grid Layout like CSS */}
      <div className="grid grid-cols-1 gap-4">
        <h4 className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Available Restore Points</h4>
        
        {backups.map((backup) => (
          <div 
            key={backup.id} 
            className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white rounded-[20px] border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              {/* File Icon with specific colors based on type */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${
                backup.type === 'Database' ? 'bg-blue-50 text-blue-500' : 
                backup.type === 'Media' ? 'bg-purple-50 text-purple-500' : 'bg-orange-50 text-accent'
              }`}>
                <i className={`fas ${backup.type === 'Database' ? 'fa-file-code' : 'fa-file-archive'}`}></i>
              </div>
              
              <div>
                <p className="font-bold text-text-dark text-lg leading-tight mb-1">{backup.name}</p>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-background-light/50 rounded-md text-[10px] font-black text-text-muted uppercase tracking-tighter">
                    {backup.type}
                  </span>
                  <span className="text-xs text-text-muted/60 font-medium">
                    <i className="far fa-clock mr-1"></i> {backup.date}
                  </span>
                  <span className="text-xs text-text-muted/60 font-black tracking-tighter">
                    {backup.size}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
              <button title="Restore System" className="p-3 w-11 h-11 flex items-center justify-center rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all shadow-sm">
                <i className="fas fa-undo-alt"></i>
              </button>
              <button title="Download" className="p-3 w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                <i className="fas fa-download"></i>
              </button>
              <button title="Delete" className="p-3 w-11 h-11 flex items-center justify-center rounded-xl bg-red-alert/10 text-red-alert hover:bg-red-alert hover:text-white transition-all shadow-sm">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-Backup Notice - Styled like your HTML Alert Boxes */}
      <div className="p-6 bg-accent/5 border-2 border-dashed border-accent/20 rounded-[25px] flex items-start gap-4">
        <div className="w-10 h-10 bg-accent/20 text-accent rounded-full flex items-center justify-center shrink-0">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div>
          <h5 className="font-bold text-text-dark mb-1">Automated Protection Active</h5>
          <p className="text-sm text-text-muted leading-relaxed">
            The system is currently configured to perform a <strong>Full Database Backup every 24 hours</strong>. 
            Backups are stored for 30 days before being automatically rotated. Cloud synchronization is currently <span className="text-success font-bold">Enabled</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement;