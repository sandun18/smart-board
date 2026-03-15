import React from 'react';
import AdminService from '../../../api/admin/AdminService';

const SystemLogs = () => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const loadLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminService.getActivityLogs();
      setLogs(
        (data || []).map((l) => ({
          id: l.eventId,
          user: l.user,
          action: l.action,
          status: l.status,
          time: l.createdAt ? new Date(l.createdAt).toLocaleString() : 'N/A',
          icon: l.icon || 'fa-history'
        }))
      );
    } catch (error) {
      console.error('Failed to load activity logs', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const exportCsv = () => {
    const lines = [
      ['Event ID', 'User', 'Action', 'Status', 'Time'].join(','),
      ...logs.map((l) => [
        l.id,
        `"${String(l.user || '').replaceAll('"', '""')}"`,
        `"${String(l.action || '').replaceAll('"', '""')}"`,
        l.status,
        `"${l.time}"`
      ].join(','))
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-text-dark">System Activity Logs</h3>
          <p className="text-text-muted text-sm">Audit trail of all administrative actions</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={exportCsv}
            className="flex-1 md:flex-none px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-text-muted hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-file-export mr-2"></i> Export CSV
          </button>
          <button
            onClick={loadLogs}
            className="flex-1 md:flex-none px-4 py-2 bg-text-dark text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-text-muted mb-4">Loading activity logs...</p>}

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/30 text-text-muted text-xs uppercase tracking-widest font-black">
              <th className="px-6 py-4">Event ID</th>
              <th className="px-6 py-4">User / Actor</th>
              <th className="px-6 py-4">Action Description</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-dark">
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-background-light/10 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-accent">{log.id}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                        <i className="fas fa-user"></i>
                     </div>
                     {log.user}
                   </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <i className={`fas ${log.icon} text-text-muted/50`}></i>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    log.status === 'Success' ? 'bg-success/10 text-success' : 'bg-red-alert/10 text-red-alert'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-muted whitespace-nowrap">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemLogs;