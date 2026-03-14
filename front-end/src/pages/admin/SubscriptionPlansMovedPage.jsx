import React from "react";

export default function SubscriptionPlansMovedPage() {
  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <header className="bg-white/70 backdrop-blur-sm p-6 rounded-large shadow-custom">
        <h1 className="text-primary text-2xl md:text-3xl font-bold mb-2">
          Subscription Plans Moved
        </h1>
        <p className="text-text-muted max-w-3xl">
          Subscription plan creation and management have been moved to the owner
          panel. This admin page is kept only for backward compatibility.
        </p>
      </header>

      <section className="bg-white rounded-large shadow-custom p-6 border-l-4 border-accent">
        <h2 className="text-lg font-semibold text-text mb-2">What changed</h2>
        <p className="text-text-muted mb-3">
          The subscription plan management feature is no longer available in the
          admin panel.
        </p>
        <p className="text-text-muted">
          Use an owner account to access the new route: <strong>/owner/subscription-plans/manage</strong>.
        </p>
      </section>
    </div>
  );
}
