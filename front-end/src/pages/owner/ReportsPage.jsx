import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Common Components (Reuse or Create specific Owner versions if needed)
import HeaderBar from "../../components/Owner/common/HeaderBar";
import ConfirmationModal from "../../components/student/reports/ConfirmationModal"; // Can reuse Student's
import Notification from "../../components/student/maintenance/Notification"; // Can reuse Student's

// Owner Specific Components
import ReportTypesGrid from "../../components/Owner/report/ReportTypesGrid";
import ReportForm from "../../components/Owner/report/ReportForm";
import ReportsList from "../../components/Owner/report/ReportsList";
import ReportDetailsModal from "../../components/Owner/report/ReportDetailModal";

import useReportLogic from "../../hooks/owner/useReportLogic";

const ReportsPage = () => {
  // Use the existing Owner Hook
  const {
    reports, // All reports
    filteredReports, // Reports filtered by status
    setFilter,
    submitNewReport,
    loading,
  } = useReportLogic();

  const [notification, setNotification] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [pendingReport, setPendingReport] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Select Type
  const handleSelectType = (type, typeName) => {
    setSelectedReportType({ type, typeName });
    // Scroll to form
    setTimeout(() => window.scrollTo({ top: 400, behavior: "smooth" }), 100);
  };

  // 2. Submit Form (Pre-confirmation)
  const handleFormSubmit = (formData, files) => {
    // Combine for the modal review
    setPendingReport({ ...formData, files });
    setShowConfirmation(true);
  };

  // 3. Confirm & Send to Backend
  const handleConfirmSubmit = async () => {
    if (!pendingReport) return;

    const result = await submitNewReport(pendingReport, pendingReport.files);

    if (result.success) {
      showNotification("Report submitted successfully.", "success");
      setShowConfirmation(false);
      setPendingReport(null);
      setSelectedReportType(null); // Reset UI to grid
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showNotification(result.message || "Failed to submit.", "error");
      setShowConfirmation(false);
    }
  };

  return (
    <div className="space-y-8">
      <HeaderBar
        title="Student Incident Reports"
        subtitle="Manage and submit formal reports regarding student conduct."
        // Optional: Add a button here if you want
      />

      {/* --- SECTION 1: REPORT TYPES --- */}
      {!selectedReportType && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <h2 className="mb-6 text-2xl font-bold text-primary">
            Create New Report
          </h2>
          <ReportTypesGrid onSelectType={handleSelectType} />
        </motion.section>
      )}

      {/* --- SECTION 2: REPORT FORM --- */}
      <AnimatePresence>
        {selectedReportType && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <ReportForm
              reportType={selectedReportType}
              onSubmit={handleFormSubmit}
              onCancel={() => setSelectedReportType(null)}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- SECTION 3: REPORTS LIST --- */}
      <section className="pt-8 border-t border-gray-100">
        <ReportsList
          reports={filteredReports} // Uses the filtered list from your hook
          loading={loading}
          onViewDetails={setSelectedReportId}
          onFilterChange={setFilter} // Connects to your hook's setFilter
        />
      </section>

      {/* --- MODALS --- */}
      <ReportDetailsModal
        isOpen={selectedReportId !== null}
        onClose={() => setSelectedReportId(null)}
        report={reports.find((r) => r.id === selectedReportId)}
      />

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        reportData={pendingReport}
      />

      <Notification notification={notification} />
    </div>
  );
};

export default ReportsPage;