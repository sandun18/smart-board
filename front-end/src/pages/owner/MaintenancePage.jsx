import React from "react";
import {
  FaClipboardCheck,
  FaTools,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

import HeaderBar from "../../components/Owner/common/HeaderBar";
import MaintenanceCard from "../../components/Owner/Maintenance/MaintenanceCard.jsx";
import useMaintenanceLogic from "../../hooks/owner/useMaintenanceLogic";

const MaintenancePage = () => {
  const {
    paginatedRequests,
    activeTab,
    setActiveTab,
    handleStatusUpdate,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useMaintenanceLogic();

  return (
    <div className="min-h-screen pt-4 pb-10 space-y-8 bg-light">
      <HeaderBar
        title="Maintenance"
        subtitle="Manage property repairs and track issue resolution."
      />

      {/* --- CONTROLS SECTION --- */}
      <section className="flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
        {/* Tab Switcher */}
        <div className="inline-flex w-full p-1 bg-white border border-gray-100 shadow-sm rounded-xl md:w-auto">
          {["pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:w-40 py-2.5 rounded-lg text-sm font-semibold capitalize transition-colors duration-200 flex items-center justify-center gap-2
                ${
                  activeTab === tab
                    ? "bg-accent text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              {tab === "pending" ? (
                <FaTools size={14} />
              ) : (
                <FaClipboardCheck size={14} />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search room, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
          />
        </div>
      </section>

      {/* --- GRID SECTION --- */}
      <section className="px-6 space-y-4">
        <div className="flex items-end justify-between">
          <h3 className="ml-2 text-2xl font-black tracking-tight uppercase text-primary">
            {activeTab} Tasks
          </h3>
          <span className="mb-1 text-sm font-medium text-gray-400">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {/* Standard Grid Layout (No Motion) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <MaintenanceCard
                key={request.id}
                request={request}
                onUpdateStatus={handleStatusUpdate}
              />
            ))
          ) : (
            <div className="py-16 text-center bg-white border border-gray-200 border-dashed col-span-full rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-gray-300 rounded-full bg-gray-50">
                {searchQuery ? (
                  <FaSearch size={24} />
                ) : activeTab === "pending" ? (
                  <FaCheckCircle size={32} />
                ) : (
                  <FaClipboardCheck size={32} />
                )}
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-800">
                {searchQuery
                  ? "No Matches Found"
                  : activeTab === "pending"
                  ? "All Caught Up!"
                  : "No History Yet"}
              </h3>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? `We couldn't find any request matching "${searchQuery}"`
                  : "Requests will appear here when available."}
              </p>
            </div>
          )}
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 transition-colors border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-lg font-semibold text-sm transition-colors
                  ${
                    currentPage === pageNum
                      ? "bg-accent text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-white border border-transparent hover:border-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 transition-colors border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MaintenancePage;