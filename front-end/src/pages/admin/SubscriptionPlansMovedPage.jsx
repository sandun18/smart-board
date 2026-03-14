import React from "react";

export default function SubscriptionPlansMovedPage() {
  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <header className="bg-white/70 backdrop-blur-sm p-6 rounded-large shadow-custom">
        <h1 className="text-primary text-2xl md:text-3xl font-bold mb-2">
          Subscription Plan Management
        </h1>
        <p className="text-text-muted max-w-3xl">
          Subscription plan creation and management are handled in the admin panel.
          Use the dedicated management route below.
        </p>
      </header>

      <section className="bg-white rounded-large shadow-custom p-6 border-l-4 border-accent">
        <h2 className="text-lg font-semibold text-text mb-2">Route</h2>
        <p className="text-text-muted mb-3">
          Open this page to manage subscription plans (create, edit, delete).
        </p>
        <p className="text-text-muted">
          Admin route: <strong>/admin/subscription-plans/manage</strong>
        </p>
      </section>
    </div>
  );
}
