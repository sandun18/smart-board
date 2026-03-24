import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportTable from '../../components/admin/reports/ReportTable';
import ReportFilters from '../../components/admin/reports/ReportFilters';
import ReportDetailsModal from '../../components/admin/reports/ReportDetailsModal';
import Toast from '../../components/admin/common/Toast';
import { useReports } from '../../hooks/admin/useReports';

const AdminReports = () => {
  const navigate = useNavigate();
  const { 
    stats,
    filteredReports, 
    currentTab, 
    setCurrentTab, 
    category, 
    setCategory,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedReport, 
    setSelectedReport, 
    toast, 
    loading,
    handleDismiss, 
    handleResolve 
  } = useReports();

  return (
    <>
      {/* Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[
          { label: 'Pending', val: stats.pending, color: 'border-[#FF7A00]', icon: 'fa-clock', bg: 'bg-[#FF7A00]/10', text: 'text-[#FF7A00]' },
          { label: 'Urgent', val: stats.urgent, color: 'border-[#EF4444]', icon: 'fa-bolt', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' },
          { label: 'Resolved', val: stats.resolved, color: 'border-emerald-500', icon: 'fa-check-circle', bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'Total Reports', val: stats.total, color: 'border-blue-500', icon: 'fa-list', bg: 'bg-blue-50', text: 'text-blue-600' },
        ].map((s, i) => (
          <div key={i} className={`bg-white p-5 lg:p-6 rounded-[20px] lg:rounded-[25px] shadow-sm border-l-4 ${s.color} flex items-center gap-4`}>
             <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${s.bg} ${s.text} flex items-center justify-center text-lg lg:text-xl`}>
               <i className={`fas ${s.icon}`}></i>
             </div>
             <div>
               <span className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{s.label}</span>
               <div className="text-xl lg:text-2xl font-black text-[#332720]">{s.val}</div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Filters Section */}
      <div className="mb-6">
        <ReportFilters 
          currentTab={currentTab} 
          setTab={setCurrentTab} 
          category={category} 
          setCategory={setCategory} 
        />
      </div>

      {/* 3. Table/Loading Section */}
      <div className="bg-white lg:rounded-[25px] lg:shadow-sm lg:overflow-hidden lg:border lg:border-gray-100 min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold animate-pulse">Fetching from Backend...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <ReportTable reports={filteredReports} onView={setSelectedReport} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
              <i className="fas fa-folder-open text-3xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-400">No reports found</h3>
            <p className="text-sm text-gray-300">Switch status tabs to view more data</p>
          </div>
        )}
      </div>

      {!loading && totalItems > 0 && (
        <div className="mt-4 bg-white rounded-[18px] px-4 py-3 shadow-sm border border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-text-muted font-medium">
            Showing {(currentPage - 1) * pageSize + 1}
            {' '}-{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} reports
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 bg-gray-50 rounded-lg text-sm outline-none"
              aria-label="Reports per page"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-sm font-bold text-[#332720] min-w-[90px] text-center">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 4. Modals */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDismiss={handleDismiss}
          onResolve={handleResolve}
        />
      )}
    </>
  );
};

export default AdminReports;
