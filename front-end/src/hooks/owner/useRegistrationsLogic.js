import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";

import {
  getOwnerRegistrations,
  decideRegistration
} from "../../api/owner/service";

import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
import { ownerData as mockOwnerData } from "../../data/mockData";

const useRegistrationsLogic = () => {

  const { currentOwner } = useOwnerAuth();

  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  /* ================= FETCH REGISTRATIONS ================= */



  const attachTenantsToBoardings = (boardings, registrations) => {

  const approved = registrations.filter(r => r.status === "APPROVED");

  const tenantsByBoarding = {};

  approved.forEach(reg => {

    if (!tenantsByBoarding[reg.boardingId]) {
      tenantsByBoarding[reg.boardingId] = [];
    }

    tenantsByBoarding[reg.boardingId].push({
      id: reg.id,
      name: reg.studentName,
      email: reg.studentEmail,
      joinedDate: reg.moveInDate
    });

  });

  return boardings.map(b => ({
    ...b,
    tenantsList: tenantsByBoarding[b.id] || []
  }));
};``



  const fetchRegistrations = useCallback(async () => {

    if (!currentOwner?.id) return;

    setLoading(true);

    try {

      const data = await getOwnerRegistrations(currentOwner.id);

      const mappedData = data.map((dto) => {

        let uiStatus = dto.status;

        if (dto.status === "ACCEPTED") uiStatus = "APPROVED";
        if (dto.status === "DECLINED") uiStatus = "REJECTED";

        return {

          id: dto.id,

          studentName: dto.studentName || "Unknown Student",
          studentEmail: dto.studentEmail,

          boardingTitle: dto.boardingTitle || dto.boardingName || "Unknown Boarding",
          boardingAddress: dto.boardingAddress,

          status: uiStatus,

          numberOfStudents: dto.numberOfStudents,

          moveInDate: dto.moveInDate,

          keyMoney: dto.keyMoney,

          paymentMethod: dto.paymentMethod,

          paymentVerified: dto.paymentVerified,

          paymentSlipUrl: dto.paymentSlipUrl,

          keyMoneyPaid: dto.keyMoneyPaid,

          studentNote: dto.studentNote,

          ownerNote: dto.ownerNote,

          date: dto.createdAt || new Date().toISOString()

        };

      });

      setRegistrations(mappedData);
      setError(null);

    } catch (err) {

      console.error("Fetch registrations error", err);

      setError("Failed to load registrations.");

    } finally {

      setLoading(false);

    }

  }, [currentOwner]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  /* ================= DECISION ================= */

  const handleDecision = async (registrationId, payload) => {

    try {

      await decideRegistration(currentOwner.id, registrationId, payload);

      toast.success("Registration updated");

      await fetchRegistrations();

      return true;

    } catch (err) {

      toast.error(
        err?.response?.data?.message || "Failed to update registration"
      );

      return false;

    }

  };

  /* ================= FILTER / SEARCH / SORT ================= */

  const filteredRegistrations = useMemo(() => {

    let result = registrations.filter((reg) => {

      if (filter === "ALL") return true;

      return reg.status === filter;

    });

    if (searchQuery) {

      const q = searchQuery.toLowerCase();

      result = result.filter(
        (reg) =>
          reg.studentName?.toLowerCase().includes(q) ||
          reg.boardingTitle?.toLowerCase().includes(q)
      );

    }

    result.sort((a, b) => {

      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;

      return 0;

    });

    return result;

  }, [registrations, filter, searchQuery, sortBy]);

  /* ================= STATUS COUNTS ================= */

  const counts = useMemo(() => {

    const initialCounts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };

    return registrations.reduce((acc, reg) => {

      if (acc[reg.status] !== undefined) {
        acc[reg.status]++;
      }

      return acc;

    }, initialCounts);

  }, [registrations]);

  /* ================= STATUS STYLES ================= */

  const getStatusStyle = (status) => {

    const styles = {

      PENDING: {
        textClass: "text-warning",
        bgClass: "bg-warning/10",
        colorClass: "bg-warning",
        border: "border-warning/20",
      },

      APPROVED: {
        textClass: "text-success",
        bgClass: "bg-success/10",
        colorClass: "bg-success",
        border: "border-success/20",
      },

      REJECTED: {
        textClass: "text-error",
        bgClass: "bg-error/10",
        colorClass: "bg-error",
        border: "border-error/20",
      },

    };

    return styles[status] || styles.PENDING;

  };

  const activeOwnerData = {
    ...mockOwnerData,
    ...currentOwner,
  };

  return {

    registrations: filteredRegistrations,

    counts,

    ownerData: activeOwnerData,

    filter,
    setFilter,

    handleDecision,

    getStatusStyle,

    loading,
    error,

    searchQuery,
    setSearchQuery,

    sortBy,
    setSortBy

  };

};

export default useRegistrationsLogic;