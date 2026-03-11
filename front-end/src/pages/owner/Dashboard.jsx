import React from "react";
import { useDashboardLogic } from "../../hooks/owner/useDashboardLogic";

// Components
import HeaderBar from "../../components/Owner/common/HeaderBar";
import StatWidget from "../../components/Owner/dashboard/StatWidget";
import SkeletonWidget from "../../components/Owner/dashboard/SkeletonWidget";
import HeroAction from "../../components/Owner/dashboard/HeroAction";
import DashButton from "../../components/Owner/dashboard/DashButton";
import AppointmentItem from "../../components/Owner/dashboard/AppointmentItem";
import DashboardSection from "../../components/Owner/dashboard/DashboardSection";
import RecentTransactions from "../../components/Owner/dashboard/RecentTransactions";
import RevenueChart from "../../components/Owner/dashboard/RevenueChart";

export default function Dashboard() {
  const { loading, stats, chartData, transactions, appointments, user } =
    useDashboardLogic();

  return (
    <div className="min-h-screen pb-12 bg-light/30">
      <HeaderBar
        title={`Welcome back, ${user.fullName || user.firstName}!`}
        subtitle="Here is your daily property overview."
        notificationCount={3}
        userAvatar={user.profileImageUrl || user.avatar}
        userName={user.firstName}
      />

      <div className="w-full px-4 py-8 space-y-8 sm:px-6 md:px-8">
        {/* 1. STATS ROW */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonWidget key={i} />)
          ) : (
            <>
              <StatWidget
                icon="fas fa-wallet"
                title="Total Earnings"
                mainValue={`$${stats.totalEarnings?.toLocaleString() || 0}`}
                subValue="Lifetime Revenue"
              />
              <StatWidget
                icon="fas fa-calendar-day"
                title="This Month"
                mainValue={`$${stats.monthlyEarnings?.toLocaleString() || 0}`}
                subValue="Revenue"
              />
              <StatWidget
                icon="fas fa-credit-card"
                title="Wallet Balance"
                mainValue={`$${stats.walletBalance?.toLocaleString() || 0}`}
                subValue="Available to Withdraw"
              />
              <StatWidget
                icon="fas fa-coins"
                title="Fees Paid"
                mainValue={`$${stats.totalPlatformFees?.toLocaleString() || 0}`}
                subValue="Platform Fees"
              />
            </>
          )}
        </div>

        {/* 2. MAIN LAYOUT */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="space-y-8 lg:col-span-2">
            {/* Chart Area */}
            <div className="bg-card-bg rounded-xl border border-light p-6 shadow-sm min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text">
                  Revenue Analytics
                </h3>
                <select className="text-xs font-bold tracking-wide uppercase rounded-lg outline-none border-light text-muted bg-light/30 focus:border-primary">
                  <option>This Year</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <RevenueChart data={chartData} />
              </div>
            </div>

            {/* Transactions Table */}
            <RecentTransactions transactions={transactions} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <HeroAction />

            <div className="p-5 border shadow-sm bg-card-bg rounded-xl border-light">
              <h3 className="mb-4 text-xs font-black tracking-widest uppercase text-muted/50">
                Management
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <DashButton
                  to="/ownerLayout/utility"
                  icon="fas fa-bolt"
                  label="Utility"
                />
                <DashButton
                  to="/ownerLayout/myAds"
                  icon="fas fa-eye"
                  label="View Ads"
                />
                <DashButton
                  to="/ownerLayout/payment"
                  icon="fas fa-credit-card"
                  label="Payments"
                />
                <DashButton
                  to="/ownerLayout/profile"
                  icon="fas fa-cog"
                  label="Settings"
                />
              </div>
            </div>

            <DashboardSection
              title="Appointments"
              badge={`${appointments.filter((a) => a.status === "PENDING").length} Pending`}
            >
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-light">
                {appointments.map((app) => (
                  <AppointmentItem key={app.id} appointment={app} />
                ))}

                {appointments.length === 0 && !loading && (
                  <div className="p-8 text-sm text-center text-muted">
                    No upcoming appointments
                  </div>
                )}
              </div>
            </DashboardSection>
          </div>
        </div>
      </div>
    </div>
  );
}
