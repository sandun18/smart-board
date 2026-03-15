import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaCrown, FaTrash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { getOwnerSubscriptions, cancelSubscription } from "../../api/owner/subscriptionService";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";

export default function MySubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const ownerId = userData.id;
      
      if (!ownerId) {
        toast.error("Owner account not found. Please log in again.");
        return;
      }

      const data = await getOwnerSubscriptions(ownerId);
      setSubscriptions(data || []);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      toast.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }

    try {
      await cancelSubscription(subscriptionId);
      toast.success("Subscription cancelled successfully");
      fetchSubscriptions(); // Refresh the list
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      toast.error("Failed to cancel subscription");
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      ACTIVE: "bg-green-100 text-green-700",
      EXPIRED: "bg-red-100 text-red-700",
      CANCELLED: "bg-gray-100 text-gray-700"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[status] || statusColors.ACTIVE}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <HeaderBar
        title="My Subscriptions"
        subtitle="Manage your active and past subscriptions"
        navBtnText="Back to Dashboard"
        navBtnPath="/owner/dashboard"
      />
      {/* Subscriptions List */}
      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-large shadow-custom">
            <FaCrown className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-text-muted text-lg">No subscriptions found.</p>
            <p className="text-text-muted text-sm mt-2">
              Subscribe to a plan to boost your ads and get more visibility.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-large shadow-custom border-t-4 border-accent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text">{subscription.planName}</h3>
                    <p className="text-sm text-text-muted">Plan ID: {subscription.planId}</p>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>

                {/* Price & Duration */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary">
                    LKR {subscription.planPrice?.toLocaleString()}
                  </div>
                  <p className="text-sm text-text-muted">{subscription.planDuration}</p>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-accent" />
                    <span className="text-text-muted">Start: {subscription.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-accent" />
                    <span className="text-text-muted">End: {subscription.endDate}</span>
                  </div>
                </div>

                {/* Ad Info */}
                {subscription.adId && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-text-muted">
                      <strong>Boosted Ad ID:</strong> {subscription.adId}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {/* View details logic */}}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-primary text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                  >
                    <FaEye /> View
                  </button>
                  {subscription.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-red-500 text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* Meta Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-text-muted">Created: {subscription.createdAt}</p>
                  {subscription.updatedAt && (
                    <p className="text-xs text-text-muted">Updated: {subscription.updatedAt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}