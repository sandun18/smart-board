import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaBan } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../api/admin/subscriptionPlanService";

const emptyForm = {
  name: "",
  price: "",
  durationDays: "",
  description: "",
  featuresText: "",
  active: true,
};

export default function ManageSubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch plans on mount ---
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAllPlans();
      setPlans(data || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  // --- Open modal for create ---
  const handleOpenCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // --- Open modal for edit ---
  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name || "",
      price: plan.price?.toString() || "",
      durationDays: plan.durationDays?.toString() || "",
      description: plan.description || "",
      featuresText: (plan.features || []).join(", "),
      active: plan.active,
    });
    setShowModal(true);
  };

  // --- Submit form ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Plan name is required.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }
    if (!form.durationDays || Number(form.durationDays) <= 0) {
      toast.error("Duration must be greater than 0 days.");
      return;
    }

    const features = form.featuresText
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const planData = {
      name: form.name.trim(),
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      description: form.description.trim(),
      features,
      active: form.active,
    };

    try {
      setSubmitting(true);
      if (editingPlan) {
        await updatePlan(editingPlan.id, planData);
        toast.success("Plan updated successfully!");
      } else {
        await createPlan(planData);
        toast.success("Plan created successfully!");
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);
      toast.error(err.response?.data?.message || "Failed to save plan.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Delete plan ---
  const handleDelete = async (plan) => {
    if (!window.confirm(`Are you sure you want to delete "${plan.name}"?`)) return;

    try {
      await deletePlan(plan.id);
      toast.success("Plan deleted successfully!");
      fetchPlans();
    } catch (err) {
      console.error("Failed to delete plan:", err);
      toast.error("Failed to delete plan.");
    }
  };

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-large shadow-custom transition-all duration-500 hover:shadow-xl">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-primary text-2xl md:text-3xl font-bold mb-1">
            Subscription Plans
          </h1>
          <p className="text-text-muted">
            Create, edit, and manage subscription plans for owners and students.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-3xl font-medium shadow-md transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5"
        >
          <FaPlus className="text-sm" />
          Create New Plan
        </button>
      </header>

      {/* Plans Table / Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-white/70 rounded-large shadow-custom">
          <p className="text-text-muted text-lg">No subscription plans found.</p>
          <p className="text-text-muted text-sm mt-2">
            Click "Create New Plan" to add your first plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-large bg-white shadow-custom border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.active ? "border-accent" : "border-gray-300 opacity-75"
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {plan.active ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    <FaCheck className="text-[10px]" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                    <FaBan className="text-[10px]" /> Inactive
                  </span>
                )}
              </div>

              {/* Plan Name */}
              <h3 className="text-xl font-black text-text uppercase tracking-tight mb-2 pr-20">
                {plan.name}
              </h3>

              {/* Price & Duration */}
              <div className="mb-4">
                <div className="text-3xl font-black text-primary tracking-tighter">
                  LKR {plan.price?.toLocaleString()}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  per {plan.durationDays} Days
                </span>
              </div>

              {/* Description */}
              {plan.description && (
                <p className="text-sm text-text-muted mb-4 italic">
                  {plan.description}
                </p>
              )}

              {/* Features */}
              <ul className="flex-1 space-y-2 mb-6">
                {(plan.features || []).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm font-medium text-text"
                  >
                    <FaCheck className="mt-1 shrink-0 text-accent text-xs" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Meta Info */}
              <div className="text-[10px] text-text-muted mb-4 space-y-1">
                {plan.createdAt && <p>Created: {plan.createdAt}</p>}
                {plan.updatedAt && <p>Updated: {plan.updatedAt}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-primary text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                >
                  <FaEdit /> Edit
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-large shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-primary">
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Basic Boost"
                  className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Price (LKR) <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) =>
                      setForm({ ...form, durationDays: e.target.value })
                    }
                    placeholder="30"
                    min="1"
                    className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief description of this plan..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Features{" "}
                  <span className="text-text-muted font-normal">
                    (comma separated)
                  </span>
                </label>
                <textarea
                  value={form.featuresText}
                  onChange={(e) =>
                    setForm({ ...form, featuresText: e.target.value })
                  }
                  placeholder="Top placement for 1 week, 2x view impressions, Email summary report"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
                <span className="text-sm font-medium text-text">
                  {form.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Submit Button */}
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
                  {submitting
                    ? "Saving..."
                    : editingPlan
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
