import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  createPlan,
  deactivatePlan,
  deletePlan,
  getAllPlans,
  updatePlan,
} from "../../api/admin/subscriptionPlanService";

const emptyForm = {
  name: "",
  price: "",
  duration: "",
  maxAds: "1",
  boostAllowed: false,
  features: "",
};

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAllPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error(err?.response?.data?.message || "Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan?.name || "",
      price: plan?.price?.toString() || "",
      duration: plan?.durationDays?.toString() || "",
      maxAds: plan?.maxAds?.toString() || "1",
      boostAllowed: Boolean(plan?.boostAllowed),
      features: plan?.featuresText || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const numericPrice = Number(form.price);
    const numericDuration = Number(form.duration);
    const numericMaxAds = Number(form.maxAds);

    if (!trimmedName) {
      toast.error("Plan name is required.");
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }
    if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
      toast.error("Duration (days) must be greater than 0.");
      return;
    }
    if (!Number.isFinite(numericMaxAds) || numericMaxAds <= 0) {
      toast.error("Max ads must be greater than 0.");
      return;
    }

    const payload = {
      name: trimmedName,
      price: numericPrice,
      durationDays: numericDuration,
      maxAds: numericMaxAds,
      boostAllowed: Boolean(form.boostAllowed),
      features: form.features,
    };

    try {
      setSubmitting(true);
      if (editingPlan) {
        await updatePlan(editingPlan.id, payload);
        toast.success("Plan updated successfully!");
      } else {
        await createPlan(payload);
        toast.success("Plan created successfully!");
      }
      setShowModal(false);
      await fetchPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);
      toast.error(err?.response?.data?.message || "Failed to save plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      return;
    }

    try {
      await deletePlan(plan.id);
      setPlans((prev) => prev.filter((item) => item.id !== plan.id));
      toast.success("Plan deleted successfully!");
    } catch (err) {
      console.error("Failed to delete plan:", err);
      const normalizedError = err?.normalized;

      if (normalizedError?.status === 409) {
        toast.error(normalizedError.message || "Cannot delete a plan that is already in use.");
      } else if (err?.response) {
        toast.error(
          normalizedError?.message ||
          err?.response?.data?.message ||
          "Failed to delete plan",
        );
      } else {
        toast.error("Unable to delete plan. Please try again.");
      }
    }
  };

  const handleDeactivate = async (plan) => {
    if (!plan?.active) {
      return;
    }

    try {
      const updatedPlan = await deactivatePlan(plan.id);
      setPlans((prev) =>
        prev.map((item) => (item.id === plan.id ? updatedPlan : item)),
      );
      toast.success("Plan deactivated successfully!");
    } catch (err) {
      console.error("Failed to deactivate plan:", err);
      toast.error(err?.response?.data?.message || "Failed to deactivate plan.");
    }
  };

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-large shadow-custom transition-all duration-500 hover:shadow-xl">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-primary text-2xl md:text-3xl font-bold mb-1">Subscription Plans</h1>
          <p className="text-text-muted">Create, edit, and manage subscription plans from the admin panel.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-3xl font-medium shadow-md transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5"
        >
          <FaPlus className="text-sm" />
          Create Plan
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-white/70 rounded-large shadow-custom">
          <p className="text-text-muted text-lg">No subscription plans found.</p>
          <p className="text-text-muted text-sm mt-2">Click "Create Plan" to add your first plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col p-6 rounded-large bg-white shadow-custom border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-accent"
            >
              <h3 className="text-xl font-black text-text uppercase tracking-tight mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full ${plan.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                  {plan.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-primary tracking-tighter">LKR {Number(plan.price || 0).toLocaleString()}</div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">per {plan.duration || "N/A"}</span>
              </div>

              <div className="mb-4 text-xs text-text-muted space-y-1">
                <p>Max Ads: <strong>{plan.maxAds ?? 1}</strong></p>
                <p>Boost Allowed: <strong>{plan.boostAllowed ? "Yes" : "No"}</strong></p>
              </div>

              {Array.isArray(plan.features) && plan.features.length > 0 && (
                <div className="flex-1 mb-6">
                  <h4 className="text-sm font-semibold text-text mb-2">Features:</h4>
                  <ul className="text-sm text-text-muted space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={`${plan.id}-feature-${index}`}>- {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[10px] text-text-muted mb-4 space-y-1">
                {plan.createdAt && <p>Created: {plan.createdAt}</p>}
                {plan.updatedAt && <p>Updated: {plan.updatedAt}</p>}
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => openEditModal(plan)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-primary text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeactivate(plan)}
                  disabled={!plan.active}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-500 text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-red-500 text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-large shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-primary">{editingPlan ? "Edit Plan" : "Create New Plan"}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Plan Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Premium"
                  className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Price (LKR) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="500"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Duration (Days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="30"
                    min="1"
                    step="1"
                    className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Max Ads <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.maxAds}
                    onChange={(e) => setForm({ ...form, maxAds: e.target.value })}
                    placeholder="5"
                    min="1"
                    step="1"
                    className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-text mb-1.5">
                  <input
                    type="checkbox"
                    checked={Boolean(form.boostAllowed)}
                    onChange={(e) => setForm({ ...form, boostAllowed: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Allow ad boosting
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Features</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="One feature per line"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-300 text-text-muted hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-full bg-accent text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
